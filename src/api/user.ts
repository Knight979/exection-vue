import { request } from './request'
import type { User, PageParams, PageResult } from '@/types'

// 获取用户信息
export function getUserInfo() {
  return request.get<User>('/user/info')
}

// 获取用户列表
export function getUserList(params: PageParams) {
  return request.get<PageResult<User>>('/user/list', { params })
}

// 创建用户
export function createUser(data: Partial<User>) {
  return request.post('/user/create', data)
}

// 更新用户
export function updateUser(id: string, data: Partial<User>) {
  return request.put(`/user/update/${id}`, data)
}

// 删除用户
export function deleteUser(id: string) {
  return request.delete(`/user/delete/${id}`)
}

// 更新用户状态
export function updateUserStatus(id: string, status: number) {
  return request.put(`/user/status/${id}`, { status })
}
