import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it } from 'vitest'
import { useAuthStore } from './auth'

describe('auth store', () => {
  it('stores access token after login', () => {
    setActivePinia(createPinia())
    const store = useAuthStore()
    store.setSession({
      accessToken: 'token-1',
      refreshToken: 'refresh-1',
      expiresIn: 7200,
      permissions: ['dish:list'],
      clientScopes: ['admin'],
    })
    expect(store.accessToken).toBe('token-1')
    expect(store.clientScopes).toContain('admin')
  })
})

