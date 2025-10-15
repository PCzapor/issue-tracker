import { ERROR_TEXTS } from "@/helpers/constants"

export const ErrorState = ({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}) => {
  return (
    <div className='flex flex-col items-center gap-2 p-6 text-center'>
      <p className='text-sm text-red-600'>
        {ERROR_TEXTS.SOMETGING_WENT_WRONG} {message}
      </p>
      <button
        onClick={onRetry}
        className='inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-surface/60'
      >
        Try again
      </button>
    </div>
  )
}
