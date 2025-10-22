import { useMutation } from "@tanstack/react-query"
import { Button, FormInput, useModal } from ".."
import { LoginForm, loginSchema } from "@/helpers/zod.helpers"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { authApi } from "@/api/auth/auth.api"
import { RegisterModal } from "@/components/ui"
import { useAuth } from "@/components/ui/AuthProvider"

export const LoginModal = () => {
  const { show, hide } = useModal()
  const { setToken } = useAuth()

  const {
    register: regLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: errorsLogin, isSubmitting: isSubmittingLogin },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
    mode: "onSubmit",
  })

  const loginMut = useMutation({
    mutationFn: (body: LoginForm) => authApi.login(body),
    onSuccess: ({ accessToken }) => {
      setToken(accessToken)
      hide()
    },
  })

  return (
    <div className='relative mx-auto' style={{ perspective: "1200px" }}>
      <form
        className='p-4'
        onSubmit={handleSubmitLogin((values) => loginMut.mutate(values))}
      >
        <div className='space-y-3'>
          <FormInput<LoginForm>
            label='Username'
            name='username'
            register={regLogin}
            placeholder='yourname'
            error={errorsLogin.username?.message}
          />
          <FormInput<LoginForm>
            label='Password'
            name='password'
            register={regLogin}
            type='password'
            placeholder='••••••••'
            error={errorsLogin.password?.message}
          />

          {loginMut.isError && (
            <p className='text-sm text-red-500'>
              {(loginMut.error as Error)?.message}
            </p>
          )}
        </div>

        <footer className='mt-4 flex items-center justify-end gap-2 border-t border-border pt-4'>
          <Button
            variant='outline'
            onClick={() => {
              hide()
              show("Register", <RegisterModal />)
            }}
          >
            Register
          </Button>
          <Button
            type='submit'
            variant='default'
            isLoading={loginMut.isPending || isSubmittingLogin}
            disabled={loginMut.isPending || isSubmittingLogin}
          >
            Sign in
          </Button>
        </footer>
      </form>
    </div>
  )
}
