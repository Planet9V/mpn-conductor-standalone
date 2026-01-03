# PostgreSQL pgvector Setup Guide

## Prerequisites

- PostgreSQL 12+ installed
- Superuser access to enable extensions
- `mpn_conductor` database created

## Installation Steps

### 1. Enable pgvector Extension

**Option A: Using Docker (Recommended)**

Update `docker-compose.yml`:

```yaml
services:
  postgres:
    image: ankane/pgvector:latest  # Use pgvector-enabled image
    environment:
      POSTGRES_DB: mpn_conductor
      POSTGRES_USER: mpn_user
      POSTGRES_PASSWORD: mpn_pass
    ports:
      - "5432:5432"
```

**Option B: Manual Installation**

```bash
# Ubuntu/Debian
sudo apt install postgresql-16-pgvector

# macOS
brew install pgvector

# From source
git clone https://github.com/pgvector/pgvector.git
cd pgvector
make
make install
```

### 2. Run Migration Script

```bash
# Connect to database
psql -U mpn_user -d mpn_conductor

# Run setup script
\i scripts/setup_pgvector.sql

# Verify installation
SELECT * FROM pg_extension WHERE extname = 'vector';
```

### 3. Test Vector Operations

```sql
-- Test cosine distance
SELECT '[1,2,3]'::vector <-> '[3,1,2]'::vector;

-- Should return a float (distance measure)
```

## Database Schema

### Tables Created

1. **embeddings**: Stores vector embeddings for scripts, melodies, and psychometric states
   - `id`: Primary key
   - `play_id`: Reference to plays table
   - `frame_index`: Frame number (NULL for whole-script embeddings)
   - `embedding_type`: 'script', 'melody', 'psychometric', 'dialogue'
   - `embedding`: vector(1536) - OpenAI ada-002 dimension
   - `content_text`: Original text for reference
   - `metadata`: JSON blob for additional data

2. **psychometric_clusters**: K-means clusters of psychometric states
   - `cluster_label`: Human-readable label
   - `centroid_embedding`: Cluster center vector
   - `member_count`: Number of items in cluster

3. **ai_generations**: Log of AI-generated content
   - `prompt`: Input prompt
   - `model`: Model used (e.g., "gpt-4")
   - `response`: Generated content
   - `embedding`: Response embedding for similarity

### Indexes

- IVFFlat indexes on all vector columns for fast approximate nearest neighbor search
- B-tree indexes on `play_id`, `embedding_type`, `created_at` for filtering

### Functions

- `search_similar_plays(query_embedding, threshold, limit)`: Find similar scripts
- `find_psychometric_cluster(query_embedding)`: Classify into psychometric cluster

## API Integration

### Generate Embeddings

Create `/api/embeddings/generate`:

```typescript
import { openai } from '@/lib/ai/openai_client'; // You'll need to create this
import { db } from '@/lib/db';

export async function POST(req: Request) {
    const { playId, text } = await req.json();
    
    // Generate embedding
    const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text,
    });
    
    const embedding = response.data[0].embedding;
    
    // Store in database
    await db.query(
        `INSERT INTO embeddings (play_id, embedding_type, embedding, content_text)
         VALUES ($1, 'script', $2, $3)`,
        [playId, JSON.stringify(embedding), text]
    );
    
    return Response.json({ success: true });
}
```

### Semantic Search

Create `/api/search/semantic`:

```typescript
export async function POST(req: Request) {
    const { query } = await req.json();
    
    // Generate query embedding
    const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: query,
    });
    
    const queryEmbedding = response.data[0].embedding;
    
    // Search similar plays
    const results = await db.query(
        `SELECT * FROM search_similar_plays($1::vector, 0.7, 10)`,
        [JSON.stringify(queryEmbedding)]
    );
    
    return Response.json(results.rows);
}
```

## Environment Variables

Add to `.env.local`:

```bash
# OpenAI for embeddings (or use local sentence-transformers)
OPENAI_API_KEY=sk-...

# Database
DATABASE_URL=postgresql://mpn_user:mpn_pass@localhost:5432/mpn_conductor
```

## Usage Examples

### 1. Generate Embeddings for Existing Plays

```sql
-- Manually insert test embedding
INSERT INTO embeddings (play_id, embedding_type, embedding, content_text)
SELECT 
    id,
    'script',
    -- Generate random vector for testing (replace with actual OpenAI embedding)
    ARRAY(SELECT random() FROM generate_series(1, 1536))::vector,
    source_text
FROM plays
WHERE source_text IS NOT NULL;
```

### 2. Find Similar Scripts

```sql
-- Find plays similar to a given embedding
SELECT * FROM search_similar_plays(
    (SELECT embedding FROM embeddings WHERE play_id = 'some-play-id' LIMIT 1),
    0.7,  -- similarity threshold
    5     -- top 5 results
);
```

### 3. Cluster Psychometric States

```typescript
// In your processing pipeline
const psychometricVector = await generatePsychometricEmbedding({
    trauma: 0.8,
    entropy: 0.6,
    lyapunov: 0.12
});

const cluster = await db.query(
    `SELECT * FROM find_psychometric_cluster($1::vector)`,
    [JSON.stringify(psychometricVector)]
);

console.log(`This state belongs to cluster: ${cluster.rows[0].cluster_label}`);
```

## Performance Considerations

- **IVFFlat Index Tuning**: Adjust `lists` parameter based on data size
  - Small dataset (< 10k): lists = 50-100
  - Medium (10k-1M): lists = sqrt(num_rows)
  - Large (> 1M): Consider HNSW index instead

- **Batch Embedding Generation**: Generate embeddings in batches of 100-1000

- **Caching**: Cache frequently queried embeddings in Redis

## Troubleshooting

### Extension Not Found

```sql
-- Check available extensions
SELECT * FROM pg_available_extensions WHERE name LIKE '%vector%';

-- If missing, install pgvector package for your PostgreSQL version
```

### Performance Issues

```sql
-- Rebuild index if search is slow
REINDEX INDEX idx_embeddings_vector;

-- Analyze table for query planner
ANALYZE embeddings;
```

### Permission Errors

```sql
-- Grant all permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO mpn_user;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO mpn_user;
```

## Next Steps

1. Create OpenAI client wrapper (`src/lib/ai/openai_client.ts`)
2. Build `/api/embeddings/generate` endpoint
3. Add embedding generation to script processing pipeline
4. Implement semantic search UI component
5. Create psychometric clustering visualization

---

For more information:
- pgvector docs: https://github.com/pgvector/pgvector
- OpenAI embeddings: https://platform.openai.com/docs/guides/embeddings
