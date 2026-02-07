import { MeshStandardMaterial } from 'three'

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

export function Ship() {
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
    </group>
  )
}
