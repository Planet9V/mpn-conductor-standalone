# Psychometric Processing Lab - Task List

- [ ] **Style Definitions**
    - [ ] Define `MusicalStyle` interface (Rhythm, Harmony, Texture vectors)
    - [ ] Create `styles.ts` with 8 presets (Orchestral, Jazz, Minimalist, Avant-Garde, etc.)
- [ ] **Processing Engine**
    - [ ] Create `PsychometricProcessor` class
    - [ ] Implement `applyStyleTransform(contentVector, styleVector)`
    - [ ] Implement `generateStructure(style)` (e.g. Minimalist = loops, Jazz = swing)
- [ ] **API Endpoint**
    - [ ] Create `POST /api/process-play`
    - [ ] Connect to `PsychometricProcessor`
- [ ] **UI Integration**
    - [ ] Update `ProcessModal` in `PlayLibraryPage` to allow selection
    - [ ] Connect "Process" button to API
    - [ ] Handle "Processing..." state and success feedback
