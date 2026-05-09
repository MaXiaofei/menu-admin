import { http } from './http'

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface DropdownOptionAdminRow {
  id: number
  category: string
  optionCode: string
  optionLabel: string
  sortOrder: number
  enabled: number
  remark?: string
  createdAt?: string
  updatedAt?: string
}

export interface DropdownOptionUpsertReq {
  category: string
  optionCode: string
  optionLabel: string
  sortOrder: number
  enabled: number
  remark?: string
}

export async function listDropdownOptionsAdmin(category?: string): Promise<DropdownOptionAdminRow[]> {
  const { data } = await http.get<ApiResponse<DropdownOptionAdminRow[]>>('/api/admin/dropdown-options', {
    params: category ? { category } : {},
  })
  return data.data ?? []
}

export async function createDropdownOption(payload: DropdownOptionUpsertReq): Promise<number> {
  const { data } = await http.post<ApiResponse<{ id: number }>>('/api/admin/dropdown-options', payload)
  return data.data?.id ?? 0
}

export async function updateDropdownOption(id: number, payload: DropdownOptionUpsertReq): Promise<void> {
  await http.put(`/api/admin/dropdown-options/${id}`, payload)
}

export async function deleteDropdownOption(id: number): Promise<void> {
  await http.delete(`/api/admin/dropdown-options/${id}`)
}
