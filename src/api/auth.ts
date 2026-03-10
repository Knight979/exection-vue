import { request } from './request'
import type { LoginParams, LoginResult } from '@/types'
import axios from 'axios'

// 获取验证码图片（返回blob）
export function getCaptcha() {
  const timestamp = new Date().getTime()
  return axios.get(`${import.meta.env.VITE_API_BASE_URL}/case-zx-api/public/captcha/code.jpg?t=${timestamp}`, {
    responseType: 'blob'
  })
}

// 登录
export function login(data: LoginParams) {
  return request.post<LoginResult>('/case-zx-api/public/auth/adminLogin', data)
}

// 登出
export function logout() {
  return request.post('/case-zx-api/auth/logout')
}

// 刷新token
export function refreshToken(refreshToken: string) {
  return request.post<{ token: string; refreshToken: string }>('/case-zx-api/auth/refresh', { refreshToken })
}
