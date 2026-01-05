# MPN Conductor Standalone Extraction: ICE Analysis

**Document ID:** MPN-EXTRACTION-ANALYSIS-2026-01-01  
**Date:** 2026-01-01  
**Classification:** PLANNING ONLY - NO MODIFICATIONS APPROVED  
**Author:** AI Research Assistant  

---

> [!CAUTION]
> This is an **ANALYSIS ONLY** document. No modifications or file changes should be made based on this document without explicit user approval.

---

## 1. Executive Summary

Extracting the MPN Conductor application into a standalone Docker container is a **MEDIUM complexity** effort estimated at **24-40 developer hours** for a functional MVP. The primary challenges involve:

1. **Branding decoupling** - OXOT-specific components need replacement
2. **Shared layout extraction** - `TerminalFrame`, `BackgroundEffect` are part of the monolith
3. **Dependencies isolation** - Trimming 50% of `package.json` dependencies
4. **Documentation bundling** - 302 theory files (7.1MB) need to be included

---

## 2. Complete File Inventory

### 2.1 Required Source Files

| Category | Location | Files | Size | Notes |
|----------|----------|-------|------|-------|
| **App Pages** | `src/app/` | 3 | ~95KB | mpn-conductor, mpn-reference, mpn-lab |
| **MPN Components** | `src/components/mpn-lab/` | 44 | 572KB | Core visualization and orchestration |
| **Branding (need rewrite)** | `src/components/branding/` | 6 | ~15KB | OXOTLogo, PageHeader, etc. |
| **Shared Layout** | `src/components/` | 2 | ~10KB | TerminalFrame, BackgroundEffect |
| **Lib Utilities** | `src/lib/` | 3 | ~17KB | ai_music_client, db, openrouter_client |
| **Theory Docs** | `mckenney-lacan_theory/` | 302 | 7.1MB | Full theory wiki |
| **Python Engine** | `mpn_engine/` | 37 | 348KB | Core calculus (optional) |
| **Config Files** | root | 8 | ~10KB | package.json, tsconfig, next.config, etc. |
| **Styles** | `src/app/` | 1 | ~20KB | globals.css |

**Total: ~90 files, ~9.1MB**

### 2.2 Files That Require Modification

| File | Current State | Required Change |
|------|--------------|-----------------|
| `layout.tsx` | Uses OXOT TerminalFrame | Create new MPN-specific layout |
| `globals.css` | Contains OXOT theme colors | Extract MPN-relevant styles only |
| `OXOTLogo.tsx` | OXOT branding | Replace with MPN/generic logo |
| `PageHeader.tsx` | Generic but imports OXOT theme | Update theme references |
| `page.tsx` (conductor) | Imports OXOTLogo | Update to MPN branding |
| `page.tsx` (reference) | Imports OXOTLogo | Update to MPN branding |
| `next.config.ts` | May have OXOT-specific rewrites | Clean up |

### 2.3 Dependencies Analysis

**Required Dependencies (keep):**
```json
{
  "@react-three/drei": "^10.7.7",
  "@react-three/fiber": "^9.4.2",
  "framer-motion": "^12.23.26",
  "lucide-react": "^0.562.0",
  "next": "16.1.1",
  "pg": "^8.16.3",
  "react": "19.2.3",
  "react-dom": "19.2.3",
  "recharts": "^3.6.0",
  "three": "^0.182.0",
  "tone": "^15.1.22",
  "zustand": "^5.0.9",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.4.0"
}
```

**Additional Visualization Dependencies (KEEP ALL):**
```json
{
  "@nivo/bar": "^0.99.0",
  "@nivo/radar": "^0.99.0",
  "@qdrant/js-client-rest": "^1.16.2",
  "neo4j-driver": "^6.0.1",
  "react-globe.gl": "^2.37.0",
  "react-simple-maps": "^3.0.0",
  "jspdf": "^3.0.4",
  "gsap": "^3.14.2",
  "@gsap/react": "^2.1.2",
  "react-scroll": "^1.9.3",
  "@xyflow/react": "^12.10.0"
}
```

> [!IMPORTANT]
> All visualization dependencies are REQUIRED for MPN Conductor visualizations including globe views, flow diagrams, radar charts, and animation effects.

**Dependency Status: FULL COPY of package.json**

---

## 3. ICE Scoring Matrix

