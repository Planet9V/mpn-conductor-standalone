# Complete Plays Integration - Implementation Plan

> **Objective**: Add 12+ complete public domain plays with persistent storage and automated processing

---

## Selected Plays (100% Complete)

| # | Title | Author | Acts | Chars | Psych Value |
|---|-------|--------|------|-------|-------------|
| 1 | Medea | Euripides | 1 | 6 | Revenge, betrayal, rage |
| 2 | Antigone | Sophocles | 1 | 6 | Moral rigidity, duty vs law |
| 3 | Macbeth | Shakespeare | 5 | 7 | Ambition, guilt, madness |
| 4 | Othello | Shakespeare | 5 | 6 | Jealousy, manipulation |
| 5 | King Lear | Shakespeare | 5 | 8 | Ego dissolution, family |
| 6 | A Doll's House | Ibsen | 3 | 5 | Identity crisis, deception |
| 7 | Hedda Gabler | Ibsen | 4 | 5 | Boredom, control, destruction |
| 8 | The Seagull | Chekhov | 4 | 8 | Unrequited love, artistic failure |
| 9 | Three Sisters | Chekhov | 4 | 8 | Longing, stagnation |
| 10 | Uncle Vanya | Chekhov | 4 | 7 | Regret, wasted life |
| 11 | Miss Julie | Strindberg | 1 | 3 | Class, sexuality, power |
| 12 | The Importance of Being Earnest | Wilde | 3 | 6 | Identity, deception, wit |

---

## Storage Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    PostgreSQL Container                  │
├─────────────────────────────────────────────────────────┤
│  plays                                                   │
│  ├── id (UUID PRIMARY KEY)                              │
│  ├── title, author, theme, color                        │
│  ├── full_text (TEXT)          ← Raw complete text      │
│  ├── word_count, act_count                              │
│  ├── created_at, updated_at                             │
│  └── metadata (JSONB)          ← Characters, notes      │
├─────────────────────────────────────────────────────────┤
│  play_frames                                             │
│  ├── id (UUID PRIMARY KEY)                              │
│  ├── play_id (FK → plays.id)                            │
│  ├── frame_index (INT)                                  │
│  ├── act (INT), scene (INT)                             │
│  ├── speaker (VARCHAR)                                  │
│  ├── text (TEXT)               ← Actual dialogue        │
│  ├── trauma, entropy (FLOAT)   ← Pre-computed           │
│  ├── chord, analysis (VARCHAR) ← Generated              │
│  └── focus_layer (INT)                                  │
├─────────────────────────────────────────────────────────┤
│  play_characters                                         │
│  ├── id, play_id, name                                  │
│  ├── disc_d, disc_i, disc_s, disc_c (FLOAT)            │
│  ├── dark_machiavellianism, dark_narcissism,            │
│  │   dark_psychopathy (FLOAT)                           │
│  └── archetype, instrument (VARCHAR)                    │
└─────────────────────────────────────────────────────────┘
```

---

## Processing Pipeline

### Stage 1: Raw Text Acquisition
```
Project Gutenberg → Download → /public/plays/{id}.txt
```

### Stage 2: Parsing & Character Extraction
```python
# Parse play structure
for line in raw_text:
    if is_speaker_cue(line):
        speaker = extract_speaker(line)
        dialogue = extract_dialogue(line)
        frames.append({speaker, dialogue})
```

### Stage 3: Psychometric Pre-computation
For each frame:
1. **Trauma (τ)**: Analyze sentiment, word valence, conflict keywords
2. **Entropy (H)**: Measure dialogue unpredictability, topic shifts
3. **DISC Profile**: Infer from dialogue style per character
4. **Dark Triad**: Detect manipulation, grandiosity, callousness markers
5. **Chord**: Map emotional state → harmonic function

### Stage 4: Database Ingestion
```sql
INSERT INTO plays (title, author, ...)
INSERT INTO play_characters (play_id, name, disc_*)
INSERT INTO play_frames (play_id, frame_index, ...)
```

### Stage 5: Runtime API
```typescript
// API endpoint
GET /api/plays              → List all plays
GET /api/plays/{id}         → Get play metadata
GET /api/plays/{id}/frames  → Get all frames (paginated)

// Dynamic loading in UI
const scenario = await fetch(`/api/plays/${playId}/frames`);
```

---

## File Structure

```
/public/plays/              ← Raw text files
  medea.txt
  antigone.txt
  macbeth.txt
  ...

/src/lib/
  play_parser.ts           ← Parse raw text to frames
  psychometric_analyzer.ts ← Compute τ, H per frame
  play_api.ts              ← Database operations

/prisma/
  schema.prisma            ← Add plays tables

/src/app/api/plays/
  route.ts                 ← REST endpoints
```

---

## Next Steps

1. Create database schema in PostgreSQL
2. Write parser for Project Gutenberg format
3. Download 12 complete play texts
4. Run psychometric pre-computation
5. Ingest into database
6. Add API endpoints
7. Update UI to load from database
