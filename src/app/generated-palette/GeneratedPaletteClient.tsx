'use client'

import { useState, useEffect } from 'react'
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

type ColorHarmony = 'analogous' | 'complementary' | 'triadic' | 'tetradic'

function generateInitialPalette(baseColor: string): string[] {
  const color = chroma(baseColor)
  return [
    color.darken(2).hex(),
    color.darken(1).hex(),
    baseColor,
    color.brighten(1).hex(),
    color.brighten(2).hex(),
  ]
}

function generateHarmonyColors(baseColor: string, harmony: ColorHarmony): string[] {
  const color = chroma(baseColor)
  switch (harmony) {
    case 'analogous':
      return [
        color.set('hsl.h', '-30').hex(),
        color.set('hsl.h', '+30').hex(),
      ]
    case 'complementary':
      return [color.set('hsl.h', '+180').hex()]
    case 'triadic':
      return [
        color.set('hsl.h', '+120').hex(),
        color.set('hsl.h', '+240').hex(),
      ]
    case 'tetradic':
      return [
        color.set('hsl.h', '+90').hex(),
        color.set('hsl.h', '+180').hex(),
        color.set('hsl.h', '+270').hex(),
      ]
  }
}

function getContrastRatio(color: string, background: string) {
  return chroma.contrast(color, background).toFixed(2)
}

function getAccessibilityLevel(ratio: number) {
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  return 'Fail'
}

function AccessibilityIndicator({ ratio, level, textColor }: { ratio: number, level: string, textColor: string }) {
  const bgColor = level === 'Fail' ? 'bg-red-500' : level === 'AA' ? 'bg-yellow-500' : 'bg-green-500'
  return (
    <div className="flex items-center justify-between mb-1">
      <span className={`text-xs ${textColor}`}>{textColor === 'text-white' ? 'White' : 'Black'} text:</span>
      <div className="flex items-center">
        <span className={`text-xs ${textColor} mr-2`}>{ratio}</span>
        <span className={`text-xs px-2 py-0.5 rounded ${bgColor} text-black font-bold`}>{level}</span>
      </div>
    </div>
  )
}

