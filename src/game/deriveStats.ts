import { getPartById } from './parts'

export type DerivedStats = {
  base: {
    maxThrust: number
    maxAngularAccel: number
    linearDamping: number
    maxSpeed: number
  }
  bonus: {
    maxThrust: number
    maxAngularAccel: number
    linearDamping: number
    maxSpeed: number
  }
}

const BASE_STATS = {
  maxThrust: 18,
  maxAngularAccel: 2.4,
  linearDamping: 0,
  maxSpeed: 0,
}

export function deriveStats(equippedParts: string[]): DerivedStats {
  const bonus = {
    maxThrust: 0,
    maxAngularAccel: 0,
    linearDamping: 0,
    maxSpeed: 0,
  }

  for (const partId of equippedParts) {
    const part = getPartById(partId)
    if (!part) continue
    if (part.stats.maxThrust) bonus.maxThrust += part.stats.maxThrust
    if (part.stats.maxAngularAccel) bonus.maxAngularAccel += part.stats.maxAngularAccel
    if (part.stats.linearDamping) bonus.linearDamping += part.stats.linearDamping
    if (part.stats.maxSpeed) bonus.maxSpeed += part.stats.maxSpeed
  }

  return { base: BASE_STATS, bonus }
}
