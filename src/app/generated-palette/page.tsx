import React, { Suspense } from 'react'
import GeneratedPaletteClient from './GeneratedPaletteClient'

export default function GeneratedPalettePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GeneratedPaletteClient />
    </Suspense>
  )
}