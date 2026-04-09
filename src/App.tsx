import { useState } from 'react'
import type { Message, Role } from './types/chat'

import './App.css'

function App() {

  const [messages, setMessages] = useState<Message[]>([])

  const addMessage = (role: Role, content: string) => {
    const newMsg: Message = {
      id: Date.now().toString(),
      role,
      content,
      createTime: Date.now(),
    }
    setMessages(prev => [...prev, newMsg])
  }
  return (
    <div style={{ padding: 20 }}>
      <h2>AI 对话（Day2 类型实战）</h2>
      <button onClick={() => addMessage('user', '你好')}>用户说你好</button>
      <button onClick={() => addMessage('assistant', '你好呀，有什么可以帮你的吗？')}>AI说你好</button>
      <div style={{ marginTop: 20 }}>
        {messages.map(m => (
          <div key={m.id} style={{ margin: '8px 0'}}>
            <strong>{m.role}：</strong>{m.content}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
