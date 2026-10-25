# ExplorePH: Project Brief

Updated 2026-10-25

## Concept

A mobile-friendly website that turns exploring the Philippines into a collection game: visit a real place, check in on the spot, and earn a stamp in your digital passport. The centerpiece is an interactive 3D map shaped like the real Philippines, where regions, provinces and cities fill in and rise as you collect their spots, and badges reward milestones.

**One-line pitch:** Collect the Philippines, one stamp at a time.

**Name:** ExplorePH

**What changed from Travel Logger:** It keeps the city-level map, weighted tourist spots and one-tap check-ins. Marking a spot is a single tap with no GPS and no timestamps, so the app stays simple and works anywhere. Selling to LGUs is not a goal for now; the focus is making the game fun for travelers and locals first.

## Target users

Two groups play differently, and the app needs a reason for both to open it.

| User | Why they play | How often | What keeps them coming back |
| --- | --- | --- | --- |
| Locals (students, young workers) | Discover their own city, bragging rights with friends | Weekly | Nearby spots, weekly challenges, friend leaderboards |
| Domestic tourists | Make a trip memorable, prove where they've been | A few times a year, many spots per trip | City completion, trip summary cards to share |
| Foreign tourists | A guided list of what's worth seeing | Once per trip | Curated spots, a souvenir passport |

Locals matter most early. Tourists travel rarely, so a tourist-only app gets opened a few times a year and forgotten. Locals can play every week, which builds the habit and the user base.

## Core game loop

Marking a visit is one button press: no GPS, no location check and no timestamps, so it works anywhere, even offline.

Sharing a finished city brings in friends, and partly filled cities pull players back to the next spot.

**How marking a spot works**

1. The player opens a spot and taps "Mark as visited."
2. The stamp appears in their passport right away.
3. City, province and region completion update.
4. Tapping again unmarks it, in case of a mistake.

**Stamp types**

- **One-tap stamp (MVP):** works anywhere, no partner or signal needed.
- **QR stamp (later):** a code displayed at partner businesses or events. Harder to fake, and it earns a special-design stamp.

## Progress, achievements and leaderboards

Progress is measured at three levels, and every level is visible on the map.

- **City completion:** the share of a city's spots you've stamped, weighted so a city with many spots counts for more than one with few. The city polygon fills in color as it rises.
- **Province and region completion:** rolls up from the cities inside them.
- **Country completion:** the headline number on your profile.

**Badges** reward specific goals rather than raw counts:

- Category sets: all churches in a city, 10 waterfalls, 5 heritage sites
- Firsts: first stamp in a new region, first island
- Streaks: a new stamp every week for a month
- Challenges: limited-time themes, such as a food crawl or a heritage month set

**Leaderboards** are honor-based, since stamps aren't verified. Keep them friends-only, where faking a stamp has little payoff, and skip a public national board.

**Sharing:** after a trip, generate a summary card (cities, stamps, badges) sized for Instagram and TikTok stories. This is the main free marketing channel.

## Map and spot data

The map goes down to city and municipality polygons; inside a city, progress comes from spots, not barangays.

- **Boundaries:** city/municipality GeoJSON, simplified to keep the file small, with PSGC codes as IDs.
- **Spots:** seeded from public sources, only the most notable ones per city. Each spot stores name, category, coordinates (for the map pin only) and a weight.
- **Towns with no famous spots:** seeded with baseline anchors (church, plaza, municipal hall) so every town is collectible.
- **Growth:** users suggest new spots after launch; an admin approves them before they count.
- **Pilot area:** Davao City first, then Samal and the rest of Davao Region. A small, well-curated area beats a thin national map.

## UI plan: the 3D Philippines map

The main screen is an interactive 3D map shaped like the real Philippines. Every region, province and city is its own piece you can hover, click and zoom into, and pieces gain color and height as completion grows.

**How it is built**

- three.js through react-three-fiber and drei, inside Next.js (client-side only).
- Boundary GeoJSON is projected flat with d3-geo (Mercator) and extruded into meshes with ExtrudeGeometry, one mesh per area, keyed by PSGC code.
- Hover and click use raycasting. Color and extrusion height both follow completion %, so a finished city stands taller than an empty one.
- Simplify boundaries (mapshaper) and load city-level meshes only when the user zooms into a region. Davao Region is the only city-level detail in the MVP.
- Style: a tilted flat map, not a globe, since islands get tiny on a globe. Limited tilt and rotation (no free orbit) plus a reset-view button.
- Fallback: a flat 2D view and a list view for low-end phones and accessibility.

**Zoom levels**

1. Country: the whole archipelago, regions colored by completion.
2. Region and province: the camera glides in and provinces are extruded.
3. City: cities appear as separate pieces, and a side panel lists their spots.
4. Spot: a pin on the city piece opens a card with the "Mark as visited" button.

A breadcrumb (Philippines > Davao Region > Davao City) gives the way back up.

**Screen layout** (1920x1080 reference; on mobile the right panel becomes a draggable bottom sheet)

- Center, about 70% of the screen: the 3D map on a soft sea-colored background.
- Right panel: context for the selection (name, completion ring, spot list, mark buttons).
- Top bar: logo, breadcrumb, profile and passport shortcut.
- Bottom left: country completion % and the latest stamp earned.

**Interaction details**

- Hover (desktop): the piece lifts slightly and a tooltip shows name and %.
- Mark as visited: the stamp animates in, the piece grows, the % ticks up, and a confetti burst plays at 100%.
- Fog of war: unvisited pieces stay gray and desaturated, then fill with color as you collect.

