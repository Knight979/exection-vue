<template>
  <div class="home-container">
    <h2 class="page-title">首页看板</h2>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4">
        <stat-card
          title="仲裁案件数"
          :value="stats?.arbitrationCount || 0"
          :change="calculateChange(0)"
          icon="Scale"
          color="#3a8ee6"
        />
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4">
        <stat-card
          title="执行案件数"
          :value="stats?.executionCount || 0"
          :change="calculateChange(1)"
          icon="FolderOpened"
          color="#67c23a"
        />
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4">
        <stat-card
          title="法院立案(本月)"
          :value="getCurrentMonthValue(stats?.courtFilingMonthly)"
          :change="calculateChange(2)"
          icon="Hammer"
          color="#e6a23c"
        />
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4">
        <stat-card
          title="回款金额(本月)"
          :value="getCurrentMonthValue(stats?.repaymentMonthly)"
          :change="calculateChange(3)"
          icon="Money"
          color="#f56c6c"
          prefix="¥"
        />
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4">
        <stat-card
          title="触达记录(本月)"
          :value="getCurrentMonthValue(stats?.contactMonthly)"
          :change="calculateChange(4)"
          icon="Phone"
          color="#909399"
        />
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="charts-row">
      <el-col :xs="24" :lg="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>法院立案月度趋势</span>
            </div>
          </template>
          <monthly-chart
            chart-id="courtFilingChart"
            :data="stats?.courtFilingMonthly || []"
            type="bar"
            color="#e6a23c"
          />
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>回款月度趋势</span>
            </div>
          </template>
          <monthly-chart
            chart-id="repaymentChart"
            :data="stats?.repaymentMonthly || []"
            type="line"
            color="#67c23a"
          />
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="24">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>触达记录月度趋势</span>
            </div>
          </template>
          <monthly-chart
            chart-id="contactChart"
            :data="stats?.contactMonthly || []"
            type="line"
            color="#3a8ee6"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import { storeToRefs } from 'pinia'
import type { MonthlyData } from '@/types'
import StatCard from './components/StatCard.vue'
import MonthlyChart from './components/MonthlyChart.vue'

const dashboardStore = useDashboardStore()
const { stats } = storeToRefs(dashboardStore)

// 获取当月数值
function getCurrentMonthValue(data?: MonthlyData[]) {
  if (!data || data.length === 0) return 0
  return data[data.length - 1]?.value || 0
}

// 计算环比变化(这里简化处理,使用mock数据)
function calculateChange(index: number) {
  const changes = [5.2, -2.3, 8.7, 12.5, 3.8]
  return changes[index] || 0
}

onMounted(async () => {
  try {
    await dashboardStore.fetchStats()
  } catch (error) {
    console.error('获取统计数据失败:', error)
    // 如果API调用失败,使用mock数据
    // stats.value = mockData
  }
})
</script>

<style scoped lang="scss">
.home-container {
  width: 100%;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 24px;
}

.stats-row {
  margin-bottom: 20px;
}

.charts-row {
  .el-col {
    margin-bottom: 20px;
  }
}

.chart-card {
  height: 400px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
  }

  :deep(.el-card__body) {
    height: calc(100% - 56px);
    padding: 10px;
  }
}
</style>
