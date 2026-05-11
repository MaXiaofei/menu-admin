<template>
  <aside style="width: 240px; border-right: 1px solid rgba(124, 45, 18, 0.18); padding: 12px; background: #fff7ed">
    <div style="margin-bottom: 12px; color: #7c2d12; font-weight: 700">导航</div>
    <h3 style="margin: 0 0 8px 0; color: #7c2d12">主数据</h3>
    <ul style="list-style: none; padding: 0; margin: 0 0 12px 0">
      <li><RouterLink class="nav-link" to="/dishes">菜品管理</RouterLink></li>
      <li><RouterLink class="nav-link" to="/ingredients">食材管理</RouterLink></li>
      <li><RouterLink class="nav-link" to="/menu-templates">菜单模板</RouterLink></li>
      <li><RouterLink class="nav-link" to="/dropdown-options">字典配置</RouterLink></li>
    </ul>

    <h3 style="margin: 0 0 8px 0; color: #7c2d12">权限</h3>
    <ul style="list-style: none; padding: 0; margin: 0">
      <li><RouterLink class="nav-link" to="/users">账号管理</RouterLink></li>
      <li><RouterLink class="nav-link" to="/roles">角色管理</RouterLink></li>
      <li><RouterLink class="nav-link" to="/permissions">权限配置</RouterLink></li>
      <li><RouterLink class="nav-link" to="/scopes">端权限范围</RouterLink></li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.nav-link {
  display: block;
  color: #7c2d12;
  text-decoration: none;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 8px 10px;
  margin-bottom: 6px;
}

.nav-link:hover,
.router-link-active {
  background: #ffedd5;
  border-color: rgba(124, 45, 18, 0.2);
}
</style>

