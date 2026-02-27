/**
 * 本地存储工具类
 * 支持localStorage和sessionStorage
 * 自动处理JSON序列化和反序列化
 */

type StorageType = 'local' | 'session'

class Storage {
  private storage: globalThis.Storage

  constructor(type: StorageType = 'local') {
    this.storage = type === 'local' ? localStorage : sessionStorage
  }

  /**
   * 设置存储项
   * @param key 键名
   * @param value 值(自动JSON序列化)
   */
  set<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value)
      this.storage.setItem(key, serializedValue)
    } catch (error) {
      console.error('Storage set error:', error)
    }
  }

  /**
   * 获取存储项
   * @param key 键名
   * @param defaultValue 默认值
   * @returns 值(自动JSON反序列化)
   */
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const value = this.storage.getItem(key)
      if (value === null) {
        return defaultValue ?? null
      }
      return JSON.parse(value) as T
    } catch (error) {
      console.error('Storage get error:', error)
      return defaultValue ?? null
    }
  }

  /**
   * 移除存储项
   * @param key 键名
   */
  remove(key: string): void {
    this.storage.removeItem(key)
  }

  /**
   * 清空所有存储项
   */
  clear(): void {
    this.storage.clear()
  }

  /**
   * 获取所有键名
   * @returns 键名数组
   */
  keys(): string[] {
    return Object.keys(this.storage)
  }

  /**
   * 检查键是否存在
   * @param key 键名
   * @returns 是否存在
   */
  has(key: string): boolean {
    return this.storage.getItem(key) !== null
  }

  /**
   * 获取存储项数量
   * @returns 数量
   */
  size(): number {
    return this.storage.length
  }

  /**
   * 设置带过期时间的存储项
   * @param key 键名
   * @param value 值
   * @param expires 过期时间(毫秒)
   */
  setWithExpiry<T>(key: string, value: T, expires: number): void {
    const item = {
      value,
      expires: Date.now() + expires
    }
    this.set(key, item)
  }

  /**
   * 获取带过期时间的存储项
   * @param key 键名
   * @param defaultValue 默认值
   * @returns 值或null(已过期)
   */
  getWithExpiry<T>(key: string, defaultValue?: T): T | null {
    const item = this.get<{ value: T; expires: number }>(key)
    if (!item) {
      return defaultValue ?? null
    }

    if (Date.now() > item.expires) {
      this.remove(key)
      return defaultValue ?? null
    }

    return item.value
  }
}

// 导出实例
export const localStore = new Storage('local')
export const sessionStore = new Storage('session')

// 默认导出localStorage实例
export default localStore

// 常用存储键名常量
export const StorageKeys = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refresh_token',
  USER_INFO: 'user_info',
  PERMISSIONS: 'permissions',
  SIDEBAR_STATUS: 'sidebar_status',
  THEME: 'theme',
  LANGUAGE: 'language',
  TABS: 'tabs'
} as const
