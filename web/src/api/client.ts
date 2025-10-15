import { useAuth } from "@/components/ui"
import { ApiResponse } from "./issues/issues.types"
import { tokenStore } from "./token.store"

export class HttpError extends Error {
  status: number
  statusText: string
  body?: unknown
  constructor(status: number, statusText: string, body?: unknown) {
    super(`HTTP ${status} ${statusText}`)
    this.name = "HttpError"
    this.status = status
    this.statusText = statusText
    this.body = body
  }
}
async function request<T>(
  path: string,
  init: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers = new Headers(init.headers)

  const token = tokenStore.get()
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  if (!headers.has("Accept")) headers.set("Accept", "application/json")
  if (init.body && !headers.has("Content-Type"))
    headers.set("Content-Type", "application/json")

  const res = await fetch(path, {
    // cache: import.meta.env.DEV ? "no-store" : init.cache,
    ...init,
    headers,
  })
  const isNoContent =
    res.status === 204 ||
    res.headers.get("content-length") === "0" ||
    res.headers.get("content-type") === null

  const parseBody = async () => {
    const ct = res.headers.get("content-type") || ""
    if (isNoContent) return undefined
    if (ct.includes("application/json")) return (await res.json()) as unknown
    return (await res.text()) as unknown
  }
  const data = (await parseBody()) as T

  if (!res.ok) throw new HttpError(res.status, res.statusText, data)

  return {
    data,
    headers: res.headers,
    status: res.status,
    code: res.status,
    message: res.statusText,
  }
}

export const api = {
  get<T>(path: string, init?: Omit<RequestInit, "method" | "body">) {
    console.log("init", init)
    return request<T>(path, { ...init, method: "GET" })
  },
  post<T>(path: string, data?: T, init?: Omit<RequestInit, "method">) {
    return request(path, {
      ...init,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  },
  put(path: string, data?: unknown, init?: Omit<RequestInit, "method">) {
    return request(path, {
      ...init,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  },
  patch(path: string, data?: unknown, init?: Omit<RequestInit, "method">) {
    return request(path, {
      ...init,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
  },
  delete<T = void>(path: string, init?: Omit<RequestInit, "method" | "body">) {
    return request<T>(path, { ...init, method: "DELETE" })
  },
}
