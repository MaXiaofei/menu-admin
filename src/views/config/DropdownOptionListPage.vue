<template>
  <div class="warm-page">
    <section class="warm-header">
      <h2>字典配置</h2>
      <p class="warm-subtitle">维护类型、状态、菜系等字典项</p>
    </section>
    <section class="warm-header">
      <div class="warm-filter">
        <el-input
          v-model="query.category"
          placeholder="分类编码精确筛选，如 MENU_TEMPLATE_TYPE"
          style="max-width: 280px"
          clearable
        />
        <el-input v-model="query.keyword" placeholder="编码/文案模糊查询" style="max-width: 220px" clearable />
        <el-button @click="resetQuery">重置</el-button>
        <el-button type="primary" @click="loadRows">查询</el-button>
        <el-button v-if="canCreate" type="primary" @click="openCreate">新增</el-button>
      </div>
    </section>
    <section class="warm-table-wrap">
      <el-table :data="pagedRows" border empty-text="暂无配置，请先执行库表 biz_dropdown_option 或点击新增">
        <el-table-column prop="id" label="ID" width="72" />
        <el-table-column prop="category" label="分类" min-width="160" />
        <el-table-column prop="optionCode" label="隐式值" width="120" />
        <el-table-column prop="optionLabel" label="展示文案" min-width="120" />
        <el-table-column prop="sortOrder" label="排序" width="72" />
        <el-table-column label="启用" width="80">
          <template #default="{ row }">{{ row.enabled === 1 ? '是' : '否' }}</template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="100" show-overflow-tooltip />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button v-if="canUpdate" link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button v-if="canDelete" link type="danger" @click="confirmDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="warm-pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          layout="total, prev, pager, next, sizes"
          :total="filteredRows.length"
          :page-sizes="[10, 20, 50, 100]"
        />
      </div>
    </section>

    <el-dialog v-model="showDialog" :title="editingId ? '编辑字典项' : '新增字典项'" width="560px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="分类编码" prop="category">
          <el-input v-model="form.category" placeholder="如 MENU_TEMPLATE_TYPE、DISH_STATUS、CUISINE" />
        </el-form-item>
        <el-form-item label="隐式值" prop="optionCode">
          <el-input v-model="form.optionCode" placeholder="与业务存储一致，如 1 或 chuancai" />
        </el-form-item>
        <el-form-item label="展示文案" prop="optionLabel">
          <el-input v-model="form.optionLabel" placeholder="展示给用户" />
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input-number v-model="form.sortOrder" :min="0" :max="9999" />
        </el-form-item>
        <el-form-item label="启用" prop="enabled">
          <el-select v-model="form.enabled">
            <el-option label="启用" :value="1" />
            <el-option label="停用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注"><el-input v-model="form.remark" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  createDropdownOption,
  deleteDropdownOption,
  listDropdownOptionsAdmin,
  updateDropdownOption,
  type DropdownOptionAdminRow,
} from '../../api/dropdown-option'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const canCreate = computed(() => authStore.permissions.includes('dropdown-option:create'))
const canUpdate = computed(() => authStore.permissions.includes('dropdown-option:update'))
const canDelete = computed(() => authStore.permissions.includes('dropdown-option:delete'))

const rows = ref<DropdownOptionAdminRow[]>([])
const showDialog = ref(false)
const submitLoading = ref(false)
const editingId = ref<number | null>(null)
const currentPage = ref(1)
const pageSize = ref(20)
const query = ref({ category: '', keyword: '' })
const formRef = ref<FormInstance>()
const form = reactive({
  category: '',
  optionCode: '',
  optionLabel: '',
  sortOrder: 0,
  enabled: 1,
  remark: '',
})
const rules: FormRules<typeof form> = {
  category: [{ required: true, message: '分类不能为空', trigger: 'blur' }],
  optionCode: [{ required: true, message: '隐式值不能为空', trigger: 'blur' }],
  optionLabel: [{ required: true, message: '展示文案不能为空', trigger: 'blur' }],
  sortOrder: [{ required: true, message: '排序不能为空', trigger: 'change' }],
  enabled: [{ required: true, message: '请选择启用状态', trigger: 'change' }],
}

const filteredRows = computed(() => {
  const kw = query.value.keyword.trim().toLowerCase()
  return rows.value.filter((row) => {
    if (!kw) return true
    const code = (row.optionCode ?? '').toLowerCase()
    const label = (row.optionLabel ?? '').toLowerCase()
    return code.includes(kw) || label.includes(kw)
  })
})

const pagedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredRows.value.slice(start, start + pageSize.value)
})

async function loadRows() {
  try {
    const cat = query.value.category.trim() || undefined
    rows.value = await listDropdownOptionsAdmin(cat)
    currentPage.value = 1
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '加载失败（请确认已建表 biz_dropdown_option）')
  }
}

function resetQuery() {
  query.value.category = ''
  query.value.keyword = ''
  loadRows()
}

function openCreate() {
  editingId.value = null
  Object.assign(form, {
    category: '',
    optionCode: '',
    optionLabel: '',
    sortOrder: 0,
    enabled: 1,
    remark: '',
  })
  formRef.value?.clearValidate()
  showDialog.value = true
}

function openEdit(row: DropdownOptionAdminRow) {
  editingId.value = row.id
  Object.assign(form, {
    category: row.category,
    optionCode: row.optionCode,
    optionLabel: row.optionLabel,
    sortOrder: row.sortOrder,
    enabled: row.enabled,
    remark: row.remark ?? '',
  })
  formRef.value?.clearValidate()
  showDialog.value = true
}

async function submitForm() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  submitLoading.value = true
  try {
    const payload = {
      category: form.category.trim(),
      optionCode: form.optionCode.trim(),
      optionLabel: form.optionLabel.trim(),
      sortOrder: form.sortOrder,
      enabled: form.enabled,
      remark: form.remark?.trim() || undefined,
    }
    if (editingId.value) {
      await updateDropdownOption(editingId.value, payload)
      ElMessage.success('更新成功')
    } else {
      await createDropdownOption(payload)
      ElMessage.success('新增成功')
    }
    showDialog.value = false
    await loadRows()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '保存失败')
  } finally {
    submitLoading.value = false
  }
}

async function confirmDelete(row: DropdownOptionAdminRow) {
  try {
    await ElMessageBox.confirm(`确定删除「${row.category} / ${row.optionCode}」？`, '删除确认', {
      type: 'warning',
    })
    await deleteDropdownOption(row.id)
    ElMessage.success('已删除')
    await loadRows()
  } catch (e) {
    if (e !== 'cancel') {
      ElMessage.error(e instanceof Error ? e.message : '删除失败')
    }
  }
}

onMounted(loadRows)
</script>
