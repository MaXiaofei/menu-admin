<template>
  <div class="warm-page">
    <section class="warm-header">
      <h2>菜品管理</h2>
      <p class="warm-subtitle">A 版业务优先：支持新增、列表浏览与状态管理</p>
    </section>
    <section class="warm-header">
      <div class="warm-filter">
        <el-input v-model="query.keyword" placeholder="按菜名模糊查询" style="max-width: 240px" clearable />
        <el-select v-model="query.status" placeholder="状态" clearable style="width: 160px">
          <el-option label="上架" :value="1" />
          <el-option label="下架" :value="0" />
        </el-select>
        <el-button @click="resetQuery">重置</el-button>
        <el-button type="primary" @click="openCreate">新增菜品</el-button>
      </div>
    </section>
    <section class="warm-table-wrap">
      <el-table :data="pagedRows" border empty-text="暂无菜品数据">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="菜名" />
        <el-table-column prop="durationMin" label="时长(分钟)" />
        <el-table-column prop="difficulty" label="难度" />
        <el-table-column label="状态">
          <template #default="{ row }">{{ row.status === 1 ? '上架' : '下架' }}</template>
        </el-table-column>
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

    <el-dialog v-model="showDialog" :title="editingId ? '编辑菜品' : '新增菜品'" width="520px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="菜名" prop="name"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="时长" prop="durationMin">
          <el-input-number v-model="form.durationMin" :min="1" :max="999" />
        </el-form-item>
        <el-form-item label="难度" prop="difficulty">
          <el-input-number v-model="form.difficulty" :min="1" :max="5" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status">
            <el-option label="上架" :value="1" />
            <el-option label="下架" :value="0" />
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
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { createDish, listDishes, updateDish, type Dish } from '../../api/dish'

const rows = ref<Dish[]>([])
const showDialog = ref(false)
const submitLoading = ref(false)
const editingId = ref<number | null>(null)
const currentPage = ref(1)
const pageSize = ref(10)
const query = ref({
  keyword: '',
  status: undefined as number | undefined,
})
const form = ref({
  name: '',
  durationMin: 10,
  difficulty: 2,
  status: 1,
  remark: '',
})
const formRef = ref<FormInstance>()
const rules: FormRules<typeof form.value> = {
  name: [{ required: true, message: '菜名不能为空', trigger: 'blur' }],
  durationMin: [{ required: true, message: '时长不能为空', trigger: 'change' }],
  difficulty: [{ required: true, message: '难度不能为空', trigger: 'change' }],
}

const filteredRows = computed(() => {
  const keyword = query.value.keyword.trim().toLowerCase()
  return rows.value.filter((row) => {
    const nameMatch = !keyword || row.name.toLowerCase().includes(keyword)
    const statusMatch = query.value.status === undefined || row.status === query.value.status
    return nameMatch && statusMatch
  })
})

const pagedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredRows.value.slice(start, start + pageSize.value)
})

async function loadRows() {
  try {
    rows.value = await listDishes(1, 200)
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '加载菜品失败')
  }
}

function resetQuery() {
  query.value.keyword = ''
  query.value.status = undefined
  currentPage.value = 1
}

function openCreate() {
  editingId.value = null
  form.value = {
    name: '',
    durationMin: 10,
    difficulty: 2,
    status: 1,
    remark: '',
  }
  formRef.value?.clearValidate()
  showDialog.value = true
}

function openEdit(row: Dish) {
  editingId.value = row.id
  form.value = {
    name: row.name,
    durationMin: row.durationMin,
    difficulty: row.difficulty,
    status: row.status,
    remark: row.remark ?? '',
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
      await updateDish(editingId.value, form.value)
      ElMessage.success('编辑菜品成功')
    } else {
      await createDish({
        name: form.value.name,
        durationMin: form.value.durationMin,
        difficulty: form.value.difficulty,
        remark: form.value.remark,
      })
      ElMessage.success('新增菜品成功')
    }
    showDialog.value = false
    await loadRows()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '保存菜品失败')
  } finally {
    submitLoading.value = false
  }
}

onMounted(loadRows)
</script>

