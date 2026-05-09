<template>
  <div class="warm-app-shell" style="display: flex; min-height: 100vh">
    <AppSidebar />
    <main style="flex: 1; padding: 16px; display: grid; gap: 12px">
      <header class="warm-header" style="display: flex; justify-content: space-between; align-items: center">
        <div>
          <h3 style="margin: 0; color: #7c2d12">烟火小食单管理后台</h3>
          <p class="warm-subtitle">Batch1 / A版业务优先导航</p>
        </div>
        <div style="display: flex; align-items: center; gap: 10px; font-size: 13px; color: #7c2d12">
          <span>当前用户：admin</span>
          <el-button size="small" @click="onLogout">退出</el-button>
        </div>
      </header>
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import AppSidebar from '../components/AppSidebar.vue'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

async function onLogout() {
  authStore.clearSession()
  await router.replace('/login')
}
</script>