| # | Work Item | Impact (1-10) | Confidence (1-10) | Effort (hours) | ICE Score | Priority |
|---|-----------|---------------|-------------------|----------------|-----------|----------|
| 1 | **Create new Next.js project scaffold** | 8 | 10 | 2 | 80 | HIGH |
| 2 | **Copy & clean MPN components** | 9 | 9 | 3 | 81 | HIGH |
| 3 | **Rewrite branding components** | 7 | 8 | 2 | 56 | MEDIUM |
| 4 | **Create standalone layout.tsx** | 8 | 9 | 1 | 72 | HIGH |
| 5 | **Extract & clean globals.css** | 6 | 7 | 2 | 42 | MEDIUM |
| 6 | **Copy lib/ utilities** | 7 | 10 | 0.5 | 70 | HIGH |
| 7 | **Copy theory documentation** | 6 | 10 | 0.5 | 60 | MEDIUM |
| 8 | **Create Dockerfile** | 9 | 9 | 2 | 81 | HIGH |
| 9 | **Create docker-compose.yml** | 8 | 9 | 1 | 72 | HIGH |
| 10 | **Write .env.example** | 5 | 10 | 0.5 | 50 | MEDIUM |
| 11 | **Test & debug integration** | 10 | 6 | 8 | 60 | HIGH |
| 12 | **Documentation & README** | 6 | 9 | 2 | 54 | MEDIUM |

**Total Estimated Effort: 24.5 hours (optimistic) to 40 hours (with debugging)**

---

## 4. Implementation Steps (Detailed)

### Step 1: Project Scaffolding (2 hours)

```bash
# Create new project
npx create-next-app@latest mpn-conductor-standalone --typescript --tailwind --eslint --app

# Directory structure
mpn-conductor-standalone/
├── src/
│   ├── app/
│   │   ├── mpn-conductor/
│   │   ├── mpn-reference/
│   │   ├── mpn-lab/
│   │   ├── layout.tsx        # NEW - MPN-specific
│   │   ├── page.tsx          # Landing/redirect
│   │   └── globals.css       # Cleaned
│   ├── components/
│   │   ├── mpn-lab/          # COPIED
│   │   └── branding/         # REWRITTEN
│   └── lib/                  # COPIED
├── public/
│   └── theory/               # Theory docs served statically
├── mpn_engine/               # Optional Python module
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

### Step 2: Source File Extraction (3 hours)

**Copy operations:**
```bash
# MPN Components (44 files)
cp -r Site-OXOT_v2/src/components/mpn-lab/ mpn-conductor-standalone/src/components/

# App pages (3 directories)
cp -r Site-OXOT_v2/src/app/mpn-conductor/ mpn-conductor-standalone/src/app/
cp -r Site-OXOT_v2/src/app/mpn-reference/ mpn-conductor-standalone/src/app/
cp -r Site-OXOT_v2/src/app/mpn-lab/ mpn-conductor-standalone/src/app/

# Lib utilities (3 files)
cp -r Site-OXOT_v2/src/lib/ mpn-conductor-standalone/src/

# Theory documentation
cp -r Site-OXOT_v2/mckenney-lacan_theory/ mpn-conductor-standalone/public/theory/

# Python engine (optional)
cp -r Site-OXOT_v2/mpn_engine/ mpn-conductor-standalone/
```

**Required import path updates:**
- All `@/components/branding/` imports need updating
- Verify all `@/lib/` imports resolve

### Step 3: Branding Component Rewrite (2 hours)

Create new generic/MPN-branded versions:

**`src/components/branding/MPNLogo.tsx` (new):**
```typescript
export function MPNLogo({ className }: { className?: string }) {
    return (
        <div className={cn("font-bold text-2xl", className)}>
            <span className="text-gold">MPN</span>
            <span className="text-white/60 text-sm ml-2">Conductor</span>
        </div>
    );
}
```

**`src/components/branding/PageHeader.tsx` (modify):**
- Remove OXOT-specific theme references
- Update to MPN color scheme (gold accent)

**Update import statements in app pages:**
```typescript
// Before
import { OXOTLogo } from '@/components/branding/OXOTLogo';

// After
import { MPNLogo } from '@/components/branding/MPNLogo';
```

### Step 4: Layout & Styling (3 hours)

**New `src/app/layout.tsx`:**
```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
    title: "MPN Conductor | Musical Psychometric Notation",
    description: "Transform psychological states into real-time musical scores",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-white`}>
                <main className="min-h-screen">
                    {children}
                </main>
            </body>
        </html>
    );
}
```

