import { Logo } from './Logo'
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#1A0A00] text-white pt-16 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand & Logo */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <Logo width={60} height={60} />
            <div>
              <h2 className="text-2xl font-bold font-playfair italic">Swad Anusar</h2>
              <p className="text-sm text-gray-400 font-poppins">Café & Restaurant</p>
            </div>
          </div>
          <p className="text-gray-400 max-w-md font-poppins leading-relaxed mb-8">
            Experience authentic flavors at Govindpuri, Gwalior. We take pride in serving 
            delicious, home-style food prepared with the freshest ingredients and a touch of love.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-primary/20 transition-colors">
              <Instagram className="w-5 h-5 text-primary" />
            </a>
            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-primary/20 transition-colors">
              <Facebook className="w-5 h-5 text-primary" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-6 font-playfair">Quick Links</h3>
          <ul className="space-y-4 font-poppins text-gray-400">
            <li><a href="/menu" className="hover:text-primary transition-colors">Digital Menu</a></li>
            <li><a href="/#about" className="hover:text-primary transition-colors">About Us</a></li>
            <li><a href="/#contact" className="hover:text-primary transition-colors">Contact</a></li>
            <li><a href="/auth/login" className="hover:text-primary transition-colors">Staff Portal</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-6 font-playfair">Contact Us</h3>
          <ul className="space-y-4 font-poppins text-gray-400">
            <li className="flex gap-3">
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <span>Govindpuri, Gwalior, Madhya Pradesh</span>
            </li>
            <li className="flex gap-3">
              <Phone className="w-5 h-5 text-primary shrink-0" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex gap-3">
              <Mail className="w-5 h-5 text-primary shrink-0" />
              <span>hello@swadanusar.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 text-center text-gray-500 text-sm font-poppins">
        <p>© {new Date().getFullYear()} Swad Anusar Café & Restaurant. All rights reserved.</p>
      </div>
    </footer>
  )
}
