import { useEffect } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useParams, useNavigate } from "react-router-dom"
import { useForm, Controller, type SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { useModal } from "./ModalProvider"
import { Button } from "../Button"
import { ErrorState } from ".."
import { FormInput } from "../FormInput"
import { FormTextArea } from "../FormTextArea"
import { Select } from "../Select"

import { issuesApi } from "@/api/issues/issues.api"
import { issuesKeys } from "@/api/issues/issues.keys"
import {
  STATUSES,
  PRIORITIES,
  type IssueStatus,
  type IssuePriority,
  type UpdateIssuePayload,
} from "@/api/issues/issues.types"
import { labelPriority, labelStatus } from "@/helpers/helpers"

const editIssueSchema = z.object({
  title: z.string().trim().min(3, "Min 3 znaki"),
  description: z.string().trim().default(""),
  status: z.enum(STATUSES as [(typeof STATUSES)[number], ...typeof STATUSES]),
  priority: z.enum(
    PRIORITIES as [(typeof PRIORITIES)[number], ...typeof PRIORITIES]
  ),
  updatedAt: z.string(),
})

type EditIssueForm = z.input<typeof editIssueSchema>

export const EditIssueModal = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { hide } = useModal()

  const { data, isPending, isError, error } = useQuery({
    queryKey: issuesKeys.issueById(String(id)),
    queryFn: () => issuesApi.getIssueById(String(id)),
    enabled: !!id,
  })

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<EditIssueForm>({
    resolver: zodResolver(editIssueSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "open",
      priority: "medium",
      updatedAt: new Date().toISOString(),
    },
    mode: "onSubmit",
  })

  useEffect(() => {
    if (!data) return
    reset({
      title: data.title ?? "",
      description: data.description ?? "",
      status: data.status ?? "open",
      priority: data.priority ?? "medium",
      updatedAt: new Date().toISOString(),
    })
  }, [data, reset])

  const { mutate, isPending: isSaving } = useMutation({
    mutationFn: (payload: UpdateIssuePayload) =>
      issuesApi.updateIssue(String(id), payload),
    onSuccess: (updated) => {
      // jeśli masz keys do invalidacji, zrób:
      // queryClient.invalidateQueries({ queryKey: issuesKeys.issueById(String(id)) })
      hide()
      navigate(`/issues/${id}`)
    },
  })

  const onSubmit: SubmitHandler<EditIssueForm> = (values) => {
    const payload: UpdateIssuePayload = {
      title: values.title ?? "",
      description: values.description ?? "",
      status: values.status as IssueStatus,
      priority: values.priority as IssuePriority,
      updatedAt: values.updatedAt,
    }

    mutate(payload)
  }

  if (isPending) {
    return <div className='p-4 text-sm text-muted'>Loading issue…</div>
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='space-y-3 p-4'>
        {isError && (
          <ErrorState message={(error as Error).message} onRetry={() => {}} />
        )}

        <FormInput<EditIssueForm>
          label='Edit Title'
          name='title'
          register={register}
          placeholder='Short summary…'
          error={errors.title?.message as string | undefined}
          aria-invalid={!!errors.title || undefined}
        />

        <FormTextArea<EditIssueForm>
          label='Edit description'
          name='description'
          register={register}
          rows={4}
          error={errors.description?.message as string | undefined}
          placeholder='Details, steps to reproduce, expected behavior…'
        />

        <div className='flex flex-wrap gap-2'>
          <Controller
            control={control}
            name='priority'
            render={({ field }) => (
              <Select<IssuePriority>
                value={field.value}
                onChange={(v) => field.onChange(v ?? "medium")}
                options={PRIORITIES}
                getLabel={labelPriority}
                placeholder='Priority'
                className='min-w-[10rem]'
              />
            )}
          />

          <Controller
            control={control}
            name='status'
            render={({ field }) => (
              <Select<IssueStatus>
                value={field.value}
                onChange={(v) => field.onChange(v ?? "open")}
                options={STATUSES}
                getLabel={labelStatus}
                placeholder='Status'
                className='min-w-[10rem]'
              />
            )}
          />
        </div>
      </div>

      <footer className='flex items-center justify-end gap-2 border-t border-border p-4'>
        <Button variant='outline' type='button' onClick={hide}>
          Cancel
        </Button>
        <Button
          variant='default'
          type='submit'
          isLoading={isSaving || isSubmitting}
          disabled={isSaving || isSubmitting}
        >
          Save
        </Button>
      </footer>
    </form>
  )
}
