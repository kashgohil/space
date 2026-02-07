import { useEffect } from 'react'
import './App.css'
import { GameCanvas } from './game/GameCanvas'
import { toggleCameraMode } from './game/state'
import { useGameStore } from './game/hooks/useGameStore'

function App() {
  const snapshot = useGameStore()

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return

      if (event.key.toLowerCase() === 'c') {
        toggleCameraMode()
      }

      if (event.key.toLowerCase() === 'f') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {})
        } else {
          document.exitFullscreen().catch(() => {})
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className="app">
      <header className="hud">
        <div className="hud__title">Project: Starforged</div>
        <div className="hud__row">
          <span>Mode: {snapshot.mode}</span>
          <span>Camera: {snapshot.cameraMode}</span>
          <span>Ship Integrity: {snapshot.ship.health}%</span>
        </div>
        <div className="hud__row hud__row--muted">
          <span>`C` toggle camera</span>
          <span>`F` fullscreen</span>
        </div>
      </header>
      <main className="viewport">
        <GameCanvas />
      </main>
    </div>
  )
}

export default App
