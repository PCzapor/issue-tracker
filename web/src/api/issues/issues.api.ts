import { api } from "../client"
import {
  ApiResponse,
  CommentPayload,
  CreateIssuePayload,
  Issue,
  IssuesQuery,
  IssuesResponse,
  PAGE_SIZE,
  UpdateIssuePayload,
} from "./issues.types"

function toQuerys(querry: Record<string, unknown>) {
  const sp = new URLSearchParams()
  Object.entries(querry).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return
    sp.set(k, String(v))
  })
  const search = sp.toString()
  return search ? `?${search}` : ""
}

const getIssues = async (params: IssuesQuery = {}): Promise<IssuesResponse> => {
  const page = params.page ?? 1
  const limit = params.limit ?? PAGE_SIZE

  const qs = toQuerys({
    page,
    limit,
    status: params.status,
    priority: params.priority,
    q: params.q,
    sort: params.sort ?? "createdAt",
    order: params.order ?? "asc",
  })
  const response = await api.get<Issue[]>(`/api/issues/${qs}`)
  const totalCount = Number(response.headers.get("X-Total-Count")) || 0
  return {
    issues: response.data,
    totalCount,
  }
}
const getIssueById = async (params: string) => {
  const response: ApiResponse<Issue> = await api.get(`/api/issues/${params}`)

  const issue = response.data
  return issue
}
const createIssue = async (payload: CreateIssuePayload) => {
  const response = await api.post<CreateIssuePayload>(`/api/issues/`, payload)

  return response.data
}
const createComment = async (payload: CommentPayload, id: string) => {
  const response = await api.post<CommentPayload>(
    `/api/issues/${id}/comment`,
    payload
  )

  return response.data
}
const updateIssue = async (id: string, payload: UpdateIssuePayload) => {
  const response = await api.patch(`/api/issues/${id}`, payload)

  return response.data
}
export const issuesApi = {
  getIssues,
  getIssueById,
  createIssue,
  updateIssue,
  createComment,
}
