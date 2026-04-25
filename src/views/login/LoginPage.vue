<template>
  <div style="max-width: 360px; margin: 80px auto; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial">
    <h2>烟火小食单管理后台</h2>
    <form @submit.prevent="onSubmit" style="display: grid; gap: 12px">
      <input v-model="form.username" placeholder="账号" />
      <input v-model="form.password" type="password" placeholder="密码" />
      <select v-model="form.clientType">
        <option value="admin">管理后台</option>
      </select>
      <button type="submit">登录</button>
      <p v-if="errorMessage" style="color: #b91c1c">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { login } from '../../api/auth'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const errorMessage = ref('')
const form = reactive({
  username: '',
  password: '',
  clientType: 'admin' as const,
})

async function onSubmit() {
  errorMessage.value = ''
  try {
    const session = await login(form)
    authStore.setSession({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      expiresIn: session.expiresIn,
      permissions: session.permissions ?? [],
      clientScopes: session.clientScopes ?? ['admin'],
    })
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '登录失败'
  }
}
</script>

