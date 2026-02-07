export type CameraMode = 'first' | 'third'
export type GameMode = 'space' | 'planet' | 'hangar'

type Vec3 = [number, number, number]

type ShipState = {
  position: Vec3
  rotation: Vec3
  velocity: Vec3
  angularVelocity: Vec3
  health: number
}

type GameState = {
  mode: GameMode
  cameraMode: CameraMode
  throttle: number
  ship: ShipState
  maxThrust: number
  maxAngularAccel: number
  linearDamping: number
  angularDamping: number
  maxSpeed: number
  cameraFollowSharpnessThird: number
  cameraFollowSharpnessFirst: number
  cameraThirdOffsetUp: number
  cameraThirdOffsetBack: number
  cameraFirstOffsetUp: number
  cameraFirstOffsetForward: number
  time: number
  lastUpdated: number
}

const state: GameState = {
  mode: 'space',
  cameraMode: 'third',
  throttle: 0.15,
  ship: {
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    velocity: [0, 0, 0],
    angularVelocity: [0, 0, 0],
    health: 100,
  },
  maxThrust: 18,
  maxAngularAccel: 2.4,
  linearDamping: 0.28,
  angularDamping: 1.2,
  maxSpeed: 32,
  cameraFollowSharpnessThird: 7,
  cameraFollowSharpnessFirst: 10,
  cameraThirdOffsetUp: 2.2,
  cameraThirdOffsetBack: -6,
  cameraFirstOffsetUp: 0.25,
  cameraFirstOffsetForward: 0.6,
  time: 0,
  lastUpdated: 0,
}

const listeners = new Set<() => void>()

function createSnapshot(source: GameState) {
  return {
    ...source,
    ship: {
      ...source.ship,
      position: [...source.ship.position] as Vec3,
      rotation: [...source.ship.rotation] as Vec3,
      velocity: [...source.ship.velocity] as Vec3,
      angularVelocity: [...source.ship.angularVelocity] as Vec3,
    },
  }
}

let snapshot = createSnapshot(state)

function emit() {
  for (const listener of listeners) listener()
}

export function getState() {
  return state
}

export function getSnapshot() {
  return snapshot
}

export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function setState(updater: (draft: GameState) => void) {
  updater(state)
  snapshot = createSnapshot(state)
  emit()
}

export function toggleCameraMode() {
  state.cameraMode = state.cameraMode === 'third' ? 'first' : 'third'
  emit()
}

export function setMode(mode: GameMode) {
  state.mode = mode
  emit()
}

export function updateTuning(updater: (draft: GameState) => void) {
  updater(state)
  snapshot = createSnapshot(state)
  emit()
}
