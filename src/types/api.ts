
// API通用响应类型
export interface ApiResponse<T = any> {
  code: string  // 修改为string类型，因为返回的是"0"
  msg: string   // 修改为msg
  data: T
  info?: any
  ok: boolean
}

// 分页结果
export interface PageResult<T = any> {
  list: T[]
  total: number
  currPage: number
  pageSize: number
}


// 通用请求参数（不含分页）
export interface RequestParams {
  [key: string]: any
}
