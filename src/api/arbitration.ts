import { request } from './request'
import type { ArbitrationCase } from '@/types/arbitration'

// 仲裁案件列表查询参数
export interface ArbitrationListParams {
  currPage: number
  pageSize: number
  acCaseNo?: string // 仲裁案号
  acName?: string // 仲裁委名称
  applicantName?: string // 申请人
  acStatus?: number // 仲裁状态
  name?: string // 被申请人名字
  idcard?: string // 被申请人身份证
  phone?: string // 被申请人电话
  judgeDateStart?: string // 裁决日期开始
  judgeDateEnd?: string // 裁决日期结束
}

// 仲裁案件列表返回结果
export interface ArbitrationListResult {
  totalCount: number
  pageSize: number
  totalPage: number
  currPage: number
  total: number
  currentPage: number
  list: ArbitrationCase[]
}

// 获取仲裁案件列表
export function getArbitrationList(params: ArbitrationListParams) {
  return request.post<ArbitrationListResult>('/case-zx-api/carryout/caseacinfo/pageListCaseAcInfo', params)
}

// 获取仲裁案件详情
export function getArbitrationDetail(id: number) {
  return request.get<ArbitrationCase>(`/case-zx-api/carryout/caseacinfo/detail/${id}`)
}
