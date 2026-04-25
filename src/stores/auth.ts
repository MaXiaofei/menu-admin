import { defineStore } from 'pinia'

export interface LoginSession {
  accessToken: string
  refreshToken: string
  expiresIn: number
  permissions: string[]
  clientScopes: string[]
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: '',
    refreshToken: '',
    expiresIn: 0,
    permissions: [] as string[],
    clientScopes: [] as string[],
  }),
  actions: {
    setSession(payload: LoginSession) {
      this.accessToken = payload.accessToken
      this.refreshToken = payload.refreshToken
      this.expiresIn = payload.expiresIn
      this.permissions = payload.permissions
      this.clientScopes = payload.clientScopes
    },
    clearSession() {
      this.accessToken = ''
      this.refreshToken = ''
      this.expiresIn = 0
      this.permissions = []
      this.clientScopes = []
    },
  },
})

