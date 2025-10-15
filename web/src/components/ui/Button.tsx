import React, { ButtonHTMLAttributes, ReactNode } from "react"
import { cn } from "@/helpers/helpers"

const variants = {
  default:
    "bg-primary text-primary-foreground hover:bg-primary/90 border border-transparent",
  outline:
    "bg-surface text-text border-[2px] border-border hover:border-border/80",
  link: "bg-transparent text-primary underline hover:no-underline border border-transparent px-1",
  ghost:
    "bg-transparent text-text hover:bg-surface/60 border border-transparent",
  destructive:
    "bg-danger text-white hover:bg-danger/90 border border-transparent",
} as const

type Variant = keyof typeof variants

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  isLoading?: boolean
  children: ReactNode
}

export const Button = ({
  variant = "default",
  className,
  children,
  isLoading = false,
  disabled,
  onClick,
  ...rest
}: ButtonProps) => {
  const isDisabled = disabled || isLoading

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (isDisabled) {
      e.preventDefault()
      return
    }
    onClick?.(e)
  }
  return (
    <button
      {...rest}
      onClick={handleClick}
      aria-busy={isLoading || undefined}
      className={cn(
        "relative inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium select-none hover:cursor-pointer",
        "focus:outline-none focus-visible:outline-2 focus-visible:outline-primary",
        "transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        variant === "link" && "h-auto py-0 align-baseline",
        className
      )}
    >
      {isLoading ? (
        <span className='absolute inset-0 grid place-items-center'>
          <svg
            fill='hsl(228, 97%, 42%)'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
            className='h-4 w-4'
          >
            <path
              d='M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z'
              opacity='.25'
              stroke='currentColor'
            />
            <path
              stroke='currentColor'
              d='M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z'
            >
              <animateTransform
                attributeName='transform'
                type='rotate'
                dur='0.75s'
                values='0 12 12;360 12 12'
                repeatCount='indefinite'
              />
            </path>
          </svg>
        </span>
      ) : null}
      {children}
    </button>
  )
}
