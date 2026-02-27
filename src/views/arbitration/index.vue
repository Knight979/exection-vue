<template>
  <div class="arbitration-container">
    <!-- 搜索筛选区 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" :inline="true">
        <el-form-item label="仲裁案号">
          <el-input
            v-model="searchForm.acCaseNo"
            placeholder="请输入仲裁案号"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="仲裁委名称">
          <el-input
            v-model="searchForm.acName"
            placeholder="请输入仲裁委名称"
            clearable
            style="width: 160px"
          />
        </el-form-item>
        <el-form-item label="申请人">
          <el-input
            v-model="searchForm.applicantName"
            placeholder="请输入申请人"
            clearable
            style="width: 160px"
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
        <el-form-item label="仲裁状态">
          <el-select
            v-model="searchForm.acStatus"
            placeholder="请选择状态"
            clearable
            style="width: 140px"
          >
            <el-option label="撤案" :value="0" />
            <el-option label="待出裁" :value="1" />
            <el-option label="已经出裁" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="裁决日期">
          <el-date-picker
            v-model="searchForm.judgeDateRange"
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

    <!-- 数据表格 -->
    <el-card shadow="never">
      <el-table v-loading="loading" :data="tableData" stripe border>
        <el-table-column
          prop="id"
          label="编号"
          width="80"
          align="center"
        />
        <el-table-column
          prop="acCaseNo"
          label="仲裁案号"
          width="200"
          show-overflow-tooltip
        />
        <el-table-column
          prop="acName"
          label="仲裁委名称"
          width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="applicantName"
          label="申请人"
          width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="name"
          label="被申请人"
          width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="type"
          label="案件类型"
          width="100"
          align="center"
        />
        <el-table-column
          prop="arbitrator"
          label="仲裁员"
          width="100"
          show-overflow-tooltip
        />
        <el-table-column
          prop="secretary"
          label="仲裁秘书"
          width="100"
          show-overflow-tooltip
        />
        <el-table-column
          prop="amount"
          label="仲裁标的"
          width="120"
          align="right"
        >
          <template #default="{ row }">
            <span style="color: #f56c6c; font-weight: bold">
              {{ formatAmount(row.amount) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="cost"
          label="仲裁费用"
          width="110"
          align="right"
        >
          <template #default="{ row }">
            {{ formatAmount(row.cost) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="acStatus"
          label="仲裁状态"
          width="100"
          align="center"
        >
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.acStatus)">
              {{ getStatusText(row.acStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="setupDay"
          label="立案日期"
          width="120"
        >
          <template #default="{ row }">
            {{ formatDateShort(row.setupDay) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="judgeDate"
          label="裁决日期"
          width="120"
        >
          <template #default="{ row }">
            {{ formatDateShort(row.judgeDate) }}
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
import type { ArbitrationCase } from '@/types/arbitration'
import { getArbitrationList } from '@/api/arbitration'
import type { ArbitrationListParams } from '@/api/arbitration'
import dayjs from 'dayjs'

 const router = useRouter()

// 搜索表单
const searchForm = reactive({
  acCaseNo: '',
  acName: '',
  applicantName: '',
  name: '',
  idcard: '',
  phone: '',
  acStatus: undefined as number | undefined,
  judgeDateRange: null as [string, string] | null
})

// 表格数据
const loading = ref(false)
const tableData = ref<ArbitrationCase[]>([])

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
    const params: ArbitrationListParams = {
      currPage: pagination.pageNum,
      pageSize: pagination.pageSize
    }
    
    // 添加搜索条件
    if (searchForm.acCaseNo) {
      params.acCaseNo = searchForm.acCaseNo
    }
    if (searchForm.acName) {
      params.acName = searchForm.acName
    }
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
    if (searchForm.acStatus !== undefined) {
      params.acStatus = searchForm.acStatus
    }
    if (searchForm.judgeDateRange && searchForm.judgeDateRange.length === 2) {
      params.judgeDateStart = searchForm.judgeDateRange[0]
      params.judgeDateEnd = searchForm.judgeDateRange[1]
    }
    
    // 调用API
    const result = await getArbitrationList(params)
    tableData.value = result.list
    pagination.total = result.total
    
    // 调试：打印第一条数据的状态
    if (result.list.length > 0) {
      console.log('第一条数据的acStatus:', result.list[0].acStatus, '类型:', typeof result.list[0].acStatus)
    }
  } catch (error) {
    console.error('获取仲裁案件列表失败:', error)
    ElMessage.error('获取仲裁案件列表失败')
  } finally {
    loading.value = false
  }
}

// 格式化金额
const formatAmount = (amount: number) => {
  return `¥${amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`
}

// 格式化日期(短)
const formatDateShort = (date: string) => {
  if (!date) return '-'
  return dayjs(date).format('YYYY-MM-DD')
}

// 获取状态标签
const getStatusTag = (status?: number) => {
  if (status === undefined || status === null) return 'info'
  const tagMap: Record<number, any> = {
    0: 'info',
    1: 'warning',
    2: 'success'
  }
  return tagMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status?: number) => {
  if (status === undefined || status === null) return '未知'
  const textMap: Record<number, string> = {
    0: '撤案',
    1: '待出裁',
    2: '已经出裁'
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
    acCaseNo: '',
    acName: '',
    applicantName: '',
    name: '',
    idcard: '',
    phone: '',
    acStatus: undefined,
    judgeDateRange: null
  })
  handleSearch()
}

// 查看详情
const handleView = (row: ArbitrationCase) => {
  //ElMessage.info(`查看仲裁案件详情：${row.acCaseNo}`)
   router.push(`/arbitration/detail/${row.id}`)
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
.arbitration-container {
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
