/* 
  解析SSE流式消息 
*/
export function parseSSELine(line: string): string | null {
  if(!line.startsWith('data: ')) return null
  const data = line.replace('data: ', '').trim()
  if(data === '[DONE]') return null
  try {
    const json = JSON.parse(data)
    return json.content || json.text || ''
  } catch (error) {
    return data
  }
}