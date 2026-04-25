import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AdminLayout from '../layouts/AdminLayout.vue'
import DishListPage from '../views/dish/DishListPage.vue'
import IngredientListPage from '../views/ingredient/IngredientListPage.vue'
import LoginPage from '../views/login/LoginPage.vue'
import PermissionPage from '../views/permission/PermissionPage.vue'
import RoleListPage from '../views/role/RoleListPage.vue'
import ScopePage from '../views/scope/ScopePage.vue'
import UserListPage from '../views/user/UserListPage.vue'
import { canAccessRoute } from '../utils/permission'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      component: LoginPage,
    },
    {
      path: '/',
      component: AdminLayout,
      children: [
        {
          path: 'dishes',
          component: DishListPage,
          meta: { permission: 'dish:list', clientType: 'admin' },
        },
        {
          path: 'ingredients',
          component: IngredientListPage,
          meta: { permission: 'ingredient:list', clientType: 'admin' },
        },
        {
          path: 'users',
          component: UserListPage,
          meta: { permission: 'auth-user:list', clientType: 'admin' },
        },
        {
          path: 'roles',
          component: RoleListPage,
          meta: { permission: 'auth-role:list', clientType: 'admin' },
        },
        {
          path: 'permissions',
          component: PermissionPage,
          meta: { permission: 'auth-permission:list', clientType: 'admin' },
        },
        {
          path: 'scopes',
          component: ScopePage,
          meta: { permission: 'auth-scope:list', clientType: 'admin' },
        },
      ],
    },
  ],
})

router.beforeEach((to) => {
  if (to.path === '/login') {
    return true
  }
  const authStore = useAuthStore()
  if (!authStore.accessToken) {
    return '/login'
  }
  const allow = canAccessRoute(authStore.permissions, authStore.clientScopes, {
    permission: typeof to.meta.permission === 'string' ? to.meta.permission : undefined,
    clientType: typeof to.meta.clientType === 'string' ? to.meta.clientType : undefined,
  })
  if (!allow) {
    return '/login'
  }
  return true
})

export default router

