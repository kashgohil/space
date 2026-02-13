import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useGameStore } from '../hooks/useGameStore'
import { LOOT_POSITION } from '../planet'

function Lander() {
  const ref = useRef<THREE.Group>(null)
  const snapshot = useGameStore()

  useFrame(() => {
    if (!ref.current) return
    ref.current.position.set(
      snapshot.lander.position[0],
      snapshot.lander.position[1],
      snapshot.lander.position[2],
    )
  })

  return (
    <group ref={ref}>
      <mesh>
        <capsuleGeometry args={[0.6, 1.2, 8, 16]} />
        <meshStandardMaterial color="#c3cbd8" metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#2f7adf" emissive="#0f2550" emissiveIntensity={0.7} />
      </mesh>
    </group>
  )
}

function PlanetCamera() {
  const snapshot = useGameStore()
  const cameraTarget = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ camera }, delta) => {
    cameraTarget.set(
      snapshot.lander.position[0],
      snapshot.lander.position[1],
      snapshot.lander.position[2],
    )

    const desired = new THREE.Vector3(
      snapshot.lander.position[0] + 6,
      snapshot.lander.position[1] + 6,
      snapshot.lander.position[2] + 8,
    )

    const t = 1 - Math.exp(-6 * delta)
    camera.position.lerp(desired, t)
    camera.lookAt(cameraTarget)
  })

  return null
}

export function PlanetScene() {
  return (
    <group>
      <ambientLight intensity={0.4} />
      <directionalLight position={[8, 10, 6]} intensity={1.1} castShadow />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200, 20, 20]} />
        <meshStandardMaterial color="#3a3f4d" metalness={0.1} roughness={0.9} />
      </mesh>
      <mesh position={[0, 6, -20]}>
        <sphereGeometry args={[24, 32, 32]} />
        <meshStandardMaterial color="#1f2a3b" metalness={0.1} roughness={0.85} />
      </mesh>
      <mesh position={LOOT_POSITION}>
        <octahedronGeometry args={[1.4, 0]} />
        <meshStandardMaterial color="#f5d66d" emissive="#d79f2b" emissiveIntensity={0.8} />
      </mesh>
      <Lander />
      <PlanetCamera />
    </group>
  )
}
