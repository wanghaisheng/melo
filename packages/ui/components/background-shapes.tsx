'use client'

import { cn } from '@melo/ui/lib/utils'
import { useEffect, useState } from 'react'

interface Shape {
  type: 'triangle' | 'square'
  top: string
  left: string
  size: number
  rotation: number
  color: string
}

export function BackgroundShapes({
  count = 15,
}: {
  count?: number,
}) {
  const [shapes, setShapes] = useState<Shape[]>([])

  useEffect(() => {
    const generateShapes = () => {
      const newShapes: Shape[] = []
      const colors = ['rose', 'green', 'blue']
      const shapeTypes: ('triangle' | 'square')[] = ['triangle', 'square']

      for (let i = 0; i < count; i++) {
        const shape: Shape = {
          type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          size: Math.floor(Math.random() * 40) + 20, // 20px to 60px
          rotation: Math.floor(Math.random() * 360),
          color: colors[Math.floor(Math.random() * colors.length)]
        }
        newShapes.push(shape)
      }

      setShapes(newShapes)
    }

    generateShapes()
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape, index) => (
        <div
          key={index}
          className={cn(`absolute`, shape.color === "rose" && "bg-rose-200/40", shape.color === "green" && "bg-green-200/40", shape.color === "blue" && "bg-blue-200/40")}
          style={{
            top: shape.top,
            left: shape.left,
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            transform: `rotate(${shape.rotation}deg)`,
            clipPath: shape.type === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none',
          }}
        ></div>
      ))}
    </div>
  )
}
