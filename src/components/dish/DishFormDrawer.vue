<template>
  <el-drawer v-model="visibleProxy" :title="title" size="420px">
    <el-form :model="model" label-width="90px">
      <el-form-item label="菜名"><el-input v-model="model.name" /></el-form-item>
      <el-form-item label="时长"><el-input-number v-model="model.durationMin" :min="1" /></el-form-item>
      <el-form-item label="难度"><el-input-number v-model="model.difficulty" :min="1" :max="5" /></el-form-item>
      <el-form-item label="状态">
        <el-select v-model="model.status">
          <el-option label="上架" :value="1" />
          <el-option label="下架" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注"><el-input v-model="model.remark" type="textarea" /></el-form-item>
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
    durationMin: number
    difficulty: number
    status: number
    remark: string
  }
}>()

defineEmits<{
  submit: []
}>()
</script>
