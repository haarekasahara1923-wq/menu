import { NextRequest } from 'next/server'
import { redis } from '@/lib/redis'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const session = await auth()
  const role = (session?.user as any)?.role
  if (!role) return new Response('Unauthorized', { status: 401 })

  const encoder = new TextEncoder()

  // Channels this role should receive
  const channels =
    role === 'kitchen'
      ? ['orders:new', 'orders:updated']
      : ['orders:new', 'orders:updated', 'orders:ready']

  // Track how many events we have already sent per channel (cursor approach).
  // We start by recording the CURRENT list length so we only pick up events
  // that arrive AFTER this connection was established.
  const cursors: Record<string, number> = {}
  for (const ch of channels) {
    const len = await redis.llen(`recent:${ch}`)
    cursors[ch] = len   // everything at index >= len is "not yet seen"
  }

  const stream = new ReadableStream({
    async start(controller) {
      // Send a heartbeat comment immediately so the browser knows the stream is alive
      controller.enqueue(encoder.encode(': ping\n\n'))

      const pollInterval = setInterval(async () => {
        try {
          for (const channel of channels) {
            const currentLen = await redis.llen(`recent:${channel}`)
            const prev = cursors[channel]

            if (currentLen > prev) {
              // New events were pushed. Redis list is newest-first (lpush),
              // so indices 0..(currentLen-prev-1) are the new ones.
              const newCount = currentLen - prev
              const newMessages = await redis.lrange(`recent:${channel}`, 0, newCount - 1)

              // Reverse so oldest new event is sent first
              for (const msg of newMessages.reverse()) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ channel, payload: msg })}\n\n`)
                )
              }

              cursors[channel] = currentLen
            }
          }
        } catch {
          clearInterval(pollInterval)
          try { controller.close() } catch {}
        }
      }, 3000)

      req.signal.addEventListener('abort', () => {
        clearInterval(pollInterval)
        try { controller.close() } catch {}
      })
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
