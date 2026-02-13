import { deriveStats } from './deriveStats'
import { getState, updateTuning } from './state'

export function applyEquippedParts() {
  const state = getState()
  const { base, bonus } = deriveStats(state.equippedParts)

  updateTuning((draft) => {
    draft.maxThrust = base.maxThrust + bonus.maxThrust
    draft.maxAngularAccel = base.maxAngularAccel + bonus.maxAngularAccel
    draft.linearDamping = base.linearDamping + bonus.linearDamping
    draft.maxSpeed = base.maxSpeed + bonus.maxSpeed
  })
}
