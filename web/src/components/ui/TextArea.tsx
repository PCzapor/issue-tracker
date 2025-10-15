import React from "react"

type TextAreaProps = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> & {
  label?: string
}

export const TextArea = ({ label, ...rest }: TextAreaProps) => {
  return (
    <label className='block text-sm'>
      {label && <span className='mb-1 inline-block text-muted'>{label}</span>}
      <textarea
        {...rest}
        className='w-full rounded-md border border-border bg-surface p-3 text-sm text-text outline-none focus:outline-2 focus:outline-primary'
      />
    </label>
  )
}
