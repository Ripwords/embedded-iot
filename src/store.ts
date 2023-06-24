import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export const store = defineStore('store', {
  state: () => ({
    user: {} as any,
    GOOGLE_SIGN_IN: false,
    data: {} as any,
    position: "top" as "top" | "bottom" | "middle",
    uptimeFormat: useStorage('uptimeFormat', false),
  }),
  actions: {
    resetState() {
      this.user = {}
      this.data = {}
    }
  }
})