<template>
  <div class="case-list-container">
    <!-- 搜索筛选区 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" :inline="true">
        <el-form-item label="案件编号">
          <el-input
            v-model="searchForm.caseNo"
            placeholder="请输入案件编号"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="客户姓名">
          <el-input
            v-model="searchForm.customerName"
            placeholder="请输入客户姓名"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="借款编号">
          <el-input
            v-model="searchForm.loanNo"
            placeholder="请输入借款编号"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="案件状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
            style="width: 150px"
          >
            <el-option label="待分配" value="pending" />
            <el-option label="已分配" value="assigned" />
            <el-option label="进行中" value="in_progress" />
            <el-option label="已结清" value="settled" />
            <el-option label="坏账" value="bad_debt" />
          </el-select>
        </el-form-item>
        <el-form-item label="逾期天数">
          <el-input-number
            v-model="searchForm.overdueDaysMin"
            :min="0"
            placeholder="最小"
            controls-position="right"
            style="width: 120px"
          />
          <span style="margin: 0 8px">-</span>
          <el-input-number
            v-model="searchForm.overdueDaysMax"
            :min="0"
            placeholder="最大"
            controls-position="right"
            style="width: 120px"
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
          <el-button type="primary" :icon="Plus" @click="handleAdd">
            新增案件
          </el-button>
          <el-button
            type="success"
            :icon="Check"
            :disabled="!selectedRows.length"
            @click="handleBatchAssign"
          >
            批量分配
          </el-button>
          <el-button type="warning" :icon="Download" @click="handleExport">
            导出
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
          prop="caseNo"
          label="案件编号"
          width="150"
          fixed="left"
          show-overflow-tooltip
        />
        <el-table-column
          prop="loanNo"
          label="借款编号"
          width="180"
          show-overflow-tooltip
        />
        <el-table-column prop="customerName" label="客户姓名" width="120" />
        <el-table-column prop="customerPhone" label="联系电话" width="130" />
        <el-table-column prop="productName" label="产品名称" width="150" />
        <el-table-column
          prop="loanAmount"
          label="贷款金额"
          width="120"
          align="right"
        >
          <template #default="{ row }">
            {{ formatAmount(row.loanAmount) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="overdueAmount"
          label="逾期金额"
          width="120"
          align="right"
        >
          <template #default="{ row }">
            <span style="color: #f56c6c">
              {{ formatAmount(row.overdueAmount) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="overdueDays"
          label="逾期天数"
          width="100"
          align="center"
        >
          <template #default="{ row }">
            <el-tag v-if="row.overdueDays <= 30" type="warning">
              {{ row.overdueDays }}天
            </el-tag>
            <el-tag v-else type="danger">{{ row.overdueDays }}天</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="案件状态"
          width="100"
          align="center"
        >
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="assigneeName"
          label="分配人"
          width="100"
          show-overflow-tooltip
        />
        <el-table-column label="操作" width="240" fixed="right" align="center">
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
              type="warning"
              link
              :icon="Edit"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              type="success"
              link
              :icon="User"
              @click="handleAssign(row)"
            >
              分配
            </el-button>
            <el-button
              type="info"
              link
              :icon="Phone"
              @click="handleContact(row)"
            >
              触达
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
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  Search,
  Refresh,
  Plus,
  Check,
  Download,
  View,
  Edit,
  User,
  Phone,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { Case } from "@/types/case";
import { getCaseList } from "@/api/case";
const router = useRouter();

// 搜索表单
const searchForm = reactive({
  caseNo: "",
  customerName: "",
  loanNo: "",
  status: "",
  overdueDaysMin: undefined as number | undefined,
  overdueDaysMax: undefined as number | undefined,
});

// 表格数据
const loading = ref(false);
const tableData = ref<Case[]>([]);
const selectedRows = ref<Case[]>([]);

// 分页
const pagination = reactive({
  pageNum: 1,
  pageSize: 20,
  total: 0,
});

// 获取表格数据
const fetchTableData = async () => {
  loading.value = true;
  try {
    // TODO: 调用API获取数据
    const res = await getCaseList({
      ...searchForm,
      ...pagination,
    });
    // Mock数据
    await new Promise(resolve => setTimeout(resolve, 500))
    tableData.value = res.list;
    pagination.total = res.data.total;
    loading.value = false;
  } catch (error) {
    ElMessage.error("获取案件列表失败");
  } finally {
    loading.value = false;
  }
};
// 获取案件状态
const getCaseStatus = (status: number) => {
  const statusMap: Record<number, string> = {
    0: "pending",
    1: "assigned",
    2: "in_progress",
    3: "settled",
    4: "bad_debt"
  };
  return statusMap[status] || "pending";
};
// 生成Mock数据
const generateMockData = (): Case[] => {
  const statuses = [
    "pending",
    "assigned",
    "in_progress",
    "settled",
    "bad_debt",
  ];
  const products = ["极速贷", "信用贷", "车贷通", "房贷宝"];

  return Array.from({ length: pagination.pageSize }, (_, i) => ({
    id: String(pagination.pageNum * pagination.pageSize + i),
    dataId: String(1000 + i),
    caseNo: `CASE${String(pagination.pageNum * pagination.pageSize + i + 1).padStart(6, "0")}`,
    productId: i % 4,
    productName: products[i % 4],
    loanNo: `LOAN${String(10000 + i).padStart(8, "0")}`,
    customerName: `客户${i + 1}`,
    customerPhone: `138${String(10000000 + i).slice(0, 8)}`,
    customerIdCard: `42010119900101${String(1000 + i).slice(0, 4)}`,
    loanAmount: 10000 + i * 1000,
    overdueAmount: 1000 + i * 100,
    overdueDays: 10 + ((i * 5) % 90),
    status: statuses[i % 5] as any,
    assigneeId: i % 3 === 0 ? String(i % 5) : undefined,
    assigneeName: i % 3 === 0 ? `催收员${(i % 5) + 1}` : undefined,
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
  }));
};

// 格式化金额
const formatAmount = (amount: number) => {
  if (amount === undefined || amount === null) {
    return "¥0.00";
  }
  return `¥${amount.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}`;
};

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    pending: "info",
    assigned: "",
    in_progress: "primary",
    settled: "success",
    bad_debt: "danger",
  };
  return typeMap[status] || "";
};

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: "待分配",
    assigned: "已分配",
    in_progress: "进行中",
    settled: "已结清",
    bad_debt: "坏账",
  };
  return textMap[status] || status;
};