**Extract required CSS from globals.css:**
- Keep Tailwind base/components/utilities
- Keep color definitions (gold, charcoal, etc.)
- Remove OXOT-specific component styles

### Step 5: Dockerfile Configuration (2 hours)

**`Dockerfile`:**
```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

**`docker-compose.yml`:**
```yaml
version: '3.8'

services:
  mpn-conductor:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3001:3000"
    environment:
      - OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
      - HUGGINGFACE_API_KEY=${HUGGINGFACE_API_KEY}
      - ELEVENLABS_API_KEY=${ELEVENLABS_API_KEY}
      - DATABASE_URL=postgresql://mpn_user:mpn_secure_password@postgres:5432/mpn_conductor
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped
    networks:
      - mpn-network

  # Local PostgreSQL Database (REQUIRED)
  postgres:
    image: postgres:15-alpine
    container_name: mpn-postgres
    environment:
      POSTGRES_USER: mpn_user
      POSTGRES_PASSWORD: mpn_secure_password
      POSTGRES_DB: mpn_conductor
    volumes:
      - mpn-db-data:/var/lib/postgresql/data
      - ./scripts/init_db.sql:/docker-entrypoint-initdb.d/01_init.sql:ro
    ports:
      - "5433:5432"  # External port 5433 to avoid conflicts
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U mpn_user -d mpn_conductor"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - mpn-network

networks:
  mpn-network:
    driver: bridge

volumes:
  mpn-db-data:
```

**`scripts/init_db.sql` (Database Initialization):**
```sql
-- MPN Conductor Database Schema
-- Auto-executed on first container start

