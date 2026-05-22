import { useState, useRef, useEffect } from 'react'
import Layout from './components/Layout'
import ChatHeader from './components/ChatHeader'
import MessageItem from './components/MessageItem'
import ChatInput from './components/ChatInput'
import { useLocalChat } from './hooks/useLocalChat'
import { useChatInput } from './hooks/useChatInput'
import { useChatStream } from './hooks/useChatStream'
import { CHAT_STORAGE_KEY } from './constants/chat'
import type { Message } from './types/chat'

function App() {
  const { messages, setMessages, sendUserMsg } = useLocalChat()
  const { form, handleChange, clearInput } = useChatInput()
  const { loading, requestAIStream, createAIMessage } = useChatStream()

  // 消息容器Ref, 用于自动滚动
  const msgContainerRef = useRef<HTMLDivElement>(null)
  // 正在流式输出的AI消息
  const [streamMsg, setStreamMsg] = useState<Message | null>(null)

  // 自动滚动到底部
  useEffect(() => {
    if (msgContainerRef.current) {
      msgContainerRef.current.scrollTop = msgContainerRef.current.scrollHeight
    }
  }, [messages, streamMsg])

  // 清空聊天记录
  const clearAllChat = () => {
    setMessages([])
    setStreamMsg(null)
    localStorage.removeItem(CHAT_STORAGE_KEY)
  }
  
  // ✅【终极修复】正确管理流式消息，永不丢失、永不空对象
  const handleSend = async() => {
    const text = form.message.trim()
    if (!text || loading) return

    // 1. 发送用户消息
    sendUserMsg(text)
    clearInput()

    // 2. 如果上一条流式消息还在，先存入历史
    if (streamMsg) {
      setMessages(prev => [...prev, streamMsg])
    }

    // 3. 创建空的AI消息（用于打字机）
    const tempAIMsg = createAIMessage('')
    setStreamMsg(tempAIMsg)

    // 4. 流式请求回复
    const finalContent = await requestAIStream(text, (content) => {
      setStreamMsg(prev => prev ? { ...prev, content } : null)
    })

    // 5. 流式结束，存入正式消息
    setMessages(prev => [...prev, { ...tempAIMsg, content: finalContent }])
    setStreamMsg(null)
  }
  // 最终要渲染的消息 = 历史消息 + 正在输出的流消息
  const renderMessages = [...messages, ...(streamMsg ? [streamMsg] : [])]

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <ChatHeader title="AI 对话助手（流式版）" />
        <button
          onClick={clearAllChat}
          style={{ padding: '4px 12px', color: '#f5222d', border: '1px solid #f5222d', background: 'transparent', borderRadius: 4 }}
        >
          清空记录
        </button>
      </div>

      {loading && !streamMsg && (
        <div style={{ color: '#1890ff' }}>AI 思考中...</div>
      )}

      {/* ✅ 消息容器绑定ref，固定高度+滚动 */}
      <div 
        ref={msgContainerRef}
        style={{ 
          minHeight: '300px',
          maxHeight: '500px',
          overflowY: 'auto',
          padding: '10px 0'  
        }}
      >
        {renderMessages.length === 0 ? (
          <div style={{ color: '#999'}}>快来和我聊天吧~</div>
        ) : (
          renderMessages.map(msg => <MessageItem key={msg.id} msg={msg} />)
        )}
      </div>
      <ChatInput form={form} onChange={handleChange} onSend={handleSend} disabled={loading} />
    </Layout>
  )
}

export default App
