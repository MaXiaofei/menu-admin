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

