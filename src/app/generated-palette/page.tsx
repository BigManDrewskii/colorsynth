import dynamic from 'next/dynamic'

const GeneratedPaletteClient = dynamic(
  () => import('./GeneratedPaletteClient'),
  { ssr: false }
)

export default function GeneratedPalettePage() {
  return <GeneratedPaletteClient />
}