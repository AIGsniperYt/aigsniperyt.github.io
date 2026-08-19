# AIGsniper — Portfolio & Project Workspace

The single codebase behind [aigsniperyt.github.io](https://aigsniperyt.github.io/): the
portfolio site itself plus every project — games, tools, visualisations and
experiments — living in one folder and wired into the live catalogue.

**Author:** AIGsniper (AIGsniperYt) — <thahmimmustaq@gmail.com>

## Live site

- **<https://aigsniperyt.github.io/>**, served from `index.html` — a one-page SPA with an
  interactive parallax starfield, a featured-projects grid, a filterable project
  browser (category and status filters: **MAJOR / Legacy / Deprecated / Reviving**), a
  latest-update feed, and a theme switcher (Forest / Alpine / Purple).

## Repo layout at a glance

``` txt
index.html          The portfolio — every project is wired into its catalogue/featured data
README.md           This file

legacy/             Older / migrated projects (all linked from the portfolio)
games/              Mid-tier projects moved out of legacy (e.g. hex)
tools/              Tool-style projects (paint, tracker, comparison, comms, netbuilder_3D, snipping tool)
visualisations/     Algorithm & simulation hub — index.html links every sub-project
webgl/              WebGL / Three.js experiments archive — 15 flight-sim builds + 5 voxel builds
archive/            Non-served archives — full portfolio version history (old, v2, v3, v4)
deprecated/         Retired projects kept for reference (labyrinth, comms client, multiplayer)
lab/                Local-only experiments (C, etc.) — NOT deployed
PoC/                Proofs of concept (chatbot/gemini-wrapper, ...)
output/             Build output / non-served extras (company landing page)
html/               HTML elements visual reference (restored)

chat/ chess/ equilibrium/ flight-sim/ neuronet/ webgl/   own embedded git repos (see below)
```

## Project catalogue

Paths are relative to this repo root. **MAJOR** marks flagship / largest projects.
`Status` values: `legacy`, `deprecated`, `revival`, or empty (current). `legacy, revival`
means an older project slated to come back.

### Games

| Project | Overview | Status |
| --- | --- | --- |
| [Equilibrium](https://aigsniperyt.github.io/equilibrium/) | **MAJOR** — Open-world isometric souls-like action RPG: combat, exploration, custom ES6-module framework (formerly Elderwood) | |
| [Simple Game V1](legacy/games/simple%20games/simple%20game/game.html) | 2D top-down shooter — mouse aiming + WASD, dodge and shoot enemies | legacy |
| [Simple Game V2](legacy/games/simple%20games/simple%20game%20v2/game.html) | **MAJOR** — 2036-line zombie shooter: 5 weapons, XP leveling, powerups, dash, particles | legacy |
| [Simple Game V3](legacy/games/simple%20games/simple%20game%20v3/index.html) | Sequel with a storyline, improved design, and real purpose | legacy, revival |
| [1v1 Arena](legacy/games/1v1/game.html) | Two-player battle arena — WASD+E vs arrows+Ins, 15 HP each | legacy |
| [Galactic Guardian](legacy/games/alien/spaceshooter.html) | Top-down alien shooter defending Earth from the Xyloid fleet | legacy |
| [Hex](games/hex/index.html) | Hex board game — PvP or vs AI, undo/redo, bridge-threat lookahead | |
| [Plane Game](legacy/games/planegame/game.html) | Two-player plane dogfight — W/S rotate, Q guns, E missiles | legacy |
| [YORG](legacy/games/yorg/game.html) | Experimental grid game — node placement, custom cursor, build menu | legacy, revival |
| [Bubble Pop](legacy/bubbles/bubbles.html) | Casual bubble-pop game (made for a little sister) | legacy |
| [Whack-a-Mole](legacy/whackmole/mole.html) | Classic 3x3 whack-a-mole | legacy |
| [Guess the Number](legacy/guess_number/game.html) | Guess 0-100; binary search helps | legacy |
| [Zombie Survival](legacy/zombie/zombie.html) | 2D zombie shooter — WASD + mouse-aim waves | legacy |
| [Split-Screen Hub](legacy/games/index.html) | Games hub — Simple Game version history V1-V4 split-screen | legacy |
| [Games Menu](legacy/games/menu.html) | Games collection launcher (Plane Game, 1v1, Mining, and more) | legacy |

### 3D & WebGL

| Project | Overview | Status |
| --- | --- | --- |
| [Flight Simulator](https://aigsniperyt.github.io/flight-sim/) | **MAJOR** — 3D flight sim: procedural terrain, realistic physics, chase camera | |
| [WebGL Archive](webgl/index.html) | **MAJOR** — Hub for every flight-sim build and voxel world | |
| [Voxel World V3](webgl/voxel%20v3/index.html) | Infinite procedural voxel world — chunking, fly mode, wireframe toggle | |
| [Voxel World V1](webgl/voxel/index.html) | First 3D experiment — a spinning gray cube in Three.js | |
| [Pirate Ship Sim](visualisations/pirate/index.html) | 3D pirate ship with vertex-water waves, wireframe toggle | revival |
| [3D Simplex Grid](visualisations/simplex/index.html) | 3D terrain height map from simplex noise | |
| [Raycasting Engine](visualisations/raycasting/raycasting.html) | Wolfenstein-style first-person raycasting from a 2D map | |
| [3D Box Net Generator](tools/netbuilder_3D/index.html) | 3D box modeler generating a 2D folding net with SVG export | revival |

### Tools & Utilities

| Project | Overview | Status |
| --- | --- | --- |
| [Lite Code Viewer](tools/lite-code-viewer/index.html) | Syntax-highlighted source browser for legacy/deprecated projects | |
| [Online Paint](tools/paint/paint.html) | MS-Paint-style browser drawing tool | |
| [Code Diff Checker](tools/comparison/index.html) | Side-by-side old-vs-new text/code diff with highlighting | |
| [Past Papers Tracker](tools/tracker/tracker.html) | Study tracker with flashcard mode + mark schemes ([Flashcards](tools/tracker/flashcards.html)) | |
| [Pixel Art Snipper](tools/snipping%20tool/index.html) | Image region cropper with zoom for pixel art | |
| [Comms](tools/comms/index.html) | Non-verbal communication tool with animated neural-network visuals | |
| [Cipher Slayer](legacy/cipherSlayer/index.html) | Decryption tool — word reversal + Caesar shifts | legacy |
| [Quote Generator](legacy/quote_generator/quote_generator.html) | Random inspirational quote display | legacy |
| [Mini Code Editor](legacy/engine/index.html) | Browser code editor — file explorer sidebar, tabs, JSZip export | deprecated |
| [CSS Cursors Ref](legacy/cursors/all_cursors.html) | All built-in CSS cursor types with copyable HTML | legacy |
| [Code Snippets Ref](legacy/snippets/movement.html) | JS movement snippet reference (WASD / arrows) | legacy |
| [File Explorer](legacy/file%20explorer/file.html) | Browser file-explorer UI demo | legacy |
| [Sticky Header Demo](legacy/Sticky_Header/project.html) | CSS `position: sticky` tutorial demo | legacy |
| [Camera System](legacy/camera/index.html) | 2D camera following a player, renders only visible tiles | deprecated |

### Visualisations

| Project | Overview | Status |
| --- | --- | --- |
| [Visualisations Hub](visualisations/index.html) | **MAJOR** — A*, cars, cellular automata, foraging, noise, pirates, raycasting | |
| [A* Pathfinding](visualisations/a-star/index.html) | Interactive shortest-path visualization on a grid | |
| [Algorithms Visualizer](visualisations/algorithms/index.html) | Bubble / Selection / Insertion / Quick sort visualizer | |
| [Autonomous Car](visualisations/autocar/index.html) | Self-driving car simulation with sensor avoidance | deprecated, revival |
| [Foraging Simulation](visualisations/foraging/index.html) | Ant agents + pheromone trails | |
| [Cave Generator](visualisations/celllular%20automata/index.html) | Cellular-automata dungeon & cave generator | |
| [Perlin Noise Demo](visualisations/perlin%20noise/v1/index.html) | 2D simplex noise coherence demo | |

### Communication

| Project | Overview | Status |
| --- | --- | --- |
| [Discord Chat](https://aigsniperyt.github.io/online-server/) | **MAJOR** — Discord-style chat: E2E encryption, integrated chess, long-polling server | |
| [AI Chatbot](PoC/chatbot/gemini-wrapper/index.html) | Gemini-powered chatbot web wrapper | |
| [Gunr](legacy/games/gunr/index.html) | Proof-of-concept multiplayer attempt — seed of the full multiplayer system | legacy, revival |

### IoT & Hardware

| Project | Overview | Status |
| --- | --- | --- |
| [SIM800 GSM Console](gateway/frontend/index.html) | Browser console for an ESP8266 + SIM800 GSM module — WebSocket/HTTP bridge for AT commands: terminal, live dashboard, SMS, calls ([repo](https://github.com/AIGsniperYt/gateway)) | |

### Other

| Project | Overview | Status |
| --- | --- | --- |
| [Chess (Kaiser)](https://aigsniperyt.github.io/kaiser/) | **MAJOR** — Full chess engine: move validation, castling, en passant, genetic-AI weights | |
| [Neuronet](https://aigsniperyt.github.io/neuronet-frontend/) | **MAJOR** — Local-first knowledge management system (backend + frontend) | |
| [HTML Elements Ref](html/html.html) | Visual showcase of HTML elements with live examples | |
| [Portfolio Archive](archive/portfolio/v4/index.html) | This site's version history — old, v2, v3, v4 | |
| [C Lab (Memory Lab)](lab/C/memory_lab.c) | Low-level C experiments. Local only, NOT deployed | |

### Deprecated

| Project | Overview | Status |
| --- | --- | --- |
| [Mining Game](legacy/games/mining/game.html) | Camera-follow mining sandbox with pickaxe resources | deprecated |
| [Multiplayer Tic-Tac-Toe](legacy/games/tictactoe/index.html) | Online tic-tac-toe awaiting an opponent | deprecated |
| [RPG (Survive)](legacy/games/rpg/game.html) | Top-down 2D survival RPG | deprecated |
| [Testing Grounds](legacy/games/testing/game.html) | Sandbox — rotating square, slither.io clone, RPG prototype | deprecated |
| [Labyrinth Maze](tools/lite-code-viewer/index.html?files=deprecated%2Flabyrinth%2Fgame.py,deprecated%2Flabyrinth%2Fzombies.py,deprecated%2Flabyrinth%2Flevels.json,deprecated%2Flabyrinth%2Fgame_data.json,deprecated%2Flabyrinth%2FREADME.md&title=Labyrinth%20Maze) | Pygame maze game with JSON levels (view source in Lite Code Viewer) | deprecated |
| [Comms Client](deprecated/comms%20client/index.html) | Neural-network node visualization with hidden text input | deprecated, revival |
| [Multiplayer (Socket.IO)](deprecated/multiplayer/public/index.html) | Socket.IO broadcast PoC — needs a Node server | deprecated |

## Games collection deep-dive

Everything under [`legacy/games/`](legacy/games/):

| Path | What it is |
| --- | --- |
| `legacy/games/index.html` | Split-Screen hub — Simple Game version history |
| `legacy/games/menu.html` | Games collection launcher |
| `legacy/games/simple games/simple game/game.html` | Simple Game V1 |
| `legacy/games/simple games/simple game v2/game.html` | Simple Game V2 (the 2036-line zombie shooter) |
| `legacy/games/simple games/simple game v3/index.html` | Simple Game V3 |
| `legacy/games/Versions/V1/game.html` | Movement-system version V1 (basic movement) |
| `legacy/games/Versions/V2/game.html` | Movement-system version V2 (smooth + diagonal) |
| `legacy/games/Versions/V3/game.html` | Movement-system version V3 (WASD + arrows) |
| `legacy/games/Versions/V4/game.html` | Movement-system version V4 (caps-lock-safe WASD) |
| `legacy/games/1v1/game.html` | 1v1 Arena |
| `legacy/games/alien/spaceshooter.html` | Galactic Guardian |
| `legacy/games/hex/index.html` | Hex — **moved to `games/hex/`** |
| `legacy/games/mining/game.html` | Mining Game (deprecated) |
| `legacy/games/planegame/game.html` | Plane Game |
| `legacy/games/racing/` | Racing (reserved — currently empty) |
| `legacy/games/rpg/game.html` | RPG (Survive) (deprecated) |
| `legacy/games/testing/game.html` | Testing Grounds (deprecated) |
| `legacy/games/tictactoe/index.html` | Multiplayer Tic-Tac-Toe (deprecated) |
| `legacy/games/yorg/game.html` | YORG |
| `legacy/games/gunr/index.html` | Gunr — multiplayer PoC (revival) |

## WebGL experiments archive

Hub: [`webgl/index.html`](webgl/index.html). Own git repo. Fifteen flight-sim builds
(`webgl/flight-sim-v0.1` → `webgl/flight-sim-v8.0`) plus five voxel worlds
(`webgl/voxel`, `webgl/voxel v2` … `webgl/voxel v5`), `webgl/business`, and
`webgl/cube`.

## Portfolio archive (version history)

[`archive/portfolio/`](archive/portfolio/) holds every previous portfolio release.
All internal links are wired to the current file tree:

| Version | Entry | Notes |
| --- | --- | --- |
| old | [`archive/portfolio/old/index.html`](archive/portfolio/old/index.html) | Original single-page card list (Games, Quote Gen, Bubbles, cursors...) |
| v2 | [`archive/portfolio/v2/index.html`](archive/portfolio/v2/index.html) | Grid of cards — Elderwood lineage, tools, games |
| v3 | [`archive/portfolio/v3/index.html`](archive/portfolio/v3/index.html) | Theme toggle + Project Constellation canvas |
| v4 | [`archive/portfolio/v4/index.html`](archive/portfolio/v4/index.html) | Nearly the current SPA, with an older catalogue snapshot |

## Embedded git repos

The following folders are their own git repositories and are ignored by this
monolith's `.gitignore`. They keep their own history, remotes, and ignore rules:

`chat/`, `equilibrium/`, `flight-sim/`, `webgl/`, `neuronet/` (and `chess/`,
`lab/C/rust_engine/`, `yorg/`). `gateway/` was folded into this monolith (its
public repo at `AIGsniperYt/gateway` remains the source of truth for the
backend + README).

They have both local entry points (e.g. `chat/index.html`, `chess/v2/ai.html`,
`neuronet/frontend/index.html`) and live GitHub Pages deployments, which the
portfolio links to.

## Serving locally

```bash
# from the repo root
python3 -m http.server 8000
# http://localhost:8000
```

`ROOT_PATH` is set to the GitHub Pages base path in `index.html`; when serving
locally with `python -m http.server`, links resolve relative to the repo root.
Archived portfolio versions set `ROOT_PATH` one level deeper
(`archive/portfolio/v4/` → `'../../../'`).

## Conventions

- New projects go in the folder matching their type (`tools/`, `visualisations/`,
  `games/`, `legacy/`, ...), each with its own `index.html` entry point.
- Add the project to the `catalogue` array in `index.html` (name, description,
  tags, url, icon, category). `ROOT_PATH + "<relative path>"` is the standard
  url form for projects served from this repo.
- Deployed/remote projects use their live URL instead of a relative path.
- Private / local-only work (e.g. `lab/`) stays out of the deployed tree.
- Moved projects get their relative links re-wired (see the archive portfolio
  wiring job that keeps historical versions working).

## License

Copyright &copy; 2026 AIGsniper. All Rights Reserved.

This repository is publicly viewable, but **no part of this code** — including
JavaScript, CSS, HTML, or assets — may be copied, modified, redistributed, or used
in any other projects **without explicit permission** from the author.

For inquiries, contact: <thahmimmustaq@gmail.com>
