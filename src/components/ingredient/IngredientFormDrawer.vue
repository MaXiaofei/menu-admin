<template>
  <el-drawer v-model="visibleProxy" :title="title" size="420px">
    <el-form :model="model" label-width="110px">
      <el-form-item label="食材名"><el-input v-model="model.name" /></el-form-item>
      <el-form-item label="单位"><el-input v-model="model.unit" /></el-form-item>
      <el-form-item label="热量">
        <el-input-number v-model="model.caloriesKcalPer100g" :min="0" />
      </el-form-item>
      <el-form-item label="GI"><el-input-number v-model="model.giValue" :min="0" /></el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visibleProxy = false">取消</el-button>
      <el-button type="primary" @click="$emit('submit')">保存</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
const visibleProxy = defineModel<boolean>('visible', { required: true })

defineProps<{
  title: string
  model: {
    name: string
    unit: string
    caloriesKcalPer100g: number
    giValue: number
  }
}>()

defineEmits<{
  submit: []
}>()
</script>
