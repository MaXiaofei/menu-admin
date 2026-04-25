import { http } from './http'

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface AdminRole {
  id: number
  name: string
  remark?: string
}

export interface AdminRoleCreateReq {
  name: string
  remark?: string
}

export async function listAdminRoles(): Promise<AdminRole[]> {
  const { data } = await http.get<ApiResponse<AdminRole[]>>('/api/admin/roles')
  return data.data ?? []
}

export async function createAdminRole(req: AdminRoleCreateReq): Promise<number> {
  const { data } = await http.post<ApiResponse<{ id: number }>>('/api/admin/roles', req)
  return data.data.id
}

export async function bindRolePermissions(roleId: number, permissionIds: number[]): Promise<void> {
  await http.put(`/api/admin/roles/${roleId}/permissions`, { permissionIds })
}

export async function updateRoleScopes(roleId: number, clientTypes: string[]): Promise<void> {
  await http.put(`/api/admin/roles/${roleId}/scopes`, { clientTypes })
}

export async function getRoleScopes(roleId: number): Promise<string[]> {
  const { data } = await http.get<ApiResponse<string[]>>(`/api/admin/scopes/${roleId}`)
  return data.data ?? []
}

