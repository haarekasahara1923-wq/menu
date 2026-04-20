import Link from 'next/link'
import { UtensilsCrossed, ChevronRight } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center p-6 text-center overflow-hidden bg-[#1A0A00]">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-20%] w-[120%] h-[50%] bg-primary/40 blur-[100px] rounded-[100%] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-20%] w-[120%] h-[50%] bg-[#F4A261]/20 blur-[120px] rounded-[100%] pointer-events-none"></div>

      <div className="z-10 flex flex-col items-center max-w-sm mx-auto w-full">
        {/* Icon / Brand Mark */}
        <div className="w-24 h-24 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(181,69,27,0.3)]">
          <UtensilsCrossed className="w-12 h-12 text-[#F4A261]" />
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 font-playfair tracking-tight leading-tight">
          Swad <span className="italic text-[#F4A261]">Anusar</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-base text-gray-300 mb-10 font-poppins font-light leading-relaxed px-4">
          Experience authentic flavors at Govindpuri, Gwalior. <br/> 
          <span className="font-medium text-white/90">Taste that feels like home.</span>
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col w-full gap-4">
          <Link 
            href="/menu" 
            className="group relative flex items-center justify-center w-full px-8 py-4 bg-gradient-to-r from-primary to-[#D4622D] text-white rounded-2xl font-poppins font-semibold shadow-[0_10px_30px_rgba(181,69,27,0.4)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative z-10 flex items-center gap-2 text-lg">
              View Digital Menu
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          
          <Link 
            href="/auth/login" 
            className="flex items-center justify-center w-full px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 text-gray-300 rounded-2xl font-poppins font-medium hover:bg-white/10 hover:text-white transition-all duration-300"
          >
            Staff Login
          </Link>
        </div>
      </div>
    </main>
  )
}
