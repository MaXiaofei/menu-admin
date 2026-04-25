<template>
  <div class="warm-page">
    <section class="warm-header">
      <h2>角色管理</h2>
      <p class="warm-subtitle">角色创建、备注维护与权限入口</p>
    </section>
    <section class="warm-header">
      <div class="warm-filter">
        <el-input placeholder="筛选角色名" style="max-width: 240px" />
        <el-button>查询</el-button>
        <el-button type="primary" @click="openCreate">新增角色</el-button>
      </div>
    </section>
    <section class="warm-table-wrap">
      <el-table v-loading="loading" :data="rows" border empty-text="暂无角色数据">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="角色名" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作" width="220">
          <template #default>
            <el-space>
              <el-button link type="primary">编辑</el-button>
              <el-button link type="warning">配置权限</el-button>
            </el-space>
          </template>
        </el-table-column>
      </el-table>
    </section>

    <el-dialog v-model="showDialog" title="新增角色" width="460px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="备注"><el-input v-model="form.remark" /></el-form-item>
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
import { createAdminRole, listAdminRoles, type AdminRole } from '../../api/admin-role'

const rows = ref<AdminRole[]>([])
const loading = ref(false)
const submitLoading = ref(false)
const showDialog = ref(false)
const form = ref({
  name: '',
  remark: '',
})
const formRef = ref<FormInstance>()
const rules: FormRules<typeof form.value> = {
  name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
}

function openCreate() {
  form.value = {
    name: '',
    remark: '',
  }
  formRef.value?.clearValidate()
  showDialog.value = true
}

async function loadRoles() {
  loading.value = true
  try {
    rows.value = await listAdminRoles()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '加载角色失败')
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
    await createAdminRole(form.value)
    ElMessage.success('新增角色成功')
    showDialog.value = false
    await loadRoles()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '新增角色失败')
  } finally {
    submitLoading.value = false
  }
}

onMounted(async () => {
  await loadRoles()
})
</script>

