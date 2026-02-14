import { MeshStandardMaterial } from 'three'
import { useMemo } from 'react'
import { useGameStore } from '../hooks/useGameStore'
import { getPartById } from '../parts'

const hullMaterial = new MeshStandardMaterial({
  color: '#c3c7d1',
  metalness: 0.8,
  roughness: 0.3,
})

const panelMaterial = new MeshStandardMaterial({
  color: '#7a8794',
  metalness: 0.6,
  roughness: 0.45,
})

const accentMaterial = new MeshStandardMaterial({
  color: '#2f7adf',
  metalness: 0.5,
  roughness: 0.4,
  emissive: '#0f2550',
  emissiveIntensity: 0.6,
})

const partMaterial = new MeshStandardMaterial({
  color: '#a7b3c5',
  metalness: 0.7,
  roughness: 0.35,
})

const emissivePartMaterial = new MeshStandardMaterial({
  color: '#4f9dff',
  metalness: 0.3,
  roughness: 0.4,
  emissive: '#2f7adf',
  emissiveIntensity: 0.9,
})

const socketPositions = {
  engine: [0, 0, -1.8],
  core: [0, 0.2, 0.4],
  leftWing: [-1.6, 0, -0.2],
  rightWing: [1.6, 0, -0.2],
} as const

export function Ship() {
  const snapshot = useGameStore()

  const equippedVisuals = useMemo(() => {
    return snapshot.equippedParts.map((partId, index) => {
      const part = getPartById(partId)
      if (!part) return null
      const base = socketPositions[part.socket]
      const offset = (index % 3) * 0.15
      return {
        id: `${partId}-${index}`,
        visual: part.visual,
        socket: part.socket,
        position: [base[0], base[1] + offset, base[2]] as [number, number, number],
      }
    })
  }, [snapshot.equippedParts])

  return (
    <group>
      <mesh material={hullMaterial} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.4, 3]} />
      </mesh>
      <mesh material={panelMaterial} position={[0, 0.28, 0.4]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.2, 1]} />
      </mesh>
      <mesh material={panelMaterial} position={[0, -0.12, 0.9]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.2, 0.6]} />
      </mesh>
      <mesh material={panelMaterial} position={[0.9, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.08, 1.4]} />
      </mesh>
      <mesh material={panelMaterial} position={[-0.9, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.08, 1.4]} />
      </mesh>
      <mesh material={accentMaterial} position={[0, 0, -1.4]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.35, 0.6, 16]} />
      </mesh>
      {equippedVisuals.map((entry) => {
        if (!entry) return null
        const socketHealth = snapshot.ship.socketHealth[entry.socket]
        const damaged = socketHealth < 40
        const critical = socketHealth < 15
        const material = damaged ? accentMaterial : partMaterial
        const emissiveMaterial = critical ? emissivePartMaterial : partMaterial

        switch (entry.visual) {
          case 'thruster':
            return (
              <mesh key={entry.id} position={entry.position} material={emissiveMaterial}>
                <cylinderGeometry args={[0.25, 0.4, 0.6, 12]} />
              </mesh>
            )
          case 'gyro':
            return (
              <mesh key={entry.id} position={entry.position} material={material}>
                <torusGeometry args={[0.35, 0.08, 12, 24]} />
              </mesh>
            )
          case 'shield':
            return (
              <mesh key={entry.id} position={entry.position} material={material}>
                <boxGeometry args={[0.5, 0.2, 0.9]} />
              </mesh>
            )
          case 'nozzle':
            return (
              <mesh key={entry.id} position={entry.position} material={emissiveMaterial}>
                <coneGeometry args={[0.35, 0.7, 14]} />
              </mesh>
            )
          default:
            return null
        }
      })}
    </group>
  )
}
