'use client';

import Link from 'next/link';
import { ArrowLeft, Database, Zap, Search, BarChart3, Code, Shield } from 'lucide-react';
import { useEffect, useRef } from 'react';

/**
 * JSONB Optimization Documentation
 * 
 * Complete guide to PostgreSQL JSONB indexing strategies for
 * MPN psychometric metadata storage.
 * 
 * Updated: 2026-01-05 15:25 CST
 * Version: 1.1.0
 * 
 * CHANGE LOG:
 * - 2026-01-05 15:25: Added Phase 5 temporal versioning and audit log sections
 * - 2026-01-05 07:35: Initial documentation created
 */

function useMermaid() {
    const initialized = useRef(false);
    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
        script.async = true;
        script.onload = () => {
            // @ts-ignore
            window.mermaid?.initialize({ startOnLoad: true, theme: 'dark' });
            // @ts-ignore
            window.mermaid?.run();
        };
        document.head.appendChild(script);
    }, []);
}

function CodeBlock({ code, language = 'sql' }: { code: string; language?: string }) {
    return (
        <pre className="bg-black/60 border border-white/10 rounded-lg p-4 overflow-x-auto">
            <code className="text-sm text-emerald-300 font-mono whitespace-pre">{code}</code>
        </pre>
    );
}

