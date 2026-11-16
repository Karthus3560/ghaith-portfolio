import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/instrument-serif/400-italic.css'
import '@fontsource-variable/manrope'
import '@fontsource/ibm-plex-sans-arabic/400.css'
import '@fontsource/ibm-plex-sans-arabic/600.css'
import '@fontsource/ibm-plex-sans-arabic/700.css'
import './game.css'
import Game from './Game.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Game />
  </StrictMode>,
)
