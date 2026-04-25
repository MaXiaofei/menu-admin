<template>
  <div class="warm-page">
    <section class="warm-header">
      <h2>食材管理</h2>
      <p class="warm-subtitle">维护食材基础信息与营养字段</p>
    </section>
    <section class="warm-header">
      <div class="warm-filter">
        <el-input v-model="query.keyword" placeholder="按食材名/单位模糊查询" style="max-width: 260px" clearable />
        <el-button @click="resetQuery">重置</el-button>
        <el-button type="primary" @click="openCreate">新增食材</el-button>
      </div>
    </section>
    <section class="warm-table-wrap">
      <el-table :data="pagedRows" border empty-text="暂无食材数据">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="食材" />
        <el-table-column prop="unit" label="单位" />
        <el-table-column prop="caloriesKcalPer100g" label="热量" />
        <el-table-column prop="giValue" label="GI" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
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

    <el-dialog v-model="showDialog" :title="editingId ? '编辑食材' : '新增食材'" width="520px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="食材名" prop="name"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="单位" prop="unit"><el-input v-model="form.unit" /></el-form-item>
        <el-form-item label="热量">
          <el-input-number v-model="form.caloriesKcalPer100g" :min="0" />
        </el-form-item>
        <el-form-item label="GI">
          <el-input-number v-model="form.giValue" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { createIngredient, listIngredients, updateIngredient, type Ingredient } from '../../api/ingredient'

const rows = ref<Ingredient[]>([])
const showDialog = ref(false)
const submitLoading = ref(false)
const editingId = ref<number | null>(null)
const currentPage = ref(1)
const pageSize = ref(10)
const query = ref({
  keyword: '',
})
const form = ref({
  name: '',
  unit: '',
  caloriesKcalPer100g: 0,
  giValue: 0,
})
const formRef = ref<FormInstance>()
const rules: FormRules<typeof form.value> = {
  name: [{ required: true, message: '食材名不能为空', trigger: 'blur' }],
  unit: [{ required: true, message: '单位不能为空', trigger: 'blur' }],
}

const filteredRows = computed(() => {
  const keyword = query.value.keyword.trim().toLowerCase()
  if (!keyword) {
    return rows.value
  }
  return rows.value.filter((row) => {
    return row.name.toLowerCase().includes(keyword) || row.unit.toLowerCase().includes(keyword)
  })
})

const pagedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredRows.value.slice(start, start + pageSize.value)
})

async function loadRows() {
  try {
    rows.value = await listIngredients(1, 200)
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '加载食材失败')
  }
}

function resetQuery() {
  query.value.keyword = ''
  currentPage.value = 1
}

function openCreate() {
  editingId.value = null
  form.value = {
    name: '',
    unit: '',
    caloriesKcalPer100g: 0,
    giValue: 0,
  }
  formRef.value?.clearValidate()
  showDialog.value = true
}

function openEdit(row: Ingredient) {
  editingId.value = row.id
  form.value = {
    name: row.name,
    unit: row.unit,
    caloriesKcalPer100g: row.caloriesKcalPer100g ?? 0,
    giValue: row.giValue ?? 0,
  }
  formRef.value?.clearValidate()
  showDialog.value = true
}

async function submitForm() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }
  submitLoading.value = true
  try {
    if (editingId.value) {
      await updateIngredient(editingId.value, form.value)
      ElMessage.success('编辑食材成功')
    } else {
      await createIngredient(form.value)
      ElMessage.success('新增食材成功')
    }
    showDialog.value = false
    await loadRows()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '保存食材失败')
  } finally {
    submitLoading.value = false
  }
}

onMounted(loadRows)
</script>

