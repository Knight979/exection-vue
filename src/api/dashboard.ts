import { request } from './request'
import type { DashboardStats } from '@/types'

// 获取首页统计数据
export function getDashboardStats() {
  return request.get<DashboardStats>('/dashboard/stats')
}
