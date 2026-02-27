<template>
  <div class="work-order-container">
    <!-- 搜索筛选区 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" :inline="true">
        <el-form-item label="工单编号">
          <el-input
            v-model="searchForm.orderId"
            placeholder="请输入工单编号"
            clearable
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item label="案件编号">
          <el-input
            v-model="searchForm.caseNo"
            placeholder="请输入案件编号"
            clearable
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item label="来电手机号">
          <el-input
            v-model="searchForm.phone"
            placeholder="请输入手机号"
            clearable
            style="width: 160px"
          />
        </el-form-item>
        <el-form-item label="工单类型">
          <el-select
            v-model="searchForm.orderType"
            placeholder="请选择类型"
            clearable
            style="width: 140px"
          >
            <el-option label="投诉" :value="1" />
            <el-option label="协商还款" :value="2" />
            <el-option label="信息报备" :value="3" />
            <el-option label="客户回访" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="工单状态">
          <el-select
            v-model="searchForm.orderStatus"
            placeholder="请选择状态"
            clearable
            style="width: 140px"
          >
            <el-option label="解决中" :value="1" />
            <el-option label="已解决" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="searchForm.createTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
            style="width: 240px"
            value-format="YYYY-MM-DD"
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
      <el-button type="primary" :icon="Plus" @click="handleAdd">
        新增工单
      </el-button>
    </el-card>

    <!-- 数据表格 -->
    <el-card shadow="never">
      <el-table v-loading="loading" :data="tableData" stripe border>
        <el-table-column
          prop="id"
          label="工单编号"
          width="100"
          align="center"
        />
        <el-table-column
          prop="caseNo"
          label="案件编号"
          width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="orderType"
          label="工单类型"
          width="120"
          align="center"
        >
          <template #default="{ row }">
            <el-tag :type="getOrderTypeTag(row.orderType)">
              {{ getOrderTypeText(row.orderType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderStatus"
          label="工单状态"
          width="100"
          align="center"
        >
          <template #default="{ row }">
            <el-tag :type="row.orderStatus === 1 ? 'warning' : 'success'">
              {{ row.orderStatus === 1 ? '解决中' : '已解决' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="来电手机号" width="130" />
        <el-table-column
          prop="processorName"
          label="处理人"
          width="100"
          show-overflow-tooltip
        />
        <el-table-column
          prop="committerName"
          label="提交人"
          width="100"
          show-overflow-tooltip
        />
        <el-table-column
          prop="committer"
          label="提交人1"
          width="100"
          show-overflow-tooltip
        />
        <el-table-column
          prop="processor"
          label="处理人1"
          width="100"
          show-overflow-tooltip
        />
        <el-table-column
          prop="userRead"
          label="是否已读"
          width="100"
          align="center"
        >
          <template #default="{ row }">
            <el-tag :type="row.userRead ? 'success' : 'info'" size="small">
              {{ row.userRead ? '已读' : '未读' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right" align="center">
          <template #default="{ row }">
            <el-button
              type="primary"
              link
              :icon="View"
              @click="handleView(row)"
            >
              查看
            </el-button>
            <el-button
              v-if="row.orderStatus === 1"
              type="success"
              link
              :icon="Edit"
              @click="handleProcess(row)"
            >
              处理
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

    <!-- 新增工单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="新增工单"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="workOrderForm"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="案件编号" prop="caseId">
          <el-input
            v-model.number="workOrderForm.caseId"
            placeholder="请输入案件ID"
            type="number"
          />
        </el-form-item>
        <el-form-item label="工单类型" prop="orderType">
          <el-select
            v-model="workOrderForm.orderType"
            placeholder="请选择工单类型"
            style="width: 100%"
          >
            <el-option label="投诉" :value="1" />
            <el-option label="协商还款" :value="2" />
            <el-option label="信息报备" :value="3" />
            <el-option label="客户回访" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="工单状态" prop="orderStatus">
          <el-select
            v-model="workOrderForm.orderStatus"
            placeholder="请选择工单状态"
            style="width: 100%"
          >
            <el-option label="解决中" :value="1" />
            <el-option label="已解决" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="来电手机号" prop="phone">
          <el-input
            v-model="workOrderForm.phone"
            placeholder="请输入来电手机号"
            maxlength="11"
          />
        </el-form-item>
        <el-form-item label="处理人ID" prop="processor">
          <el-input
            v-model.number="workOrderForm.processor"
            placeholder="请输入处理人ID"
            type="number"
          />
        </el-form-item>
        <el-form-item label="机构ID" prop="orgId">
          <el-input
            v-model.number="workOrderForm.orgId"
            placeholder="请输入处理人机构ID"
            type="number"
          />
        </el-form-item>
        <el-form-item label="是否已读" prop="userRead">
          <el-radio-group v-model="workOrderForm.userRead">
            <el-radio :label="0">未读</el-radio>
            <el-radio :label="1">已读</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="工单备注" prop="recordRemark">
          <el-input
            v-model="workOrderForm.recordRemark"
            type="textarea"
            :rows="4"
            placeholder="请输入工单备注，最多200个字符"
            maxlength="200"
            show-word-limit
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Refresh, Plus, View, Edit } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { WorkOrder } from '@/types/workOrder'
import { getWorkOrderList, saveWorkOrder } from '@/api/workOrder'
import type { WorkOrderListParams, SaveWorkOrderParams } from '@/api/workOrder'
import dayjs from 'dayjs'

const router = useRouter()

// 搜索表单
const searchForm = reactive({
  orderId: '',
  caseNo: '',
  phone: '',
  orderType: undefined as number | undefined,
  orderStatus: undefined as number | undefined,
  createTime: null as [string, string] | null
})

// 表格数据
const loading = ref(false)
const tableData = ref<WorkOrder[]>([])

// 分页
const pagination = reactive({
  pageNum: 1,
  pageSize: 20,
  total: 0
})

// 新增工单对话框
const dialogVisible = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()

// 工单表单
const workOrderForm = reactive<SaveWorkOrderParams>({
  caseId: 0,
  orderType: 1,
  orderStatus: 1,
  phone: '',
  processor: 0,
  orgId: 0,
  userRead: 0,
  recordRemark: ''
})

// 表单验证规则
const formRules: FormRules = {
  caseId: [
    { required: true, message: '请输入案件ID', trigger: 'blur' },
    { type: 'number', min: 1, message: '案件ID必须大于0', trigger: 'blur' }
  ],
  orderType: [
    { required: true, message: '请选择工单类型', trigger: 'change' }
  ],
  orderStatus: [
    { required: true, message: '请选择工单状态', trigger: 'change' }
  ],
  phone: [
    { required: true, message: '请输入来电手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  processor: [
    { required: true, message: '请输入处理人ID', trigger: 'blur' },
    { type: 'number', min: 1, message: '处理人ID必须大于0', trigger: 'blur' }
  ],
  orgId: [
    { required: true, message: '请输入机构ID', trigger: 'blur' },
    { type: 'number', min: 1, message: '机构ID必须大于0', trigger: 'blur' }
  ],
  userRead: [
    { required: true, message: '请选择是否已读', trigger: 'change' }
  ],
  recordRemark: [
    { max: 200, message: '工单备注不能超过200个字符', trigger: 'blur' }
  ]
}

// 获取表格数据
const fetchTableData = async () => {
  loading.value = true
  try {
    // 构建请求参数
    const params: WorkOrderListParams = {
      currPage: pagination.pageNum,
      pageSize: pagination.pageSize
    }
    
    // 添加搜索条件
    if (searchForm.orderId) {
      params.orderId = searchForm.orderId
    }
    if (searchForm.caseNo) {
      params.caseNo = searchForm.caseNo
    }
    if (searchForm.phone) {
      params.phone = searchForm.phone
    }
    if (searchForm.orderType !== undefined) {
      params.orderType = searchForm.orderType
    }
    if (searchForm.orderStatus !== undefined) {
      params.orderStatus = searchForm.orderStatus
    }
    if (searchForm.createTime && searchForm.createTime.length === 2) {
      params.createTimeStart = searchForm.createTime[0]
      params.createTimeEnd = searchForm.createTime[1]
    }
    
    // 调用API
    const result = await getWorkOrderList(params)
    tableData.value = result.list
    pagination.total = result.total
  } catch (error) {
    console.error('获取工单列表失败:', error)
    ElMessage.error('获取工单列表失败')
  } finally {
    loading.value = false
  }
}

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

// 获取工单类型标签
const getOrderTypeTag = (type: number) => {
  const typeMap: Record<number, any> = {
    1: 'danger',
    2: 'warning',
    3: 'primary',
    4: 'success'
  }
  return typeMap[type] || ''
}

// 获取工单类型文本
const getOrderTypeText = (type: number) => {
  const textMap: Record<number, string> = {
    1: '投诉',
    2: '协商还款',
    3: '信息报备',
    4: '客户回访'
  }
  return textMap[type] || ''
}

// 搜索
const handleSearch = () => {
  pagination.pageNum = 1
  fetchTableData()
}

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    orderId: '',
    caseNo: '',
    phone: '',
    orderType: undefined,
    orderStatus: undefined,
    createTime: null
  })
  handleSearch()
}

// 新增工单
const handleAdd = () => {
  // 重置表单
  Object.assign(workOrderForm, {
    caseId: 0,
    orderType: 1,
    orderStatus: 1,
    phone: '',
    processor: 0,
    orgId: 0,
    userRead: 0,
    recordRemark: ''
  })
  // 重置表单验证
  formRef.value?.clearValidate()
  dialogVisible.value = true
}

// 提交工单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    // 验证表单
    await formRef.value.validate()
    
    submitLoading.value = true
    
    // 调用保存接口
    await saveWorkOrder(workOrderForm)
    
    ElMessage.success('新增工单成功')
    dialogVisible.value = false
    
    // 刷新列表
    pagination.pageNum = 1
    await fetchTableData()
  } catch (error: any) {
    if (error !== false) { // 表单验证失败会返回 false
      console.error('保存工单失败:', error)
      ElMessage.error('保存工单失败')
    }
  } finally {
    submitLoading.value = false
  }
}

// 查看详情
const handleView = (row: any) => {
  router.push(`/workOrder/detail/${row.id}`)
}

// 处理工单
const handleProcess = (_row: any) => {
  ElMessage.info('处理工单功能开发中')
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
.work-order-container {
  padding: 16px;

  .search-card,
  .toolbar-card {
    margin-bottom: 16px;
  }

  .pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 16px;
  }
}
</style>
