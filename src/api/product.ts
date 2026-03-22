/*
 * Description: 产品表
 */

import { request } from './request'
import type {  Product } from '@/types'


// 产品下拉框
export function getSelectCaseProduct() {
  return request.post<Product>('/case-zx-api/caselnfo/caseProduct/selectCaseProduct', {})
}



