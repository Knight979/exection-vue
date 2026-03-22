<template>
  <div class="role-list-container">
    <!-- 搜索筛选区 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" :inline="true">
        <el-form-item label="角色名称">
          <el-input v-model="searchForm.name" placeholder="请输入角色名称" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="角色代码">
          <el-input v-model="searchForm.code" placeholder="请输入角色代码" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">
            搜索
          </el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作按钮栏 -->
    <el-card class="toolbar-card" shadow="never">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="primary" :icon="Plus" @click="handleAdd">
            新增角色
          </el-button>
          <el-button type="danger" :icon="Delete" :disabled="!selectedRows.length" @click="handleBatchDelete">
            批量删除
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 数据表格 -->
    <el-card shadow="never">
      <el-table v-loading="loading" :data="tableData" stripe border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="roleId" label="角色ID" width="100" show-overflow-tooltip />
        <el-table-column prop="roleName" label="角色名称" width="150" show-overflow-tooltip />
        <el-table-column prop="roleKey" label="角色代码" width="150" show-overflow-tooltip />
        <el-table-column prop="status" label="角色状态" width="150" align="center" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tag :type="row.status === '0' ? 'success' : 'danger'">
              {{ row.status === '0' ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" width="180" show-overflow-tooltip>
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" link :icon="View" @click="handleView(row)">
              查看
            </el-button>
            <el-button type="warning" link :icon="Edit" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="info" link :icon="Setting" @click="handleConfigPermission(row)">
              权限配置
            </el-button>
            <el-button type="danger" link :icon="Delete" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination v-model:current-page="pagination.pageNum" v-model:page-size="pagination.pageSize"
          :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>

    <!-- 角色表单对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px" :close-on-click-modal="false">
      <el-form ref="formRef" :model="roleForm" :rules="formRules" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色代码" prop="code">
          <el-input v-model="roleForm.roleKey" placeholder="请输入角色代码" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="角色状态" prop="status">
          <el-select v-model="roleForm.status" placeholder="请选择角色状态" style="width: 100%">
            <el-option label="正常" value="0" />
            <el-option label="停用" value="1" />
          </el-select>
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input v-model="roleForm.remark" type="textarea" :rows="3" placeholder="请输入角色描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 角色详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="角色详情" width="600px" :close-on-click-modal="false">
      <el-descriptions v-if="currentRole" :column="2" border>
        <el-descriptions-item label="角色ID">
          {{ currentRole.roleId }}
        </el-descriptions-item>
        <el-descriptions-item label="角色名称">
          {{ currentRole.roleName }}
        </el-descriptions-item>
        <el-descriptions-item label="角色代码">
          {{ currentRole.roleKey }}
        </el-descriptions-item>
        <el-descriptions-item label="描述" :span="2">
          {{ currentRole.remark || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="权限数量" :span="2">
          {{ currentRole.menuList?.length || 0 }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">
          {{ formatDate(currentRole.createTime) }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 权限配置对话框 -->
    <el-dialog v-model="permissionDialogVisible" title="权限配置" width="700px" :close-on-click-modal="false">
      <div class="permission-container">
        <el-tree ref="permissionTreeRef" :data="permissionTree" show-checkbox node-key="menuId"
          :props="{ children: 'list', label: 'menuName' }" :default-checked-keys="selectedPermissionIds"
          @check="handlePermissionCheck" />

      </div>
      <template #footer>
        <el-button @click="permissionDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="permissionLoading" @click="handleSavePermission">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import {
  Search,
  Refresh,
  Plus,
  Delete,
  View,
  Edit,
  Setting
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules, type ElTree } from 'element-plus'
import type { Role, PermissionMenu } from '@/types'
import dayjs from 'dayjs'
import { getRoleList, deleteRole, updateRole, createRole, getRolePermissionTree, getAllRolePermissionTree, saveRolePermissionTree } from '@/api/role'

// 搜索表单
const searchForm = reactive({
  roleName: '',
  roleKey: ''
})

// 表格数据
const loading = ref(false)
const tableData = ref<Role[]>([])
const selectedRows = ref<Role[]>([])

// 分页
const pagination = reactive({
  currPage: 1,
  pageSize: 20,
  total: 0
})

// 对话框
const dialogVisible = ref(false)
const detailDialogVisible = ref(false)
const permissionDialogVisible = ref(false)
const submitLoading = ref(false)
const permissionLoading = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const permissionTreeRef = ref<InstanceType<typeof ElTree>>()
const currentRole = ref<Role | null>(null)
const currentRoleForPermission = ref<Role | null>(null)

// 角色表单
const roleForm = reactive({
  roleId: '',
  roleKey: '',
  roleName: '',
  roleSort: '',
  status: '0',
  remark: ''
})

// 权限树
const permissionTree = ref<PermissionMenu[]>([])
const selectedPermissionIds = ref<string[]>([])

// 表单验证规则
const formRules: FormRules = {
  roleName: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 20, message: '角色名称长度2-20位', trigger: 'blur' }
  ],
  roleKey: [
    { required: true, message: '请输入角色代码', trigger: 'blur' },
    { min: 2, max: 20, message: '角色代码长度2-20位', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择角色状态', trigger: 'change' }
  ]
}

// 获取表格数据
const fetchTableData = async () => {
  loading.value = true
  try {
    // TODO: 调用API获取角色列表
    const res = await getRoleList({
      ...searchForm,
      ...pagination
    })

    // Mock数据
    await new Promise(resolve => setTimeout(resolve, 500))
    console.log(res.list)
    tableData.value = res.list || []
    pagination.total = res.total
  } catch (error) {
    ElMessage.error('获取角色列表失败')
  } finally {
    loading.value = false
  }
}

// 获取权限树
// const fetchPermissionTree = async () => {
//   try {
//     // TODO: 调用API获取权限树
//     // const res = await getPermissionTree()

//     // Mock数据
//     permissionTree.value = [
//       {
//         id: '1',
//         name: '案件管理',
//         code: 'case',
//         type: 'menu' as any,
//         children: [
//           { id: '1-1', name: '案件列表', code: 'case:list', type: 'button' as any },
//           { id: '1-2', name: '案件详情', code: 'case:detail', type: 'button' as any },
//           { id: '1-3', name: '新增案件', code: 'case:add', type: 'button' as any },
//           { id: '1-4', name: '编辑案件', code: 'case:edit', type: 'button' as any },
//           { id: '1-5', name: '删除案件', code: 'case:delete', type: 'button' as any }
//         ]
//       },
//       {
//         id: '2',
//         name: '用户管理',
//         code: 'user',
//         type: 'menu' as any,
//         children: [
//           { id: '2-1', name: '用户列表', code: 'user:list', type: 'button' as any },
//           { id: '2-2', name: '新增用户', code: 'user:add', type: 'button' as any },
//           { id: '2-3', name: '编辑用户', code: 'user:edit', type: 'button' as any },
//           { id: '2-4', name: '删除用户', code: 'user:delete', type: 'button' as any }
//         ]
//       },
//       {
//         id: '3',
//         name: '角色管理',
//         code: 'role',
//         type: 'menu' as any,
//         children: [
//           { id: '3-1', name: '角色列表', code: 'role:list', type: 'button' as any },
//           { id: '3-2', name: '新增角色', code: 'role:add', type: 'button' as any },
//           { id: '3-3', name: '编辑角色', code: 'role:edit', type: 'button' as any },
//           { id: '3-4', name: '删除角色', code: 'role:delete', type: 'button' as any }
//         ]
//       }
//     ]
//   } catch (error) {
//     ElMessage.error('获取权限树失败')
//   }
// }

// // 生成Mock数据
// const generateMockData = (): Role[] => {
//   return Array.from({ length: pagination.pageSize }, (_, i) => ({
//     id: String(pagination.pageNum * pagination.pageSize + i + 1),
//     name: ['管理员', '主管', '催收员', '财务', '审计'][i % 5],
//     code: ['admin', 'supervisor', 'collector', 'finance', 'audit'][i % 5],
//     description: `${['管理员', '主管', '催收员', '财务', '审计'][i % 5]}角色`,
//     createTime: new Date(Date.now() - i * 86400000).toISOString(),
//     permissions: []
//   }))
// }

// 格式化日期
const formatDate = (date?: string) => {
  return date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : '-'
}

// 搜索
const handleSearch = () => {
  pagination.pageNum = 1
  fetchTableData()
}

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    name: '',
    code: ''
  })
  handleSearch()
}

// 新增角色
const handleAdd = () => {
  isEdit.value = false
  Object.assign(roleForm, {
    roleId: '',
    roleKey: '',
    roleName: '',
    roleSort: '',
    status: '0', // 新增时默认状态为正常
    remark: ''
  })
  dialogVisible.value = true
}

// 编辑角色
const handleEdit = (row: Role) => {
  isEdit.value = true
  Object.assign(roleForm, {
    roleId: row.roleId,
    roleKey: row.roleKey,
    roleName: row.roleName,
    roleSort: row.roleSort,
    status: String(row.status), // 确保状态是字符串类型，与 el-option 的 value 匹配
    remark: row.remark
  })
  dialogVisible.value = true
}

// 查看角色详情
const handleView = (row: Role) => {
  console.log('查看角色详情', row)
  currentRole.value = row
  detailDialogVisible.value = true
}

// 配置权限
const handleConfigPermission = async (row: Role) => {
  currentRoleForPermission.value = row
  permissionDialogVisible.value = true

  try {
    // 获取所有权限树节点，用于展示
    const allTreeRes = await getAllRolePermissionTree()
    permissionTree.value = allTreeRes || []
    // // 2. 获取当前角色的已选权限数据
    const roleId = { roleId: row.roleId }
    const res = await getRolePermissionTree(roleId)
    console.log('获取单个权限的树节点',res)
    // 递归提取所有菜单ID的辅助函数
    const extractMenuIds = (menus: any[]): string[] => {
      const ids: string[] = []
      menus.forEach(menu => {
        // 将 menuId 转换为字符串，确保与 el-tree 的 node-key 类型一致
        ids.push(String(menu.menuId))
        // 如果有子菜单，递归提取
        if (menu.list && menu.list.length > 0) {
          ids.push(...extractMenuIds(menu.list))
        }
      })
      return ids
      
    }

    // 从当前角色的 menuList 中提取已选中的菜单ID
    const menuList = row.list || []
    selectedPermissionIds.value = extractMenuIds(menuList)

    // 延迟设置选中状态，确保树已渲染
    setTimeout(() => {
      if (permissionTreeRef.value) {
        permissionTreeRef.value.setCheckedKeys(selectedPermissionIds.value)
      }
    }, 100)
  } catch (error) {
    ElMessage.error('获取权限数据失败')
  }
}


// 权限树选择变化
const handlePermissionCheck = () => {
  if (permissionTreeRef.value) {
    selectedPermissionIds.value = permissionTreeRef.value.getCheckedKeys() as string[]
  }
}

// 保存权限
const handleSavePermission = async () => {
  try {
    if (!currentRoleForPermission.value) {
      ElMessage.error('角色信息不存在')
      return
    }
    
    permissionLoading.value = true
    
    // 获取选中的权限树节点ID列表
    const menuIds = permissionTreeRef.value?.getCheckedKeys() as string[]
    const roleId = currentRoleForPermission.value.roleId
    
    console.log('保存权限参数:', { roleId, menuIds })
    
    // 调用API保存权限，传入 roleId 和 menuIds
    await saveRolePermissionTree({
      roleId,
      menuIds
    })
    
    ElMessage.success('权限配置成功')
    permissionDialogVisible.value = false
  } catch (error) {
    ElMessage.error('权限配置失败')
  } finally {
    permissionLoading.value = false
  }
}

// 删除角色
const handleDelete = (_row: Role) => {
  ElMessageBox.confirm(
    '确定要删除该角色吗?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      // TODO: 调用API删除角色
      const params = { roleId: _row.roleId }
      await deleteRole(params) // eslint-disable-line @typescript-eslint/no-unused-vars
      fetchTableData()
      ElMessage.success('角色删除成功')
    } catch (error) {
      ElMessage.error('角色删除失败')
    }
  })
}

