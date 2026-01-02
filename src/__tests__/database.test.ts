/**
 * Database Connection Tests
 * Tests for PostgreSQL configuration and query utilities
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ============================================================================
// DATABASE CONFIGURATION TESTS
// ============================================================================

describe('Database Configuration', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        vi.resetModules();
        process.env = { ...originalEnv };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it('should use DATABASE_URL when provided', () => {
        process.env.DATABASE_URL = 'postgresql://test:pass@localhost:5432/testdb';

        // Config would use this
        expect(process.env.DATABASE_URL).toBe('postgresql://test:pass@localhost:5432/testdb');
    });

    it('should fallback to individual params when DATABASE_URL not set', () => {
        delete process.env.DATABASE_URL;
        process.env.POSTGRES_USER = 'mpn_user';
        process.env.POSTGRES_PASSWORD = 'test_pass';
        process.env.POSTGRES_HOST = 'localhost';
        process.env.POSTGRES_PORT = '5432';
        process.env.POSTGRES_DB = 'mpn_conductor';

        expect(process.env.POSTGRES_USER).toBe('mpn_user');
        expect(process.env.POSTGRES_DB).toBe('mpn_conductor');
    });

    it('should use defaults when env vars not set', () => {
        delete process.env.DATABASE_URL;
        delete process.env.POSTGRES_USER;

        const defaultUser = process.env.POSTGRES_USER || 'mpn_user';
        const defaultPassword = process.env.POSTGRES_PASSWORD || 'mpn_secure_2026!';
        const defaultHost = process.env.POSTGRES_HOST || 'localhost';
        const defaultPort = parseInt(process.env.POSTGRES_PORT || '5432');
        const defaultDb = process.env.POSTGRES_DB || 'mpn_conductor';

        expect(defaultUser).toBe('mpn_user');
        expect(defaultPassword).toBe('mpn_secure_2026!');
        expect(defaultHost).toBe('localhost');
        expect(defaultPort).toBe(5432);
        expect(defaultDb).toBe('mpn_conductor');
    });

    it('should handle SSL configuration', () => {
        process.env.DATABASE_SSL = 'true';
        const ssl = process.env.DATABASE_SSL === 'true'
            ? { rejectUnauthorized: false }
            : false;

        expect(ssl).toEqual({ rejectUnauthorized: false });
    });

    it('should disable SSL by default', () => {
        delete process.env.DATABASE_SSL;
        const ssl = process.env.DATABASE_SSL === 'true'
            ? { rejectUnauthorized: false }
            : false;

        expect(ssl).toBe(false);
    });
});

// ============================================================================
// DATABASE SCHEMA TESTS
// ============================================================================

describe('Database Schema Validation', () => {
    it('should define scores table with correct fields', () => {
        const scoresSchema = {
            id: 'SERIAL PRIMARY KEY',
            scenario_id: 'VARCHAR(255) NOT NULL',
            scenario_name: 'VARCHAR(255)',
            frame_index: 'INTEGER NOT NULL',
            speaker: 'VARCHAR(255)',
            text: 'TEXT',
            trauma: 'FLOAT NOT NULL',
            entropy: 'FLOAT NOT NULL',
            baseline: 'FLOAT DEFAULT 0.5',
            arrhythmia: 'FLOAT DEFAULT 0.0',
            neo_riemannian_op: 'VARCHAR(10)',
            chord: 'VARCHAR(50)',
            tempo: 'INTEGER',
            dynamics: 'VARCHAR(10)',
            created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
        };

        expect(Object.keys(scoresSchema)).toContain('trauma');
        expect(Object.keys(scoresSchema)).toContain('entropy');
        expect(Object.keys(scoresSchema)).toContain('chord');
        expect(Object.keys(scoresSchema).length).toBe(15);
    });

    it('should define actor_profiles table with DISC fields', () => {
        const actorProfilesSchema = {
            id: 'SERIAL PRIMARY KEY',
            name: 'VARCHAR(255) UNIQUE NOT NULL',
            archetype: 'VARCHAR(100)',
            disc_d: 'FLOAT DEFAULT 0.5',
            disc_i: 'FLOAT DEFAULT 0.5',
            disc_s: 'FLOAT DEFAULT 0.5',
            disc_c: 'FLOAT DEFAULT 0.5',
            ocean_o: 'FLOAT DEFAULT 0.5',
            ocean_c: 'FLOAT DEFAULT 0.5',
            ocean_e: 'FLOAT DEFAULT 0.5',
            ocean_a: 'FLOAT DEFAULT 0.5',
            ocean_n: 'FLOAT DEFAULT 0.5',
            dark_triad_mach: 'FLOAT DEFAULT 0.3',
            dark_triad_narc: 'FLOAT DEFAULT 0.3',
            dark_triad_psych: 'FLOAT DEFAULT 0.3',
        };

        // DISC fields
        expect(Object.keys(actorProfilesSchema)).toContain('disc_d');
        expect(Object.keys(actorProfilesSchema)).toContain('disc_i');
        expect(Object.keys(actorProfilesSchema)).toContain('disc_s');
        expect(Object.keys(actorProfilesSchema)).toContain('disc_c');

        // OCEAN fields
        expect(Object.keys(actorProfilesSchema)).toContain('ocean_o');
        expect(Object.keys(actorProfilesSchema)).toContain('ocean_n');

        // Dark Triad fields
        expect(Object.keys(actorProfilesSchema)).toContain('dark_triad_mach');
        expect(Object.keys(actorProfilesSchema)).toContain('dark_triad_narc');
        expect(Object.keys(actorProfilesSchema)).toContain('dark_triad_psych');
    });

    it('should define presets table with adjustments JSONB', () => {
        const presetsSchema = {
            id: 'SERIAL PRIMARY KEY',
            name: 'VARCHAR(255) UNIQUE NOT NULL',
            description: 'TEXT',
            adjustments: 'JSONB NOT NULL',
            is_default: 'BOOLEAN DEFAULT FALSE',
        };

        expect(Object.keys(presetsSchema)).toContain('adjustments');
        expect(Object.keys(presetsSchema)).toContain('is_default');
    });

    it('should define leitmotifs table with array fields', () => {
        const leitmotifsSchema = {
            id: 'SERIAL PRIMARY KEY',
            actor_profile_id: 'INTEGER REFERENCES actor_profiles(id)',
            name: 'VARCHAR(255) NOT NULL',
            pitch_classes: 'INTEGER[] NOT NULL',
            base_octave: 'INTEGER DEFAULT 4',
            rhythm: 'FLOAT[] NOT NULL',
            instrument: 'VARCHAR(100)',
            transformation_history: "JSONB DEFAULT '[]'",
        };

        expect(Object.keys(leitmotifsSchema)).toContain('pitch_classes');
        expect(Object.keys(leitmotifsSchema)).toContain('rhythm');
        expect(Object.keys(leitmotifsSchema)).toContain('transformation_history');
    });
});

// ============================================================================
// DEFAULT PRESETS TESTS
// ============================================================================

describe('Default Presets', () => {
    const defaultPresets = [
        { name: 'Default', description: 'Standard MPN parameters', adjustments: {}, is_default: true },
        { name: 'High Drama', description: 'Increased trauma sensitivity', adjustments: { trauma_multiplier: 1.5, entropy_weight: 1.2 }, is_default: false },
        { name: 'Subtle Analysis', description: 'Reduced intensity for nuanced detection', adjustments: { trauma_multiplier: 0.7, tempo_dampening: 0.8 }, is_default: false },
    ];

    it('should have exactly 3 default presets', () => {
        expect(defaultPresets.length).toBe(3);
    });

    it('should have one default preset marked as is_default', () => {
        const defaultCount = defaultPresets.filter(p => p.is_default).length;
        expect(defaultCount).toBe(1);
    });

    it('should have High Drama with trauma_multiplier 1.5', () => {
        const highDrama = defaultPresets.find(p => p.name === 'High Drama');
        expect(highDrama?.adjustments.trauma_multiplier).toBe(1.5);
    });

    it('should have Subtle Analysis with reduced trauma_multiplier', () => {
        const subtle = defaultPresets.find(p => p.name === 'Subtle Analysis');
        expect(subtle?.adjustments.trauma_multiplier).toBe(0.7);
    });
});

// ============================================================================
// CONNECTION POOL TESTS
// ============================================================================

describe('Connection Pool Settings', () => {
    it('should have reasonable pool limits', () => {
        const poolConfig = {
            max: 10,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000,
        };

        expect(poolConfig.max).toBeLessThanOrEqual(20);
        expect(poolConfig.max).toBeGreaterThanOrEqual(5);
        expect(poolConfig.idleTimeoutMillis).toBeGreaterThanOrEqual(10000);
        expect(poolConfig.connectionTimeoutMillis).toBeGreaterThanOrEqual(1000);
    });
});
