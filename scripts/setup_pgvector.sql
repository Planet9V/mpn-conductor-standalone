-- PostgreSQL pgvector Integration Setup
-- Run this after enabling pgvector extension

-- 1. Enable pgvector extension (requires superuser)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create embeddings table for semantic search
CREATE TABLE IF NOT EXISTS embeddings (
    id SERIAL PRIMARY KEY,
    play_id UUID REFERENCES plays(id) ON DELETE CASCADE,
    frame_index INT, -- NULL for whole-script embeddings
    embedding_type VARCHAR(50) NOT NULL, -- 'script', 'melody', 'psychometric', 'dialogue'
    embedding vector(1536), -- OpenAI ada-002 dimension (or 768 for sentence-transformers)
    content_text TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Create psychometric clusters table
CREATE TABLE IF NOT EXISTS psychometric_clusters (
    id SERIAL PRIMARY KEY,
    cluster_label VARCHAR(100) NOT NULL, -- e.g., "High Trauma + Low Entropy"
    centroid_embedding vector(1536),
    member_count INT DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Create AI generations log
CREATE TABLE IF NOT EXISTS ai_generations (
    id SERIAL PRIMARY KEY,
    play_id UUID REFERENCES plays(id) ON DELETE SET NULL,
    prompt TEXT NOT NULL,
    model VARCHAR(100), -- e.g., "gpt-4", "claude-3-opus"
    response TEXT,
    embedding vector(1536),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Create vector search indexes (IVFFlat for speed)
-- Note: lists = sqrt(num_rows) is a good default, adjust based on data size
CREATE INDEX IF NOT EXISTS idx_embeddings_vector 
    ON embeddings USING ivfflat (embedding vector_cosine_ops) 
    WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_clusters_centroid 
    ON psychometric_clusters USING ivfflat (centroid_embedding vector_cosine_ops) 
    WITH (lists = 50);

CREATE INDEX IF NOT EXISTS idx_ai_generations_embedding 
    ON ai_generations USING ivfflat (embedding vector_cosine_ops) 
    WITH (lists = 100);

-- 6. Additional indexes for filtering
CREATE INDEX IF NOT EXISTS idx_embeddings_play_id ON embeddings(play_id);
CREATE INDEX IF NOT EXISTS idx_embeddings_type ON embeddings(embedding_type);
CREATE INDEX IF NOT EXISTS idx_embeddings_created_at ON embeddings(created_at DESC);

-- 7. Create function for cosine similarity search
CREATE OR REPLACE FUNCTION search_similar_plays(
    query_embedding vector(1536),
    match_threshold float DEFAULT 0.7,
    match_count int DEFAULT 10
)
RETURNS TABLE (
    play_id UUID,
    title TEXT,
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        1 - (e.embedding <=> query_embedding) as similarity
    FROM embeddings e
    JOIN plays p ON e.play_id = p.id
    WHERE e.embedding_type = 'script'
        AND 1 - (e.embedding <=> query_embedding) > match_threshold
    ORDER BY e.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- 8. Create function for psychometric clustering
CREATE OR REPLACE FUNCTION find_psychometric_cluster(
    query_embedding vector(1536)
)
RETURNS TABLE (
    cluster_id INT,
    cluster_label VARCHAR(100),
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        id,
        cluster_label,
        1 - (centroid_embedding <=> query_embedding) as similarity
    FROM psychometric_clusters
    ORDER BY centroid_embedding <=> query_embedding
    LIMIT 1;
END;
$$;

-- 9. Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_embeddings_updated_at 
    BEFORE UPDATE ON embeddings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10. Grant permissions (adjust user as needed)
GRANT ALL ON embeddings TO mpn_user;
GRANT ALL ON psychometric_clusters TO mpn_user;
GRANT ALL ON ai_generations TO mpn_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO mpn_user;

-- Verification queries
-- Check extension:
-- SELECT * FROM pg_extension WHERE extname = 'vector';

-- Test vector operations:
-- SELECT '[1,2,3]'::vector <-> '[3,1,2]'::vector;

COMMENT ON TABLE embeddings IS 'Stores vector embeddings for scripts, melodies, and psychometric states';
COMMENT ON TABLE psychometric_clusters IS 'K-means clusters of psychometric states for pattern recognition';
COMMENT ON TABLE ai_generations IS 'Log of AI-generated content with embeddings for similarity search';
