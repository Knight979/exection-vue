<template>
  <div class="user-list-container">
    <!-- 搜索筛选区 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" :inline="true">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.account" placeholder="请输入用户名" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="角色">
          <el-input v-model="searchForm.roleType" placeholder="请输入昵称" clearable style="width: 200px" />
        </el-form-item>
        <!-- <el-form-item label="用户状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
            style="width: 150px"
          >
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item> -->
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
            新增用户
          </el-button>
          <!-- <el-button type="danger" :icon="Delete" :disabled="!selectedRows.length" @click="handleBatchDelete">
            批量删除
          </el-button> -->
        </div>
      </div>
    </el-card>

    <!-- 数据表格 -->
    <el-card shadow="never">
      <el-table v-loading="loading" :data="tableData" stripe border @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column prop="id" label="用户ID" width="100" show-overflow-tooltip />
        <el-table-column prop="realName" label="真实姓名" width="150" show-overflow-tooltip />
        <el-table-column prop="account" label="账户" width="150" show-overflow-tooltip />
        <el-table-column prop="realName" label="角色" width="150" show-overflow-tooltip />
        <el-table-column prop="password" label="密码" width="200" show-overflow-tooltip />
        <el-table-column prop="phone" label="电话" width="130" show-overflow-tooltip />
        <el-table-column prop="disabled" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.disabled === 1 ? 'danger' : 'success'">
              {{ row.disabled === 1 ? '禁用' : '启用' }}
            </el-tag>
          </template>
        </el-table-column>
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
            <el-button :disabled="row.id === 1" :type="row.disabled === 1 ? 'success' : 'danger'" link
              @click="handleToggleStatus(row)">
              {{ row.disabled === 1 ? '启用' : '禁用' }}
            </el-button>
            <el-button type="danger" link :icon="Delete" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination v-model:current-page="pagination.currPage" v-model:page-size="pagination.pageSize"
          :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>

    <!-- 用户表单对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px" :close-on-click-modal="false">
      <el-form ref="formRef" :model="userForm" :rules="formRules" label-width="100px">
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="userForm.realName" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="用户名" prop="account">
          <el-input v-model="userForm.account" placeholder="请输入用户名" :disabled="isEdit" />
        </el-form-item>
        <!-- <el-form-item label="角色" prop="nickname">
          <el-input v-model="userForm.roleType" placeholder="请输入角色昵称" />
        </el-form-item> -->
        <el-form-item label="电话" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item v-if="!isEdit" label="密码" prop="password">
          <el-input v-model="userForm.password" placeholder="请输入密码" type="password" show-password />
        </el-form-item>
        <el-form-item label="用户状态" prop="disabled">
          <el-radio-group v-model="userForm.disabled">
            <el-radio :label="1">禁用</el-radio>
            <el-radio :label="0">启用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择角色" prop="roleType">
          <el-select v-model="userForm.roleType" placeholder="请选择角色" style="width: 100%">
            <el-option v-for="role in roleList" :key="role.roleId" :label="role.roleName" :value="role.roleId" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 用户详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="用户详情" width="600px" :close-on-click-modal="false">
      <el-descriptions v-if="currentUser" :column="2" border>
        <el-descriptions-item label="真实姓名">
          {{ currentUser.realName }}
        </el-descriptions-item>
        <el-descriptions-item label="用户名">
          {{ currentUser.account }}
        </el-descriptions-item>
        <el-descriptions-item label="密码">
          {{ currentUser.password }}
        </el-descriptions-item>
        <el-descriptions-item label="电话">
          {{ currentUser.phone || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="用户状态">
          <el-tag :type="currentUser.disabled === 0 ? 'success' : 'danger'">
            {{ currentUser.disabled === 0 ? '启用' : '禁用' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="角色" :span="2">
          <el-tag style="margin-right: 8px">
            {{ currentUser.roleType }}
          </el-tag>

        </el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">
          {{ formatDate(currentUser.createTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="更新时间" :span="2">
          {{ formatDate(currentUser.updateTime) }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
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
  Edit
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, roleTypes, type FormInstance, type FormRules } from 'element-plus'
import type { User, Role } from '@/types'
import dayjs from 'dayjs'
import { createUser, deleteUser, getUserList, updateUser, updateUserStatus } from '@/api/user'
import { getRoleList } from '@/api/role'

// 搜索表单
const searchForm = reactive({
  account: '',
  roleType: '',
  status: undefined as number | undefined
})

// 表格数据
const loading = ref(false)
const tableData = ref<User[]>([])
const selectedRows = ref<User[]>([])

// 分页
const pagination = reactive({
  currPage: 1,
  pageSize: 20,
  total: 0
})

// 对话框
const dialogVisible = ref(false)
const detailDialogVisible = ref(false)
const submitLoading = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const currentUser = ref<User | null>(null)

// 用户表单
const userForm = reactive({
  realName: '',
  account: '',
  roleType: '',
  phone: '',
  password: '',
  disabled: 1,//1=已禁用, 0=正常
  // roleIds: [] as string[]
  // orgId: [] as string[]
})

// 对话框标题
const dialogTitle = computed(() => {
  return isEdit.value ? '编辑用户' : '新增用户'
})

// 角色列表
const roleList = ref<Role[]>([])

// 表单验证规则
const formRules: FormRules = {
  account: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度3-20位', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  // email: [
  //   { required: true, message: '请输入邮箱', trigger: 'blur' },
  //   { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  // ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  disabled: [
    { required: true, message: '请选择用户状态', trigger: 'change' }
  ],
  roleIds: [
    { required: true, message: '请选择至少一个角色', trigger: 'change' }
  ]
}

// 获取表格数据
const fetchTableData = async () => {
  loading.value = true
  try {
    // TODO: 调用API获取用户列表
    const res = await getUserList({
      // ...searchForm,
      ...pagination
    })

    // Mock数据
    await new Promise(resolve => setTimeout(resolve, 500))
    tableData.value = res.list;
    pagination.total = res.total;
  } catch (error) {
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 获取模态框中角色下拉框
const fetchRoleList = async () => {
  try {
    // 分页
    const pagination = reactive({
      currPage: 1,
      pageSize: 100
    })
    // TODO: 调用API获取角色列表
    const res = await getRoleList(pagination)

    roleList.value = res.list;
    // Mock数据
    // roleList.value = [
    //   { id: '1', name: '管理员', code: 'admin', description: '系统管理员', createTime: new Date().toISOString() },
    //   { id: '2', name: '主管', code: 'supervisor', description: '团队主管', createTime: new Date().toISOString() },
    //   { id: '3', name: '催收员', code: 'collector', description: '催收人员', createTime: new Date().toISOString() }
    // ]
  } catch (error) {
    ElMessage.error('获取角色列表失败')
  }
}

// // 生成Mock数据
// const generateMockData = (): User[] => {
//   const statuses = [1, 0]
//   return Array.from({ length: pagination.pageSize }, (_, i) => ({
//     id: String(pagination.pageNum * pagination.pageSize + i + 1),
//     username: `user${pagination.pageNum * pagination.pageSize + i + 1}`,
//     nickname: `用户${pagination.pageNum * pagination.pageSize + i + 1}`,
//     email: `user${pagination.pageNum * pagination.pageSize + i + 1}@example.com`,
//     phone: `138${String(10000000 + i).slice(0, 8)}`,
//     status: statuses[i % 2] as any,
//     roleIds: [String((i % 3) + 1)],
//     roles: [
//       { id: String((i % 3) + 1), name: ['管理员', '主管', '催收员'][i % 3], code: 'role', createTime: new Date().toISOString() }
//     ],
//     createTime: new Date(Date.now() - i * 86400000).toISOString(),
//     updateTime: new Date(Date.now() - i * 43200000).toISOString()
//   }))
// }

// 格式化日期
const formatDate = (date?: string) => {
  return date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : '-'
}

// 搜索
const handleSearch = () => {
  pagination.currPage = 1
  fetchTableData()
}

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    account: '',
    roleType: '',
    // email: '',
    // status: undefined
  })
  handleSearch()
}

// 新增用户
const handleAdd = () => {
  isEdit.value = false
  Object.assign(userForm, {
    account: '',
    phone: '',
    password: '',
    disabled: 0,
    roleType: ''
  })
  dialogVisible.value = true
}

// 编辑用户
const handleEdit = (row: User) => {
  isEdit.value = true
  Object.assign(userForm, {
    id: row.id,
    account: row.account,
    password: row.password,
    phone: row.phone || '',
    disabled: row.disabled,
    roleType: String(row.roleType)
  })
  dialogVisible.value = true
}

// 查看用户详情
const handleView = (row: User) => {
  currentUser.value = row
  detailDialogVisible.value = true
}

// 切换用户状态
const handleToggleStatus = (row: User) => {
  const newStatus = row.disabled === 1 ? 0 : 1
  ElMessageBox.confirm(
    `确定要${newStatus === 1 ? '启用' : '禁用'}该用户吗?`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      // TODO: 调用API更新用户状态
      await updateUserStatus({ id: row.id })
      row.disabled = newStatus
      ElMessage.success('用户状态更新成功')
    } catch (error) {
      ElMessage.error('用户状态更新失败')
    }
  })
}

// 删除用户
const handleDelete = (_row: User) => {
  ElMessageBox.confirm(
    '确定要删除该用户吗?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const params = { id: _row.id }
      // TODO: 调用API删除用户
      await deleteUser(params) // eslint-disable-line @typescript-eslint/no-unused-vars
      fetchTableData()
      ElMessage.success('用户删除成功')
    } catch (error) {
      ElMessage.error('用户删除失败')
    }
  })
}


// 表格选择变化
const handleSelectionChange = (selection: User[]) => {
  selectedRows.value = selection
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  fetchTableData()
}

// 当前页变化
const handleCurrentChange = (page: number) => {
  pagination.currPage = page
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
          // TODO: 调用API更新用户
          await updateUser(userForm)
          ElMessage.success('用户更新成功')
        } else {
          // TODO: 调用API创建用户
          await createUser(userForm)
          ElMessage.success('用户创建成功')
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

// 初始化
onMounted(() => {
  fetchTableData()
  fetchRoleList()
})
</script>

<style scoped lang="scss">
.user-list-container {
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
}
</style>
