export type Vec3 = [number, number, number]

type SectorKey = `${number}:${number}:${number}`

export type Asteroid = {
  position: Vec3
  scale: number
}

export type POI = {
  id: string
  kind: 'planet' | 'station' | 'derelict'
  position: Vec3
  radius: number
}

export type SectorData = {
  key: SectorKey
  asteroids: Asteroid[]
  pois: POI[]
}

const sectorCache = new Map<SectorKey, SectorData>()

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

function hashString(input: string) {
  let hash = 2166136261
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function mulberry32(seed: number) {
  let t = seed
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function makeSectorKey(x: number, y: number, z: number): SectorKey {
  return `${x}:${y}:${z}`
}

function generateSectorAsteroids(sectorX: number, sectorY: number, sectorZ: number, sectorSize: number) {
  const seed = hashString(`sector:${sectorX},${sectorY},${sectorZ}`)
  const rand = mulberry32(seed)

  const count = 24 + Math.floor(rand() * 24)
  const asteroids: Asteroid[] = []

  for (let i = 0; i < count; i += 1) {
    const px = (sectorX + rand()) * sectorSize
    const py = (sectorY + rand()) * sectorSize
    const pz = (sectorZ + rand()) * sectorSize
    const scale = clamp(2 + rand() * 8, 2, 10)

    asteroids.push({ position: [px, py, pz], scale })
  }

  return asteroids
}

function generateSectorPOIs(sectorX: number, sectorY: number, sectorZ: number, sectorSize: number) {
  const seed = hashString(`poi:${sectorX},${sectorY},${sectorZ}`)
  const rand = mulberry32(seed)

  const poiChance = 0.08
  if (rand() > poiChance) return [] as POI[]

  const roll = rand()
  let kind: POI['kind'] = 'derelict'
  if (roll > 0.66) kind = 'planet'
  else if (roll > 0.33) kind = 'station'

  const base = sectorSize * 0.2
  const radius = kind === 'planet' ? base * (0.8 + rand() * 1.8) : base * (0.35 + rand() * 0.5)

  const px = (sectorX + 0.5 + (rand() - 0.5) * 0.4) * sectorSize
  const py = (sectorY + 0.5 + (rand() - 0.5) * 0.4) * sectorSize
  const pz = (sectorZ + 0.5 + (rand() - 0.5) * 0.4) * sectorSize

  return [
    {
      id: `poi:${sectorX}:${sectorY}:${sectorZ}`,
      kind,
      position: [px, py, pz],
      radius,
    },
  ]
}

export function getSectorData(sectorX: number, sectorY: number, sectorZ: number, sectorSize: number) {
  const key = makeSectorKey(sectorX, sectorY, sectorZ)
  const cached = sectorCache.get(key)
  if (cached) return cached

  const asteroids = generateSectorAsteroids(sectorX, sectorY, sectorZ, sectorSize)
  const pois = generateSectorPOIs(sectorX, sectorY, sectorZ, sectorSize)
  const data = { key, asteroids, pois }
  sectorCache.set(key, data)
  return data
}

export function getNearbySectors(
  worldPosition: Vec3,
  sectorSize: number,
  radius: number,
): SectorData[] {
  const sectorX = Math.floor(worldPosition[0] / sectorSize)
  const sectorY = Math.floor(worldPosition[1] / sectorSize)
  const sectorZ = Math.floor(worldPosition[2] / sectorSize)

  const sectors: SectorData[] = []

  for (let x = sectorX - radius; x <= sectorX + radius; x += 1) {
    for (let y = sectorY - radius; y <= sectorY + radius; y += 1) {
      for (let z = sectorZ - radius; z <= sectorZ + radius; z += 1) {
        sectors.push(getSectorData(x, y, z, sectorSize))
      }
    }
  }

  return sectors
}

export function getNearbyPOIs(worldPosition: Vec3, sectorSize: number, radius: number) {
  return getNearbySectors(worldPosition, sectorSize, radius).flatMap((sector) => sector.pois)
}
