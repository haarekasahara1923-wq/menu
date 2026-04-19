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
  const stream = new ReadableStream({
    async start(controller) {
      // Subscribe to relevant channels based on role
      const channels =
        role === 'kitchen'
          ? ['orders:new', 'orders:updated']
          : ['orders:new', 'orders:updated', 'orders:ready']

      // Use Upstash Redis subscribe (long-polling fallback for serverless)
      // Poll Redis for new messages every 2 seconds
      const pollInterval = setInterval(async () => {
        try {
          for (const channel of channels) {
            const messages = await redis.lrange(`recent:${channel}`, 0, 4)
            if (messages && messages.length > 0) {
              for (const msg of messages) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ channel, payload: msg })}\n\n`)
                )
              }
              // Clear recent after sending? Or just keep sending newest?
              // The frontend should handle deduplication based on ID or timestamp.
            }
          }
        } catch {
          clearInterval(pollInterval)
          controller.close()
        }
      }, 5000)

      req.signal.addEventListener('abort', () => {
        clearInterval(pollInterval)
        controller.close()
      })
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
