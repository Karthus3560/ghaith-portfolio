# Ghaith Saad Jawad · portfolio

Four editions of the same content, in one project:

| Address | Edition |
|---|---|
| `/` | **Professional edition.** A light, CV-style page: results, roles, case studies, a full index of work, timeline and skills, with a small interactive 3D systems map in the header and a Print CV button. The link to the tree edition is in the footer. |
| `/story.html` | **Story edition.** Told in the first person. 53,000 live points, one for every record captured by the first system, reshape as you scroll: a heartbeat, a night sky, a wall of records that fills up, a globe with routes into Karbala, 6,000 employees as a block city, a certificate seal, a three-way bridge and, at the end, the portrait. |
| `/game.html` | **Game edition.** A small driving game. You take a hospital van around a night-time island, find 31 glowing beacons (one per system, role or qualification) and collect 53 lights, each standing for 1,000 records. There are jump ramps, a bridge, and cones, crates and balls to knock about. |
| `/tree.html` | **3D life-tree edition.** A career told as a living tree: the roots are nursing, each branch is a chapter, and each light opens a case study. |

The professional and tree editions read their text from `src/data/content.ts`. The story edition has its own first-person text in `src/show/copy.ts`, and takes its list of work and figures from `content.ts`.

`Start Portfolio.cmd` opens the professional edition, `Start Story Edition.cmd` the story edition and `Start Game Edition.cmd` the game.

## Run it

```bash
npm install
```

```bash
npm run dev
```

