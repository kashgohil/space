import { getState, setState } from './state'

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

export function simulate(dt: number) {
  const state = getState()

  setState((draft) => {
    draft.time += dt

    const ship = draft.ship
    ship.rotation[1] += ship.angularVelocity[1] * dt
    ship.rotation[0] += ship.angularVelocity[0] * dt
    ship.rotation[2] += ship.angularVelocity[2] * dt

    ship.position[0] += ship.velocity[0] * dt
    ship.position[1] += ship.velocity[1] * dt
    ship.position[2] += ship.velocity[2] * dt

    ship.rotation[0] = clamp(ship.rotation[0], -Math.PI, Math.PI)
    ship.rotation[1] = clamp(ship.rotation[1], -Math.PI, Math.PI)
    ship.rotation[2] = clamp(ship.rotation[2], -Math.PI, Math.PI)

    draft.lastUpdated = state.time + dt
  })
}
