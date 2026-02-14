import { applyEquippedParts } from './applyParts'

export type CameraMode = 'first' | 'third'
export type GameMode = 'space' | 'planet' | 'hangar'

type Vec3 = [number, number, number]

type ShipState = {
  position: Vec3
  worldPosition: Vec3
  rotation: Vec3
  velocity: Vec3
  angularVelocity: Vec3
  health: number
  socketHealth: Record<'engine' | 'core' | 'leftWing' | 'rightWing', number>
}

type LanderState = {
  position: Vec3
  velocity: Vec3
}

type EnemyState = {
  id: string
  worldPosition: Vec3
  velocity: Vec3
  health: number
  fireCooldown: number
}

type ProjectileState = {
  id: string
  owner: 'player' | 'enemy'
  worldPosition: Vec3
  velocity: Vec3
  ttl: number
}

type GameState = {
  mode: GameMode
  cameraMode: CameraMode
  throttle: number
  ship: ShipState
  lander: LanderState
  activePlanetId: string | null
  lootCollected: boolean
  inventory: string[]
  equippedParts: string[]
  enemies: EnemyState[]
  projectiles: ProjectileState[]
  playerFireCooldown: number
  maxThrust: number
  maxAngularAccel: number
  linearDamping: number
  angularDamping: number
  maxSpeed: number
  sectorSize: number
  sectorRadius: number
  worldOffset: Vec3
  floatingOriginThreshold: number
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
    worldPosition: [0, 0, 0],
    rotation: [0, 0, 0],
    velocity: [0, 0, 0],
    angularVelocity: [0, 0, 0],
    health: 100,
    socketHealth: {
      engine: 100,
      core: 100,
      leftWing: 100,
      rightWing: 100,
    },
  },
  lander: {
    position: [0, 0, 6],
    velocity: [0, 0, 0],
  },
  activePlanetId: null,
  lootCollected: false,
  inventory: [],
  equippedParts: [],
  enemies: [
    {
      id: 'drone-1',
      worldPosition: [0, 0, 140],
      velocity: [0, 0, -4],
      health: 100,
      fireCooldown: 0,
    },
  ],
  projectiles: [],
  playerFireCooldown: 0,
  maxThrust: 18,
  maxAngularAccel: 2.4,
  linearDamping: 0,
  angularDamping: 1.2,
  maxSpeed: 0,
  sectorSize: 800,
  sectorRadius: 1,
  worldOffset: [0, 0, 0],
  floatingOriginThreshold: 2000,
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
      worldPosition: [...source.ship.worldPosition] as Vec3,
      rotation: [...source.ship.rotation] as Vec3,
      velocity: [...source.ship.velocity] as Vec3,
      angularVelocity: [...source.ship.angularVelocity] as Vec3,
      socketHealth: { ...source.ship.socketHealth },
    },
    lander: {
      position: [...source.lander.position] as Vec3,
      velocity: [...source.lander.velocity] as Vec3,
    },
    inventory: [...source.inventory],
    equippedParts: [...source.equippedParts],
    enemies: source.enemies.map((enemy) => ({
      ...enemy,
      worldPosition: [...enemy.worldPosition] as Vec3,
      velocity: [...enemy.velocity] as Vec3,
    })),
    projectiles: source.projectiles.map((projectile) => ({
      ...projectile,
      worldPosition: [...projectile.worldPosition] as Vec3,
      velocity: [...projectile.velocity] as Vec3,
    })),
    worldOffset: [...source.worldOffset] as Vec3,
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

export function landOnPlanet(planetId: string) {
  state.mode = 'planet'
  state.activePlanetId = planetId
  state.lander.position = [0, 0, 6]
  state.lander.velocity = [0, 0, 0]
  state.lootCollected = false
  snapshot = createSnapshot(state)
  emit()
}

export function takeOff() {
  state.mode = 'space'
  state.activePlanetId = null
  snapshot = createSnapshot(state)
  emit()
}

export function collectLoot() {
  if (state.lootCollected) return
  state.lootCollected = true
  const partId = pickRandomPart()
  state.inventory.push(partId)
  applyEquippedParts()
  snapshot = createSnapshot(state)
  emit()
}

export function applyDamage(socket: keyof ShipState['socketHealth'], amount: number) {
  const ship = state.ship
  ship.socketHealth[socket] = Math.max(0, ship.socketHealth[socket] - amount)
  ship.health = Math.max(0, ship.health - amount * 0.6)
  snapshot = createSnapshot(state)
  emit()
}

export function repairAll() {
  const ship = state.ship
  ship.health = 100
  ship.socketHealth.engine = 100
  ship.socketHealth.core = 100
  ship.socketHealth.leftWing = 100
  ship.socketHealth.rightWing = 100
  snapshot = createSnapshot(state)
  emit()
}

export function resetCombat() {
  state.enemies = [
    {
      id: `drone-${Date.now()}`,
      worldPosition: [state.ship.worldPosition[0], state.ship.worldPosition[1], state.ship.worldPosition[2] + 180],
      velocity: [0, 0, -4],
      health: 100,
      fireCooldown: 0,
    },
  ]
  state.projectiles = []
  state.playerFireCooldown = 0
  snapshot = createSnapshot(state)
  emit()
}

export function equipPart(partId: string) {
  if (!state.inventory.includes(partId)) return
  if (state.equippedParts.includes(partId)) return
  state.equippedParts.push(partId)
  applyEquippedParts()
  snapshot = createSnapshot(state)
  emit()
}

export function unequipPart(partId: string) {
  state.equippedParts = state.equippedParts.filter((id) => id !== partId)
  applyEquippedParts()
  snapshot = createSnapshot(state)
  emit()
}

function pickRandomPart() {
  const parts = ['thruster-mk1', 'thruster-mk2', 'gyro-core', 'shield-array', 'plasma-nozzle'] as const
  const index = Math.floor(Math.random() * parts.length)
  return parts[index]
}
