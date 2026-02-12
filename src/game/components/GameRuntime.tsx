import { useFrame, useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { getState } from '../state'
import { simulate } from '../sim'

const frameStep = 1 / 60

export function GameRuntime() {
  const { invalidate } = useThree()

  useFrame((_state, delta) => {
    simulate(delta)
  })

  useEffect(() => {
    const win = window as typeof window & {
      advanceTime?: (ms: number) => void
      render_game_to_text?: () => string
    }

    win.advanceTime = (ms: number) => {
      const steps = Math.max(1, Math.round(ms / (frameStep * 1000)))
      for (let i = 0; i < steps; i += 1) simulate(frameStep)
      invalidate()
    }

    win.render_game_to_text = () => {
      const state = getState()
      return JSON.stringify({
        coordinateSystem: 'Right-handed. Origin at scene center. +X right, +Y up, +Z forward.',
        mode: state.mode,
        cameraMode: state.cameraMode,
        ship: {
          position: state.ship.position,
          worldPosition: state.ship.worldPosition,
          rotation: state.ship.rotation,
          velocity: state.ship.velocity,
          angularVelocity: state.ship.angularVelocity,
          health: state.ship.health,
        },
        throttle: state.throttle,
        worldOffset: state.worldOffset,
        sectorSize: state.sectorSize,
        sectorRadius: state.sectorRadius,
        time: state.time,
      })
    }

    return () => {
      delete win.advanceTime
      delete win.render_game_to_text
    }
  }, [invalidate])

  return null
}
