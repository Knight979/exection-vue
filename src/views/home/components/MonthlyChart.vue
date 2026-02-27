<template>
  <div :id="chartId" class="monthly-chart"></div>
</template>

<script setup lang="ts">
import { onMounted, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import type { MonthlyData } from '@/types'

const props = defineProps<{
  chartId: string
  data: MonthlyData[]
  type: 'line' | 'bar'
  color: string
}>()

let chartInstance: echarts.ECharts | null = null

function initChart() {
  const chartDom = document.getElementById(props.chartId)
  if (!chartDom) return

  chartInstance = echarts.init(chartDom)
  updateChart()
}

function updateChart() {
  if (!chartInstance) return

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
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
      data: props.data.map(item => item.month),
      axisLine: {
        lineStyle: {
          color: '#e4e7ed'
        }
      },
      axisLabel: {
        color: '#606266'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#606266'
      },
      splitLine: {
        lineStyle: {
          color: '#f2f6fc'
        }
      }
    },
    series: [
      {
        data: props.data.map(item => item.value),
        type: props.type,
        smooth: true,
        itemStyle: {
          color: props.color
        },
        areaStyle: props.type === 'line' ? {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: props.color + '80'
              },
              {
                offset: 1,
                color: props.color + '00'
              }
            ]
          }
        } : undefined
      }
    ]
  }

  chartInstance.setOption(option)
}

// 监听数据变化
watch(() => props.data, () => {
  updateChart()
}, { deep: true })

// 监听窗口大小变化
function handleResize() {
  chartInstance?.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<style scoped>
.monthly-chart {
  width: 100%;
  height: 100%;
}
</style>
