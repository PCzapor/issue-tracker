import { tokenStore } from "@/api/token.store"
import { createContext, useContext, useEffect, useState } from "react"

type AuthCtx = { token: string | null; setToken: (t: string | null) => void }
const AuthContext = createContext<AuthCtx | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    tokenStore.set(token)
    return () => {
      tokenStore.clear()
    }
  }, [token])

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("Auth provider error")
  return ctx
}
