# PostgreSQL Integration & Enhancement Plan

## Status Overview

### Current Implementation ✅
1. **Play Library Wizard**: EXISTS with 8 style presets
   - Orchestral, Jazz, Minimalist, Avant-Garde, Chamber, Electronic, Baroque, Romantic
   - Step-by-step workflow: Import → Read → Select Style → Process
   - PostgreSQL backend for script storage (`/api/plays`)
   
2. **Database**: Basic PostgreSQL setup
   - Schema: `plays` table (id, title, author, theme, source_text, processed_data, is_processed)
   - Connection: `src/lib/db.ts`
   - Init script: `scripts/init_db.sql`

### Missing Features (From Original Plan)

#### 1. Extended Orchestration Modes
**User Requested**: Full Orchestra, Chamber Death, Jazz Noir, Wagnerian, Minimalist Void, Cyber Glitch

**Currently Available**: 8 generic styles
**Gap**: Missing the psychometric-specific orchestration modes mentioned in `GeniusComposer.ts`:

```typescript
// FROM: GeniusComposer.ts ORCHESTRATION_MODES
export enum OrchestrationMode {
    FULL_ORCHESTRA = '🎭 Full Orchestra',
    CHAMBER_QUARTET = '🎻 Chamber Quartet',
    SOLO_PIANO = '🎹 Solo Piano',
    BRASS_ENSEMBLE = '🎺 Brass Ensemble',
    STRINGS_ONLY = '🎵 Strings Only',
    LEITMOTIF_WAGNERIAN = '🐉 Leitmotif (Wagnerian)',
    MINIMALIST_GLASS = '⏱️ Minimalist (Glass)',
}
```

**Action Required**:
- [ ] Merge `styles.ts` STYLE_PRESETS with `GeniusComposer.ts` ORCHESTRATION_MODES
- [ ] Add user-requested modes: "Chamber Death", "Jazz Noir", "Cyber Glitch"
- [ ] Link style selection to actual orchestration engine in `GeniusComposer`

#### 2. PostgreSQL Advanced Features

**Not Implemented (From IMPLEMENTATION_PLAN.md Line 279-280)**:
```bash
# Optional: Database
DATABASE_URL=postgresql://mpn_user:mpn_pass@localhost:5432/mpn_conductor
```

**Gap Analysis**:
- ✅ Basic connection exists
- ❌ pgvector extension NOT enabled
- ❌ No vector embeddings for scenarios
- ❌ No semantic search capability
- ❌ No vector-based AI integration

**Missing Tables**:
```sql
-- Not in current schema:
CREATE TABLE IF NOT EXISTS embeddings (
    id SERIAL PRIMARY KEY,
    play_id UUID REFERENCES plays(id),
    frame_index INT,
    embedding vector(1536),  -- OpenAI ada-002 dimension
    content_text TEXT,
    metadata JSONB
);

CREATE INDEX ON embeddings USING ivfflat (embedding vector_cosine_ops);
```

#### 3. AI Integration Points

**Partially Implemented**:
- ✅ OpenRouter client exists (`src/lib/ai/openrouter_client.ts`)
- ✅ HuggingFace models referenced in theory docs
- ❌ NOT connected to database/vector storage
- ❌ No persistent embedding generation
- ❌ No vector-based scenario retrieval

**Missing Workflows**:
1. Script upload → Generate embeddings → Store in pgvector
2. Scenario search → Use semantic similarity instead of text match
3. AI melody generation → Query similar past melodies via vector search
4. Psychometric clustering → Group similar emotional states

---

## Enhancement Roadmap

### Phase 1: Orchestration Mode Alignment

**Goal**: Unify style selection with orchestration engine

#### Tasks:
1. **Update `styles.ts`** to match `ORCHESTRATION_MODES`:
   ```typescript
   export const STYLE_PRESETS = {
       'full_orchestra': { /* map to FULL_ORCHESTRA */ },
       'chamber_death': { /* NEW: dark chamber with trauma emphasis */ },
       'jazz_noir': { /* NEW: dark jazz, film noir aesthetic */ },
       'wagnerian': { /* map to LEITMOTIF_WAGNERIAN */ },
       'minimalist_void': { /* map to MINIMALIST_GLASS + sparse */ },
       'cyber_glitch': { /* NEW: electronic + high entropy */ },
   }
   ```

2. **Connect to GeniusComposer**: Modify `/api/process-play` to:
   ```typescript
   const styleConfig = STYLE_PRESETS[styleId];
   const orchestrationMode = mapStyleToMode(styleId);
   composer.setOrchestrationMode(orchestrationMode);
   ```

3. **Update ScriptProcessor UI**: Add aesthetic previews for each mode

### Phase 2: PostgreSQL pgvector Integration

**Goal**: Enable semantic search and AI-driven features

