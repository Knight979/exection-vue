<template>
  <div class="dashboard-container">
    <!-- 顶部指标卡片 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :xs="24" :sm="12" :md="6" :lg="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #ecf5ff">
              <el-icon :size="32" color="#409eff">
                <Files />
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">案件总数</div>
              <div class="stat-value">{{ stats.totalCases }}</div>
              <div class="stat-trend">
                <span :class="stats.casesChange >= 0 ? 'trend-up' : 'trend-down'">
                  {{ stats.casesChange >= 0 ? '↑' : '↓' }}
                  {{ Math.abs(stats.casesChange) }}%
                </span>
                <span class="trend-label">环比上月</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6" :lg="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #f0f9ff">
              <el-icon :size="32" color="#67c23a">
                <Money />
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">回款金额</div>
              <div class="stat-value">{{ formatAmount(stats.repaymentAmount) }}</div>
              <div class="stat-trend">
                <span :class="stats.repaymentChange >= 0 ? 'trend-up' : 'trend-down'">
                  {{ stats.repaymentChange >= 0 ? '↑' : '↓' }}
                  {{ Math.abs(stats.repaymentChange) }}%
                </span>
                <span class="trend-label">环比上月</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6" :lg="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #fef0f0">
              <el-icon :size="32" color="#f56c6c">
                <Warning />
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">逾期案件</div>
              <div class="stat-value">{{ stats.overdueCases }}</div>
              <div class="stat-trend">
                <span :class="stats.overdueChange >= 0 ? 'trend-up' : 'trend-down'">
                  {{ stats.overdueChange >= 0 ? '↑' : '↓' }}
                  {{ Math.abs(stats.overdueChange) }}%
                </span>
                <span class="trend-label">环比上月</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6" :lg="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #fdf6ec">
              <el-icon :size="32" color="#e6a23c">
                <User />
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">催收员数量</div>
              <div class="stat-value">{{ stats.collectorCount }}</div>
              <div class="stat-trend">
                <span class="trend-label">人均案件:</span>
                <span class="trend-value">{{ stats.avgCasesPerCollector }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="16" class="charts-row">
      <!-- 案件趋势图 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span class="card-title">案件趋势</span>
              <el-radio-group v-model="caseTrendType" size="small">
                <el-radio-button label="week">近7天</el-radio-button>
                <el-radio-button label="month">近30天</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="caseTrendChartRef" class="chart-container"></div>
        </el-card>
      </el-col>

      <!-- 案件状态分布 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span class="card-title">案件状态分布</span>
            </div>
          </template>
          <div ref="caseStatusChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="charts-row">
      <!-- 回款趋势图 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span class="card-title">回款趋势</span>
              <el-radio-group v-model="repaymentTrendType" size="small">
                <el-radio-button label="week">近7天</el-radio-button>
                <el-radio-button label="month">近30天</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="repaymentTrendChartRef" class="chart-container"></div>
        </el-card>
      </el-col>

      <!-- 催收员工作量 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span class="card-title">催收员工作量</span>
            </div>
          </template>
          <div ref="collectorWorkloadChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 待处理案件列表 -->
    <el-card shadow="never" class="pending-cases-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">待处理案件</span>
          <el-link type="primary" @click="handleViewAll">查看全部 →</el-link>
        </div>
      </template>
      <el-table :data="pendingCases" stripe>
        <el-table-column prop="caseNo" label="案件编号" width="150" />
        <el-table-column prop="customerName" label="客户姓名" width="100" />
        <el-table-column prop="customerPhone" label="联系电话" width="130" />
        <el-table-column prop="overdueAmount" label="逾期金额" width="120" align="right">
          <template #default="{ row }">
            <span style="color: #f56c6c">
              {{ formatAmount(row.overdueAmount) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueDays" label="逾期天数" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.overdueDays > 30 ? 'danger' : 'warning'">
              {{ row.overdueDays }}天
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="案件状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="assigneeName" label="分配人" width="100" />
        <el-table-column label="操作" width="100" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleViewCase(row)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Files, Money, Warning, User } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'

const router = useRouter()

// 统计数据
const stats = reactive({
  totalCases: 1250,
  casesChange: 8.5,
  repaymentAmount: 2580000,
  repaymentChange: 12.3,
  overdueCases: 345,
  overdueChange: -5.2,
  collectorCount: 25,
  avgCasesPerCollector: 50
})

// 图表类型
const caseTrendType = ref('week')
const repaymentTrendType = ref('week')

// 图表实例
const caseTrendChartRef = ref<HTMLElement>()
const caseStatusChartRef = ref<HTMLElement>()
const repaymentTrendChartRef = ref<HTMLElement>()
const collectorWorkloadChartRef = ref<HTMLElement>()

let caseTrendChart: ECharts | null = null
let caseStatusChart: ECharts | null = null
let repaymentTrendChart: ECharts | null = null
let collectorWorkloadChart: ECharts | null = null

// 待处理案件
const pendingCases = ref<any[]>([])

// 格式化金额
const formatAmount = (amount: number) => {
  if (amount >= 10000) {
    return `¥${(amount / 10000).toFixed(2)}万`
  }
  return `¥${amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`
}

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    pending: 'info',
    assigned: '',
    in_progress: 'primary',
    settled: 'success',
    bad_debt: 'danger'
  }
  return typeMap[status] || ''
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: '待分配',
    assigned: '已分配',
    in_progress: '进行中',
    settled: '已结清',
    bad_debt: '坏账'
  }
  return textMap[status] || status
}

