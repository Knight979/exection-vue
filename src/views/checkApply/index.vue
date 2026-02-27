<template>
  <div class="check-apply-container">
    <!-- 搜索筛选区 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" :inline="true">
        <el-form-item label="流水号">
          <el-input
            v-model="searchForm.sno"
            placeholder="请输入流水号"
            clearable
            style="width: 200px"
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
        <el-form-item label="债务人姓名">
          <el-input
            v-model="searchForm.respondentName"
            placeholder="请输入债务人姓名"
            clearable
            style="width: 160px"
          />
        </el-form-item>
        <el-form-item label="申请状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
            style="width: 160px"
          >
            <el-option label="待组长审批" :value="0" />
            <el-option label="待财务审批" :value="1" />
            <el-option label="审批通过" :value="2" />
            <el-option label="审批不通过" :value="3" />
            <el-option label="已撤销" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="还款日期">
          <el-date-picker
            v-model="searchForm.repayDateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
            style="width: 240px"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="申请时间">
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
        新增对账申请
      </el-button>
    </el-card>

    <!-- 数据表格 -->
    <el-card shadow="never">
      <el-table v-loading="loading" :data="tableData" stripe border>
        <el-table-column prop="sno" label="流水号" width="200" show-overflow-tooltip />
        <el-table-column
          prop="caseNo"
          label="案件编号"
          width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="respondentName"
          label="债务人"
          width="100"
          show-overflow-tooltip
        />
        <el-table-column prop="voucherMoney" label="凭证金额" width="120" align="right">
          <template #default="{ row }">
            <span style="color: #67c23a; font-weight: bold">
              {{ formatAmount(row.voucherMoney) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="repayDate" label="还款日期" width="120">
          <template #default="{ row }">
            {{ formatDateShort(row.repayDate) }}
          </template>
        </el-table-column>
        <el-table-column prop="repayWay" label="还款方式" width="100" />
        <el-table-column prop="remitter" label="汇款人" width="100" />
        <el-table-column prop="remitterRelation" label="与客户关系" width="100">
          <template #default="{ row }">
            {{ getRelationText(row.remitterRelation) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="申请状态" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)" size="default">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="applyUserName"
          label="申请人"
          width="100"
          show-overflow-tooltip
        />
        <el-table-column prop="createTime" label="申请时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right" align="center">
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
              v-if="row.status === 0 || row.status === 1"
              type="success"
              link
              :icon="Check"
              @click="handleApprove(row)"
            >
              审批
            </el-button>
            <el-button
              v-if="row.status === 0"
              type="danger"
              link
              :icon="Close"
              @click="handleCancel(row)"
            >
              撤销
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
import {
  Search,
  Refresh,
  Plus,
  View,
  Check,
  Close
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'

const router = useRouter()

// 搜索表单
const searchForm = reactive({
  sno: '',
  caseNo: '',
  respondentName: '',
  status: undefined as number | undefined,
  repayDateRange: null as [string, string] | null,
  dateRange: null as [string, string] | null
})

// 表格数据
const loading = ref(false)
const tableData = ref<any[]>([])

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
    // TODO: 调用API获取数据
    await new Promise(resolve => setTimeout(resolve, 500))
    tableData.value = generateMockData()
    pagination.total = 50
  } catch (error) {
    ElMessage.error('获取对账申请列表失败')
  } finally {
    loading.value = false
  }
}

// 生成Mock数据
const generateMockData = (): any[] => {
  const statuses = [0, 1, 2, 3, 4]
  const relations = ['1', '2', '3', '4', '5']
  const repayWays = ['支付宝', '微信', '银行转账', '现金']
  
  return Array.from({ length: pagination.pageSize }, (_, i) => ({
    id: pagination.pageNum * pagination.pageSize + i + 1,
    caseId: 1001 + i,
    caseNo: `CASE${String(1001 + i).padStart(6, '0')}`,
    sno: `SN${new Date().getTime()}${String(i).padStart(4, '0')}`,
    voucherMoney: 1000 + i * 500,
    repayDate: new Date(Date.now() - i * 86400000).toISOString(),
    repayWay: repayWays[i % 4],
    repayType: i % 2 === 0 ? '部分还款' : '全部结清',
    remitter: `汇款人${i + 1}`,
    remitterRelation: relations[i % 5],
    remitterPhone: `138${String(10000000 + i).slice(0, 8)}`,
    respondentId: 1001 + i,
    respondentName: `债务人${i + 1}`,
    applyUserId: i % 3 + 1,
    applyUserName: `申请人${i % 3 + 1}`,
    productId: 1,
    orgId: 1,
    status: statuses[i % 5],
    remark: '',
    requestRemark: `对账申请备注${i + 1}`,
    createTime: new Date(Date.now() - i * 86400000).toISOString(),
    updateTime: new Date(Date.now() - i * 43200000).toISOString()
  }))
}

// 格式化金额
const formatAmount = (amount: number) => {
  return `¥${amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`
}

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

// 格式化日期(短)
const formatDateShort = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD')
}

// 获取关系文本
const getRelationText = (relation: string) => {
  const textMap: Record<string, string> = {
    '1': '直系亲属',
    '2': '朋友',
    '3': '同事',
    '4': '本人',
    '5': '机构代还'
  }
  return textMap[relation] || relation
}

// 获取状态标签
const getStatusTag = (status: number) => {
  const tagMap: Record<number, any> = {
    0: 'warning',
    1: 'warning',
    2: 'success',
    3: 'danger',
    4: 'info'
  }
  return tagMap[status] || ''
}

// 获取状态文本
const getStatusText = (status: number) => {
  const textMap: Record<number, string> = {
    0: '待组长审批',
    1: '待财务审批',
    2: '审批通过',
    3: '审批不通过',
    4: '已撤销'
  }
  return textMap[status] || ''
}

// 搜索
const handleSearch = () => {
  pagination.pageNum = 1
  fetchTableData()
}

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    sno: '',
    caseNo: '',
    respondentName: '',
    status: undefined,
    repayDateRange: null,
    dateRange: null
  })
  handleSearch()
}

// 新增对账申请
const handleAdd = () => {
  ElMessage.info('新增对账申请功能开发中')
}

// 查看详情
const handleView = (row: any) => {
  router.push(`/checkApply/detail/${row.id}`)
}

// 审批
const handleApprove = (_row: any) => {
  ElMessage.info('审批功能开发中')
}

// 撤销
const handleCancel = (_row: any) => {
  ElMessageBox.confirm('确定要撤销该对账申请吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('撤销成功')
    fetchTableData()
  })
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
.check-apply-container {
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
