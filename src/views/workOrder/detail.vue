<template>
  <div class="work-order-detail-container">
    <el-page-header :icon="ArrowLeft" title="返回" @back="handleBack">
      <template #content>
        <span class="page-title">工单详情</span>
      </template>
      <template #extra>
        <el-button
          v-if="workOrderDetail.orderStatus === 1"
          type="success"
          :icon="Check"
          @click="handleProcess"
        >
          处理工单
        </el-button>
        <el-button
          v-if="workOrderDetail.orderStatus === 1"
          type="warning"
          :icon="Promotion"
          @click="handleTransfer"
        >
          流转工单
        </el-button>
        <el-button
          v-if="workOrderDetail.orderStatus === 1"
          type="primary"
          :icon="CircleCheck"
          @click="handleResolve"
        >
          解决工单
        </el-button>
      </template>
    </el-page-header>

    <el-card v-loading="loading" shadow="never" style="margin-top: 16px">
      <!-- 工单基本信息 -->
      <div class="section">
        <div class="section-title">工单基本信息</div>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="工单编号">
            {{ workOrderDetail.id }}
          </el-descriptions-item>
          <el-descriptions-item label="案件编号">
            {{ workOrderDetail.caseNo }}
          </el-descriptions-item>
          <el-descriptions-item label="工单类型">
            <el-tag :type="getOrderTypeTag(workOrderDetail.orderType)">
              {{ getOrderTypeText(workOrderDetail.orderType) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="工单状态">
            <el-tag
              :type="workOrderDetail.orderStatus === 1 ? 'warning' : 'success'"
              size="large"
            >
              {{ workOrderDetail.orderStatus === 1 ? '解决中' : '已解决' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="来电手机号">
            {{ workOrderDetail.phone || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="是否已读">
            <el-tag
              :type="workOrderDetail.userRead ? 'success' : 'info'"
              size="small"
            >
              {{ workOrderDetail.userRead ? '已读' : '未读' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="处理人">
            {{ workOrderDetail.processorName }}
          </el-descriptions-item>
          <el-descriptions-item label="提交人">
            {{ workOrderDetail.committerName }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ formatDate(workOrderDetail.createTime) }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 关联案件信息 -->
      <div class="section">
        <div class="section-title">关联案件信息</div>
        <el-descriptions v-if="workOrderDetail.caseInfo" :column="3" border>
          <el-descriptions-item label="案件编号">
            <el-link type="primary" @click="handleViewCase">
              {{ workOrderDetail.caseInfo.caseNo }}
            </el-link>
          </el-descriptions-item>
          <el-descriptions-item label="客户姓名">
            {{ workOrderDetail.caseInfo.customerName }}
          </el-descriptions-item>
          <el-descriptions-item label="联系电话">
            {{ workOrderDetail.caseInfo.customerPhone }}
          </el-descriptions-item>
          <el-descriptions-item label="逾期金额">
            <span style="color: #f56c6c; font-weight: bold">
              {{ formatAmount(workOrderDetail.caseInfo.overdueAmount) }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="逾期天数">
            <el-tag
              :type="
                workOrderDetail.caseInfo.overdueDays > 30 ? 'danger' : 'warning'
              "
            >
              {{ workOrderDetail.caseInfo.overdueDays }}天
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="案件状态">
            <el-tag :type="getStatusType(workOrderDetail.caseInfo.status)">
              {{ getStatusText(workOrderDetail.caseInfo.status) }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
        <el-empty v-else description="暂无关联案件信息" />
      </div>

      <!-- 工单流转记录 -->
      <div class="section">
        <div class="section-title">工单流转记录</div>
        <el-timeline v-if="workOrderDetail.records?.length">
          <el-timeline-item
            v-for="record in workOrderDetail.records"
            :key="record.id"
            :timestamp="formatDate(record.opTime)"
            placement="top"
          >
            <el-card>
              <div class="record-header">
                <el-tag :type="getRecordTypeTag(record.recordType)" size="large">
                  {{ getRecordTypeText(record.recordType) }}
                </el-tag>
              </div>
              <el-descriptions :column="2" size="small" style="margin-top: 12px">
                <el-descriptions-item label="操作人">
                  {{ record.userName }}
                </el-descriptions-item>
                <el-descriptions-item label="处理人">
                  {{ record.processorName }}
                </el-descriptions-item>
                <el-descriptions-item label="操作时间" :span="2">
                  {{ formatDate(record.opTime) }}
                </el-descriptions-item>
                <el-descriptions-item label="流转说明" :span="2">
                  {{ record.recordRemark || '-' }}
                </el-descriptions-item>
              </el-descriptions>
            </el-card>
          </el-timeline-item>
        </el-timeline>
        <el-empty v-else description="暂无流转记录" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  ArrowLeft,
  Check,
  Promotion,
  CircleCheck
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const workOrderDetail = ref<any>({})

// 获取工单详情
const fetchWorkOrderDetail = async () => {
  loading.value = true
  try {
    const orderId = route.params.id as string
    // TODO: 调用API获取数据
    await new Promise(resolve => setTimeout(resolve, 500))
    workOrderDetail.value = generateMockDetail(orderId)
  } catch (error) {
    ElMessage.error('获取工单详情失败')
  } finally {
    loading.value = false
  }
}

// 生成Mock详情数据
const generateMockDetail = (id: string) => {
  return {
    id: Number(id),
    caseId: 1001,
    caseNo: 'CASE001001',
    orderType: 1,
    orderStatus: 1,
    phone: '13800138001',
    processor: 1,
    processorName: '处理人1',
    orgId: 1,
    committer: 2,
    committerName: '提交人1',
    userRead: true,
    createTime: '2024-01-15T10:00:00.000Z',
    updateTime: '2024-01-15T11:00:00.000Z',
    caseInfo: {
      caseNo: 'CASE001001',
      customerName: '张三',
      customerPhone: '13800138001',
      overdueAmount: 5000,
      overdueDays: 45,
      status: 'in_progress'
    },
    records: [
      {
        id: 1,
        orderId: Number(id),
        recordType: 1,
        recordRemark: '客户投诉催收人员态度问题',
        processor: 1,
        processorName: '处理人1',
        userId: 2,
        userName: '提交人1',
        opTime: '2024-01-15T10:00:00.000Z'
      },
      {
        id: 2,
        orderId: Number(id),
        recordType: 2,
        recordRemark: '已联系客户核实情况,转给主管处理',
        processor: 3,
        processorName: '主管1',
        userId: 1,
        userName: '处理人1',
        opTime: '2024-01-15T11:00:00.000Z'
      }
    ]
  }
}

// 格式化金额
const formatAmount = (amount: number) => {
  return `¥${amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`
}

// 格式化日期
const formatDate = (date?: string) => {
  return date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : '-'
}

// 获取工单类型标签
const getOrderTypeTag = (type: number) => {
  const typeMap: Record<number, any> = {
    1: 'danger',
    2: 'warning',
    3: 'primary',
    4: 'success'
  }
  return typeMap[type] || ''
}

// 获取工单类型文本
const getOrderTypeText = (type: number) => {
  const textMap: Record<number, string> = {
    1: '投诉',
    2: '协商还款',
    3: '信息报备',
    4: '客户回访'
  }
  return textMap[type] || ''
}

// 获取流转类型标签
const getRecordTypeTag = (type: number) => {
  const typeMap: Record<number, any> = {
    1: 'primary',
    2: 'warning',
    3: 'success'
  }
  return typeMap[type] || ''
}

// 获取流转类型文本
const getRecordTypeText = (type: number) => {
  const textMap: Record<number, string> = {
    1: '工单提交',
    2: '工单流转',
    3: '工单已解决'
  }
  return textMap[type] || ''
}

// 获取案件状态类型
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

// 获取案件状态文本
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

// 返回
const handleBack = () => {
  router.back()
}

// 查看案件
const handleViewCase = () => {
  router.push(`/case/detail/${workOrderDetail.value.caseId}`)
}

// 处理工单
const handleProcess = () => {
  ElMessage.info('处理工单功能开发中')
}

// 流转工单
const handleTransfer = () => {
  ElMessage.info('流转工单功能开发中')
}

// 解决工单
const handleResolve = () => {
  ElMessage.info('解决工单功能开发中')
}

// 初始化
onMounted(() => {
  fetchWorkOrderDetail()
})
</script>

<style scoped lang="scss">
.work-order-detail-container {
  padding: 16px;

  .page-title {
    font-size: 18px;
    font-weight: 600;
  }

  .section {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 16px;
      padding-left: 12px;
      border-left: 4px solid #3a8ee6;
    }
  }

  .record-header {
    margin-bottom: 8px;
  }

  :deep(.el-timeline-item__timestamp) {
    color: #909399;
    font-size: 13px;
  }
}
</style>
