import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom"
import { Button } from "@/components/ui"
import { Link } from "react-router-dom"
import { ERROR_TEXTS } from "@/helpers/constants"

export const ErrorBoundaryUI = () => {
  const error = useRouteError()
  const navigate = useNavigate()

  const { title, message, status } = (() => {
    if (isRouteErrorResponse(error)) {
      return {
        status: error.status,
        title: `${error.status} ${error.statusText}`,
        message:
          typeof error.data === "string"
            ? error.data
            : (error.data?.message ?? ERROR_TEXTS.UNEXPECTED_ERROR),
      }
    }
    if (error instanceof Error) {
      return {
        status: 500,
        title: ERROR_TEXTS.APPLICATION_ERROR,
        message: error.message,
      }
    }
    return {
      status: 500,
      title: ERROR_TEXTS.UNKNOWN_ERROR,
      message: ERROR_TEXTS.SOMETGING_WENT_WRONG,
    }
  })()

  return (
    <section className='min-h-[70vh] grid place-items-center p-6'>
      <div className='text-center'>
        <span className='mb-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-muted'>
          {status}
        </span>
        <h1 className='text-2xl font-semibold'>{title}</h1>
        <p className='mt-2 text-sm text-muted'>{message}</p>

        {process.env.NODE_ENV !== "production" && (
          <pre className='mx-auto mt-3 max-w-xl overflow-auto rounded-lg bg-black/5 p-3 text-left text-xs text-gray-600'>
            {String((error as any)?.stack ?? "")}
          </pre>
        )}

        <div className='mt-4 flex items-center justify-center gap-2'>
          <Button variant='default' onClick={() => navigate(0)}>
            Try again
          </Button>
          <Button variant='outline' onClick={() => navigate(-1)}>
            ← Go back
          </Button>
          <Link
            to='/'
            className='inline-flex h-9 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90'
          >
            Go to Home
          </Link>
        </div>
      </div>
    </section>
  )
}
