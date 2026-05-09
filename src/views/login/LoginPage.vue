<template>
  <div class="login-shell">
    <section class="warm-header">
      <h2>烟火小食单管理后台</h2>
      <p class="warm-subtitle">Batch1 管理端登录（A 版业务优先）</p>
    </section>
    <form class="login-form warm-header" @submit.prevent="onSubmit">
      <input v-model="form.username" class="login-input" placeholder="账号" />
      <input v-model="form.password" class="login-input" type="password" placeholder="密码" />
      <select v-model="form.clientType" class="login-input">
        <option value="admin">管理后台</option>
      </select>
      <button class="login-button" type="submit">登录</button>
      <p v-if="errorMessage" class="login-error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../../api/auth'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const errorMessage = ref('')
const DEFAULT_BATCH1_PERMISSIONS = [
  'dish:list',
  'ingredient:list',
  'auth-user:list',
  'auth-role:list',
  'auth-permission:list',
  'auth-scope:list',
]
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
      permissions: session.permissions?.length ? session.permissions : DEFAULT_BATCH1_PERMISSIONS,
      clientScopes: session.clientScopes ?? ['admin'],
    })
    await router.replace('/dishes')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '登录失败'
  }
}
</script>

<style scoped>
.login-shell {
  max-width: 420px;
  margin: 72px auto;
  display: grid;
  gap: 12px;
}

.login-form {
  display: grid;
  gap: 12px;
}

.login-input {
  border: 1px solid #d6d3d1;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  min-height: 40px;
}

.login-button {
  border: 1px solid rgba(124, 45, 18, 0.2);
  background: #fed7aa;
  color: #7c2d12;
  border-radius: 8px;
  min-height: 40px;
  font-weight: 700;
  cursor: pointer;
}

.login-button:hover {
  background: #fdba74;
}

.login-error {
  color: #b91c1c;
  margin: 0;
  font-size: 13px;
}
</style>

