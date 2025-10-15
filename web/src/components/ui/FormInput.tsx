import type { FieldValues, Path, UseFormRegister } from "react-hook-form"

type BaseInputProps = React.InputHTMLAttributes<HTMLInputElement>

type RHFInputProps<T extends FieldValues> = Omit<BaseInputProps, "name"> & {
  label?: string
  name: Path<T>
  register: UseFormRegister<T>
  error?: string
}

export const FormInput = <T extends FieldValues>({
  label,
  name,
  register,
  error,
  ...rest
}: RHFInputProps<T>) => {
  return (
    <label className='block text-md'>
      {label && <span className='mb-1 inline-block text-muted'>{label}</span>}
      <input
        {...register(name)}
        {...rest}
        className='h-9 w-full rounded-md border border-border bg-surface px-3 text-sm text-text outline-none focus:outline-2 focus:outline-primary'
      />
      {error && <p className='mt-1 text-xs text-red-600'>{error}</p>}
    </label>
  )
}
