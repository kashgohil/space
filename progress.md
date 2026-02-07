Original prompt: setup react + threejs structure

- Installed three, @react-three/fiber, @react-three/drei.
- Added basic R3F scene scaffold under src/game with ship, camera rig, runtime hooks, and simple sim loop.
- Replaced App.tsx with HUD + GameCanvas and added new styling in App.css/index.css.
- Added render_game_to_text and advanceTime hooks in GameRuntime.
- Updated dev script to use port 3010.
- Pending: run dev server + Playwright loop per develop-web-game skill.

- Fixed useSyncExternalStore snapshot stability by caching snapshot and only recreating on state updates.

- Updated layout CSS so canvas fills full viewport; HUD now overlays instead of consuming layout height.
