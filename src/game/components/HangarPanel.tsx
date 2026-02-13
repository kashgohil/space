import { deriveStats } from '../deriveStats'
import { equipPart, unequipPart } from '../state'
import { useGameStore } from '../hooks/useGameStore'
import { getPartById } from '../parts'

export function HangarPanel() {
  const snapshot = useGameStore()

  if (snapshot.mode !== 'hangar') return null

  const stats = deriveStats(snapshot.equippedParts)

  return (
    <section className="hangar">
      <div className="hangar__header">Hangar Loadout</div>
      <div className="hangar__section">
        <div className="hangar__label">Equipped</div>
        {snapshot.equippedParts.length === 0 ? (
          <div className="hangar__muted">No parts equipped</div>
        ) : (
          snapshot.equippedParts.map((partId) => {
            const part = getPartById(partId)
            return (
              <button
                key={partId}
                className="hangar__item"
                onClick={() => unequipPart(partId)}
              >
                {part?.name ?? partId}
                <span className="hangar__chip">Remove</span>
              </button>
            )
          })
        )}
      </div>
      <div className="hangar__section">
        <div className="hangar__label">Inventory</div>
        {snapshot.inventory.length === 0 ? (
          <div className="hangar__muted">No parts yet. Explore to find parts.</div>
        ) : (
          snapshot.inventory.map((partId, index) => {
            const part = getPartById(partId)
            const equipped = snapshot.equippedParts.includes(partId)
            return (
              <button
                key={`${partId}-${index}`}
                className="hangar__item"
                disabled={equipped}
                onClick={() => equipPart(partId)}
              >
                {part?.name ?? partId}
                <span className="hangar__chip">{equipped ? 'Equipped' : 'Equip'}</span>
              </button>
            )
          })
        )}
      </div>
      <div className="hangar__section">
        <div className="hangar__label">Stats</div>
        <div className="hangar__muted">
          Thrust: {stats.base.maxThrust} + {stats.bonus.maxThrust}
        </div>
        <div className="hangar__muted">
          Angular: {stats.base.maxAngularAccel} + {stats.bonus.maxAngularAccel}
        </div>
        <div className="hangar__muted">
          Damping: {stats.base.linearDamping} + {stats.bonus.linearDamping}
        </div>
        <div className="hangar__muted">
          Max Speed: {stats.base.maxSpeed} + {stats.bonus.maxSpeed}
        </div>
      </div>
    </section>
  )
}
