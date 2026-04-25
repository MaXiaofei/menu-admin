import { describe, expect, it } from 'vitest'
import { canAccessRoute } from '../utils/permission'

describe('route permission guard', () => {
  it('redirects to login when client scope misses admin', () => {
    const canAccess = canAccessRoute(['dish:list'], [], {
      permission: 'dish:list',
      clientType: 'admin',
    })
    expect(canAccess).toBe(false)
  })
})

