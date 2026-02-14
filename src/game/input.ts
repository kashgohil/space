type InputAxis = {
  pitch: number
  yaw: number
  roll: number
  throttle: number
  brake: boolean
}

const pressedKeys = new Set<string>()
let throttle = 0.15

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

export function setKeyState(code: string, isDown: boolean) {
  if (isDown) pressedKeys.add(code)
  else pressedKeys.delete(code)
}

export function getInputAxis(dt: number): InputAxis {
  const pitch = (pressedKeys.has('KeyW') ? 1 : 0) + (pressedKeys.has('KeyS') ? -1 : 0)
  const yaw = (pressedKeys.has('KeyD') ? 1 : 0) + (pressedKeys.has('KeyA') ? -1 : 0)
  const roll = (pressedKeys.has('KeyE') ? 1 : 0) + (pressedKeys.has('KeyQ') ? -1 : 0)

  const throttleUp = pressedKeys.has('ShiftLeft') || pressedKeys.has('ShiftRight')
  const throttleDown = pressedKeys.has('ControlLeft') || pressedKeys.has('ControlRight')

  const throttleRate = 0.6
  if (throttleUp) throttle += throttleRate * dt
  if (throttleDown) throttle -= throttleRate * dt

  throttle = clamp(throttle, 0, 1)

  const brake = pressedKeys.has('Space')

  return { pitch, yaw, roll, throttle, brake }
}

export function getPlanetInput() {
  const forward = (pressedKeys.has('KeyW') ? 1 : 0) + (pressedKeys.has('KeyS') ? -1 : 0)
  const strafe = (pressedKeys.has('KeyD') ? 1 : 0) + (pressedKeys.has('KeyA') ? -1 : 0)
  const sprint = pressedKeys.has('ShiftLeft') || pressedKeys.has('ShiftRight')

  return { forward, strafe, sprint }
}

export function isKeyDown(code: string) {
  return pressedKeys.has(code)
}

export function resetInput() {
  pressedKeys.clear()
  throttle = 0.15
}
