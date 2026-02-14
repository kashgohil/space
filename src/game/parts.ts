export type Part = {
  id: string
  name: string
  socket: 'engine' | 'core' | 'leftWing' | 'rightWing'
  visual: 'thruster' | 'gyro' | 'shield' | 'nozzle'
  stats: Partial<{ maxThrust: number; maxAngularAccel: number; linearDamping: number; maxSpeed: number }>
}

export const PARTS: Part[] = [
  {
    id: 'thruster-mk1',
    name: 'Thruster Mk I',
    socket: 'engine',
    visual: 'thruster',
    stats: { maxThrust: 4, maxSpeed: 6 },
  },
  {
    id: 'thruster-mk2',
    name: 'Thruster Mk II',
    socket: 'engine',
    visual: 'thruster',
    stats: { maxThrust: 8, maxSpeed: 12 },
  },
  {
    id: 'gyro-core',
    name: 'Gyro Core',
    socket: 'core',
    visual: 'gyro',
    stats: { maxAngularAccel: 0.8 },
  },
  {
    id: 'shield-array',
    name: 'Shield Array',
    socket: 'leftWing',
    visual: 'shield',
    stats: { linearDamping: 0.08 },
  },
  {
    id: 'plasma-nozzle',
    name: 'Plasma Nozzle',
    socket: 'rightWing',
    visual: 'nozzle',
    stats: { maxThrust: 5, maxSpeed: 8 },
  },
]

export function getPartById(id: string) {
  return PARTS.find((part) => part.id === id)
}
