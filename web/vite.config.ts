import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import tailwind from "@tailwindcss/vite"
import path from "path"

export default defineConfig({
  plugins: [react(), tailwind()],
  server: {
    proxy: {
      "/auth": { target: "http://127.0.0.1:8000" },
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ""),
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    css: true,
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
})
