'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShoppingBag, MapPin, Phone, ChevronRight } from 'lucide-react'
import { useCart } from '@/lib/store'
import { DishCard } from '@/components/menu/DishCard'
import { CategoryTabs } from '@/components/menu/CategoryTabs'
import { CartPanel } from '@/components/menu/CartPanel'

export default function MenuPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const cart = useCart()

  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        setCategories(data)
        if (data.length > 0) setActiveCategory(data[0].id)
        setLoading(false)
      })
  }, [])

  const activeCategoryData = categories.find(c => c.id === activeCategory)

  return (
    <div className="min-h-screen pb-24 font-poppins bg-background">
      <div className="mx-auto w-full">
      {/* Header */}
      <header className="bg-primary text-white p-6 rounded-b-[2rem] shadow-lg">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div>
            <h1 className="font-playfair text-3xl font-bold italic">Swad Anusar</h1>
            <div className="flex items-center text-xs opacity-80 mt-1">
              <MapPin className="w-3 h-3 mr-1" />
              <span>Govindpuri, Gwalior</span>
            </div>
          </div>
          <button className="bg-white/20 p-2 rounded-full backdrop-blur-md">
            <Phone className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Hero / Banner */}
      <div className="max-w-7xl mx-auto w-full px-4 mt-6">
        <div className="bg-gradient-to-r from-[#F4A261] to-[#E76F51] rounded-2xl p-6 md:p-10 text-white overflow-hidden relative shadow-lg">
            <div className="relative z-10">
                <h2 className="text-2xl font-bold font-playfair mb-1 drop-shadow-sm">Authentic Flavors</h2>
                <p className="text-sm opacity-95 max-w-[200px] font-medium">Taste that feels like home, right at your table.</p>
                <button className="bg-white text-primary px-5 py-2.5 rounded-full mt-4 text-sm font-bold shadow-xl transition hover:scale-105 active:scale-95">
                    Check Offers
                </button>
            </div>
            <div className="absolute right-[-20px] top-[-20px] bg-white/30 w-48 h-48 rounded-full blur-3xl"></div>
            <div className="absolute left-[-20px] bottom-[-20px] bg-white/20 w-32 h-32 rounded-full blur-2xl"></div>
        </div>
      </div>

      {/* Categories */}
      <div className="sticky top-0 z-40 bg-background pt-4 mt-2">
        <div className="max-w-7xl mx-auto w-full">
            <CategoryTabs 
            categories={categories} 
            activeId={activeCategory} 
            onSelect={setActiveCategory} 
            loading={loading}
            />
        </div>
      </div>

      {/* Dishes */}
      <main className="max-w-7xl mx-auto w-full px-4 mt-6 flex-1">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold font-playfair flex items-center">
                {activeCategoryData?.name || 'All Dishes'}
                <span className="ml-2 text-xs font-normal text-text-secondary bg-[#E8D5C4] px-2 py-0.5 rounded-full">
                    {activeCategoryData?.dishes?.length || 0} Items
                </span>
            </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-8">
            {loading ? (
                Array(4).fill(0).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl h-64 animate-pulse"></div>
                ))
            ) : (
                activeCategoryData?.dishes?.map((dish: any) => (
                    <DishCard key={dish.id} dish={dish} />
                ))
            )}
        </div>
      </main>

      {/* Floating Cart Button */}
      {cart.items.length > 0 && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[400px] z-50 pointer-events-none"
          >
            <button 
                onClick={() => setIsCartOpen(true)}
                className="w-full bg-primary text-white h-16 rounded-2xl flex items-center justify-between px-6 shadow-[0_10px_40px_rgba(181,69,27,0.4)] pointer-events-auto transition hover:scale-[1.02] active:scale-[0.98]"
            >
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <ShoppingBag className="w-6 h-6" />
                        <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-primary">
                            {cart.totalItems()}
                        </span>
                    </div>
                    <div>
                        <p className="text-xs opacity-80">Your Order</p>
                        <p className="font-bold">₹{cart.totalPrice()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 font-bold">
                    View Cart
                    <ChevronRight className="w-5 h-5" />
                </div>
            </button>
          </motion.div>
      )}

      {/* Cart Panel */}
      <AnimatePresence>
        {isCartOpen && <CartPanel onClose={() => setIsCartOpen(false)} />}
      </AnimatePresence>
    </div>
  )
}
