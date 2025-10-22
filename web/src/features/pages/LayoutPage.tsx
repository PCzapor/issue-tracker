import { Outlet } from "react-router-dom"
import { Header, ModalProvider } from "@/components/ui"
export const Layout = () => {
  return (
    <div>
      <Header />

      <main>
        <Outlet />
      </main>
    </div>
  )
}
