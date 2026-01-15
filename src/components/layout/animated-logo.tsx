"use client"

import { useState } from "react"

export function AnimatedLogo() {
  const [isHovered, setIsHovered] = useState(false)
  const text = "SpendlyoAI"
  const subtitle = "Smart Finance"

  return (
    <div 
      className="flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center">
        {text.split("").map((char, index) => (
          <span
            key={index}
            className="font-bold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent inline-block"
            style={{
              animation: isHovered ? `jiggle 0.5s ease-in-out ${index * 0.05}s` : 'none',
            }}
          >
            {char}
          </span>
        ))}
      </div>
      <span className="text-[11px] text-muted-foreground -mt-0.5 hidden sm:block tracking-wide">
        {subtitle}
      </span>

      <style jsx>{`
        @keyframes jiggle {
          0%, 100% {
            transform: rotate(0deg) translateY(0);
          }
          25% {
            transform: rotate(-3deg) translateY(-2px);
          }
          50% {
            transform: rotate(3deg) translateY(-3px);
          }
          75% {
            transform: rotate(-2deg) translateY(-1px);
          }
        }
      `}</style>
    </div>
  )
}
