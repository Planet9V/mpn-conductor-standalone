import { MPNPreset } from './mpn_preset_types';

const STORAGE_KEY = 'oxot_mpn_presets';
const ACTIVE_ADJUSTMENTS_KEY = 'oxot_mpn_active_adjustments';

export const MPNPresetAPI = {
    // ASYNC: Fetch from DB
    getAllPresets: async (): Promise<MPNPreset[]> => {
        if (typeof window === 'undefined') return [];
        try {
            const res = await fetch('/api/mpn/presets');
            if (!res.ok) throw new Error('Failed to fetch presets');
            const data = await res.json();
            return data.map((p: any) => ({
                id: p.id,
                name: p.name,
                description: p.description,
                adjustments: p.adjustments,
                createdAt: p.created_at,
                version: p.version
            }));
        } catch (err) {
            console.error('API Error:', err);
            return [];
        }
    },

    // ASYNC: Save to DB
    savePreset: async (preset: Omit<MPNPreset, 'id' | 'createdAt' | 'version'>): Promise<MPNPreset | null> => {
        try {
            const res = await fetch('/api/mpn/presets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(preset)
            });
            if (!res.ok) throw new Error('Failed to save preset');
            const p = await res.json();
            return {
                id: p.id,
                name: p.name,
                description: p.description,
                adjustments: p.adjustments,
                createdAt: p.created_at,
                version: p.version
            };
        } catch (err) {
            console.error('API Error:', err);
            return null;
        }
    },

    // Placeholder for Delete/Update (Phase 14?)
    deletePreset: async (id: string): Promise<void> => {
        console.warn('Delete not yet implemented in API');
    },

    updatePreset: async (id: string, updates: Partial<MPNPreset>): Promise<MPNPreset | null> => {
        console.warn('Update not yet implemented in API');
        return null;
    },

    // SYNC: Keep active adjustments in LocalStorage (Session State)
    getActiveAdjustments: (): Record<string, any> => {
        if (typeof window === 'undefined') return {};
        const saved = localStorage.getItem(ACTIVE_ADJUSTMENTS_KEY);
        return saved ? JSON.parse(saved) : {};
    },

    saveActiveAdjustments: (adjustments: Record<string, any>): void => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(ACTIVE_ADJUSTMENTS_KEY, JSON.stringify(adjustments));
    }
};
