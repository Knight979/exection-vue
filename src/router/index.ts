import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { ElMessage } from 'element-plus'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// 从 localStorage 直接读取持久化的 token（兼容新窗口场景）
function getStoredToken(): string {
  try {
    const userStore = localStorage.getItem('user')
    if (userStore) {
      const parsed = JSON.parse(userStore)
      return parsed?.token || ''
    }
  } catch {
    // ignore
  }
  return ''
}

// 路由守卫
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  document.title = to.meta?.title ? `${to.meta.title} - AI系统` : 'AI系统'
  
  // 检查是否需要登录
  if (to.meta?.requiresAuth !== false) {
    const token = getStoredToken()
    if (!token) {
      ElMessage.warning('请先登录')
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }
  }
  
  next()
})

export default router
