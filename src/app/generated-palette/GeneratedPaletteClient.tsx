'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wand2, Download, ArrowLeft, CheckCircle2 } from "lucide-react"
import namer from 'color-namer'
import chroma from 'chroma-js'
import { motion } from 'framer-motion'
import { ColorHarmonies } from '../components/ColorHarmonies'

type ColorHarmony = 'analogous' | 'complementary' | 'triadic' | 'tetradic'

// ... (keep all your utility functions here)

export default function GeneratedPaletteClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [baseColor, setBaseColor] = useState(searchParams.get('color') || '#3498DB')
  const [harmony, setHarmony] = useState<ColorHarmony>('analogous')
  const [palette, setPalette] = useState<string[]>([])
  const [harmonyColors, setHarmonyColors] = useState<string[]>([])
  const [copiedColor, setCopiedColor] = useState<string | null>(null)

  // ... (keep all your other state and effect hooks)

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color)
    setCopiedColor(color)
    setTimeout(() => setCopiedColor(null), 2000)
  }

  const handleDownload = (format: 'svg' | 'png') => {
    // ... (keep your download logic)
  }

  const handleRandomize = () => {
    const newBaseColor = chroma.random().hex()
    setBaseColor(newBaseColor)
  }

  // ... (keep all your other handler functions)

  return (
    <main className="min-h-screen bg-zinc-900 text-zinc-50 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Your existing JSX content */}
        <Card className="w-full bg-[#1B1B1B] border-[#3C3C3C] shadow-lg transition-all duration-300 ease-in-out">
          <CardContent className="p-6 flex flex-col items-center gap-6">
            {/* ... */}
            <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {palette.map((color, index) => (
                <motion.div
                  key={index}
                  className="relative aspect-square rounded-lg shadow-md overflow-hidden cursor-pointer"
                  style={{ backgroundColor: color }}
                  onClick={() => handleCopyColor(color)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity duration-200">
                    {copiedColor === color ? (
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    ) : (
                      <span className="text-white text-sm font-medium">{color}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            {/* Color harmony selector */}
            <Select value={harmony} onValueChange={(value: ColorHarmony) => setHarmony(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select color harmony" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="analogous">Analogous</SelectItem>
                <SelectItem value="complementary">Complementary</SelectItem>
                <SelectItem value="triadic">Triadic</SelectItem>
                <SelectItem value="tetradic">Tetradic</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <ColorHarmonies harmonies={[
          { name: 'Analogous', colors: harmonyColors },
          // ... (other harmony types)
        ]} />

        {/* ... (rest of your JSX) */}
      </div>
    </main>
  )
}