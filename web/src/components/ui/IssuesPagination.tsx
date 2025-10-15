import { PAGE_SIZE } from "../../api/issues/issues.types"
import { Button } from "./Button"

export const Pagination = ({
  page,
  itemsCount,
  updateParams,
}: {
  page: number
  itemsCount: number
  updateParams: (next: Record<string, string | number | undefined>) => void
}) => {
  const totalPages = Math.max(1, Math.ceil(itemsCount / PAGE_SIZE))
  return (
    <nav className='mt-4 flex items-center justify-between'>
      <Button
        disabled={page <= 1}
        variant='outline'
        onClick={() => updateParams({ page: Math.max(1, page - 1) })}
      >
        ← Prev
      </Button>

      <p className='text-sm text-slate-500'>
        Page <strong>{page}</strong> / {totalPages} • {itemsCount} total
      </p>

      <Button
        disabled={page >= totalPages}
        variant='outline'
        onClick={() => updateParams({ page: Math.min(totalPages, page + 1) })}
      >
        Next →
      </Button>
    </nav>
  )
}
