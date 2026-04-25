import { http } from './http'

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface Ingredient {
  id: number
  name: string
  unit: string
  caloriesKcalPer100g?: number
  giValue?: number
}

export interface IngredientCreateReq {
  name: string
  unit: string
  caloriesKcalPer100g?: number
  giValue?: number
  remark?: string
}

export interface IngredientUpdateReq {
  name: string
  unit: string
  caloriesKcalPer100g?: number
  giValue?: number
  remark?: string
}

export async function listIngredients(pageNum = 1, pageSize = 20): Promise<Ingredient[]> {
  const { data } = await http.get<ApiResponse<Ingredient[]>>('/api/ingredients', {
    params: { pageNum, pageSize },
  })
  return data.data ?? []
}

export async function createIngredient(payload: IngredientCreateReq): Promise<void> {
  await http.post('/api/ingredients', payload)
}

export async function updateIngredient(id: number, payload: IngredientUpdateReq): Promise<void> {
  await http.put(`/api/ingredients/${id}`, payload)
}

