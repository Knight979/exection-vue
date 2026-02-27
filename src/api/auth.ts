import { request } from './request'
import type { LoginParams, LoginResult } from '@/types'
import axios from 'axios'

// 获取验证码图片（返回blob）
export function getCaptcha() {
  const timestamp = new Date().getTime()
  return axios.get(`${import.meta.env.VITE_API_BASE_URL}/public/captcha/code.jpg?t=${timestamp}`, {
    responseType: 'blob'
  })
}

// 登录
export function login(data: LoginParams) {
  return request.post<LoginResult>('/public/auth/adminLogin', data)
}

// 登出
export function logout() {
  return request.post('/auth/logout')
}

// 刷新token
export function refreshToken(refreshToken: string) {
  return request.post<{ token: string; refreshToken: string }>('/auth/refresh', { refreshToken })
}
