/**
 * 验证手机号
 * @param phone 手机号
 * @returns 是否有效
 */
export const validatePhone = (phone: string): boolean => {
  return /^1[3-9]\d{9}$/.test(phone)
}

/**
 * 验证邮箱
 * @param email 邮箱地址
 * @returns 是否有效
 */
export const validateEmail = (email: string): boolean => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
}

/**
 * 验证身份证号
 * @param idCard 身份证号
 * @returns 是否有效
 */
export const validateIdCard = (idCard: string): boolean => {
  // 15位或18位身份证号
  if (!/^\d{15}$|^\d{17}[\dXx]$/.test(idCard)) {
    return false
  }

  // 18位身份证号校验码验证
  if (idCard.length === 18) {
    const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
    
    let sum = 0
    for (let i = 0; i < 17; i++) {
      sum += parseInt(idCard[i]) * weights[i]
    }
    
    const checkCode = checkCodes[sum % 11]
    return idCard[17].toUpperCase() === checkCode
  }

  return true
}

/**
 * 验证银行卡号
 * @param cardNo 银行卡号
 * @returns 是否有效
 */
export const validateBankCard = (cardNo: string): boolean => {
  // 移除空格
  const card = cardNo.replace(/\s/g, '')
  
  // 银行卡号通常为13-19位数字
  if (!/^\d{13,19}$/.test(card)) {
    return false
  }

  // Luhn算法校验
  let sum = 0
  let isEven = false
  
  for (let i = card.length - 1; i >= 0; i--) {
    let digit = parseInt(card[i])
    
    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }
    
    sum += digit
    isEven = !isEven
  }
  
  return sum % 10 === 0
}

/**
 * 验证中国大陆固定电话
 * @param tel 固定电话
 * @returns 是否有效
 */
export const validateTel = (tel: string): boolean => {
  return /^0\d{2,3}-?\d{7,8}$/.test(tel)
}

/**
 * 验证URL
 * @param url URL地址
 * @returns 是否有效
 */
export const validateUrl = (url: string): boolean => {
  return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(url)
}

/**
 * 验证IP地址
 * @param ip IP地址
 * @returns 是否有效
 */
export const validateIp = (ip: string): boolean => {
  return /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/.test(ip)
}

/**
 * 验证密码强度
 * @param password 密码
 * @returns 强度等级(0-4)
 */
export const validatePasswordStrength = (password: string): number => {
  if (!password) return 0
  
  let strength = 0
  
  // 长度
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  
  // 包含小写字母
  if (/[a-z]/.test(password)) strength++
  
  // 包含大写字母
  if (/[A-Z]/.test(password)) strength++
  
  // 包含数字
  if (/\d/.test(password)) strength++
  
  // 包含特殊字符
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++
  
  // 归一化为0-4
  return Math.min(Math.floor(strength / 1.5), 4)
}

/**
 * 验证中文姓名
 * @param name 姓名
 * @returns 是否有效
 */
export const validateChineseName = (name: string): boolean => {
  return /^[\u4e00-\u9fa5]{2,10}(·[\u4e00-\u9fa5]{2,10})*$/.test(name)
}

/**
 * 验证数字
 * @param value 值
 * @param options 配置选项
 * @returns 是否有效
 */
export const validateNumber = (
  value: any,
  options?: {
    min?: number
    max?: number
    integer?: boolean
    positive?: boolean
  }
): boolean => {
  const num = Number(value)
  
  if (isNaN(num)) return false
  
  if (options?.integer && !Number.isInteger(num)) return false
  if (options?.positive && num <= 0) return false
  if (options?.min !== undefined && num < options.min) return false
  if (options?.max !== undefined && num > options.max) return false
  
  return true
}

/**
 * 验证日期格式
 * @param date 日期字符串
 * @param format 格式,如'YYYY-MM-DD'
 * @returns 是否有效
 */
export const validateDateFormat = (date: string, format = 'YYYY-MM-DD'): boolean => {
  if (!date) return false
  
  const patterns: Record<string, RegExp> = {
    'YYYY-MM-DD': /^\d{4}-\d{2}-\d{2}$/,
    'YYYY/MM/DD': /^\d{4}\/\d{2}\/\d{2}$/,
    'YYYY-MM-DD HH:mm:ss': /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
    'YYYY/MM/DD HH:mm:ss': /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/
  }
  
  const pattern = patterns[format]
  if (!pattern) return false
  
  if (!pattern.test(date)) return false
  
  // 验证日期有效性
  const d = new Date(date)
  return d.toString() !== 'Invalid Date'
}

/**
 * 验证字符串长度
 * @param str 字符串
 * @param min 最小长度
 * @param max 最大长度
 * @returns 是否有效
 */
export const validateLength = (str: string, min: number, max?: number): boolean => {
  if (!str) return min === 0
  const len = str.length
  if (len < min) return false
  if (max !== undefined && len > max) return false
  return true
}

/**
 * Element Plus表单验证规则生成器
 */
export const createFormRules = () => {
  return {
    // 必填
    required: (message = '此项为必填项') => ({
      required: true,
      message,
      trigger: 'blur'
    }),
    
    // 手机号
    phone: (message = '请输入正确的手机号') => ({
      validator: (_: any, value: string, callback: Function) => {
        if (!value || validatePhone(value)) {
          callback()
        } else {
          callback(new Error(message))
        }
      },
      trigger: 'blur'
    }),
    
    // 邮箱
    email: (message = '请输入正确的邮箱地址') => ({
      validator: (_: any, value: string, callback: Function) => {
        if (!value || validateEmail(value)) {
          callback()
        } else {
          callback(new Error(message))
        }
      },
      trigger: 'blur'
    }),
    
    // 身份证号
    idCard: (message = '请输入正确的身份证号') => ({
      validator: (_: any, value: string, callback: Function) => {
        if (!value || validateIdCard(value)) {
          callback()
        } else {
          callback(new Error(message))
        }
      },
      trigger: 'blur'
    }),
    
    // 长度限制
    length: (min: number, max?: number, message?: string) => ({
      validator: (_: any, value: string, callback: Function) => {
        if (!value || validateLength(value, min, max)) {
          callback()
        } else {
          const msg = message || 
            (max ? `长度应在${min}-${max}个字符之间` : `长度不能少于${min}个字符`)
          callback(new Error(msg))
        }
      },
      trigger: 'blur'
    }),
    
    // 数字验证
    number: (options?: {
      min?: number
      max?: number
      integer?: boolean
      positive?: boolean
      message?: string
    }) => ({
      validator: (_: any, value: any, callback: Function) => {
        if (value === '' || value === null || value === undefined) {
          callback()
          return
        }
        if (validateNumber(value, options)) {
          callback()
        } else {
          const msg = options?.message || '请输入有效的数字'
          callback(new Error(msg))
        }
      },
      trigger: 'blur'
    })
  }
}

export const formRules = createFormRules()
