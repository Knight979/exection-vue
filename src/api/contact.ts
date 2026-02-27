import { request } from './request'
import type { ContactRecord, PageParams, PageResult } from '@/types'

// 获取触达记录列表
export function getContactRecords(caseId: number, params?: PageParams) {
  return request.get<PageResult<ContactRecord>>(`/contact/list/${caseId}`, { params })
}

// 添加触达记录
export function addContactRecord(data: Partial<ContactRecord>) {
  return request.post('/contact/add', data)
}

// 更新触达记录
export function updateContactRecord(id: string, data: Partial<ContactRecord>) {
  return request.put(`/contact/update/${id}`, data)
}

// 删除触达记录
export function deleteContactRecord(id: string) {
  return request.delete(`/contact/delete/${id}`)
}
