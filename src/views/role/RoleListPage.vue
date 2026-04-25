<template>
  <div class="warm-page">
    <section class="warm-header">
      <h2>角色管理</h2>
      <p class="warm-subtitle">角色创建、备注维护与权限入口</p>
    </section>
    <section class="warm-header">
      <div class="warm-filter">
        <el-input v-model="query.keyword" placeholder="筛选角色名（模糊）" style="max-width: 240px" clearable />
        <el-button @click="resetQuery">重置</el-button>
        <el-button type="primary" @click="openCreate">新增角色</el-button>
      </div>
    </section>
    <section class="warm-table-wrap">
      <el-table v-loading="loading" :data="pagedRows" border empty-text="暂无角色数据">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="角色名" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作" width="220">
          <template #default="{ row }">
            <el-space>
              <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
              <el-button link type="warning">配置权限</el-button>
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

    <el-dialog v-model="showDialog" :title="editingRoleId ? '编辑角色' : '新增角色'" width="460px">
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
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { createAdminRole, listAdminRoles, updateAdminRole, type AdminRole } from '../../api/admin-role'

const rows = ref<AdminRole[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const query = ref({ keyword: '' })
const loading = ref(false)
const submitLoading = ref(false)
const showDialog = ref(false)
const editingRoleId = ref<number | null>(null)
const form = ref({
  name: '',
  remark: '',
})
const formRef = ref<FormInstance>()
const rules: FormRules<typeof form.value> = {
  name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
}

const filteredRows = computed(() => {
  const keyword = query.value.keyword.trim().toLowerCase()
  if (!keyword) {
    return rows.value
  }
  return rows.value.filter((row) => row.name.toLowerCase().includes(keyword))
})

const pagedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredRows.value.slice(start, start + pageSize.value)
})

function resetQuery() {
  query.value.keyword = ''
  currentPage.value = 1
}

function openCreate() {
  editingRoleId.value = null
  form.value = {
    name: '',
    remark: '',
  }
  formRef.value?.clearValidate()
  showDialog.value = true
}

function openEdit(row: AdminRole) {
  editingRoleId.value = row.id
  form.value = {
    name: row.name,
    remark: row.remark ?? '',
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
    if (editingRoleId.value) {
      await updateAdminRole(editingRoleId.value, form.value)
      ElMessage.success('编辑角色成功')
    } else {
      await createAdminRole(form.value)
      ElMessage.success('新增角色成功')
    }
    showDialog.value = false
    await loadRoles()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '保存角色失败')
  } finally {
    submitLoading.value = false
  }
}

onMounted(async () => {
  await loadRoles()
})
</script>

