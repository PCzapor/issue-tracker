import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import * as argon2 from 'argon2';

type JwtPayload = { sub: number; username: string };

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  private signAccessToken(user: { id: number; username: string }) {
    const payload: JwtPayload = { sub: user.id, username: user.username };
    return this.jwt.signAsync(payload);
  }

  async register(dto: { username: string; password: string }) {
    const exists = await this.prisma.users.findUnique({
      where: { username: dto.username },
    });
    if (exists) throw new ConflictException('Username already taken');

    const hash = await argon2.hash(dto.password);
    const user = await this.prisma.users.create({
      data: { username: dto.username, password: hash },
      select: { id: true, username: true },
    });

    return { accessToken: await this.signAccessToken(user) };
  }

  async login(dto: { username: string; password: string }) {
    const user = await this.prisma.users.findUnique({
      where: { username: dto.username },
    });
    if (!user) throw new UnauthorizedException('Invalid nest credentials');

    const ok = await argon2.verify(user.password, dto.password);
    if (!ok) throw new UnauthorizedException('Invalid nest credentials');

    return { accessToken: await this.signAccessToken(user) };
  }

  async me(userId: number) {
    return this.prisma.users.findUnique({
      where: { id: userId },
      select: { id: true, username: true },
    });
  }

  async changePassword(userId: number, current: string, next: string) {
    const user = await this.prisma.users.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await argon2.verify(user.password, current);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const nextHash = await argon2.hash(next);
    await this.prisma.users.update({
      where: { id: userId },
      data: { password: nextHash },
    });

    return { changed: true };
  }
}
