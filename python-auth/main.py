from datetime import datetime, timedelta, timezone
from typing import Optional
import os

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Depends, HTTPException, status, Response, Cookie
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import create_engine, Column, Integer, String, select
from sqlalchemy.orm import sessionmaker, declarative_base, Session
import jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from messaging import PikaPublisher


JWT_ACCESS_SECRET   = os.getenv("JWT_ACCESS_SECRET", "dev_access")
JWT_REFRESH_SECRET  = os.getenv("JWT_REFRESH_SECRET", "dev_refresh")
ACCESS_EXPIRES_MIN  = int(os.getenv("ACCESS_EXPIRES_MIN", "15"))
REFRESH_EXPIRES_DAYS= int(os.getenv("REFRESH_EXPIRES_DAYS", "7"))
DATABASE_URL        = os.getenv("DATABASE_URL", "postgresql+psycopg://auth:authpass@127.0.0.1:5433/authdb")
RT_COOKIE_NAME      = "rt"
AMQP_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@127.0.0.1:5672/")
AMQP_EXCHANGE = os.getenv("AMQP_EXCHANGE", "auth.events")

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()
pwd = PasswordHasher()

class User(Base):
    __tablename__ = 'users'
    id= Column(Integer, primary_key=True, autoincrement=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    refresh_token_hash = Column(String, nullable=True)

Base.metadata.create_all(bind=engine)

class AuthDto(BaseModel):
    username: str = Field(min_length=3)
    password: str = Field(min_length=3)

class TokenOut(BaseModel):
    accessToken:str

def create_access(sub:int,username:str)->str:
    payload= {
        'sub':sub, 'username':username,'type':'access',
        'exp':datetime.now(timezone.utc) + timedelta(minutes=ACCESS_EXPIRES_MIN)
    }
    return jwt.encode(payload, JWT_ACCESS_SECRET, algorithm='HS256')

def create_refresh(sub:int, username:str)->str:
    payload={
        'sub':sub, 'username':username,'type':'refresh',
        'exp':datetime.now(timezone.utc) + timedelta(days=REFRESH_EXPIRES_DAYS)
    }
    return jwt.encode(payload, JWT_REFRESH_SECRET, algorithm='HS256')

def set_rt_cookie(resp:Response, token:str):
    resp.set_cookie(key=RT_COOKIE_NAME, value=token, httponly=True,
    secure=False,
    samesite='strict',path='/auth',
    max_age=REFRESH_EXPIRES_DAYS*24*3600
    )

def clear_rt_cookie(resp:Response):
    resp.delete_cookie(RT_COOKIE_NAME, path='/auth')

app = FastAPI(title='python-auth')
@app.on_event('startup')
def _startup():
    app.state.publisher = PikaPublisher(AMQP_URL, AMQP_EXCHANGE)
    try:
        app.state.publisher.connect()
    except Exception as e:
        print("AMQP connect failed:", e)

@app.on_event("shutdown")
def _shutdown():
    pub = getattr(app.state, "publisher", None)
    if pub:
        pub.close()


origins = [o.strip() for o in os.getenv("CORS_ORIGINS", "").split(",") if o.strip()]
app.add_middleware(CORSMiddleware,allow_origins=origins or ['http"://localhost:5173, "http://localhost:3000'],
                   allow_credentials=True,allow_methods=['*'],allow_headers=["*"]
                   )

def get_db():
    db:Session = SessionLocal()
    try:yield db
    finally:db.close()

@app.post('/auth/register', response_model=TokenOut)
def register(dto:AuthDto, resp:Response, db:Session=Depends(get_db)):
    exists = db.execute(select(User).where(User.username==dto.username)).scalar_one_or_none()
    if exists:
        raise HTTPException(status_code=409, detail={'code':'USERNAME_TAKEN','message':'Username already taken'})
    u = User(username=dto.username, password_hash=pwd.hash(dto.password))
    db.add(u);db.commit();db.refresh(u)

    at = create_access(u.id,u.username)
    rt = create_refresh(u.id, u.username)
    u.refresh_token_hash = pwd.hash(rt);db.commit()
    app.state.publisher.publish('user.registered', {'id':u.id, 'username':u.username,'time':datetime.now(timezone.utc).isoformat()})

    set_rt_cookie(resp, rt)
    return {'accessToken':at}

@app.post('/auth/login', response_model=TokenOut)
def login(dto:AuthDto, resp:Response, db:Session=Depends(get_db)):
    u= db.execute(select(User).where(User.username==dto.username)).scalar_one_or_none()
    if not u:
        raise HTTPException(status_code=401, detail={'code':'INVALID_CREDENTIALS', 'message':'Invalid python credentials'})
    try:
        pwd.verify(u.password_hash,dto.password)
    except VerifyMismatchError:
        raise HTTPException(status_code=401, detail={'code':'INVALID_CREDENTIALS', 'message':'Invalid python credentials'})
    
    at = create_access(u.id,u.username)
    rt = create_refresh(u.id, u.username)
    u.refresh_token_hash = pwd.hash(rt);db.commit()

    app.state.publisher.publish('user.logged_in', {'id':u.id, 'username':u.username,'time':datetime.now(timezone.utc).isoformat()})

    set_rt_cookie(resp, rt)

    return {'accessToken':at}

@app.post("/auth/refresh", response_model=TokenOut)
def refresh(resp:Response, db:Session=Depends(get_db), rt_cookie:Optional[str]=Cookie(None, alias=RT_COOKIE_NAME)):
    if not rt_cookie:
        raise HTTPException(status_code=401,detail={"code":'NO_RT','message':'No refresh token'})
    try:
        payload = jwt.decode(rt_cookie,JWT_REFRESH_SECRET, algorithms=["HS256"])
    except jwt.PyJWKError:
        raise HTTPException(status_code=401, detail={'code':"INVALID_RT",'message':"Invalid RT"})
    if payload.get('type') != 'refresh':
        raise HTTPException(status_code=401, detail={'code':"WRONG_TYPE",'message':"Wrong token type"})
    
    uid = int(payload['sub'])
    u = db.execute(select(User).where(User.id == uid)).scalar_one_or_none()
    if not u or not u.refresh_token_hash:
        raise HTTPException(status_code=401, detail={'code':"NO_SESSION",'message':"Wrong active session"})
    try:
        pwd.verify(u.refresh_token_hash, rt_cookie)
    except VerifyMismatchError:
        raise HTTPException(status_code=401, detail={'code':"RT_MISSMATCH",'message':"Invalid refresh token"})
    
    at = create_access(u.id,u.username)
    rt = create_refresh(u.id, u.username)
    u.refresh_token_hash = pwd.hash(rt);db.commit()
    set_rt_cookie(resp,rt)
    return {'accessToken': at}

@app.post("/auth/logout")
def logout(resp:Response):
    clear_rt_cookie(resp)
    return {'ok':True}

    