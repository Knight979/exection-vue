// 工单类型枚举
export enum WorkOrderType {
  COMPLAINT = 1,
  NEGOTIATION = 2,
  INFORMATION = 3,
  CALLBACK = 4
}

// 工单状态枚举
export enum WorkOrderStatus {
  IN_PROGRESS = 1,
  RESOLVED = 2
}

// 工单流转类型枚举
export enum WorkOrderRecordType {
  SUBMIT = 1,
  TRANSFER = 2,
  RESOLVED = 3
}

// 工单
export interface WorkOrder {
  id: number
  caseId: number
  caseNo?: string // 案件编号（关联查询）
  orderType: WorkOrderType
  orderStatus: WorkOrderStatus
  phone?: string
  processor: number
  processorName?: string // 处理人姓名（关联查询）
  orgId: number
  committer: number
  committerName?: string // 提交人姓名（关联查询）
  userRead: number // 后台返回数字 0/1
  createTime: string
  updateTime: string
}

// 工单流转记录
export interface WorkOrderRecord {
  id: number
  orderId: number
  recordType: WorkOrderRecordType
  recordRemark: string
  processor: number
  userId: number
  opTime: string
}
