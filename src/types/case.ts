import type { LoanContract } from './loanContract'
import type { Respondent } from './respondent'
import type { ArbitrationInfo } from './arbitration'
import type { ExecutionInfo } from './execution'
import type { ContactRecord } from './contact'

// 案件状态枚举
export enum CaseStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  SETTLED = 'settled',
  BAD_DEBT = 'bad_debt'
}

// 案件基本信息
export interface Case {
  //接口返回字段
  id: string // 编号
  dataId: number // 数据id
  name: string // 名字
  idcard: string // 被申请人身份证
  sex: number // 性别 0女 1男
  phone: string // 被申请人电话
  applicantId: number // 申请人ID
  respondentId: number // 债务人ID
  productId: number // 产品ID
  orgId: number // 公司ID
  userGroupId: number // 催收组ID(案件状态是待组长分案使用)
  userId: number // 用户ID
  caseStatus: number // 当前案件状态: 1待平台分案, 3待分配坐席, 4再催, 6停催, 10结清, 12已删除, 13在催-普通留案中, 14在催-特殊留案中
  debtTotal: number // 债务总额
  overdueStartTime: string // 逾期开始时间
  agentStartTime: string // 代理开始日期 (案件分发日期)
  agentEndTime: string // 代理截止日期 (案件分发时选择的代理截止日期)
  casePool: number // 处置类型0仲裁 1执行
  instalment: number // 分期标记
  remark: string // 备注
  createTime: string // 创建时间
  updateTime: string // 修改时间
  // 借款信息
  loanNo: string // 借据号
  overDate: string // 逾期日期
  debtAmount: number // 欠款金额
  loanAmount: number // 借款金额
  period: number // 期数
  contractTime: string // 合同时间
  borrowStartTime: string // 借款开始时间
  borrowEndTime: string // 借款结束时间
  yearRate: number // 年利率
  monthRate: number // 月利率
  actualBorrowTime: string // 实际借款时间
  totalInterestAmount: number // 总利息金额
  repaymentAmount: number // 已还金额
  repaymentInterest: number // 已还利息
  borrowAmount: number // 借款金额
  interestAmount: number // 利息金额
  borrowPurpose: string // 借款用途
  repayWay: string // 还款方式
  


  //表格渲染显示字段
  // "agentEndTime": "代理截止日期 (案件分发时选择的代理截止日期)",
  // "agentStartTime": "代理开始日期 (案件分发日期)",
  // "applicantId": "申请人ID",
  // "casePool": "处置类型0仲裁 1执行 ",
  // "caseStatus": "案件状态: 1待平台分案, 3待分配坐席, 4再催, 6停催, 10结清, 12已删除, 13在催-普通留案中, 14在催-特殊留案中, ",
  // "createTime": "创建时间",
  // "dataId": 0,
  // "debtTotal": "债务总额",
  // "id": "主键自增非负",
  // "idcard": "被申请人身份证",
  // "instalment": "分期标记",
  // "name": "名字",
  // "orgId": "公司ID",
  // "overdueStartTime": "逾期开始时间",
  // "phone": "被申请人电话",
  // "productId": "产品ID",
  // "remark": "备注",
  // "respondentId": "债务人ID",
  // "sex": "性别 0女 1男",
  // "updateTime": "修改时间",
  // "userGroupId": "催收组ID(案件状态是待组长分案使用)",
  // "userId": "用户ID"


}

// 案件详情
export interface CaseDetail extends Case {
  loanContract?: LoanContract
  respondent?: Respondent
  arbitrationInfo?: ArbitrationInfo
  executionInfo?: ExecutionInfo
  contactRecords?: ContactRecord[]
  assignmentHistory?: AssignmentRecord[]
}

// 分配记录
export interface AssignmentRecord {
  id: string
  caseId: string
  fromUserId?: string
  fromUserName?: string
  toUserId: string
  toUserName: string
  assignTime: string
  operatorId: string
  operatorName: string
}
