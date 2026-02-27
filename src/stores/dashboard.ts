import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DashboardStats } from '@/types'
import { getDashboardStats as getDashboardStatsApi } from '@/api/dashboard'

export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const stats = ref<DashboardStats | null>(null)
  const loading = ref(false)

  // Actions
  async function fetchStats() {
    try {
      loading.value = true
      const data = await getDashboardStatsApi()
      stats.value = data
      return data
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  function clearStats() {
    stats.value = null
  }

  return {
    stats,
    loading,
    fetchStats,
    clearStats
  }
})
