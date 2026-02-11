import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useGameStore } from '../hooks/useGameStore'
import { getNearbySectors } from '../procedural'

export function ProceduralField() {
  const snapshot = useGameStore()
  const meshRef = useRef<THREE.InstancedMesh>(null)

  const asteroids = useMemo(() => {
    const sectors = getNearbySectors(
      snapshot.ship.worldPosition,
      snapshot.sectorSize,
      snapshot.sectorRadius,
    )

    return sectors.flatMap((sector) =>
      sector.asteroids.map((asteroid) => ({
        position: [
          asteroid.position[0] - snapshot.worldOffset[0],
          asteroid.position[1] - snapshot.worldOffset[1],
          asteroid.position[2] - snapshot.worldOffset[2],
        ] as [number, number, number],
        scale: asteroid.scale,
      })),
    )
  }, [
    snapshot.ship.worldPosition,
    snapshot.sectorRadius,
    snapshot.sectorSize,
    snapshot.worldOffset,
  ])

  useLayoutEffect(() => {
    if (!meshRef.current) return
    const mesh = meshRef.current
    const matrix = new THREE.Matrix4()
    const position = new THREE.Vector3()
    const scale = new THREE.Vector3()
    const rotation = new THREE.Quaternion()

    asteroids.forEach((asteroid, index) => {
      position.set(asteroid.position[0], asteroid.position[1], asteroid.position[2])
      scale.set(asteroid.scale, asteroid.scale, asteroid.scale)
      matrix.compose(position, rotation, scale)
      mesh.setMatrixAt(index, matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  }, [asteroids])

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, asteroids.length]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#6f7787" metalness={0.25} roughness={0.8} />
    </instancedMesh>
  )
}
