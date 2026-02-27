import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import type { LoginParams } from '@/types'
import { login as loginApi, logout as logoutApi } from '@/api/auth'
import { getUserInfo as getUserInfoApi } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  // State
  const token = ref('')
  const refreshToken = ref('')
  const userInfo = ref<User | null>(null)
  const permissions = ref<string[]>([])

  // Getters
  const isLoggedIn = computed(() => !!token.value)
  const hasPermission = computed(() => (permission: string) => permissions.value.includes(permission))

  // Actions
  async function login(params: LoginParams) {
    try {
      const data = await loginApi(params)
      token.value = data.token
      // 保存用户名
      if (!userInfo.value) {
        userInfo.value = {} as User
      }
      userInfo.value.username = data.username
      // 注意：后端返回格式中没有refreshToken，如果需要可以后续添加
      return data
    } catch (error) {
      throw error
    }
  }

  async function getUserInfo() {
    try {
      const data = await getUserInfoApi()
      userInfo.value = data
      // 更新permissions
      return data
    } catch (error) {
      throw error
    }
  }

  async function logout() {
    try {
      await logoutApi()
    } finally {
      token.value = ''
      refreshToken.value = ''
      userInfo.value = null
      permissions.value = []
    }
  }

  function clearUserInfo() {
    token.value = ''
    refreshToken.value = ''
    userInfo.value = null
    permissions.value = []
  }

  return {
    token,
    refreshToken,
    userInfo,
    permissions,
    isLoggedIn,
    hasPermission,
    login,
    getUserInfo,
    logout,
    clearUserInfo
  }
}, {
  persist: true
})
