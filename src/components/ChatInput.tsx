import type { InputForm } from '../types/chat'
import type { ChangeEvent } from 'react'

interface ChatInputProps {
  form: InputForm
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onSend: () => void,
  disabled?: boolean
}

export default function ChatInput({ form, onChange, onSend, disabled }: ChatInputProps){
  return (
    <div style={{ display: 'flex', gap: 8, margin: '20px 0'}}>
      <input
        type="text"
        value={form.message}
        onChange={onChange}
        placeholder="请输入消息..."
        style={{ flex: 1, padding: 0, fontSize: 14}}
        disabled={disabled}
      />
      <button onClick={onSend} style={{ padding: '0 16px'}} disabled={disabled}>{disabled ? '发送中...' : '发送'}</button>
    </div>
  )
}
