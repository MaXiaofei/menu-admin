<template>
  <div v-loading="loading">
    <el-space direction="vertical" fill style="width: 100%">
      <el-page-header content="端范围配置" />
      <el-form inline>
        <el-form-item label="角色">
          <el-select v-model="roleId" style="width: 220px" placeholder="请选择角色" @change="loadScopes">
            <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <el-checkbox-group v-model="scopes">
        <el-checkbox value="admin">管理后台</el-checkbox>
        <el-checkbox value="mini">小程序</el-checkbox>
      </el-checkbox-group>
      <el-button type="primary" :disabled="!roleId" :loading="submitLoading" @click="onSave">保存范围</el-button>
    </el-space>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getRoleScopes, listAdminRoles, type AdminRole, updateRoleScopes } from '../../api/admin-role'

const roleId = ref<number | undefined>(undefined)
const scopes = ref<string[]>([])
const roles = ref<AdminRole[]>([])
const loading = ref(false)
const submitLoading = ref(false)

async function loadScopes() {
  if (!roleId.value) {
    scopes.value = []
    return
  }
  loading.value = true
  try {
    scopes.value = await getRoleScopes(roleId.value)
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '加载端范围失败')
  } finally {
    loading.value = false
  }
}

async function onSave() {
  if (!roleId.value) {
    ElMessage.warning('请先选择角色')
    return
  }
  submitLoading.value = true
  try {
    await updateRoleScopes(roleId.value, scopes.value)
    ElMessage.success('端范围保存成功')
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '保存端范围失败')
  } finally {
    submitLoading.value = false
  }
}

onMounted(async () => {
  loading.value = true
  try {
    roles.value = await listAdminRoles()
    if (roles.value.length > 0) {
      roleId.value = roles.value[0].id
      await loadScopes()
    }
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '加载角色失败')
  } finally {
    loading.value = false
  }
})
</script>

