// Custom font configuration for Next.js
import localFont from 'next/font/local'

// AdventPro Variable Font
export const adventPro = localFont({
  src: '../public/fonts/AdventPro-VariableFont_wdth,wght.ttf',
  variable: '--font-advent-pro',
  display: 'swap',
})

// Blatant Bold Font
export const blatantBold = localFont({
  src: '../public/fonts/blatant-bold.ttf',
  variable: '--font-blatant-bold',
  display: 'swap',
})

// Jost Variable Font
export const jost = localFont({
  src: '../public/fonts/Jost-VariableFont_wght.ttf',
  variable: '--font-jost',
  display: 'swap',
})

// Libre Bodoni Variable Font
export const libreBodoni = localFont({
  src: '../public/fonts/LibreBodoni-VariableFont_wght.ttf',
  variable: '--font-libre-bodoni',
  display: 'swap',
})

// Literata Variable Font
export const literata = localFont({
  src: '../public/fonts/Literata-VariableFont_opsz,wght.ttf',
  variable: '--font-literata',
  display: 'swap',
})

// Default custom font (you can choose which one to use as primary)
export const customFont = jost
