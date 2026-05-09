import { http } from './http'

export interface LoginReq {
  username: string
  password: string
  clientType: 'admin'
}

export interface LoginResp {
  accessToken: string
  refreshToken: string
  expiresIn: number
  permissions: string[]
  clientScopes: string[]
}

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export async function login(req: LoginReq): Promise<LoginResp> {
  const { data } = await http.post<ApiResponse<LoginResp>>('/api/auth/login', req)
  return data.data
}

