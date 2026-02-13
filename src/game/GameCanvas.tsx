import { Canvas } from '@react-three/fiber'
import { CameraRig } from './components/CameraRig'
import { GameRuntime } from './components/GameRuntime'
import { PlanetScene } from './components/PlanetScene'
import { SpaceScene } from './components/SpaceScene'
import { useGameStore } from './hooks/useGameStore'

export function GameCanvas() {
  const snapshot = useGameStore()

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ fov: 60, near: 0.1, far: 1200, position: [0, 2.2, 6] }}
    >
      <color attach="background" args={['#05070f']} />
      <fog attach="fog" args={['#05070f', 40, 250]} />
      {snapshot.mode === 'space' ? <SpaceScene /> : <PlanetScene />}
      {snapshot.mode === 'space' ? <CameraRig /> : null}
      <GameRuntime />
    </Canvas>
  )
}
