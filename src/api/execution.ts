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
    '/case-zx-api/caseInfo/caseInfo/pageListZxCase',
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
