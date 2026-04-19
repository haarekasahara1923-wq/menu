'use client'

import { motion } from 'framer-motion'

interface CategoryTabsProps {
  categories: any[]
  activeId: string
  onSelect: (id: string) => void
  loading: boolean
}

export function CategoryTabs({ categories, activeId, onSelect, loading }: CategoryTabsProps) {
  if (loading) {
    return (
      <div className="flex gap-4 px-4 overflow-x-auto pb-4 scrollbar-hide">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="min-w-[100px] h-10 bg-white/50 rounded-full animate-pulse"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex gap-4 px-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`
            relative px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all
            ${activeId === cat.id ? 'text-white' : 'text-text-secondary bg-white shadow-sm'}
          `}
        >
          {activeId === cat.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-primary rounded-full -z-10"
              transition={{ type: 'spring', duration: 0.5 }}
            />
          )}
          {cat.name}
        </button>
      ))}
    </div>
  )
}
