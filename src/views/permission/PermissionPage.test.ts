import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import PermissionPage from './PermissionPage.vue'

const { listPermissionPointsMock } = vi.hoisted(() => ({
  listPermissionPointsMock: vi.fn(async () => [{ id: 1, code: 'dish:create', name: '新增菜品' }]),
}))

vi.mock('../../api/admin-permission', () => ({
  listPermissionPoints: listPermissionPointsMock,
}))

vi.mock('../../api/admin-role', () => ({
  listAdminRoles: vi.fn(async () => [{ id: 1, name: '管理员', remark: '默认' }]),
  bindRolePermissions: vi.fn(async () => undefined),
}))

describe('permission page', () => {
  it('loads permissions on mount', async () => {
    const wrapper = mount(PermissionPage, {
      global: {
        directives: {
          loading: () => undefined,
        },
        stubs: {
          'el-space': true,
          'el-page-header': true,
          'el-form': true,
          'el-form-item': true,
          'el-select': true,
          'el-option': true,
          'el-transfer': true,
          'el-button': true,
        },
      },
    })
    await nextTick()
    await nextTick()
    expect(wrapper.exists()).toBe(true)
    expect(listPermissionPointsMock).toHaveBeenCalledTimes(1)
  })
})

