import { IssuePriority } from "../../api/issues/issues.types"
import { cn, labelPriority } from "../../helpers/helpers"

export const PriorityChip = ({ priority }: { priority: IssuePriority }) => {
  const label = labelPriority(priority)
  const tone =
    priority === "high"
      ? "bg-danger/10 text-danger border-danger/30"
      : priority === "medium"
      ? "bg-secondary/10 text-secondary border-secondary/30"
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
