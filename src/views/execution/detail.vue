<template>
  <div class="execution-detail-container">
    <!-- 标题栏 -->
    <div class="page-header">
      <span class="page-title">执行案件详情</span>
      <el-tag v-if="caseInfo" type="info" style="margin-left: 12px">
        dataId: {{ caseInfo.dataId }}
      </el-tag>
    </div>

    <!-- 被申请人信息 -->
    <el-card shadow="never" class="detail-card">
      <template #header>
        <span class="card-title">
          <el-icon><User /></el-icon>
          被申请人信息
        </span>
      </template>
      <div v-loading="loadingRespondent">
        <el-descriptions :column="3" border>
          <el-descriptions-item label="姓名">
            {{ respondent?.name || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="性别">
            <el-tag :type="respondent?.sex === 1 ? 'primary' : 'danger'" size="small">
              {{ respondent?.sex === 1 ? '男' : respondent?.sex === 0 ? '女' : '-' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="身份证号">
            {{ respondent?.idcard || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="联系电话">
            {{ respondent?.phone || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="联系邮箱">
            {{ respondent?.email || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="户籍省份">
            {{ respondent?.provinces || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="户籍城市">
            {{ respondent?.city || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="证件地址" :span="2">
            {{ respondent?.certAddress || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="家庭地址" :span="3">
            {{ respondent?.homeAddr || '-' }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>

    <!-- 仲裁案件信息 -->
    <el-card shadow="never" class="detail-card">
      <template #header>
        <span class="card-title">
          <el-icon><Document /></el-icon>
          仲裁案件信息
        </span>
      </template>
      <div v-loading="loadingAcInfo">
        <el-descriptions :column="3" border>
          <el-descriptions-item label="仲裁案号">
            {{ acInfo?.acCaseNo || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="仲裁委名称">
            {{ acInfo?.acName || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="申请人">
            {{ acInfo?.applicantName || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="仲裁案件状态">
            <el-tag :type="getAcStatusType(acInfo?.acStatus)" size="small">
              {{ getAcStatusText(acInfo?.acStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="仲裁标的">
            <span style="color: #f56c6c; font-weight: bold">
              {{ formatAmount(acInfo?.amount) }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="仲裁费用">
            {{ formatAmount(acInfo?.cost) }}
          </el-descriptions-item>
          <el-descriptions-item label="仲裁员">
            {{ acInfo?.arbitrator || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="仲裁秘书">
            {{ acInfo?.secretary || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="暂计日">
            {{ formatDate(acInfo?.provisionalDate) }}
          </el-descriptions-item>
          <el-descriptions-item label="受理日期">
            {{ formatDate(acInfo?.acceptDay) }}
          </el-descriptions-item>
          <el-descriptions-item label="立案日期">
            {{ formatDate(acInfo?.setupDay) }}
          </el-descriptions-item>
          <el-descriptions-item label="组庭日期">
            {{ formatDate(acInfo?.organizeCourtDay) }}
          </el-descriptions-item>
          <el-descriptions-item label="开庭日期">
            {{ formatDate(acInfo?.openCourtDay) }}
          </el-descriptions-item>
          <el-descriptions-item label="仲裁裁决日期">
            {{ formatDate(acInfo?.judgeDate) }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Document } from '@element-plus/icons-vue'
import type { ExecutionRespondent, ExecutionAcInfo } from '@/types/execution'
import { getRespondentInfo, getAcInfo } from '@/api/execution'
import dayjs from 'dayjs'

const route = useRoute()

// dataId 从路由参数获取
const dataId = Number(route.params.dataId)

// 执行案件基本信息（从 query 中读取用于显示标题）
const caseInfo = ref<{ dataId: number } | null>(null)

const loadingRespondent = ref(false)
const loadingAcInfo = ref(false)
const respondent = ref<ExecutionRespondent | null>(null)
const acInfo = ref<ExecutionAcInfo | null>(null)

// 格式化金额
const formatAmount = (amount?: number | null) => {
  if (amount === undefined || amount === null) return '-'
  return `¥${amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`
}

// 格式化日期
const formatDate = (date?: string | null) => {
  if (!date) return '-'
  return dayjs(date).format('YYYY-MM-DD')
}

// 仲裁状态类型
const getAcStatusType = (status?: number) => {
  if (status === undefined || status === null) return 'info'
  const map: Record<number, string> = {
    0: 'info',
    1: 'warning',
    2: 'success'
  }
  return (map[status] || 'info') as any
}

// 仲裁状态文本
const getAcStatusText = (status?: number) => {
  if (status === undefined || status === null) return '未知'
  const map: Record<number, string> = {
    0: '撤案',
    1: '待出裁',
    2: '已经出裁'
  }
  return map[status] || `状态${status}`
}

// 加载被申请人信息
const fetchRespondent = async () => {
  loadingRespondent.value = true
  try {
    respondent.value = await getRespondentInfo(dataId)
  } catch (e) {
    ElMessage.error('获取被申请人信息失败')
  } finally {
    loadingRespondent.value = false
  }
}

// 加载仲裁案件信息
const fetchAcInfo = async () => {
  loadingAcInfo.value = true
  try {
    acInfo.value = await getAcInfo(dataId)
  } catch (e) {
    ElMessage.error('获取仲裁案件信息失败')
  } finally {
    loadingAcInfo.value = false
  }
}

onMounted(() => {
  if (!dataId) {
    ElMessage.error('缺少 dataId 参数')
    return
  }
  caseInfo.value = { dataId }
  // 并行加载两个接口
  fetchRespondent()
  fetchAcInfo()
})
</script>

<style scoped lang="scss">
.execution-detail-container {
  padding: 20px;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.detail-card {
  margin-bottom: 16px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}
</style>
