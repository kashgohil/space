export type Part = {
  id: string
  name: string
  stats: Partial<{ maxThrust: number; maxAngularAccel: number; linearDamping: number; maxSpeed: number }>
}

export const PARTS: Part[] = [
  {
    id: 'thruster-mk1',
    name: 'Thruster Mk I',
    stats: { maxThrust: 4, maxSpeed: 6 },
  },
  {
    id: 'thruster-mk2',
    name: 'Thruster Mk II',
    stats: { maxThrust: 8, maxSpeed: 12 },
  },
  {
    id: 'gyro-core',
    name: 'Gyro Core',
    stats: { maxAngularAccel: 0.8 },
  },
  {
    id: 'shield-array',
    name: 'Shield Array',
    stats: { linearDamping: 0.08 },
  },
  {
    id: 'plasma-nozzle',
    name: 'Plasma Nozzle',
    stats: { maxThrust: 5, maxSpeed: 8 },
  },
]

export function getPartById(id: string) {
  return PARTS.find((part) => part.id === id)
}
