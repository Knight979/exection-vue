<template>
  <div class="case-detail-container">
    <el-page-header :icon="ArrowLeft" title="返回" @back="handleBack">
      <template #content>
        <span class="page-title">案件详情</span>
      </template>
      <template #extra>
        <el-button type="primary" :icon="Plus" @click="handleAddContact">
          添加触达记录
        </el-button>
        <el-button type="success" :icon="User" @click="handleAssign">
          分配案件
        </el-button>
        <el-button type="warning" :icon="Edit" @click="handleStatusChange">
          状态变更
        </el-button>
      </template>
    </el-page-header>

    <el-card v-loading="loading" shadow="never" style="margin-top: 16px">
      <el-tabs v-model="activeTab" type="border-card">
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息" name="basic">
          <el-descriptions :column="3" border>
            <el-descriptions-item label="案件编号">
              {{ caseDetail.caseNo }}
            </el-descriptions-item>
            <el-descriptions-item label="数据ID">
              {{ caseDetail.dataId }}
            </el-descriptions-item>
            <el-descriptions-item label="借款编号">
              {{ caseDetail.loanNo }}
            </el-descriptions-item>
            <el-descriptions-item label="产品名称">
              {{ caseDetail.productName }}
            </el-descriptions-item>
            <el-descriptions-item label="客户姓名">
              {{ caseDetail.customerName }}
            </el-descriptions-item>
            <el-descriptions-item label="联系电话">
              {{ caseDetail.customerPhone }}
            </el-descriptions-item>
            <el-descriptions-item label="身份证号">
              {{ caseDetail.customerIdCard }}
            </el-descriptions-item>
            <el-descriptions-item label="贷款金额">
              <span style="color: #409eff; font-weight: bold">
                {{ formatAmount(caseDetail.loanAmount) }}
              </span>
            </el-descriptions-item>
            <el-descriptions-item label="逾期金额">
              <span style="color: #f56c6c; font-weight: bold">
                {{ formatAmount(caseDetail.overdueAmount) }}
              </span>
            </el-descriptions-item>
            <el-descriptions-item label="逾期天数">
              <el-tag
                :type="caseDetail.overdueDays > 30 ? 'danger' : 'warning'"
                size="large"
              >
                {{ caseDetail.overdueDays }}天
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="案件状态">
              <el-tag :type="getStatusType(caseDetail.status)" size="large">
                {{ getStatusText(caseDetail.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="分配人">
              {{ caseDetail.assigneeName || '未分配' }}
            </el-descriptions-item>
            <el-descriptions-item label="仲裁案号">
              {{ caseDetail.acCaseNo || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="中院执行案号">
              {{ caseDetail.middleCaseNo || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="基层执行案号">
              {{ caseDetail.basicCaseNo || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
              {{ formatDate(caseDetail.createTime) }}
            </el-descriptions-item>
            <el-descriptions-item label="更新时间">
              {{ formatDate(caseDetail.updateTime) }}
            </el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>

        <!-- 借款合同 -->
        <el-tab-pane label="借款合同" name="contract">
          <el-descriptions v-if="caseDetail.loanContract" :column="3" border>
            <el-descriptions-item label="借款编号">
              {{ caseDetail.loanContract.loanNo }}
            </el-descriptions-item>
            <el-descriptions-item label="借款金额">
              {{ formatAmount(caseDetail.loanContract.debtAmount) }}
            </el-descriptions-item>
            <el-descriptions-item label="放款金额">
              {{ formatAmount(caseDetail.loanContract.loanAmount || 0) }}
            </el-descriptions-item>
            <el-descriptions-item label="借款期限">
              {{ caseDetail.loanContract.period }}个月
            </el-descriptions-item>
            <el-descriptions-item label="年利率">
              {{ caseDetail.loanContract.yearRate }}%
            </el-descriptions-item>
            <el-descriptions-item label="月利率">
              {{ caseDetail.loanContract.monthRate }}%
            </el-descriptions-item>
            <el-descriptions-item label="合同签订时间">
              {{ formatDate(caseDetail.loanContract.contractTime) }}
            </el-descriptions-item>
            <el-descriptions-item label="借款开始时间">
              {{ formatDate(caseDetail.loanContract.borrowStartTime) }}
            </el-descriptions-item>
            <el-descriptions-item label="借款结束时间">
              {{ formatDate(caseDetail.loanContract.borrowEndTime) }}
            </el-descriptions-item>
            <el-descriptions-item label="实际到账时间">
              {{ formatDate(caseDetail.loanContract.actualBorrowTime) }}
            </el-descriptions-item>
            <el-descriptions-item label="还款本息">
              {{ formatAmount(caseDetail.loanContract.totalInterestAmount) }}
            </el-descriptions-item>
            <el-descriptions-item label="还款本金">
              {{ formatAmount(caseDetail.loanContract.repaymentAmount || 0) }}
            </el-descriptions-item>
            <el-descriptions-item label="还款利息">
              {{ formatAmount(caseDetail.loanContract.repaymentInterest || 0) }}
            </el-descriptions-item>
            <el-descriptions-item label="尚欠本金">
              {{ formatAmount(caseDetail.loanContract.borrowAmount || 0) }}
            </el-descriptions-item>
            <el-descriptions-item label="尚欠利息">
              {{ formatAmount(caseDetail.loanContract.interestAmount || 0) }}
            </el-descriptions-item>
            <el-descriptions-item label="借款用途" :span="3">
              {{ caseDetail.loanContract.borrowPurpose || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="还款方式" :span="3">
              {{ caseDetail.loanContract.repayWay || '-' }}
            </el-descriptions-item>
          </el-descriptions>
          <el-empty v-else description="暂无借款合同信息" />
        </el-tab-pane>

        <!-- 债务人信息 -->
        <el-tab-pane label="债务人信息" name="respondent">
          <el-descriptions v-if="caseDetail.respondent" :column="3" border>
            <el-descriptions-item label="姓名">
              {{ caseDetail.respondent.name }}
            </el-descriptions-item>
            <el-descriptions-item label="身份证号">
              {{ caseDetail.respondent.idcard }}
            </el-descriptions-item>
            <el-descriptions-item label="性别">
              {{ caseDetail.respondent.sex === 1 ? '男' : '女' }}
            </el-descriptions-item>
            <el-descriptions-item label="证件地址" :span="3">
              {{ caseDetail.respondent.certAddress }}
            </el-descriptions-item>
            <el-descriptions-item label="联系电话">
              {{ caseDetail.respondent.phone }}
            </el-descriptions-item>
            <el-descriptions-item label="电子邮箱" :span="2">
              {{ caseDetail.respondent.email || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="户籍省份">
              {{ caseDetail.respondent.provinces }}
            </el-descriptions-item>
            <el-descriptions-item label="户籍城市" :span="2">
              {{ caseDetail.respondent.city }}
            </el-descriptions-item>
            <el-descriptions-item label="家庭地址" :span="3">
              {{ caseDetail.respondent.homeAddr }}
            </el-descriptions-item>
            <el-descriptions-item label="工作单位" :span="3">
              {{ caseDetail.respondent.workInfo }}
            </el-descriptions-item>
            <el-descriptions-item label="单位地址" :span="3">
              {{ caseDetail.respondent.workAddr }}
            </el-descriptions-item>
          </el-descriptions>
          <el-empty v-else description="暂无债务人信息" />
        </el-tab-pane>

        <!-- 仲裁信息 -->
        <el-tab-pane label="仲裁信息" name="arbitration">
          <div v-if="caseDetail.arbitrationInfo">
            <el-button
              type="primary"
              :icon="Edit"
              style="margin-bottom: 16px"
              @click="handleEditArbitration"
            >
              编辑仲裁信息
            </el-button>
            <el-descriptions :column="3" border>
              <el-descriptions-item label="仲裁案号">
                {{ caseDetail.arbitrationInfo.acCaseNo || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="仲裁委名称" :span="2">
                {{ caseDetail.arbitrationInfo.acName || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="案件类型">
                {{ caseDetail.arbitrationInfo.type || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="仲裁员">
                {{ caseDetail.arbitrationInfo.arbitrator || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="仲裁秘书">
                {{ caseDetail.arbitrationInfo.secretary || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="仲裁费用">
                {{ formatAmount(caseDetail.arbitrationInfo.cost || 0) }}
              </el-descriptions-item>
              <el-descriptions-item label="仲裁标的" :span="2">
                {{ formatAmount(caseDetail.arbitrationInfo.amount || 0) }}
              </el-descriptions-item>
              <el-descriptions-item label="暂计日">
                {{ formatDate(caseDetail.arbitrationInfo.provisionalDate) }}
              </el-descriptions-item>
              <el-descriptions-item label="受理日期">
                {{ formatDate(caseDetail.arbitrationInfo.acceptDay) }}
              </el-descriptions-item>
              <el-descriptions-item label="立案日期">
                {{ formatDate(caseDetail.arbitrationInfo.setupDay) }}
              </el-descriptions-item>
              <el-descriptions-item label="组庭日期">
                {{ formatDate(caseDetail.arbitrationInfo.organizeCourtDay) }}
              </el-descriptions-item>
              <el-descriptions-item label="开庭日期">
                {{ formatDate(caseDetail.arbitrationInfo.openCourtDay) }}
              </el-descriptions-item>
              <el-descriptions-item label="撤案日期">
                {{ formatDate(caseDetail.arbitrationInfo.closeDay) }}
              </el-descriptions-item>
              <el-descriptions-item label="仲裁裁决日期">
                {{ formatDate(caseDetail.arbitrationInfo.judgeDate) }}
              </el-descriptions-item>
              <el-descriptions-item label="仲裁状态" :span="2">
                <el-tag :type="getArbitrationStatusType(caseDetail.arbitrationInfo.acStatus)">
                  {{ getArbitrationStatusText(caseDetail.arbitrationInfo.acStatus) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="备注" :span="3">
                {{ caseDetail.arbitrationInfo.remark || '-' }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <el-empty v-else description="暂无仲裁信息" />
        </el-tab-pane>

        <!-- 执行信息 -->
        <el-tab-pane label="执行信息" name="execution">
          <div v-if="caseDetail.executionInfo">
            <el-button
              type="primary"
              :icon="Edit"
              style="margin-bottom: 16px"
              @click="handleEditExecution"
            >
              编辑执行信息
            </el-button>
            <el-descriptions :column="3" border>
              <el-descriptions-item label="中院执行案号">
                {{ caseDetail.executionInfo.middleCaseNo || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="基层执行案号" :span="2">
                {{ caseDetail.executionInfo.basicCaseNo || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="执行标识">
                {{ caseDetail.executionInfo.basicFlag ? '基层执行' : '中院执行' }}
              </el-descriptions-item>
              <el-descriptions-item label="中院受理日期">
                {{ formatDate(caseDetail.executionInfo.middleAcceptDay) }}
              </el-descriptions-item>
              <el-descriptions-item label="基层立案时间">
                {{ formatDate(caseDetail.executionInfo.basicAcceptDay) }}
              </el-descriptions-item>
              <el-descriptions-item label="案件当前阶段">
                {{ caseDetail.executionInfo.caseStep }}
              </el-descriptions-item>
              <el-descriptions-item label="当前案件状态" :span="2">
                {{ caseDetail.executionInfo.caseStatus }}
              </el-descriptions-item>
              <el-descriptions-item label="中级法院">
                {{ caseDetail.executionInfo.middleCourt }}
              </el-descriptions-item>
              <el-descriptions-item label="基础法院" :span="2">
                {{ caseDetail.executionInfo.basicCourt }}
              </el-descriptions-item>
              <el-descriptions-item label="省份">
                {{ caseDetail.executionInfo.province }}
              </el-descriptions-item>
              <el-descriptions-item label="市">
                {{ caseDetail.executionInfo.city }}
              </el-descriptions-item>
              <el-descriptions-item label="县地区">
                {{ caseDetail.executionInfo.area }}
              </el-descriptions-item>
              <el-descriptions-item label="利息罚息">
                {{ formatAmount(caseDetail.executionInfo.penaltyInterest) }}
              </el-descriptions-item>
              <el-descriptions-item label="迟延履行金">
                {{ formatAmount(caseDetail.executionInfo.delayInterest) }}
              </el-descriptions-item>
              <el-descriptions-item label="申请执行利率">
                {{ caseDetail.executionInfo.carryoutInterest }}%
              </el-descriptions-item>
              <el-descriptions-item label="中院立案庭法官">
                {{ caseDetail.executionInfo.middleUpJudge || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="中院立案庭电话" :span="2">
                {{ caseDetail.executionInfo.middleUpPhone || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="中院执行庭法官">
                {{ caseDetail.executionInfo.middleExJudge || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="中院执行庭电话" :span="2">
                {{ caseDetail.executionInfo.middleExPhone || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="基院立案庭法官">
                {{ caseDetail.executionInfo.basicUpJudge || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="基院立案庭电话" :span="2">
                {{ caseDetail.executionInfo.basicUpPhone || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="基院执行庭法官">
                {{ caseDetail.executionInfo.basicExJudge || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="基院执行庭电话" :span="2">
                {{ caseDetail.executionInfo.basicExPhone || '-' }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <el-empty v-else description="暂无执行信息" />
        </el-tab-pane>

        <!-- 触达记录 -->
        <el-tab-pane label="触达记录" name="contact">
          <el-button
            type="primary"
            :icon="Plus"
            style="margin-bottom: 16px"
            @click="handleAddContact"
          >
            添加触达记录
          </el-button>
          <el-timeline v-if="caseDetail.contactRecords?.length">
            <el-timeline-item
              v-for="record in caseDetail.contactRecords"
              :key="record.id"
              :timestamp="formatDate(record.contactTime)"
              placement="top"
            >
              <el-card>
                <el-descriptions :column="2" size="small">
                  <el-descriptions-item label="触达方式">
                    <el-tag :type="getContactTypeTag(record.contactType)">
                      {{ getContactTypeText(record.contactType) }}
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="触达对象">
                    {{ record.contactTargetName }}
                    ({{ record.contactTargetType }})
                  </el-descriptions-item>
                  <el-descriptions-item label="联系电话">
                    {{ record.contactTargetPhone }}
                  </el-descriptions-item>
                  <el-descriptions-item label="通话状态">
                    <el-tag :type="getCallStatusTag(record.callStatus)">
                      {{ getCallStatusText(record.callStatus) }}
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="还款意愿" :span="2">
                    <el-tag :type="getRepayWishTag(record.repayWish)">
                      {{ getRepayWishText(record.repayWish) }}
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item
                    v-if="record.ptpMoney"
                    label="PTP金额"
                  >
                    {{ formatAmount(record.ptpMoney) }}
                  </el-descriptions-item>
                  <el-descriptions-item
                    v-if="record.ptpTime"
                    label="PTP时间"
                  >
                    {{ formatDate(record.ptpTime) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="下次跟进">
                    {{
                      record.nextContactType === 1
                        ? '需跟进'
                        : '无需跟进'
                    }}
                  </el-descriptions-item>
                  <el-descriptions-item
                    v-if="record.nextContactTime"
                    label="下次跟进时间"
                  >
                    {{ formatDate(record.nextContactTime) }}
                  </el-descriptions-item>
                </el-descriptions>
              </el-card>
            </el-timeline-item>
          </el-timeline>
          <el-empty v-else description="暂无触达记录" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Plus, User, Edit } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { CaseDetail } from '@/types/case'
import dayjs from 'dayjs'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const activeTab = ref('basic')
const caseDetail = ref<CaseDetail>({} as CaseDetail)

// 获取案件详情
const fetchCaseDetail = async () => {
  loading.value = true
  try {
    const caseId = route.params.id as string
    // TODO: 调用API获取数据
    // const res = await caseApi.getCaseDetail(caseId)
    
    // Mock数据
    await new Promise(resolve => setTimeout(resolve, 500))
    caseDetail.value = generateMockDetail(caseId)
  } catch (error) {
    ElMessage.error('获取案件详情失败')
  } finally {
    loading.value = false
  }
}

// 生成Mock详情数据
const generateMockDetail = (id: string): CaseDetail => {
  return {
    id,
    dataId: '1001',
    caseNo: 'CASE000001',
    productId: 1,
    productName: '极速贷',
    loanNo: 'LOAN00010001',
    customerName: '张三',
    customerPhone: '13800138001',
    customerIdCard: '420101199001011234',
    loanAmount: 50000,
    overdueAmount: 5000,
    overdueDays: 45,
    status: 'in_progress' as any,
    assigneeId: '1',
    assigneeName: '催收员1',
    acCaseNo: 'ZC2024001',
    middleCaseNo: 'ZY2024001',
    basicCaseNo: 'JC2024001',
    createTime: '2024-01-01T00:00:00.000Z',
    updateTime: '2024-01-15T00:00:00.000Z',
    loanContract: {
      id: 1,
      dataId: 1001,
      loanNo: 'LOAN00010001',
      productId: 1,
      overDate: '2024-01-01',
      debtAmount: 50000,
      loanAmount: 48000,
      period: 12,
      contractTime: '2023-01-01',
      borrowStartTime: '2023-01-01',
      borrowEndTime: '2024-01-01',
      yearRate: 12.0,
      monthRate: 1.0,
      actualBorrowTime: '2023-01-02',
      totalInterestAmount: 56000,
      repaymentAmount: 45000,
      repaymentInterest: 3000,
      borrowAmount: 5000,
      interestAmount: 2000,
      borrowPurpose: '个人消费',
      repayWay: '等额本息',
      updateTime: '2024-01-15T00:00:00.000Z',
      createTime: '2023-01-01T00:00:00.000Z'
    },
    respondent: {
      id: 1,
      dataId: 1001,
      name: '张三',
      idcard: '420101199001011234',
      sex: 1,
      certAddress: '湖北省武汉市江岸区XX街道XX号',
      phone: '13800138001',
      email: 'zhangsan@example.com',
      provinces: '湖北省',
      city: '武汉市',
      homeAddr: '湖北省武汉市江岸区XX街道XX号',
      workInfo: 'XX科技有限公司',
      workAddr: '湖北省武汉市洪山区XX路XX号',
      remark: '',
      updateTime: '2024-01-15T00:00:00.000Z',
      createTime: '2023-01-01T00:00:00.000Z'
    },
    arbitrationInfo: {
      id: 1,
      dataId: 1001,
      acCaseNo: 'ZC2024001',
      acName: '武汉仲裁委员会',
      orgCode: 'ORG001',
      type: '金融借贷纠纷',
      arbitrator: '王仲裁员',
      secretary: '李秘书',
      cost: 5000,
      amount: 55000,
      provisionalDate: '2024-01-05',
      acceptDay: '2024-01-10',
      setupDay: '2024-01-15',
      organizeCourtDay: '2024-01-20',
      openCourtDay: '2024-02-01',
      closeDay: '',
      judgeDate: '2024-02-15',
      acStatus: 2,
      remark: '',
      createTime: '2024-01-05T00:00:00.000Z',
      updateTime: '2024-02-15T00:00:00.000Z'
    },
    executionInfo: {
      id: 1,
      dataId: 1001,
      middleCaseNo: 'ZY2024001',
      basicCaseNo: 'JC2024001',
      basicFlag: true,
      middleAcceptDay: '2024-03-01',
      basicAcceptDay: '2024-03-10',
      caseStep: '执行中',
      caseStatus: '财产调查',
      middleCourt: '湖北省高级人民法院',
      basicCourt: '武汉市江岸区人民法院',
      province: '湖北省',
      city: '武汉市',
      area: '江岸区',
      penaltyInterest: 2000,
      delayInterest: 500,
      carryoutInterest: 3.5,
      middleUpJudge: '张法官',
      middleUpPhone: '027-12345678',
      middleExJudge: '李法官',
      middleExPhone: '027-87654321',
      basicUpJudge: '王法官',
      basicUpPhone: '027-11111111',
      basicExJudge: '赵法官',
      basicExPhone: '027-22222222'
    },
    contactRecords: [
      {
        id: '1',
        caseId: 1001,
        userId: 1,
        productId: 1,
        orgId: 1,
        groupId: 1,
        contactType: 1,
        contactTime: '2024-01-20T10:00:00.000Z',
        contactTargetType: '本人',
        contactTargetName: '张三',
        contactTargetPhone: '13800138001',
        contactTargetAddress: '湖北省武汉市',
        contactTargetDetail: '本人接听',
        callStatus: 1,
        repayWish: 11,
        ptpMoney: 5000,
        ptpTime: '2024-01-25',
        nextContactType: 1,
        nextContactTime: '2024-01-25T10:00:00.000Z',
        newAttr: false,
        callId: 'CALL001',
        currentCaseTotal: 5000,
        currentCaseOverdueDay: 45,
        createTime: '2024-01-20T10:00:00.000Z'
      }
    ],
    assignmentHistory: []
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

// 获取仲裁状态类型
const getArbitrationStatusType = (status?: number) => {
  if (status === undefined) return ''
  const typeMap: Record<number, any> = {
    0: 'info',
    1: 'warning',
    2: 'success'
  }
  return typeMap[status] || ''
}

// 获取仲裁状态文本
const getArbitrationStatusText = (status?: number) => {
  if (status === undefined) return '-'
  const textMap: Record<number, string> = {
    0: '撤案',
    1: '待出裁',
    2: '已经出裁'
  }
  return textMap[status] || '-'
}

// 获取触达方式标签
const getContactTypeTag = (type: number) => {
  const typeMap: Record<number, any> = {
    1: 'primary',
    2: 'success',
    3: 'warning'
  }
  return typeMap[type] || ''
}

// 获取触达方式文本
const getContactTypeText = (type: number) => {
  const textMap: Record<number, string> = {
    1: '电话催收',
    2: '微信',
    3: '网查'
  }
  return textMap[type] || ''
}

// 获取通话状态标签
const getCallStatusTag = (status: number) => {
  return status === 1 ? 'success' : 'info'
}

// 获取通话状态文本
const getCallStatusText = (status: number) => {
  const textMap: Record<number, string> = {
    1: '正常接通',
    2: '无人接听',
    3: '关机',
    4: '挂机',
    5: '停机',
    6: '正在通话',
    7: '来电提醒',
    8: '空号',
    9: '暂时无法接通',
    10: '呼叫限制',
    20: '通话中挂断'
  }
  return textMap[status] || ''
}

// 获取还款意愿标签
const getRepayWishTag = (wish: number) => {
  if ([11, 12, 13].includes(wish)) return 'success'
  if ([14, 15, 26].includes(wish)) return 'danger'
  return ''
}

// 获取还款意愿文本
const getRepayWishText = (wish: number) => {
  const textMap: Record<number, string> = {
    1: '需跟进',
    2: '无需跟进',
    11: '承诺还款',
    12: '已还款-还款已收到',
    13: '客称已还款-平台处理中',
    14: '违诺或跳票',
    15: '无还款意愿',
    21: '接听人承诺转告债务人',
    22: '有还款意愿无还款能力',
    23: '是借款本人但否认借款',
    24: '否认本人,且不认识借款人',
    25: '否认本人但认识借款人',
    26: '接听人态度恶劣',
    27: '号码易主',
    31: '借款人入狱或死亡',
    32: '借款人因病住院或意外伤残',
    33: '其他'
  }
  return textMap[wish] || ''
}

// 返回
const handleBack = () => {
  router.back()
}

// 添加触达记录
const handleAddContact = () => {
  ElMessage.info('添加触达记录功能开发中')
}

// 分配案件
const handleAssign = () => {
  ElMessage.info('分配案件功能开发中')
}

// 状态变更
const handleStatusChange = () => {
  ElMessage.info('状态变更功能开发中')
}

// 编辑仲裁信息
const handleEditArbitration = () => {
  ElMessage.info('编辑仲裁信息功能开发中')
}

// 编辑执行信息
const handleEditExecution = () => {
  ElMessage.info('编辑执行信息功能开发中')
}

// 初始化
onMounted(() => {
  fetchCaseDetail()
})
</script>

<style scoped lang="scss">
.case-detail-container {
  padding: 16px;

  .page-title {
    font-size: 18px;
    font-weight: 600;
  }

  :deep(.el-timeline-item__timestamp) {
    color: #909399;
    font-size: 13px;
  }

  :deep(.el-descriptions__label) {
    width: 140px;
  }
}
</style>
