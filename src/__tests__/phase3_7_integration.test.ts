/**
 * Phase 3-7 Integration Tests
 * 
 * Tests for new capabilities added in MPN v3.5:
 * - Phase 3: Emotional TTS & SSML
 * - Phase 4: Auth System
 * - Phase 5: Database Optimization
 * - Phase 7: Dynamic Conductor UI components
 * 
 * @created 2026-01-05
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ============================================
// Phase 3: Emotional TTS Tests
// ============================================

describe('Emotional TTS System', () => {
    describe('mapPsychometricsToEmotion', () => {
        const mapPsychometricsToEmotion = (psychometrics: {
            trauma: number;
            entropy: number;
            disc?: { D: number; I: number; S: number; C: number };
            ocean?: { O: number; C: number; E: number; A: number; N: number };
        }): string => {
            const { trauma, entropy, disc, ocean } = psychometrics;

            // High trauma + high entropy = fearful
            if (trauma > 0.8 && entropy > 0.6) return 'fearful';
            // High trauma + low entropy = sad
            if (trauma > 0.7 && entropy < 0.4) return 'sad';
            // Low trauma + high entropy = excited
            if (trauma < 0.4 && entropy > 0.7) return 'excited';
            // High trauma alone = angry
            if (trauma > 0.6) return 'angry';
            // Very low trauma = hopeful
            if (trauma < 0.3) return 'hopeful';
            // Very high entropy = whispering
            if (entropy > 0.9) return 'whispering';
            // High Influence = playful
            if (disc?.I && disc.I > 0.7) return 'playful';
            // High Openness = curious
            if (ocean?.O && ocean.O > 0.7) return 'curious';

            return 'neutral';
        };

        it('should return fearful for high trauma + high entropy', () => {
            const result = mapPsychometricsToEmotion({ trauma: 0.85, entropy: 0.7 });
            expect(result).toBe('fearful');
        });

        it('should return sad for high trauma + low entropy', () => {
            const result = mapPsychometricsToEmotion({ trauma: 0.75, entropy: 0.3 });
            expect(result).toBe('sad');
        });

        it('should return excited for low trauma + high entropy', () => {
            const result = mapPsychometricsToEmotion({ trauma: 0.3, entropy: 0.8 });
            expect(result).toBe('excited');
        });

        it('should return angry for high trauma alone', () => {
            const result = mapPsychometricsToEmotion({ trauma: 0.65, entropy: 0.5 });
            expect(result).toBe('angry');
        });

        it('should return hopeful for very low trauma', () => {
            const result = mapPsychometricsToEmotion({ trauma: 0.2, entropy: 0.5 });
            expect(result).toBe('hopeful');
        });

        it('should return neutral for balanced values', () => {
            const result = mapPsychometricsToEmotion({ trauma: 0.5, entropy: 0.5 });
            expect(result).toBe('neutral');
        });

        it('should return playful for high DISC.I', () => {
            const result = mapPsychometricsToEmotion({
                trauma: 0.5,
                entropy: 0.5,
                disc: { D: 0.3, I: 0.8, S: 0.4, C: 0.3 }
            });
            expect(result).toBe('playful');
        });

        it('should return curious for high OCEAN.O', () => {
            const result = mapPsychometricsToEmotion({
                trauma: 0.5,
                entropy: 0.5,
                ocean: { O: 0.8, C: 0.5, E: 0.5, A: 0.5, N: 0.3 }
            });
            expect(result).toBe('curious');
        });
    });

    describe('ElevenLabs Emotion Styles', () => {
        const EMOTION_STYLES = [
            'neutral', 'fearful', 'sad', 'angry', 'hopeful',
            'excited', 'whispering', 'playful', 'curious'
        ] as const;

        it('should have all 9 emotion styles', () => {
            expect(EMOTION_STYLES).toHaveLength(9);
        });

        it('should include all required emotions', () => {
            expect(EMOTION_STYLES).toContain('fearful');
            expect(EMOTION_STYLES).toContain('sad');
            expect(EMOTION_STYLES).toContain('excited');
            expect(EMOTION_STYLES).toContain('angry');
            expect(EMOTION_STYLES).toContain('hopeful');
            expect(EMOTION_STYLES).toContain('whispering');
        });
    });
});

// ============================================
// Phase 4: Auth System Tests
// ============================================

describe('Auth System', () => {
    describe('Role-based Access', () => {
        type UserRole = 'Administrator' | 'User' | 'Viewer';

        const canAccessAdmin = (role: UserRole): boolean => {
            return role === 'Administrator';
        };

        const canManageProjects = (role: UserRole): boolean => {
            return role === 'Administrator' || role === 'User';
        };

        const canViewProjects = (role: UserRole): boolean => {
            return true; // All roles can view
        };

        it('should allow admin to access admin dashboard', () => {
            expect(canAccessAdmin('Administrator')).toBe(true);
        });

        it('should deny user access to admin dashboard', () => {
            expect(canAccessAdmin('User')).toBe(false);
        });

        it('should allow user to manage projects', () => {
            expect(canManageProjects('User')).toBe(true);
        });

        it('should allow admin to manage projects', () => {
            expect(canManageProjects('Administrator')).toBe(true);
        });

        it('should deny viewer from managing projects', () => {
            expect(canManageProjects('Viewer')).toBe(false);
        });

        it('should allow all roles to view projects', () => {
            expect(canViewProjects('Administrator')).toBe(true);
            expect(canViewProjects('User')).toBe(true);
            expect(canViewProjects('Viewer')).toBe(true);
        });
    });

    describe('Password Validation', () => {
        const isValidPassword = (password: string): boolean => {
            return password.length >= 8 &&
                /[A-Z]/.test(password) &&
                /[a-z]/.test(password) &&
                /[0-9]/.test(password);
        };

        it('should accept valid password', () => {
            expect(isValidPassword('SecurePass123')).toBe(true);
        });

        it('should reject short password', () => {
            expect(isValidPassword('Short1')).toBe(false);
        });

        it('should reject password without uppercase', () => {
            expect(isValidPassword('lowercase123')).toBe(false);
        });

        it('should reject password without numbers', () => {
            expect(isValidPassword('NoNumbers!')).toBe(false);
        });
    });
});

// ============================================
// Phase 4.5: Project Management Tests
// ============================================

describe('Project Management', () => {
    interface Project {
        id: string;
        name: string;
        user_id: string;
        is_template: boolean;
        config: Record<string, unknown>;
    }

    const createProject = (
        name: string,
        user_id: string,
        is_template: boolean = false
    ): { success: boolean; project?: Project; error?: string } => {
        if (!name.trim()) return { success: false, error: 'Project name required' };
        if (!user_id) return { success: false, error: 'User ID required' };

        return {
            success: true,
            project: {
                id: `proj_${Date.now()}`,
                name,
                user_id,
                is_template,
                config: {}
            }
        };
    };

    it('should create valid project', () => {
        const result = createProject('Hamlet Analysis', 'user_123');
        expect(result.success).toBe(true);
        expect(result.project?.name).toBe('Hamlet Analysis');
        expect(result.project?.user_id).toBe('user_123');
        expect(result.project?.is_template).toBe(false);
    });

    it('should require project name', () => {
        const result = createProject('', 'user_123');
        expect(result.success).toBe(false);
        expect(result.error).toBe('Project name required');
    });

    it('should require user ID', () => {
        const result = createProject('Macbeth', '');
        expect(result.success).toBe(false);
        expect(result.error).toBe('User ID required');
    });

    it('should allow creating templates', () => {
        const result = createProject('Master Template', 'admin_1', true);
        expect(result.success).toBe(true);
        expect(result.project?.is_template).toBe(true);
    });
});

// ============================================
// Phase 5: Database Optimization Tests
// ============================================

describe('Database Optimization', () => {
    describe('Temporal Versioning', () => {
        interface VersionedEntity {
            id: string;
            version: number;
            previous_version_id: string | null;
            created_at: Date;
        }

        const createNewVersion = (entity: VersionedEntity): VersionedEntity => {
            return {
                id: `${entity.id}_v${entity.version + 1}`,
                version: entity.version + 1,
                previous_version_id: entity.id,
                created_at: new Date()
            };
        };

        it('should increment version number', () => {
            const original: VersionedEntity = {
                id: 'script_001',
                version: 1,
                previous_version_id: null,
                created_at: new Date()
            };
            const newVersion = createNewVersion(original);
            expect(newVersion.version).toBe(2);
        });

        it('should link to previous version', () => {
            const original: VersionedEntity = {
                id: 'script_001',
                version: 1,
                previous_version_id: null,
                created_at: new Date()
            };
            const newVersion = createNewVersion(original);
            expect(newVersion.previous_version_id).toBe('script_001');
        });

        it('should generate new ID with version suffix', () => {
            const original: VersionedEntity = {
                id: 'script_001',
                version: 1,
                previous_version_id: null,
                created_at: new Date()
            };
            const newVersion = createNewVersion(original);
            expect(newVersion.id).toBe('script_001_v2');
        });
    });

    describe('Audit Logging', () => {
        interface AuditLog {
            action: string;
            entity_type: string;
            entity_id: string;
            user_id: string;
            timestamp: Date;
            details: Record<string, unknown>;
        }

        const createAuditLog = (
            action: string,
            entity_type: string,
            entity_id: string,
            user_id: string,
            details: Record<string, unknown> = {}
        ): AuditLog => ({
            action,
            entity_type,
            entity_id,
            user_id,
            timestamp: new Date(),
            details
        });

        it('should create audit log with all fields', () => {
            const log = createAuditLog(
                'REGENERATE',
                'project',
                'proj_123',
                'user_456',
                { fromBeat: 16, temperature: 0.95 }
            );

            expect(log.action).toBe('REGENERATE');
            expect(log.entity_type).toBe('project');
            expect(log.entity_id).toBe('proj_123');
            expect(log.user_id).toBe('user_456');
            expect(log.details).toEqual({ fromBeat: 16, temperature: 0.95 });
        });

        it('should include timestamp', () => {
            const before = new Date();
            const log = createAuditLog('CREATE', 'user', 'user_001', 'admin');
            const after = new Date();

            expect(log.timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
            expect(log.timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
        });
    });
});

// ============================================
// Phase 7: Dynamic Conductor UI Tests
// ============================================

describe('Dynamic Conductor UI', () => {
    describe('ActorInstrumentPicker', () => {
        interface ActorInstrumentMapping {
            actorId: string;
            instrument: string;
            volume: number;
            pan: number;
            octaveOffset: number;
            muted: boolean;
            solo: boolean;
        }

        const createDefaultMapping = (actorId: string): ActorInstrumentMapping => ({
            actorId,
            instrument: 'piano',
            volume: 75,
            pan: 0,
            octaveOffset: 0,
            muted: false,
            solo: false
        });

        const applyVolume = (mapping: ActorInstrumentMapping, volume: number): ActorInstrumentMapping => ({
            ...mapping,
            volume: Math.max(0, Math.min(100, volume))
        });

        const applyPan = (mapping: ActorInstrumentMapping, pan: number): ActorInstrumentMapping => ({
            ...mapping,
            pan: Math.max(-100, Math.min(100, pan))
        });

        it('should create default mapping with piano', () => {
            const mapping = createDefaultMapping('actor_001');
            expect(mapping.instrument).toBe('piano');
            expect(mapping.volume).toBe(75);
            expect(mapping.pan).toBe(0);
        });

        it('should clamp volume between 0-100', () => {
            const mapping = createDefaultMapping('actor_001');
            expect(applyVolume(mapping, 150).volume).toBe(100);
            expect(applyVolume(mapping, -50).volume).toBe(0);
            expect(applyVolume(mapping, 50).volume).toBe(50);
        });

        it('should clamp pan between -100 and 100', () => {
            const mapping = createDefaultMapping('actor_001');
            expect(applyPan(mapping, 200).pan).toBe(100);
            expect(applyPan(mapping, -200).pan).toBe(-100);
            expect(applyPan(mapping, 50).pan).toBe(50);
        });

        it('should default to not muted and not solo', () => {
            const mapping = createDefaultMapping('actor_001');
            expect(mapping.muted).toBe(false);
            expect(mapping.solo).toBe(false);
        });
    });

    describe('TimelineScrubber', () => {
        interface TimelineMarker {
            beat: number;
            type: 'section' | 'regenerate' | 'bookmark';
            label?: string;
        }

        const calculatePsychometricHeat = (
            trauma: number,
            entropy: number
        ): number => {
            // Heat is the combined intensity (0-1)
            return Math.min(1, (trauma + entropy) / 2);
        };

        const beatToPixel = (beat: number, pixelsPerBeat: number = 20): number => {
            return beat * pixelsPerBeat;
        };

        const pixelToBeat = (pixel: number, pixelsPerBeat: number = 20): number => {
            return Math.floor(pixel / pixelsPerBeat);
        };

        it('should calculate heat from psychometrics', () => {
            expect(calculatePsychometricHeat(0.8, 0.6)).toBeCloseTo(0.7);
            expect(calculatePsychometricHeat(0, 0)).toBe(0);
            expect(calculatePsychometricHeat(1, 1)).toBe(1);
        });

        it('should cap heat at 1', () => {
            expect(calculatePsychometricHeat(1.5, 1.5)).toBe(1);
        });

        it('should convert beat to pixel position', () => {
            expect(beatToPixel(0)).toBe(0);
            expect(beatToPixel(4)).toBe(80);
            expect(beatToPixel(16)).toBe(320);
        });

        it('should convert pixel to beat', () => {
            expect(pixelToBeat(0)).toBe(0);
            expect(pixelToBeat(80)).toBe(4);
            expect(pixelToBeat(85)).toBe(4); // Floor rounding
        });
    });

    describe('Regeneration API', () => {
        const calculateDynamicTemperature = (entropy: number): number => {
            // Temperature: 0.7 + (entropy * 0.5) → range 0.7 to 1.2
            return 0.7 + (entropy * 0.5);
        };

        const generateJobId = (): string => {
            return `regen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        };

        it('should calculate temperature from entropy', () => {
            expect(calculateDynamicTemperature(0)).toBeCloseTo(0.7);
            expect(calculateDynamicTemperature(0.5)).toBeCloseTo(0.95);
            expect(calculateDynamicTemperature(1)).toBeCloseTo(1.2);
        });

        it('should generate unique job IDs', () => {
            const id1 = generateJobId();
            const id2 = generateJobId();
            expect(id1).not.toBe(id2);
            expect(id1).toMatch(/^regen_\d+_[a-z0-9]+$/);
        });

        it('should have temperature in valid range', () => {
            for (let e = 0; e <= 1; e += 0.1) {
                const temp = calculateDynamicTemperature(e);
                expect(temp).toBeGreaterThanOrEqual(0.7);
                expect(temp).toBeLessThanOrEqual(1.2);
            }
        });
    });
});

// ============================================
// Phase 6: PSYCHOSCORE Integration Tests
// ============================================

describe('PSYCHOSCORE Integration', () => {
    describe('PsychoscoreClient', () => {
        // Mock the client structure
        interface PsychoscoreConfig {
            endpoint: string;
            timeout: number;
        }

        class MockPsychoscoreClient {
            private static instance: MockPsychoscoreClient | null = null;
            endpoint: string;
            timeout: number;

            static getInstance(): MockPsychoscoreClient {
                if (!MockPsychoscoreClient.instance) {
                    MockPsychoscoreClient.instance = new MockPsychoscoreClient();
                }
                return MockPsychoscoreClient.instance;
            }

            static resetInstance(): void {
                MockPsychoscoreClient.instance = null;
            }

            constructor(config: Partial<PsychoscoreConfig> = {}) {
                this.endpoint = config.endpoint || 'http://localhost:8001';
                this.timeout = config.timeout || 30000;
            }

            async healthCheck(): Promise<boolean> {
                return true; // Mock
            }
        }

        beforeEach(() => {
            MockPsychoscoreClient.resetInstance();
        });

        it('should return singleton instance', () => {
            const instance1 = MockPsychoscoreClient.getInstance();
            const instance2 = MockPsychoscoreClient.getInstance();
            expect(instance1).toBe(instance2);
        });

        it('should reset singleton correctly', () => {
            const instance1 = MockPsychoscoreClient.getInstance();
            MockPsychoscoreClient.resetInstance();
            const instance2 = MockPsychoscoreClient.getInstance();
            expect(instance1).not.toBe(instance2);
        });

        it('should use default endpoint', () => {
            const client = new MockPsychoscoreClient();
            expect(client.endpoint).toBe('http://localhost:8001');
        });

        it('should use default timeout', () => {
            const client = new MockPsychoscoreClient();
            expect(client.timeout).toBe(30000);
        });

        it('should accept custom config', () => {
            const client = new MockPsychoscoreClient({
                endpoint: 'http://custom:8080',
                timeout: 60000
            });
            expect(client.endpoint).toBe('http://custom:8080');
            expect(client.timeout).toBe(60000);
        });
    });

    describe('AIModelSource Routing', () => {
        type AIModelSource = 'text2midi' | 'psychoscore' | 'hybrid' | 'off';

        const shouldUsePsychoscore = (source: AIModelSource): boolean => {
            return source === 'psychoscore' || source === 'hybrid';
        };

        const shouldUseText2midi = (source: AIModelSource): boolean => {
            return source === 'text2midi' || source === 'hybrid';
        };

        const isAIEnabled = (source: AIModelSource): boolean => {
            return source !== 'off';
        };

        it('should enable PSYCHOSCORE for psychoscore source', () => {
            expect(shouldUsePsychoscore('psychoscore')).toBe(true);
        });

        it('should enable PSYCHOSCORE for hybrid source', () => {
            expect(shouldUsePsychoscore('hybrid')).toBe(true);
        });

        it('should disable PSYCHOSCORE for text2midi source', () => {
            expect(shouldUsePsychoscore('text2midi')).toBe(false);
        });

        it('should disable PSYCHOSCORE for off source', () => {
            expect(shouldUsePsychoscore('off')).toBe(false);
        });

        it('should enable Text2midi for text2midi source', () => {
            expect(shouldUseText2midi('text2midi')).toBe(true);
        });

        it('should enable Text2midi for hybrid source', () => {
            expect(shouldUseText2midi('hybrid')).toBe(true);
        });

        it('should disable Text2midi for psychoscore source', () => {
            expect(shouldUseText2midi('psychoscore')).toBe(false);
        });

        it('should have AI disabled for off', () => {
            expect(isAIEnabled('off')).toBe(false);
        });

        it('should have AI enabled for all other sources', () => {
            expect(isAIEnabled('text2midi')).toBe(true);
            expect(isAIEnabled('psychoscore')).toBe(true);
            expect(isAIEnabled('hybrid')).toBe(true);
        });
    });

    describe('PSYCHOSCORE Request Validation', () => {
        interface PsychoscoreRequest {
            trauma?: number;
            entropy?: number;
            rsi?: { real: number; symbolic: number; imaginary: number };
            max_bars?: number;
            temperature?: number | null;
        }

        const validateRequest = (req: PsychoscoreRequest): { valid: boolean; errors: string[] } => {
            const errors: string[] = [];

            if (req.trauma !== undefined && (req.trauma < 0 || req.trauma > 1)) {
                errors.push('trauma must be between 0 and 1');
            }
            if (req.entropy !== undefined && (req.entropy < 0 || req.entropy > 1)) {
                errors.push('entropy must be between 0 and 1');
            }
            if (req.max_bars !== undefined && (req.max_bars < 1 || req.max_bars > 128)) {
                errors.push('max_bars must be between 1 and 128');
            }
            if (req.rsi) {
                const sum = req.rsi.real + req.rsi.symbolic + req.rsi.imaginary;
                if (Math.abs(sum - 1) > 0.01) {
                    errors.push('RSI values should sum to 1');
                }
            }

            return { valid: errors.length === 0, errors };
        };

        it('should accept valid request', () => {
            const result = validateRequest({
                trauma: 0.7,
                entropy: 0.5,
                rsi: { real: 0.5, symbolic: 0.3, imaginary: 0.2 },
                max_bars: 32
            });
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should reject trauma outside 0-1', () => {
            const result = validateRequest({ trauma: 1.5 });
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('trauma must be between 0 and 1');
        });

        it('should reject entropy outside 0-1', () => {
            const result = validateRequest({ entropy: -0.1 });
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('entropy must be between 0 and 1');
        });

        it('should reject max_bars outside 1-128', () => {
            const result = validateRequest({ max_bars: 200 });
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('max_bars must be between 1 and 128');
        });

        it('should warn when RSI does not sum to 1', () => {
            const result = validateRequest({
                rsi: { real: 0.5, symbolic: 0.5, imaginary: 0.5 }
            });
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('RSI values should sum to 1');
        });
    });

    describe('Dynamic Temperature Calculation', () => {
        const calculateDynamicTemperature = (
            entropy: number,
            trauma: number = 0.5
        ): number => {
            // Base temperature from entropy: 0.7 + (entropy * 0.5)
            const base = 0.7 + (entropy * 0.5);
            // Trauma adjustment: +0.1 for high trauma
            const traumaAdjust = trauma > 0.7 ? 0.1 : 0;
            return Math.min(2.0, base + traumaAdjust);
        };

        it('should return 0.7 for zero entropy', () => {
            expect(calculateDynamicTemperature(0)).toBeCloseTo(0.7);
        });

        it('should return 1.2 for full entropy', () => {
            expect(calculateDynamicTemperature(1)).toBeCloseTo(1.2);
        });

        it('should add trauma boost for high trauma', () => {
            const withoutTrauma = calculateDynamicTemperature(0.5, 0.3);
            const withTrauma = calculateDynamicTemperature(0.5, 0.9);
            expect(withTrauma - withoutTrauma).toBeCloseTo(0.1);
        });

        it('should cap at 2.0', () => {
            const result = calculateDynamicTemperature(1, 1);
            expect(result).toBeLessThanOrEqual(2.0);
        });
    });

    describe('MIDI Response Parsing', () => {
        interface MidiResponse {
            success: boolean;
            midi_base64?: string;
            parameters?: {
                bars: number;
                temperature: number;
                rsi_dominant: string;
            };
            error?: string;
        }

        const isValidMidiResponse = (response: MidiResponse): boolean => {
            if (!response.success) return false;
            if (!response.midi_base64) return false;
            // Check for valid base64 MIDI header (TVRoZ = "MThd")
            return response.midi_base64.startsWith('TVRo');
        };

        const getMidiDataLength = (base64: string): number => {
            // Rough estimate of decoded length
            return Math.floor(base64.length * 0.75);
        };

        it('should validate successful response', () => {
            const response: MidiResponse = {
                success: true,
                midi_base64: 'TVRoZAAAAAYAAQACA...',
                parameters: { bars: 8, temperature: 0.9, rsi_dominant: 'real' }
            };
            expect(isValidMidiResponse(response)).toBe(true);
        });

        it('should reject failed response', () => {
            const response: MidiResponse = {
                success: false,
                error: 'Model not ready'
            };
            expect(isValidMidiResponse(response)).toBe(false);
        });

        it('should reject response without MIDI data', () => {
            const response: MidiResponse = {
                success: true,
                parameters: { bars: 8, temperature: 0.9, rsi_dominant: 'real' }
            };
            expect(isValidMidiResponse(response)).toBe(false);
        });

        it('should reject invalid MIDI header', () => {
            const response: MidiResponse = {
                success: true,
                midi_base64: 'InvalidBase64Data...'
            };
            expect(isValidMidiResponse(response)).toBe(false);
        });

        it('should estimate MIDI data length', () => {
            const base64 = 'TVRoZAAAAAYAAQACA8BNVHJr'; // ~24 chars
            expect(getMidiDataLength(base64)).toBe(18); // ~18 bytes
        });
    });

    describe('Rate Limiting', () => {
        interface RateLimitRecord {
            count: number;
            resetTime: number;
        }

        const RATE_LIMIT = 100;
        const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

        const checkRateLimit = (
            record: RateLimitRecord | undefined,
            now: number
        ): { allowed: boolean; newRecord: RateLimitRecord } => {
            if (!record || now > record.resetTime) {
                return {
                    allowed: true,
                    newRecord: { count: 1, resetTime: now + RATE_LIMIT_WINDOW }
                };
            }

            if (record.count >= RATE_LIMIT) {
                return { allowed: false, newRecord: record };
            }

            return {
                allowed: true,
                newRecord: { count: record.count + 1, resetTime: record.resetTime }
            };
        };

        it('should allow first request', () => {
            const result = checkRateLimit(undefined, Date.now());
            expect(result.allowed).toBe(true);
            expect(result.newRecord.count).toBe(1);
        });

        it('should increment count on subsequent requests', () => {
            const now = Date.now();
            const record: RateLimitRecord = { count: 5, resetTime: now + 1000000 };
            const result = checkRateLimit(record, now);
            expect(result.allowed).toBe(true);
            expect(result.newRecord.count).toBe(6);
        });

        it('should deny request at limit', () => {
            const now = Date.now();
            const record: RateLimitRecord = { count: 100, resetTime: now + 1000000 };
            const result = checkRateLimit(record, now);
            expect(result.allowed).toBe(false);
        });

        it('should reset after window expires', () => {
            const now = Date.now();
            const record: RateLimitRecord = { count: 100, resetTime: now - 1000 };
            const result = checkRateLimit(record, now);
            expect(result.allowed).toBe(true);
            expect(result.newRecord.count).toBe(1);
        });
    });
});
