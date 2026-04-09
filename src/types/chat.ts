// 角色类型：用户还是AI
export type Role = 'user' | 'assistant'

// 单条消息
export interface Message {
  id: string
  role: Role
  content: string
  createTime: number
}

// 对话历史
export type ChatRecord = {
  sessionId: string
  messages: Message[]
  title?: string 
}

// 接口返回的统一格式
export type ApiResponse<T> = {
  code: number
  msg: string
  data: T
}

// 交叉类型示例
export type BaseMessage = { 
  id: string 
  content: string
}
export type TimedMessage = BaseMessage & {
  createTime: number
  role: Role
}