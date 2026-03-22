
import { request } from './request'
import type { User, PageParams, PageResult } from '@/types'

// 获取用户信息
export function getUserInfo() { 
  return request.get<User>('/user/info')
}

// 获取用户列表
export function getUserList(params: PageParams) {
  return request.post<PageResult<User>>('/case-zx-api/sys/sysUserInfo/pageListSysUser', { params })
}
// 创建用户
export function createUser(data: Partial<User>) {
  return request.post('/case-zx-api/sys/sysUserInfo/saveSysUser', data)
}
// 更新用户密码
export function updateUserPwd(data: Partial<User>) {
  return request.post(`/case-zx-api/sys/sysUserInfo/updatePwd`, { data })
}
// 修改用户信息
export function updateUser(data: Partial<User>) {
  return request.post(`/case-zx-api/sys/sysUserInfo/updateSysUser`, { data })
}

// 删除用户
export function deleteUser(data: Partial<User>) {
  return request.post(`/case-zx-api/sys/sysUserInfo/delSysUser`,  data )
}

// 更新用户状态
export function updateUserStatus(data: Partial<User>) {
  return request.post<PageResult<User>>(`/case-zx-api/sys/sysUserInfo/disabledUser`, { data })
}
