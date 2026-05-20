import { useRef, useEffect } from 'react'

export function useMountedRef(){
  const mountedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true
  }, [])

  return mountedRef
}