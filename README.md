# NC Foreclosure Platform

A dynamic Next.js application for tracking and exploring foreclosure properties across 26 North Carolina counties. Features an interactive map with color-coded pins, advanced filtering, county GIS portal links, and a freemium subscription model.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black)

## Features

- **Interactive Map** — All properties plotted on a Leaflet.js map with 4 switchable themes (Light, Dark, Midnight, Nature)
- **Advanced Filtering** — Filter by county, property type, source, or search by address/parcel/owner
- **Color-Coded Pins** — Properties colored by type (Residential, Commercial, Acreage, Mixed)
- **Source Badges** — Visual indicators for each data source (Kania Law Firm, RBCWB, County Attorney)
- **County GIS Links** — Direct links to county GIS portals; Mecklenburg parcels link directly to Polaris3G
- **Property Details** — Slide-out panel with bid amounts, sale dates, court files, and more
- **Freemium Model** — Free tier shows basic info; paid tiers unlock owner names, assessed values, zoning
- **Supabase Backend** — All property data stored in PostgreSQL with RLS, full-text search, and auto-timestamps

## Data Sources

| Source | Coverage | Properties |
|--------|----------|-----------|
| Kania Law Firm | 26 NC Counties | 243 |
| Ruff, Bond, Cobb, Wade & Bethune | Mecklenburg County | 2 |
| Office of the County Attorney | Mecklenburg County (In Rem) | 1 |

**Total: 246 properties across 26 counties**

## Tech Stack

- **Frontend:** Next.js 14 + React 18 + Tailwind CSS
- **Map:** Leaflet.js + react-leaflet + CartoDB basemaps
- **Database:** Supabase (PostgreSQL) with Row-Level Security
- **Hosting:** Vercel (auto-deploy from GitHub)
- **Data Enrichment:** Regrid API + NC OneMap (planned)

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project ([supabase.com](https://supabase.com))
- A Vercel account ([vercel.com](https://vercel.com))

### 1. Clone & Install

```bash
git clone https://github.com/OneHourVideo7/nc-foreclosure-platform.git
cd nc-foreclosure-platform
npm install
```

### 2. Set Up Environment

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Set Up Database

Go to your Supabase dashboard → SQL Editor → New Query, and run the contents of `supabase/migration.sql`.

> **Note:** The migration enables the `pg_trgm` extension for fuzzy text search. If it fails, run `CREATE EXTENSION IF NOT EXISTS pg_trgm;` first.

### 4. Seed the Database

```bash
npm run seed
```

This loads all 246 properties from `seed-data.json` into your Supabase `properties` table.

### 5. Run Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo in Vercel
3. Set Framework Preset to **Next.js**
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy

Vercel will auto-deploy on every push to `main`.

## Project Structure

```
nc-foreclosure-platform/
├── public/                  # Static assets
├── scripts/
│   └── seed.mjs             # Database seed script
├── seed-data.json           # 246 properties parsed from spreadsheet
├── src/
│   ├── app/
│   │   ├── api/properties/  # API route for querying properties
│   │   ├── globals.css      # Global styles + Tailwind
│   │   ├── layout.tsx       # Root layout with metadata
│   │   └── page.tsx         # Main page orchestrator
│   ├── components/
│   │   ├── Header.tsx       # Top bar with theme switcher
│   │   ├── MapView.tsx      # Leaflet map with markers
│   │   ├── PricingModal.tsx  # Subscription tier modal
│   │   ├── PropertyDetail.tsx # Slide-out property panel
│   │   └── Sidebar.tsx      # Filter controls + property list
│   └── lib/
│       ├── constants.ts     # GIS links, themes, colors, tiers
│       └── supabase.ts      # Supabase client + types
├── supabase/
│   └── migration.sql        # Database schema + RLS policies
├── .env.example
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Roadmap

- [ ] Regrid API enrichment (owner, value, acres, coordinates, zoning)
- [ ] Stripe payment integration ($29/mo Starter, $79/mo Pro)
- [ ] Broker listing feature
- [ ] Supabase Auth for user accounts
- [ ] Admin spreadsheet upload
- [ ] Additional sources (ZLS, RKS Law Firm, county tax offices)
- [ ] National expansion
- [ ] Custom domain

## Security Notes

- The `service_role` key is only used in the seed script and should never be committed to the repo or exposed client-side
- Row-Level Security is enabled: anonymous users can only SELECT; only `service_role` can INSERT/UPDATE/DELETE
- Environment variables are managed via Vercel's dashboard, never in code

## License

Private — All rights reserved.
