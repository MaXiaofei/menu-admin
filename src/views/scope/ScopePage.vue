<template>
  <div class="warm-page" v-loading="loading">
    <section class="warm-header">
      <h2>端权限范围</h2>
      <p class="warm-subtitle">配置角色可访问端：管理后台 / 小程序</p>
    </section>
    <section class="warm-header">
      <el-form inline class="warm-filter">
        <el-form-item label="角色">
          <el-select v-model="roleId" style="width: 220px" placeholder="请选择角色" @change="loadScopes">
            <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id" />
          </el-select>
        </el-form-item>
      </el-form>
    </section>
    <section class="warm-header">
      <p class="warm-subtitle" style="margin-bottom: 8px">角色访问范围开关（保存后立即生效）</p>
      <el-checkbox-group v-model="scopes">
        <el-checkbox value="admin">管理后台</el-checkbox>
        <el-checkbox value="mini">小程序</el-checkbox>
      </el-checkbox-group>
    </section>
    <section class="warm-header">
      <el-button type="primary" :disabled="!roleId" :loading="submitLoading" @click="onSave">保存范围</el-button>
    </section>
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

