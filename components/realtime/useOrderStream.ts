'use client'

import { useEffect, useRef } from 'react'

export function useOrderStream(onEvent: (data: any) => void) {
  // Keep a stable ref to the latest callback so the EventSource connection
  // is never recreated just because the parent re-rendered with a new
  // inline function reference.
  const callbackRef = useRef(onEvent)
  useEffect(() => {
    callbackRef.current = onEvent
  })

  useEffect(() => {
    let es: EventSource
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null

    function connect() {
      es = new EventSource('/api/orders/stream')

      es.onmessage = (e) => {
        // Ignore heartbeat comments (empty data)
        if (!e.data || e.data.startsWith(':')) return
        try {
          const data = JSON.parse(e.data)
          callbackRef.current(data)
        } catch (err) {
          console.error('SSE Parse Error:', err)
        }
      }

      es.onerror = () => {
        es.close()
        // Reconnect after 5 s, but only if the component is still mounted
        reconnectTimer = setTimeout(connect, 5000)
      }
    }

    connect()

    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer)
      es?.close()
    }
  }, []) // Empty deps — connect ONCE per mount, never recreate on re-render
}
