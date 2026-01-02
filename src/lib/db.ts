import { Pool } from 'pg';

// Configuration for the MPN database
// In a real production app, these should be environment variables.
const config = {
    user: 'postgres',
    password: 'postgres',
    host: '172.30.253.47',
    port: 5432,
    database: 'oxot_mpn',
};

// Create a new pool instance
export const mpnPool = new Pool(config);

// Helper wrapper for queries
export const db = {
    query: (text: string, params?: any[]) => mpnPool.query(text, params),
    getClient: () => mpnPool.connect(),
};