// 搜索
const handleSearch = () => {
  pagination.pageNum = 1;
  fetchTableData();
};

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    caseNo: "",
    customerName: "",
    loanNo: "",
    status: "",
    overdueDaysMin: undefined,
    overdueDaysMax: undefined,
  });
  handleSearch();
};

// 新增案件
const handleAdd = () => {
  ElMessage.info("新增案件功能开发中");
};

// 批量分配
const handleBatchAssign = () => {
  ElMessageBox.confirm(
    `确定要批量分配选中的 ${selectedRows.value.length} 个案件吗?`,
    "批量分配",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  ).then(() => {
    ElMessage.success("批量分配成功");
    fetchTableData();
  });
};

// 导出
const handleExport = () => {
  ElMessage.info("导出功能开发中");
};

// 查看详情
const handleView = (row: Case) => {
  router.push(`/case/detail/${row.id}`);
};

// 编辑
const handleEdit = (_row: Case) => {
  ElMessage.info("编辑功能开发中");
};

// 分配
const handleAssign = (_row: Case) => {
  ElMessage.info("分配功能开发中");
};

// 触达
const handleContact = (_row: Case) => {
  ElMessage.info("触达功能开发中");
};

// 表格选择变化
const handleSelectionChange = (selection: Case[]) => {
  selectedRows.value = selection;
};

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size;
  fetchTableData();
};

// 当前页变化
const handleCurrentChange = (page: number) => {
  pagination.pageNum = page;
  fetchTableData();
};

// 初始化
onMounted(() => {
  fetchTableData();
});
</script>

<style scoped lang="scss">
.case-list-container {
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
