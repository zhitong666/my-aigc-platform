import { useState, useRef, useEffect } from 'react'
import type { Message, Role, InputForm } from './types/chat'

import './App.css'

function App() {
  // 1. 复用Day2的messages状态（TS泛型已指定，确保类型安全）
  const [messages, setMessages] = useState<Message[]>([])

  // 2. 新增：输入框受控状态（用TS泛型明确InputForm类型）
  const [form, setForm] = useState<InputForm>({
    message: '',
  })

  // 3. 受控表单 onChange 事件（严格类型约束）
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // e.target 是输入框，TS会自动提示value、name等属性（类型安全）
    setForm(prev => ({
      ...prev,
      message: e.target.value,
    }))
  }

  // 4. 发送消息函数（复用Day2的addMessage逻辑，优化为函数式更新）
  const sendMessage = () => {
    // 边界处理：输入为空不发送
    if(!form.message.trim()) return
    // 用户消息（函数式更新，依赖旧messages）
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'user' as Role, // 类型断言，明确role是Role类型
        content: form.message,
        createTime: Date.now(),
      },
    ])
    // 清空输入框（函数式更新，依赖旧form）
    setForm(prev => ({ ...prev, message: '' }))
  }

  // 在组件顶部添加useRef，获取原生DOM元素
  const btnRef = useRef<HTMLButtonElement>(null)
  // 在useEffect中绑定原生事件
  useEffect(() => {
    const btn = btnRef.current
    if(!btn) return 
    const handleClick = () => console.log('原生DOM事件')
    btn.addEventListener('click', handleClick)
    return () => {
      btn.removeEventListener('click', handleClick)
    }
  }, [])

  // 5. 渲染页面（输入框 + 发送按钮 + 消息列表）
  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <h2>AI 对话（Day3 受控表单实战）</h2>
      {/* 受控输入框 + 发送按钮 */}
      <div style={{ display: 'flex', gap: 8, margin: '20px 0'}}>
        <input 
          type="text"
          value={form.message} // 受控核心：value绑定form.message
          onChange={handleInputChange} // 输入同步更新state
          placeholder="请输入消息..."
          style={{ flex: 1, padding: 8, fontSize: 14 }}
        />
        <button
          onClick={sendMessage}
          style={{ padding: '0 16px', cursor: 'pointer' }}
        >
          发送
        </button>        
      </div>

      <button 
        ref={btnRef}
        onClick={() => console.log('React合成事件')}
        style={{ marginTop: 20 }}
      >
        合成事件测试
      </button>
      
      {/* 消息列表（复用Day2的渲染逻辑） */}
      <div style={{ marginTop: 20 }}>
        {messages.length === 0 ? (
          <div style={{color: '#999'}}>暂无消息，发送一条试试吧～</div>
        ): (
          messages.map(m => (
            <div
              key={m.id}
              style={{
                margin: '8px 0',
                padding: 10,
                borderRadius: 8,
                backgroundColor: m.role === 'user' ? '#e6f7ff' : '#f5f5f5'
              }}
            >
              <strong>{m.role === 'user' ? '我' : 'AI'}：</strong>
              <span style={{ marginLeft: 8 }}>{m.content}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App
