import { Button } from "@/components/ui"
import { Link, useNavigate } from "react-router-dom"

export const NotFound = () => {
  const navigate = useNavigate()
  return (
    <section className='min-h-[70vh] grid place-items-center p-6'>
      <div className='text-center'>
        <span className='inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-muted mb-2'>
          404
        </span>
        <h1 className='text-2xl font-semibold'>Page not found</h1>
        <p className='mt-2 text-sm text-muted'>
          The page you’re looking for doesn’t exist or was moved.
        </p>

        <div className='mt-4 flex items-center justify-center gap-2'>
          <Button variant='default' onClick={() => navigate(-1)}>
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
