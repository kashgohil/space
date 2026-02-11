export type Vec3 = [number, number, number]

type SectorKey = `${number}:${number}:${number}`

export type Asteroid = {
  position: Vec3
  scale: number
}

export type SectorData = {
  key: SectorKey
  asteroids: Asteroid[]
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

export function getSectorData(sectorX: number, sectorY: number, sectorZ: number, sectorSize: number) {
  const key = makeSectorKey(sectorX, sectorY, sectorZ)
  const cached = sectorCache.get(key)
  if (cached) return cached

  const asteroids = generateSectorAsteroids(sectorX, sectorY, sectorZ, sectorSize)
  const data = { key, asteroids }
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
