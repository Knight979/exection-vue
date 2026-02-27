// 登录参数
export interface LoginParams {
  username: string
  password: string
  captcha: string
  captchaId: string
  remember?: boolean
}

// 登录结果
export interface LoginResult {
  username: string
  captcha: string
  token: string
}

// 验证码结果
export interface CaptchaResult {
  captchaId: string
  captchaImage: string  // Base64编码的图片
}
