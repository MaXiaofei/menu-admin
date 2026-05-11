<template>
  <div class="warm-page" v-loading="loading">
    <section class="warm-header">
      <h2>权限配置</h2>
      <p class="warm-subtitle">按角色配置 API 权限点</p>
    </section>
    <section class="warm-header">
      <el-form inline class="warm-filter">
        <el-form-item label="角色">
          <el-select v-model="roleId" style="width: 220px" placeholder="请选择角色">
            <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id" />
          </el-select>
        </el-form-item>
        <el-button type="primary" :disabled="!roleId" :loading="submitLoading" @click="onBind">保存授权</el-button>
      </el-form>
    </section>
    <section class="warm-header">
      <el-transfer
        v-model="selectedPermissionIds"
        :data="transferData"
        filterable
        filter-placeholder="搜索权限"
        :titles="['可选权限', '已选权限']"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { bindRolePermissions, listAdminRoles, type AdminRole } from '../../api/admin-role'
import { listPermissionPoints, type PermissionPoint } from '../../api/admin-permission'

const roleId = ref<number | undefined>(undefined)
const permissions = ref<PermissionPoint[]>([])
const roles = ref<AdminRole[]>([])
const selectedPermissionIds = ref<number[]>([])
const loading = ref(false)
const submitLoading = ref(false)

const transferData = ref<Array<{ key: number; label: string }>>([])

async function onBind() {
  if (!roleId.value) {
    ElMessage.warning('请先选择角色')
    return
  }
  submitLoading.value = true
  try {
    await bindRolePermissions(roleId.value, selectedPermissionIds.value)
    ElMessage.success('权限保存成功')
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '保存权限失败')
  } finally {
    submitLoading.value = false
  }
}

onMounted(async () => {
  loading.value = true
  try {
    ;[permissions.value, roles.value] = await Promise.all([listPermissionPoints(), listAdminRoles()])
    transferData.value = permissions.value.map((item) => ({
      key: item.id,
      label: `${item.code} - ${item.name}`,
    }))
    if (roles.value.length > 0) {
      roleId.value = roles.value[0].id
    }
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '加载权限配置失败')
  } finally {
    loading.value = false
  }
})
</script>

