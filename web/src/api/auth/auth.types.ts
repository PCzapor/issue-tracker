export type Mode = "login" | "register"

export type LoginPayload = {
  username: string
  password: string
}
export type LoginResponse = {
  accessToken: string
}
export type RegisterPayload = {
  username: string
  password: string
}
export type RegisterResponse = LoginResponse
