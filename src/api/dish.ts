import { http } from './http'

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface Dish {
  id: number
  name: string
  durationMin: number
  difficulty: number
  status: number
  remark?: string
}

export interface DishCreateReq {
  name: string
  durationMin: number
  difficulty: number
  remark?: string
}

export async function listDishes(pageNum = 1, pageSize = 20): Promise<Dish[]> {
  const { data } = await http.get<ApiResponse<Dish[]>>('/api/dishes', {
    params: { pageNum, pageSize },
  })
  return data.data ?? []
}

export async function createDish(payload: DishCreateReq): Promise<void> {
  await http.post('/api/dishes', payload)
}

