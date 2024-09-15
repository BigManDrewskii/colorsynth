'use client'
<<<<<<< HEAD

import { useState, useEffect, useCallback } from 'react'
import chroma from 'chroma-js'
import colorNamer from 'color-namer'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Download, RefreshCw, Palette, Check, Circle, Hexagon, Triangle, Square, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const getUniqueColorName = (hex: string) => {
  if (!chroma.valid(hex)) {
    return 'Invalid Color'
  }

  try {
    const names = colorNamer(hex)
    return names.ntc[0].name
  } catch (error) {
    console.error('Error getting color name:', error)
    return 'Unknown Color'
  }
}

const getContrastRatio = (color1: string, color2: string) => {
  return chroma.contrast(color1, color2).toFixed(2)
}

const getAccessibilityLevel = (contrastRatio: number) => {
  if (contrastRatio >= 7) return 'AAA'
  if (contrastRatio >= 4.5) return 'AA'
  if (contrastRatio >= 3) return 'AA Large'
  return 'Fail'
}

export default function Component() {
  const [baseColor, setBaseColor] = useState('#3498db')
  const [palette, setPalette] = useState<string[]>([])
  const [harmonyPalette, setHarmonyPalette] = useState<string[]>([])
  const [currentScreen, setCurrentScreen] = useState('initial')
  const [harmonyMode, setHarmonyMode] = useState('complementary')
  const [paletteSize, setPaletteSize] = useState(5)
  const [copiedColor, setCopiedColor] = useState<string | null>(null)

  const generatePalette = useCallback(() => {
    if (!chroma.valid(baseColor)) return

    const baseChroma = chroma(baseColor)
    const newPalette = chroma.scale([baseChroma.brighten(2), baseColor, baseChroma.darken(2)])
      .mode('lch')
      .colors(paletteSize)
    setPalette(newPalette)

    let harmonyColors: string[] = []
    switch (harmonyMode) {
      case 'analogous':
        harmonyColors = [
          baseChroma.set('hsl.h', '-30').hex(),
          baseColor,
          baseChroma.set('hsl.h', '+30').hex(),
        ]
        break
      case 'complementary':
        harmonyColors = [
          baseColor,
          baseChroma.set('hsl.h', '+180').hex(),
          baseChroma.set('hsl.h', '+180').brighten().hex(),
        ]
        break
      case 'triadic':
        harmonyColors = [
          baseColor,
          baseChroma.set('hsl.h', '+120').hex(),
          baseChroma.set('hsl.h', '+240').hex(),
        ]
        break
      case 'tetradic':
        harmonyColors = [
          baseColor,
          baseChroma.set('hsl.h', '+90').hex(),
          baseChroma.set('hsl.h', '+180').hex(),
          baseChroma.set('hsl.h', '+270').hex(),
        ]
        break
    }
    setHarmonyPalette(harmonyColors)
  }, [baseColor, harmonyMode, paletteSize])

  useEffect(() => {
    if (baseColor && chroma.valid(baseColor)) {
      generatePalette()
    }
  }, [baseColor, harmonyMode, paletteSize, generatePalette])

  const handleColorInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    if (input.startsWith('#') && input.length <= 7) {
      setBaseColor(input)
    } else if (!input.startsWith('#') && input.length <= 6) {
      setBaseColor('#' + input)
    }
  }

  const handleColorPicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBaseColor(e.target.value)
  }

  const handleGenerate = () => {
    if (chroma.valid(baseColor)) {
      setCurrentScreen('generated')
      generatePalette()
    }
  }

  const handleStartOver = () => {
    setBaseColor('#3498db')
    setPalette([])
    setHarmonyPalette([])
    setCurrentScreen('initial')
  }

  const handleRandomize = () => {
    const newColor = chroma.random().hex()
    setBaseColor(newColor)
  }

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color)
    setCopiedColor(color)
    setTimeout(() => setCopiedColor(null), 1500)
  }

  const createPalettePNG = (colors: string[]): string => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''

    const scale = 2
    const padding = 40 * scale
    const swatchSize = 200 * scale
    const textHeight = 80 * scale
    const width = (colors.length * swatchSize + (colors.length + 1) * padding)
    const height = swatchSize + 3 * padding + textHeight

    canvas.width = width
    canvas.height = height

    ctx.fillStyle = '#18181B'
    ctx.fillRect(0, 0, width, height)

    colors.forEach((color, index) => {
      const x = padding + index * (swatchSize + padding)
      const y = padding

      ctx.fillStyle = color
      ctx.fillRect(x, y, swatchSize, swatchSize)

      ctx.strokeStyle = '#27272A'
      ctx.lineWidth = 4 * scale
      ctx.strokeRect(x, y, swatchSize, swatchSize)

      ctx.fillStyle = '#FAFAFA'
      ctx.font = `bold ${24 * scale}px Inter, sans-serif`
      ctx.textAlign = 'center'
      const colorName = getUniqueColorName(color)
      ctx.fillText(colorName, x + swatchSize / 2, y + swatchSize + 40 * scale)

      ctx.fillStyle = '#A1A1AA'
      ctx.font = `${20 * scale}px Inter, sans-serif`
      ctx.fillText(color.toUpperCase(), x + swatchSize / 2, y + swatchSize + 70 * scale)
    })

    ctx.fillStyle = '#FAFAFA'
    ctx.font = `bold ${32 * scale}px Inter, sans-serif`
    ctx.textAlign = 'left'
    ctx.fillText('ColorSynth Palette', padding, height - padding / 2)

    const date = new Date().toLocaleDateString()
    ctx.font = `${20 * scale}px Inter, sans-serif`
    ctx.fillStyle = '#A1A1AA'
    ctx.textAlign = 'right'
    ctx.fillText(`Created on ${date}`, width - padding, height - padding / 2)

    return canvas.toDataURL('image/png')
  }

  const createPaletteSVG = (colors: string[]): string => {
    const padding = 40
    const swatchSize = 200
    const textHeight = 80
    const width = colors.length * swatchSize + (colors.length + 1) * padding
    const height = swatchSize + 3 * padding + textHeight

    let svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <rect width="100%" height="100%" fill="#18181B"/>
    `

    colors.forEach((color, index) => {
      const x = padding + index * (swatchSize + padding)
      const y = padding
      const colorName = getUniqueColorName(color)

      svgContent += `
        <rect x="${x}" y="${y}" width="${swatchSize}" height="${swatchSize}" fill="${color}" stroke="#27272A" stroke-width="4"/>
        <text x="${x + swatchSize / 2}" y="${y + swatchSize + 40}" font-family="Inter, sans-serif" font-size="24" font-weight="bold" fill="#FAFAFA" text-anchor="middle">${colorName}</text>
        <text x="${x + swatchSize / 2}" y="${y + swatchSize + 70}" font-family="Inter, sans-serif" font-size="20" fill="#A1A1AA" text-anchor="middle">${color.toUpperCase()}</text>
      `
    })

    const date = new Date().toLocaleDateString()
    svgContent += `
      <text x="${padding}" y="${height - padding / 2}" font-family="Inter, sans-serif" font-size="32" font-weight="bold" fill="#FAFAFA">ColorSynth Palette</text>
      <text x="${width - padding}" y="${height - padding / 2}" font-family="Inter, sans-serif" font-size="20" fill="#A1A1AA" text-anchor="end">Created on ${date}</text>
    </svg>
    `

    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent)
  }

  const downloadPalette = (format: 'png' | 'svg') => {
    let dataUrl: string
    let fileName: string

    if (format === 'png') {
      dataUrl = createPalettePNG(palette)
      fileName = 'colorsynth-palette.png'
    } else {
      dataUrl = createPaletteSVG(palette)
      fileName = 'colorsynth-palette.svg'
    }

    const link = document.createElement('a')
    link.href = dataUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const AccessibilityInfo = ({ backgroundColor }: { backgroundColor: string }) => {
    const whiteContrast = getContrastRatio(backgroundColor, '#ffffff')
    const blackContrast = getContrastRatio(backgroundColor, '#000000')
    const whiteLevel = getAccessibilityLevel(parseFloat(whiteContrast))
    const blackLevel = getAccessibilityLevel(parseFloat(blackContrast))

    return (
      <div className="mt-4 p-4 bg-zinc-800 rounded-lg">
        <h3 className="text-sm font-semibold mb-2">Accessibility Info</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="font-medium">White text:</span> {whiteContrast}
            <span className={`ml-2 ${whiteLevel === 'Fail' ? 'text-red-500' : 'text-green-500'}`}>
              {whiteLevel}
            </span>
          </div>
          <div>
            <span className="font-medium">Black text:</span> {blackContrast}
            <span className={`ml-2 ${blackLevel === 'Fail' ? 'text-red-500' : 'text-green-500'}`}>
              {blackLevel}
            </span>
          </div>
        </div>
      </div>
    )
  }

  const harmonyOptions = [
    { value: 'analogous', label: 'Analogous', icon: Circle },
    { value: 'complementary', label: 'Complementary', icon: Hexagon },
    { value: 'triadic', label: 'Triadic', icon: Triangle },
    { value: 'tetradic', label: 'Tetradic', icon: Square },
  ]

  const getHarmonyDescription = (mode: string) => {
    switch (mode) {
      case 'analogous':
        return "Analogous colors are next to each other on the color wheel, creating a harmonious and cohesive look."
      case 'complementary':
        return "Complementary colors are opposite each other on the color wheel, providing high contrast and visual interest."
      case 'triadic':
        return "Triadic colors are evenly spaced around the color wheel, offering a balanced and vibrant color scheme."
      case 'tetradic':
        return "Tetradic colors use four colors arranged into two complementary pairs, creating a rich and complex palette."
      default:
        return ""
    }
  }

  return (
    <main className="min-h-screen bg-zinc-900 text-zinc-50 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleStartOver}
            className="transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-zinc-500 rounded-lg"
          >
            <svg
              className="w-48 h-auto fill-white"
              viewBox="0 0 2373.19 195.42"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M211.37,145.48h-114.2c-28.23,0-45.6-19-45.6-48.04s17.37-46.96,45.6-46.96h92.56L220.13,2.98H91.47C36.37,2.98,0,41.25,0,98.8s37.73,94.18,94.19,94.18h154.48c-5.02-3.48-9.71-7.42-14.07-11.79-10.12-10.15-17.91-22.17-23.23-35.71Z"/>
              <path d="M371.04,1.63h-56.72c-55.1,0-91.47,38-91.47,96.48,0,17.91,3.67,33.88,10.44,47.37,14.92,29.77,44.89,47.5,83.74,47.5h56.73c55.1,0,91.47-38,91.47-96.49S427.5,1.63,371.04,1.63ZM368.06,145.82h-48.04c-28.23,0-45.6-18.87-45.6-49.06s17.37-47.97,45.6-47.97h48.04c28.23,0,45.6,18.87,45.6,49.05s-17.37,47.98-45.6,47.98Z"/>
              <path d="M679.47,145.48h-120.05c-12.49,0-20.9-8.41-20.9-20.9V2.98h-51.57v129.2c0,36.37,24.42,60.8,60.8,60.8h167.66c-4.38-3.2-8.51-6.76-12.37-10.66-10.33-10.44-18.24-22.85-23.57-36.84Z"/>
              <path d="M839.53,1.63h-56.73c-55.1,0-91.47,38.27-91.47,97.17,0,17.58,3.49,33.31,9.95,46.68,12.39,25.73,35.74,42.75,66.23,47.5,5.75.9,11.76,1.36,18,1.36h56.73c55.1,0,91.47-38.27,91.47-97.17S895.98,1.63,839.53,1.63ZM849.03,145.48c-3.88.9-8.05,1.36-12.49,1.36h-48.04c-4.41,0-8.55-.46-12.41-1.36-20.82-4.86-33.19-22.39-33.19-48.04,0-29.59,17.37-48.31,45.6-48.31h48.04c28.23,0,45.6,19,45.6,49.39,0,24.93-12.33,42.16-33.11,46.96Z"/>
              <path d="M1176.91,72.47c0-43.97-28.23-69.49-70.57-69.49h-148.2v190h51.57V50.48h92.29c13.84,0,23.34,9.5,23.34,23.89s-9.5,23.61-23.34,23.61h-54.83l-31.76,47.5h73.56l33.11,47.5h60.53l-44.78-63.51c24.7-7.06,39.08-25.79,39.08-57Z"/>
              <path d="M1381.57,50.48h-23.61l-31.76,47.5h50.76c14.11,0,23.61,9.5,23.61,23.62s-9.5,23.88-23.61,23.88h-82.25l-30.4,47.5h117.26c42.34,0,70.57-28.23,70.57-70.57v-1.36c0-42.34-28.23-70.57-70.57-70.57Z"/>
              <path d="M1251.56,74.37c0-14.39,9.5-23.89,23.61-23.89h82.51l30.4-47.5h-117.25c-42.34,0-70.57,28.23-70.57,70.57v1.36c0,42.34,28.23,70.57,70.57,70.57h23.61l31.76-47.5h-51.03c-14.11,0-23.61-9.5-23.61-23.61Z"/>
              <path d="M1558.27,85.77l-59.98-82.79h-65.14l99.34,129.47v60.53h51.57v-60.53l99.34-129.47h-65.14l-59.99,82.79Z"/>
              <path d="M1811.52,28.5c-12.22-17.1-34.47-28.5-56.46-28.5-39.63,0-66.23,26.6-66.23,66.23v126.75h51.57V61.61c0-8.41,5.7-14.11,14.39-14.11,5.16,0,10.31,2.71,13.57,6.78l32.84,43.43h59.72l-49.4-69.21Z"/>
              <path d="M1862,2.98v130.83c0,8.41-5.7,14.11-14.11,14.11-5.16,0-10.86-2.71-13.84-6.78l-32.85-43.43h-59.71l49.4,69.21c12.21,17.1,34.47,28.5,55.37,28.5,40.71,0,67.31-26.32,67.31-66.22V2.98H1862Z"/>
              <path d="M1933.57,50.48h91.56V193h51.57V50.48h77v-47.5H1933.57v47.5Z"/>
              <path d="M2173.69,3v47.5V193h51.57V3h-51.57Z"/>
              <path d="M2321.62,3v75.46h-60.53l-30.4,47.5h90.93V193h51.57V3h-51.57Z"/>
            </svg>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {currentScreen === 'initial' && (
            <motion.div
              key="initial"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-zinc-800 border-zinc-700 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex-grow">
                      <Label htmlFor="colorInput" className="block text-sm font-medium mb-2">Enter HEX Color Code</Label>
                      <Input
                        id="colorInput"
                        type="text"
                        placeholder="e.g. #3498db"
                        value={baseColor}
                        onChange={handleColorInput}
                        className="w-full bg-zinc-700 border-zinc-600 text-zinc-100"
                        aria-describedby="colorInputHelp"
                      />
                      <p id="colorInputHelp" className="mt-1 text-sm text-zinc-400">Enter a valid HEX color code, for example #FF0000 for red.</p>
                    </div>
                    <div className="relative">
                      <Label htmlFor="colorPicker" className="sr-only">Choose Color</Label>
                      <div className="w-16 h-16 rounded-full overflow-hidden">
                        <Input
                          id="colorPicker"
                          type="color"
                          value={baseColor}
                          onChange={handleColorPicker}
                          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div 
                          className="w-full h-full"
                          style={{ backgroundColor: baseColor }}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className="h-32 rounded-lg mb-4 transition-colors duration-200 ease-in-out"
                    style={{ backgroundColor: chroma.valid(baseColor) ? baseColor : '#ccc' }}
                    aria-label={`Color preview: ${getUniqueColorName(baseColor)}`}
                  />
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-medium">{getUniqueColorName(baseColor)}</span>
                    <span className="text-zinc-400">{baseColor}</span>
                  </div>
                  <AccessibilityInfo backgroundColor={baseColor} />
                  <Button
                    onClick={handleGenerate}
                    className="w-full mt-6 bg-zinc-50 text-zinc-900 hover:bg-zinc-200 focus:ring-2 focus:ring-zinc-600 focus:outline-none transition-colors"
                    disabled={!chroma.valid(baseColor)}
                  >
                    <Palette className="mr-2 h-4 w-4" /> Generate Palette
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentScreen === 'generated' && (
            <motion.div
              key="generated"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-zinc-800 border-zinc-700 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Generated Palette</h2>
                    <Button variant="outline" size="sm" onClick={handleStartOver}>
                      Start Over
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {palette.map((color, index) => (
                      <TooltipProvider key={index}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.2, delay: index * 0.05 }}
                            >
                              <Card 
                                className="overflow-hidden transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-zinc-600 cursor-pointer relative" 
                                onClick={() => copyToClipboard(color)}
                              >
                                <CardContent className="p-0">
                                  <div
                                    className="h-24"
                                    style={{ backgroundColor: color }}
                                  />
                                  <div className="p-3 bg-zinc-900">
                                    <div className="font-medium">{getUniqueColorName(color)}</div>
                                    <div className="text-sm text-zinc-400">{color}</div>
                                    <AccessibilityInfo backgroundColor={color} />
                                  </div>
                                  {copiedColor === color && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                      <Check className="text-white h-8 w-8" />
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            </motion.div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Click to copy color</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                  <div className="mb-6">
                    <Label htmlFor="paletteSize" className="block text-sm font-medium mb-2">Palette Size: {paletteSize}</Label>
                    <Slider
                      id="paletteSize"
                      min={3}
                      max={10}
                      step={1}
                      value={[paletteSize]}
                      onValueChange={(value) => setPaletteSize(value[0])}
                      className="w-full"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={handleRandomize}
                      className="w-full sm:w-auto bg-zinc-700 hover:bg-zinc-600 text-zinc-100 border-zinc-600 focus:ring-2 focus:ring-zinc-500 focus:outline-none transition-colors"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" /> Randomize
                    </Button>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                      <Button 
                        onClick={() => downloadPalette('svg')} 
                        className="w-full sm:w-auto bg-zinc-50 text-zinc-900 hover:bg-zinc-200 focus:ring-2 focus:ring-zinc-600 focus:outline-none transition-colors"
                      >
                        <Download className="mr-2 h-4 w-4" /> Download SVG
                      </Button>
                      <Button 
                        onClick={() => downloadPalette('png')} 
                        className="w-full sm:w-auto bg-zinc-50 text-zinc-900 hover:bg-zinc-200 focus:ring-2 focus:ring-zinc-600 focus:outline-none transition-colors"
                      >
                        <Download className="mr-2 h-4 w-4" /> Download PNG
                      </Button>
                    </div>
                  </div>
                  <div className="mb-8">
                    <Label htmlFor="harmonySelect" className="block text-lg font-semibold mb-4">Explore Harmonies</Label>
                    <Select value={harmonyMode} onValueChange={setHarmonyMode}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select harmony" />
                      </SelectTrigger>
                      <SelectContent>
                        {harmonyOptions.map(({ value, label, icon: Icon }) => (
                          <SelectItem key={value} value={value}>
                            <div className="flex items-center">
                              <Icon className="mr-2 h-4 w-4" />
                              <span>{label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="mt-4 p-4 bg-zinc-700 rounded-lg text-sm">
                      {getHarmonyDescription(harmonyMode)}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {harmonyPalette.map((color, index) => (
                      <TooltipProvider key={index}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.2, delay: index * 0.05 }}
                            >
                              <Card 
                                className="overflow-hidden transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-zinc-600 cursor-pointer relative" 
                                onClick={() => copyToClipboard(color)}
                              >
                                <CardContent className="p-0">
                                  <div
                                    className="h-24 sm:h-32"
                                    style={{ backgroundColor: color }}
                                  />
                                  <div className="p-2 sm:p-3 bg-zinc-900">
                                    <div className="text-xs sm:text-sm font-medium">{getUniqueColorName(color)}</div>
                                    <div className="text-xs text-zinc-400">{color}</div>
                                  </div>
                                  {copiedColor === color && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                      <Check className="text-white h-6 w-6" />
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            </motion.div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Click to copy color</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <footer className="mt-8 text-center">
        <p className="text-sm text-zinc-400">Created by Drewskii</p>
        <a
          href="https://x.com/drewskii_xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium mt-2 px-4 py-2 bg-zinc-50 text-zinc-900 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-colors"
        >
          Connect on X
        </a>
      </footer>
    </main>
  )
}
=======

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Wand2 } from "lucide-react"
import namer from 'color-namer'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from "lucide-react"
import React from 'react';
import { ChromePicker } from 'react-color';

function isValidHex(hex: string) {
  return /^#[0-9A-F]{6}$/i.test(hex)
}

const ColorPicker = () => {
  const [color, setColor] = useState('#3498db');
  const [colorName, setColorName] = useState('Curious Blue');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleColorChange = (newColor: { hex: any }) => {
    const newColorValue = newColor.hex.toUpperCase();
    setColor(newColorValue);
    
    if (isValidHex(newColorValue)) {
      setColorName(namer(newColorValue).ntc[0].name);
      setError('');
    } else {
      setColorName('');
      setError('Please enter a valid hex color code');
    }
  };

  const handleGeneratePalette = () => {
    if (isValidHex(color)) {
      router.push(`/generated-palette?color=${encodeURIComponent(color)}`);
    } else {
      setError('Please enter a valid hex color code');
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#18181B] bg-gradient-to-b from-[#18181B] to-[#18181B] py-20 px-4 flex flex-col items-center justify-start">
      <div className="w-full max-w-[840px] flex flex-col items-center gap-6">
        {/* Logo and header section */}
        <div className="flex flex-col items-center gap-4 relative w-full mb-6">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer w-full max-w-[480px]"
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
        </div>

        <Card className="w-full bg-[#1B1B1B] border-[#3C3C3C] shadow-lg transition-all duration-300 ease-in-out">
          <CardContent className="p-6 flex flex-col items-center gap-8">
            <div className="text-center">
              <h2 className="text-[#F2F7F2] text-xl font-bold mb-1.5">Enter Hex Color Code</h2>
              <p className="text-[#A5A8A5] text-md">
                Enter a valid HEX Color Code, for example #FF0000 for Red.
              </p>
            </div>

            <div className="w-full p-5 border border-[#4E4E4E] rounded-md flex flex-col gap-4">
              <div className="flex items-center gap-2 ">
                <Input
                  type="text"
                  value={color}
                  onChange={(e) => handleColorChange({ hex: e.target.value.toUpperCase() })}
                  className="w-full h-10 bg-[#F2F7F2] text-[#A5A8A5] text-lg border-[#4E4E4E] border-r-1 transition-all duration-300 ease-in-out"
                />
                <div className="relative w-24 h-10 group">
                  <Input
                    type="color"
                    value={color}
                    onChange={(e) => handleColorChange({ hex: e.target.value.toUpperCase() })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div 
                    className="w-full h-10 rounded-md border-2 border-[#4E4E4E] shadow-md overflow-hidden transition-all duration-200 ease-in-out group-hover:scale-110"
                    style={{ backgroundColor: color }}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-transparent to-black opacity-30"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 3V21M21 12H3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="absolute top-full left-0 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <ChromePicker color={color} onChange={handleColorChange} />
                  </div>
                </div>
              </div>
              <div 
                className="w-full h-24 rounded-md border-[#4E4E4E] bg-opacity-5 transition-all duration-300 ease-in-out"
                style={{ backgroundColor: isValidHex(color) ? color : '#F2F7F2' }}
              ></div>
              <div className="flex justify-center items-center gap-2">
                <span className="text-[#FAFAFA] text-md font-bold">{colorName || 'Invalid Color'}</span>
                <span className="text-[#A1A1AA] text-md">{isValidHex(color) ? color : 'Invalid'}</span>
              </div>
              {error && <p className="text-red-500 text-md text-center">{error}</p>}
            </div>

            <Button 
              className="w-800 h-12 bg-[#6366F1] hover:bg-[#6366F1]/90 text-[#F2F7F2] text-lg font-bold transition-all duration-300 ease-in-out"
              onClick={handleGeneratePalette}
              disabled={!isValidHex(color)}
            >
              Generate Palette
              <Wand2 className="ml-2 h-5 w-5" />
            </Button>
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

export default ColorPicker;
>>>>>>> 88d5a49 (Update generated-palette page and improve UI interactions)
