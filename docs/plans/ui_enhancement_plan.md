# MPN Conductor - UI Enhancement Plan

> **Objective**: Transform basic layout into premium, professional-grade conductor interface

---

## Current Layout Analysis

| Section | Issue | Enhancement |
|---------|-------|-------------|
| Hero | Full screen splash - wastes vertical space | Collapse after first visit |
| Controls Bar | Cramped, inconsistent spacing | Modern pill-style grouping |
| Metrics Dashboard | 8 cards in dense grid | Reorganize into logical groups |
| Conductor Score | Good but isolated | Make focal point with better framing |
| Visualizations | Equal sizing | Score prominence, viz secondary |

---

## Proposed Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  [HEADER] Logo | Scenario | Playback Controls | Export      │
├─────────────────────────────────────────────────────────────┤
│  [SCRIPT DIALOG] Speaker • "Text..."          [Collapse ▲]  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │           [CONDUCTOR SCORE - 70% Height]            │    │
│  │           VexFlow Paged View with Playhead          │    │
│  └─────────────────────────────────────────────────────┘    │
├────────────────────────┬────────────────────────────────────┤
│  [PSYCHOMETRICS PANEL] │  [PHASE SPACE]                     │
│  ┌────┬────┬────┬────┐ │  ┌─────────────────┐               │
│  │ τ  │ H  │ λ  │ ⚠  │ │  │ Lorenz/Tonnetz  │               │
│  └────┴────┴────┴────┘ │  └─────────────────┘               │
│  [LEITMOTIF REGISTRY]  │                                    │
└────────────────────────┴────────────────────────────────────┘
```

---

## Specific Enhancements

### 1. Collapsible Hero Section
- Show full hero only on first load
- After scroll, minimize to compact header
- One-click "expand" to restore

### 2. Modern Controls Bar
```
[📖 Scenario ▼] [⏮ ⏯ ⏭] [🔊 ──●──] [AI ●] [⬇️ Export ▼]
```
- Pill-style grouped controls
- Glass-morphism background
- Export dropdown: MIDI, PDF, JSON

### 3. Psychometric Dashboard Redesign
**Before**: 8 equal cards in 8-column grid
**After**: 3 logical groups

| Group | Contents | Style |
|-------|----------|-------|
| **Core Metrics** | τ, H, λ | Large primary cards |
| **Musical State** | Tempo, Velocity, Chord | Compact secondary |
| **Status Panel** | Crisis, BSI | Alert-style indicators |

### 4. Score Prominence
- Increase score height to 60-70% of viewport
- Add subtle glow/shadow for emphasis
- Dark gradient background for contrast

### 5. Sidebar Panel Layout
- Move visualizations to collapsible sidebar
- Tabs: Lorenz | Tonnetz | Registry
- Score stays full-width

### 6. Premium Visual Polish
- [ ] Gradient borders on active sections
- [ ] Subtle pulse on speaking actor stave
- [ ] Smooth transitions on all state changes
- [ ] Dark glass panels with 12px blur
- [ ] Gold accent on interactive elements

---

## Implementation Phases

### Phase 1: Quick Wins (30 min)
- [ ] Increase score container height
- [ ] Group metrics into 3 sections
- [ ] Add Export button to controls bar

### Phase 2: Layout Restructure (1 hr)
- [ ] Convert visualizations to tabbed interface
- [ ] Move leitmotif registry below score
- [ ] Implement collapsible hero

### Phase 3: Premium Polish (1 hr)  
- [ ] Glass-morphism on all panels
- [ ] Gradient accents
- [ ] Micro-animations

---

## Proceed?

Reply with:
- **"Quick Wins"** - Phase 1 only
- **"Full Redesign"** - All phases
- **Specific items** - e.g., "Just do #3 and #4"