export default function JSONBOptimizationPage() {
    useMermaid();

    return (
        <div className="min-h-screen bg-black">
            <header className="border-b border-white/10 px-6 py-4 sticky top-0 bg-black/90 backdrop-blur-lg z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/wiki" className="flex items-center gap-2 text-white/60 hover:text-white transition">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm">Back to Wiki</span>
                        </Link>
                        <div className="w-px h-6 bg-white/20" />
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                <Database className="w-4 h-4 text-cyan-400" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold">JSONB Optimization</h1>
                                <p className="text-xs text-white/40">Database → Indexing</p>
                            </div>
                        </div>
                    </div>
                    <span className="text-xs text-white/40">Updated: 2026-01-05</span>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12">
                {/* Title */}
                <div className="mb-12">
                    <h2 className="text-4xl font-bold mb-4">
                        <span className="text-cyan-400">JSONB</span> Index Optimization
                    </h2>
                    <p className="text-xl text-white/60 mb-6">
                        PostgreSQL GIN indexes and optimization strategies for efficient querying
                        of psychometric metadata in the MPN system.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs">PostgreSQL 16+</span>
                        <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs">GIN Indexes</span>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs">jsonb_path_ops</span>
                        <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs">B-tree Expressions</span>
                    </div>
                </div>

                {/* Overview */}
                <section className="mb-12 p-6 rounded-xl border border-white/10 bg-white/5">
                    <h3 className="text-lg font-semibold mb-4 text-[#FFD700]">Why JSONB for Psychometrics?</h3>
                    <p className="text-white/70 mb-4">
                        MPN stores psychometric profiles as JSONB in the <code className="bg-black/40 px-1 rounded">metadata</code> column
                        of the <code className="bg-black/40 px-1 rounded">plays</code> table. This allows flexible schema evolution
                        while maintaining fast query performance via specialized indexes.
                    </p>
                    <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-center">
                            <Zap className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                            <p className="text-sm font-medium">Fast Queries</p>
                            <p className="text-xs text-white/50">Sub-ms with GIN indexes</p>
                        </div>
                        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-center">
                            <Shield className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                            <p className="text-sm font-medium">Flexible Schema</p>
                            <p className="text-xs text-white/50">No migrations needed</p>
                        </div>
                        <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30 text-center">
                            <Search className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                            <p className="text-sm font-medium">Rich Queries</p>
                            <p className="text-xs text-white/50">Containment, paths, arrays</p>
                        </div>
                    </div>
                </section>

                {/* Index Types */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">1</span>
                        Index Types for JSONB
                    </h3>
                    <div className="overflow-x-auto mb-6">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/20">
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Index Type</th>
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Operators</th>
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Size</th>
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Best For</th>
                                </tr>
                            </thead>
                            <tbody className="text-white/80">
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4 font-mono text-cyan-300">GIN (default)</td>
                                    <td className="py-3 px-4">@&gt; ? ?& ?| @@</td>
                                    <td className="py-3 px-4 text-amber-400">Large</td>
                                    <td className="py-3 px-4">All key/value queries</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4 font-mono text-emerald-300">GIN + jsonb_path_ops</td>
                                    <td className="py-3 px-4">@&gt; @@</td>
                                    <td className="py-3 px-4 text-emerald-400">Compact</td>
                                    <td className="py-3 px-4 text-emerald-300">★ Containment queries</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4 font-mono text-blue-300">B-tree (expression)</td>
                                    <td className="py-3 px-4">= &lt; &gt; &lt;= &gt;=</td>
                                    <td className="py-3 px-4 text-emerald-400">Small</td>
                                    <td className="py-3 px-4">Scalar comparisons</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-mono text-purple-300">Hash (expression)</td>
                                    <td className="py-3 px-4">=</td>
                                    <td className="py-3 px-4 text-emerald-400">Smallest</td>
                                    <td className="py-3 px-4">Exact match only</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Recommended Indexes */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">2</span>
                        Recommended Index Schema
                    </h3>
                    <CodeBlock code={`-- =================================================
-- MPN JSONB Index Schema
-- For plays.metadata psychometric storage
-- =================================================

-- 1. Primary GIN index with jsonb_path_ops
--    Use for: containment queries (most common)
--    Size: ~30% smaller than default GIN
CREATE INDEX idx_plays_metadata_gin 
ON plays USING gin(metadata jsonb_path_ops);

-- 2. Partial index for RSI-dominant queries
--    Use for: filtering by Lacanian register
CREATE INDEX idx_plays_rsi_dominant 
ON plays USING gin((metadata->'rsi') jsonb_path_ops)
WHERE metadata ? 'rsi';

-- 3. B-tree expression index for trauma coefficient
--    Use for: range queries on trauma (0-1)
CREATE INDEX idx_plays_trauma 
ON plays ((metadata->>'trauma')::float)
WHERE metadata ? 'trauma';

-- 4. B-tree expression index for entropy
--    Use for: range queries on entropy (0-1)
CREATE INDEX idx_plays_entropy 
ON plays ((metadata->>'entropy')::float)
WHERE metadata ? 'entropy';

-- 5. GIN index for cognitive biases array
--    Use for: checking if specific bias is present
CREATE INDEX idx_plays_biases 
ON plays USING gin((metadata->'biases'))
WHERE metadata ? 'biases';

-- 6. Composite B-tree for trauma + entropy
--    Use for: McKenney-Lacan state queries
CREATE INDEX idx_plays_mckenney_lacan 
ON plays (
  ((metadata->>'trauma')::float),
  ((metadata->>'entropy')::float)
)
WHERE metadata ? 'trauma' AND metadata ? 'entropy';`} />
                </section>

                {/* Query Examples */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">3</span>
                        Optimized Query Examples
                    </h3>

                    <div className="space-y-6">
                        <div>
                            <h4 className="font-semibold text-emerald-400 mb-2">Containment Query (@&gt;)</h4>
                            <p className="text-white/60 text-sm mb-2">Find plays where RSI.real is dominant (uses GIN)</p>
                            <CodeBlock code={`-- Uses: idx_plays_metadata_gin
SELECT id, title, metadata
FROM plays
WHERE metadata @> '{"rsi": {"dominant": "real"}}';

-- With nested path
SELECT * FROM plays
WHERE metadata @> '{"disc": {"D": 0.8}}';`} />
                        </div>

                        <div>
                            <h4 className="font-semibold text-blue-400 mb-2">Scalar Range Query</h4>
                            <p className="text-white/60 text-sm mb-2">Find high-trauma plays (uses B-tree expression)</p>
                            <CodeBlock code={`-- Uses: idx_plays_trauma
SELECT id, title, 
       (metadata->>'trauma')::float as trauma
FROM plays
WHERE (metadata->>'trauma')::float > 0.7
ORDER BY (metadata->>'trauma')::float DESC;

-- Combined McKenney-Lacan state
-- Uses: idx_plays_mckenney_lacan
SELECT * FROM plays
WHERE (metadata->>'trauma')::float > 0.7
  AND (metadata->>'entropy')::float > 0.5;`} />
                        </div>

                        <div>
                            <h4 className="font-semibold text-purple-400 mb-2">Array Contains Query</h4>
                            <p className="text-white/60 text-sm mb-2">Find plays with specific cognitive biases</p>
                            <CodeBlock code={`-- Uses: idx_plays_biases
SELECT * FROM plays
WHERE metadata->'biases' @> '["CONFIRMATION", "ANCHORING"]';

-- Check if any bias is present
SELECT * FROM plays
WHERE metadata->'biases' ?| array['SUNK_COST', 'LOSS_AVERSION'];`} />
                        </div>

                        <div>
                            <h4 className="font-semibold text-amber-400 mb-2">JSON Path Query (@@)</h4>
                            <p className="text-white/60 text-sm mb-2">Advanced filtering with JSONPath</p>
                            <CodeBlock code={`-- Find plays where OCEAN.N (neuroticism) > 0.6
SELECT * FROM plays
WHERE metadata @@ '$.ocean.N > 0.6';

-- Complex path with exists check
SELECT * FROM plays
WHERE metadata @@ '$.dark_triad.psychopathy > 0.3 
                  && $.trauma > 0.5';`} />
                        </div>
                    </div>
                </section>

                {/* Performance Tips */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">4</span>
                        Performance Tips
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10">
                            <h4 className="font-semibold text-emerald-400 mb-2">✅ Do</h4>
                            <ul className="text-sm text-white/70 space-y-1">
                                <li>• Use <code className="text-xs">jsonb_path_ops</code> for containment</li>
                                <li>• Cast to scalars for B-tree indexes</li>
                                <li>• Use partial indexes with WHERE</li>
                                <li>• ANALYZE after bulk inserts</li>
                                <li>• Use @&gt; over -&gt; for existence</li>
                            </ul>
                        </div>
                        <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/10">
                            <h4 className="font-semibold text-red-400 mb-2">❌ Don&apos;t</h4>
                            <ul className="text-sm text-white/70 space-y-1">
                                <li>• Don&apos;t use -&gt;&gt; in WHERE without index</li>
                                <li>• Avoid full table scans on JSONB</li>
                                <li>• Don&apos;t index deeply nested paths</li>
                                <li>• Avoid GIN on frequently updated cols</li>
                                <li>• Don&apos;t over-index (maintenance cost)</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* EXPLAIN Analysis */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">5</span>
                        Verify Index Usage
                    </h3>
                    <CodeBlock code={`-- Check if query uses index
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM plays
WHERE metadata @> '{"rsi": {"dominant": "real"}}';

-- Expected output (good):
-- Bitmap Heap Scan on plays
--   Recheck Cond: (metadata @> '{"rsi": {"dominant": "real"}}'::jsonb)
--   ->  Bitmap Index Scan on idx_plays_metadata_gin
--       Index Cond: (metadata @> '{"rsi": {"dominant": "real"}}'::jsonb)

-- Check index sizes
SELECT
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
WHERE schemaname = 'public' 
  AND tablename = 'plays'
ORDER BY pg_relation_size(indexrelid) DESC;`} />
                </section>

                {/* Schema Definition */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">6</span>
                        Metadata Schema
                    </h3>
                    <CodeBlock code={`-- plays.metadata JSONB structure
{
  "disc": {
    "D": 0.8,  -- Dominance (0-1)
    "I": 0.3,  -- Influence (0-1)
    "S": 0.2,  -- Steadiness (0-1)
    "C": 0.5   -- Compliance (0-1)
  },
  "ocean": {
    "O": 0.7,  -- Openness
    "C": 0.4,  -- Conscientiousness
    "E": 0.6,  -- Extraversion
    "A": 0.5,  -- Agreeableness
    "N": 0.3   -- Neuroticism
  },
  "rsi": {
    "real": 0.5,
    "symbolic": 0.3,
    "imaginary": 0.2,
    "dominant": "real"  -- Derived field
  },
  "trauma": 0.7,         -- McKenney-Lacan τ
  "entropy": 0.5,        -- McKenney-Lacan H
  "dark_triad": {
    "machiavellianism": 0.3,
    "narcissism": 0.2,
    "psychopathy": 0.1
  },
  "biases": [            -- Active cognitive biases
    "CONFIRMATION",
    "ANCHORING",
    "SUNK_COST"
  ],
  "physics": {           -- Grand Unified Codex state
    "hamiltonian": 0.65,
    "ising_j": 0.4,
    "lyapunov": 0.3
  }
}`} language="json" />
                </section>

                {/* Related */}
                <section className="p-6 rounded-xl border border-white/10 bg-white/5">
                    <h3 className="text-lg font-semibold mb-4">Related Documentation</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Link href="/wiki/database/schema" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium text-[#FFD700]">Database Schema</h4>
                            <p className="text-xs text-white/50 mt-1">Full table definitions</p>
                        </Link>
                        <Link href="/wiki/ai/psychoscore/dimensions" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium text-[#FFD700]">57D Input Space</h4>
                            <p className="text-xs text-white/50 mt-1">Psychometric dimensions</p>
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/10 px-6 py-6 mt-16">
                <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-white/40">
                    <span>MPN Wiki • JSONB Optimization</span>
                    <span>Last updated: 2026-01-05 07:35 CST</span>
                </div>
            </footer>
        </div>
    );
}