-- Scores table
CREATE TABLE IF NOT EXISTS scores (
    id SERIAL PRIMARY KEY,
    scenario_id VARCHAR(255) NOT NULL,
    frame_index INTEGER NOT NULL,
    trauma FLOAT NOT NULL,
    entropy FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Actor profiles table  
CREATE TABLE IF NOT EXISTS actor_profiles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    disc_d FLOAT DEFAULT 0.5,
    disc_i FLOAT DEFAULT 0.5,
    disc_s FLOAT DEFAULT 0.5,
    disc_c FLOAT DEFAULT 0.5,
    dark_triad_mach FLOAT DEFAULT 0.3,
    dark_triad_narc FLOAT DEFAULT 0.3,
    dark_triad_psych FLOAT DEFAULT 0.3,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Presets table
CREATE TABLE IF NOT EXISTS presets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    adjustments JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO mpn_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO mpn_user;
```

### Step 6: Testing & Verification (8 hours)

**Verification Checklist:**
- [ ] `/mpn-conductor` page loads with all visualizations
- [ ] `/mpn-reference` page loads with all 55 reference entries
- [ ] `/mpn-lab` page loads with scenario driver
- [ ] Audio playback works (Tone.js)
- [ ] AI integration works (when enabled)
- [ ] Theory docs accessible via `/theory/` route
- [ ] Docker container builds successfully
- [ ] Container runs without errors
- [ ] Environment variables properly injected

---

## 5. Risk Analysis

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Branding references missed** | Medium | Medium | grep search for "OXOT" before final |
| **CSS conflicts after extraction** | Medium | Low | Test all pages visually |
| **3D component failures** | Low | High | Test R3F components in container |
| **Database connection issues** | Medium | Medium | Local PostgreSQL container included |
| **Missing dependencies** | Low | Medium | Run build before Docker |
| **Theory doc routing issues** | Low | Low | Test static file serving |
| **API key misconfiguration** | Medium | High | .env.example with all required keys |
| **OpenRouter rate limits** | Low | Medium | Fallback to local LM Studio option |
| **HuggingFace model loading** | Low | Medium | Warm-up script in docker-compose |

---

## 5.1 Required API Keys & Services

| Service | Environment Variable | Purpose | Status |
|---------|---------------------|---------|--------|
| **OpenRouter** | `OPENROUTER_API_KEY` | LLM gateway for psychometric analysis | ✅ Configured |
| **HuggingFace** | `HUGGINGFACE_API_KEY` | MusicGen audio generation | ✅ Configured |
| **ElevenLabs** | `ELEVENLABS_API_KEY` | Text-to-Speech narration | ✅ Configured |
| **PostgreSQL** | `DATABASE_URL` | Local database for scores/profiles | ✅ Included in docker-compose |

**`.env.example` Contents:**
```bash
# ============================================
# MPN Conductor Standalone - Environment
# ============================================

# OpenRouter (Required - Primary LLM)
OPENROUTER_API_KEY=sk-or-v1-your-key-here

# HuggingFace (Required - Audio Generation)
HUGGINGFACE_API_KEY=hf_your-key-here

# ElevenLabs (Required - Text-to-Speech)
ELEVENLABS_API_KEY=sk_your-key-here

# PostgreSQL (Auto-configured by docker-compose)
DATABASE_URL=postgresql://mpn_user:mpn_secure_password@postgres:5432/mpn_conductor

# Optional: OpenAI Fallback
OPENAI_API_KEY=sk-proj-your-key-here
```

---

## 6. Effort Summary

| Phase | Optimistic | Realistic | Pessimistic |
|-------|-----------|-----------|-------------|
| Scaffolding | 2h | 2h | 3h |
| Source extraction | 3h | 4h | 6h |
| Branding rewrite | 2h | 3h | 4h |
| Layout/styling | 3h | 4h | 6h |
| Docker config | 2h | 3h | 4h |
| Testing/debugging | 8h | 12h | 16h |
| Documentation | 2h | 2h | 3h |
| **TOTAL** | **22h** | **30h** | **42h** |

---

## 7. Recommended Approach (Prioritized by ICE)

1. **HIGH Priority (ICE ≥ 70):**
   - Create project scaffold
   - Copy MPN components
   - Create Dockerfile
   - Create docker-compose.yml
   - Create standalone layout
   - Copy lib utilities

2. **MEDIUM Priority (ICE 50-69):**
   - Copy theory documentation
   - Rewrite branding components
   - Extract clean globals.css
   - Write .env.example
   - Test and debug

3. **LOW Priority (post-MVP):**
   - CI/CD pipeline setup
   - Production optimizations
   - Multi-environment configs

---

## 8. Alternative Approaches

### Option A: Monorepo with Shared Packages (Higher Effort)
- Use Turborepo or Nx
- Extract shared components to packages
- Both OXOT and MPN apps consume shared code
- **Effort: +50% but better long-term**

### Option B: Git Subtree/Submodule (Medium Effort)
- Keep MPN as subtree of OXOT repo
- Build separately for standalone deployment
- **Effort: Similar to main plan**

### Option C: Full Fork (Lowest Effort, Highest Debt)
- Complete copy of OXOT repo
- Delete non-MPN files
- **Effort: -30% but creates maintenance burden**

---

## 9. Files Reference Table

| File | Copy | Modify | Create | Size |
|------|------|--------|--------|------|
| `src/app/mpn-conductor/page.tsx` | ✓ | ✓ | | 35KB |
| `src/app/mpn-reference/page.tsx` | ✓ | ✓ | | 39KB |
| `src/app/mpn-lab/page.tsx` | ✓ | ✓ | | 20KB |
| `src/app/layout.tsx` | | | ✓ | ~1KB |
| `src/app/globals.css` | ✓ | ✓ | | ~20KB |
| `src/components/mpn-lab/*` (44 files) | ✓ | | | 572KB |
| `src/components/branding/MPNLogo.tsx` | | | ✓ | ~1KB |
| `src/components/branding/PageHeader.tsx` | ✓ | ✓ | | ~3KB |
| `src/lib/ai_music_client.ts` | ✓ | | | 7KB |
| `src/lib/db.ts` | ✓ | | | 1KB |
| `src/lib/openrouter_client.ts` | ✓ | ✓ | | 10KB |
| `mckenney-lacan_theory/*` (302 files) | ✓ | | | 7.1MB |
| `mpn_engine/*` (37 files) | ✓ | | | 348KB |
| `Dockerfile` | | | ✓ | ~1KB |
| `docker-compose.yml` | | | ✓ | ~1KB |
| `.env.example` | | | ✓ | ~0.5KB |
| `package.json` | | | ✓ | ~1KB |
| `next.config.ts` | ✓ | ✓ | | ~0.5KB |
| `tsconfig.json` | ✓ | | | ~1KB |

---

**Document Status:** ANALYSIS COMPLETE  
**Action Required:** User approval before any implementation  
**Estimated Completion:** 3-5 working days
