'use client'

import { useEffect, useCallback } from 'react'

export function useOrderStream(onEvent: (data: any) => void) {
  const connect = useCallback(() => {
    const es = new EventSource('/api/orders/stream')

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        onEvent(data)
      } catch (err) { 
        console.error('SSE Parse Error:', err)
      }
    }

    es.onerror = () => {
      es.close()
      setTimeout(connect, 5000) // Reconnect after 5s
    }

    return es
  }, [onEvent])

  useEffect(() => {
    const es = connect()
    return () => es.close()
  }, [connect])
}
