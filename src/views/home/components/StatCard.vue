<template>
  <div class="stat-card" :style="{ borderLeftColor: color }">
    <div class="stat-icon" :style="{ backgroundColor: color + '20' }">
      <el-icon :size="32" :style="{ color }">
        <component :is="icon" />
      </el-icon>
    </div>
    <div class="stat-content">
      <div class="stat-title">{{ title }}</div>
      <div class="stat-value">{{ prefix }}{{ formatNumber(value) }}</div>
      <div class="stat-change" :class="{ positive: change >= 0, negative: change < 0 }">
        <el-icon>
          <component :is="change >= 0 ? 'CaretTop' : 'CaretBottom'" />
        </el-icon>
        <span>{{ Math.abs(change) }}%</span>
        <span class="change-label">环比</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { CaretTop, CaretBottom } from '@element-plus/icons-vue'

defineProps<{
  title: string
  value: number
  change: number
  icon: string
  color: string
  prefix?: string
}>()

function formatNumber(num: number) {
  if (num >= 10000) {
    return (num / 10000).toFixed(2) + '万'
  }
  return num.toLocaleString()
}
</script>

<style scoped lang="scss">
.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background-color: #fff;
  border-radius: 8px;
  border-left: 4px solid;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.15);
  }
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
}

.stat-content {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;

  &.positive {
    color: #67c23a;
  }

  &.negative {
    color: #f56c6c;
  }

  .change-label {
    margin-left: 4px;
    color: #909399;
  }
}
</style>
