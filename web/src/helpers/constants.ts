import { IssuePriority, IssueStatus } from "../api/issues/issues.types"

export const STATUS_LABELS: Record<IssueStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  closed: "Closed",
}

export const PRIORITY_LABELS: Record<IssuePriority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
}
export const ORDER_LABELS: Record<"desc" | "asc", string> = {
  desc: "Newest first",
  asc: "Oldest first",
}
export const ERROR_TEXTS = {
  UNKNOWN_ERROR: "Unknown error, try again later.",
  APPLICATION_ERROR: "Application Error, try again later.",
  UNEXPECTED_ERROR: "Unexcpected Error, try again later.",
  SOMETGING_WENT_WRONG: "something went wrong.",
}
