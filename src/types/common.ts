// 下拉选项
export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

// 树节点
export interface TreeNode {
  id: string
  label: string
  children?: TreeNode[]
  [key: string]: any
}
