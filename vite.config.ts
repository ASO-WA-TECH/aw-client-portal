import { defineConfig, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/aw-client-portal",
  plugins: [react()],
  test: {
    // 👋 add the line below to add jsdom to vite
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.ts', // assuming the test folder is in the root of our project
  }
} as UserConfig)