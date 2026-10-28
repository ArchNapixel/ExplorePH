@AGENTS.md

Project: MaPHo, a gamified Philippine exploration tracker. Full brief: @docs/BRIEF.md

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

## Working in this repo

- Commit and push your work to the session's feature branch. Never push to `main`; the user merges.

- Database: Prisma schema in `prisma/schema.prisma`, client in `src/lib/db.ts` (Neon serverless adapter). Env: `DATABASE_URL` (see `.env.example`).
- Build in vertical slices, one per branch: auth → spots + stamps → passport → completion % → 2D map fallback → 3D map → trip card.
- Add a dependency only in the slice that uses it (three/r3f/d3-geo arrive with the map, TanStack Query and Supabase with auth).
