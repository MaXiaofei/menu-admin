import { http } from './http'

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface AdminUser {
  id: number
  username: string
  nickname?: string
  phone?: string
  email?: string
  status: number
  roleIds?: number[]
}

export interface AdminUserCreateReq {
  username: string
  nickname: string
  phone: string
  email: string
  password: string
  roleIds: number[]
}

export async function listAdminUsers(): Promise<AdminUser[]> {
  const { data } = await http.get<ApiResponse<AdminUser[]>>('/api/admin/users')
  return data.data ?? []
}

export async function createAdminUser(req: AdminUserCreateReq): Promise<number> {
  const { data } = await http.post<ApiResponse<{ id: number }>>('/api/admin/users', req)
  return data.data.id
}

export interface AdminUserUpdateReq {
  nickname?: string
  phone?: string
  email?: string
  status?: number
  roleIds: number[]
}

export async function updateAdminUser(id: number, req: AdminUserUpdateReq): Promise<void> {
  await http.put(`/api/admin/users/${id}`, req)
}

export async function resetAdminUserPassword(id: number): Promise<void> {
  await http.post(`/api/admin/users/${id}/reset-password`)
}

