import { useState, useRef } from 'react'
import { CHAT_STREAM_URL, createMessage } from '../constants/chat'
import { parseSSELine } from '../utils/sseParser'

export function useChatStream() {
  const [loading, setLoading] = useState(false)
  const aiMessageRef = useRef('')

  // 流式请求AI回复
  const requestAIStream = async(
    userMessage: string,
    onChunk: (content: string) => void
  ): Promise<string> => {
    setLoading(true)
    aiMessageRef.current = ''

    try {
      const res = await fetch(CHAT_STREAM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      })

      if (!res.ok) throw new Error(`请求失败：${res.status}`)
      if(!res.body) throw new Error('不支持流式响应')
      const reader = res.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let done = false
      let buffer = ''

      while(!done) {
        const { value, done: _done } = await reader.read()
        done = _done
        if(value) {
          const text = decoder.decode(value, { stream: true })
          buffer += text
          const lines = buffer.split(/\r?\n/)
          buffer = lines.pop() ?? ''
          for ( const line of lines){
            const content = parseSSELine(line)
            if(content) {
              aiMessageRef.current += content
              onChunk(aiMessageRef.current)
            }
          }
        }
      }
      buffer += decoder.decode()
      if (buffer.trim()) {
        const content = parseSSELine(buffer)
        if (content) {
          aiMessageRef.current += content
          onChunk(aiMessageRef.current)
        }
      }
      return aiMessageRef.current
    } catch (err) { 
      console.error('流式请求失败：', err)
      const errorMessage = 'AI 服务异常，请稍后重试'
      aiMessageRef.current = errorMessage
      onChunk(errorMessage)
      return errorMessage
    } finally {
      setLoading(false)
    }
  }

  // 插入完整的AI消息
  const createAIMessage = (content: string) => createMessage('assistant', content)

  return { 
    loading,
    requestAIStream,
    createAIMessage
  }
}
