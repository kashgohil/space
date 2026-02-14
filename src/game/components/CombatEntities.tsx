import { useMemo } from 'react'
import { useGameStore } from '../hooks/useGameStore'

export function CombatEntities() {
  const snapshot = useGameStore()

  const enemies = useMemo(
    () =>
      snapshot.enemies.map((enemy) => ({
        ...enemy,
        localPosition: [
          enemy.worldPosition[0] - snapshot.worldOffset[0],
          enemy.worldPosition[1] - snapshot.worldOffset[1],
          enemy.worldPosition[2] - snapshot.worldOffset[2],
        ] as [number, number, number],
      })),
    [snapshot.enemies, snapshot.worldOffset],
  )

  const projectiles = useMemo(
    () =>
      snapshot.projectiles.map((projectile) => ({
        ...projectile,
        localPosition: [
          projectile.worldPosition[0] - snapshot.worldOffset[0],
          projectile.worldPosition[1] - snapshot.worldOffset[1],
          projectile.worldPosition[2] - snapshot.worldOffset[2],
        ] as [number, number, number],
      })),
    [snapshot.projectiles, snapshot.worldOffset],
  )

  return (
    <group>
      {enemies.map((enemy) => (
        <mesh key={enemy.id} position={enemy.localPosition}>
          <boxGeometry args={[2.2, 0.6, 2.6]} />
          <meshStandardMaterial color="#e26a6a" metalness={0.4} roughness={0.6} />
        </mesh>
      ))}
      {projectiles.map((projectile) => (
        <mesh key={projectile.id} position={projectile.localPosition}>
          <sphereGeometry args={[0.35, 12, 12]} />
          <meshStandardMaterial
            color={projectile.owner === 'player' ? '#6ad0ff' : '#ff7b6a'}
            emissive={projectile.owner === 'player' ? '#2f7adf' : '#ff5438'}
            emissiveIntensity={0.9}
          />
        </mesh>
      ))}
    </group>
  )
}
