import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { dishes } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { bustCache } from '@/lib/cache'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params

  try {
    await db.delete(dishes).where(eq(dishes.id, id))
    await bustCache('menu:all')
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting dish:', error)
    return NextResponse.json({ error: 'Failed to delete dish: ' + error.message }, { status: 500 })
  }
}
