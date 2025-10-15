import React, { useMemo } from "react"

type SelectProps<T> = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "onChange" | "value"
> & {
  value?: T
  onChange?: (value?: T) => void
  options: readonly T[]
  getLabel: (value: T) => string
  placeholder?: string
}

export const Select = <T,>({
  value,
  onChange,
  options,
  getLabel,
  placeholder = "any",
  className,
  ...rest
}: SelectProps<T>) => {
  const stringValue = value === undefined ? "" : String(value)

  const map = useMemo(() => {
    const m = new Map<string, T>()
    for (const opt of options) m.set(String(opt), opt)
    return m
  }, [options])

  return (
    <select
      value={stringValue}
      onChange={(e) => {
        const v = e.target.value
        if (v === "") {
          onChange?.(undefined)
        } else {
          onChange?.(map.get(v))
        }
      }}
      className='h-9 rounded-md border border-border bg-surface px-2 text-sm text-text focus:outline-2 focus:outline-primary'
      {...rest}
    >
      {placeholder && <option value=''>{placeholder}</option>}
      {options.map((o) => (
        <option key={String(o)} value={String(o)}>
          {getLabel(o)}
        </option>
      ))}
    </select>
  )
}