**Other screens:** sign-in, passport (stamp grid per region), badges, spot detail, trip card generator, and friends/leaderboard later.

## MVP scope vs later

The MVP proves one thing: that people in Davao enjoy collecting stamps enough to go out and get more.

| Feature | MVP | Later |
| --- | --- | --- |
| Sign-in and profile | Yes | |
| 3D Philippines map with polygons that fill and rise as you progress | Yes (Davao Region) | Nationwide |
| Spot list per city with categories | Yes | |
| One-tap "Mark as visited" stamps | Yes | |
| Digital passport view | Yes | Printed passport book |
| City completion % and basic badges | Yes | Seasonal challenges |
| Shareable trip card | Yes | |
| Friend leaderboard | | Yes |
| QR stamps at partner spots | | Yes |
| User-suggested spots | | Yes |
| Rewards from local businesses | | Yes |

## Tech stack and architecture

Build it as a mobile-first website for now, using Next.js. A native app can come later once the game proves itself. Data lives in Neon (serverless Postgres) and is accessed through Prisma; Supabase handles sign-in and photo storage. Without location checks, the backend stays very light.

| Layer | Choice | Notes |
| --- | --- | --- |
| App | Next.js (App Router, TypeScript) | One responsive site for phone and desktop browsers |
| UI | shadcn/ui + Tailwind CSS | Copy-in components (Radix-based), mobile-first layouts, themeable for the passport/stamp look |
| Map | react-three-fiber + drei (three.js) with d3-geo and simplified GeoJSON | 3D extruded polygons, one mesh per area; client-side only (dynamic import, no SSR); flat 2D and list fallback for weak devices |
| Data fetching | TanStack Query | Caches spots and progress; no heavy global store needed |
| Auth | Supabase Auth | Google and email sign-in via @supabase/ssr; the Supabase user id is stored on the Prisma user record |
| Database | Neon (serverless Postgres) | Users, spots, stamps, badges; free tier covers the pilot; use the pooled connection string on Vercel |
| ORM | Prisma | Typed schema and migrations; use the Neon serverless driver adapter |
| Progress logic | Next.js server actions (Prisma) | Recomputes completion % when a spot is marked or unmarked, using weighted SQL aggregates |
| Images | Supabase Storage | Spot photos |
| Hosting | Vercel | Free tier covers the pilot |

A stamp record holds only the user and the spot: no location and no time.

## Future monetization (not a goal yet)

Money comes after users; these are options to keep in mind so early design doesn't block them.

- **Sponsored rewards:** cafés, resorts and shops offer a discount for a stamp or badge, and pay for placement.
- **Partner QR stamps:** businesses pay to become a collectible spot with a special stamp.
- **Premium passport:** cosmetic stamp styles, offline maps, detailed travel stats.
- **Printed passport book:** a physical souvenir of your stamps.
- **Tourism partnerships:** once there's real usage data, LGU tourism offices become a natural customer.

## Risks and open questions

The biggest risk is that people try it once on a trip and never open it again.

| Risk | Mitigation |
| --- | --- |
| Low repeat use between trips | Weekly local challenges and nearby spots for locals |
| People marking spots they never visited | Accept it for now, since the main reward is personal; friends-only leaderboards; QR stamps later where proof matters |
| Poor or wrong spot data | Small curated pilot area; user reports to fix errors |
| Safety: spots in risky or private places | Only public, accessible spots; a report button on every spot |
| Privacy | No location or time is stored; private profiles by default |
| No signal in remote areas | Queue marks locally in the browser (IndexedDB) and sync when back online; make the site an installable PWA later so it opens without signal |
| 3D map is heavy or hard to use on budget phones | Simplified meshes, city detail loaded on zoom, limited tilt, and a flat 2D and list fallback |

**Open questions**

- [x] Final app name: decided, ExplorePH
- [ ] How many spots to seed for Davao City before launch
- [ ] Should friends see your marked spots by default?

## Project instructions (for a Claude Project or CLAUDE.md)

```markdown
Project: ExplorePH, a gamified Philippine exploration tracker.

Goal: Make exploring fun for locals and tourists. Users visit real places, tap a button to mark them visited, earn stamps in a digital passport, and fill in cities on a map. Selling to LGUs is NOT a current goal; focus on a fun, sticky consumer app first.

Key decisions:
- Map polygons go down to city/municipality level only. Inside a city, completion = notable spots stamped.
- Spots are weighted: cities with more spots count for more.
- Towns with no famous spots get baseline anchors (church, plaza, municipal hall).
- Marking a spot is one tap ("Mark as visited"), tap again to undo. No GPS, no location checks, no timestamps. QR stamps at partner spots may come later.
- Stamps are honor-based, so leaderboards are friends-only.
- Pilot area: Davao City, then Davao Region.
- Main feature: interactive 3D map shaped like the Philippines (tilted flat map, not a globe; limited tilt/rotation; zoom country > region/province > city > spot). Color and extrusion height follow completion %. Keep a flat 2D and list fallback for low-end phones.
- Platform: mobile-first website for now (native app maybe later).
- Stack: Next.js (App Router, TypeScript), shadcn/ui + Tailwind CSS, react-three-fiber + drei (3D map), TanStack Query, Neon (Postgres) with Prisma, Supabase (Auth and Storage), server actions for progress logic, hosted on Vercel. No Google Maps API.

MVP: sign-in, 3D Philippines map with filling polygons, spot list, one-tap mark as visited, passport view, city completion %, basic badges, shareable trip card.

How to help me: think like a product owner and a developer. Push back on scope creep, keep the MVP small, and flag privacy issues.
```
