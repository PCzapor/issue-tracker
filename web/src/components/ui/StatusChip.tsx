import { IssueStatus } from "../../api/issues/issues.types"
import { cn, labelStatus } from "../../helpers/helpers"

export const StatusChip = ({ status }: { status: IssueStatus }) => {
  const label = labelStatus(status)
  const tone =
    status === "open"
      ? "bg-primary/10 text-primary border-primary/30"
      : status === "in_progress"
      ? "bg-warning/10 text-warning border-warning/30"
      : "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
        tone
      )}
    >
      {label}
    </span>
  )
}
