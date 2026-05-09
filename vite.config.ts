import vue from '@vitejs/plugin-vue'
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    // 避免扫描历史 git worktree 副本，防止与根目录 src 重复跑同一套用例
    exclude: [...configDefaults.exclude, '**/.worktrees/**'],
  },
})

