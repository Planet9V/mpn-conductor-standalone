# MPN Conductor - Troubleshooting Guide
**Version:** 3.1.0  
**Updated:** 2026-01-03 17:15 CST

## Common Issues & Solutions

### Build & Deployment

#### Issue: Build fails with TypeScript errors
**Symptoms:**
```
Error: Type 'X' is not assignable to type 'Y'
```

**Solutions:**
1. Clear Next.js cache: `rm -rf .next`
2. Reinstall dependencies: `npm ci`
3. Check TypeScript version: `npx tsc --version` (should be 5.x)
4. Run type-check only: `npm run type-check`

#### Issue: Docker container won't start
**Symptoms:**
```
Error: Cannot connect to PostgreSQL
```

**Solutions:**
1. Check Docker is running: `docker ps`
2. Verify database env vars in `.env.local`
3. Check PostgreSQL logs: `docker logs mpn-postgres`
4. Ensure port 5432 not in use: `lsof -i :5432`
5. Restart containers: `docker-compose restart`

### Audio & Playback

#### Issue: No audio output
**Symptoms:** Score plays but no sound

**Solutions:**
1. Check browser audio permissions
2. Verify volume slider is above  0
3. Check Tone.js loaded: Open console, type `Tone`
4. Test audio context: `await Tone.start()`
5. Check browser compatibility (Chrome/Edge recommended)

#### Issue: Audio crackles/glitches
**Symptoms:** Distorted or choppy audio

**Solutions:**
1. Increase audio buffer size in Tone.js settings
2. Reduce number of active voices
3. Close other audio-heavy browser tabs
4. Check CPU usage (should be <70%)
5. Try different orchestration mode (fewer instruments)

### AI Integration

#### Issue: AI script validation fails
**Symptoms:**
```
Error: Analysis failed
400: Bad request
```

**Solutions:**
1. Check `OPENROUTER_API_KEY` in`.env.local`
2. Verify API key is valid: Test at openrouter.ai
3. Check API quota/balance
4. Fallback parser will activate automatically if API fails
5. Script must be at least 100 characters

#### Issue: Slow AI responses
**Symptoms:** Validation takes >30 seconds

**Solutions:**
1. Switch to faster model (gemini-flash)
2. Check network connection
3. Reduce script length for analysis
4. Use fallback regex parser (disable AI temporarily)

### Database

#### Issue: Cannot connect to PostgreSQL
**Symptoms:**
```
Error: Connection refused
```

**Solutions:**
1. Check DATABASE_URL env var
2. Ensure PostgreSQL is running: `pg_isready`
3. Verify credentials: `psql -U mpn_user -d mpn_conductor`
4. Check firewall rules
5. For Docker: `docker exec -it mpn-postgres psql -U mpn_user`

#### Issue: pgvector extension missing
**Symptoms:**
```
ERROR: type "vector" does not exist
```

**Solutions:**
1. Enable extension: `CREATE EXTENSION IF NOT EXISTS vector;`
2. Run setup script: `./scripts/enable_pgvector.sh`
3. Verify installation: `SELECT * FROM pg_extension WHERE extname = 'vector';`
4. Ensure PostgreSQL 12+ with pgvector package installed

### Performance

#### Issue: Slow score rendering
**Symptoms:** >5 second delay for frame updates

**Solutions:**
1. Reduce number of measures displayed (current default: 4)
2. Simplify orchestration mode
3. Disable 3D visualizations temporarily
4. Clear browser cache
5. Check for memory leaks: Chrome DevTools > Memory

#### Issue: High CPU usage
**Symptoms:** Fan loud, browser sluggish

**Solutions:**
1. Pause audio synthesis when not actively viewing
2. Reduce visualization complexity
3. Use hardware acceleration (Chrome flags)
4. Close unused browser tabs
5. Limit to 2 active voices maximum

### Testing

#### Issue: E2E tests fail
**Symptoms:**
```
Playwright timeout errors
```

**Solutions:**
1. Ensure dev server running: `npm run dev -- -p 3002`
2. Increase timeout in `playwright.config.ts`
3. Run in headed mode for debugging: `npm run test:e2e -- --headed`
4. Clear browser state: `npx playwright clean`
5. Update Playwright: `npx playwright install`

#### Issue: Unit tests fail
**Symptoms:**
```
Vitest assertion errors
```

**Solutions:**
1. Run single test: `npm test -- -t "test name"`
2. Check for stale mocks
3. Clear test cache: `npx vitest run --clearCache`
4. Update snapshots if intentional: `npm test -- -u`

## Environment Variables

Required in `.env.local`:

```bash
# Core (required)
NODE_ENV=development
DATABASE_URL=postgresql://mpn_user:mpn_pass@localhost:5432/mpn_conductor

# AI (required for AI features)
OPENROUTER_API_KEY=sk-or-v1-...
HUGGINGFACE_API_KEY=hf_...

# Optional
ELEVENLABS_API_KEY=...
USE_LOCAL_LM=false
LOCAL_LM_ENDPOINT=http://localhost:1234/v1
```

## Performance Tuning

### Recommended Settings

**Development:**
- Orchestration: CHAMBER_QUARTET (fewer instruments)
- Measures: 2-4 (reduce buffer size)
- Visualizations: Selective (disable unused)
- Audio Buffer: 2048 samples

**Production:**
- Orchestration: Any
- Measures: 4-8 (full look-ahead)
- Visualizations: All
- Audio Buffer: 4096 samples

### Browser Compatibility

| Browser | Score Display | Audio | 3D Graphics | Recommended |
|---------|---------------|-------|-------------|-------------|
| Chrome 120+ | ✅ | ✅ | ✅ | ✅ Yes |
| Edge 120+ | ✅ | ✅ | ✅ | ✅ Yes |
| Firefox 120+ | ✅ | ⚠️ Partial | ✅ | ⚠️ Partial |
| Safari 17+ | ✅ | ⚠️ Partial | ⚠️ Limited | ❌ No |

**Notes:**
- Safari has limited Web Audio API support
- Firefox may have WebGL performance issues
- Chrome/Edge recommended for full feature set

## Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| E001 | Invalid psychometric input | Check trauma/entropy values (0-1 range) |
| E002 | Orchestrator initialization failed | Restart audio context |
| E003 | Database connection error | Verify DATABASE_URL |
| E004 | AI API error | Check API key and quota |
| E005 | Script parsing failed | Use fallback parser |
| E006 | VexFlow rendering error | Clear canvas cache |
| E007 | Tone.js context suspended | User interaction required to start |

## Logging & Debugging

### Enable Debug Logging

Add to `.env.local`:
```bash
DEBUG=mpn:*
LOG_LEVEL=debug
```

### Console Commands

Open browser console and try:

```javascript
// Check Tone.js state
Tone.Transport.state

// Inspect current score
window.__MPN_DEBUG__.currentFrame

// Force audio restart
await Tone.start()
Tone.Transport.start()

// Check loaded instruments
Tone.Master.value
```

### Health Check Endpoint

```bash
# Check API status
curl http://localhost:3002/api/health

# Expected response
{
  "status": "ok",
  "version": "3.1.0",
  "database": "connected",
  "ai": "available"
}
```

## Support Resources

- **GitHub Issues:** https://github.com/Planet9V/mpn-conductor-standalone/issues
- **Documentation:** `/public/docs/index.html`
- **Theory Papers:** `/public/theory/`
- **Test Suite:** `npm test` + `npm run test:e2e`

---

**Last Updated:** 2026-01-03 17:15 CST  
**Maintainer:** MPN Development Team
