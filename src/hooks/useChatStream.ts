import { useState, useRef } from 'react'
import type { Message } from '../types/chat'
import { parseSSELine } from '../utils/sseParser'

export function useChatStream() {
  const [loading, setLoading] = useState(false)
  const aiMessageRef = useRef('')

  // 流式请求AI回复
  const requestAIStream = async(
    userMessage: string,
    onChunk: (content: string) => void
  ) => {
    setLoading(true)
    aiMessageRef.current = ''

    try {
      const res = await fetch('http://localhost:8080/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      })

      if(!res.body) throw new Error('不支持流式响应')
      const reader = res.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let done = false

      while(!done) {
        const { value, done: _done } = await reader.read()
        done = _done
        if(value) {
          const text = decoder.decode(value, { stream: true })
          const lines = text.split('\n').filter(Boolean)
          for ( const line of lines){
            const content = parseSSELine(line)
            if(content) {
              aiMessageRef.current += content
              onChunk(aiMessageRef.current)
            }
          }
        }
      }
    } catch (err) { 
      console.error('流式请求失败：', err)
      onChunk('AI 服务异常，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  // 插入完整的AI消息
  const createAIMessage = (content: string): Message => ({
    id: Date.now().toString() + '_ai',
    role: 'assistant',
    content,
    createTime: Date.now(),
  })

  return { 
    loading,
    requestAIStream,
    createAIMessage
  }
}