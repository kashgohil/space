import { Stars } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { getState } from '../state'
import { ProceduralField } from './ProceduralField'
import { Ship } from './Ship'

function ShipActor() {
  const ref = useRef<THREE.Group>(null)

  useFrame(() => {
    const { ship } = getState()
    if (!ref.current) return

    ref.current.position.set(ship.position[0], ship.position[1], ship.position[2])
    ref.current.rotation.set(ship.rotation[0], ship.rotation[1], ship.rotation[2])
  })

  return (
    <group ref={ref}>
      <Ship />
    </group>
  )
}

export function SpaceScene() {
  return (
    <group>
      <Stars radius={300} depth={60} count={6000} factor={6} saturation={0} fade speed={0.5} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[8, 12, 6]} intensity={1.2} castShadow />
      <pointLight position={[-6, -4, -6]} intensity={0.6} color="#5f86ff" />
      <ProceduralField />
      <ShipActor />
    </group>
  )
}
