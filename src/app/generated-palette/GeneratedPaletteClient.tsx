'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
// ... other imports

export default function GeneratedPaletteClient() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [baseColor, setBaseColor] = useState('')

  useEffect(() => {
    setBaseColor(searchParams.get('color') || '#3498DB')
    setIsLoading(false)
  }, [searchParams])

  if (isLoading) {
    return <div>Loading...</div> // Or a more sophisticated loading component
  }

  // ... rest of your component logic
}