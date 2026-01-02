import { Pool, PoolClient } from 'pg';

/**
 * MPN Conductor Database Connection
 * Secure PostgreSQL pool with environment-based configuration
 */

// Database configuration from environment variables
const config = {
    connectionString: process.env.DATABASE_URL,
    // Fallback to individual params if no DATABASE_URL
    user: process.env.POSTGRES_USER || 'mpn_user',
    password: process.env.POSTGRES_PASSWORD || 'mpn_secure_2026!',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    database: process.env.POSTGRES_DB || 'mpn_conductor',
    // Pool settings
    max: 10,                    // Max connections in pool
    idleTimeoutMillis: 30000,   // Close idle connections after 30s
    connectionTimeoutMillis: 5000, // Error if can't connect in 5s
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

// Create connection pool
export const mpnPool = new Pool(config);

// Connection event handlers
mpnPool.on('connect', () => {
    console.log('[MPN-DB] New client connected to pool');
});

mpnPool.on('error', (err: Error) => {
    console.error('[MPN-DB] Unexpected pool error:', err.message);
});

/**
 * Database helper object with common operations
 */
export const db = {
    /**
     * Execute a query with parameters
     */
    query: async (text: string, params?: any[]) => {
        const start = Date.now();
        try {
            const result = await mpnPool.query(text, params);
            const duration = Date.now() - start;
            console.log('[MPN-DB] Query executed', {
                text: text.substring(0, 50),
                duration: `${duration}ms`,
                rows: result.rowCount
            });
            return result;
        } catch (error) {
            console.error('[MPN-DB] Query error:', error);
            throw error;
        }
    },

    /**
     * Get a client from the pool for transactions
     */
    getClient: async (): Promise<PoolClient> => {
        return mpnPool.connect();
    },

    /**
     * Check database connection health
     */
    healthCheck: async (): Promise<boolean> => {
        try {
            await mpnPool.query('SELECT 1');
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Close all pool connections (for graceful shutdown)
     */
    close: async (): Promise<void> => {
        await mpnPool.end();
        console.log('[MPN-DB] Pool closed');
    }
};

// Export types for use elsewhere
export type { PoolClient };
