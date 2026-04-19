'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Minus, Info } from 'lucide-react'
import { useCart } from '@/lib/store'
import { cn } from '@/lib/utils'

interface DishCardProps {
  dish: any
}

export function DishCard({ dish }: DishCardProps) {
  const [selectedSize, setSelectedSize] = useState(dish.sizes?.[0] || { label: 'Default', price: 0 })
  const cart = useCart()
  
  const cartItem = cart.items.find(
    (i) => i.id === dish.id && i.sizeLabel === selectedSize.label
  )

  const handleAdd = () => {
    cart.addItem({
      id: dish.id,
      name: dish.name,
      sizeLabel: selectedSize.label,
      price: Number(selectedSize.price),
      quantity: 1,
      image: dish.images?.[0]
    })
  }

  return (
    <div className="bg-white rounded-[2rem] p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col group">
      {/* Veg/Non-Veg Tag */}
      <div className="absolute top-6 left-6 z-10 flex items-center gap-1.5 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-sm text-[10px] font-bold">
        <div className={cn(
          "w-2 h-2 rounded-full",
          dish.isVeg ? "bg-green-500" : "bg-red-500"
        )} />
        {dish.isVeg ? 'VEG' : 'NON-VEG'}
      </div>

      {/* Dish Image */}
      <div className="relative w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden mb-4">
        {dish.images?.[0] ? (
          <Image 
            src={dish.images[0]} 
            alt={dish.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-accent/10 flex items-center justify-center text-accent">
            No Image
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-lg font-bold font-playfair">{dish.name}</h4>
          <button className="text-text-secondary opacity-50 hover:opacity-100">
            <Info className="w-4 h-4" />
          </button>
        </div>
        
        <p className="text-xs text-text-secondary line-clamp-2 mb-4">
          {dish.description}
        </p>

        {/* Sizes */}
        {dish.sizes?.length > 0 && (
          <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
            {dish.sizes.map((size: any) => (
              <button
                key={size.label}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold border transition-all whitespace-nowrap",
                  selectedSize.label === size.label 
                    ? "border-primary bg-primary/5 text-primary" 
                    : "border-border text-text-secondary"
                )}
              >
                {size.label} · ₹{size.price}
              </button>
            ))}
          </div>
        )}

        <div className="mt-auto flex justify-between items-center bg-[#FFF8F0] p-3 rounded-[1.2rem]">
          <div className="font-bold flex flex-col leading-tight">
            <span className="text-[10px] opacity-60 uppercase font-poppins">Price</span>
            <span>₹{selectedSize.price}</span>
          </div>

          {cartItem ? (
            <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl shadow-sm border border-border">
              <button 
                onClick={() => cart.updateQuantity(dish.id, selectedSize.label, cartItem.quantity - 1)}
                className="text-primary hover:bg-primary/10 rounded-md p-0.5"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold text-sm w-4 text-center">{cartItem.quantity}</span>
              <button 
                onClick={() => cart.updateQuantity(dish.id, selectedSize.label, cartItem.quantity + 1)}
                className="text-primary hover:bg-primary/10 rounded-md p-0.5"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleAdd}
              className="bg-primary hover:bg-primary-light text-white px-6 py-2 rounded-xl font-bold text-sm transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
