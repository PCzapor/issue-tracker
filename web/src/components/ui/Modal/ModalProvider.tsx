import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import { createPortal } from "react-dom"
import { Button } from ".."

type ModalContextValue = {
  show: (modalTitle: string, content: ReactNode) => void
  hide: () => void
}

const ModalContext = createContext<ModalContextValue | null>(null)
export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<ReactNode>(null)
  const [modalTitle, setModalTitle] = useState<ReactNode>(null)

  const show = useCallback((modalTitle: string, c: ReactNode) => {
    setContent(c)
    setModalTitle(modalTitle)
  }, [])
  const hide = useCallback(() => setContent(null), [])
  const value = useMemo(() => ({ show, hide }), [show, hide])

  return (
    <ModalContext.Provider value={value}>
      {children}
      {content &&
        createPortal(
          <div
            role='dialog'
            aria-modal='true'
            className='fixed inset-0 z-50 grid place-items-center bg-black/40 p-4'
          >
            <div className='w-full max-w-lg rounded-xl border border-border bg-surface shadow-xl'>
              <header className='flex items-center justify-between border-b border-border p-4'>
                <h3 className='text-lg font-semibold'>{modalTitle}</h3>
                <Button
                  variant='default'
                  onClick={hide}
                  className='bg-red-400 hover:bg-red-400/80'
                >
                  ✕
                </Button>
              </header>

              {content}
            </div>
          </div>,
          document.body
        )}
    </ModalContext.Provider>
  )
}
export const useModal = () => {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error("useModal error")
  return ctx
}
