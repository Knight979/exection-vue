<template>
  <div class="check-apply-detail-container">
    <el-page-header :icon="ArrowLeft" title="返回" @back="handleBack">
      <template #content>
        <span class="page-title">对账详情</span>
      </template>
      <template #extra>
        <el-button
          v-if="checkApplyDetail.status === 0 || checkApplyDetail.status === 1"
          type="success"
          :icon="Check"
          @click="handleApprove('pass')"
        >
          通过
        </el-button>
        <el-button
          v-if="checkApplyDetail.status === 0 || checkApplyDetail.status === 1"
          type="danger"
          :icon="Close"
          @click="handleApprove('reject')"
        >
          驳回
        </el-button>
      </template>
    </el-page-header>

    <el-card v-loading="loading" shadow="never" style="margin-top: 16px">
      <!-- 对账申请信息 -->
      <div class="section">
        <div class="section-title">对账申请信息</div>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="流水号" :span="3">
            {{ checkApplyDetail.sno }}
          </el-descriptions-item>
          <el-descriptions-item label="案件编号">
            <el-link type="primary" @click="handleViewCase">
              {{ checkApplyDetail.caseNo }}
            </el-link>
          </el-descriptions-item>
          <el-descriptions-item label="债务人姓名">
            {{ checkApplyDetail.respondentName }}
          </el-descriptions-item>
          <el-descriptions-item label="凭证金额">
            <span style="color: #67c23a; font-weight: bold; font-size: 16px">
              {{ formatAmount(checkApplyDetail.voucherMoney) }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="还款日期">
            {{ formatDateShort(checkApplyDetail.repayDate) }}
          </el-descriptions-item>
          <el-descriptions-item label="还款方式">
            {{ checkApplyDetail.repayWay }}
          </el-descriptions-item>
          <el-descriptions-item label="还款类型">
            {{ checkApplyDetail.repayType || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="申请状态">
            <el-tag :type="getStatusTag(checkApplyDetail.status)" size="large">
              {{ getStatusText(checkApplyDetail.status) }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 汇款人信息 -->
      <div class="section">
        <div class="section-title">汇款人信息</div>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="汇款人姓名">
            {{ checkApplyDetail.remitter }}
          </el-descriptions-item>
          <el-descriptions-item label="汇款人手机号">
            {{ checkApplyDetail.remitterPhone }}
          </el-descriptions-item>
          <el-descriptions-item label="与客户关系">
            <el-tag>{{ getRelationText(checkApplyDetail.remitterRelation) }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 申请信息 -->
      <div class="section">
        <div class="section-title">申请信息</div>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="申请人">
            {{ checkApplyDetail.applyUserName }}
          </el-descriptions-item>
          <el-descriptions-item label="申请时间">
            {{ formatDate(checkApplyDetail.createTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            {{ formatDate(checkApplyDetail.updateTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="申请备注" :span="3">
            {{ checkApplyDetail.requestRemark || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="备注" :span="3">
            {{ checkApplyDetail.remark || '-' }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 审批流程 -->
      <div class="section">
        <div class="section-title">审批流程</div>
        <el-steps
          :active="getApprovalStep(checkApplyDetail.status)"
          :process-status="getApprovalStatus(checkApplyDetail.status)"
          align-center
        >
          <el-step title="待组长审批" description="组长审批中" />
          <el-step title="待财务审批" description="财务审批中" />
          <el-step
            :title="checkApplyDetail.status === 3 ? '审批不通过' : '审批通过'"
            :description="
              checkApplyDetail.status === 3 ? '审批被驳回' : '审批流程完成'
            "
          />
        </el-steps>

        <!-- 审批历史 -->
        <el-timeline v-if="checkApplyDetail.approvalHistory?.length" style="margin-top: 32px">
          <el-timeline-item
            v-for="record in checkApplyDetail.approvalHistory"
            :key="record.id"
            :timestamp="formatDate(record.approvalTime)"
            placement="top"
          >
            <el-card>
              <div class="approval-header">
                <span class="approval-title">{{ record.approvalTypeName }}</span>
                <el-tag
                  :type="record.approvalResult === 'pass' ? 'success' : 'danger'"
                  size="large"
                >
                  {{ record.approvalResult === 'pass' ? '通过' : '驳回' }}
                </el-tag>
              </div>
              <el-descriptions :column="2" size="small" style="margin-top: 12px">
                <el-descriptions-item label="审批人">
                  {{ record.approverName }}
                </el-descriptions-item>
                <el-descriptions-item label="审批时间">
                  {{ formatDate(record.approvalTime) }}
                </el-descriptions-item>
                <el-descriptions-item label="审批意见" :span="2">
                  {{ record.approvalOpinion || '-' }}
                </el-descriptions-item>
              </el-descriptions>
            </el-card>
          </el-timeline-item>
        </el-timeline>
        <el-empty v-else description="暂无审批记录" />
      </div>
    </el-card>

    <!-- 审批对话框 -->
    <el-dialog
      v-model="approvalDialogVisible"
      :title="approvalType === 'pass' ? '审批通过' : '审批驳回'"
      width="500px"
    >
      <el-form :model="approvalForm" label-width="100px">
        <el-form-item label="审批意见" required>
          <el-input
            v-model="approvalForm.opinion"
            type="textarea"
            :rows="4"
            :placeholder="
              approvalType === 'pass' ? '请输入审批意见(可选)' : '请输入驳回原因'
            "
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="approvalDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmApproval">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Check, Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const checkApplyDetail = ref<any>({})
const approvalDialogVisible = ref(false)
const approvalType = ref<'pass' | 'reject'>('pass')
const approvalForm = reactive({
  opinion: ''
})

// 获取对账详情
const fetchCheckApplyDetail = async () => {
  loading.value = true
  try {
    const applyId = route.params.id as string
    // TODO: 调用API获取数据
    await new Promise(resolve => setTimeout(resolve, 500))
    checkApplyDetail.value = generateMockDetail(applyId)
  } catch (error) {
    ElMessage.error('获取对账详情失败')
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
    sno: `SN${new Date().getTime()}0001`,
    voucherMoney: 5000,
    repayDate: '2024-01-15T00:00:00.000Z',
    repayWay: '支付宝',
    repayType: '部分还款',
    remitter: '张三',
    remitterRelation: '4',
    remitterPhone: '13800138001',
    respondentId: 1001,
    respondentName: '张三',
    applyUserId: 1,
    applyUserName: '申请人1',
    productId: 1,
    orgId: 1,
    status: 1,
    remark: '',
    requestRemark: '客户已通过支付宝还款5000元',
    createTime: '2024-01-15T10:00:00.000Z',
    updateTime: '2024-01-15T11:00:00.000Z',
    approvalHistory: [
      {
        id: 1,
        applyId: Number(id),
        approvalType: 'leader',
        approvalTypeName: '组长审批',
        approverId: 2,
        approverName: '组长1',
        approvalResult: 'pass',
        approvalOpinion: '同意',
        approvalTime: '2024-01-15T11:00:00.000Z'
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

// 格式化日期(短)
const formatDateShort = (date?: string) => {
  return date ? dayjs(date).format('YYYY-MM-DD') : '-'
}

// 获取关系文本
const getRelationText = (relation: string) => {
  const textMap: Record<string, string> = {
    '1': '直系亲属',
    '2': '朋友',
    '3': '同事',
    '4': '本人',
    '5': '机构代还'
  }
  return textMap[relation] || relation
}

// 获取状态标签
const getStatusTag = (status: number) => {
  const tagMap: Record<number, any> = {
    0: 'warning',
    1: 'warning',
    2: 'success',
    3: 'danger',
    4: 'info'
  }
  return tagMap[status] || ''
}

// 获取状态文本
const getStatusText = (status: number) => {
  const textMap: Record<number, string> = {
    0: '待组长审批',
    1: '待财务审批',
    2: '审批通过',
    3: '审批不通过',
    4: '已撤销'
  }
  return textMap[status] || ''
}

// 获取审批步骤
const getApprovalStep = (status: number) => {
  if (status === 0) return 1
  if (status === 1) return 2
  if (status === 2 || status === 3) return 3
  return 0
}

// 获取审批状态
const getApprovalStatus = (status: number) => {
  if (status === 3) return 'error'
  if (status === 2) return 'success'
  return 'process'
}

// 返回
const handleBack = () => {
  router.back()
}

// 查看案件
const handleViewCase = () => {
  router.push(`/case/detail/${checkApplyDetail.value.caseId}`)
}

// 审批
const handleApprove = (type: 'pass' | 'reject') => {
  approvalType.value = type
  approvalForm.opinion = ''
  approvalDialogVisible.value = true
}

// 确认审批
const handleConfirmApproval = async () => {
  if (approvalType.value === 'reject' && !approvalForm.opinion) {
    ElMessage.warning('请输入驳回原因')
    return
  }

  try {
    // TODO: 调用API提交审批
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success(`审批${approvalType.value === 'pass' ? '通过' : '驳回'}成功`)
    approvalDialogVisible.value = false
    fetchCheckApplyDetail()
  } catch (error) {
    ElMessage.error('审批失败')
  }
}

// 初始化
onMounted(() => {
  fetchCheckApplyDetail()
})
</script>

<style scoped lang="scss">
.check-apply-detail-container {
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

  .approval-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .approval-title {
      font-size: 15px;
      font-weight: 600;
      color: #303133;
    }
  }

  :deep(.el-timeline-item__timestamp) {
    color: #909399;
    font-size: 13px;
  }

  :deep(.el-steps) {
    padding: 0 20px;
  }
}
</style>
