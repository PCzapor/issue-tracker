import { api } from "../client"
import {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from "./auth.types"

const login = async (payload: LoginPayload) => {
  const response = await api.post<LoginPayload>(`/api/auth/login`, payload)

  return response.data as LoginResponse
}
const register = async (payload: RegisterPayload) => {
  const response = await api.post<RegisterPayload>(
    `/api/auth/register`,
    payload
  )

  return response.data as RegisterResponse
}
export const authApi = {
  login,
  register,
}
