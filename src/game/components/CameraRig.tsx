import { useFrame, useThree } from '@react-three/fiber'
import { useMemo } from 'react'
import * as THREE from 'three'
import { getState } from '../state'

export function CameraRig() {
  const { camera } = useThree()
  const target = useMemo(() => new THREE.Vector3(), [])
  const desiredPosition = useMemo(() => new THREE.Vector3(), [])
  const shipForward = useMemo(() => new THREE.Vector3(0, 0, 1), [])
  const shipUp = useMemo(() => new THREE.Vector3(0, 1, 0), [])
  const rotationEuler = useMemo(() => new THREE.Euler(), [])
  const rotationQuat = useMemo(() => new THREE.Quaternion(), [])

  useFrame((_state, delta) => {
    const { ship, cameraMode } = getState()

    rotationEuler.set(ship.rotation[0], ship.rotation[1], ship.rotation[2])
    rotationQuat.setFromEuler(rotationEuler)

    shipForward.set(0, 0, 1).applyQuaternion(rotationQuat)
    shipUp.set(0, 1, 0).applyQuaternion(rotationQuat)

    target.set(ship.position[0], ship.position[1], ship.position[2])

    if (cameraMode === 'first') {
      desiredPosition
        .copy(target)
        .add(shipUp.clone().multiplyScalar(0.25))
        .add(shipForward.clone().multiplyScalar(0.6))

      camera.position.lerp(desiredPosition, 1 - Math.pow(0.001, delta))
      camera.lookAt(target.clone().add(shipForward))
      return
    }

    desiredPosition
      .copy(target)
      .add(shipUp.clone().multiplyScalar(2.2))
      .add(shipForward.clone().multiplyScalar(-6))

    camera.position.lerp(desiredPosition, 1 - Math.pow(0.01, delta))
    camera.lookAt(target)
  })

  return null
}
