import type { RouteRecordRaw } from 'vue-router'

export interface RouteMetaType {
  title: string
  icon?: string
  requiresAuth?: boolean
  permissions?: string[]
  hidden?: boolean
  keepAlive?: boolean
  breadcrumb?: boolean
}

export type AppRouteRecordRaw = RouteRecordRaw & {
  meta?: RouteMetaType
  children?: AppRouteRecordRaw[]
}
