export const downloadSVG = (palette: string[]) => {
    const svgContent = `
      <svg width="600" height="100" xmlns="http://www.w3.org/2000/svg">
        ${palette.map((color, index) => `
          <rect x="${index * 100}" y="0" width="100" height="100" fill="${color}" />
        `).join('')}
      </svg>
    `
    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'palette.svg'
    a.click()
    URL.revokeObjectURL(url)
  }
  
  export const downloadPNG = (palette: string[]) => {
    const canvas = document.createElement('canvas')
    canvas.width = 600
    canvas.height = 100
    const ctx = canvas.getContext('2d')
    if (ctx) {
      palette.forEach((color, index) => {
        ctx.fillStyle = color
        ctx.fillRect(index * 100, 0, 100, 100)
      })
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'palette.png'
          a.click()
          URL.revokeObjectURL(url)
        }
      })
    }
  }