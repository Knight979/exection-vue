// 用户状态枚举
export enum UserStatus {
  ENABLED = 1,
  DISABLED = 0
}

// 权限类型枚举
export enum PermissionType {
  MENU = 'menu',
  BUTTON = 'button'
}

// 用户接口
export interface User {
  id: string
  username: string
  nickname: string
  avatar?: string
  email?: string
  phone?: string
  status: UserStatus
  roleIds: string[]
  roles?: Role[]
  createTime: string
  updateTime?: string
}

// 角色接口
export interface Role {
  id: string
  name: string
  code: string
  description?: string
  permissions?: Permission[]
  createTime: string
}

// 权限接口
export interface Permission {
  id: string
  name: string
  code: string
  type: PermissionType
  parentId?: string
  path?: string
  children?: Permission[]
}
