// 产品信息
export interface Product {
  id: number
  productName: string
  applicantId: number
  clientName: string
  processTime?: string
  remark?: string
  createTime: string
  updateTime: string
}
