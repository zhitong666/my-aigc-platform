import { useState } from 'react'
import type { ChangeEvent } from 'react'
import type { InputForm } from '../types/chat'

export function useChatInput(){
  const [form, setForm] = useState<InputForm>({ message: '' })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, message: e.target.value }))
  }

  const clearInput = () => {
    setForm({ message: '' })
  }
  
  return {
    form,
    handleChange,
    clearInput
  }
}