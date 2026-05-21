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
        disabled={disabled}
        style={{
          flex: 1,
          padding: '8px 12px',
          fontSize: 14,
          border: '1px solid #eee',
          borderRadius: 4,
          outline: 'none'
        }}
      />
      <button 
        onClick={onSend}
        disabled={disabled}
        style={{
          padding: '0 16px',
          backgroundColor: '#1890ff',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1
        }}
      >{disabled ? '发送中...' : '发送'}</button>
    </div>
  )
}
