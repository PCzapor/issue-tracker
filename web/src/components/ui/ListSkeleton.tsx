export const ListSkeleton = ({ length = 6 }: { length: number }) => {
  return (
    <ul className='animate-pulse divide-y divide-border'>
      {Array.from({ length }).map((_, i) => (
        <li key={i} className='p-3'>
          <div className='h-4 w-1/2 rounded bg-slate-200/70' />
          <div className='mt-2 flex gap-2'>
            <div className='h-3 w-20 rounded bg-slate-200/60' />
            <div className='h-3 w-16 rounded bg-slate-200/60' />
          </div>
        </li>
      ))}
    </ul>
  )
}
