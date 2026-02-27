// 借款合同
export interface LoanContract {
  id: number
  dataId: number
  loanNo: string
  productId: number
  overDate: string
  debtAmount: number
  loanAmount?: number
  period: number
  contractTime?: string
  borrowStartTime?: string
  borrowEndTime?: string
  yearRate?: number
  monthRate?: number
  actualBorrowTime?: string
  totalInterestAmount: number
  repaymentAmount?: number
  repaymentInterest?: number
  borrowAmount?: number
  interestAmount?: number
  borrowPurpose?: string
  repayWay?: string
  remark?: string
  updateTime: string
  createTime: string
}
