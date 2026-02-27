import dayjs from 'dayjs'

/**
 * 格式化日期
 * @param date 日期字符串或Date对象
 * @param format 格式化模板,默认'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 */
export const formatDate = (
  date?: string | Date | null,
  format = 'YYYY-MM-DD HH:mm:ss'
): string => {
  if (!date) return '-'
  return dayjs(date).format(format)
}

/**
 * 格式化日期(短格式)
 * @param date 日期字符串或Date对象
 * @returns 格式化后的日期字符串(YYYY-MM-DD)
 */
export const formatDateShort = (date?: string | Date | null): string => {
  return formatDate(date, 'YYYY-MM-DD')
}

/**
 * 格式化时间(仅时间)
 * @param date 日期字符串或Date对象
 * @returns 格式化后的时间字符串(HH:mm:ss)
 */
export const formatTime = (date?: string | Date | null): string => {
  return formatDate(date, 'HH:mm:ss')
}

/**
 * 格式化金额
 * @param amount 金额数值
 * @param precision 小数位数,默认2位
 * @param showSymbol 是否显示货币符号,默认true
 * @returns 格式化后的金额字符串
 */
export const formatAmount = (
  amount: number,
  precision = 2,
  showSymbol = true
): string => {
  const symbol = showSymbol ? '¥' : ''
  const formatted = amount.toLocaleString('zh-CN', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision
  })
  return `${symbol}${formatted}`
}

/**
 * 格式化金额(万元)
 * @param amount 金额数值
 * @param precision 小数位数,默认2位
 * @returns 格式化后的金额字符串
 */
export const formatAmountWan = (amount: number, precision = 2): string => {
  if (amount >= 10000) {
    return `¥${(amount / 10000).toFixed(precision)}万`
  }
  return formatAmount(amount, precision)
}

/**
 * 格式化百分比
 * @param value 数值
 * @param precision 小数位数,默认2位
 * @returns 格式化后的百分比字符串
 */
export const formatPercent = (value: number, precision = 2): string => {
  return `${value.toFixed(precision)}%`
}

/**
 * 格式化数字(千分位)
 * @param num 数字
 * @returns 格式化后的数字字符串
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN')
}

/**
 * 格式化文件大小
 * @param bytes 文件大小(字节)
 * @param precision 小数位数,默认2位
 * @returns 格式化后的文件大小字符串
 */
export const formatFileSize = (bytes: number, precision = 2): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(precision)} ${sizes[i]}`
}

/**
 * 格式化手机号(中间4位隐藏)
 * @param phone 手机号
 * @returns 格式化后的手机号
 */
export const formatPhone = (phone: string): string => {
  if (!phone || phone.length !== 11) return phone
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 格式化身份证号(中间隐藏)
 * @param idCard 身份证号
 * @returns 格式化后的身份证号
 */
export const formatIdCard = (idCard: string): string => {
  if (!idCard || idCard.length < 10) return idCard
  const start = idCard.slice(0, 6)
  const end = idCard.slice(-4)
  const stars = '*'.repeat(idCard.length - 10)
  return `${start}${stars}${end}`
}

/**
 * 格式化银行卡号(每4位一组)
 * @param cardNo 银行卡号
 * @returns 格式化后的银行卡号
 */
export const formatBankCard = (cardNo: string): string => {
  if (!cardNo) return cardNo
  return cardNo.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
}

/**
 * 相对时间格式化(如:刚刚、5分钟前、2天前)
 * @param date 日期字符串或Date对象
 * @returns 格式化后的相对时间字符串
 */
export const formatRelativeTime = (date: string | Date): string => {
  const now = dayjs()
  const target = dayjs(date)
  const diff = now.diff(target, 'second')

  if (diff < 60) return '刚刚'
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
  if (diff < 2592000) return `${Math.floor(diff / 86400)}天前`
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}个月前`
  return `${Math.floor(diff / 31536000)}年前`
}

/**
 * 格式化持续时间(秒转换为时分秒)
 * @param seconds 秒数
 * @returns 格式化后的持续时间字符串
 */
export const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  
  const parts = []
  if (h > 0) parts.push(`${h}小时`)
  if (m > 0) parts.push(`${m}分钟`)
  if (s > 0) parts.push(`${s}秒`)
  
  return parts.join('') || '0秒'
}
