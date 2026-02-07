import { useSyncExternalStore } from 'react'
import { getSnapshot, subscribe } from '../state'

export function useGameStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
