import { useState, useEffect, useRef } from 'react'
import type { Message, Role, InputForm } from './types/chat'
import Layout from './components/Layout'
import ChatHeader from './components/ChatHeader'
import MessageItem from './components/MessageItem'
import ChatInput from './components/ChatInput'

function App() {
  // 惰性初始化读取localStorage（React 19稳定版）
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem('chatMessages')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [form, setForm] = useState<InputForm>({ message: ''})
  const messagesRef = useRef<Message[]>(messages)
  const isMounted = useRef(false)

  // 同步ref
  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  // 安全写入localStorage（挂载锁）
  useEffect(() => {
    if (!isMounted.current){
      isMounted.current = true
      return
    }
    localStorage.setItem('chatMessages', JSON.stringify(messagesRef.current))
  }, [messages])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      message: e.target.value
    }))
  }

  const sendMessage = () => {
    const text = form.message.trim()
    if(!text) return 
    const newMsg: Message = {
      id: Date.now().toString(),
      role: 'user' as Role,
      content: text,
      createTime: Date.now()
    }
    setMessages(prev => [...prev, newMsg])
    setForm({ message: '' })
  }

  return (
    <Layout>
      <ChatHeader />
      <ChatInput
        form={form}
        onChange={handleInputChange}
        onSend={sendMessage}
      />
      <div>
        {messages.length === 0? (
          <div style={{ color: '#999'}}>暂无消息</div>
        ): (
          messages.map(m => <MessageItem key={m.id} msg={m} />)
        )}
      </div>
    </Layout>
  )
}

export default App