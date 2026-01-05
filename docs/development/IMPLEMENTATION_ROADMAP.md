# MPN Implementation Roadmap v3.2

**Last Updated:** 2026-01-04 13:15 CST  
**Status:** Active Development

---

## Executive Summary

This document tracks the implementation phases for the Musical Psychometric Notation (MPN) system. It should be kept in sync with development progress.

---

## ✅ Phase 1: Core Export System (COMPLETE)

- [x] MP3 Export (`src/lib/audio_exporter.ts`)
- [x] MIDI Export (`src/lib/midi_writer.ts`)
- [x] WebWorker Orchestration (`src/workers/orchestrator.worker.ts`)
- [x] UI Integration (Export buttons in conductor)

---

## ✅ Phase 1B: Deep Enhancement (COMPLETE)

- [x] Leitmotif Transformation Rules (`src/lib/leitmotif_transformation_rules.ts`)
  - Modal transformation (RSI → Mode)
  - Fragmentation algorithm (Williams/Shore)
  - Contrapuntal layering
  - Integration with GeniusComposer
- [x] Emotional TTS Framework (`src/lib/emotional_tts_renderer.ts`)
  - Multi-provider support (Azure, ElevenLabs, Bark)
  - GST-based emotion mapping
  - SSML generation
- [x] PostgreSQL Optimization (`scripts/deep_postgres_optimization.sql`)
  - GIN indexes for JSONB
  - Full-text search
  - Audit logging
- [x] Character Schema (`scripts/enhanced_character_schema.sql`)
  - Complete persona tables
  - 6 AI expert agents
  - Relationship graph

---

## ✅ Phase 2: Real Instrument Integration (COMPLETE)

### 2.1 Instrument Sample Integration

**Priority:** HIGH  
**Status:** ✅ COMPLETE

**Files implemented:**
- `src/components/mpn-lab/MPNSynthesizer.ts` - Loads 12 instrument samplers
- `src/lib/psychometric_instrument_mapper.ts` - DISC/RSI → instrument selection
- `src/components/mpn-lab/score_orchestrator.ts` - Dynamic selection during processing

**Verified:**
- [x] 12 instrument samplers loaded (violin, cello, bass, trumpet, trombone, french_horn, tuba, flute, clarinet, oboe, bassoon, piano)
- [x] `selectInstrumentForActor` called in `registerActor` (line 187)
- [x] Dynamic re-selection during `processFrame` (line 264)
- [x] Fallback synth logic when samples unavailable
- [x] 7/7 psychometric_instrument tests passing

### 2.2 Psychometric → Instrument Mapping

**Algorithm (verified working):**
1. Base DISC matching (40% weight)
2. Trauma modifier (20% weight) - High trauma → real register
3. Entropy modifier (20% weight) - High entropy → woodwinds
4. RSI register alignment (20% weight)

---

## 🔲 Phase 3: AI Model Integration

### 3.1 Text2midi API

**Priority:** MEDIUM

**Tasks:**
- [ ] Create `src/lib/text2midi_client.ts`
- [ ] Build psychometric → prompt converter
- [ ] Add fallback when API unavailable
- [ ] Integrate into GeniusComposer

### 3.2 OpenRouter/MusicGen

**Tasks:**
- [ ] Extend `openrouter_client.ts` for music prompts
- [ ] Create harmony suggestion endpoint
- [ ] A/B test AI vs algorithmic composition

---

## 🔲 Phase 4: UI Enhancements

### 4.1 ActorInstrumentPicker Component

**Priority:** MEDIUM

Create intuitive instrument selection per actor:
- AI suggestion badge
- Manual override dropdown
- Psychometric justification tooltip

**Location:** `src/components/mpn-lab/ActorInstrumentPicker.tsx`

### 4.2 Orchestration Level Selector

Working implementation exists in reference page, needs conductor integration.

---

## 🔲 Phase 5: Voice System

### 5.1 Azure Speech Integration

**Tasks:**
- [ ] Configure `AZURE_SPEECH_KEY` and `AZURE_SPEECH_REGION`
- [ ] A/B test Azure vs ElevenLabs quality
- [ ] Implement voice ducking (lower music during speech)

### 5.2 Multi-Provider Fallback

Emotional TTS renderer supports:
1. Azure Speech (primary, SSML)
2. ElevenLabs (secondary)
3. Bark/XTTS (local fallback)

---

## 📊 Progress Tracking

| Phase | Status | Completion |
|-------|--------|------------|
| Phase 1: Export | ✅ DONE | 100% |
| Phase 1B: Enhancement | ✅ DONE | 100% |
| Phase 2: Instruments | 🔄 IN PROGRESS | 20% |
| Phase 3: AI Integration | 🔲 PLANNED | 0% |
| Phase 4: UI Enhancements | 🔲 PLANNED | 0% |
| Phase 5: Voice System | 🔲 PLANNED | 0% |

---

## Critical Files Reference

| Purpose | File Path |
|---------|-----------|
| Main Conductor | `src/app/mpn-conductor/page.tsx` |
| Score Orchestrator | `src/components/mpn-lab/ScoreOrchestrator.ts` |
| Melody Generator | `src/components/mpn-lab/GeniusComposer.ts` |
| Audio Synthesizer | `src/components/mpn-lab/MPNSynthesizer.ts` |
| Leitmotif Rules | `src/lib/leitmotif_transformation_rules.ts` |
| Reference Data | `src/components/mpn-lab/mpn_reference_data.ts` |
| WebWorker | `src/workers/orchestrator.worker.ts` |

---

## Database Migrations

Run in order:
```bash
psql -d mpn_conductor -f scripts/deep_postgres_optimization.sql
psql -d mpn_conductor -f scripts/enhanced_character_schema.sql
```

---

## Notes for AI Developers

When Antigravity or another AI continues development:

1. **Read this file first** to understand current state
2. **Check `/wiki`** for detailed documentation
3. **Review `mpn_reference_data.ts`** (3556 lines) for all mappings
4. **Test with build** before committing: `npm run build`
5. **Update this roadmap** after completing tasks

---

**Next Priority:** Complete Phase 2 - Wire up real instrument samples
