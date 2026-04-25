import { http } from './http'

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface PermissionPoint {
  id: number
  code: string
  name: string
}

export async function listPermissionPoints(): Promise<PermissionPoint[]> {
  const { data } = await http.get<ApiResponse<PermissionPoint[]>>('/api/admin/permissions')
  return data.data ?? []
}

