import { getPartById } from './parts'
import { getState, updateTuning } from './state'

export function applyEquippedParts() {
  const state = getState()
  const base = {
    maxThrust: 18,
    maxAngularAccel: 2.4,
    linearDamping: 0,
    maxSpeed: 0,
  }

  const bonus = {
    maxThrust: 0,
    maxAngularAccel: 0,
    linearDamping: 0,
    maxSpeed: 0,
  }

  for (const partId of state.equippedParts) {
    const part = getPartById(partId)
    if (!part) continue
    if (part.stats.maxThrust) bonus.maxThrust += part.stats.maxThrust
    if (part.stats.maxAngularAccel) bonus.maxAngularAccel += part.stats.maxAngularAccel
    if (part.stats.linearDamping) bonus.linearDamping += part.stats.linearDamping
    if (part.stats.maxSpeed) bonus.maxSpeed += part.stats.maxSpeed
  }

  updateTuning((draft) => {
    draft.maxThrust = base.maxThrust + bonus.maxThrust
    draft.maxAngularAccel = base.maxAngularAccel + bonus.maxAngularAccel
    draft.linearDamping = base.linearDamping + bonus.linearDamping
    draft.maxSpeed = base.maxSpeed + bonus.maxSpeed
  })
}
