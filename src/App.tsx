import { useState, useEffect, useRef, useCallback } from 'react'
import type { Message, Role, InputForm } from './types/chat'

function App() {
  // 初始化时 直接从 localStorage 取值！！（关键修复）
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem('chatMessages')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [form, setForm] = useState<InputForm>({ message: '' })
  const messagesRef = useRef<Message[]>(messages)
  const isMounted = useRef(false)

  // 同步最新值
  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  // ==========================================
  // 【React19 终极修复】只在真正挂载后保存！
  // ==========================================
  useEffect(() => {
    // React19 严格模式会执行两次，第一次是假挂载，直接跳过
    if (!isMounted.current) {
      isMounted.current = true
      return
    }

    // 只有真正挂载后，才保存到 localStorage
    localStorage.setItem('chatMessages', JSON.stringify(messages))
  }, [messages])

  // 输入框
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, message: e.target.value }))
  }

  // 发送消息
  const sendMessage = () => {
    const text = form.message.trim()
    if (!text) return

    const newMsg: Message = {
      id: Date.now().toString(),
      role: 'user' as Role,
      content: text,
      createTime: Date.now(),
    }

    setMessages(prev => [...prev, newMsg])
    setForm({ message: '' })
  }

  // 闭包对比测试
  useEffect(() => {
    const id = setInterval(() => {
      console.log('闭包旧值：', messages)
      console.log('最新值：', messagesRef.current)
    }, 2000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <h2>AI 对话（React19 永不丢失版）</h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input
          value={form.message}
          onChange={handleInputChange}
          style={{ flex: 1, padding: 8 }}
          placeholder="输入消息..."
        />
        <button onClick={sendMessage}>发送</button>
      </div>

      <div>
        {messages.map(m => (
          <div key={m.id} style={{ padding: 10, background: '#f5f5f5', margin: 5 }}>
            <strong>{m.role}：</strong> {m.content}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App