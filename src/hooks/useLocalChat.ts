import { useState, useEffect, useRef } from 'react'
import type { Message } from '../types/chat'
import { useMountedRef } from './useMountedRef'
import { CHAT_STORAGE_KEY, createMessage } from '../constants/chat'

export function useLocalChat(){
  // 惰性初始化读localStorage（React19 稳定版）
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY)
      const parsed = saved ? JSON.parse(saved) : []
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })

  const messagesRef = useRef<Message[]>(messages)
  const isMounted = useMountedRef()

  // 同步最新消息
  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  // 安全写入localStorage
  useEffect(() => {
    if(!isMounted.current) return 
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages))
    } catch (err) {
      console.error('聊天记录保存失败：', err)
    }
  }, [messages, isMounted])

  // 发送消息
  const sendUserMsg = (content: string) => {
    if (!content.trim()) return 
    const newMsg = createMessage('user', content)
    setMessages(prev => ([...prev, newMsg]))
  }

  return {
    messages,
    setMessages,
    messagesRef,
    sendUserMsg
  }
}
