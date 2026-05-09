import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import UserListPage from './UserListPage.vue'
import { nextTick } from 'vue'

import { vi } from 'vitest'

const { listAdminUsersMock } = vi.hoisted(() => ({
  listAdminUsersMock: vi.fn(async () => []),
}))

vi.mock('../../api/admin-user', () => ({
  listAdminUsers: listAdminUsersMock,
  createAdminUser: vi.fn(async () => 1),
}))

describe('user list page', () => {
  it('loads users on mount', async () => {
    const wrapper = mount(UserListPage, {
      global: {
        directives: {
          loading: () => undefined,
        },
        stubs: {
          'el-space': true,
          'el-page-header': true,
          'el-button': true,
          'el-select': true,
          'el-option': true,
          'el-table': true,
          'el-table-column': true,
          'el-pagination': true,
          'el-tag': true,
          'el-dialog': true,
          'el-form': true,
          'el-form-item': true,
          'el-input': true,
        },
      },
    })
    await nextTick()
    expect(wrapper.exists()).toBe(true)
    expect(listAdminUsersMock).toHaveBeenCalledTimes(1)
  })
})

