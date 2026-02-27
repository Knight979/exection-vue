import { request } from './request'
import type { WorkOrder, WorkOrderRecord } from '@/types'

// 工单列表查询参数
export interface WorkOrderListParams {
  currPage: number
  pageSize: number
  orderId?: string
  caseNo?: string
  phone?: string
  orderType?: number
  orderStatus?: number
  createTimeStart?: string
  createTimeEnd?: string
}

// 工单列表返回结果
export interface WorkOrderListResult {
  totalCount: number
  pageSize: number
  totalPage: number
  currPage: number
  total: number
  currentPage: number
  list: WorkOrder[]
}

// 获取工单列表
export function getWorkOrderList(params: WorkOrderListParams) {
  return request.post<WorkOrderListResult>('/worksheet/workorder/pageListWorkOrder', params)
}

// 工单保存参数
export interface SaveWorkOrderParams {
  caseId: number
  orderStatus: number
  orderType: number
  orgId: number
  phone: string
  processor: number
  userRead: number
  recordRemark?: string
}

// 保存工单（新增）
export function saveWorkOrder(data: SaveWorkOrderParams) {
  return request.post('/worksheet/workorder/saveWorkOrder', data)
}

// 获取工单详情
export function getWorkOrderDetail(id: number) {
  return request.get<WorkOrder>(`/workOrder/detail/${id}`)
}

// 创建工单
export function createWorkOrder(data: Partial<WorkOrder>) {
  return request.post('/workOrder/create', data)
}

// 处理工单
export function processWorkOrder(id: number, data: { recordRemark: string; processor?: number }) {
  return request.post(`/workOrder/process/${id}`, data)
}

// 流转工单
export function transferWorkOrder(id: number, data: { processor: number; recordRemark: string }) {
  return request.post(`/workOrder/transfer/${id}`, data)
}

// 解决工单
export function resolveWorkOrder(id: number, data: { recordRemark: string }) {
  return request.post(`/workOrder/resolve/${id}`, data)
}

// 获取工单流转记录
export function getWorkOrderRecords(orderId: number) {
  return request.get<WorkOrderRecord[]>(`/workOrder/records/${orderId}`)
}
