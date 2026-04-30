'use client'

import { useState, useEffect } from 'react'
import { useOrderStream } from '@/components/realtime/useOrderStream'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, ChevronRight, CheckCircle, Receipt, Clock, MapPin, User, Phone, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function ReceptionOrders() {
  const [orders, setOrders] = useState<any[]>([])
  
  useOrderStream((event) => {
    if (event.channel === 'orders:new') {
        const payload = typeof event.payload === 'string' ? JSON.parse(event.payload) : event.payload
        setOrders(prev => [payload, ...prev])
        toast.success(`New Order: #${payload.orderNumber}`)
    } else if (event.channel === 'orders:ready') {
        const payload = typeof event.payload === 'string' ? JSON.parse(event.payload) : event.payload
        setOrders(prev => prev.map(o => o.id === payload.id ? { ...o, status: 'ready' } : o))
        toast.info(`Order #${payload.orderNumber} is Ready!`, {
            description: 'Notify the customer for pickup.',
            duration: 10000
        })
    }
  })

  useEffect(() => {
    fetch('/api/reception/orders')
        .then(res => res.json())
        .then(data => setOrders(data))
  }, [])

  const columns = [
    { title: 'New', status: ['pending'] },
    { title: 'Preparing', status: ['preparing'] },
    { title: 'Ready', status: ['ready'] },
    { title: 'Delivered', status: ['delivered'] }
  ]

  const updateStatus = async (orderId: string, status: string) => {
    await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
    })
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o))
  }

  // Timing Logic: Check for delays every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
        orders.forEach(order => {
            if (order.status === 'preparing') {
                const diff = (Date.now() - new Date(order.updatedAt).getTime()) / (1000 * 60)
                if (diff > 15) {
                    toast.error(`DELAY ALERT: Order #${order.orderNumber} is in preparation for >15 mins!`, {
                        description: 'Please check with the kitchen immediately.',
                        duration: 5000,
                        id: `delay-prep-${order.id}`
                    })
                }
            }
            if (order.status === 'ready') {
                const diff = (Date.now() - new Date(order.updatedAt).getTime()) / (1000 * 60)
                if (diff > 5) {
                    toast.warning(`DELIVERY ALERT: Order #${order.orderNumber} is waiting for delivery >5 mins!`, {
                        description: 'Notify the customer or delivery staff.',
                        duration: 5000,
                        id: `delay-ready-${order.id}`
                    })
                }
            }
        })
    }, 30000)

    return () => clearInterval(interval)
  }, [orders])

  return (
    <div className="min-h-screen bg-[#FFF8F0] p-6 lg:p-10 font-poppins">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-4xl font-bold font-playfair text-primary italic">Reception Panel</h1>
            <p className="text-text-secondary mt-1">Manage incoming orders and billing</p>
        </div>
        <div className="flex gap-4">
            <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-border text-center">
                <p className="text-[10px] uppercase font-bold text-text-secondary opacity-60">Total Orders</p>
                <p className="text-xl font-bold">{orders.length}</p>
            </div>
            <div className="bg-primary text-white px-6 py-3 rounded-2xl shadow-lg text-center">
                <p className="text-[10px] uppercase font-bold opacity-80">Today's Revenue</p>
                <p className="text-xl font-bold">₹0.00</p>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[calc(100vh-250px)]">
        {columns.map((col) => (
            <div key={col.title} className="flex flex-col h-full bg-white/40 rounded-[2.5rem] border border-border/50 p-4">
                <div className="flex items-center justify-between px-4 mb-4">
                    <h2 className="font-bold font-playfair text-xl flex items-center gap-2">
                        {col.title}
                        <span className="text-xs bg-white px-2 py-1 rounded-full border border-border">
                            {orders.filter(o => col.status.includes(o.status)).length}
                        </span>
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 px-2 no-scrollbar">
                    <AnimatePresence>
                        {orders
                            .filter(o => col.status.includes(o.status))
                            .map((order) => (
                                <motion.div 
                                    key={order.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white p-5 rounded-[1.8rem] shadow-sm border border-border group hover:shadow-md transition-all"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-primary mb-1">#{order.orderNumber}</p>
                                            <div className="flex items-center gap-1 font-bold text-sm">
                                                {order.deliveryType === 'dine-in' ? (
                                                    <><ShoppingBag className="w-4 h-4 text-accent" /> Table {order.tableNumber}</>
                                                ) : (
                                                    <><MapPin className="w-4 h-4 text-accent" /> Outdoor</>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm font-bold">₹{order.total}</span>
                                            <div className="flex items-center gap-1 text-[10px] text-text-secondary opacity-60">
                                                <Clock className="w-3 h-3" />
                                                2m ago
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4 bg-[#FFF8F0] p-3 rounded-xl border border-border/50">
                                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                                            <User className="w-3 h-3" /> {order.customerName}
                                        </div>
                                        {order.deliveryType === 'outdoor' && (
                                            <div className="flex items-start gap-2 text-[10px] text-text-secondary leading-tight line-clamp-1">
                                                <Phone className="w-3 h-3 mt-0.5" /> {order.customerPhone}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2 mt-4">
                                        {order.status === 'ready' && (
                                            <button 
                                                onClick={() => updateStatus(order.id, 'delivered')}
                                                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle className="w-4 h-4" /> Delivered
                                            </button>
                                        )}
                                        {order.status === 'pending' && (
                                            <button 
                                                onClick={() => updateStatus(order.id, 'preparing')}
                                                className="flex-1 bg-primary hover:bg-primary-light text-white py-2.5 rounded-xl text-xs font-bold transition-all"
                                            >
                                                Confirm
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => {
                                                const message = encodeURIComponent(`Namaste ${order.customerName}! Your delicious order #${order.orderNumber} from Swad Anusar is ready to be delivered. Enjoy your meal! 🥘`)
                                                window.open(`https://wa.me/${order.customerPhone}?text=${message}`, '_blank')
                                            }}
                                            className="bg-[#25D366] text-white p-2.5 rounded-xl hover:bg-[#128C7E] transition-all"
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                        </button>
                                        <button className="bg-white border border-border p-2.5 rounded-xl hover:bg-border/20 transition-colors">
                                            <Receipt className="w-4 h-4 text-text-secondary" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                    </AnimatePresence>
                </div>
            </div>
        ))}
      </div>
    </div>
  )
}
