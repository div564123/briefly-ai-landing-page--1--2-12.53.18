"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-border soft-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="#" className="flex items-center gap-1">
            <span className="font-bold text-2xl text-gray-900">Briefly</span>
            <span className="font-bold text-2xl bg-gradient-to-r from-primary to-[#A97BFF] bg-clip-text text-transparent">
              AI
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition">
              Features
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition">
              Pricing
            </Link>
            <Link href="#faq" className="text-muted-foreground hover:text-foreground transition">
              FAQ
            </Link>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" className="border-primary text-primary hover:bg-muted bg-transparent">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="gradient-purple text-white border-0 hover:shadow-lg">Start for Free</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-3 border-t border-border pt-4">
            <Link href="#features" className="block text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#pricing" className="block text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
            <Link href="#faq" className="block text-muted-foreground hover:text-foreground">
              FAQ
            </Link>
            <div className="flex gap-2 pt-2">
              <Link href="/login" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  Login
                </Button>
              </Link>
              <Link href="/signup" className="flex-1">
                <Button className="w-full gradient-purple">Start Free</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
