import { request } from './request'
import type { CheckApply, PageParams, PageResult } from '@/types'

// 获取对账申请列表
export function getCheckApplyList(params: PageParams) {
  return request.get<PageResult<CheckApply>>('/checkApply/list', { params })
}

// 获取对账申请详情
export function getCheckApplyDetail(id: number) {
  return request.get<CheckApply>(`/checkApply/detail/${id}`)
}

// 创建对账申请
export function createCheckApply(data: Partial<CheckApply>) {
  return request.post('/checkApply/create', data)
}

// 审批对账申请
export function approveCheckApply(id: number, data: { status: number; remark?: string }) {
  return request.post(`/checkApply/approve/${id}`, data)
}

// 撤销对账申请
export function cancelCheckApply(id: number) {
  return request.post(`/checkApply/cancel/${id}`)
}
