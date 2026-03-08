import { request } from './request'
import type { Case, CaseDetail, PageParams, PageResult } from '@/types'

// 获取案件列表
export function getCaseList(params: PageParams) {
  return request.post<PageResult<Case>>('/case-zx-api/caseInfo/caseInfo/pageListCaseContract', params)
}

// 获取案件详情
export function getCaseDetail(id: string) {
  return request.get<CaseDetail>(`/case/detail/${id}`)
}

// 创建案件
export function createCase(data: Partial<Case>) {
  return request.post('/case/create', data)
}

// 更新案件
export function updateCase(id: string, data: Partial<Case>) {
  return request.put(`/case/update/${id}`, data)
}

// 删除案件
export function deleteCase(id: string) {
  return request.delete(`/case/delete/${id}`)
}

// 分配案件
export function assignCase(data: { caseIds: string[]; userId: string }) {
  return request.post('/case/assign', data)
}

// 更新案件状态
export function updateCaseStatus(id: string, status: string) {
  return request.put(`/case/status/${id}`, { status })
}
