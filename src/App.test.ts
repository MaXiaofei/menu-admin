import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import App from './App.vue'

describe('App', () => {
  it('renders app title', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('烟火小食单管理后台')
  })
})

