import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/instrument-serif/400.css'
import '@fontsource-variable/manrope'
import '@fontsource/ibm-plex-sans-arabic/400.css'
import '@fontsource/ibm-plex-sans-arabic/600.css'
import '@fontsource/amiri/400.css'
import '@fontsource/amiri/700.css'
import './pro.css'
import Pro from './Pro.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Pro />
  </StrictMode>,
)
