import { Button } from "./Button"

export const EmptyState = ({
  hasFilters,
  onClear,
}: {
  hasFilters: boolean
  onClear: () => void
}) => {
  return (
    <div className='flex flex-col items-center gap-2 p-6 text-center'>
      <p className='text-sm text-slate-600'>
        {hasFilters ? "No issues match your filters." : "No issues yet."}
      </p>
      {hasFilters && (
        <Button onClick={onClear} variant='default'>
          Clear filters
        </Button>
      )}
    </div>
  )
}
