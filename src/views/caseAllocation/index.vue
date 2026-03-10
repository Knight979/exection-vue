<template>
  <div class="case-allocation-container">
    <!-- 分配方式选择 -->
    <el-card class="method-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>选择分配方式</span>
        </div>
      </template>
      <el-radio-group v-model="allocationMethod" style="display: flex; gap: 40px">
        <el-radio label="single">单个分配</el-radio>
        <el-radio label="batch">批量分配</el-radio>
        <el-radio label="transfer">案件转移</el-radio>
      </el-radio-group>
    </el-card>

    <!-- 单个分配 -->
    <el-card v-if="allocationMethod === 'single'" class="allocation-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>单个案件分配</span>
        </div>
      </template>

      <el-form :model="singleForm" label-width="120px">
        <el-form-item label="选择案件">
          <el-select
            v-model="singleForm.caseId"
            placeholder="请选择案件"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="caseItem in caseList"
              :key="caseItem.id"
              :label="`${caseItem.name} - ${caseItem.caseNo}`"
              :value="caseItem.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分配给">
          <el-select
            v-model="singleForm.collectorId"
            placeholder="请选择催收员"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="collector in collectorList"
              :key="collector.id"
              :label="collector.name"
              :value="collector.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分配优先级">
          <el-select
            v-model="singleForm.priority"
            placeholder="请选择优先级"
            style="width: 100%"
          >
            <el-option label="低" :value="1" />
            <el-option label="中" :value="2" />
            <el-option label="高" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="singleForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSingleAllocate">
            分配
          </el-button>
          <el-button @click="handleResetSingle">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 批量分配 -->
    <el-card v-if="allocationMethod === 'batch'" class="allocation-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>批量案件分配</span>
        </div>
      </template>

      <el-form :model="batchForm" label-width="120px">
        <el-form-item label="选择案件">
          <el-select
            v-model="batchForm.caseIds"
            placeholder="请选择案件"
            multiple
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="caseItem in caseList"
              :key="caseItem.id"
              :label="`${caseItem.name} - ${caseItem.caseNo}`"
              :value="caseItem.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分配方式">
          <el-radio-group v-model="batchForm.allocateType">
            <el-radio label="fixed">固定分配给</el-radio>
            <el-radio label="average">平均分配</el-radio>
            <el-radio label="workload">按工作量分配</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="batchForm.allocateType === 'fixed'" label="分配给">
          <el-select
            v-model="batchForm.collectorId"
            placeholder="请选择催收员"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="collector in collectorList"
              :key="collector.id"
              :label="collector.name"
              :value="collector.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="batchForm.allocateType !== 'fixed'" label="分配给">
          <el-select
            v-model="batchForm.collectorIds"
            placeholder="请选择催收员"
            multiple
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="collector in collectorList"
              :key="collector.id"
              :label="collector.name"
              :value="collector.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分配优先级">
          <el-select
            v-model="batchForm.priority"
            placeholder="请选择优先级"
            style="width: 100%"
          >
            <el-option label="低" :value="1" />
            <el-option label="中" :value="2" />
            <el-option label="高" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="batchForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleBatchAllocate">
            分配
          </el-button>
          <el-button @click="handleResetBatch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 案件转移 -->
    <el-card v-if="allocationMethod === 'transfer'" class="allocation-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>案件转移</span>
        </div>
      </template>

      <el-form :model="transferForm" label-width="120px">
        <el-form-item label="选择案件">
          <el-select
            v-model="transferForm.caseIds"
            placeholder="请选择案件"
            multiple
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="caseItem in caseList"
              :key="caseItem.id"
              :label="`${caseItem.name} - ${caseItem.caseNo}`"
              :value="caseItem.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="原催收员">
          <el-select
            v-model="transferForm.fromCollectorId"
            placeholder="请选择原催收员"
            filterable
            disabled
            style="width: 100%"
          >
            <el-option
              v-for="collector in collectorList"
              :key="collector.id"
              :label="collector.name"
              :value="collector.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="转移给">
          <el-select
            v-model="transferForm.toCollectorId"
            placeholder="请选择新催收员"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="collector in collectorList"
              :key="collector.id"
              :label="collector.name"
              :value="collector.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="转移原因">
          <el-select
            v-model="transferForm.reason"
            placeholder="请选择转移原因"
            style="width: 100%"
          >
            <el-option label="催收员离职" value="resign" />
            <el-option label="工作量调整" value="workload" />
            <el-option label="案件特殊性" value="special" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="transferForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleTransfer">
            转移
          </el-button>
          <el-button @click="handleResetTransfer">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 分配历史 -->
    <el-card class="history-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>分配历史</span>
          <el-button type="primary" link @click="handleRefreshHistory">刷新</el-button>
        </div>
      </template>

      <el-table v-loading="historyLoading" :data="allocationHistory" stripe border>
        <el-table-column prop="id" label="分配ID" width="100" />
        <el-table-column prop="caseName" label="案件名称" width="150" show-overflow-tooltip />
        <el-table-column prop="caseNo" label="案件编号" width="150" show-overflow-tooltip />
        <el-table-column prop="fromCollector" label="原催收员" width="120" />
        <el-table-column prop="toCollector" label="分配给" width="120" />
        <el-table-column prop="allocationType" label="分配类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag type="info">{{ getAllocationType(row.allocationType) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="getPriorityType(row.priority)">
              {{ getPriorityText(row.priority) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'completed' ? 'success' : 'warning'">
              {{ row.status === 'completed' ? '已完成' : '处理中' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="分配时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleViewDetail(row)">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="分配详情"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-descriptions v-if="currentAllocation" :column="2" border>
        <el-descriptions-item label="分配ID">
          {{ currentAllocation.id }}
        </el-descriptions-item>
        <el-descriptions-item label="案件名称">
          {{ currentAllocation.caseName }}
        </el-descriptions-item>
        <el-descriptions-item label="案件编号">
          {{ currentAllocation.caseNo }}
        </el-descriptions-item>
        <el-descriptions-item label="原催收员">
          {{ currentAllocation.fromCollector }}
        </el-descriptions-item>
        <el-descriptions-item label="分配给">
          {{ currentAllocation.toCollector }}
        </el-descriptions-item>
        <el-descriptions-item label="分配类型">
          {{ getAllocationType(currentAllocation.allocationType) }}
        </el-descriptions-item>
        <el-descriptions-item label="优先级">
          <el-tag :type="getPriorityType(currentAllocation.priority)">
            {{ getPriorityText(currentAllocation.priority) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="currentAllocation.status === 'completed' ? 'success' : 'warning'">
            {{ currentAllocation.status === 'completed' ? '已完成' : '处理中' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="分配时间" :span="2">
          {{ formatDate(currentAllocation.createTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">
          {{ currentAllocation.remark || '-' }}
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
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

// 分配方式
const allocationMethod = ref('single')

// 单个分配表单
const singleForm = reactive({
  caseId: '',
  collectorId: '',
  priority: 2,
  remark: ''
})

// 批量分配表单
const batchForm = reactive({
  caseIds: [] as string[],
  allocateType: 'fixed',
  collectorId: '',
  collectorIds: [] as string[],
  priority: 2,
  remark: ''
})

// 案件转移表单
const transferForm = reactive({
  caseIds: [] as string[],
  fromCollectorId: '',
  toCollectorId: '',
  reason: '',
  remark: ''
})

// 数据
const caseList = ref<any[]>([])
const collectorList = ref<any[]>([])
const allocationHistory = ref<any[]>([])
const historyLoading = ref(false)
const detailDialogVisible = ref(false)
const currentAllocation = ref<any>(null)

// 获取案件列表
const fetchCaseList = async () => {
  try {
    // TODO: 调用API获取案件列表
    // const res = await getCaseList()
    
    // Mock数据
    caseList.value = [
      { id: '1', name: '张三', caseNo: 'CASE001' },
      { id: '2', name: '李四', caseNo: 'CASE002' },
      { id: '3', name: '王五', caseNo: 'CASE003' },
      { id: '4', name: '赵六', caseNo: 'CASE004' },
      { id: '5', name: '孙七', caseNo: 'CASE005' }
    ]
  } catch (error) {
    ElMessage.error('获取案件列表失败')
  }
}

// 获取催收员列表
const fetchCollectorList = async () => {
  try {
    // TODO: 调用API获取催收员列表
    // const res = await getCollectorList()
    
    // Mock数据
    collectorList.value = [
      { id: '1', name: '催收员1' },
      { id: '2', name: '催收员2' },
      { id: '3', name: '催收员3' },
      { id: '4', name: '催收员4' },
      { id: '5', name: '催收员5' }
    ]
  } catch (error) {
    ElMessage.error('获取催收员列表失败')
  }
}

// 获取分配历史
const fetchAllocationHistory = async () => {
  historyLoading.value = true
  try {
    // TODO: 调用API获取分配历史
    // const res = await getAllocationHistory()
    
    // Mock数据
    await new Promise(resolve => setTimeout(resolve, 500))
    allocationHistory.value = [
      {
        id: '1',
        caseName: '张三',
        caseNo: 'CASE001',
        fromCollector: '无',
        toCollector: '催收员1',
        allocationType: 'single',
        priority: 2,
        status: 'completed',
        createTime: new Date(Date.now() - 86400000).toISOString(),
        remark: '首次分配'
      },
      {
        id: '2',
        caseName: '李四',
        caseNo: 'CASE002',
        fromCollector: '催收员1',
        toCollector: '催收员2',
        allocationType: 'transfer',
        priority: 3,
        status: 'completed',
        createTime: new Date(Date.now() - 172800000).toISOString(),
        remark: '工作量调整'
      }
    ]
  } catch (error) {
    ElMessage.error('获取分配历史失败')
  } finally {
    historyLoading.value = false
  }
}

// 格式化日期
const formatDate = (date?: string) => {
  return date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : '-'
}

// 获取分配类型文本
const getAllocationType = (type: string) => {
  const map: Record<string, string> = {
    single: '单个分配',
    batch: '批量分配',
    transfer: '案件转移'
  }
  return map[type] || type
}

// 获取优先级类型
const getPriorityType = (priority: number) => {
  const map: Record<number, any> = {
    1: 'info',
    2: 'warning',
    3: 'danger'
  }
  return map[priority] || ''
}

// 获取优先级文本
const getPriorityText = (priority: number) => {
  const map: Record<number, string> = {
    1: '低',
    2: '中',
    3: '高'
  }
  return map[priority] || ''
}

// 单个分配
const handleSingleAllocate = async () => {
  if (!singleForm.caseId || !singleForm.collectorId) {
    ElMessage.warning('请填写必填项')
    return
  }

  try {
    // TODO: 调用API进行单个分配
    // await allocateCase(singleForm)
    ElMessage.success('分配成功')
    handleResetSingle()
    fetchAllocationHistory()
  } catch (error) {
    ElMessage.error('分配失败')
  }
}

// 重置单个分配表单
const handleResetSingle = () => {
  Object.assign(singleForm, {
    caseId: '',
    collectorId: '',
    priority: 2,
    remark: ''
  })
}

// 批量分配
const handleBatchAllocate = async () => {
  if (batchForm.caseIds.length === 0) {
    ElMessage.warning('请选择至少一个案件')
    return
  }

  if (batchForm.allocateType === 'fixed' && !batchForm.collectorId) {
    ElMessage.warning('请选择催收员')
    return
  }

  if (batchForm.allocateType !== 'fixed' && batchForm.collectorIds.length === 0) {
    ElMessage.warning('请选择至少一个催收员')
    return
  }

  try {
    // TODO: 调用API进行批量分配
    // await batchAllocateCase(batchForm)
    ElMessage.success('分配成功')
    handleResetBatch()
    fetchAllocationHistory()
  } catch (error) {
    ElMessage.error('分配失败')
  }
}

// 重置批量分配表单
const handleResetBatch = () => {
  Object.assign(batchForm, {
    caseIds: [],
    allocateType: 'fixed',
    collectorId: '',
    collectorIds: [],
    priority: 2,
    remark: ''
  })
}

// 案件转移
const handleTransfer = async () => {
  if (transferForm.caseIds.length === 0 || !transferForm.toCollectorId) {
    ElMessage.warning('请填写必填项')
    return
  }

  try {
    // TODO: 调用API进行案件转移
    // await transferCase(transferForm)
    ElMessage.success('转移成功')
    handleResetTransfer()
    fetchAllocationHistory()
  } catch (error) {
    ElMessage.error('转移失败')
  }
}

// 重置转移表单
const handleResetTransfer = () => {
  Object.assign(transferForm, {
    caseIds: [],
    fromCollectorId: '',
    toCollectorId: '',
    reason: '',
    remark: ''
  })
}

// 刷新历史
const handleRefreshHistory = () => {
  fetchAllocationHistory()
}

// 查看详情
const handleViewDetail = (row: any) => {
  currentAllocation.value = row
  detailDialogVisible.value = true
}

// 初始化
onMounted(() => {
  fetchCaseList()
  fetchCollectorList()
  fetchAllocationHistory()
})
</script>

<style scoped lang="scss">
.case-allocation-container {
  padding: 16px;

  .method-card,
  .allocation-card,
  .history-card {
    margin-bottom: 24px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
