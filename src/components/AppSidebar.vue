<template>
  <aside style="width: 240px; border-right: 1px solid #e5e7eb; padding: 12px">
    <h3 style="margin: 0 0 8px 0">主数据</h3>
    <ul style="list-style: none; padding: 0; margin: 0 0 12px 0">
      <li><RouterLink to="/dishes">菜品管理</RouterLink></li>
      <li><RouterLink to="/ingredients">食材管理</RouterLink></li>
    </ul>

    <h3 style="margin: 0 0 8px 0">权限</h3>
    <ul style="list-style: none; padding: 0; margin: 0">
      <li><RouterLink to="/users">账号管理</RouterLink></li>
      <li><RouterLink to="/roles">角色管理</RouterLink></li>
      <li><RouterLink to="/permissions">权限配置</RouterLink></li>
      <li><RouterLink to="/scopes">端权限范围</RouterLink></li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

