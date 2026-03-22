/*
 * @Author: Knight
 * @version: 2.0.0
 * @Date: 2026-03-05 17:14:42
 * @LastEditors: Knight
 * @LastEditTime: 2026-03-22 17:55:38
 */
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

// 执行案件列表
// 执行案件
export interface ExecutionCase {
  id: number // 编号
  dataId: number // 数据id
  name: string // 名字
  idcard: string // 被申请人身份证
  sex: number // 性别 0女 1男
  phone: string // 被申请人电话
  middleCaseNo: string // 中院执行案号
  basicCaseNo: string // 基层执行案号
  netTime: string | null // 网申时间
  caseStep: string // 案件当前阶段
  middleCourt: string // 中级法院
  basicCourt: string | null // 基础法院
  caseStatus: number // 当前案件状态
  basicFlag: boolean // 0中院执行 1基层执行
  middleAcceptDay?: string // 中院受理日期
  basicAcceptDay?: string // 基层立案时间
  province: string // 省份
  city: string // 市
  area: string // 县地区
  penaltyInterest: number // 利息罚息（违约金）
  delayInterest: number // 迟延履行金
  middleUpJudge?: string // 中院立案庭法官
  middleUpPhone?: string // 中院立案庭电话
  middleExJudge?: string // 中院执行庭法官
  middleExPhone?: string // 中院执行庭电话
  basicUpJudge?: string // 基院立案庭法官
  basicUpPhone?: string // 基院立案庭电话
  basicExJudge?: string // 基院执行庭法官
  basicExPhone?: string // 基院执行庭电话
}


