import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { orders, orderItems } from '@/lib/db/schema'
import { publishOrderEvent, cacheRecentEvent, CHANNELS } from '@/lib/pubsub'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { 
        items, total, deliveryType, tableNumber, 
        address, name, phone, notes 
    } = data

    // 1. Generate Order Number (Simple)
    const orderNumber = `OR-${Math.floor(1000 + Math.random() * 9000)}`

    // 2. Save Order to Database
    const newOrder = await db.insert(orders).values({
        orderNumber,
        deliveryType,
        tableNumber: tableNumber || null,
        deliveryAddress: address || null,
        customerName: name,
        customerPhone: phone,
        total: total.toString(),
        notes: notes || null,
        status: 'pending',
    }).returning()

    const orderId = newOrder[0].id

    // 3. Save Order Items
    const itemsToInsert = items.map((item: any) => ({
        orderId,
        dishId: item.id,
        dishName: item.name,
        sizeLabel: item.sizeLabel,
        unitPrice: item.price.toString(),
        quantity: item.quantity,
        totalPrice: (item.price * item.quantity).toString(),
    }))

    await db.insert(orderItems).values(itemsToInsert)

    // 4. Publish Real-time Event
    const payload = {
        id: orderId,
        orderNumber,
        deliveryType,
        tableNumber,
        customerName: name,
        total,
        status: 'pending',
        createdAt: new Date().toISOString()
    }
    
    await publishOrderEvent(CHANNELS.NEW_ORDER, payload)
    await cacheRecentEvent(CHANNELS.NEW_ORDER, payload)

    return NextResponse.json({ success: true, orderNumber })
  } catch (error) {
    console.error('Order Error:', error)
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 })
  }
}