export default function GeneratedPalette() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [baseColor, setBaseColor] = useState(searchParams.get('color') || '#3498DB')
  const [harmony, setHarmony] = useState<ColorHarmony>('analogous')
  const [palette, setPalette] = useState<string[]>([])
  const [harmonyColors, setHarmonyColors] = useState<string[]>([])
  const [copiedColor, setCopiedColor] = useState<string | null>(null)

  useEffect(() => {
    const initialPalette = generateInitialPalette(baseColor)
    setPalette(initialPalette)
    setHarmonyColors(generateHarmonyColors(baseColor, harmony))
  }, [baseColor])

  useEffect(() => {
    setHarmonyColors(generateHarmonyColors(baseColor, harmony))
  }, [harmony, baseColor])

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color)
    setCopiedColor(color)
    setTimeout(() => setCopiedColor(null), 2000)
  }

  const handleDownload = (format: 'svg' | 'png') => {
    const canvas = document.createElement('canvas')
    canvas.width = 500
    canvas.height = 100
    const ctx = canvas.getContext('2d')
    if (ctx) {
      palette.forEach((color, index) => {
        ctx.fillStyle = color
        ctx.fillRect(index * 100, 0, 100, 100)
      })
      
      if (format === 'png') {
        const dataUrl = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.download = 'color-palette.png'
        link.href = dataUrl
        link.click()
      } else if (format === 'svg') {
        const svgString = `
          <svg xmlns="http://www.w3.org/2000/svg" width="500" height="100">
            ${palette.map((color, index) => `
              <rect x="${index * 100}" y="0" width="100" height="100" fill="${color}" />
            `).join('')}
          </svg>
        `
        const blob = new Blob([svgString], {type: 'image/svg+xml'})
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = 'color-palette.svg'
        link.href = url
        link.click()
        URL.revokeObjectURL(url)
      }
    }
  }

  const handleRandomize = () => {
    const newBaseColor = chroma.random().hex()
    setBaseColor(newBaseColor)
  }

  const renderColorSwatch = (color: string, index: number) => (
    <motion.div 
      key={index} 
      className="bg-[#252525] p-5 rounded-md transition-all duration-300 ease-in-out hover:shadow-lg"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <div 
        className="h-24 rounded-md mb-3 cursor-pointer transition-all duration-300 ease-in-out relative"
        style={{ backgroundColor: color }}
        onClick={() => handleCopyColor(color)}
      >
        {copiedColor === color && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CheckCircle2 className="text-white" size={28} />
          </motion.div>
        )}
      </div>
      <p className="text-[#FAFAFA] font-bold text-base mb-1">{namer(color).ntc[0].name}</p>
      <p className="text-[#A1A1AA] text-sm mb-3">{color}</p>
      <div className="mt-3 p-2.5 bg-[#1B1B1B] rounded-md">
        <h4 className="text-[#F2F7F2] font-semibold mb-2 text-sm">Accessibility</h4>
        <AccessibilityIndicator 
          ratio={parseFloat(getContrastRatio(color, '#FFFFFF'))}
          level={getAccessibilityLevel(parseFloat(getContrastRatio(color, '#FFFFFF')))}
          textColor="text-white"
        />
        <AccessibilityIndicator 
          ratio={parseFloat(getContrastRatio(color, '#000000'))}
          level={getAccessibilityLevel(parseFloat(getContrastRatio(color, '#000000')))}
          textColor="text-gray-300"
        />
      </div>
    </motion.div>
  )

  return (
    <main className="min-h-screen w-full bg-[#18181B] bg-gradient-to-b from-[#18181B] to-[#18181B] py-20 px-4 flex flex-col items-center justify-start">
      <div className="w-full max-w-[840px] flex flex-col items-center gap-6">
        {/* Logo and header section */}
        <div className="flex flex-col items-center gap-4 relative w-full mb-6">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer w-full max-w-[480px]"
            onClick={() => router.push('/')}
          >
            <svg className="w-full h-auto" viewBox="0 0 2373.19 195.42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill="#fff" d="M211.37,145.48h-114.2c-28.23,0-45.6-19-45.6-48.04s17.37-46.96,45.6-46.96h92.56L220.13,2.98H91.47C36.37,2.98,0,41.25,0,98.8s37.73,94.18,94.19,94.18h154.48c-5.02-3.48-9.71-7.42-14.07-11.79-10.12-10.15-17.91-22.17-23.23-35.71Z"/>
              <path fill="#fff" d="M371.04,1.63h-56.72c-55.1,0-91.47,38-91.47,96.48,0,17.91,3.67,33.88,10.44,47.37,14.92,29.77,44.89,47.5,83.74,47.5h56.73c55.1,0,91.47-38,91.47-96.49S427.5,1.63,371.04,1.63ZM368.06,145.82h-48.04c-28.23,0-45.6-18.87-45.6-49.06s17.37-47.97,45.6-47.97h48.04c28.23,0,45.6,18.87,45.6,49.05s-17.37,47.98-45.6,47.98Z"/>
              <path fill="#fff" d="M679.47,145.48h-120.05c-12.49,0-20.9-8.41-20.9-20.9V2.98h-51.57v129.2c0,36.37,24.42,60.8,60.8,60.8h167.66c-4.38-3.2-8.51-6.76-12.37-10.66-10.33-10.44-18.24-22.85-23.57-36.84Z"/>
              <path fill="#fff" d="M839.53,1.63h-56.73c-55.1,0-91.47,38.27-91.47,97.17,0,17.58,3.49,33.31,9.95,46.68,12.39,25.73,35.74,42.75,66.23,47.5,5.75.9,11.76,1.36,18,1.36h56.73c55.1,0,91.47-38.27,91.47-97.17S895.98,1.63,839.53,1.63ZM849.03,145.48c-3.88.9-8.05,1.36-12.49,1.36h-48.04c-4.41,0-8.55-.46-12.41-1.36-20.82-4.86-33.19-22.39-33.19-48.04,0-29.59,17.37-48.31,45.6-48.31h48.04c28.23,0,45.6,19,45.6,49.39,0,24.93-12.33,42.16-33.11,46.96Z"/>
              <path fill="#fff" d="M1176.91,72.47c0-43.97-28.23-69.49-70.57-69.49h-148.2v190h51.57V50.48h92.29c13.84,0,23.34,9.5,23.34,23.89s-9.5,23.61-23.34,23.61h-54.83l-31.76,47.5h73.56l33.11,47.5h60.53l-44.78-63.51c24.7-7.06,39.08-25.79,39.08-57Z"/>
              <path fill="#fff" d="M1381.57,50.48h-23.61l-31.76,47.5h50.76c14.11,0,23.61,9.5,23.61,23.62s-9.5,23.88-23.61,23.88h-82.25l-30.4,47.5h117.26c42.34,0,70.57-28.23,70.57-70.57v-1.36c0-42.34-28.23-70.57-70.57-70.57Z"/>
              <path fill="#fff" d="M1251.56,74.37c0-14.39,9.5-23.89,23.61-23.89h82.51l30.4-47.5h-117.25c-42.34,0-70.57,28.23-70.57,70.57v1.36c0,42.34,28.23,70.57,70.57,70.57h23.61l31.76-47.5h-51.03c-14.11,0-23.61-9.5-23.61-23.61Z"/>
              <polygon fill="#fff" points="1558.27 85.77 1498.29 2.98 1433.15 2.98 1532.49 132.45 1532.49 192.98 1584.06 192.98 1584.06 132.45 1683.4 2.98 1618.26 2.98 1558.27 85.77"/>
              <path fill="#fff" d="M1811.52,28.5c-12.22-17.1-34.47-28.5-56.46-28.5-39.63,0-66.23,26.6-66.23,66.23v126.75h51.57V61.61c0-8.41,5.7-14.11,14.39-14.11,5.16,0,10.31,2.71,13.57,6.78l32.84,43.43h59.72l-49.4-69.21Z"/>
              <path fill="#fff" d="M1862,2.98v130.83c0,8.41-5.7,14.11-14.11,14.11-5.16,0-10.86-2.71-13.84-6.78l-32.85-43.43h-59.71l49.4,69.21c12.21,17.1,34.47,28.5,55.37,28.5,40.71,0,67.31-26.32,67.31-66.22V2.98h-51.57Z"/>
              <polygon fill="#fff" points="1933.57 50.48 2025.13 50.48 2025.13 192.98 2076.7 192.98 2076.7 50.48 2153.69 50.48 2153.69 2.98 1933.57 2.98 1933.57 50.48"/>
              <polygon fill="#fff" points="2173.69 2.98 2173.69 50.48 2173.69 192.98 2225.26 192.98 2225.26 2.98 2177.4 2.98 2173.69 2.98"/>
              <polygon fill="#fff" points="2321.62 2.98 2321.62 78.44 2261.09 78.44 2230.69 125.94 2321.62 125.94 2321.62 192.98 2373.19 192.98 2373.19 2.98 2321.62 2.98"/>
            </svg>
          </motion.div>
          <p className="text-center text-[#9597F5] text-xl font-normal">
            Create harmonious color schemes from a single base color.
          </p>
          <Link href="/" className="absolute top-0 right-0">
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full bg-[#252525] hover:bg-[#3C3C3C] transition-colors duration-200"
            >
              <ArrowLeft className="h-6 w-6 text-white" />
              <span className="sr-only">Start Over</span>
            </Button>
          </Link>
        </div>

        {/* Generated Palette */}
        <Card className="w-full bg-[#1B1B1B] border-[#3C3C3C] shadow-lg transition-all duration-300 ease-in-out">
          <CardContent className="p-6 flex flex-col items-center gap-6">
            <div className="text-center">
              <h2 className="text-[#F2F7F2] text-2xl font-bold mb-2">Generated Palette</h2>
              <p className="text-[#A5A8A5] text-sm">
                Your harmonious color palette based on the input color.
              </p>
            </div>

            <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {palette.map(renderColorSwatch)}
            </div>

            <div className="flex flex-wrap justify-between w-full gap-4">
              <Button 
                className="bg-[#6366F1] hover:bg-[#6366F1]/90 text-white transition-all duration-300 ease-in-out" 
                onClick={handleRandomize}
              >
                <Wand2 className="mr-2 h-4 w-4" />
                Randomize
              </Button>
              <div className="flex gap-2">
                <Button 
                  className="bg-[#6366F1] hover:bg-[#6366F1]/90 text-white transition-all duration-300 ease-in-out" 
                  onClick={() => handleDownload('png')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PNG
                </Button>
                <Button 
                  className="bg-[#6366F1] hover:bg-[#6366F1]/90 text-white transition-all duration-300 ease-in-out" 
                  onClick={() => handleDownload('svg')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download SVG
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Explore Harmonies */}
        <Card className="w-full bg-[#1B1B1B] border-[#3C3C3C] shadow-lg transition-all duration-300 ease-in-out">
          <CardContent className="p-6 flex flex-col items-center gap-6">
            <h2 className="text-[#F2F7F2] text-2xl font-bold">Explore Harmonies</h2>
            <p className="text-[#A5A8A5] text-sm text-center">
              See how your selected color interacts with different color harmonies.
            </p>
            <div className="w-full">
              <Select value={harmony} onValueChange={(value: ColorHarmony) => setHarmony(value)}>
                <SelectTrigger className="w-full bg-[#252525] text-[#F2F7F2] border border-[#4E4E4E] rounded-md p-2 transition-all duration-300 ease-in-out">
                  <SelectValue placeholder="Select harmony" />
                </SelectTrigger>
                <SelectContent className="bg-[#252525] border-[#4E4E4E]">
                  <SelectItem value="analogous">Analogous</SelectItem>
                  <SelectItem value="complementary">Complementary</SelectItem>
                  <SelectItem value="triadic">Triadic</SelectItem>
                  <SelectItem value="tetradic">Tetradic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {harmonyColors.map(renderColorSwatch)}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-5 mt-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#4E4E4E] border-2 border-[#4E4E4E] overflow-hidden">
              <Image src="/avatar.png" alt="Creator" width={48} height={48} className="w-full h-full object-cover" />
            </div>
            <span className="text-white text-base">Created by Drewskii</span>
          </div>
          <a href="https://x.com/drewskii_xyz" target="_blank" rel="noopener noreferrer">
            <Button className="bg-[#6366F1] hover:bg-[#6366F1]/90 font-bold text-white transition-all duration-300 ease-in-out flex items-center">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current mr-2">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
              Connect on X
            </Button>
          </a>
        </div>
      </div>
      <div className="w-[424px] h-[424px] rounded-full bg-[#6366F1] opacity-20 blur-[600px] absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2"></div>
    </main>
  )
}
