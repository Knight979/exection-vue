<template>
  <div class="default-layout">
    <el-container>
      <!-- 头部 -->
      <el-header class="layout-header">
        <div class="header-left">
          <el-icon class="menu-icon" @click="toggleSidebar">
            <Fold v-if="!appStore.sidebarCollapsed" />
            <Expand v-else />
          </el-icon>
          <span class="system-title">AI系统</span>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <div class="user-info">
              <el-avatar :size="32" :src="userStore.userInfo?.avatar">
                {{ userStore.userInfo?.nickname?.charAt(0) }}
              </el-avatar>
              <span class="username">{{ userStore.userInfo?.nickname }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-container class="layout-main">
        <!-- 侧边栏 -->
        <el-aside :width="appStore.sidebarCollapsed ? '64px' : '200px'" class="layout-sidebar">
          <el-menu
            :default-active="$route.path"
            :default-openeds="openedMenus"
            :collapse="appStore.sidebarCollapsed"
            class="sidebar-menu"
          >
            <template v-for="route in menuRoutes" :key="route.path">
              <!-- 有多个可见子菜单：展示为折叠子菜单 -->
              <el-sub-menu
                v-if="getVisibleChildren(route).length > 1"
                :index="route.path"
              >
                <template #title>
                  <el-icon v-if="route.meta?.icon">
                    <component :is="getIcon(route.meta.icon as string)" />
                  </el-icon>
                  <span>{{ route.meta?.title }}</span>
                </template>
                <el-menu-item
                  v-for="child in getVisibleChildren(route)"
                  :key="child.path"
                  :index="`${route.path}/${child.path}`"
                  @click="router.push(`${route.path}/${child.path}`)"
                >
                  {{ child.meta?.title }}
                </el-menu-item>
              </el-sub-menu>
              <!-- 只有1个可见子菜单：单级菜单直接跳转唯一子路由 -->
              <el-menu-item
                v-else-if="getVisibleChildren(route).length === 1"
                :index="`${route.path}/${getVisibleChildren(route)[0].path}`"
                @click="router.push(`${route.path}/${getVisibleChildren(route)[0].path}`)"
              >
                <el-icon v-if="route.meta?.icon">
                  <component :is="getIcon(route.meta.icon as string)" />
                </el-icon>
                <template #title>{{ route.meta?.title }}</template>
              </el-menu-item>
              <!-- 没有子菜单：直接跳转 -->
              <el-menu-item
                v-else
                :index="route.path"
                @click="router.push(route.path)"
              >
                <el-icon v-if="route.meta?.icon">
                  <component :is="getIcon(route.meta.icon as string)" />
                </el-icon>
                <template #title>{{ route.meta?.title }}</template>
              </el-menu-item>
            </template>
          </el-menu>
        </el-aside>

        <!-- 主内容区 -->
        <el-main class="layout-content">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Fold, Expand } from '@element-plus/icons-vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import { routes } from '@/router/routes'

const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore()

// 获取图标组件
const getIcon = (iconName?: string) => {
  if (!iconName) return null
  return (ElementPlusIconsVue as any)[iconName]
}

// 获取可见子菜单
const getVisibleChildren = (route: any) => {
  if (!route.children) return []
  return route.children.filter((c: any) => !c.meta?.hidden)
}

// 默认展开所有有多个子菜单的父菜单
const openedMenus = computed(() => {
  const mainRoute = routes.find(r => r.path === '/')
  return (mainRoute?.children || [])
    .filter(r => !r.meta?.hidden && r.children && r.children.filter((c: any) => !c.meta?.hidden).length > 1)
    .map(r => r.path)
})

// 过滤菜单路由
const menuRoutes = computed(() => {
  const mainRoute = routes.find(r => r.path === '/')
  return mainRoute?.children?.filter(r => !r.meta?.hidden) || []
})

// 切换侧边栏
function toggleSidebar() {
  appStore.toggleSidebar()
}

// 下拉菜单命令
async function handleCommand(command: string) {
  if (command === 'logout') {
    try {
      await ElMessageBox.confirm('确定要退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await userStore.logout()
      ElMessage.success('退出成功')
      router.push('/login')
    } catch (error) {
      // 用户取消
    }
  } else if (command === 'profile') {
    ElMessage.info('个人信息功能开发中')
  }
}
</script>

<style scoped lang="scss">
.default-layout {
  width: 100%;
  height: 100%;
}

.el-container {
  height: 100%;
}

.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-icon {
  font-size: 20px;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #3a8ee6;
  }
}

.system-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f5f7fa;
  }
}

.username {
  font-size: 14px;
  color: #606266;
}

.layout-main {
  height: calc(100% - 60px);
}

.layout-sidebar {
  background-color: #fff;
  border-right: 1px solid #e4e7ed;
  transition: width 0.3s;
  overflow-x: hidden;
}

.sidebar-menu {
  border-right: none;
  height: 100%;
}

.layout-content {
  padding: 2px;
  overflow-y: auto;
  background-color: #f0f2f5;
}
</style>
