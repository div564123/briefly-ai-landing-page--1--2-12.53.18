import React from "react"

export function CapsoLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={className}>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* White square with rounded corners */}
        <rect
          x="4"
          y="4"
          width="32"
          height="32"
          rx="6"
          fill="white"
        />
        {/* Purple circle */}
        <circle
          cx="20"
          cy="20"
          r="10"
          fill="#6D5BFF"
        />
        {/* White "b" letter - filled for bold appearance */}
        <path
          d="M 13 9 L 13 29 L 17 29 Q 20 29 21.5 27.5 Q 23 26 23 24 Q 23 22 21.5 20.5 Q 20 19 17 19 L 13 19 M 13 9 L 17 9 Q 19.5 9 20.5 10.5 Q 21.5 12 21.5 14 Q 21.5 16 20.5 17.5 Q 19.5 19 17 19"
          fill="white"
        />
        {/* Top distinctive curve that extends upward */}
        <path
          d="M 13 9 Q 14 8 15 9 Q 16 8 17 9"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  )
}

