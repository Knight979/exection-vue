<template>
  <div class="permission-list-container">
    <!-- 操作按钮栏 -->
    <el-card class="toolbar-card" shadow="never">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="primary" :icon="Plus" @click="handleAdd">
            新增权限
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 权限树 -->
    <el-card shadow="never">
      <div class="tree-container">
        <el-tree
          ref="permissionTreeRef"
          :data="permissionTree"
          node-key="id"
          :props="{ children: 'children', label: 'name' }"
          :expand-on-click-node="false"
          default-expand-all
        >
          <template #default="{ node, data }">
            <div class="tree-node">
              <span class="node-label">
                <el-tag
                  :type="data.type === 'menu' ? 'primary' : 'success'"
                  size="small"
                  style="margin-right: 8px"
                >
                  {{ data.type === 'menu' ? '菜单' : '按钮' }}
                </el-tag>
                {{ node.label }}
              </span>
              <span class="node-code">{{ data.code }}</span>
              <div class="node-actions">
                <el-button
                  type="primary"
                  link
                  size="small"
                  :icon="Edit"
                  @click.stop="handleEdit(data)"
                >
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  link
                  size="small"
                  :icon="Delete"
                  @click.stop="handleDelete(data)"
                >
                  删除
                </el-button>
              </div>
            </div>
          </template>
        </el-tree>
      </div>
    </el-card>

    <!-- 权限表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="permissionForm"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input
            v-model="permissionForm.name"
            placeholder="请输入权限名称"
          />
        </el-form-item>
        <el-form-item label="权限代码" prop="code">
          <el-input
            v-model="permissionForm.code"
            placeholder="请输入权限代码"
          />
        </el-form-item>
        <el-form-item label="权限类型" prop="type">
          <el-select
            v-model="permissionForm.type"
            placeholder="请选择权限类型"
            style="width: 100%"
          >
            <el-option label="菜单" value="menu" />
            <el-option label="按钮" value="button" />
          </el-select>
        </el-form-item>
        <el-form-item label="父权限" prop="parentId">
          <el-select
            v-model="permissionForm.parentId"
            placeholder="请选择父权限"
            clearable
            style="width: 100%"
          >
            <el-option label="无" :value="null" />
            <el-option
              v-for="perm in parentPermissions"
              :key="perm.id"
              :label="perm.name"
              :value="perm.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="路由路径" prop="path">
          <el-input
            v-model="permissionForm.path"
            placeholder="请输入路由路径"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import {
  Plus,
  Edit,
  Delete
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules, type ElTree } from 'element-plus'
import type { Permission } from '@/types'

// 对话框
const dialogVisible = ref(false)
const submitLoading = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const permissionTreeRef = ref<InstanceType<typeof ElTree>>()

// 权限树
const permissionTree = ref<Permission[]>([])

// 权限表单
const permissionForm = reactive({
  id: '',
  name: '',
  code: '',
  type: 'menu',
  parentId: null as string | null,
  path: ''
})

