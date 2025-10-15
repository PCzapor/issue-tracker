import { useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { useForm, Controller, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { useModal } from "./ModalProvider"
import { Button } from "../Button"
import { ErrorState } from ".."
import { FormInput } from "../FormInput"
import { FormTextArea } from "../FormTextArea"
import { Select } from "../Select"

import { z } from "zod"
import { createIssueSchema } from "@/helpers/zod.helpers"
import {
  CreateIssuePayload,
  IssuePriority,
  IssueStatus,
  PRIORITIES,
  STATUSES,
} from "@/api/issues/issues.types"
import { issuesApi } from "@/api/issues/issues.api"
import { labelPriority, labelStatus } from "@/helpers/helpers"

type CreateIssueForm = z.input<typeof createIssueSchema>

export const AddIssueModal = () => {
  const { hide } = useModal()
  const qc = useQueryClient()
  const navigate = useNavigate()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateIssueForm>({
    resolver: zodResolver(createIssueSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "open",
      priority: "medium",
      createdAt: new Date().toISOString(),
    },
    mode: "onSubmit",
  })

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (payload: CreateIssuePayload) => issuesApi.createIssue(payload),
    onSuccess: (created) => {
      qc.invalidateQueries({ queryKey: ["issues"] })
      hide()
      // navigate(`/issues/${created.id}`)
    },
  })

  const onSubmit: SubmitHandler<CreateIssueForm> = (values) => {
    const payload: CreateIssuePayload = {
      title: values.title ?? "",
      description: values.description ?? "",
      status: values.status as IssueStatus,
      priority: values.priority as IssuePriority,
      createdAt: new Date().toISOString(),
    }
    mutate(payload)
  }

  useEffect(() => () => reset(), [reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='space-y-3 p-4'>
        {isError && (
          <ErrorState message={(error as Error).message} onRetry={() => {}} />
        )}

        <FormInput<CreateIssueForm>
          label='Title'
          name='title'
          register={register}
          placeholder='Short summary…'
          error={errors.title?.message}
          aria-invalid={!!errors.title || undefined}
        />

        <FormTextArea<CreateIssueForm>
          label='Description'
          name='description'
          register={register}
          rows={4}
          error={errors.description?.message}
          placeholder='Details, steps to reproduce, expected behavior…'
        />

        <div className='flex flex-wrap gap-2'>
          <Controller
            control={control}
            name='status'
            render={({ field }) => (
              <Select<IssueStatus>
                value={field.value}
                onChange={(v) => field.onChange(v ?? "open")}
                options={STATUSES}
                getLabel={labelStatus}
                placeholder='Status: Any'
                className='min-w-[10rem]'
              />
            )}
          />
          <Controller
            control={control}
            name='priority'
            render={({ field }) => (
              <Select<IssuePriority>
                value={field.value}
                onChange={(v) => field.onChange(v ?? "medium")}
                options={PRIORITIES}
                getLabel={labelPriority}
                placeholder='Priority: Any'
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
          isLoading={isPending || isSubmitting}
          disabled={isPending || isSubmitting}
        >
          Create
        </Button>
      </footer>
    </form>
  )
}
