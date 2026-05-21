interface ChatHeaderProps {
  title?: string
}
export default function ChatHeader({ title = 'AI 对话助手'}: ChatHeaderProps){
  return <h2 style={{ margin: 0 }}>{title}</h2>
}