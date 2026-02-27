// 汇款人关系枚举
export enum RemitterRelation {
  IMMEDIATE_FAMILY = '1',
  FRIEND = '2',
  COLLEAGUE = '3',
  SELF = '4',
  ORGANIZATION = '5'
}

// 对账申请状态枚举
export enum CheckApplyStatus {
  PENDING_LEADER = 0,
  PENDING_FINANCE = 1,
  APPROVED = 2,
  REJECTED = 3,
  CANCELLED = 4
}

// 对账申请
export interface CheckApply {
  id: number
  caseId: number
  sno: string
  voucherMoney: number
  repayDate: string
  repayWay: string
  repayType?: string
  remitter: string
  remitterRelation: RemitterRelation
  remitterPhone: string
  respondentId: number
  applyUserId: number
  productId: number
  orgId: number
  status: CheckApplyStatus
  remark?: string
  requestRemark?: string
  createTime: string
  updateTime: string
}
