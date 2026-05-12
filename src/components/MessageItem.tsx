import type { Message } from '../types/chat'

interface MessageItemProps {
  msg: Message
}

export default function MessageItem({ msg }: MessageItemProps){
  const isUser = msg.role === 'user'
  return (
    <div
      style={{
        margin: '8px 0',
        padding: 10,
        borderRadius: 8,
        backgroundColor: isUser ? '#e6f7ff' : '#f5f5f5',
      }}
    >
      <strong>{isUser ? '我' : 'AI'}</strong>
      <span style={{ marginLeft: 8 }}>{msg.content}</span>
    </div>
  )
}