import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './components/App'
import { Toaster } from './components/ui/sonner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster/>
  </StrictMode>,
)