// 初始化案件趋势图
const initCaseTrendChart = () => {
  if (!caseTrendChartRef.value) return
  caseTrendChart = echarts.init(caseTrendChartRef.value)
  updateCaseTrendChart()
}

// 更新案件趋势图
const updateCaseTrendChart = () => {
  if (!caseTrendChart) return
  
  const days = caseTrendType.value === 'week' ? 7 : 30
  const dates = Array.from({ length: days }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (days - 1 - i))
    return `${date.getMonth() + 1}/${date.getDate()}`
  })
  
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['新增案件', '结清案件']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '新增案件',
        type: 'line',
        data: Array.from({ length: days }, () => Math.floor(Math.random() * 50 + 20)),
        smooth: true,
        itemStyle: { color: '#409eff' }
      },
      {
        name: '结清案件',
        type: 'line',
        data: Array.from({ length: days }, () => Math.floor(Math.random() * 30 + 10)),
        smooth: true,
        itemStyle: { color: '#67c23a' }
      }
    ]
  }
  
  caseTrendChart.setOption(option)
}

// 初始化案件状态分布图
const initCaseStatusChart = () => {
  if (!caseStatusChartRef.value) return
  caseStatusChart = echarts.init(caseStatusChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center'
    },
    series: [
      {
        name: '案件状态',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 180, name: '待分配', itemStyle: { color: '#909399' } },
          { value: 320, name: '进行中', itemStyle: { color: '#409eff' } },
          { value: 450, name: '已结清', itemStyle: { color: '#67c23a' } },
          { value: 300, name: '坏账', itemStyle: { color: '#f56c6c' } }
        ]
      }
    ]
  }
  
  caseStatusChart.setOption(option)
}

// 初始化回款趋势图
const initRepaymentTrendChart = () => {
  if (!repaymentTrendChartRef.value) return
  repaymentTrendChart = echarts.init(repaymentTrendChartRef.value)
  updateRepaymentTrendChart()
}

// 更新回款趋势图
const updateRepaymentTrendChart = () => {
  if (!repaymentTrendChart) return
  
  const days = repaymentTrendType.value === 'week' ? 7 : 30
  const dates = Array.from({ length: days }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (days - 1 - i))
    return `${date.getMonth() + 1}/${date.getDate()}`
  })
  
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const param = params[0]
        return `${param.name}<br/>${param.seriesName}: ¥${param.value.toLocaleString()}`
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dates
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => `¥${value / 1000}k`
      }
    },
    series: [
      {
        name: '回款金额',
        type: 'bar',
        data: Array.from({ length: days }, () => Math.floor(Math.random() * 50000 + 30000)),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#67c23a' },
            { offset: 1, color: '#95d475' }
          ])
        }
      }
    ]
  }
  
  repaymentTrendChart.setOption(option)
}

