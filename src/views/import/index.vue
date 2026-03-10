<template>
  <div class="import-container">
    <!-- 导入指南卡片 -->
    <el-card class="guide-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>数据导入指南</span>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="guide-item">
            <h4>支持的文件格式</h4>
            <ul>
              <li>Excel 文件 (.xlsx, .xls)</li>
              <li>CSV 文件 (.csv)</li>
              <li>单个文件大小不超过 100MB</li>
            </ul>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="guide-item">
            <h4>导入步骤</h4>
            <ol>
              <li>选择要导入的数据类型</li>
              <li>下载模板文件并填充数据</li>
              <li>上传文件进行数据验证</li>
              <li>查看验证结果并确认导入</li>
            </ol>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 导入类型选择 -->
    <el-card class="import-type-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>选择导入类型</span>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col v-for="type in importTypes" :key="type.id" :span="8">
          <div
            class="type-card"
            :class="{ active: selectedType === type.id }"
            @click="handleSelectType(type)"
          >
            <el-icon class="type-icon" :style="{ color: type.color }">
              <component :is="type.icon" />
            </el-icon>
            <h3>{{ type.name }}</h3>
            <p>{{ type.description }}</p>
            <el-button
              type="primary"
              size="small"
              @click.stop="handleDownloadTemplate(type)"
            >
              下载模板
            </el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 文件上传区 -->
    <el-card v-if="selectedType" class="upload-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>上传文件</span>
        </div>
      </template>

      <el-upload
        ref="uploadRef"
        drag
        action="#"
        :auto-upload="false"
        :on-change="handleFileChange"
        :accept="'.xlsx,.xls,.csv'"
        multiple
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          拖动文件到此或 <em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            只能上传 Excel 或 CSV 文件，单个文件不超过 100MB
          </div>
        </template>
      </el-upload>

      <!-- 文件列表 -->
      <div v-if="uploadedFiles.length > 0" class="file-list">
        <el-table :data="uploadedFiles" stripe>
          <el-table-column prop="name" label="文件名" />
          <el-table-column prop="size" label="文件大小" width="120">
            <template #default="{ row }">
              {{ formatFileSize(row.size) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="
                  row.status === 'success'
                    ? 'success'
                    : row.status === 'error'
                      ? 'danger'
                      : 'warning'
                "
              >
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" align="center">
            <template #default="{ $index }">
              <el-button
                type="danger"
                link
                size="small"
                @click="handleRemoveFile($index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button type="primary" :loading="validating" @click="handleValidate">
          验证数据
        </el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </el-card>

    <!-- 数据验证结果 -->
    <el-card v-if="validationResult" class="result-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>数据验证结果</span>
        </div>
      </template>

      <el-alert
        :title="`共检查 ${validationResult.total} 条数据，成功 ${validationResult.success} 条，失败 ${validationResult.failed} 条`"
        :type="validationResult.failed === 0 ? 'success' : 'warning'"
        :closable="false"
        style="margin-bottom: 16px"
      />

      <!-- 错误信息 -->
      <div v-if="validationResult.errors.length > 0" class="error-section">
        <h4>错误信息</h4>
          <el-table :data="validationResult.errors" stripe max-height="300">
            <el-table-column prop="row" label="行号" width="80" />
            <el-table-column prop="field" label="字段" width="120" />
            <el-table-column prop="message" label="错误信息" min-width="300" />
          </el-table>
      </div>

      <!-- 预览数据 -->
      <div class="preview-section">
        <h4>数据预览</h4>
        <el-table :data="validationResult.preview" stripe max-height="300">
          <el-table-column
            v-for="col in validationResult.columns"
            :key="col"
            :prop="col"
            :label="col"
          />
        </el-table>
      </div>

      <!-- 导入按钮 -->
      <div class="import-buttons">
        <el-button
          type="primary"
          :loading="importing"
          :disabled="validationResult.failed > 0"
          @click="handleImport"
        >
          确认导入
        </el-button>
        <el-button @click="handleCancelImport">取消</el-button>
      </div>
    </el-card>

    <!-- 导入历史 -->
    <el-card class="history-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>导入历史</span>
          <el-button type="primary" link @click="handleRefreshHistory">刷新</el-button>
        </div>
      </template>

      <el-table v-loading="historyLoading" :data="importHistory" stripe>
        <el-table-column prop="id" label="导入ID" width="100" />
        <el-table-column prop="fileName" label="文件名" width="200" show-overflow-tooltip />
        <el-table-column prop="type" label="导入类型" width="120" />
        <el-table-column prop="totalCount" label="总数" width="80" align="right" />
        <el-table-column prop="successCount" label="成功" width="80" align="right">
          <template #default="{ row }">
            <span style="color: #67c23a">{{ row.successCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="failureCount" label="失败" width="80" align="right">
          <template #default="{ row }">
            <span style="color: #f56c6c">{{ row.failureCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'success' ? 'success' : 'danger'">
              {{ row.status === 'success' ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="导入时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleViewHistory(row)">
              详情
            </el-button>
            <el-button type="success" link size="small" @click="handleDownloadLog(row)">
              下载日志
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 导入详情对话框 -->
    <el-dialog
      v-model="historyDetailVisible"
      title="导入详情"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-descriptions v-if="currentHistory" :column="2" border>
        <el-descriptions-item label="导入ID">
          {{ currentHistory.id }}
        </el-descriptions-item>
        <el-descriptions-item label="文件名">
          {{ currentHistory.fileName }}
        </el-descriptions-item>
        <el-descriptions-item label="导入类型">
          {{ currentHistory.type }}
        </el-descriptions-item>
        <el-descriptions-item label="导入状态">
          <el-tag :type="currentHistory.status === 'success' ? 'success' : 'danger'">
            {{ currentHistory.status === 'success' ? '成功' : '失败' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="总数">
          {{ currentHistory.totalCount }}
        </el-descriptions-item>
        <el-descriptions-item label="成功">
          <span style="color: #67c23a">{{ currentHistory.successCount }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="失败">
          <span style="color: #f56c6c">{{ currentHistory.failureCount }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="导入人">
          {{ currentHistory.createdBy }}
        </el-descriptions-item>
        <el-descriptions-item label="导入时间" :span="2">
          {{ formatDate(currentHistory.createTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">
          {{ currentHistory.remark || '-' }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="historyDetailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

// 导入类型
const importTypes = ref([
  {
    id: 'case',
    name: '案件数据',
    description: '导入案件基本信息',
    icon: 'DocumentCopy',
    color: '#3a8ee6'
  },
  {
    id: 'user',
    name: '用户数据',
    description: '导入用户信息',
    icon: 'DocumentCopy',
    color: '#67c23a'
  },
  {
    id: 'contact',
    name: '联系方式',
    description: '导入债务人联系方式',
    icon: 'DocumentCopy',
    color: '#e6a23c'
  }
])

// 状态
const selectedType = ref('')
const uploadRef = ref()
const uploadedFiles = ref<any[]>([])
const validating = ref(false)
const importing = ref(false)
const historyLoading = ref(false)
const validationResult = ref<any>(null)
const historyDetailVisible = ref(false)
const currentHistory = ref<any>(null)
const importHistory = ref<any[]>([])

// 获取状态文本
const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    pending: '待验证',
    validating: '验证中',
    success: '验证成功',
    error: '验证失败'
  }
  return map[status] || status
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

// 格式化日期
const formatDate = (date?: string) => {
  return date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : '-'
}

// 选择导入类型
const handleSelectType = (type: any) => {
  selectedType.value = type.id
}

// 下载模板
const handleDownloadTemplate = (type: any) => {
  ElMessage.success(`模板"${type.name}"下载成功`)
}

// 文件变化
const handleFileChange = (file: any) => {
  uploadedFiles.value.push({
    name: file.name,
    size: file.size,
    status: 'pending',
    raw: file.raw
  })
}

// 删除文件
const handleRemoveFile = (index: number) => {
  uploadedFiles.value.splice(index, 1)
}

// 验证数据
const handleValidate = async () => {
  if (uploadedFiles.value.length === 0) {
    ElMessage.warning('请先上传文件')
    return
  }

  validating.value = true
  try {
    // TODO: 调用API验证数据
    // const res = await validateImportData(uploadedFiles.value)
    
    // Mock数据
    await new Promise(resolve => setTimeout(resolve, 1000))
    validationResult.value = {
      total: 100,
      success: 95,
      failed: 5,
      errors: [
        { row: 1, field: '身份证号', message: '身份证号格式不正确' },
        { row: 5, field: '电话号码', message: '电话号码不能为空' },
        { row: 10, field: '债务金额', message: '债务金额必须为数字' },
        { row: 15, field: '案件编号', message: '案件编号已存在' },
        { row: 20, field: '产品名称', message: '产品不存在' }
      ],
      preview: [
        { 姓名: '张三', 身份证号: '110101199001011234', 电话号码: '13800138000', 债务金额: 50000 },
        { 姓名: '李四', 身份证号: '110101199101011234', 电话号码: '13800138001', 债务金额: 60000 },
        { 姓名: '王五', 身份证号: '110101199201011234', 电话号码: '13800138002', 债务金额: 70000 }
      ],
      columns: ['姓名', '身份证号', '电话号码', '债务金额']
    }
    ElMessage.success('数据验证完成')
  } catch (error) {
    ElMessage.error('数据验证失败')
  } finally {
    validating.value = false
  }
}

// 确认导入
const handleImport = async () => {
  importing.value = true
  try {
    // TODO: 调用API导入数据
    // const res = await importData(uploadedFiles.value)
    
    // Mock数据
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('数据导入成功')
    handleCancelImport()
    handleRefreshHistory()
  } catch (error) {
    ElMessage.error('数据导入失败')
  } finally {
    importing.value = false
  }
}

// 取消导入
const handleCancelImport = () => {
  validationResult.value = null
  uploadedFiles.value = []
}

// 重置
const handleReset = () => {
  uploadedFiles.value = []
  validationResult.value = null
}

// 获取导入历史
const fetchImportHistory = async () => {
  historyLoading.value = true
  try {
    // TODO: 调用API获取导入历史
    // const res = await getImportHistory()
    
    // Mock数据
    await new Promise(resolve => setTimeout(resolve, 500))
    importHistory.value = [
      {
        id: '1',
        fileName: '案件数据_20240305.xlsx',
        type: '案件数据',
        totalCount: 100,
        successCount: 100,
        failureCount: 0,
        status: 'success',
        createdBy: '张三',
        createTime: new Date(Date.now() - 86400000).toISOString(),
        remark: '导入成功'
      },
      {
        id: '2',
        fileName: '用户数据_20240304.xlsx',
        type: '用户数据',
        totalCount: 50,
        successCount: 48,
        failureCount: 2,
        status: 'success',
        createdBy: '李四',
        createTime: new Date(Date.now() - 172800000).toISOString(),
        remark: '导入成功，2条数据格式错误'
      }
    ]
  } catch (error) {
    ElMessage.error('获取导入历史失败')
  } finally {
    historyLoading.value = false
  }
}

// 刷新历史
const handleRefreshHistory = () => {
  fetchImportHistory()
}

// 查看历史详情
const handleViewHistory = (row: any) => {
  currentHistory.value = row
  historyDetailVisible.value = true
}

// 下载日志
const handleDownloadLog = (row: any) => {
  ElMessage.success(`日志"${row.fileName}"下载成功`)
}

// 初始化
onMounted(() => {
  fetchImportHistory()
})
</script>

<style scoped lang="scss">
.import-container {
  padding: 16px;

  .guide-card,
  .import-type-card,
  .upload-card,
  .result-card,
  .history-card {
    margin-bottom: 24px;
  }

  .guide-item {
    h4 {
      margin-top: 0;
      margin-bottom: 12px;
      font-size: 14px;
      font-weight: 600;
    }

    ul,
    ol {
      margin: 0;
      padding-left: 20px;

      li {
        margin-bottom: 8px;
        color: #606266;
      }
    }
  }

  .type-card {
    border: 2px solid #dcdfe6;
    border-radius: 8px;
    padding: 24px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;

    &:hover,
    &.active {
      border-color: #3a8ee6;
      background-color: #f0f9ff;
    }

    .type-icon {
      font-size: 40px;
      margin-bottom: 12px;
    }

    h3 {
      margin: 12px 0 8px 0;
      font-size: 16px;
    }

    p {
      margin: 0 0 16px 0;
      color: #909399;
      font-size: 14px;
    }
  }

  .file-list {
    margin-top: 24px;
  }

  .action-buttons {
    display: flex;
    gap: 8px;
    margin-top: 24px;
  }

  .error-section,
  .preview-section {
    margin-bottom: 24px;

    h4 {
      margin-top: 0;
      margin-bottom: 12px;
      font-size: 14px;
      font-weight: 600;
    }
  }

  .import-buttons {
    display: flex;
    gap: 8px;
    margin-top: 24px;
    justify-content: flex-end;
  }
}
</style>
