import { Link, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  Button,
  EditIssueModal,
  ErrorState,
  ListSkeleton,
  PriorityChip,
  StatusChip,
  useModal,
  TextArea,
} from "@/components/ui"
import { issuesApi } from "../../api/issues/issues.api"
import { issuesKeys } from "../../api/issues/issues.keys"
import { formatDateDDMMYYYY } from "@/helpers/helpers"
import { CommentPayload } from "@/api/issues/issues.types"
import { useState } from "react"

export const IssueDetailsPage = () => {
  const [newComment, setNewComment] = useState<string>("")
  const { id } = useParams<{ id: string }>()
  const { show } = useModal()
  const queryClient = useQueryClient()

  const { data, isPending, isError, error } = useQuery({
    queryKey: issuesKeys.issueById(String(id)),
    queryFn: () => issuesApi.getIssueById(String(id)),
    enabled: !!id,
    staleTime: 60_000,
  })

  const { mutate, isPending: isCommentPending } = useMutation({
    mutationFn: (body: CommentPayload) =>
      issuesApi.createComment(body, String(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: issuesKeys.issueById(String(id)),
      })
      setNewComment("")
    },
  })
  const comments = data?.comments ?? []

  return (
    <section className='mx-auto w-full max-w-3xl p-4 md:p-6'>
      <header className='mb-4 flex items-center justify-between'>
        <h2 className='truncate text-xl font-semibold'>Issue details</h2>
        <div className='flex gap-2'>
          <Link
            to='/'
            className='inline-flex h-9 items-center rounded-md border border-border px-3 text-sm hover:bg-surface/60'
          >
            ← Back
          </Link>
          <Button
            variant='outline'
            onClick={() => show("Edit Modal", <EditIssueModal />)}
          >
            Edit
          </Button>
        </div>
      </header>

      <div className='rounded-xl border border-border bg-surface'>
        {isPending ? (
          <div className='p-4'>
            <ListSkeleton length={4} />
          </div>
        ) : isError ? (
          <ErrorState message={error.message} onRetry={() => {}} />
        ) : !data ? (
          <div className='p-6 text-center text-sm text-muted'>
            Issue not found.
          </div>
        ) : (
          <>
            <article className='p-4'>
              <h3 className='text-lg font-semibold'>{data.title}</h3>

              <div className='mt-2 flex flex-wrap items-center gap-2 text-xs text-muted'>
                <StatusChip status={data.status} />
                <PriorityChip priority={data.priority} />
                <span className='text-slate-500'>
                  created {new Date(data.createdAt).toLocaleDateString()}
                </span>
                <span className='text-slate-500'>
                  • updated {new Date(data.updatedAt).toLocaleDateString()}
                </span>
              </div>

              {data.description && (
                <div className='prose prose-sm mt-4 max-w-none dark:prose-invert'>
                  <p>{data.description}</p>
                </div>
              )}
            </article>
          </>
        )}
      </div>
      <article className='mt-4'>
        <h3 className='text-lg font-semibold'>Comment section</h3>
        <div className='gap-1 flex flex-col'>
          {comments.map((comment) => (
            <div
              className='px-5 py-4 rounded-xl bg-surface border  border-border'
              key={comment.id}
            >
              <div className='mb-1 text-xs text-gray-500'>
                {formatDateDDMMYYYY(comment.createdAt)}
              </div>
              <p className='text-sm leading-relaxed'>{comment.body}</p>
            </div>
          ))}
        </div>
        <div className='mt-2'>
          <TextArea
            value={newComment}
            minLength={10}
            placeholder='Add your comment here...'
            maxLength={500}
            rows={4}
            onChange={(e) => {
              setNewComment(e.target.value)
            }}
          />
          <Button
            className='float-right'
            disabled={isCommentPending}
            aria-disabled={isCommentPending}
            onClick={() => mutate({ body: newComment })}
          >
            Add comment
          </Button>
        </div>
      </article>
    </section>
  )
}