// 初始化催收员工作量图
const initCollectorWorkloadChart = () => {
  if (!collectorWorkloadChartRef.value) return
  collectorWorkloadChart = echarts.init(collectorWorkloadChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['案件数', '回款金额(万)']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['催收员1', '催收员2', '催收员3', '催收员4', '催收员5']
    },
    yAxis: [
      {
        type: 'value',
        name: '案件数',
        position: 'left'
      },
      {
        type: 'value',
        name: '回款金额(万)',
        position: 'right'
      }
    ],
    series: [
      {
        name: '案件数',
        type: 'bar',
        data: [65, 58, 72, 55, 68],
        itemStyle: { color: '#409eff' }
      },
      {
        name: '回款金额(万)',
        type: 'bar',
        yAxisIndex: 1,
        data: [25, 28, 32, 22, 30],
        itemStyle: { color: '#67c23a' }
      }
    ]
  }
  
  collectorWorkloadChart.setOption(option)
}

// 生成待处理案件Mock数据
const generatePendingCases = () => {
  pendingCases.value = Array.from({ length: 10 }, (_, i) => ({
    id: String(i + 1),
    caseNo: `CASE${String(i + 1).padStart(6, '0')}`,
    customerName: `客户${i + 1}`,
    customerPhone: `138${String(10000000 + i).slice(0, 8)}`,
    overdueAmount: 5000 + i * 500,
    overdueDays: 20 + i * 5,
    status: ['pending', 'assigned', 'in_progress'][i % 3] as any,
    assigneeName: i % 3 === 0 ? '-' : `催收员${(i % 5) + 1}`
  }))
}

// 查看全部
const handleViewAll = () => {
  router.push('/case/list')
}

// 查看案件
const handleViewCase = (row: any) => {
  router.push(`/case/detail/${row.id}`)
}

// 监听图表类型变化
watch(caseTrendType, () => {
  updateCaseTrendChart()
})

watch(repaymentTrendType, () => {
  updateRepaymentTrendChart()
})

// 窗口大小变化时调整图表
const handleResize = () => {
  caseTrendChart?.resize()
  caseStatusChart?.resize()
  repaymentTrendChart?.resize()
  collectorWorkloadChart?.resize()
}

// 初始化
onMounted(() => {
  generatePendingCases()
  setTimeout(() => {
    initCaseTrendChart()
    initCaseStatusChart()
    initRepaymentTrendChart()
    initCollectorWorkloadChart()
    window.addEventListener('resize', handleResize)
  }, 100)
})

// 清理
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  caseTrendChart?.dispose()
  caseStatusChart?.dispose()
  repaymentTrendChart?.dispose()
  collectorWorkloadChart?.dispose()
})
</script>

<style scoped lang="scss">
.dashboard-container {
  padding: 16px;

  .stats-row {
    margin-bottom: 16px;
  }

  .stat-card {
    margin-bottom: 16px;

    :deep(.el-card__body) {
      padding: 10px;
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;

      .stat-icon {
        width: 64px;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        flex-shrink: 0;
      }

      .stat-info {
        flex: 1;
        min-width: 0;

        .stat-label {
          font-size: 14px;
          color: #909399;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 600;
          color: #303133;
          margin-bottom: 4px;
        }

        .stat-trend {
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;

          .trend-up {
            color: #f56c6c;
          }

          .trend-down {
            color: #67c23a;
          }

          .trend-label {
            color: #909399;
          }

          .trend-value {
            color: #303133;
            font-weight: 600;
          }
        }
      }
    }
  }

  .charts-row {
    margin-bottom: 16px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .card-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }
  }

  .chart-container {
    width: 100%;
    height: 350px;
  }

  .pending-cases-card {
    :deep(.el-card__body) {
      padding: 0;
    }

    :deep(.el-table) {
      border: none;
    }
  }
}
</style>
