import { Canvas } from '@react-three/fiber'
import { CameraRig } from './components/CameraRig'
import { GameRuntime } from './components/GameRuntime'
import { SpaceScene } from './components/SpaceScene'

export function GameCanvas() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ fov: 60, near: 0.1, far: 1200, position: [0, 2.2, 6] }}
    >
      <color attach="background" args={['#05070f']} />
      <fog attach="fog" args={['#05070f', 40, 250]} />
      <SpaceScene />
      <CameraRig />
      <GameRuntime />
    </Canvas>
  )
}
