import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Modal from 'react-modal'
import './styles/globals.css'
import App from './App.tsx'
import { LocaleProvider } from './context/LocaleContext.tsx'

Modal.setAppElement('#root')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocaleProvider>
      <App />
    </LocaleProvider>
  </StrictMode>,
)
