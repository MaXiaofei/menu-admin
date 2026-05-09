import { http } from './http'

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface MenuTemplate {
  id: number
  name: string
  templateType: number
  scene?: string
  flavor?: string
  crowd?: string
  description?: string
  status: number
  remark?: string
  createdAt?: string
  updatedAt?: string
}

export interface MenuTemplatePage {
  records: MenuTemplate[]
  total: number
}

export interface MenuTemplateDetail extends MenuTemplate {
  dishIds: number[]
}

export interface MenuTemplateCreateReq {
  name: string
  templateType: number
  dishIds: number[]
}

export interface MenuTemplateUpdateReq extends MenuTemplateCreateReq {
  scene?: string
  flavor?: string
  crowd?: string
  description?: string
  status: number
  remark?: string
}

export interface IngredientSummaryRow {
  ingredientId: number
  ingredientName: string
  unit: string
  totalAmountG: number
}

export async function pageMenuTemplates(
  name: string | undefined,
  pageNum: number,
  pageSize: number,
): Promise<MenuTemplatePage> {
  const { data } = await http.get<ApiResponse<MenuTemplatePage>>('/api/menu-templates', {
    params: { name: name || undefined, pageNum, pageSize },
  })
  return data.data ?? { records: [], total: 0 }
}

export async function getMenuTemplateDetail(id: number): Promise<MenuTemplateDetail> {
  const { data } = await http.get<ApiResponse<MenuTemplateDetail>>(`/api/menu-templates/${id}`)
  return data.data as MenuTemplateDetail
}

export async function createMenuTemplate(payload: MenuTemplateCreateReq): Promise<number> {
  const { data } = await http.post<ApiResponse<{ id: number }>>('/api/menu-templates', payload)
  return data.data?.id ?? 0
}

export async function updateMenuTemplate(id: number, payload: MenuTemplateUpdateReq): Promise<void> {
  await http.put(`/api/menu-templates/${id}`, payload)
}

export async function getIngredientSummary(id: number): Promise<IngredientSummaryRow[]> {
  const { data } = await http.get<ApiResponse<IngredientSummaryRow[]>>(
    `/api/menu-templates/${id}/ingredient-summary`,
  )
  return data.data ?? []
}
