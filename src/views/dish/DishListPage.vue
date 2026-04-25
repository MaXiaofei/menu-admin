<template>
  <div>
    <h2>菜品管理</h2>
    <form @submit.prevent="onCreate" style="display: grid; gap: 8px; max-width: 360px; margin-bottom: 16px">
      <input v-model="form.name" placeholder="菜名" />
      <input v-model.number="form.durationMin" type="number" min="1" placeholder="时长(分钟)" />
      <input v-model.number="form.difficulty" type="number" min="1" max="5" placeholder="难度(1-5)" />
      <select v-model.number="form.status">
        <option :value="1">上架</option>
        <option :value="0">下架</option>
      </select>
      <input v-model="form.remark" placeholder="备注" />
      <button type="submit">新增菜品</button>
    </form>

    <table border="1" cellspacing="0" cellpadding="6">
      <thead>
        <tr>
          <th>ID</th>
          <th>菜名</th>
          <th>时长</th>
          <th>难度</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td>{{ row.id }}</td>
          <td>{{ row.name }}</td>
          <td>{{ row.durationMin }}</td>
          <td>{{ row.difficulty }}</td>
          <td>{{ row.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { createDish, listDishes, type Dish } from '../../api/dish'

const rows = ref<Dish[]>([])
const form = reactive({
  name: '',
  durationMin: 10,
  difficulty: 2,
  status: 1,
  remark: '',
})

async function loadRows() {
  rows.value = await listDishes()
}

async function onCreate() {
  await createDish({
    name: form.name,
    durationMin: form.durationMin,
    difficulty: form.difficulty,
    remark: form.remark,
  })
  form.name = ''
  form.remark = ''
  await loadRows()
}

onMounted(loadRows)
</script>

