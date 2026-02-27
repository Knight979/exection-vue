import { localStore, StorageKeys } from './storage'

/**
 * 获取Token
 * @returns Token字符串或null
 */
export const getToken = (): string | null => {
  return localStore.get<string>(StorageKeys.TOKEN)
}

/**
 * 设置Token
 * @param token Token字符串
 */
export const setToken = (token: string): void => {
  localStore.set(StorageKeys.TOKEN, token)
}

/**
 * 移除Token
 */
export const removeToken = (): void => {
  localStore.remove(StorageKeys.TOKEN)
}

/**
 * 获取刷新Token
 * @returns 刷新Token字符串或null
 */
export const getRefreshToken = (): string | null => {
  return localStore.get<string>(StorageKeys.REFRESH_TOKEN)
}

/**
 * 设置刷新Token
 * @param refreshToken 刷新Token字符串
 */
export const setRefreshToken = (refreshToken: string): void => {
  localStore.set(StorageKeys.REFRESH_TOKEN, refreshToken)
}

/**
 * 移除刷新Token
 */
export const removeRefreshToken = (): void => {
  localStore.remove(StorageKeys.REFRESH_TOKEN)
}

/**
 * 清除所有认证信息
 */
export const clearAuth = (): void => {
  removeToken()
  removeRefreshToken()
  localStore.remove(StorageKeys.USER_INFO)
  localStore.remove(StorageKeys.PERMISSIONS)
}

/**
 * 检查是否已登录
 * @returns 是否已登录
 */
export const isAuthenticated = (): boolean => {
  return !!getToken()
}

/**
 * 解析JWT Token
 * @param token Token字符串
 * @returns 解析后的payload对象
 */
export const parseJwtToken = (token: string): Record<string, any> | null => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Parse JWT token error:', error)
    return null
  }
}

/**
 * 检查Token是否过期
 * @param token Token字符串
 * @returns 是否过期
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = parseJwtToken(token)
  if (!payload || !payload.exp) return true
  
  // exp是秒级时间戳,需要转换为毫秒
  const expirationTime = payload.exp * 1000
  const currentTime = Date.now()
  
  return currentTime >= expirationTime
}

/**
 * 检查Token是否即将过期
 * @param token Token字符串
 * @param threshold 阈值(毫秒),默认5分钟
 * @returns 是否即将过期
 */
export const isTokenExpiringSoon = (
  token: string,
  threshold = 5 * 60 * 1000
): boolean => {
  const payload = parseJwtToken(token)
  if (!payload || !payload.exp) return true
  
  const expirationTime = payload.exp * 1000
  const currentTime = Date.now()
  
  return expirationTime - currentTime < threshold
}
