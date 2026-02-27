// 首页统计数据
export interface DashboardStats {
  arbitrationCount: number
  executionCount: number
  courtFilingMonthly: MonthlyData[]
  repaymentMonthly: MonthlyData[]
  contactMonthly: MonthlyData[]
}

// 月度数据
export interface MonthlyData {
  month: string  // 格式: 2024-01
  value: number
  change?: number  // 环比变化百分比
}

// 统计卡片数据
export interface StatCardData {
  title: string
  value: number
  change: number
  icon: string
  color: string
}
