import * as THREE from 'three'
import { getInputAxis } from './input'
import { getState, setState } from './state'

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

export function simulate(dt: number) {
  const state = getState()

  setState((draft) => {
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

    const speed = Math.hypot(ship.velocity[0], ship.velocity[1], ship.velocity[2])
    if (speed > draft.maxSpeed) {
      const scale = draft.maxSpeed / speed
      ship.velocity[0] *= scale
      ship.velocity[1] *= scale
      ship.velocity[2] *= scale
    }

    const angularAccel = draft.maxAngularAccel
    ship.angularVelocity[0] += input.pitch * angularAccel * dt
    ship.angularVelocity[1] += input.yaw * angularAccel * dt
    ship.angularVelocity[2] += input.roll * angularAccel * dt

    ship.rotation[1] += ship.angularVelocity[1] * dt
    ship.rotation[0] += ship.angularVelocity[0] * dt
    ship.rotation[2] += ship.angularVelocity[2] * dt

    ship.position[0] += ship.velocity[0] * dt
    ship.position[1] += ship.velocity[1] * dt
    ship.position[2] += ship.velocity[2] * dt

    const linearDamping = Math.exp(-draft.linearDamping * dt)
    ship.velocity[0] *= linearDamping
    ship.velocity[1] *= linearDamping
    ship.velocity[2] *= linearDamping

    const angularDamping = Math.exp(-draft.angularDamping * dt)
    ship.angularVelocity[0] *= angularDamping
    ship.angularVelocity[1] *= angularDamping
    ship.angularVelocity[2] *= angularDamping

    draft.throttle = input.throttle
    ship.rotation[0] = clamp(ship.rotation[0], -Math.PI, Math.PI)
    ship.rotation[1] = clamp(ship.rotation[1], -Math.PI, Math.PI)
    ship.rotation[2] = clamp(ship.rotation[2], -Math.PI, Math.PI)

    draft.lastUpdated = state.time + dt
  })
}
