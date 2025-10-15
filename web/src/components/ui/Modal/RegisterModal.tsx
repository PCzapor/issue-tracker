import { useMutation } from "@tanstack/react-query"
import {
  Button,
  FormInput,
  LoginModal,
  useAuth,
  useModal,
} from "@/components/ui"
import { RegisterForm, registerSchema } from "@/helpers/zod.helpers"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { authApi } from "@/api/auth/auth.api"

export const RegisterModal = () => {
  const { show, hide } = useModal()
  const { setToken } = useAuth()

  const {
    register: regRegister,
    handleSubmit: handleSubmitRegister,
    formState: { errors: errorsRegister, isSubmitting: isSubmittingRegister },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", password: "", confirmPassword: "" },
    mode: "onSubmit",
  })

  const registerMut = useMutation({
    mutationFn: (body: RegisterForm) =>
      authApi.register({ username: body.username, password: body.password }),
    onSuccess: ({ accessToken }) => {
      setToken(accessToken)
      hide()
    },
  })

  return (
    <div className='relative mx-auto' style={{ perspective: "1200px" }}>
      <form
        className='p-4'
        onSubmit={handleSubmitRegister((values) => registerMut.mutate(values))}
      >
        <div className='space-y-3'>
          <FormInput<RegisterForm>
            label='Username'
            name='username'
            register={regRegister}
            placeholder='yourname'
            error={errorsRegister.username?.message}
          />
          <FormInput<RegisterForm>
            label='Password'
            name='password'
            register={regRegister}
            type='password'
            placeholder='min 8 characters'
            error={errorsRegister.password?.message}
          />
          <FormInput<RegisterForm>
            label='Confirm password'
            name='confirmPassword'
            register={regRegister}
            type='password'
            placeholder='repeat password'
            error={errorsRegister.confirmPassword?.message}
          />

          {registerMut.isError && (
            <p className='text-sm text-red-500'>
              {(registerMut.error as Error)?.message}
            </p>
          )}
        </div>

        <footer className='mt-4 flex items-center justify-end gap-2 border-t border-border pt-4'>
          <Button
            variant='outline'
            onClick={() => {
              hide()
              show("Login", <LoginModal />)
            }}
          >
            Login
          </Button>
          <Button
            type='submit'
            isLoading={registerMut.isPending || isSubmittingRegister}
            disabled={registerMut.isPending || isSubmittingRegister}
          >
            Create account
          </Button>
        </footer>
      </form>
    </div>
  )
}
