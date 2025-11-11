import { Profiler, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Modal from 'react-modal'
import './styles/globals.css'
import App from './App.tsx'
import { LocaleProvider } from './context/LocaleContext.tsx'

interface ProfilerStats {
  renders: number
  mounts: number
}

const profilerStats: ProfilerStats = {
  renders: 0,
  mounts: 0,
}

function handleProfilerRender(
  id: string,
  phase: 'mount' | 'update' | 'nested-update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number,
) {
  profilerStats.renders += 1
  if (phase === 'mount') {
    profilerStats.mounts += 1
  }

  console.info(`[Profiler:${id}] phase=${phase} actual=${actualDuration.toFixed(2)}ms base=${baseDuration.toFixed(2)}ms start=${startTime.toFixed(2)}ms commit=${commitTime.toFixed(2)}ms renders=${profilerStats.renders} mounts=${profilerStats.mounts}`)
}

Modal.setAppElement('#root')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Profiler id="AppShell" onRender={handleProfilerRender}>
      <LocaleProvider>
        <App />
      </LocaleProvider>
    </Profiler>
  </StrictMode>,
)
