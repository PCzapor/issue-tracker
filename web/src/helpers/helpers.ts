import { IssuePriority, IssueStatus } from "../api/issues/issues.types"
import { ORDER_LABELS, PRIORITY_LABELS, STATUS_LABELS } from "./constants"
import { twMerge } from "tailwind-merge"
import clsx from "clsx"

export function cn(...parts: Array<string | false | undefined>) {
  return twMerge(clsx(parts))
}
function toTitle(value: string) {
  return value.replace(/[_-]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())
}

export function labelStatus(s: IssueStatus | string): string {
  return (STATUS_LABELS as Record<string, string>)[s] ?? toTitle(s)
}

export function labelPriority(p: IssuePriority | string): string {
  return (PRIORITY_LABELS as Record<string, string>)[p] ?? toTitle(p)
}
export function labelOrder(o: "asc" | "desc"): string {
  return (ORDER_LABELS as Record<string, string>)[o] ?? toTitle(o)
}
export function formatDateDDMMYYYY(iso: string) {
  const d = new Date(iso)
  const day = String(d.getDate()).padStart(2, "0")
  const month = String(d.getMonth() + 1).padStart(2, "0") // 0-11
  const year = d.getFullYear()
  return `${day}-${month}-${year}`
}
