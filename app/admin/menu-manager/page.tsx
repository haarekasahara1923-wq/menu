'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, ChevronRight, Image as ImageIcon, Check, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

export default function MenuManager() {
  const [categories, setCategories] = useState<any[]>([])
  const [dishes, setDishes] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'categories' | 'dishes'>('dishes')
  const [loading, setLoading] = useState(true)
  const [showAddDish, setShowAddDish] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const [catRes, dishRes] = await Promise.all([
        fetch('/api/menu').then(r => r.json()),
        fetch('/api/admin/dishes').then(r => r.json())
    ])
    setCategories(catRes)
    setDishes(dishRes)
    setLoading(false)
  }

  const deleteDish = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dish?')) return
    await fetch(`/api/admin/dishes/${id}`, { method: 'DELETE' })
    toast.success('Dish deleted')
    fetchData()
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] p-6 lg:p-10 font-poppins">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-4xl font-bold font-playfair text-primary">Menu Manager</h1>
            <p className="text-text-secondary">Configure your restaurant's offerings</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border border-border shadow-sm">
            <button 
                onClick={() => setActiveTab('dishes')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'dishes' ? 'bg-primary text-white shadow-md' : 'text-text-secondary hover:bg-border/20'}`}
            >
                Dishes
            </button>
            <button 
                onClick={() => setActiveTab('categories')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'categories' ? 'bg-primary text-white shadow-md' : 'text-text-secondary hover:bg-border/20'}`}
            >
                Categories
            </button>
        </div>
      </header>

      {activeTab === 'dishes' ? (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold font-playfair">Internal Menu ({dishes.length})</h2>
                <button 
                    onClick={() => setShowAddDish(true)}
                    className="bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg flex items-center gap-2 hover:bg-primary-light transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add New Dish
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                    {dishes.map((dish) => (
                        <motion.div 
                            key={dish.id}
                            layout
                            className="bg-white p-5 rounded-[2rem] border border-border group hover:border-primary transition-all shadow-sm"
                        >
                            <div className="relative aspect-video rounded-2xl overflow-hidden bg-accent/10 mb-4 border border-border">
                                {dish.images?.[0] ? (
                                    <img src={dish.images[0]} alt={dish.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-accent">
                                        <ImageIcon className="w-8 h-8" />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex gap-1">
                                    <div className={`px-2 py-1 rounded-full text-[8px] font-bold ${dish.isAvailable ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                        {dish.isAvailable ? 'AVAILABLE' : 'HIDDEN'}
                                    </div>
                                </div>
                            </div>
                            <h3 className="font-bold text-lg mb-1">{dish.name}</h3>
                            <p className="text-[10px] text-text-secondary uppercase mb-3 px-2 py-0.5 bg-background inline-block rounded-md border border-border">
                                {dish.categoryName || 'No Category'}
                            </p>
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/50">
                                <span className="font-bold text-primary">₹{dish.sizes?.[0]?.price || 0}</span>
                                <div className="flex gap-2">
                                    <button className="p-2 bg-[#FFF8F0] text-text-secondary rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => deleteDish(dish.id)}
                                        className="p-2 bg-[#FFF8F0] text-text-secondary rounded-xl hover:bg-red-50 hover:text-red-500 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
      ) : (
          <div className="max-w-2xl mx-auto space-y-4">
              {/* Category management implementation... */}
              <div className="text-center py-20 opacity-40">
                  <p>Category Management Under Construction</p>
              </div>
          </div>
      )}
      
      {/* Add Dish Modal Placeholder */}
      {showAddDish && (
          <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm p-4 flex items-center justify-center overflow-y-auto">
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white w-full max-w-2xl rounded-[2.5rem] p-8 shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold font-playfair">Add New Dish</h2>
                      <button onClick={() => setShowAddDish(false)} className="p-2 bg-background rounded-full"><X /></button>
                  </div>
                  <p className="text-text-secondary italic mb-6">Form implementation follows standard patterns from Phase 5 specs.</p>
                  <button onClick={() => setShowAddDish(false)} className="w-full bg-primary text-white py-4 rounded-2xl font-bold">Close</button>
              </motion.div>
          </div>
      )}
    </div>
  )
}
