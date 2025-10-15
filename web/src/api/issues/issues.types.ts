export type IssueStatus = "open" | "in_progress" | "closed"
export type IssuePriority = "low" | "medium" | "high"
export const STATUSES: IssueStatus[] = ["open", "in_progress", "closed"]
export const PRIORITIES: IssuePriority[] = ["low", "medium", "high"]
export const PAGE_SIZE = 10

export type ApiResponse<T> = {
  data: T
  headers: Headers
  status: number
  code: number
  message: string
}

export type IssuesQuery = {
  page?: number
  limit?: number
  status?: IssueStatus
  priority?: IssuePriority
  q?: string
  sort?: "createdAt"
  order?: "asc" | "desc"
}

export type Issue = {
  id: number
  title: string
  description: string
  status: IssueStatus
  priority: IssuePriority
  createdAt: string
  updatedAt: string
  comments: Comment[]
}

export type Comment = {
  id: number
  issueId: number
  body: string
  createdAt: string
}
export type CommentPayload = { body: string }

export type IssuesResponse = {
  issues: Issue[]
  comments?: Comment[]
  totalCount: number
}
export type CreateIssuePayload = {
  title: string
  description: string
  status: string
  priority: string
  createdAt: string | Date
}
export type UpdateIssuePayload = Omit<CreateIssuePayload, "createdAt"> & {
  updatedAt: string | Date
}
export type BasicApiResponse = {
  Code: number
  Message: string | null
  DisplayToEndUser: boolean
}
export type CreateIssueResponse = BasicApiResponse & {
  id: number
}
