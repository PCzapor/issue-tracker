import { Link } from "react-router-dom"
import { Button, useModal } from "./"
import { LoginModal } from "./Modal/LoginModal"
import { RegisterModal } from "./Modal/RegisterModal"

export const Header = () => {
  const { show } = useModal()
  return (
    <section className='sticky top-0 w-full bg-blue-400 h-[60px] grid grid-cols-3 items-center px-4'>
      <div />
      <Link to={"/"}>
        <h1 className='text-center text-white text-lg font-semibold justify-self-center'>
          Header
        </h1>
      </Link>
      <div className='justify-self-end flex gap-2'>
        <Button
          onClick={() => show("Login", <LoginModal />)}
          className='bg-amber-500'
        >
          Login
        </Button>
        <Button
          onClick={() => show("Register", <RegisterModal />)}
          variant='outline'
        >
          Register
        </Button>
      </div>
    </section>
  )
}
