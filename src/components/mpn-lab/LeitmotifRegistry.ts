/**
 * LeitmotifRegistry - Central registry for actor leitmotifs
 * 
 * Manages the creation, storage, and retrieval of musical leitmotifs
 * associated with characters/actors in the MPN system.
 */

import { LeitmotifGenerator, type LeitmotifProfile, type GeneratedLeitmotif } from './leitmotif_generator';

export interface RegisteredLeitmotif {
    actorId: string;
    actorName: string;
    leitmotif: GeneratedLeitmotif;
    createdAt: Date;
    lastUsed: Date;
    useCount: number;
}

export class LeitmotifRegistry {
    private static instance: LeitmotifRegistry | null = null;
    private registry: Map<string, RegisteredLeitmotif> = new Map();
    private generator: LeitmotifGenerator;

    private constructor() {
        this.generator = new LeitmotifGenerator();
    }

    /**
     * Get singleton instance
     */
    static getInstance(): LeitmotifRegistry {
        if (!LeitmotifRegistry.instance) {
            LeitmotifRegistry.instance = new LeitmotifRegistry();
        }
        return LeitmotifRegistry.instance;
    }

    /**
     * Register or retrieve a leitmotif for an actor
     */
    getOrCreateLeitmotif(actorId: string, actorName: string, profile: LeitmotifProfile): GeneratedLeitmotif {
        const existing = this.registry.get(actorId);

        if (existing) {
            existing.lastUsed = new Date();
            existing.useCount++;
            return existing.leitmotif;
        }

        // Generate new leitmotif
        const leitmotif = this.generator.generate(profile);

        this.registry.set(actorId, {
            actorId,
            actorName,
            leitmotif,
            createdAt: new Date(),
            lastUsed: new Date(),
            useCount: 1,
        });

        return leitmotif;
    }

    /**
     * Get leitmotif by actor ID
     */
    getLeitmotif(actorId: string): GeneratedLeitmotif | null {
        const registered = this.registry.get(actorId);
        if (registered) {
            registered.lastUsed = new Date();
            registered.useCount++;
            return registered.leitmotif;
        }
        return null;
    }

    /**
     * Check if actor has registered leitmotif
     */
    hasLeitmotif(actorId: string): boolean {
        return this.registry.has(actorId);
    }

    /**
     * Get all registered leitmotifs
     */
    getAllLeitmotifs(): RegisteredLeitmotif[] {
        return Array.from(this.registry.values());
    }

    /**
     * Get registry statistics
     */
    getStats(): { totalActors: number; totalUses: number; mostUsed: string | null } {
        const entries = Array.from(this.registry.values());
        const totalUses = entries.reduce((sum, e) => sum + e.useCount, 0);
        const mostUsed = entries.sort((a, b) => b.useCount - a.useCount)[0]?.actorName || null;

        return {
            totalActors: entries.length,
            totalUses,
            mostUsed,
        };
    }

    /**
     * Clear all registered leitmotifs
     */
    clear(): void {
        this.registry.clear();
    }

    /**
     * Remove a specific actor's leitmotif
     */
    removeLeitmotif(actorId: string): boolean {
        return this.registry.delete(actorId);
    }
}

// Export singleton accessor
export const leitmotifRegistry = LeitmotifRegistry.getInstance();
