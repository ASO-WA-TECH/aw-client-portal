import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/vitest'
globalThis.jest = vi
// runs a clean after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
})