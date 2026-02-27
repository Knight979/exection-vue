// 触达方式枚举
export enum ContactType {
  PHONE = 1,
  WECHAT = 2,
  ONLINE = 3
}

// 通话状态枚举
export enum CallStatus {
  CONNECTED = 1,
  NO_ANSWER = 2,
  POWERED_OFF = 3,
  HANG_UP = 4,
  OUT_OF_SERVICE = 5,
  BUSY = 6,
  CALL_REMINDER = 7,
  INVALID_NUMBER = 8,
  TEMPORARILY_UNAVAILABLE = 9,
  CALL_RESTRICTED = 10,
  HANG_UP_DURING_CALL = 20
}

// 还款意愿枚举
export enum RepayWish {
  NEED_FOLLOW = 1,
  NO_NEED_FOLLOW = 2,
  PROMISE_REPAY = 11,
  REPAID_RECEIVED = 12,
  REPAID_PROCESSING = 13,
  BREAK_PROMISE = 14,
  NO_REPAY_WISH = 15,
  PROMISE_INFORM = 21,
  WISH_NO_ABILITY = 22,
  DENY_IDENTITY_THEFT = 23,
  DENY_NOT_KNOW = 24,
  DENY_BUT_KNOW = 25,
  BAD_ATTITUDE = 26,
  NUMBER_CHANGED = 27,
  IMPRISONED_DEATH = 31,
  HOSPITALIZED_DISABLED = 32,
  OTHER = 33
}

// 下次跟进策略枚举
export enum NextContactType {
  NOT_SELECTED = 0,
  NEED_FOLLOW = 1,
  NO_NEED_FOLLOW = 2
}

// 触达记录
export interface ContactRecord {
  id: string
  caseId: number
  userId: number
  productId: number
  orgId: number
  groupId: number
  contactType: ContactType
  contactTime: string
  contactTargetType: string
  contactTargetName: string
  contactTargetPhone: string
  contactTargetAddress: string
  contactTargetDetail: string
  callStatus: CallStatus
  repayWish: RepayWish
  ptpMoney: number
  ptpTime?: string
  nextContactType: NextContactType
  nextContactTime?: string
  newAttr: boolean
  callId: string
  currentCaseTotal: number
  currentCaseOverdueDay: number
  createTime: string
  updateTime?: string
}