// 表单验证规则
const formRules: FormRules = {
  name: [
    { required: true, message: '请输入权限名称', trigger: 'blur' },
    { min: 2, max: 50, message: '权限名称长度2-50位', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入权限代码', trigger: 'blur' },
    { min: 2, max: 50, message: '权限代码长度2-50位', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择权限类型', trigger: 'change' }
  ]
}

// 获取权限树
const fetchPermissionTree = async () => {
  try {
    // TODO: 调用API获取权限树
    // const res = await getPermissionTree()
    
    // Mock数据
    permissionTree.value = [
      {
        id: '1',
        name: '案件管理',
        code: 'case',
        type: 'menu' as any,
        path: '/case',
        children: [
          { id: '1-1', name: '案件列表', code: 'case:list', type: 'button' as any, path: '/case/list' },
          { id: '1-2', name: '案件详情', code: 'case:detail', type: 'button' as any, path: '/case/detail' },
          { id: '1-3', name: '新增案件', code: 'case:add', type: 'button' as any, path: '/case/add' },
          { id: '1-4', name: '编辑案件', code: 'case:edit', type: 'button' as any, path: '/case/edit' },
          { id: '1-5', name: '删除案件', code: 'case:delete', type: 'button' as any, path: '/case/delete' }
        ]
      },
      {
        id: '2',
        name: '用户管理',
        code: 'user',
        type: 'menu' as any,
        path: '/user',
        children: [
          { id: '2-1', name: '用户列表', code: 'user:list', type: 'button' as any, path: '/user/list' },
          { id: '2-2', name: '新增用户', code: 'user:add', type: 'button' as any, path: '/user/add' },
          { id: '2-3', name: '编辑用户', code: 'user:edit', type: 'button' as any, path: '/user/edit' },
          { id: '2-4', name: '删除用户', code: 'user:delete', type: 'button' as any, path: '/user/delete' }
        ]
      },
      {
        id: '3',
        name: '角色管理',
        code: 'role',
        type: 'menu' as any,
        path: '/role',
        children: [
          { id: '3-1', name: '角色列表', code: 'role:list', type: 'button' as any, path: '/role/list' },
          { id: '3-2', name: '新增角色', code: 'role:add', type: 'button' as any, path: '/role/add' },
          { id: '3-3', name: '编辑角色', code: 'role:edit', type: 'button' as any, path: '/role/edit' },
          { id: '3-4', name: '删除角色', code: 'role:delete', type: 'button' as any, path: '/role/delete' }
        ]
      },
      {
        id: '4',
        name: '工单管理',
        code: 'workOrder',
        type: 'menu' as any,
        path: '/workOrder',
        children: [
          { id: '4-1', name: '工单列表', code: 'workOrder:list', type: 'button' as any, path: '/workOrder/list' },
          { id: '4-2', name: '工单详情', code: 'workOrder:detail', type: 'button' as any, path: '/workOrder/detail' },
          { id: '4-3', name: '新增工单', code: 'workOrder:add', type: 'button' as any, path: '/workOrder/add' },
          { id: '4-4', name: '处理工单', code: 'workOrder:process', type: 'button' as any, path: '/workOrder/process' }
        ]
      }
    ]
  } catch (error) {
    ElMessage.error('获取权限树失败')
  }
}

// 获取所有菜单权限（用于父权限选择）
const parentPermissions = computed(() => {
  const result: Permission[] = []
  const traverse = (nodes: Permission[]) => {
    for (const node of nodes) {
      if (node.type === 'menu') {
        result.push(node)
      }
      if (node.children) {
        traverse(node.children)
      }
    }
  }
  traverse(permissionTree.value)
  return result
})

// 获取对话框标题
const dialogTitle = computed(() => {
  return isEdit.value ? '编辑权限' : '新增权限'
})

// 新增权限
const handleAdd = () => {
  isEdit.value = false
  Object.assign(permissionForm, {
    id: '',
    name: '',
    code: '',
    type: 'menu',
    parentId: null,
    path: ''
  })
  dialogVisible.value = true
}

// 编辑权限
const handleEdit = (permission: Permission) => {
  isEdit.value = true
  Object.assign(permissionForm, {
    id: permission.id,
    name: permission.name,
    code: permission.code,
    type: permission.type,
    parentId: permission.parentId || null,
    path: permission.path || ''
  })
  dialogVisible.value = true
}

// 删除权限
const handleDelete = (permission: Permission) => {
  ElMessageBox.confirm(
    `确定要删除权限"${permission.name}"吗?`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      // TODO: 调用API删除权限
      // await deletePermission(permission.id)
      fetchPermissionTree()
      ElMessage.success('权限删除成功')
    } catch (error) {
      ElMessage.error('权限删除失败')
    }
  })
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        submitLoading.value = true
        if (isEdit.value) {
          // TODO: 调用API更新权限
          // await updatePermission(permissionForm.id, permissionForm)
          ElMessage.success('权限更新成功')
        } else {
          // TODO: 调用API创建权限
          // await createPermission(permissionForm)
          ElMessage.success('权限创建成功')
        }
        dialogVisible.value = false
        fetchPermissionTree()
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
  fetchPermissionTree()
})
</script>

<style scoped lang="scss">
.permission-list-container {
  padding: 16px;

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

  .tree-container {
    max-height: 600px;
    overflow-y: auto;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 16px;

    :deep(.el-tree-node__content) {
      height: auto;
      padding: 8px 0;
    }

    .tree-node {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      gap: 16px;

      .node-label {
        flex: 1;
        display: flex;
        align-items: center;
      }

      .node-code {
        color: #909399;
        font-size: 12px;
        min-width: 100px;
      }

      .node-actions {
        display: flex;
        gap: 8px;
        opacity: 0;
        transition: opacity 0.3s;
      }

      &:hover .node-actions {
        opacity: 1;
      }
    }
  }
}
</style>
