import { IssuesQuery } from "./issues.types"

export const issuesKeys = {
  all: () => ["issues"],
  issues: (params: IssuesQuery) => [...issuesKeys.all(), params],
  issueById: (params: string) => [...issuesKeys.all(), "byId", params],
}