// 批量删除
const handleBatchDelete = () => {
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedRows.value.length} 个角色吗?`,
    '批量删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      // TODO: 调用API批量删除角色
      // await batchDeleteRoles(selectedRows.value.map(r => r.id))
      fetchTableData()
      ElMessage.success('角色删除成功')
    } catch (error) {
      ElMessage.error('角色删除失败')
    }
  })
}

// 表格选择变化
const handleSelectionChange = (selection: Role[]) => {
  selectedRows.value = selection
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  fetchTableData()
}

// 当前页变化
const handleCurrentChange = (page: number) => {
  pagination.pageNum = page
  fetchTableData()
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        submitLoading.value = true
        if (isEdit.value) {
          // TODO: 调用API更新角色
          await updateRole(roleForm)
          ElMessage.success('角色更新成功')
        } else {
          // TODO: 调用API创建角色
          await createRole(roleForm)
          ElMessage.success('角色创建成功')
        }
        dialogVisible.value = false
        fetchTableData()
      } catch (error: any) {
        ElMessage.error(error.message || '操作失败')
      } finally {
        submitLoading.value = false
      }
    }
  })
}

// 获取对话框标题
const dialogTitle = computed(() => {
  return isEdit.value ? '编辑角色' : '新增角色'
})

// 初始化
onMounted(() => {
  fetchTableData()
  // fetchPermissionTree()
})
</script>

<style scoped lang="scss">
.role-list-container {
  padding: 16px;

  .search-card,
  .toolbar-card {
    margin-bottom: 16px;
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .toolbar-left {
      display: flex;
      gap: 8px;
    }
  }

  .pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 16px;
  }

  .permission-container {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 16px;
  }
}
</style>
