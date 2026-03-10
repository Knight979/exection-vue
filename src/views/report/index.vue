<template>
  <div class="report-list-container">
    <!-- 报表类型卡片 -->
    <div class="report-cards">
      <el-card
        v-for="reportType in reportTypes"
        :key="reportType.id"
        class="report-card"
        shadow="hover"
        @click="handleSelectReport(reportType)"
      >
        <template #header>
          <div class="card-header">
            <el-icon class="report-icon" :style="{ color: reportType.color }">
              <component :is="reportType.icon" />
            </el-icon>
            <span class="report-name">{{ reportType.name }}</span>
          </div>
        </template>
        <div class="card-content">
          <p class="report-description">{{ reportType.description }}</p>
          <el-button type="primary" size="small" @click.stop="handleGenerateReport(reportType)">
            生成报表
          </el-button>
        </div>
      </el-card>
    </div>

    <!-- 最近生成的报表 -->
    <el-card class="recent-reports" shadow="never">
      <template #header>
        <div class="card-header">
          <span>最近生成的报表</span>
          <el-button type="primary" link @click="handleRefreshReports">刷新</el-button>
        </div>
      </template>

      <el-table v-loading="loading" :data="recentReports" stripe border>
        <el-table-column
          prop="id"
          label="报表ID"
          width="100"
          show-overflow-tooltip
        />
        <el-table-column
          prop="name"
          label="报表名称"
          width="200"
          show-overflow-tooltip
        />
        <el-table-column
          prop="type"
          label="报表类型"
          width="120"
          align="center"
        >
          <template #default="{ row }">
            <el-tag>{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="100"
          align="center"
        >
          <template #default="{ row }">
            <el-tag :type="row.status === 'completed' ? 'success' : 'warning'">
              {{ row.status === 'completed' ? '已完成' : '生成中' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="生成时间"
          width="180"
        >
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="createdBy"
          label="生成人"
          width="100"
          show-overflow-tooltip
        />
        <el-table-column
          label="操作"
          width="200"
          fixed="right"
          align="center"
        >
          <template #default="{ row }">
            <el-button
              v-if="row.status === 'completed'"
              type="primary"
              link
              :icon="View"
              @click="handleViewReport(row)"
            >
              查看
            </el-button>
            <el-button
              v-if="row.status === 'completed'"
              type="success"
              link
              :icon="Download"
              @click="handleDownloadReport(row)"
            >
              下载
            </el-button>
            <el-button
              type="danger"
              link
              :icon="Delete"
              @click="handleDeleteReport(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 报表生成对话框 -->
    <el-dialog
      v-model="generateDialogVisible"
      title="生成报表"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="reportForm"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="报表名称" prop="name">
          <el-input
            v-model="reportForm.name"
            placeholder="请输入报表名称"
          />
        </el-form-item>
        <el-form-item label="报表类型" prop="type">
          <el-select
            v-model="reportForm.type"
            placeholder="请选择报表类型"
            disabled
            style="width: 100%"
          >
            <el-option
              v-for="type in reportTypes"
              :key="type.id"
              :label="type.name"
              :value="type.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围" prop="dateRange">
          <el-date-picker
            v-model="reportForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="筛选条件">
          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item label="产品" prop="productId">
                <el-select
                  v-model="reportForm.productId"
                  placeholder="请选择产品"
                  clearable
                  style="width: 100%"
                >
                  <el-option label="极速贷" :value="1" />
                  <el-option label="信用贷" :value="2" />
                  <el-option label="车贷通" :value="3" />
                  <el-option label="房贷宝" :value="4" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="催收员" prop="collectorId">
                <el-select
                  v-model="reportForm.collectorId"
                  placeholder="请选择催收员"
                  clearable
                  style="width: 100%"
                >
                  <el-option label="张三" :value="1" />
                  <el-option label="李四" :value="2" />
                  <el-option label="王五" :value="3" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="导出格式" prop="exportFormat">
          <el-select
            v-model="reportForm.exportFormat"
            placeholder="请选择导出格式"
            style="width: 100%"
          >
            <el-option label="Excel" value="excel" />
            <el-option label="PDF" value="pdf" />
            <el-option label="CSV" value="csv" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="generateDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmitReport">
          生成
        </el-button>
      </template>
    </el-dialog>

    <!-- 报表查看对话框 -->
    <el-dialog
      v-model="viewDialogVisible"
      title="报表查看"
      width="90%"
      :close-on-click-modal="false"
    >
      <div class="report-viewer">
        <div v-if="currentReport" class="report-header">
          <h2>{{ currentReport.name }}</h2>
          <p>生成时间：{{ formatDate(currentReport.createTime) }}</p>
        </div>
        
        <!-- 报表内容 -->
        <div class="report-content">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-card shadow="never">
                <template #header>
                  <div class="card-header">
                    <span>案件数量统计</span>
                  </div>
                </template>
                <div id="chart1" style="height: 300px"></div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card shadow="never">
                <template #header>
                  <div class="card-header">
                    <span>回款金额统计</span>
                  </div>
                </template>
                <div id="chart2" style="height: 300px"></div>
              </el-card>
            </el-col>
          </el-row>
          
          <el-card shadow="never" style="margin-top: 20px">
            <template #header>
              <div class="card-header">
                <span>详细数据表</span>
              </div>
            </template>
            <el-table :data="reportTableData" stripe border>
              <el-table-column prop="name" label="名称" width="200" />
              <el-table-column prop="value" label="数值" width="150" align="right" />
              <el-table-column prop="percentage" label="占比" width="150" align="right" />
            </el-table>
          </el-card>
        </div>
      </div>
      <template #footer>
        <el-button @click="viewDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleExportReport">导出</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  View,
  Download,
  Delete
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import dayjs from 'dayjs'

// 报表类型
const reportTypes = ref([
  {
    id: 'daily',
    name: '日报',
    description: '每日催收工作总结报表',
    icon: 'DocumentCopy',
    color: '#3a8ee6'
  },
  {
    id: 'weekly',
    name: '周报',
    description: '每周催收工作汇总报表',
    icon: 'DocumentCopy',
    color: '#67c23a'
  },
  {
    id: 'monthly',
    name: '月报',
    description: '每月催收工作总结报表',
    icon: 'DocumentCopy',
    color: '#e6a23c'
  },
  {
    id: 'performance',
    name: '绩效报表',
    description: '催收员绩效评估报表',
    icon: 'BarChart',
    color: '#f56c6c'
  },
  {
    id: 'case_analysis',
    name: '案件分析',
    description: '案件数据分析报表',
    icon: 'LineChart',
    color: '#909399'
  },
  {
    id: 'recovery_analysis',
    name: '回款分析',
    description: '回款数据分析报表',
    icon: 'PieChart',
    color: '#00a870'
  }
])

// 对话框
const generateDialogVisible = ref(false)
const viewDialogVisible = ref(false)
const loading = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()

// 最近生成的报表
const recentReports = ref<any[]>([])
const currentReport = ref<any>(null)
const reportTableData = ref<any[]>([])

// 报表表单
const reportForm = reactive({
  name: '',
  type: '',
  dateRange: null as [string, string] | null,
  productId: undefined as number | undefined,
  collectorId: undefined as number | undefined,
  exportFormat: 'excel'
})

// 表单验证规则
const formRules: FormRules = {
  name: [
    { required: true, message: '请输入报表名称', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择报表类型', trigger: 'change' }
  ],
  dateRange: [
    { required: true, message: '请选择时间范围', trigger: 'change' }
  ]
}

// 获取最近生成的报表
const fetchRecentReports = async () => {
  loading.value = true
  try {
    // TODO: 调用API获取报表列表
    // const res = await getReportList()
    
    // Mock数据
    await new Promise(resolve => setTimeout(resolve, 500))
    recentReports.value = [
      {
        id: '1',
        name: '2024年3月日报',
        type: '日报',
        status: 'completed',
        createTime: new Date(Date.now() - 86400000).toISOString(),
        createdBy: '张三'
      },
      {
        id: '2',
        name: '2024年第10周周报',
        type: '周报',
        status: 'completed',
        createTime: new Date(Date.now() - 7 * 86400000).toISOString(),
        createdBy: '李四'
      },
      {
        id: '3',
        name: '2024年2月月报',
        type: '月报',
        status: 'completed',
        createTime: new Date(Date.now() - 30 * 86400000).toISOString(),
        createdBy: '王五'
      },
      {
        id: '4',
        name: '2024年3月绩效报表',
        type: '绩效报表',
        status: 'generating',
        createTime: new Date().toISOString(),
        createdBy: '赵六'
      }
    ]
  } catch (error) {
    ElMessage.error('获取报表列表失败')
  } finally {
    loading.value = false
  }
}

// 格式化日期
const formatDate = (date?: string) => {
  return date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : '-'
}

// 选择报表类型
const handleSelectReport = (reportType: any) => {
  reportForm.type = reportType.id
  reportForm.name = `${reportType.name}-${dayjs().format('YYYY-MM-DD')}`
  reportForm.dateRange = [
    dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD')
  ] as [string, string]
  generateDialogVisible.value = true
}

// 生成报表
const handleGenerateReport = (reportType: any) => {
  handleSelectReport(reportType)
}

// 刷新报表列表
const handleRefreshReports = () => {
  fetchRecentReports()
}

// 查看报表
const handleViewReport = (report: any) => {
  currentReport.value = report
  reportTableData.value = [
    { name: '案件总数', value: 1000, percentage: '100%' },
    { name: '已结清', value: 600, percentage: '60%' },
    { name: '进行中', value: 300, percentage: '30%' },
    { name: '坏账', value: 100, percentage: '10%' }
  ]
  viewDialogVisible.value = true
}

// 下载报表
const handleDownloadReport = (report: any) => {
  ElMessage.success(`报表"${report.name}"下载成功`)
}

// 导出报表
const handleExportReport = () => {
  ElMessage.success('报表导出成功')
}

// 删除报表
const handleDeleteReport = (report: any) => {
  ElMessageBox.confirm(
    `确定要删除报表"${report.name}"吗?`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      // TODO: 调用API删除报表
      // await deleteReport(report.id)
      fetchRecentReports()
      ElMessage.success('报表删除成功')
    } catch (error) {
      ElMessage.error('报表删除失败')
    }
  })
}

// 提交报表生成
const handleSubmitReport = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        submitLoading.value = true
        // TODO: 调用API生成报表
        // await generateReport(reportForm)
        ElMessage.success('报表生成成功')
        generateDialogVisible.value = false
        fetchRecentReports()
      } catch (error: any) {
        ElMessage.error(error.message || '报表生成失败')
      } finally {
        submitLoading.value = false
      }
    }
  })
}

// 初始化
onMounted(() => {
  fetchRecentReports()
})
</script>

<style scoped lang="scss">
.report-list-container {
  padding: 16px;

  .report-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
    margin-bottom: 24px;

    .report-card {
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-4px);
      }

      .card-header {
        display: flex;
        align-items: center;
        gap: 12px;

        .report-icon {
          font-size: 24px;
        }

        .report-name {
          font-weight: 600;
        }
      }

      .card-content {
        .report-description {
          color: #909399;
          margin-bottom: 16px;
        }
      }
    }
  }

  .recent-reports {
    margin-bottom: 24px;
  }

  .report-viewer {
    .report-header {
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid #dcdfe6;

      h2 {
        margin: 0 0 8px 0;
        font-size: 20px;
      }

      p {
        margin: 0;
        color: #909399;
      }
    }

    .report-content {
      max-height: 600px;
      overflow-y: auto;
    }
  }
}
</style>
