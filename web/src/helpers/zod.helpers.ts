import { z } from "zod"
import { PRIORITIES, STATUSES } from "../api/issues/issues.types"

export const toZodEnum = <T extends readonly [string, ...string[]]>(vals: T) =>
  z.enum(vals)

const StatusEnum = toZodEnum(
  STATUSES as [(typeof STATUSES)[number], ...typeof STATUSES]
)
const PriorityEnum = toZodEnum(
  PRIORITIES as [(typeof PRIORITIES)[number], ...typeof PRIORITIES]
)

const baseIssueSchema = z.object({
  title: z.string().trim().min(3, "Min 3 characters"),
  description: z.string().trim().default(""),
  status: StatusEnum.default("open"),
  priority: PriorityEnum.default("medium"),
})

export const createIssueSchema = baseIssueSchema.extend({
  createdAt: z.string(),
})
export type CreateIssueSchema = z.infer<typeof createIssueSchema>

export const editIssueSchema = baseIssueSchema.extend({
  updatedAt: z.string(),
})
export type EditIssueSchema = z.infer<typeof editIssueSchema>

export const loginSchema = z.object({
  username: z.string().trim().min(3, "Min 3 characters"),
  password: z.string().min(8, "Min 8 characters"),
})

export const registerSchema = loginSchema
  .extend({
    confirmPassword: z.string().min(8, "Min 8 characters"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type LoginForm = z.infer<typeof loginSchema>
export type RegisterForm = z.infer<typeof registerSchema>
