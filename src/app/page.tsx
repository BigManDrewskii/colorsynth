'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Wand2 } from "lucide-react"
import namer from 'color-namer'
import Image from 'next/image'
import { motion } from 'framer-motion'
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
  const [showColorPicker, setShowColorPicker] = useState(false)

  const handleColorChange = (newColor: { hex: string }) => {
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
    <main className="min-h-screen w-full bg-[#18181B] bg-gradient-to-b from-[#18181B] to-[#18181B] py-20 px-4 flex flex-col items-center justify-start relative">
      <div className="w-full max-w-[840px] flex flex-col items-center gap-6 relative z-10">
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

        <Card className="w-full bg-[#1B1B1B] border-[#3C3C3C] shadow-lg transition-all duration-300 ease-in-out relative z-10">
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
                  className="w-full h-10 bg-[#F2F7F2] text-[#A5A8A5] text-lg border-[#4E4E4E] border-r- transition-all duration-300 ease-in-out"
                />
                <div className="relative w-24 h-10 group">
                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="w-full h-10 rounded-md border-2 border-[#4E4E4E] shadow-md overflow-hidden transition-all duration-200 ease-in-out group-hover:scale-110"
                    style={{ backgroundColor: color }}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-transparent to-black opacity-30"></div>
                  </button>
                  {showColorPicker && (
                    <div className="absolute top-full left-0 mt-2 z-50">
                      <ChromePicker color={color} onChange={handleColorChange} />
                    </div>
                  )}
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
              className="w-800 h-12 bg-[#6366F1] hover:bg-[#6366F1]/90 text-[#F2F7F2] text-lg font-bold transition-all duration-300 ease-in-out z-20"
              onClick={handleGeneratePalette}
              disabled={!isValidHex(color)}
            >
              Generate Palette
              <Wand2 className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#4E4E4E] border-2 border-[#4E4E4E] overflow-hidden flex-shrink-0">
              <Image 
                src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExb3I5aGp2ZzY1OGE1cTYxOHg0d2hncHBsbHRkeTR1dHhtdHpsMXNuMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3ohzdZO0nAL1H2LdMA/giphy.webp"
                alt="Color Wheel Animation" 
                width={48} 
                height={48} 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-white text-base">Created by Drewskii</span>
          </div>
          <a href="https://x.com/drewskii_xyz" target="_blank" rel="noopener noreferrer" className="mt-3 sm:mt-0">
            <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white z-30">
              Follow @drewskii_xyz
            </Button>
          </a>
        </div>
      </div>
      <div className="w-[424px] h-[424px] rounded-full bg-[#6366F1] opacity-20 blur-[600px] absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-0"></div>
    </main>
  )
}

export default ColorPicker;