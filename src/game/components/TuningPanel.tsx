import { Leva, useControls } from 'leva'
import { getState, updateTuning } from '../state'

export function TuningPanel() {
  const state = getState()

  useControls(() => ({
    maxThrust: {
      value: state.maxThrust,
      min: 5,
      max: 60,
      step: 0.5,
      label: 'Max Thrust',
      onChange: (value: number) => updateTuning((draft) => (draft.maxThrust = value)),
    },
    maxAngularAccel: {
      value: state.maxAngularAccel,
      min: 0.5,
      max: 8,
      step: 0.1,
      label: 'Angular Accel',
      onChange: (value: number) => updateTuning((draft) => (draft.maxAngularAccel = value)),
    },
    linearDamping: {
      value: state.linearDamping,
      min: 0,
      max: 2,
      step: 0.01,
      label: 'Linear Damping',
      onChange: (value: number) => updateTuning((draft) => (draft.linearDamping = value)),
    },
    angularDamping: {
      value: state.angularDamping,
      min: 0,
      max: 4,
      step: 0.05,
      label: 'Angular Damping',
      onChange: (value: number) => updateTuning((draft) => (draft.angularDamping = value)),
    },
    maxSpeed: {
      value: state.maxSpeed,
      min: 5,
      max: 100,
      step: 1,
      label: 'Max Speed',
      onChange: (value: number) => updateTuning((draft) => (draft.maxSpeed = value)),
    },
  }))

  useControls('Camera', () => ({
    cameraFollowSharpnessThird: {
      value: state.cameraFollowSharpnessThird,
      min: 0.5,
      max: 18,
      step: 0.5,
      label: '3rd Smooth',
      onChange: (value: number) =>
        updateTuning((draft) => (draft.cameraFollowSharpnessThird = value)),
    },
    cameraFollowSharpnessFirst: {
      value: state.cameraFollowSharpnessFirst,
      min: 0.5,
      max: 24,
      step: 0.5,
      label: '1st Smooth',
      onChange: (value: number) =>
        updateTuning((draft) => (draft.cameraFollowSharpnessFirst = value)),
    },
    cameraThirdOffsetUp: {
      value: state.cameraThirdOffsetUp,
      min: 0.5,
      max: 8,
      step: 0.1,
      label: '3rd Offset Up',
      onChange: (value: number) => updateTuning((draft) => (draft.cameraThirdOffsetUp = value)),
    },
    cameraThirdOffsetBack: {
      value: state.cameraThirdOffsetBack,
      min: -20,
      max: -1,
      step: 0.2,
      label: '3rd Offset Back',
      onChange: (value: number) => updateTuning((draft) => (draft.cameraThirdOffsetBack = value)),
    },
    cameraFirstOffsetUp: {
      value: state.cameraFirstOffsetUp,
      min: 0,
      max: 2,
      step: 0.05,
      label: '1st Offset Up',
      onChange: (value: number) => updateTuning((draft) => (draft.cameraFirstOffsetUp = value)),
    },
    cameraFirstOffsetForward: {
      value: state.cameraFirstOffsetForward,
      min: 0.2,
      max: 2,
      step: 0.05,
      label: '1st Offset Fwd',
      onChange: (value: number) => updateTuning((draft) => (draft.cameraFirstOffsetForward = value)),
    },
  }))

  return <Leva collapsed={false} />
}
