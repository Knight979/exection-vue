<template>
  <div class="case-detail-container">
    <el-page-header :icon="ArrowLeft" title="返回" @back="handleBack">
      <template #content>
        <span class="page-title">案件详情 - {{ caseDetail.name }}</span>
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
              {{ caseDetail.id }}
            </el-descriptions-item>
            <el-descriptions-item label="数据ID">
              {{ caseDetail.dataId }}
            </el-descriptions-item>
            <el-descriptions-item label="被申请人姓名">
              {{ caseDetail.name }}
            </el-descriptions-item>
            <el-descriptions-item label="性别">
              <el-tag :type="caseDetail.sex === 1 ? '' : 'danger'" size="small">
                {{ caseDetail.sex === 1 ? '男' : '女' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="身份证号">
              {{ caseDetail.idcard }}
            </el-descriptions-item>
            <el-descriptions-item label="联系电话">
              {{ caseDetail.phone }}
            </el-descriptions-item>
            <el-descriptions-item label="案件状态">
              <el-tag :type="getCaseStatusType(caseDetail.caseStatus)" size="large">
                {{ getCaseStatusText(caseDetail.caseStatus) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="处置类型">
              <el-tag :type="caseDetail.casePool === 0 ? 'warning' : 'success'" effect="plain">
                {{ caseDetail.casePool === 0 ? '仲裁' : '执行' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="分期标记">
              {{ caseDetail.instalment === 1 ? '是' : '否' }}
            </el-descriptions-item>
            <el-descriptions-item label="债务总额">
              <span class="amount-text">{{ formatAmount(caseDetail.debtTotal) }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="逾期开始时间">
              {{ formatDate(caseDetail.overdueStartTime) }}
            </el-descriptions-item>
            <el-descriptions-item label="代理开始日期">
              {{ formatDate(caseDetail.agentStartTime) }}
            </el-descriptions-item>
            <el-descriptions-item label="代理截止日期">
              {{ formatDate(caseDetail.agentEndTime) }}
            </el-descriptions-item>
            <el-descriptions-item label="申请人ID">
              {{ caseDetail.applicantId }}
            </el-descriptions-item>
            <el-descriptions-item label="产品ID">
              {{ caseDetail.productId }}
            </el-descriptions-item>
            <el-descriptions-item label="公司ID">
              {{ caseDetail.orgId }}
            </el-descriptions-item>
            <el-descriptions-item label="催收组ID">
              {{ caseDetail.userGroupId }}
            </el-descriptions-item>
            <el-descriptions-item label="用户ID">
              {{ caseDetail.userId }}
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
              {{ formatDate(caseDetail.createTime) }}
            </el-descriptions-item>
            <el-descriptions-item label="更新时间">
              {{ formatDate(caseDetail.updateTime) }}
            </el-descriptions-item>
            <el-descriptions-item label="备注" :span="3">
              {{ caseDetail.remark || '-' }}
            </el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>

        <!-- 借款信息 -->
        <el-tab-pane label="借款信息" name="loan">
          <el-descriptions :column="3" border>
            <el-descriptions-item label="借据号">
              {{ caseDetail.loanNo }}
            </el-descriptions-item>
            <el-descriptions-item label="逾期日期">
              {{ formatDate(caseDetail.overDate) }}
            </el-descriptions-item>
            <el-descriptions-item label="欠款金额">
              {{ formatAmount(caseDetail.debtAmount) }}
            </el-descriptions-item>
            <el-descriptions-item label="借款金额">
              {{ formatAmount(caseDetail.loanAmount) }}
            </el-descriptions-item>
            <el-descriptions-item label="期数">
              {{ caseDetail.period }}
            </el-descriptions-item>
            <el-descriptions-item label="合同时间">
              {{ formatDate(caseDetail.contractTime) }}
            </el-descriptions-item>
            <el-descriptions-item label="借款开始时间">
              {{ formatDate(caseDetail.borrowStartTime) }}
            </el-descriptions-item>
            <el-descriptions-item label="借款结束时间">
              {{ formatDate(caseDetail.borrowEndTime) }}
            </el-descriptions-item>
            <el-descriptions-item label="年利率">
              {{ caseDetail.yearRate }}%
            </el-descriptions-item>
            <el-descriptions-item label="月利率">
              {{ caseDetail.monthRate }}%
            </el-descriptions-item>
            <el-descriptions-item label="实际借款时间">
              {{ formatDate(caseDetail.actualBorrowTime) }}
            </el-descriptions-item>
            <el-descriptions-item label="总利息金额">
              {{ formatAmount(caseDetail.totalInterestAmount) }}
            </el-descriptions-item>
            <el-descriptions-item label="已还金额">
              {{ formatAmount(caseDetail.repaymentAmount) }}
            </el-descriptions-item>
            <el-descriptions-item label="已还利息">
              {{ formatAmount(caseDetail.repaymentInterest) }}
            </el-descriptions-item>
            <el-descriptions-item label="利息金额">
              {{ formatAmount(caseDetail.interestAmount) }}
            </el-descriptions-item>
            <el-descriptions-item label="借款用途" :span="3">
              {{ caseDetail.borrowPurpose || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="还款方式" :span="3">
              {{ caseDetail.repayWay || '-' }}
            </el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>

        <!-- 债务人详情 -->
        <el-tab-pane label="债务人详情" name="respondent">
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
          <el-empty v-else description="暂无债务人详细信息" />
        </el-tab-pane>

        <!-- 仲裁信息 -->
        <el-tab-pane label="仲裁信息" name="arbitration">
          <div v-if="caseDetail.arbitrationInfo">
            <el-button type="primary" :icon="Edit" style="margin-bottom: 16px" @click="handleEditArbitration">
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
              <el-descriptions-item label="结案日期">
                {{ formatDate(caseDetail.arbitrationInfo.closeDay) }}
              </el-descriptions-item>
              <el-descriptions-item label="裁决日期">
                {{ formatDate(caseDetail.arbitrationInfo.judgeDate) }}
              </el-descriptions-item>
              <el-descriptions-item label="仲裁状态">
                <el-tag :type="getArbitrationStatusType(caseDetail.arbitrationInfo.acStatus)">
                  {{ getArbitrationStatusText(caseDetail.arbitrationInfo.acStatus) }}
                </el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <el-empty v-else description="暂无仲裁信息" />
        </el-tab-pane>

        <!-- 执行信息 -->
        <el-tab-pane label="执行信息" name="execution">
          <div v-if="caseDetail.executionInfo">
            <el-button type="primary" :icon="Edit" style="margin-bottom: 16px" @click="handleEditExecution">
              编辑执行信息
            </el-button>
            <el-descriptions :column="3" border>
              <el-descriptions-item label="中院执行案号">
                {{ caseDetail.executionInfo.middleCaseNo || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="基层执行案号">
                {{ caseDetail.executionInfo.basicCaseNo || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="是否基层执行">
                {{ caseDetail.executionInfo.basicFlag ? '是' : '否' }}
              </el-descriptions-item>
              <el-descriptions-item label="中院受理日期">
                {{ formatDate(caseDetail.executionInfo.middleAcceptDay) }}
              </el-descriptions-item>
              <el-descriptions-item label="基院受理日期">
                {{ formatDate(caseDetail.executionInfo.basicAcceptDay) }}
              </el-descriptions-item>
              <el-descriptions-item label="案件阶段">
                {{ caseDetail.executionInfo.caseStep || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="案件状态">
                {{ caseDetail.executionInfo.caseStatus || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="中级法院">
                {{ caseDetail.executionInfo.middleCourt || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="基层法院">
                {{ caseDetail.executionInfo.basicCourt || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="省份">
                {{ caseDetail.executionInfo.province || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="城市">
                {{ caseDetail.executionInfo.city || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="区县">
                {{ caseDetail.executionInfo.area || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="利息罚息">
                {{ formatAmount(caseDetail.executionInfo.penaltyInterest || 0) }}
              </el-descriptions-item>
              <el-descriptions-item label="迟延履行金">
                {{ formatAmount(caseDetail.executionInfo.delayInterest || 0) }}
              </el-descriptions-item>
              <el-descriptions-item label="申请执行利率">
                {{ caseDetail.executionInfo.carryoutInterest || 0 }}%
              </el-descriptions-item>
              <el-descriptions-item label="中院立案法官">
                {{ caseDetail.executionInfo.middleUpJudge || '-' }} ({{ caseDetail.executionInfo.middleUpPhone || '-' }})
              </el-descriptions-item>
              <el-descriptions-item label="中院执行法官">
                {{ caseDetail.executionInfo.middleExJudge || '-' }} ({{ caseDetail.executionInfo.middleExPhone || '-' }})
              </el-descriptions-item>
              <el-descriptions-item label="基院立案法官">
                {{ caseDetail.executionInfo.basicUpJudge || '-' }} ({{ caseDetail.executionInfo.basicUpPhone || '-' }})
              </el-descriptions-item>
              <el-descriptions-item label="基院执行法官">
                {{ caseDetail.executionInfo.basicExJudge || '-' }} ({{ caseDetail.executionInfo.basicExPhone || '-' }})
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <el-empty v-else description="暂无执行信息" />
        </el-tab-pane>

        <!-- 触达记录 -->
        <el-tab-pane label="触达记录" name="contact">
          <el-timeline v-if="caseDetail.contactRecords && caseDetail.contactRecords.length">
            <el-timeline-item v-for="record in caseDetail.contactRecords" :key="record.id"
              :timestamp="formatDate(record.contactTime)" placement="top">
              <el-card shadow="hover">
                <div class="contact-record-header">
                  <el-tag :type="getContactTypeTag(record.contactType)">
                    {{ getContactTypeText(record.contactType) }}
                  </el-tag>
                  <el-tag :type="getCallStatusTag(record.callStatus)" style="margin-left: 8px">
                    {{ getCallStatusText(record.callStatus) }}
                  </el-tag>
                  <el-tag :type="getRepayWishTag(record.repayWish)" style="margin-left: 8px">
                    {{ getRepayWishText(record.repayWish) }}
                  </el-tag>
                </div>
                <el-descriptions :column="2" style="margin-top: 12px">
                  <el-descriptions-item label="触达对象">
                    {{ record.contactTargetName }} ({{ record.contactTargetType }})
                  </el-descriptions-item>
                  <el-descriptions-item label="联系电话">
                    {{ record.contactTargetPhone }}
                  </el-descriptions-item>
                  <el-descriptions-item label="触达详情" :span="2">
                    {{ record.contactTargetDetail || '-' }}
                  </el-descriptions-item>
                  <el-descriptions-item v-if="record.ptpMoney" label="承诺还款金额">
                    {{ formatAmount(record.ptpMoney) }}
                  </el-descriptions-item>
                  <el-descriptions-item v-if="record.ptpTime" label="承诺还款时间">
                    {{ record.ptpTime }}
                  </el-descriptions-item>
                  <el-descriptions-item v-if="record.nextContactTime" label="下次跟进时间">
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
import { getCaseDetail } from '@/api/case'
import { formatDate, formatAmount } from '@/utils/format'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const activeTab = ref('basic')
const caseDetail = ref<CaseDetail>({} as CaseDetail)

// 获取案件详情
const fetchCaseDetail = async () => {
  loading.value = true
  try {
    const id = route.params.id as string
    const res = await getCaseDetail({ id })
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 如果 API 返回了数据则使用，否则使用 Mock 数据（保持原逻辑）
    if (res && res.id) {
      caseDetail.value = res
    } else {
      caseDetail.value = generateMockDetail(id)
    }
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
    dataId: 1001,
    name: '张三',
    sex: 1,
    idcard: '420101199001011234',
    phone: '13800138001',
    applicantId: 1,
    respondentId: 1,
    productId: 1,
    orgId: 1,
    userGroupId: 1,
    userId: 1,
    caseStatus: 4,
    debtTotal: 55000,
    overdueStartTime: '2024-01-01',
    agentStartTime: '2024-01-05',
    agentEndTime: '2024-12-31',
    casePool: 0,
    instalment: 1,
    remark: '这是一个Mock案件备注',
    createTime: '2024-01-01T10:00:00Z',
    updateTime: '2024-03-22T15:30:00Z',
    
    // 借款信息
    loanNo: 'LOAN20240001',
    overDate: '2024-01-01',
    debtAmount: 50000,
    loanAmount: 48000,
    period: 12,
    contractTime: '2023-01-01',
    borrowStartTime: '2023-01-01',
    borrowEndTime: '2024-01-01',
    yearRate: 12.5,
    monthRate: 1.04,
    actualBorrowTime: '2023-01-02',
    totalInterestAmount: 5000,
    repaymentAmount: 45000,
    repaymentInterest: 3000,
    borrowAmount: 5000,
    interestAmount: 2000,
    borrowPurpose: '个人消费',
    repayWay: '等额本息',

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
        contactTargetDetail: '本人接听，承诺还款',
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

// 获取案件状态文本
const getCaseStatusText = (status: number) => {
  const statusMap: Record<number, string> = {
    1: "待平台分案",
    3: "待分配坐席",
    4: "再催",
    6: "停催",
    10: "结清",
    12: "已删除",
    13: "在催-普通留案",
    14: "在催-特殊留案"
  };
  return statusMap[status] || `未知状态(${status})`;
};

// 获取案件状态标签类型
const getCaseStatusType = (status: number) => {
  const typeMap: Record<number, string> = {
    1: "info",
    3: "warning",
    4: "primary",
    6: "danger",
    10: "success",
    12: "info",
    13: "",
    14: "warning"
  };
  return typeMap[status] || "";
};

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

  .amount-text {
    font-family: Monaco, Consolas, monospace;
    font-weight: bold;
    color: #f56c6c;
  }

  .contact-record-header {
    display: flex;
    align-items: center;
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
