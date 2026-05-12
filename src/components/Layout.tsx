import type { Children } from '../types/chat'
interface LayoutProps {
  children: Children
}
export default function Layout({ children }: LayoutProps){
  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      { children }
    </div>
  )
}
