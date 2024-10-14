import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

declare global {
  interface Window {
    IS_REACT_ACT_ENVIRONMENT?: boolean
  }
}

Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', {
  get() {
    if (typeof globalThis.self !== 'undefined') {
      return (globalThis.self as any)._IS_REACT_ACT_ENVIRONMENT
    }
  },
  set(value) {
    if (typeof globalThis.self !== 'undefined') {
      ;(globalThis.self as any)._IS_REACT_ACT_ENVIRONMENT = value
    }
  },
})

globalThis.IS_REACT_ACT_ENVIRONMENT = true

afterEach(() => {
  cleanup()
})
