/*
 * Description: 案件相关接口
 */
import { request } from './request'
import type { Case, CaseDetail, PageResult } from '@/types'

// 获取案件列表
export function getCaseList(params: Case) {
  return request.post<PageResult<Case>>('/case-zx-api/caseInfo/caseInfo/pageListCaseContract', params)
}

// 获取案件详情信息
export function getCaseDetail(params: CaseDetail) {
  return request.post<CaseDetail>(`/case-zx-api/caseInfo/caseInfo/infoCaseInfo`, params)
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


//案件列表上方分案按钮弹窗保存分案信息,可选择多个案件分配给某一个用户
export function saveAssignCaseInfo(data: { dataIds: string[]; agentId: string }) {
  return request.post('/case-zx-api/caseInfo/caseInfo/assignCaseInfo', data)
}