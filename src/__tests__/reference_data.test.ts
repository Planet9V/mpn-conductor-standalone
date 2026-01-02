/**
 * MPN Reference Data Tests
 * Tests for the musical-psychometric mapping reference data
 */

import { describe, it, expect } from 'vitest';
import {
    MPN_REFERENCE_DICTIONARY,
    getEntriesByCategory,
    getEntryById,
    searchEntries,
    getAdjustableEntries,
} from '@/components/mpn-lab/mpn_reference_data';
import { MPNCategory } from '@/components/mpn-lab/mpn_reference_types';

describe('MPN Reference Data', () => {
    describe('Reference Dictionary', () => {
        it('should have valid reference dictionary structure', () => {
            expect(MPN_REFERENCE_DICTIONARY).toBeDefined();
            expect(MPN_REFERENCE_DICTIONARY.version).toBeDefined();
            expect(MPN_REFERENCE_DICTIONARY.categories).toBeDefined();
        });

        it('should have entries in all categories', () => {
            const categories = Object.values(MPNCategory);

            categories.forEach((category) => {
                const entries = getEntriesByCategory(category);
                expect(entries).toBeDefined();
                expect(entries.length).toBeGreaterThan(0);
            });
        });

        it('should have correct total entries count', () => {
            expect(MPN_REFERENCE_DICTIONARY.totalEntries).toBeGreaterThan(40);
        });

        it('should have valid entry structure', () => {
            const entries = getEntriesByCategory(MPNCategory.TIMBRE);

            entries.forEach((entry) => {
                expect(entry.id).toBeDefined();
                expect(entry.category).toBeDefined();
                expect(entry.musicalElement).toBeDefined();
                expect(entry.displayName).toBeDefined();
                expect(entry.psychometricMappings).toBeDefined();
            });
        });
    });

    describe('getEntriesByCategory', () => {
        it('should return TIMBRE entries', () => {
            const entries = getEntriesByCategory(MPNCategory.TIMBRE);
            expect(entries.length).toBeGreaterThan(0);
            expect(entries[0].category).toBe(MPNCategory.TIMBRE);
        });

        it('should return RHYTHM entries', () => {
            const entries = getEntriesByCategory(MPNCategory.RHYTHM);
            expect(entries.length).toBeGreaterThan(0);
            expect(entries[0].category).toBe(MPNCategory.RHYTHM);
        });

        it('should return HARMONY entries', () => {
            const entries = getEntriesByCategory(MPNCategory.HARMONY);
            expect(entries.length).toBeGreaterThan(0);
            expect(entries[0].category).toBe(MPNCategory.HARMONY);
        });

        it('should return DYNAMICS entries', () => {
            const entries = getEntriesByCategory(MPNCategory.DYNAMICS);
            expect(entries.length).toBeGreaterThan(0);
            expect(entries[0].category).toBe(MPNCategory.DYNAMICS);
        });
    });

    describe('getEntryById', () => {
        it('should find entry by ID', () => {
            const entry = getEntryById('timbre-001');
            expect(entry).toBeDefined();
            expect(entry?.id).toBe('timbre-001');
        });

        it('should return undefined for non-existent ID', () => {
            const entry = getEntryById('non-existent-id');
            expect(entry).toBeUndefined();
        });
    });

    describe('searchEntries', () => {
        it('should find entries by search term', () => {
            const results = searchEntries('brass');
            expect(results.length).toBeGreaterThan(0);
        });

        it('should return empty array for no matches', () => {
            const results = searchEntries('xyznonexistent');
            expect(results.length).toBe(0);
        });

        it('should be case insensitive', () => {
            const lowerResults = searchEntries('major');
            const upperResults = searchEntries('MAJOR');
            expect(lowerResults.length).toBe(upperResults.length);
        });
    });

    describe('getAdjustableEntries', () => {
        it('should return only adjustable entries', () => {
            const adjustables = getAdjustableEntries();

            adjustables.forEach((entry) => {
                expect(entry.adjustable).toBe(true);
            });
        });

        it('should have adjustable entries with range info', () => {
            const adjustables = getAdjustableEntries();

            adjustables.forEach((entry) => {
                if (entry.range) {
                    expect(entry.range.min).toBeDefined();
                    expect(entry.range.max).toBeDefined();
                }
            });
        });
    });
});

describe('Reference Data Consistency', () => {
    it('should have unique IDs for all entries', () => {
        const allIds: string[] = [];

        Object.values(MPN_REFERENCE_DICTIONARY.categories).forEach((entries) => {
            entries.forEach((entry) => {
                allIds.push(entry.id);
            });
        });

        const uniqueIds = new Set(allIds);
        expect(uniqueIds.size).toBe(allIds.length);
    });

    it('should have non-empty display names', () => {
        Object.values(MPN_REFERENCE_DICTIONARY.categories).forEach((entries) => {
            entries.forEach((entry) => {
                expect(entry.displayName.length).toBeGreaterThan(0);
            });
        });
    });

    it('should have valid category values', () => {
        const validCategories = Object.values(MPNCategory);

        Object.values(MPN_REFERENCE_DICTIONARY.categories).forEach((entries) => {
            entries.forEach((entry) => {
                expect(validCategories).toContain(entry.category);
            });
        });
    });

    it('should have theory descriptions', () => {
        Object.values(MPN_REFERENCE_DICTIONARY.categories).forEach((entries) => {
            entries.forEach((entry) => {
                expect(entry.theory).toBeDefined();
                expect(entry.theory.description.length).toBeGreaterThan(10);
            });
        });
    });
});
