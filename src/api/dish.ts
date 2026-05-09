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

export interface DishUpdateReq {
  name: string
  coverUrl?: string
  steps?: string
  notes?: string
  durationMin: number
  difficulty: number
  status: number
  remark?: string
}

export interface DishDetail extends Dish {
  coverUrl?: string
  steps?: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export interface DishIngredientRow {
  ingredientId: number
  amountG: number
  sortOrder: number
}

export interface DishIngredientReplaceReq {
  items: DishIngredientRow[]
}

export async function getDishDetail(id: number): Promise<DishDetail> {
  const { data } = await http.get<ApiResponse<DishDetail>>(`/api/dishes/${id}`)
  return data.data as DishDetail
}

export async function listDishIngredients(id: number): Promise<DishIngredientRow[]> {
  const { data } = await http.get<ApiResponse<DishIngredientRow[]>>(`/api/dishes/${id}/ingredients`)
  return data.data ?? []
}

export async function replaceDishIngredients(id: number, payload: DishIngredientReplaceReq): Promise<void> {
  await http.put(`/api/dishes/${id}/ingredients`, payload)
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

export async function updateDish(id: number, payload: DishUpdateReq): Promise<void> {
  await http.put(`/api/dishes/${id}`, payload)
}

