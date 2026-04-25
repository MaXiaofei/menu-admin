<template>
  <div style="display: flex; min-height: 100vh">
    <AppSidebar />
    <main style="flex: 1; padding: 16px">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppSidebar from '../components/AppSidebar.vue'
</script>

