import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import ElementPlus from 'element-plus'
import DishListPage from './DishListPage.vue'

const { listDishesMock } = vi.hoisted(() => ({
  listDishesMock: vi.fn(async () => []),
}))

vi.mock('../../api/dish', () => ({
  listDishes: listDishesMock,
  createDish: vi.fn(async () => undefined),
  updateDish: vi.fn(async () => undefined),
}))

describe('dish list page', () => {
  it('renders create button and status options', async () => {
    const wrapper = mount(DishListPage, {
      global: {
        plugins: [ElementPlus],
      },
    })
    await nextTick()
    expect(listDishesMock).toHaveBeenCalledTimes(1)
    expect(wrapper.text()).toContain('新增菜品')
    expect(wrapper.text()).toContain('状态')
  })
})
