<template>
  <div class="execution-container">
    <!-- 搜索筛选区 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" :inline="true">
        <el-form-item label="申请人">
          <el-input
            v-model="searchForm.applicantName"
            placeholder="请输入申请人"
            clearable
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item label="被申请人">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入被申请人"
            clearable
            style="width: 160px"
          />
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input
            v-model="searchForm.idcard"
            placeholder="请输入身份证号"
            clearable
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item label="电话号码">
          <el-input
            v-model="searchForm.phone"
            placeholder="请输入电话号码"
            clearable
            style="width: 160px"
          />
        </el-form-item>
        <el-form-item label="中院执行案号">
          <el-input
            v-model="searchForm.middleCaseNo"
            placeholder="请输入中院执行案号"
            clearable
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item label="基层执行案号">
          <el-input
            v-model="searchForm.basicCaseNo"
            placeholder="请输入基层执行案号"
            clearable
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item label="案件状态">
          <el-select
            v-model="searchForm.caseStatus"
            placeholder="请选择案件状态"
            clearable
            style="width: 160px"
          >
            <el-option label="待平台分案" :value="1" />
            <el-option label="待分配坐席" :value="3" />
            <el-option label="再催" :value="4" />
            <el-option label="停催" :value="6" />
            <el-option label="结清" :value="10" />
            <el-option label="在催-普通留案中" :value="13" />
            <el-option label="在催-特殊留案中" :value="14" />
          </el-select>
        </el-form-item>
        <el-form-item label="执行状态">
          <el-input
            v-model="searchForm.zxCaseStatus"
            placeholder="请输入执行状态"
            clearable
            style="width: 140px"
          />
        </el-form-item>
        <el-form-item label="执行阶段">
          <el-input
            v-model="searchForm.caseStep"
            placeholder="请输入执行阶段"
            clearable
            style="width: 140px"
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
  
    <!-- 数据表格 -->
    <el-card shadow="never">
      <el-table v-loading="loading" :data="tableData" stripe border>
        <el-table-column
          prop="id"
          label="编号"
          width="60"
          align="center"
          fixed="left"
        />
        
        <el-table-column
          prop="name"
          label="被申请人"
          width="100"
          show-overflow-tooltip
        />
        <el-table-column
          prop="idcard"
          label="身份证号"
          width="180"
          show-overflow-tooltip
        />
        <el-table-column
          prop="phone"
          label="电话号码"
          width="130"
        />
        <el-table-column
          prop="productName"
          label="产品"
          width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="applicantName"
          label="申请人"
          width="200"
          show-overflow-tooltip
        />
        <el-table-column
          prop="middleCaseNo"
          label="中院执行案号"
          width="180"
          show-overflow-tooltip
        />
        <el-table-column
          prop="basicCaseNo"
          label="基层执行案号"
          width="180"
          show-overflow-tooltip
        />
        <el-table-column
          prop="middleCourt"
          label="中级法院"
          width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="basicCourt"
          label="基础法院"
          width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="debtTotal"
          label="债务总额"
          width="100"
          align="right"
        >
          <template #default="{ row }">
            <span style="color: #f56c6c; font-weight: bold">
              {{ formatAmount(row.debtTotal) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="caseStep"
          label="执行阶段"
          width="100"
          align="center"
        />
        <el-table-column
          prop="zxCaseStatus"
          label="执行状态"
          width="100"
          align="center"
        />
        <el-table-column
          prop="caseStatus"
          label="案件状态"
          width="80"
          align="center"
        >
          <template #default="{ row }">
            <el-tag :type="getCaseStatusType(row.caseStatus)">
              {{ getCaseStatusText(row.caseStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="casePool"
          label="类型"
          width="80"
          align="center"
        >
          <template #default="{ row }">
            <el-tag :type="row.casePool === 0 ? '' : 'success'">
              {{ row.casePool === 0 ? '仲裁' : '执行' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="instalment"
          label="分期标记"
          width="100"
          align="center"
        >
          <template #default="{ row }">
            {{ row.instalment === 1 ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="netTime"
          label="网申时间"
          width="160"
        >
          <template #default="{ row }">
            {{ formatDate(row.netTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="overdueStartTime"
          label="逾期开始时间"
          width="120"
        >
          <template #default="{ row }">
            {{ formatDate(row.overdueStartTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="agentStartTime"
          label="委案开始时间"
          width="120"
        >
          <template #default="{ row }">
            {{ formatDate(row.agentStartTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="agentEndTime"
          label="委案结束时间"
          width="120"
        >
          <template #default="{ row }">
            {{ formatDate(row.agentEndTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="修改时间"
          width="160"
        >
          <template #default="{ row }">
            {{ formatDateTime(row.updateTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          min-width="200"
          show-overflow-tooltip
        />
        <el-table-column label="操作" width="100" fixed="right" align="center">
          <template #default="{ row }">
            <el-button
              type="primary"
              link
              :icon="View"
              @click="handleView(row)"
            >
              查看
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Refresh, View } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { ExecutionCase } from '@/types/execution'
import { getExecutionList } from '@/api/execution'
import type { ExecutionListParams } from '@/api/execution'
import dayjs from 'dayjs'

const router = useRouter()

// 搜索表单
const searchForm = reactive({
  applicantName: '',
  name: '',
  idcard: '',
  phone: '',
  middleCaseNo: '',
  basicCaseNo: '',
  caseStatus: undefined as number | undefined,
  zxCaseStatus: '',
  caseStep: ''
})

// 表格数据
const loading = ref(false)
const tableData = ref<ExecutionCase[]>([])

// 分页
const pagination = reactive({
  pageNum: 1,
  pageSize: 20,
  total: 0
})

// 获取表格数据
const fetchTableData = async () => {
  loading.value = true
  try {
    // 构建请求参数
    const params: ExecutionListParams = {
      currPage: pagination.pageNum,
      pageSize: pagination.pageSize
    }
    
    // 添加搜索条件
    if (searchForm.applicantName) {
      params.applicantName = searchForm.applicantName
    }
    if (searchForm.name) {
      params.name = searchForm.name
    }
    if (searchForm.idcard) {
      params.idcard = searchForm.idcard
    }
    if (searchForm.phone) {
      params.phone = searchForm.phone
    }
    if (searchForm.middleCaseNo) {
      params.middleCaseNo = searchForm.middleCaseNo
    }
    if (searchForm.basicCaseNo) {
      params.basicCaseNo = searchForm.basicCaseNo
    }
    if (searchForm.caseStatus !== undefined) {
      params.caseStatus = searchForm.caseStatus
    }
    if (searchForm.zxCaseStatus) {
      params.zxCaseStatus = searchForm.zxCaseStatus
    }
    if (searchForm.caseStep) {
      params.caseStep = searchForm.caseStep
    }
    
    // 调用API
    const result = await getExecutionList(params)
    tableData.value = result.list
    pagination.total = result.total
  } catch (error) {
    console.error('获取执行案件列表失败:', error)
    ElMessage.error('获取执行案件列表失败')
  } finally {
    loading.value = false
  }
}

// 格式化金额
const formatAmount = (amount: number) => {
  if (!amount && amount !== 0) return '-'
  return `¥${amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`
}

// 格式化日期时间
const formatDateTime = (date: string | null) => {
  if (!date) return '-'
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

const formatDate = (date: string | null) => {
  if (!date) return '-'
  return dayjs(date).format('YYYY-MM-DD')
}

// 获取案件状态类型
const getCaseStatusType = (status?: number) => {
  if (status === undefined || status === null) return 'info'
  const typeMap: Record<number, any> = {
    1: 'warning',
    3: 'warning',
    4: 'primary',
    6: 'info',
    10: 'success',
    12: 'danger',
    13: 'primary',
    14: 'primary'
  }
  return typeMap[status] || 'info'
}

// 获取案件状态文本
const getCaseStatusText = (status?: number) => {
  if (status === undefined || status === null) return '未知'
  const textMap: Record<number, string> = {
    1: '待平台分案',
    3: '待分配坐席',
    4: '再催',
    6: '停催',
    10: '结清',
    12: '已删除',
    13: '在催-普通留案中',
    14: '在催-特殊留案中'
  }
  return textMap[status] || '未知'
}

// 搜索
const handleSearch = () => {
  pagination.pageNum = 1
  fetchTableData()
}

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    applicantName: '',
    name: '',
    idcard: '',
    phone: '',
    middleCaseNo: '',
    basicCaseNo: '',
    caseStatus: undefined,
    zxCaseStatus: '',
    caseStep: ''
  })
  handleSearch()
}

// 查看详情 - 新窗口打开
const handleView = (row: ExecutionCase) => {
  const routeData = router.resolve({
    name: 'ExecutionDetail',
    params: { dataId: String(row.dataId) }
  })
  window.open(routeData.href, '_blank')
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
.execution-container {
  padding: 16px;

  .search-card {
    margin-bottom: 16px;
  }

  .pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 16px;
  }
}
</style>
