<template>
  <div class="log-list-container">
    <!-- 搜索筛选区 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" :inline="true">
        <el-form-item label="操作人">
          <el-input
            v-model="searchForm.username"
            placeholder="请输入操作人"
            clearable
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item label="操作类型">
          <el-select
            v-model="searchForm.operationType"
            placeholder="请选择操作类型"
            clearable
            style="width: 150px"
          >
            <el-option label="登录" value="login" />
            <el-option label="登出" value="logout" />
            <el-option label="新增" value="create" />
            <el-option label="编辑" value="update" />
            <el-option label="删除" value="delete" />
            <el-option label="导出" value="export" />
            <el-option label="导入" value="import" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作对象">
          <el-select
            v-model="searchForm.operationObject"
            placeholder="请选择操作对象"
            clearable
            style="width: 150px"
          >
            <el-option label="用户" value="user" />
            <el-option label="角色" value="role" />
            <el-option label="案件" value="case" />
            <el-option label="工单" value="workOrder" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作结果">
          <el-select
            v-model="searchForm.result"
            placeholder="请选择操作结果"
            clearable
            style="width: 120px"
          >
            <el-option label="成功" value="success" />
            <el-option label="失败" value="failure" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作时间">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
            style="width: 240px"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="IP地址">
          <el-input
            v-model="searchForm.ipAddress"
            placeholder="请输入IP地址"
            clearable
            style="width: 150px"
          />
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
          <el-button type="success" :icon="Download" @click="handleExport">
            导出日志
          </el-button>
          <el-button
            type="danger"
            :icon="Delete"
            :disabled="!selectedRows.length"
            @click="handleBatchDelete"
          >
            批量删除
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 数据表格 -->
    <el-card shadow="never">
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          prop="id"
          label="日志ID"
          width="100"
          show-overflow-tooltip
        />
        <el-table-column
          prop="username"
          label="操作人"
          width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="operationType"
          label="操作类型"
          width="100"
          align="center"
        >
          <template #default="{ row }">
            <el-tag :type="getOperationTypeTag(row.operationType)">
              {{ getOperationTypeText(row.operationType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="operationObject"
          label="操作对象"
          width="100"
          align="center"
        >
          <template #default="{ row }">
            <el-tag type="info">{{ row.operationObject }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="操作描述"
          min-width="200"
          show-overflow-tooltip
        />
        <el-table-column
          prop="result"
          label="操作结果"
          width="100"
          align="center"
        >
          <template #default="{ row }">
            <el-tag :type="row.result === 'success' ? 'success' : 'danger'">
              {{ row.result === 'success' ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="ipAddress"
          label="IP地址"
          width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="operationTime"
          label="操作时间"
          width="180"
        >
          <template #default="{ row }">
            {{ formatDate(row.operationTime) }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120"
          fixed="right"
          align="center"
        >
          <template #default="{ row }">
            <el-button
              type="primary"
              link
              :icon="View"
              @click="handleViewDetail(row)"
            >
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.pageNum"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 日志详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="日志详情"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-descriptions v-if="currentLog" :column="2" border>
        <el-descriptions-item label="日志ID">
          {{ currentLog.id }}
        </el-descriptions-item>
        <el-descriptions-item label="操作人">
          {{ currentLog.username }}
        </el-descriptions-item>
        <el-descriptions-item label="操作类型">
          <el-tag :type="getOperationTypeTag(currentLog.operationType)">
            {{ getOperationTypeText(currentLog.operationType) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="操作对象">
          {{ currentLog.operationObject }}
        </el-descriptions-item>
        <el-descriptions-item label="操作描述" :span="2">
          {{ currentLog.description }}
        </el-descriptions-item>
        <el-descriptions-item label="操作结果">
          <el-tag :type="currentLog.result === 'success' ? 'success' : 'danger'">
            {{ currentLog.result === 'success' ? '成功' : '失败' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="错误信息">
          {{ currentLog.errorMessage || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="IP地址">
          {{ currentLog.ipAddress }}
        </el-descriptions-item>
        <el-descriptions-item label="用户代理">
          {{ currentLog.userAgent }}
        </el-descriptions-item>
        <el-descriptions-item label="操作时间" :span="2">
          {{ formatDate(currentLog.operationTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="请求参数" :span="2">
          <el-tree
            :data="parseJson(currentLog.requestParams)"
            node-key="id"
            :props="{ children: 'children', label: 'label' }"
            default-expand-all
          />
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  Search,
  Refresh,
  Download,
  Delete,
  View
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'

// 搜索表单
const searchForm = reactive({
  username: '',
  operationType: '',
  operationObject: '',
  result: '',
  dateRange: null as [string, string] | null,
  ipAddress: ''
})

// 表格数据
const loading = ref(false)
const tableData = ref<any[]>([])
const selectedRows = ref<any[]>([])

// 分页
const pagination = reactive({
  pageNum: 1,
  pageSize: 20,
  total: 0
})

// 对话框
const detailDialogVisible = ref(false)
const currentLog = ref<any>(null)

// 获取表格数据
const fetchTableData = async () => {
  loading.value = true
  try {
    // TODO: 调用API获取日志列表
    // const res = await getLogList({
    //   ...searchForm,
    //   ...pagination
    // })
    
    // Mock数据
    await new Promise(resolve => setTimeout(resolve, 500))
    tableData.value = generateMockData()
    pagination.total = 200
  } catch (error) {
    ElMessage.error('获取日志列表失败')
  } finally {
    loading.value = false
  }
}

// 生成Mock数据
const generateMockData = (): any[] => {
  const operationTypes = ['login', 'logout', 'create', 'update', 'delete', 'export', 'import']
  const operationObjects = ['user', 'role', 'case', 'workOrder']
  const results = ['success', 'failure']
  
  return Array.from({ length: pagination.pageSize }, (_, i) => ({
    id: String(pagination.pageNum * pagination.pageSize + i + 1),
    username: `user${i % 5 + 1}`,
    operationType: operationTypes[i % operationTypes.length],
    operationObject: operationObjects[i % operationObjects.length],
    description: `${operationTypes[i % operationTypes.length]}了${operationObjects[i % operationObjects.length]}`,
    result: results[i % 2],
    ipAddress: `192.168.${Math.floor(i / 256)}.${i % 256}`,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    errorMessage: i % 5 === 0 ? '权限不足' : null,
    requestParams: JSON.stringify({ id: i + 1, name: `test${i + 1}` }),
    operationTime: new Date(Date.now() - i * 3600000).toISOString()
  }))
}

// 格式化日期
const formatDate = (date?: string) => {
  return date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : '-'
}

// 获取操作类型标签
const getOperationTypeTag = (type: string) => {
  const tagMap: Record<string, any> = {
    login: 'primary',
    logout: 'info',
    create: 'success',
    update: 'warning',
    delete: 'danger',
    export: 'success',
    import: 'success'
  }
  return tagMap[type] || ''
}

// 获取操作类型文本
const getOperationTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    login: '登录',
    logout: '登出',
    create: '新增',
    update: '编辑',
    delete: '删除',
    export: '导出',
    import: '导入'
  }
  return textMap[type] || type
}

// 解析JSON
const parseJson = (jsonStr: string) => {
  try {
    const obj = JSON.parse(jsonStr)
    return convertToTree(obj)
  } catch {
    return []
  }
}

// 将对象转换为树形结构
const convertToTree = (obj: any, parentKey = ''): any[] => {
  const result: any[] = []
  for (const key in obj) {
    const value = obj[key]
    const id = parentKey ? `${parentKey}.${key}` : key
    if (typeof value === 'object' && value !== null) {
      result.push({
        id,
        label: `${key}: [Object]`,
        children: convertToTree(value, id)
      })
    } else {
      result.push({
        id,
        label: `${key}: ${value}`
      })
    }
  }
  return result
}

// 搜索
const handleSearch = () => {
  pagination.pageNum = 1
  fetchTableData()
}

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    username: '',
    operationType: '',
    operationObject: '',
    result: '',
    dateRange: null,
    ipAddress: ''
  })
  handleSearch()
}

// 导出日志
const handleExport = () => {
  ElMessage.success('日志导出成功')
}

// 批量删除
const handleBatchDelete = () => {
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedRows.value.length} 条日志吗?`,
    '批量删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      // TODO: 调用API批量删除日志
      // await batchDeleteLogs(selectedRows.value.map(l => l.id))
      fetchTableData()
      ElMessage.success('日志删除成功')
    } catch (error) {
      ElMessage.error('日志删除失败')
    }
  })
}

// 查看详情
const handleViewDetail = (row: any) => {
  currentLog.value = row
  detailDialogVisible.value = true
}

// 表格选择变化
const handleSelectionChange = (selection: any[]) => {
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

// 初始化
onMounted(() => {
  fetchTableData()
})
</script>

<style scoped lang="scss">
.log-list-container {
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
