// 执行信息
export interface ExecutionInfo {
  id: number
  dataId: number
  middleCaseNo?: string
  basicCaseNo?: string
  basicFlag: boolean
  middleAcceptDay?: string
  basicAcceptDay?: string
  caseStep: string
  caseStatus: string
  middleCourt: string
  basicCourt: string
  province: string
  city: string
  area: string
  penaltyInterest: number
  delayInterest: number
  carryoutInterest: number
  middleUpJudge?: string
  middleUpPhone?: string
  middleExJudge?: string
  middleExPhone?: string
  basicUpJudge?: string
  basicUpPhone?: string
  basicExJudge?: string
  basicExPhone?: string
}

// 被申请人信息
export interface ExecutionRespondent {
  id: number
  dataId: number
  name: string
  idcard: string
  sex: number
  certAddress: string
  phone: string
  email: string
  provinces: string
  city: string
  homeAddr: string
}

// 仲裁案件信息
export interface ExecutionAcInfo {
  id: number
  dataId: number
  acCaseNo: string
  acName: string
  applicantName: string
  arbitrator: string
  secretary: string
  cost: number
  amount: number
  provisionalDate: string | null
  acceptDay: string | null
  setupDay: string | null
  organizeCourtDay: string | null
  openCourtDay: string | null
  judgeDate: string | null
  acStatus: number
}

// 执行案件
export interface ExecutionCase {
  id: number
  dataId: number
  applicantId: number
  applicantName: string
  respondentId: number
  productId: number
  productName: string
  orgId: number
  name: string
  idcard: string
  sex: number
  phone: string
  middleCaseNo: string
  basicCaseNo: string
  netTime: string | null
  caseStep: string
  zxCaseStatus: string
  middleCourt: string
  basicCourt: string | null
  userGroupId: number
  userId: number
  caseStatus: number
  debtTotal: number
  overdueStartTime: string
  agentStartTime: string
  agentEndTime: string
  casePool: number
  instalment: number
  remark: string
  updateTime: string
}
