export interface ParameterAdjustment {
    entryId: string;
    parameter: string; // 'tempo', 'dynamics', 'humanization', etc.
    value: number;
}

export interface MPNPreset {
    id: string;
    name: string;
    description: string;
    createdAt: string; // ISO date string
    version: number;
    adjustments: Record<string, ParameterAdjustment>; // entryId -> Adjustment
}

export interface PresetStore {
    presets: MPNPreset[];
    activePresetId: string | null;
}
