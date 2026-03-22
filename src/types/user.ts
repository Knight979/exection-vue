/*
 * @Author: Knight
 * @version: 2.0.0
 * @Date: 2026-03-05 17:14:42
 * @LastEditors: Knight
 * @LastEditTime: 2026-03-22 17:40:42
 */
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
  id?: string
  password?: string
  account?: string
  phone?: string
  email?: string
  realName?: string
  disabled?: UserStatus
  roleIds?: string[]
  roleType?: string  //roleType 就是角色的Id
  roles?: Role[]
  createTime: string
  updateTime?: string
}

// 角色接口
export interface Role {
  roleId?: string
  roleName?: string
  roleKey?: string
  roleSort?: number
  status?: string // '0' 正常 '1' 停用
  list?: PermissionMenu[]
  dataScope?: string // 数据范围
  delFlag?: string // 删除标志
  remark?: string
  createBy?: string
  createTime?: string
  updateBy?: string
  updateTime?: string
}

// 执行案件列表参数
export interface RoleParams {
  currPage: number
  pageSize: number
}
// 权限菜单类型枚举
export enum MenuType {
  DIRECTORY = 'M', // 目录
  MENU = 'C',      // 菜单
  BUTTON = 'F'     // 按钮
}

// 权限菜单接口
export interface PermissionMenu {
  roleId?: string
  menuId: string
  menuName: string
  parentId: string
  orderNum: number //显示顺序
  path?: string
  icon?: string
  list?: PermissionMenu[]
  menuType: MenuType
  perms?: string  //权限标识
  url?: string    //请求地址
  target?: string //"打开方式（menuItem页签 menuBlank新窗口）",
  visible: string // '0' 显示 '1' 隐藏
  isRefresh?: string // '0' 刷新 '1' 不刷新
  children?: MenuType[]
  createBy?: string
  createTime?: string
  updateBy?: string
  updateTime?: string
  remark?: string
}
