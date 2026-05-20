import Layout from './components/Layout'
import ChatHeader from './components/ChatHeader'
import MessageItem from './components/MessageItem'
import ChatInput from './components/ChatInput'
import { useLocalChat } from './hooks/useLocalChat'
import { useChatInput } from './hooks/useChatInput'

function App() {
  const { messages, sendUserMsg } = useLocalChat()
  const { form, handleChange, clearInput } = useChatInput()

  const handleSend = () => {
    sendUserMsg(form.message)
    clearInput()
  }

  return (
    <Layout>
      <ChatHeader />
      <ChatInput form={form} onChange={handleChange} onSend={handleSend} />
      <div>
        {messages.length === 0 ? (
          <div style={{ color: '#999' }}>暂无消息</div>
        ) : (
          messages.map(msg => <MessageItem key={msg.id} msg={msg} />)
        )}
      </div>
    </Layout>
  )
}

export default App