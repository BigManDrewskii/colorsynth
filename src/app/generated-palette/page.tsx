import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import ErrorBoundary from '@/components/ErrorBoundary'

const GeneratedPaletteClient = dynamic(() => import('./GeneratedPaletteClient'), {
  ssr: false,
})

export default function GeneratedPalettePage() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong. Please try again later.</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <GeneratedPaletteClient />
      </Suspense>
    </ErrorBoundary>
  )
}