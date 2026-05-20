import { useState, useEffect, useRef } from 'react'
import type { Message } from '../types/chat'
import { useMountedRef } from './useMountedRef'

export function useLocalChat(){
  // 惰性初始化读localStorage（React19 稳定版）
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem('chatMessages')
      return saved ? JSON.parse(saved) : []
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
    localStorage.setItem('chatMessages', JSON.stringify(messages))
  }, [messages, isMounted])

  // 发送消息
  const sendUserMsg = (content: string) => {
    if (!content.trim()) return 
    const newMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      createTime: Date.now()
    }
    setMessages(prev => ([...prev, newMsg]))
  }

  return {
    messages,
    setMessages,
    messagesRef,
    sendUserMsg
  }
}