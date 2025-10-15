import React, { ReactNode } from "react"

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  children?: ReactNode
  label?: string
}
export const Input = ({ children, label, ...rest }: InputProps) => {
  return (
    <label className='block text-md'>
      {label && <span className='mb-1 inline-block text-muted'>{label}</span>}
      <input
        {...rest}
        className='h-9 w-full rounded-md border border-border bg-surface px-3 text-sm text-text outline-none focus:outline-2 focus:outline-primary'
      >
        {children}
      </input>
    </label>
  )
}
