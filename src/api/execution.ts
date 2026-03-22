import { request } from './request'
import type { ExecutionCase, ExecutionRespondent, ExecutionAcInfo } from '@/types/execution'

// 执行案件列表参数
export interface ExecutionListParams {
  currPage: number
  pageSize: number
  applicantName?: string
  name?: string
  idcard?: string
  phone?: string
  middleCaseNo?: string
  basicCaseNo?: string
  caseStatus?: number
  zxCaseStatus?: string
  caseStep?: string
}
// export interface ExecutionListParams {
//   currPage: number
//   pageSize: number
//   agentEndTime?: string  //代理截止日期 (案件分发时选择的代理截止日期)",
//   agentStartTime?: string  //代理开始日期 (案件分发日期)",
//   applicantId?: string //申请人ID",
//   casePool?: string   //处置类型0仲裁 1执行 ",
//   caseStatus?: number //"案件状态: 1待平台分案, 3待分配坐席, 4再催, 6停催, 10结清, 12已删除, 13在催-普通留案中, 14在催-特殊留案中, ",
//   createTime?: string
//   dataId?: number,
//   debtTotal?: string//"债务总额",
//   id?: string//"主键自增非负",
//   instalment?: string//"分期标记",
//   orgId?: string//"公司ID",
//   overdueStartTime?: string//"逾期开始时间",
//   productId?: string//"产品ID",
//   remark?: string//"备注",
//   respondentId?: string//"债务人ID",
//   updateTime?: string//"修改时间",
//   userGroupId?: string//"催收组ID(案件状态是待组长分案使用)",
//   userId?: string//"用户ID"


// }
// 执行案件列表结果
export interface ExecutionListResult {
  totalCount: number
  pageSize: number
  totalPage: number
  currPage: number
  total: number
  currentPage: number
  list: ExecutionCase[]


}

// 获取执行案件列表
export function getExecutionList(params: ExecutionListParams) {
  return request.post<ExecutionListResult>(
    '/case-zx-api/carryout/casezxinfo/pageListCaseZxInfo',
    params
  )
}

// 获取被申请人信息
export function getRespondentInfo(dataId: number) {
  return request.post<ExecutionRespondent>(
    '/case-zx-api/carryout/casezxDetail/respondent',
    { dataId }
  )
}

// 获取仲裁案件信息
export function getAcInfo(dataId: number) {
  return request.post<ExecutionAcInfo>(
    '/case-zx-api/carryout/casezxDetail/acInfo',
    { dataId }
  )
}
