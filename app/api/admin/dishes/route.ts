import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { dishes, categories } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await db.select({
    id: dishes.id,
    name: dishes.name,
    isAvailable: dishes.isAvailable,
    images: dishes.images,
    sizes: dishes.sizes,
    categoryName: categories.name,
    categoryId: dishes.categoryId
  })
  .from(dishes)
  .leftJoin(categories, eq(dishes.categoryId, categories.id))
  .orderBy(desc(dishes.createdAt))

  return NextResponse.json(result)
}
