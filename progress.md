Original prompt: setup react + threejs structure

- Installed three, @react-three/fiber, @react-three/drei.
- Added basic R3F scene scaffold under src/game with ship, camera rig, runtime hooks, and simple sim loop.
- Replaced App.tsx with HUD + GameCanvas and added new styling in App.css/index.css.
- Added render_game_to_text and advanceTime hooks in GameRuntime.
- Updated dev script to use port 3010.
- Pending: run dev server + Playwright loop per develop-web-game skill.

- Fixed useSyncExternalStore snapshot stability by caching snapshot and only recreating on state updates.

- Updated layout CSS so canvas fills full viewport; HUD now overlays instead of consuming layout height.

- Added input system with throttle/brake + pitch/yaw/roll controls.
- Implemented physics-based thrust/torque, damping, and speed caps in sim.
- Updated HUD telemetry to show speed and throttle plus control hints.

- Removed Playwright dependency from app.
- Removed Playwright install artifacts from develop-web-game skill directory.

- Added Leva tuning panel to expose core physics and camera smoothing/offsets.

- Added floating-origin support with world position + offset.
- Added procedural sector generation for asteroids.
- Disabled linear damping by default and allow unlimited speed.

- Added procedural POIs (planets/stations/derelicts) and nearest-POI HUD marker.

- Added landing prototype with planet scene, lander movement, and loot pickup.

- Added inventory + hangar UI for equipping parts.
- Parts now modify ship stats via applyEquippedParts.

- Added save/load persistence for inventory + equipped parts.
- Added derived stats helper and stats section in hangar.

- Added socketed visual parts on the ship based on equipped loadout.
