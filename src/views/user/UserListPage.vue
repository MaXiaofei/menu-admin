<template>
  <div class="warm-page">
    <section class="warm-header">
      <h2>账号管理</h2>
      <p class="warm-subtitle">账号、角色与状态维护（含手机号/邮箱）</p>
    </section>
    <section class="warm-header">
      <div class="warm-filter">
        <el-input placeholder="筛选账号" style="max-width: 180px" />
        <el-input placeholder="筛选昵称" style="max-width: 180px" />
        <el-select placeholder="状态" style="width: 140px">
          <el-option label="全部" value="" />
          <el-option label="启用" :value="1" />
          <el-option label="停用" :value="0" />
        </el-select>
        <el-button>重置</el-button>
        <el-button type="primary" @click="openCreate">新增账号</el-button>
      </div>
    </section>
    <section class="warm-table-wrap">
      <el-table v-loading="loading" :data="rows" border empty-text="暂无账号数据">
        <el-table-column prop="username" label="账号" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240">
          <template #default>
            <el-space>
              <el-button link type="primary">编辑</el-button>
              <el-button link type="warning">禁用</el-button>
              <el-button link>重置密码</el-button>
            </el-space>
          </template>
        </el-table-column>
      </el-table>
    </section>

    <el-dialog v-model="showDialog" title="新增账号" width="520px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="账号" prop="username"><el-input v-model="form.username" /></el-form-item>
        <el-form-item label="昵称"><el-input v-model="form.nickname" /></el-form-item>
        <el-form-item label="手机号" prop="phone"><el-input v-model="form.phone" /></el-form-item>
        <el-form-item label="邮箱" prop="email"><el-input v-model="form.email" /></el-form-item>
        <el-form-item label="密码" prop="password"><el-input v-model="form.password" show-password /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitCreate">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { createAdminUser, listAdminUsers, type AdminUser } from '../../api/admin-user'

const rows = ref<AdminUser[]>([])
const loading = ref(false)
const submitLoading = ref(false)
const showDialog = ref(false)
const form = ref({
  username: '',
  nickname: '',
  phone: '',
  email: '',
  password: '',
  roleIds: [1],
})
const formRef = ref<FormInstance>()
const rules: FormRules<typeof form.value> = {
  username: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
  phone: [{ pattern: /^1\d{10}$/, message: '手机号格式不正确', trigger: 'blur' }],
  email: [{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }],
}

function openCreate() {
  form.value = {
    username: '',
    nickname: '',
    phone: '',
    email: '',
    password: '',
    roleIds: [1],
  }
  formRef.value?.clearValidate()
  showDialog.value = true
}

async function loadUsers() {
  loading.value = true
  try {
    rows.value = await listAdminUsers()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '加载账号失败')
  } finally {
    loading.value = false
  }
}

async function submitCreate() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }
  submitLoading.value = true
  try {
    await createAdminUser(form.value)
    ElMessage.success('新增账号成功')
    showDialog.value = false
    await loadUsers()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '新增账号失败')
  } finally {
    submitLoading.value = false
  }
}

onMounted(async () => {
  await loadUsers()
})
</script>

