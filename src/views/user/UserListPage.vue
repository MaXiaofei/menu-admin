<template>
  <div class="warm-page">
    <section class="warm-header">
      <h2>账号管理</h2>
      <p class="warm-subtitle">账号、角色与状态维护（含手机号/邮箱）</p>
    </section>
    <section class="warm-header">
      <div class="warm-filter">
        <el-input v-model="query.username" placeholder="筛选账号" style="max-width: 180px" clearable />
        <el-input v-model="query.nickname" placeholder="筛选昵称" style="max-width: 180px" clearable />
        <el-select v-model="query.status" placeholder="状态" style="width: 140px" clearable>
          <el-option label="全部" :value="undefined" />
          <el-option label="启用" :value="1" />
          <el-option label="停用" :value="0" />
        </el-select>
        <el-button @click="resetQuery">重置</el-button>
        <el-button type="primary" @click="openCreate">新增账号</el-button>
      </div>
    </section>
    <section class="warm-table-wrap">
      <el-table v-loading="loading" :data="pagedRows" border empty-text="暂无账号数据">
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
          <template #default="{ row }">
            <el-space>
              <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
              <el-button link type="warning" @click="toggleStatus(row)">
                {{ row.status === 1 ? '禁用' : '启用' }}
              </el-button>
              <el-button link @click="resetPassword(row)">重置密码</el-button>
            </el-space>
          </template>
        </el-table-column>
      </el-table>
      <div class="warm-pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          layout="total, prev, pager, next, sizes"
          :total="filteredRows.length"
          :page-sizes="[5, 10, 20, 50]"
        />
      </div>
    </section>

    <el-dialog v-model="showDialog" :title="editingUserId ? '编辑账号' : '新增账号'" width="520px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" :disabled="Boolean(editingUserId)" />
        </el-form-item>
        <el-form-item label="昵称"><el-input v-model="form.nickname" /></el-form-item>
        <el-form-item label="手机号" prop="phone"><el-input v-model="form.phone" /></el-form-item>
        <el-form-item label="邮箱" prop="email"><el-input v-model="form.email" /></el-form-item>
        <el-form-item v-if="!editingUserId" label="密码" prop="password">
          <el-input v-model="form.password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitCreate">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  createAdminUser,
  listAdminUsers,
  resetAdminUserPassword,
  updateAdminUser,
  type AdminUser,
} from '../../api/admin-user'

const rows = ref<AdminUser[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const query = ref({
  username: '',
  nickname: '',
  status: undefined as number | undefined,
})
const loading = ref(false)
const submitLoading = ref(false)
const showDialog = ref(false)
const editingUserId = ref<number | null>(null)
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

const filteredRows = computed(() => {
  const usernameKeyword = query.value.username.trim().toLowerCase()
  const nicknameKeyword = query.value.nickname.trim().toLowerCase()
  return rows.value.filter((row) => {
    const usernameMatch = !usernameKeyword || row.username.toLowerCase().includes(usernameKeyword)
    const nicknameMatch = !nicknameKeyword || (row.nickname ?? '').toLowerCase().includes(nicknameKeyword)
    const statusMatch = query.value.status === undefined || row.status === query.value.status
    return usernameMatch && nicknameMatch && statusMatch
  })
})

const pagedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredRows.value.slice(start, start + pageSize.value)
})

function resetQuery() {
  query.value = {
    username: '',
    nickname: '',
    status: undefined,
  }
  currentPage.value = 1
}

function openCreate() {
  editingUserId.value = null
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

function openEdit(row: AdminUser) {
  editingUserId.value = row.id
  form.value = {
    username: row.username,
    nickname: row.nickname ?? '',
    phone: row.phone ?? '',
    email: row.email ?? '',
    password: '',
    roleIds: row.roleIds?.length ? row.roleIds : [1],
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
    if (editingUserId.value) {
      await updateAdminUser(editingUserId.value, {
        nickname: form.value.nickname,
        phone: form.value.phone,
        email: form.value.email,
        roleIds: form.value.roleIds.map((id) => Number(id)),
      })
      ElMessage.success('编辑账号成功')
    } else {
      await createAdminUser(form.value)
      ElMessage.success('新增账号成功')
    }
    showDialog.value = false
    await loadUsers()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '保存账号失败')
  } finally {
    submitLoading.value = false
  }
}

async function toggleStatus(row: AdminUser) {
  try {
    await updateAdminUser(row.id, {
      nickname: row.nickname ?? '',
      phone: row.phone ?? '',
      email: row.email ?? '',
      status: row.status === 1 ? 0 : 1,
      roleIds: row.roleIds?.length ? row.roleIds.map((id) => Number(id)) : [1],
    })
    ElMessage.success(row.status === 1 ? '账号已禁用' : '账号已启用')
    await loadUsers()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '更新账号状态失败')
  }
}

async function resetPassword(row: AdminUser) {
  try {
    await resetAdminUserPassword(row.id)
    ElMessage.success(`已将 ${row.username} 的密码重置为 123456`)
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '重置密码失败')
  }
}

onMounted(async () => {
  await loadUsers()
})
</script>

