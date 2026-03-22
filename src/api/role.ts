
import { request } from './request'
import type { Role, RoleParams, PageResult, PermissionMenu, ApiResponse } from '@/types'



// 获取角色列表
export function getRoleList(params: RoleParams) {
    return request.post<PageResult<Role>>('/case-zx-api/sys/sysRole/pageListSysRole', { params })
}

// 创建角色
export function createRole(data: Partial<Role>) {
    return request.post('/case-zx-api/sys/sysRole/saveSysRole', data)
}

// 更新角色
export function updateRole(data: Partial<Role>) {
    return request.post(`/case-zx-api/sys/sysRole/updateSysRole`,data)
}

//  删除角色
export function deleteRole(data: Partial<Role>) {
    return request.post(`/case-zx-api/sys/sysRole/deleteSysRole`,  data )
}
//获取所有角色权限树,用于新增角色时权限配置;
export function getAllRolePermissionTree() {
    return request.post<PageResult<PermissionMenu>>(`/case-zx-api/sys/sysRole/queryAllMenu`,{})
}
// 获取某一个角色权限树,根据返回的权限节点，勾选上;
export function getRolePermissionTree(params: Role) {
    return request.post<PageResult<PermissionMenu>>(`/case-zx-api/sys/sysRole/queryRolelMenu`,  params )
}
// 保存角色权限树
export function saveRolePermissionTree(params: PermissionMenu) {
    return request.post(`/case-zx-api/sys/sysRole/saveSysRoleMenu`, params)
}