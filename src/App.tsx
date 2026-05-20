import { useState } from 'react'
import Layout from './components/Layout'
import ChatHeader from './components/ChatHeader'
import MessageItem from './components/MessageItem'
import ChatInput from './components/ChatInput'
import { useLocalChat } from './hooks/useLocalChat'
import { useChatInput } from './hooks/useChatInput'
import { useChatStream } from './hooks/useChatStream'
import type { Message } from './types/chat'

function App() {
  const { messages, setMessages, sendUserMsg } = useLocalChat()
  const { form, handleChange, clearInput } = useChatInput()
  const { loading, requestAIStream, createAIMessage } = useChatStream()

  // 正在流式输出的AI消息
  const [streamMsg, setStreamMsg] = useState<Message | null>(null)
  
  const handleSend = async() => {
    const text = form.message.trim()
    if (!text || loading) return

    // 1. 发送用户消息
    sendUserMsg(text)
    clearInput()

    // 2. 创建空的AI消息（用于打字机）
    const tempAIMsg = createAIMessage('')
    setStreamMsg(tempAIMsg)

    // 3. 流式请求回复
    await requestAIStream(text, (content) => {
      setStreamMsg(prev => prev ? { ...prev, content } : null)
    })

    // 4. 流式结束，存入正式消息
    if(streamMsg) {
      setMessages(prev => [...prev, { ...streamMsg }])
      setStreamMsg(null)
    }
  }
  // 最终要渲染的消息 = 历史消息 + 正在输出的流消息
  const renderMessages = [...messages, ...(streamMsg ? [streamMsg] : [])]

  return (
    <Layout>
      <ChatHeader title="AI 对话助手（流式版）" />

      {loading && !streamMsg && (
        <div style={{ color: '#1890ff' }}>AI 思考中...</div>
      )}

      <div style={{ minHeight: '300px'}}>
        {renderMessages.length === 0 ? (
          <div style={{ color: '#999'}}>快来和我聊天吧</div>
        ) : (
          renderMessages.map(msg => <MessageItem key={msg.id} msg={msg} />)
        )}
      </div>
      <ChatInput form={form} onChange={handleChange} onSend={handleSend} disabled={loading} />
    </Layout>
  )
}

export default App