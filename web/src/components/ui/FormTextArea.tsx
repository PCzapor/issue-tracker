import type { FieldValues, Path, UseFormRegister } from "react-hook-form"
type BaseTextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

type RHFTextAreaProps<T extends FieldValues> = Omit<
  BaseTextAreaProps,
  "name"
> & {
  label?: string
  name: Path<T>
  register: UseFormRegister<T>
  error?: string
}

export const FormTextArea = <T extends FieldValues>({
  label,
  name,
  register,
  error,
  ...rest
}: RHFTextAreaProps<T>) => {
  return (
    <label className='block text-md'>
      {label && <span className='mb-1 inline-block text-muted'>{label}</span>}
      <textarea
        {...register(name)}
        {...rest}
        className='w-full rounded-md border border-border bg-surface p-3 text-sm text-text outline-none focus:outline-2 focus:outline-primary'
      />
      {error && <p className='mt-1 text-xs text-red-600'>{error}</p>}
    </label>
  )
}
