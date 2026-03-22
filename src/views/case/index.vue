<template>
  <div class="case-list-container">
    <!-- 搜索筛选区 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" :inline="true">
        <el-form-item label="姓名">
          <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="searchForm.idcard" placeholder="请输入身份证号" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="案件状态">
          <el-select v-model="searchForm.caseStatus" placeholder="请选择状态" clearable style="width: 180px">
            <el-option label="待平台分案" :value="1" />
            <el-option label="待分配坐席" :value="3" />
            <el-option label="再催" :value="4" />
            <el-option label="停催" :value="6" />
            <el-option label="结清" :value="10" />
            <el-option label="已删除" :value="12" />
            <el-option label="在催-普通留案" :value="13" />
            <el-option label="在催-特殊留案" :value="14" />
          </el-select>
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
          <el-button type="success" :icon="Check" :disabled="!selectedRows.length" @click="handleBatchAssign">
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
      <el-table v-loading="loading" :data="tableData" stripe border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="id" label="编号" width="80" align="center" fixed="left" />
        <el-table-column prop="dataId" label="数据ID" width="80" align="center" />
        <el-table-column prop="name" label="名字" width="100" show-overflow-tooltip />
        <el-table-column prop="sex" label="性别" width="70" align="center">
          <template #default="{ row }">
            <el-tag :type="row.sex === 1 ? '' : 'danger'" size="small">
              {{ row.sex === 1 ? '男' : '女' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="idcard" label="身份证号" width="180" show-overflow-tooltip />
        <el-table-column prop="phone" label="电话" width="130" />
        
        <el-table-column prop="caseStatus" label="案件状态" width="150" align="center">
          <template #default="{ row }">
            <el-tag :type="getCaseStatusType(row.caseStatus)">
              {{ getCaseStatusText(row.caseStatus) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="debtTotal" label="债务总额" width="120" align="right">
          <template #default="{ row }">
            <span class="amount-text">{{ formatAmount(row.debtTotal) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="casePool" label="处置类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.casePool === 0 ? 'warning' : 'success'" effect="plain">
              {{ row.casePool === 0 ? '仲裁' : '执行' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="instalment" label="分期标记" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.instalment === 1 ? 'success' : 'info'" size="small">
              {{ row.instalment === 1 ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="overdueStartTime" label="逾期开始时间" width="160">
          <template #default="{ row }">
            {{ formatDate(row.overdueStartTime) }}
          </template>
        </el-table-column>

        <el-table-column prop="agentStartTime" label="代理开始日期" width="160">
          <template #default="{ row }">
            {{ formatDate(row.agentStartTime) }}
          </template>
        </el-table-column>

        <el-table-column prop="agentEndTime" label="代理截止日期" width="160">
          <template #default="{ row }">
            {{ formatDate(row.agentEndTime) }}
          </template>
        </el-table-column>

        <el-table-column prop="applicantId" label="申请人ID" width="100" align="center" />
        <el-table-column prop="respondentId" label="债务人ID" width="100" align="center" />
        <el-table-column prop="productId" label="产品ID" width="100" align="center" />
        <el-table-column prop="orgId" label="公司ID" width="100" align="center" />
        <el-table-column prop="userGroupId" label="催收组ID" width="100" align="center" show-overflow-tooltip />
        <el-table-column prop="userId" label="用户ID" width="100" align="center" />

        <el-table-column prop="createTime" label="创建时间" width="160">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>

        <el-table-column prop="updateTime" label="修改时间" width="160">
          <template #default="{ row }">
            {{ formatDate(row.updateTime) }}
          </template>
        </el-table-column>

        <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip />

        <el-table-column label="操作" width="240" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" link :icon="View" @click="handleView(row)">
              查看
            </el-button>
            <el-button type="warning" link :icon="Edit" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="success" link :icon="User" @click="handleAssign(row)">
              分配
            </el-button>
            <el-button type="info" link :icon="Phone" @click="handleContact(row)">
              触达
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination v-model:current-page="pagination.currPage" v-model:page-size="pagination.pageSize"
          :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
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
import { formatDate, formatAmount } from "@/utils/format";

const router = useRouter();

// 搜索表单
const searchForm = reactive({
  name: "",
  idcard: "",
  phone: "",
  caseStatus: undefined as number | undefined,
});

// 表格数据
const loading = ref(false);
const tableData = ref<Case[]>([]);
const selectedRows = ref<Case[]>([]);

// 分页
const pagination = reactive({
  currPage: 1,
  pageSize: 20,
  total: 0
})

// 获取表格数据
const fetchTableData = async () => {
  loading.value = true;
  try {
    const res = await getCaseList({
      ...searchForm,
      ...pagination,
    });
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    tableData.value = res.list;
    pagination.total = res.total;
  } catch (error) {
    ElMessage.error("获取案件列表失败");
  } finally {
    loading.value = false;
  }
};

// 获取案件状态文本
const getCaseStatusText = (status: number) => {
  const statusMap: Record<number, string> = {
    1: "待平台分案",
    3: "待分配坐席",
    4: "再催",
    6: "停催",
    10: "结清",
    12: "已删除",
    13: "在催-普通留案",
    14: "在催-特殊留案"
  };
  return statusMap[status] || `未知状态(${status})`;
};

// 获取案件状态标签类型
const getCaseStatusType = (status: number) => {
  const typeMap: Record<number, string> = {
    1: "info",
    3: "warning",
    4: "primary",
    6: "danger",
    10: "success",
    12: "info",
    13: "",
    14: "warning"
  };
  return typeMap[status] || "";
};

// 搜索
const handleSearch = () => {
  pagination.currPage = 1;
  fetchTableData();
};

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    name: "",
    idcard: "",
    phone: "",
    caseStatus: undefined,
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
  pagination.currPage = page;
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

  .amount-text {
    font-family: Monaco, Consolas, monospace;
    font-weight: bold;
    color: #f56c6c;
  }

  .pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 16px;
  }
}
</style>
