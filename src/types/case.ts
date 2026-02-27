import type { LoanContract } from './loanContract'
import type { Respondent } from './respondent'
import type { ArbitrationInfo } from './arbitration'
import type { ExecutionInfo } from './execution'
import type { ContactRecord } from './contact'

// 案件状态枚举
export enum CaseStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  SETTLED = 'settled',
  BAD_DEBT = 'bad_debt'
}

// 案件基本信息
export interface Case {
  id: string
  dataId: string
  caseNo: string
  productId: number
  productName?: string
  loanNo: string
  customerName: string
  customerPhone: string
  customerIdCard: string
  loanAmount: number
  overdueAmount: number
  overdueDays: number
  status: CaseStatus
  assigneeId?: string
  assigneeName?: string
  acCaseNo?: string
  middleCaseNo?: string
  basicCaseNo?: string
  createTime: string
  updateTime?: string
}

// 案件详情
export interface CaseDetail extends Case {
  loanContract?: LoanContract
  respondent?: Respondent
  arbitrationInfo?: ArbitrationInfo
  executionInfo?: ExecutionInfo
  contactRecords: ContactRecord[]
  assignmentHistory: AssignmentRecord[]
}

// 分配记录
export interface AssignmentRecord {
  id: string
  caseId: string
  fromUserId?: string
  fromUserName?: string
  toUserId: string
  toUserName: string
  assignTime: string
  operatorId: string
  operatorName: string
}
