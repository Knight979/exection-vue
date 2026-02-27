// 申请人信息
export interface ApplicantInfo {
  id: number
  appCode: string
  name: string
  phone: string
  position?: string
  certType: string
  certNum: string
  companyName?: string
  companyAddress: string
  businessLicenseNum: string
  companyPostcode: string
  createBy: string
  createTime: string
  updateBy: string
  updateTime: string
}
