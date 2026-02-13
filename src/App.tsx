import { useEffect, useMemo } from 'react'
import './App.css'
import { GameCanvas } from './game/GameCanvas'
import { resetInput, setKeyState } from './game/input'
import { TuningPanel } from './game/components/TuningPanel'
import { LOOT_POSITION, LOOT_RADIUS } from './game/planet'
import { HangarPanel } from './game/components/HangarPanel'
import { collectLoot, landOnPlanet, setMode, takeOff, toggleCameraMode } from './game/state'
import { useGameStore } from './game/hooks/useGameStore'
import { getNearbyPOIs } from './game/procedural'

function App() {
  const snapshot = useGameStore()
  const speed = Math.hypot(
    snapshot.ship.velocity[0],
    snapshot.ship.velocity[1],
    snapshot.ship.velocity[2],
  )
  const distance = Math.hypot(
    snapshot.ship.worldPosition[0],
    snapshot.ship.worldPosition[1],
    snapshot.ship.worldPosition[2],
  )
  const sector = [
    Math.floor(snapshot.ship.worldPosition[0] / snapshot.sectorSize),
    Math.floor(snapshot.ship.worldPosition[1] / snapshot.sectorSize),
    Math.floor(snapshot.ship.worldPosition[2] / snapshot.sectorSize),
  ]

  const nearestPoi = useMemo(() => {
    const pois = getNearbyPOIs(snapshot.ship.worldPosition, snapshot.sectorSize, snapshot.sectorRadius)
    if (!pois.length) return null

    let best = null as null | { kind: string; distance: number }
    for (const poi of pois) {
      const dx = poi.position[0] - snapshot.ship.worldPosition[0]
      const dy = poi.position[1] - snapshot.ship.worldPosition[1]
      const dz = poi.position[2] - snapshot.ship.worldPosition[2]
      const d = Math.hypot(dx, dy, dz)
      if (!best || d < best.distance) best = { kind: poi.kind, distance: d }
    }
    return best
  }, [snapshot.ship.worldPosition, snapshot.sectorRadius, snapshot.sectorSize])

  const canLand = nearestPoi && nearestPoi.kind === 'planet' && nearestPoi.distance < 140
  const lootDistance = Math.hypot(
    snapshot.lander.position[0] - LOOT_POSITION[0],
    snapshot.lander.position[1] - LOOT_POSITION[1],
    snapshot.lander.position[2] - LOOT_POSITION[2],
  )
  const canCollectLoot = snapshot.mode === 'planet' && !snapshot.lootCollected && lootDistance < LOOT_RADIUS

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return
      setKeyState(event.code, true)

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

      if (event.code === 'KeyL') {
        if (snapshot.mode === 'space' && canLand) {
          landOnPlanet('planet')
        } else if (snapshot.mode === 'planet') {
          takeOff()
        }
      }

      if (event.code === 'KeyE' && canCollectLoot) {
        collectLoot()
      }

      if (event.code === 'KeyH') {
        setMode(snapshot.mode === 'hangar' ? 'space' : 'hangar')
      }
    }

    const onKeyUp = (event: KeyboardEvent) => {
      setKeyState(event.code, false)
    }

    const onBlur = () => resetInput()

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
    }
  }, [])

  return (
    <div className="app">
      <TuningPanel />
      <header className="hud">
        <div className="hud__title">Project: Starforged</div>
        <div className="hud__row">
          <span>Mode: {snapshot.mode}</span>
          <span>Camera: {snapshot.cameraMode}</span>
          <span>Ship Integrity: {snapshot.ship.health}%</span>
          <span>Speed: {speed.toFixed(1)} m/s</span>
          <span>Throttle: {(snapshot.throttle * 100).toFixed(0)}%</span>
          <span>Distance: {distance.toFixed(0)} m</span>
          <span>
            Sector: {sector[0]}, {sector[1]}, {sector[2]}
          </span>
          <span>
            Nearest POI:{' '}
            {nearestPoi ? `${nearestPoi.kind} (${nearestPoi.distance.toFixed(0)} m)` : 'none'}
          </span>
        </div>
        <div className="hud__row hud__row--muted">
          <span>`W/S` pitch</span>
          <span>`A/D` yaw</span>
          <span>`Q/E` roll</span>
          <span>`Shift/Ctrl` throttle</span>
          <span>`Space` brake</span>
          <span>`C` camera</span>
          <span>`F` fullscreen</span>
          {snapshot.mode === 'space' ? <span>`L` land</span> : <span>`L` take off</span>}
          {snapshot.mode === 'planet' ? <span>`WASD` move</span> : null}
          {canCollectLoot ? <span>`E` collect part</span> : null}
          <span>`H` hangar</span>
          {canLand ? <span>Landing window</span> : null}
          {snapshot.mode === 'planet' && snapshot.lootCollected ? (
            <span>Part acquired</span>
          ) : null}
        </div>
      </header>
      <main className="viewport">
        <GameCanvas />
      </main>
      <HangarPanel />
    </div>
  )
}

export default App
