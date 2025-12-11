import React from "react"
import Image from "next/image"

export function CapsoLogo({ className = "w-8 h-8" }: { className?: string }) {
  // Use the exact image file from public folder
  // Place your logo file as: public/capso-logo.png or public/capso-logo.svg
  return (
    <div className={className} style={{ position: "relative", width: "100%", height: "100%" }}>
      <Image
        src="/capso-logo.png"
        alt="Capso AI Logo"
        fill
        className="object-contain"
        unoptimized
      />
    </div>
  )
}

