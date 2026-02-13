import { getState, setState } from './state'

const STORAGE_KEY = 'starforged-save-v1'

type SaveState = {
  inventory: string[]
  equippedParts: string[]
}

export function loadSave() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw) as SaveState

    setState((draft) => {
      if (Array.isArray(parsed.inventory)) draft.inventory = [...parsed.inventory]
      if (Array.isArray(parsed.equippedParts)) draft.equippedParts = [...parsed.equippedParts]
    })
  } catch {
    // ignore broken saves
  }
}

export function persistSave() {
  const state = getState()
  const payload: SaveState = {
    inventory: state.inventory,
    equippedParts: state.equippedParts,
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}
