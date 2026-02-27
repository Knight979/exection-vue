// 仲裁案件状态枚举
export enum ArbitrationStatus {
  WITHDRAW = 0, // 撤案
  PENDING = 1, // 待出裁
  COMPLETED = 2 // 已经出裁
}

// 性别枚举
export enum Gender {
  FEMALE = 0, // 女
  MALE = 1 // 男
}

// 仲裁案件
export interface ArbitrationCase {
  id: number
  dataId: number
  name: string | null
  idcard: string | null
  sex: Gender | null
  certAddress: string | null
  phone: string | null
  acCaseNo: string // 仲裁案号
  acName: string // 仲裁委名称
  orgCode: string // 申请人编码
  applicantName: string | null // 申请人
  type: string // 案件类型
  arbitrator: string // 仲裁员
  secretary: string // 仲裁秘书
  cost: number // 仲裁费用
  amount: number // 仲裁标的
  provisionalDate: string // 暂计日
  acceptDay: string | null // 受理日期
  setupDay: string // 立案日期
  organizeCourtDay: string | null // 组庭日期
  openCourtDay: string | null // 开庭日期
  closeDay: string | null // 撤案日期
  judgeDate: string // 仲裁裁决日期
  acStatus: ArbitrationStatus // 仲裁状态
  remark: string // 备注
  createTime: string // 创建时间
  updateTime: string // 修改时间
}

// 仲裁信息（用于案件详情中的仲裁信息）
export interface ArbitrationInfo {
  id?: number
  dataId?: number // 数据ID
  acCaseNo?: string // 仲裁案号
  acName?: string // 仲裁委名称
  orgCode?: string // 申请人编码
  type?: string // 案件类型
  arbitrator?: string // 仲裁员
  secretary?: string // 仲裁秘书
  cost?: number // 仲裁费用
  amount?: number // 仲裁标的
  provisionalDate?: string // 暂计日
  acceptDay?: string // 受理日期
  setupDay?: string // 立案日期
  organizeCourtDay?: string // 组庭日期
  openCourtDay?: string // 开庭日期
  closeDay?: string // 撤案日期
  judgeDate?: string // 裁决日期
  acStatus?: ArbitrationStatus // 仲裁状态
  remark?: string // 备注
  createTime?: string // 创建时间
  updateTime?: string // 修改时间
}




