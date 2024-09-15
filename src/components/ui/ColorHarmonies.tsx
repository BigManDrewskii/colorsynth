import { useState } from 'react'
import chroma from 'chroma-js'
import namer from 'color-namer'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'

type HarmonyType = 'analogous' | 'complementary' | 'triadic' | 'tetradic'

export default function ColorHarmonies({ baseColor }: { baseColor: string }) {
  const [harmonyType, setHarmonyType] = useState<HarmonyType>('analogous')

  const generateHarmony = (type: HarmonyType) => {
    const base = chroma(baseColor)
    switch (type) {
      case 'analogous':
        return [base.set('hsl.h', '-30'), base, base.set('hsl.h', '+30')]
      case 'complementary':
        return [base, base.set('hsl.h', '+180')]
      case 'triadic':
        return [base, base.set('hsl.h', '+120'), base.set('hsl.h', '+240')]
      case 'tetradic':
        return [base, base.set('hsl.h', '+90'), base.set('hsl.h', '+180'), base.set('hsl.h', '+270')]
    }
  }

  const harmony = generateHarmony(harmonyType)

  return (
    <Card className="mt-8 w-full max-w-4xl bg-[#252525] text-white">
      <CardContent className="p-6">
        <h2 className="mb-4 text-2xl font-semibold">Explore Harmonies</h2>
        <Select onValueChange={(value: string) => setHarmonyType(value as HarmonyType)}>
          <SelectTrigger className="mb-4 w-[180px] bg-[#333333] text-white">
            <SelectValue placeholder="Select harmony" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="analogous">Analogous</SelectItem>
            <SelectItem value="complementary">Complementary</SelectItem>
            <SelectItem value="triadic">Triadic</SelectItem>
            <SelectItem value="tetradic">Tetradic</SelectItem>
          </SelectContent>
        </Select>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {harmony.map((color, index) => (
            <div key={index} className="rounded-md bg-[#333333] p-4">
              <div
                className="mb-2 h-20 w-full rounded-md"
                style={{ backgroundColor: color.hex() }}
              ></div>
              <p className="mb-1 font-semibold">{namer(color.hex()).ntc[0].name}</p>
              <p className="text-sm">{color.hex()}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}