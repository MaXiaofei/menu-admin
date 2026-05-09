import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import ElementPlus from 'element-plus'
import IngredientListPage from './IngredientListPage.vue'

const { listIngredientsMock } = vi.hoisted(() => ({
  listIngredientsMock: vi.fn(async () => []),
}))

vi.mock('../../api/ingredient', () => ({
  listIngredients: listIngredientsMock,
  createIngredient: vi.fn(async () => undefined),
  updateIngredient: vi.fn(async () => undefined),
}))

describe('ingredient list page', () => {
  it('renders create button and loads rows on mount', async () => {
    const wrapper = mount(IngredientListPage, {
      global: {
        plugins: [ElementPlus],
      },
    })
    await nextTick()
    expect(listIngredientsMock).toHaveBeenCalledTimes(1)
    expect(wrapper.text()).toContain('新增食材')
    expect(wrapper.text()).toContain('食材管理')
  })
})
