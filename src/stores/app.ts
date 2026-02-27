import { defineStore } from 'pinia'
import { ref } from 'vue'

interface TabItem {
  name: string
  path: string
  title: string
}

export const useAppStore = defineStore('app', () => {
  // State
  const sidebarCollapsed = ref(false)
  const tabs = ref<TabItem[]>([])
  const activeTab = ref('')

  // Actions
  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function setSidebarCollapsed(collapsed: boolean) {
    sidebarCollapsed.value = collapsed
  }

  function addTab(tab: TabItem) {
    const index = tabs.value.findIndex(item => item.path === tab.path)
    if (index === -1) {
      tabs.value.push(tab)
    }
    activeTab.value = tab.path
  }

  function removeTab(path: string) {
    const index = tabs.value.findIndex(item => item.path === path)
    if (index !== -1) {
      tabs.value.splice(index, 1)
      // 如果删除的是当前激活的tab,激活前一个
      if (activeTab.value === path && tabs.value.length > 0) {
        activeTab.value = tabs.value[Math.max(0, index - 1)].path
      }
    }
  }

  function removeAllTabs() {
    tabs.value = []
    activeTab.value = ''
  }

  function removeOtherTabs(path: string) {
    tabs.value = tabs.value.filter(item => item.path === path)
    activeTab.value = path
  }

  return {
    sidebarCollapsed,
    tabs,
    activeTab,
    toggleSidebar,
    setSidebarCollapsed,
    addTab,
    removeTab,
    removeAllTabs,
    removeOtherTabs
  }
}, {
  persist: true
})