#### Setup Tasks:
1. **Enable pgvector Extension**:
   ```sql
   -- Run in PostgreSQL
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

2. **Create Embedding Tables**:
   ```sql
   CREATE TABLE embeddings (
       id SERIAL PRIMARY KEY,
       play_id UUID REFERENCES plays(id) ON DELETE CASCADE,
       frame_index INT,
       embedding_type VARCHAR(50), -- 'script', 'melody', 'psychometric'
       embedding vector(1536),
       content_text TEXT,
       metadata JSONB,
       created_at TIMESTAMP DEFAULT NOW()
   );

   CREATE INDEX ON embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
   ```

3. **Add Embedding Generation API**:
   ```typescript
   // /api/embeddings/generate
   POST { playId, text } → OpenAI embedding → Store in DB
   ```

4. **Semantic Search API**:
   ```typescript
   // /api/search/semantic
   POST { query } → Generate query embedding → Similarity search
   ```

#### Integration Points:
- **Script Upload**: Auto-generate embeddings during processing
- **Scenario Search**: Replace text search with vector similarity
- **AI Melody**: Query past melodies with similar psychometric states
- **Psychometric Clustering**: Group frames by emotional similarity

### Phase 3: Hero Text & Documentation Updates

**Goal**: Reflect current capabilities accurately

#### Conductor Page Hero (`src/app/mpn-conductor/page.tsx:348-356`):

**Current** (Outdated):
```
Multi-stave musical score generation from psychometric analysis.
Each actor receives a unique stave driven by DISC, OCEAN, Dark Triad,
and cognitive bias profiles.
```

**Proposed** (Comprehensive):
```
Real-Time Orchestral Psychometric Notation Engine

Transform literary scripts into living musical scores using:
• 151-entry psychometric dictionary (DISC, OCEAN, Dark Triad, Lacanian Registers)
• 7 orchestration modes with dynamic voice leading
• Multi-stave conductor view with 4-frame look-ahead
• AI-enhanced melody generation via OpenRouter
• Trauma-entropy crisis detection with Lyapunov stability analysis
```

#### Implementation Plan (`IMPLEMENTATION_PLAN.md`):
- Update LINE 226: ~~"Custom Scenarios | Upload/create new literary scenarios"~~ → **COMPLETED**
- Update LINE 227: ~~"Multi-measure Display | Show 4-8 bars in VexFlow"~~ → **COMPLETED**  
- Add LINE 232: **NEW PRIORITY HIGH**: "pgvector Semantic Search | Vector-based scenario retrieval"

---

## Technical Architecture

### New Services

```
┌─────────────────────────────────────────────────────────┐
│                 MPN CONDUCTOR STACK                     │
├─────────────────────────────────────────────────────────┤
│  PRESENTATION    Next.js 16.1 / React 19 / Tailwind 4  │
│  ORCHESTRATION   ScoreOrchestrator, GeniusComposer     │
│  CALCULUS        PsychometricCalculus, ReferenceLookup │
│  AI LAYER        OpenRouter, pgvector, HuggingFace ← NEW
│  OUTPUT          Tone.js, Three.js, Nivo, XYFlow       │
│  INFRASTRUCTURE  Docker, PostgreSQL+pgvector, Tests ← ENHANCED
└─────────────────────────────────────────────────────────┘
```

### Database Schema Evolution

```sql
-- CURRENT
plays (id, title, author, theme, source_text, processed_data, is_processed, created_at)

-- PROPOSED
plays (↑ same ↑)
embeddings (id, play_id, frame_index, embedding_type, embedding, content_text, metadata)
psychometric_clusters (id, centroid_embedding, cluster_label, member_count)
ai_generations (id, prompt, model, response, embedding, created_at)
```

---

## Implementation Checklist

### Immediate (This Session)
- [x] Analyze current state
- [ ] Update hero text on conductor page
- [ ] Add missing orchestration modes to `styles.ts`
- [ ] Document pgvector setup steps

### Short-Term (Next Session)
- [ ] Install pgvector extension
- [ ] Create embedding tables
- [ ] Build `/api/embeddings/generate` endpoint
- [ ] Connect OpenRouter to embedding generation
- [ ] Test semantic search with sample data

### Long-Term
- [ ] Migrate all existing plays to have embeddings
- [ ] Build psychometric clustering visualization
- [ ] Add "Similar Scenarios" recommendation engine
- [ ] Implement vector-based melody retrieval
- [ ] Create embedding analytics dashboard

---

## Questions for User

1. **PostgreSQL Access**: Do you have admin access to enable pgvector extension?
2. **OpenAI Key**: Is `OPENROUTER_API_KEY` configured for embedding generation?
3. **Mode Priority**: Which new modes are highest priority: Chamber Death, Jazz Noir, or Cyber Glitch?
4. **Storage**: Should embeddings be generated retroactively for existing scenarios?

---

*Status: Planning Complete | Next: Await user approval for implementation priority*
