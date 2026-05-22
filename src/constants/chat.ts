import type { Message, Role } from '../types/chat'

export const CHAT_STORAGE_KEY = 'chatMessages'

export const CHAT_STREAM_URL =
  import.meta.env.VITE_CHAT_STREAM_URL || 'http://localhost:8080/api/chat/stream'

export function createMessage(role: Role, content: string): Message {
  return {
    id: `${Date.now()}_${crypto.randomUUID()}`,
    role,
    content,
    createTime: Date.now()
  }
}