Then open the address Vite prints (usually http://localhost:5173).

Production build and local preview of it:

```bash
npm run build
```

```bash
npm run preview
```

The output in `dist/` is fully static and works offline (fonts, images and videos are bundled; nothing loads from a CDN).

## Professional edition: two-minute path

1. **Open `/`.** Name, title and the one-paragraph summary. Hover a layer of the systems map on the right: the stack opens and shows that area's work.
2. **Results.** Six figures: 53,000 records, 6,000+ employees, 2,821 candidates.
3. **Roles and responsibilities.** Most recent first, starting with the AZU60 role.
4. **Systems delivered.** Open **Mass-gathering data collection**, then use **Next** at the bottom.
5. **Inside the systems.** Click the satisfaction dashboard to show real screens.
6. **Full index.** Filter by area; every row opens its case study.
7. **عربي** (top right) switches to Arabic, right to left. **Print CV** gives a paper version.

`?lang=ar` opens in Arabic. `?nomap` hides the 3D map.

## Story edition: two-minute path

1. **Open `/story.html`.** Read the two lines aloud. Move the mouse through the heartbeat: the points move out of the way.
2. **Scroll slowly.** The night shift, then the record wall. Keep scrolling inside the wall and watch the counter pass 15,000, where the paid platform stopped, and run on to 53,000.
3. **The globe.** Say that it is a reconstruction; the real one showed patients by nationality, live, and was shown on Karbala TV.
4. **6,000 employees, the academy, the bridge.** One sentence each; the figures are on screen.
5. **"Don't take my word for it."** Drag the strip sideways and play the Arbaeen film or the learner guide.
6. **The ending.** The same points draw the portrait.

`?lang=ar` opens in Arabic. On a device without WebGL the text still reads, over a plain background.

## Game edition: two-minute path

1. **Open `/game.html` and press Start driving.** The board on the left shows the portrait and name.
2. **Hold W.** The road ahead leads to the ward. Lights along the road count up the records.
3. **Stop on a glowing ring and press E.** A card opens with the system, its figures and its screens. Press E again to close it.
4. **Follow the ring road.** Each district announces itself in the first person as you enter: the Arbaeen camp with its globe, the HR towers, the academy, the AHA centre, the bridge, the workshop.
5. **Show off a little.** Hold Shift at the ramp beside the plaza, drive over the bridge, knock the ball and the cones about, press Space for the horn.
6. **The round map** (bottom right) shows where you are and which beacons are still to find.

Keys: W A S D or the arrow keys to drive, Shift to boost, Space for the horn, E to open or close a card, R to return to the plaza. On a phone there is a thumb pad and buttons. Sound is off until you press Sound. `?lang=ar` opens in Arabic.

## 3D life-tree edition: two-minute path

Open `/tree.html`.

1. **Open the page and wait three seconds.** The tree grows from the roots while the name fades in. Say the one line under it: nurse turned health-technology builder.
2. **Scroll once to "Impact at a glance".** Let the counters run: 53,000 records, 6,000+ employees, 2,821 candidates.
3. **Scroll to "Nursing".** The camera drops to the roots. One sentence: the night shifts never stopped.
4. **Scroll to "Disaster Health Management"** and click **Disaster health management platform**. Play the short Arbaeen film in the panel. Press Esc.
5. **Scroll to "HR Systems"** and click **The Direct Line**, then **Next** to Employee Satisfaction. These two show the screens.
6. **Scroll to "Warith Academy"**, click **Learner portal** and play the one-minute guide.
7. **Scroll to "AZU60 ERP"**: this is the current role. Open **Permissions catalogue & advisor** for the 1,006 screens figure.
8. **Click "Explore the tree"** (top right). Drag to spin the whole tree, hover a light, click one. Click **Back to the story**.
9. **Switch to عربي** (top right) to show the full Arabic, right-to-left version.

## Controls

- **Explore the tree**: free orbit; drag to rotate, scroll to zoom, click a light to open it.
- **Lite mode**: a flat SVG tree for weak devices. It turns on by itself when WebGL is not available, or with `?lite` in the address.
- **عربي / English**: full translation with right-to-left layout. `?lang=ar` opens in Arabic.
- **Esc** closes a case study; the arrows at the bottom of a case study move along the same branch.

## Where things live

| Path | What |
|---|---|
| `src/data/content.ts` | All text in English and Arabic: chapters, projects, timeline, skills |
| `src/data/media.ts` | Which screenshots and videos appear in which case study |
| `src/three/treeGen.ts` | Builds the tree shape and camera views from the content |
| `src/three/Scene.tsx` | The 3D scene: branches, glowing leaves, ground, camera, bloom |
| `src/App.tsx`, `src/index.css` | Tree edition: page sections, case-study panel, styling |
| `src/pro/Pro.tsx`, `src/pro/pro.css` | Professional edition: page and styling |
| `src/pro/StackMap.tsx` | Professional edition: the 3D systems map |
| `src/pro/copy.ts` | Professional edition: its own labels and the few lines reworded for it |
| `src/show/engine.ts` | Story edition: the particle engine, every shape and the globe routes |
| `src/show/copy.ts` | Story edition: the first-person text in English and Arabic |
| `src/show/Show.tsx`, `src/show/show.css` | Story edition: page and styling |
| `src/game/world.ts` | Game edition: the island, districts, landmarks, beacons, ramps and colliders |
| `src/game/game.ts` | Game edition: the van, driving physics, camera, sound and minimap |
| `src/game/Game.tsx`, `src/game/game.css`, `src/game/copy.ts` | Game edition: the on-screen interface and its first-person text |
| `public/land.bin`, `scripts/build-land.mjs` | Land points for the globe, built from Natural Earth data (public domain) |
| `public/shots`, `public/media` | Redacted screenshots and videos |
| `scripts/shoot.mjs`, `scripts/shoot-pro.mjs`, `scripts/shoot-story.mjs`, `scripts/shoot-game.mjs` | Take QA screenshots of each edition with local Chrome |

To add a project, add an entry to `projects` in `content.ts`; it appears in the index and map of the professional edition and as a new light on the tree.

## Contact details

Contact details are deliberately empty. To show an email or LinkedIn link in the contact section of both editions, fill in `contact` at the top of `src/data/content.ts`.

## Deploying

The site is static. For GitHub Pages, build with the repository name as the base path:

```bash
BASE=/ghaith-portfolio/ npm run build
```

Publish `dist/` (this project publishes it to the `gh-pages` branch). On Vercel, import the folder with framework "Vite", build command `npm run build`, output `dist`.

## About the screens

Every screenshot and video was taken from existing promo material, with names, emails and admin addresses cropped out or replaced by demo data. No live system is connected to this site.
