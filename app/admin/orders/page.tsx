'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, ChevronRight, Clock, MapPin, User, Search, Filter } from 'lucide-react'
import Link from 'next/link'

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/reception/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data)
        setLoading(false)
      })
  }, [])

  const filteredOrders = orders.filter(o => 
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    o.customerName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#FFF8F0] p-6 lg:p-10 font-poppins">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-text-secondary mb-1">
            <Link href="/admin" className="hover:text-primary transition-colors">Dashboard</Link>
            <ChevronRight className="w-3 h-3" />
            <span>Orders</span>
          </div>
          <h1 className="text-4xl font-bold font-playfair text-primary">All Orders</h1>
          <p className="text-text-secondary mt-1">Monitor and manage all restaurant transactions</p>
        </div>
      </header>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary opacity-40" />
          <input 
            type="text" 
            placeholder="Search by Order # or Customer Name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-4 bg-white border border-border rounded-2xl font-bold text-text-secondary hover:bg-border/10 transition-all shadow-sm">
          <Filter className="w-5 h-5" />
          Filters
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-48 bg-white/50 animate-pulse rounded-[2rem] border border-border"></div>
          ))}
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-[2.2rem] border border-border hover:border-primary transition-all shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/5 rounded-full border border-primary/10">#{order.orderNumber}</span>
                  <h3 className="font-bold text-lg mt-2 flex items-center gap-2">
                    {order.deliveryType === 'dine-in' ? 'Dine In' : 'Outdoor'}
                    <span className={`text-[10px] uppercase px-2 py-0.5 rounded-md ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'ready' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'preparing' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status}
                    </span>
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">₹{order.total}</p>
                  <div className="flex items-center justify-end gap-1 text-[10px] text-text-secondary opacity-60">
                    <Clock className="w-3 h-3" />
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6 p-4 bg-[#FFF8F0] rounded-2xl border border-border/40">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-primary opacity-60" />
                  <span className="font-medium">{order.customerName}</span>
                </div>
                {order.deliveryType === 'dine-in' ? (
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <ShoppingBag className="w-4 h-4 opacity-60" />
                    Table {order.tableNumber}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <MapPin className="w-4 h-4 opacity-60" />
                    Outdoor Service
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Link 
                  href={`/reception/orders`} 
                  className="flex-1 bg-white border border-border py-3 rounded-xl text-xs font-bold text-center hover:bg-border/10 transition-all"
                >
                  Manage Order
                </Link>
                <button className="px-4 bg-primary text-white py-3 rounded-xl text-xs font-bold hover:bg-primary-light transition-all">
                  Receipt
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white/40 rounded-[3rem] border border-dashed border-border">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-text-secondary opacity-20" />
          <h3 className="text-xl font-bold font-playfair opacity-40">No orders found</h3>
          <p className="text-text-secondary opacity-40">Try adjusting your filters or search</p>
        </div>
      )}
    </div>
  )
}
