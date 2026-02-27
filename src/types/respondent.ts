// 债务人信息
export interface Respondent {
  id: number
  dataId: number
  name: string
  idcard: string
  sex?: number
  certAddress: string
  phone: string
  email?: string
  provinces: string
  city: string
  homeAddr: string
  workInfo: string
  workAddr: string
  remark: string
  updateTime: string
  createTime: string
}
