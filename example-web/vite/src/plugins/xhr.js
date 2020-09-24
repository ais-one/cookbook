import { provide, inject } from 'vue'

const XhrSymbol = Symbol()

export function provideXhr(xhr) {
  provide(XhrSymbol, xhr)
}

export function useXhr() {
  const xhr = inject(XhrSymbol)
  if (!xhr) {
    // throw error, no xhr provided
  }
  return xhr
}