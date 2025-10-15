import { useEffect, useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Link, useSearchParams } from "react-router-dom"
import { issuesApi } from "../../api/issues/issues.api"
import {
  IssuePriority,
  IssueStatus,
  PAGE_SIZE,
  PRIORITIES,
  STATUSES,
} from "../../api/issues/issues.types"

import {
  EmptyState,
  ErrorState,
  ListSkeleton,
  PriorityChip,
  StatusChip,
  Select,
  AddIssueModal,
} from "../../components/ui"
import { issuesKeys } from "../../api/issues/issues.keys"
import { useModal } from "../../components/ui/Modal/ModalProvider"
import { Button } from "../../components/ui/Button"
import { labelOrder, labelPriority, labelStatus } from "../../helpers/helpers"
import { Pagination } from "@/components/ui/IssuesPagination"

export const IssuesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { show } = useModal()
  const page = Math.max(1, Number(searchParams.get("page") ?? 1))
  const order = (searchParams.get("order") === "asc" ? "asc" : "desc") as
    | "asc"
    | "desc"

  const status = useMemo<IssueStatus | undefined>(() => {
    const s = searchParams.get("status")
    return (STATUSES as string[]).includes(s ?? "")
      ? (s as IssueStatus)
      : undefined
  }, [searchParams])

  const priority = useMemo<IssuePriority | undefined>(() => {
    const p = searchParams.get("priority")
    return (PRIORITIES as string[]).includes(p ?? "")
      ? (p as IssuePriority)
      : undefined
  }, [searchParams])

  const qFromUrl = searchParams.get("q") ?? ""
  const [qInput, setQInput] = useState(qFromUrl)

  useEffect(() => {
    const t = setTimeout(() => {
      const next = new URLSearchParams(searchParams)
      if (qInput) next.set("q", qInput)
      else next.delete("q")
      next.set("page", "1")
      setSearchParams(next, { replace: true })
    }, 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qInput])

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: issuesKeys.issues({
      page,
      status,
      priority,
      q: qFromUrl,
      order,
    }),
    queryFn: () =>
      issuesApi.getIssues({
        page,
        limit: PAGE_SIZE,
        status,
        priority,
        q: qFromUrl || undefined,
        sort: "createdAt",
        order,
      }),
    staleTime: 60_000,
  })

  const items = data?.issues ?? []
  const updateParams = (
    next: Partial<Record<string, string | number | undefined>>
  ) => {
    const updated = new URLSearchParams(searchParams)
    Object.entries(next).forEach(([k, v]) => {
      if (v === undefined || v === "") updated.delete(k)
      else updated.set(k, String(v))
    })
    setSearchParams(updated)
  }

  return (
    <section className='mx-auto w-full max-w-6xl p-4 md:p-6'>
      <header className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <h2 className='text-xl font-semibold'>Issues</h2>

        <div className='flex flex-1 flex-wrap items-center gap-2 sm:justify-end'>
          <input
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
            placeholder='Search title or description…'
            className='h-9 w-full max-w-sm rounded-md border border-border bg-surface px-3 text-sm text-text outline-none focus:outline-2 focus:outline-primary'
          />
          <Select<IssueStatus>
            options={STATUSES}
            onChange={(next) =>
              updateParams({ status: next || undefined, page: 1 })
            }
            value={status}
            getLabel={labelStatus}
          />
          <Select<IssuePriority>
            options={PRIORITIES}
            onChange={(next) =>
              updateParams({ priority: next || undefined, page: 1 })
            }
            value={priority}
            getLabel={labelPriority}
          />
          <Select<"asc" | "desc">
            options={["asc", "desc"]}
            onChange={(next) =>
              updateParams({ order: next || undefined, page: 1 })
            }
            value={order}
            getLabel={labelOrder}
          />

          <Button
            variant='default'
            onClick={() => show("Add Issue", <AddIssueModal />)}
          >
            New Issue
          </Button>
        </div>
      </header>

      <div className='rounded-xl border border-border bg-surface'>
        {isPending ? (
          <ListSkeleton length={10} />
        ) : isError ? (
          <ErrorState
            message={(error as Error).message}
            onRetry={() => refetch()}
          />
        ) : items.length === 0 ? (
          <EmptyState
            hasFilters={!!(status || priority || qFromUrl)}
            onClear={() => setSearchParams({})}
          />
        ) : (
          <ul role='list' className='divide-y divide-border'>
            {items.map((item) => (
              <li
                key={item.id}
                className='flex items-center justify-between gap-3 p-3'
              >
                <div className='min-w-0'>
                  <Link
                    to={`/issues/${item.id}`}
                    className='truncate text-sm font-medium text-primary hover:underline'
                  >
                    {item.title}
                  </Link>
                  <div className='mt-1 flex flex-wrap items-center gap-2 text-xs text-muted'>
                    <StatusChip status={item.status} />
                    <PriorityChip priority={item.priority} />
                    <span className='text-slate-500'>
                      updated {new Date(item.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Link
                  to={`/issues/${item.id}`}
                  className='inline-flex h-8 items-center rounded-md border border-border px-2 text-xs hover:bg-surface/60'
                >
                  Details →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {!isPending && !isError && items.length > 0 && (
        <Pagination
          page={page}
          itemsCount={data.totalCount}
          updateParams={updateParams}
        />
      )}
    </section>
  )
}
