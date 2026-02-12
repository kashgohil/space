import { useMemo } from 'react'
import { useGameStore } from '../hooks/useGameStore'
import { getNearbyPOIs, type POI } from '../procedural'

function getPOIColor(kind: POI['kind']) {
  switch (kind) {
    case 'planet':
      return '#3f7ee8'
    case 'station':
      return '#e3c15f'
    case 'derelict':
      return '#7f8b98'
    default:
      return '#ffffff'
  }
}

export function ProceduralPOIs() {
  const snapshot = useGameStore()

  const pois = useMemo(() => {
    const data = getNearbyPOIs(
      snapshot.ship.worldPosition,
      snapshot.sectorSize,
      snapshot.sectorRadius,
    )

    return data.map((poi) => ({
      ...poi,
      localPosition: [
        poi.position[0] - snapshot.worldOffset[0],
        poi.position[1] - snapshot.worldOffset[1],
        poi.position[2] - snapshot.worldOffset[2],
      ] as [number, number, number],
    }))
  }, [
    snapshot.ship.worldPosition,
    snapshot.sectorRadius,
    snapshot.sectorSize,
    snapshot.worldOffset,
  ])

  return (
    <group>
      {pois.map((poi) => {
        const color = getPOIColor(poi.kind)
        return (
          <group key={poi.id} position={poi.localPosition}>
            {poi.kind === 'planet' ? (
              <mesh>
                <sphereGeometry args={[poi.radius, 32, 32]} />
                <meshStandardMaterial color={color} metalness={0.2} roughness={0.7} />
              </mesh>
            ) : null}
            {poi.kind === 'station' ? (
              <group>
                <mesh>
                  <torusGeometry args={[poi.radius * 0.7, poi.radius * 0.1, 16, 48]} />
                  <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
                </mesh>
                <mesh rotation={[0, 0, Math.PI / 2]}>
                  <boxGeometry args={[poi.radius * 0.3, poi.radius * 1.4, poi.radius * 0.3]} />
                  <meshStandardMaterial color="#dfe4ee" metalness={0.5} roughness={0.5} />
                </mesh>
              </group>
            ) : null}
            {poi.kind === 'derelict' ? (
              <mesh>
                <icosahedronGeometry args={[poi.radius * 0.6, 1]} />
                <meshStandardMaterial color={color} metalness={0.2} roughness={0.9} />
              </mesh>
            ) : null}
            <mesh position={[0, poi.radius + 6, 0]}>
              <coneGeometry args={[2.5, 6, 6]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}
