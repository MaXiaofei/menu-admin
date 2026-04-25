<template>
  <div>
    <h2>食材管理</h2>
    <form @submit.prevent="onCreate" style="display: grid; gap: 8px; max-width: 360px; margin-bottom: 16px">
      <input v-model="form.name" placeholder="食材名" />
      <input v-model="form.unit" placeholder="单位" />
      <input v-model.number="form.caloriesKcalPer100g" type="number" min="0" placeholder="热量(kcal/100g)" />
      <input v-model.number="form.giValue" type="number" min="0" placeholder="GI" />
      <button type="submit">新增食材</button>
    </form>

    <table border="1" cellspacing="0" cellpadding="6">
      <thead>
        <tr>
          <th>ID</th>
          <th>食材</th>
          <th>单位</th>
          <th>热量</th>
          <th>GI</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td>{{ row.id }}</td>
          <td>{{ row.name }}</td>
          <td>{{ row.unit }}</td>
          <td>{{ row.caloriesKcalPer100g }}</td>
          <td>{{ row.giValue }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { createIngredient, listIngredients, type Ingredient } from '../../api/ingredient'

const rows = ref<Ingredient[]>([])
const form = reactive({
  name: '',
  unit: '',
  caloriesKcalPer100g: 0,
  giValue: 0,
})

async function loadRows() {
  rows.value = await listIngredients()
}

async function onCreate() {
  await createIngredient({
    name: form.name,
    unit: form.unit,
    caloriesKcalPer100g: form.caloriesKcalPer100g,
    giValue: form.giValue,
  })
  form.name = ''
  form.unit = ''
  await loadRows()
}

onMounted(loadRows)
</script>

