import App from "./App"
import { render, screen } from "@testing-library/react"
it("renders heading", () => {
  render(<App />)
  expect(screen.getByRole("heading", { name: /hello/i })).toBeInTheDocument()
})
