import * as THREE from 'three'
import { getInputAxis, getPlanetInput, isKeyDown } from './input'
import { getState, setState } from './state'
import { LANDER_SPEED } from './planet'

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const projectileSpeed = 70
const projectileTTL = 3.5
const playerFireRate = 0.2
const enemyFireRate = 1.1
const enemySpeed = 12
const enemyRange = 220
const hitRadius = 4

const sockets: Array<keyof ReturnType<typeof getState>['ship']['socketHealth']> = [
  'engine',
  'core',
  'leftWing',
  'rightWing',
]

function pickRandomSocket() {
  const index = Math.floor(Math.random() * sockets.length)
  return sockets[index]
}

function applyDamageToDraft(
  ship: ReturnType<typeof getState>['ship'],
  socket: keyof ReturnType<typeof getState>['ship']['socketHealth'],
  amount: number,
) {
  ship.socketHealth[socket] = Math.max(0, ship.socketHealth[socket] - amount)
  ship.health = Math.max(0, ship.health - amount * 0.6)
}

export function simulate(dt: number) {
  const state = getState()

  setState((draft) => {
    if (draft.mode === 'planet') {
      const input = getPlanetInput()
      const lander = draft.lander
      const speed = LANDER_SPEED * (input.sprint ? 1.5 : 1)

      lander.velocity[0] = input.strafe * speed
      lander.velocity[2] = input.forward * speed

      lander.position[0] += lander.velocity[0] * dt
      lander.position[2] += lander.velocity[2] * dt

      draft.time += dt
      draft.lastUpdated = state.time + dt
      return
    }

    const input = getInputAxis(dt)
    draft.time += dt

    const ship = draft.ship

    const rotationEuler = new THREE.Euler(ship.rotation[0], ship.rotation[1], ship.rotation[2])
    const rotationQuat = new THREE.Quaternion().setFromEuler(rotationEuler)
    const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(rotationQuat)

    const thrust = draft.maxThrust * input.throttle
    const acceleration = forward.multiplyScalar(thrust)

    ship.velocity[0] += acceleration.x * dt
    ship.velocity[1] += acceleration.y * dt
    ship.velocity[2] += acceleration.z * dt

    if (input.brake) {
      const brakeStrength = Math.min(1, 5 * dt)
      ship.velocity[0] -= ship.velocity[0] * brakeStrength
      ship.velocity[1] -= ship.velocity[1] * brakeStrength
      ship.velocity[2] -= ship.velocity[2] * brakeStrength
    }

    if (draft.maxSpeed > 0) {
      const speed = Math.hypot(ship.velocity[0], ship.velocity[1], ship.velocity[2])
      if (speed > draft.maxSpeed) {
        const scale = draft.maxSpeed / speed
        ship.velocity[0] *= scale
        ship.velocity[1] *= scale
        ship.velocity[2] *= scale
      }
    }

    const angularAccel = draft.maxAngularAccel
    ship.angularVelocity[0] += input.pitch * angularAccel * dt
    ship.angularVelocity[1] += input.yaw * angularAccel * dt
    ship.angularVelocity[2] += input.roll * angularAccel * dt

    ship.rotation[1] += ship.angularVelocity[1] * dt
    ship.rotation[0] += ship.angularVelocity[0] * dt
    ship.rotation[2] += ship.angularVelocity[2] * dt

    ship.worldPosition[0] += ship.velocity[0] * dt
    ship.worldPosition[1] += ship.velocity[1] * dt
    ship.worldPosition[2] += ship.velocity[2] * dt

    ship.position[0] = ship.worldPosition[0] - draft.worldOffset[0]
    ship.position[1] = ship.worldPosition[1] - draft.worldOffset[1]
    ship.position[2] = ship.worldPosition[2] - draft.worldOffset[2]

    const localDistance = Math.hypot(ship.position[0], ship.position[1], ship.position[2])
    if (localDistance > draft.floatingOriginThreshold) {
      draft.worldOffset[0] += ship.position[0]
      draft.worldOffset[1] += ship.position[1]
      draft.worldOffset[2] += ship.position[2]

      ship.position[0] = 0
      ship.position[1] = 0
      ship.position[2] = 0
    }

    if (draft.linearDamping > 0) {
      const linearDamping = Math.exp(-draft.linearDamping * dt)
      ship.velocity[0] *= linearDamping
      ship.velocity[1] *= linearDamping
      ship.velocity[2] *= linearDamping
    }

    const angularDamping = Math.exp(-draft.angularDamping * dt)
    ship.angularVelocity[0] *= angularDamping
    ship.angularVelocity[1] *= angularDamping
    ship.angularVelocity[2] *= angularDamping

    draft.throttle = input.throttle
    ship.rotation[0] = clamp(ship.rotation[0], -Math.PI, Math.PI)
    ship.rotation[1] = clamp(ship.rotation[1], -Math.PI, Math.PI)
    ship.rotation[2] = clamp(ship.rotation[2], -Math.PI, Math.PI)

    if (draft.playerFireCooldown > 0) draft.playerFireCooldown -= dt
    if (isKeyDown('KeyX') && draft.playerFireCooldown <= 0) {
      draft.playerFireCooldown = playerFireRate
      draft.projectiles.push({
        id: `p-${draft.time.toFixed(2)}-${draft.projectiles.length}`,
        owner: 'player',
        worldPosition: [
          ship.worldPosition[0] + forward.x * 3,
          ship.worldPosition[1] + forward.y * 3,
          ship.worldPosition[2] + forward.z * 3,
        ],
        velocity: [
          ship.velocity[0] + forward.x * projectileSpeed,
          ship.velocity[1] + forward.y * projectileSpeed,
          ship.velocity[2] + forward.z * projectileSpeed,
        ],
        ttl: projectileTTL,
      })
    }

    draft.enemies.forEach((enemy) => {
      const toPlayer = new THREE.Vector3(
        ship.worldPosition[0] - enemy.worldPosition[0],
        ship.worldPosition[1] - enemy.worldPosition[1],
        ship.worldPosition[2] - enemy.worldPosition[2],
      )
      const distance = toPlayer.length()
      if (distance > 0.001) toPlayer.normalize()

      enemy.velocity[0] = THREE.MathUtils.lerp(enemy.velocity[0], toPlayer.x * enemySpeed, 0.08)
      enemy.velocity[1] = THREE.MathUtils.lerp(enemy.velocity[1], toPlayer.y * enemySpeed, 0.08)
      enemy.velocity[2] = THREE.MathUtils.lerp(enemy.velocity[2], toPlayer.z * enemySpeed, 0.08)

      enemy.worldPosition[0] += enemy.velocity[0] * dt
      enemy.worldPosition[1] += enemy.velocity[1] * dt
      enemy.worldPosition[2] += enemy.velocity[2] * dt

      if (enemy.fireCooldown > 0) enemy.fireCooldown -= dt
      if (enemy.fireCooldown <= 0 && distance < enemyRange) {
        enemy.fireCooldown = enemyFireRate
        draft.projectiles.push({
          id: `e-${enemy.id}-${draft.time.toFixed(2)}`,
          owner: 'enemy',
          worldPosition: [
            enemy.worldPosition[0] + toPlayer.x * 3,
            enemy.worldPosition[1] + toPlayer.y * 3,
            enemy.worldPosition[2] + toPlayer.z * 3,
          ],
          velocity: [
            toPlayer.x * projectileSpeed,
            toPlayer.y * projectileSpeed,
            toPlayer.z * projectileSpeed,
          ],
          ttl: projectileTTL,
        })
      }
    })

    const nextProjectiles = []
    for (const projectile of draft.projectiles) {
      projectile.ttl -= dt
      if (projectile.ttl <= 0) continue

      projectile.worldPosition[0] += projectile.velocity[0] * dt
      projectile.worldPosition[1] += projectile.velocity[1] * dt
      projectile.worldPosition[2] += projectile.velocity[2] * dt

      if (projectile.owner === 'player') {
        let hit = false
        for (const enemy of draft.enemies) {
          const dx = enemy.worldPosition[0] - projectile.worldPosition[0]
          const dy = enemy.worldPosition[1] - projectile.worldPosition[1]
          const dz = enemy.worldPosition[2] - projectile.worldPosition[2]
          if (Math.hypot(dx, dy, dz) < hitRadius) {
            enemy.health -= 18
            hit = true
            break
          }
        }
        if (hit) continue
      } else {
        const dx = ship.worldPosition[0] - projectile.worldPosition[0]
        const dy = ship.worldPosition[1] - projectile.worldPosition[1]
        const dz = ship.worldPosition[2] - projectile.worldPosition[2]
        if (Math.hypot(dx, dy, dz) < hitRadius) {
          applyDamageToDraft(ship, pickRandomSocket(), 14)
          continue
        }
      }

      nextProjectiles.push(projectile)
    }
    draft.projectiles = nextProjectiles
    draft.enemies = draft.enemies.filter((enemy) => enemy.health > 0)

    draft.lastUpdated = state.time + dt
  })
}
