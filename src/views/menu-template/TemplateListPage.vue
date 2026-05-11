<template>
  <div class="warm-page">
    <section class="warm-header">
      <h2>菜单模板</h2>
    </section>
    <section class="warm-header">
      <div class="warm-filter">
        <el-input v-model="query.keyword" placeholder="按模板名称模糊查询" style="max-width: 240px" clearable />
        <el-button @click="resetQuery">重置</el-button>
        <el-button type="primary" @click="openCreate">新建模板</el-button>
      </div>
    </section>
    <section class="warm-table-wrap">
      <el-table :data="rows" border empty-text="暂无模板">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称" />
        <el-table-column label="类型" min-width="140">
          <template #default="{ row }">
            <span>{{ templateTypeLabel(row.templateType) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">{{ row.status === 1 ? '启用' : '停用' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="{ row }">
            <el-button link type="primary" @click="openSummary(row)">食材汇总</el-button>
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="warm-pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          layout="total, prev, pager, next, sizes"
          :total="total"
          :page-sizes="[5, 10, 20, 50]"
          @current-change="loadRows"
          @size-change="loadRows"
        />
      </div>
    </section>

    <el-dialog v-model="showDialog" :title="editingId ? '编辑模板' : '新建模板'" width="640px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="名称" prop="name"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="类型" prop="templateType">
          <el-select v-model="form.templateType" placeholder="请选择模板类型" style="width: 100%">
            <el-option v-for="opt in TEMPLATE_TYPE_OPTIONS" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="场景"><el-input v-model="form.scene" /></el-form-item>
        <el-form-item label="口味"><el-input v-model="form.flavor" /></el-form-item>
        <el-form-item label="人群"><el-input v-model="form.crowd" /></el-form-item>
        <el-form-item label="描述"><el-input v-model="form.description" type="textarea" rows="2" /></el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status">
            <el-option label="启用" :value="1" />
            <el-option label="停用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="关联菜品" prop="dishIds">
          <el-select
            v-model="form.dishIds"
            multiple
            filterable
            collapse-tags
            collapse-tags-tooltip
            placeholder="请选择菜品（可多选）"
            style="width: 100%"
          >
            <el-option
              v-for="d in dishOptions"
              :key="d.id"
              :label="`${d.name} (#${d.id})`"
              :value="d.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注"><el-input v-model="form.remark" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showSummary" title="食材汇总" width="720px">
      <el-table :data="summaryRows" border empty-text="暂无汇总数据">
        <el-table-column prop="ingredientName" label="食材" />
        <el-table-column prop="unit" label="单位" width="80" />
        <el-table-column prop="totalAmountG" label="总用量(g)" />
      </el-table>
      <template #footer>
        <el-button type="primary" @click="showSummary = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { listDishes, type Dish } from '../../api/dish'
import {
  createMenuTemplate,
  getIngredientSummary,
  getMenuTemplateDetail,
  pageMenuTemplates,
  updateMenuTemplate,
  type IngredientSummaryRow,
  type MenuTemplate,
} from '../../api/menu-template'

/** 与 `docs/db_init.sql` 中 menu_template.template_type 注释一致：1-4 枚举 */
const TEMPLATE_TYPE_OPTIONS = [
  { value: 1, label: '一日三餐' },
  { value: 2, label: '家宴菜单' },
  { value: 3, label: '节日菜单' },
  { value: 4, label: '自定义模板' },
] as const

function templateTypeLabel(code: number | undefined | null): string {
  if (code == null) return '—'
  const found = TEMPLATE_TYPE_OPTIONS.find((o) => o.value === code)
  return found ? found.label : `未知（${code}）`
}

const rows = ref<MenuTemplate[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const query = ref({ keyword: '' })
const showDialog = ref(false)
const showSummary = ref(false)
const submitLoading = ref(false)
const editingId = ref<number | null>(null)
const summaryRows = ref<IngredientSummaryRow[]>([])
const dishOptions = ref<Dish[]>([])
const formRef = ref<FormInstance>()
const form = reactive({
  name: '',
  templateType: 1,
  scene: '',
  flavor: '',
  crowd: '',
  description: '',
  status: 1,
  remark: '',
  dishIds: [] as number[],
})
const rules: FormRules<typeof form> = {
  name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  templateType: [{ required: true, message: '类型不能为空', trigger: 'change' }],
  status: [{ required: true, message: '状态不能为空', trigger: 'change' }],
  dishIds: [
    {
      type: 'array',
      required: true,
      message: '请至少选择一个菜品',
      trigger: 'change',
      min: 1,
    },
  ],
}

async function loadDishOptions() {
  try {
    dishOptions.value = await listDishes(1, 500)
  } catch {
    dishOptions.value = []
    ElMessage.warning('菜品列表加载失败，请检查登录与接口')
  }
}

async function loadRows() {
  try {
    const page = await pageMenuTemplates(query.value.keyword.trim() || undefined, currentPage.value, pageSize.value)
    rows.value = page.records
    total.value = page.total
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '加载失败')
  }
}

function resetQuery() {
  query.value.keyword = ''
  currentPage.value = 1
  loadRows()
}

async function openCreate() {
  editingId.value = null
  await loadDishOptions()
  Object.assign(form, {
    name: '',
    templateType: 1,
    scene: '',
    flavor: '',
    crowd: '',
    description: '',
    status: 1,
    remark: '',
    dishIds: [],
  })
  formRef.value?.clearValidate()
  showDialog.value = true
}

async function openEdit(row: MenuTemplate) {
  editingId.value = row.id
  try {
    await loadDishOptions()
    const d = await getMenuTemplateDetail(row.id)
    Object.assign(form, {
      name: d.name,
      templateType: d.templateType,
      scene: d.scene ?? '',
      flavor: d.flavor ?? '',
      crowd: d.crowd ?? '',
      description: d.description ?? '',
      status: d.status,
      remark: d.remark ?? '',
      dishIds: [...(d.dishIds ?? [])],
    })
    formRef.value?.clearValidate()
    showDialog.value = true
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '加载详情失败')
  }
}

async function openSummary(row: MenuTemplate) {
  try {
    summaryRows.value = await getIngredientSummary(row.id)
    showSummary.value = true
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '加载汇总失败')
  }
}

async function submitForm() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  const dishIds = [...form.dishIds]
  submitLoading.value = true
  try {
    if (editingId.value) {
      await updateMenuTemplate(editingId.value, {
        name: form.name,
        templateType: form.templateType,
        scene: form.scene || undefined,
        flavor: form.flavor || undefined,
        crowd: form.crowd || undefined,
        description: form.description || undefined,
        status: form.status,
        remark: form.remark || undefined,
        dishIds,
      })
      ElMessage.success('更新成功')
    } else {
      await createMenuTemplate({
        name: form.name,
        templateType: form.templateType,
        dishIds,
      })
      ElMessage.success('创建成功')
    }
    showDialog.value = false
    await loadRows()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '保存失败')
  } finally {
    submitLoading.value = false
  }
}

onMounted(loadRows)
</script>
