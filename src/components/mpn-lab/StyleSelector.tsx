'use client';

import { useState, useEffect } from 'react';

interface MusicalStyle {
    id: string;
    name: string;
    description: string;
    orchestrationMode?: string;
    rhythm: {
        base_division: number;
        syncopation_weight: number;
        swing: boolean;
        tempo_range: [number, number];
    };
    harmony: {
        complexity: number;
        dissonance_tolerance: number;
        preferred_modes: string[];
    };
    texture: {
        density: number;
        voice_leading_strictness: number;
    };
    isSystem: boolean;
    isCustom: boolean;
}

interface StyleSelectorProps {
    currentStyleId: string;
    onStyleChange: (styleId: string) => void;
    trauma?: number;
    entropy?: number;
    rsi?: { real: number; symbolic: number; imaginary: number };
    showParameters?: boolean;
}

export default function StyleSelector({
    currentStyleId,
    onStyleChange,
    trauma = 0.5,
    entropy = 0.5,
    rsi = { real: 0.33, symbolic: 0.33, imaginary: 0.34 },
    showParameters = true
}: StyleSelectorProps) {
    const [styles, setStyles] = useState<MusicalStyle[]>([]);
    const [selectedStyle, setSelectedStyle] = useState<MusicalStyle | null>(null);
    const [recommendedStyleId, setRecommendedStyleId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch all styles
    useEffect(() => {
        async function fetchStyles() {
            try {
                const response = await fetch('/api/styles/list');
                const data = await response.json();

                if (data.success) {
                    setStyles(data.styles);
                    const current = data.styles.find((s: MusicalStyle) => s.id === currentStyleId);
                    if (current) setSelectedStyle(current);
                } else {
                    setError(data.error);
                }
            } catch (err) {
                setError('Failed to load styles');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchStyles();
    }, [currentStyleId]);

    // Fetch AI recommendation
    useEffect(() => {
        async function fetchRecommendation() {
            try {
                const params = new URLSearchParams({
                    trauma: trauma.toString(),
                    entropy: entropy.toString(),
                    rsi_real: rsi.real.toString(),
                    rsi_symbolic: rsi.symbolic.toString(),
                    rsi_imaginary: rsi.imaginary.toString()
                });

                const response = await fetch(`/api/styles/recommend?${params}`);
                const data = await response.json();

                if (data.success) {
                    setRecommendedStyleId(data.recommended.id);
                }
            } catch (err) {
                console.error('Failed to fetch recommendation:', err);
            }
        }

        fetchRecommendation();
    }, [trauma, entropy, rsi]);

    const handleStyleChange = (styleId: string) => {
        const style = styles.find(s => s.id === styleId);
        if (style) {
            setSelectedStyle(style);
            onStyleChange(styleId);
        }
    };

    if (loading) {
        return (
            <div className="style-selector loading">
                <div className="spinner" />
                <span>Loading styles...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="style-selector error">
                <span>⚠️ {error}</span>
            </div>
        );
    }

    return (
        <div className="style-selector">
            {/* Style Dropdown */}
            <div className="style-dropdown-container">
                <label htmlFor="style-select" className="style-label">
                    Musical Style
                </label>
                <select
                    id="style-select"
                    value={currentStyleId}
                    onChange={(e) => handleStyleChange(e.target.value)}
                    className="style-dropdown"
                >
                    {styles.map((style) => (
                        <option key={style.id} value={style.id}>
                            {style.name}
                            {style.id === recommendedStyleId && ' ✨ (Recommended)'}
                        </option>
                    ))}
                </select>
            </div>

            {/* Style Description */}
            {selectedStyle && (
                <div className="style-description">
                    <p>{selectedStyle.description}</p>
                    {selectedStyle.orchestrationMode && (
                        <span className="orchestration-badge">
                            {selectedStyle.orchestrationMode.replace(/_/g, ' ')}
                        </span>
                    )}
                </div>
            )}

            {/* Style Parameters */}
            {showParameters && selectedStyle && (
                <div className="style-parameters">
                    <h4>Style Parameters</h4>

                    {/* Rhythm */}
                    <div className="param-group">
                        <h5>🎵 Rhythm</h5>
                        <div className="param-row">
                            <span>Base Division:</span>
                            <span className="param-value">
                                {selectedStyle.rhythm.base_division === 4 ? 'Quarter notes' :
                                    selectedStyle.rhythm.base_division === 8 ? 'Eighth notes' :
                                        selectedStyle.rhythm.base_division === 16 ? 'Sixteenth notes' :
                                            '32nd notes'}
                            </span>
                        </div>
                        <div className="param-row">
                            <span>Syncopation:</span>
                            <div className="param-bar">
                                <div
                                    className="param-bar-fill"
                                    style={{ width: `${selectedStyle.rhythm.syncopation_weight * 100}%` }}
                                />
                                <span className="param-value">{(selectedStyle.rhythm.syncopation_weight * 100).toFixed(0)}%</span>
                            </div>
                        </div>
                        <div className="param-row">
                            <span>Swing:</span>
                            <span className="param-value">
                                {selectedStyle.rhythm.swing ? '✅ Yes' : '❌ No'}
                            </span>
                        </div>
                        <div className="param-row">
                            <span>Tempo:</span>
                            <span className="param-value">
                                {selectedStyle.rhythm.tempo_range[0]}-{selectedStyle.rhythm.tempo_range[1]} BPM
                            </span>
                        </div>
                    </div>

                    {/* Harmony */}
                    <div className="param-group">
                        <h5>🎹 Harmony</h5>
                        <div className="param-row">
                            <span>Complexity:</span>
                            <div className="param-bar">
                                <div
                                    className="param-bar-fill"
                                    style={{ width: `${selectedStyle.harmony.complexity * 100}%` }}
                                />
                                <span className="param-value">{(selectedStyle.harmony.complexity * 100).toFixed(0)}%</span>
                            </div>
                        </div>
                        <div className="param-row">
                            <span>Dissonance:</span>
                            <div className="param-bar">
                                <div
                                    className="param-bar-fill dissonance"
                                    style={{ width: `${selectedStyle.harmony.dissonance_tolerance * 100}%` }}
                                />
                                <span className="param-value">{(selectedStyle.harmony.dissonance_tolerance * 100).toFixed(0)}%</span>
                            </div>
                        </div>
                        <div className="param-row">
                            <span>Modes:</span>
                            < span className="param-value modes">
                                {selectedStyle.harmony.preferred_modes.join(', ')}
                            </span>
                        </div>
                    </div>

                    {/* Texture */}
                    <div className="param-group">
                        <h5>🎼 Texture</h5>
                        <div className="param-row">
                            <span>Density:</span>
                            <div className="param-bar">
                                <div
                                    className="param-bar-fill"
                                    style={{ width: `${selectedStyle.texture.density * 100}%` }}
                                />
                                <span className="param-value">{(selectedStyle.texture.density * 100).toFixed(0)}%</span>
                            </div>
                        </div>
                        <div className="param-row">
                            <span>Voice Leading:</span>
                            <div className="param-bar">
                                <div
                                    className="param-bar-fill"
                                    style={{ width: `${selectedStyle.texture.voice_leading_strictness * 100}%` }}
                                />
                                <span className="param-value">
                                    {selectedStyle.texture.voice_leading_strictness > 0.8 ? 'Strict' :
                                        selectedStyle.texture.voice_leading_strictness > 0.5 ? 'Moderate' : 'Free'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .style-selector {
                    background: rgba(20, 20, 30, 0.8);
                    border-radius: 12px;
                    padding: 20px;
                    margin: 16px 0;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(100, 100, 120, 0.2);
                }

                .style-dropdown-container {
                    margin-bottom: 16px;
                }

                .style-label {
                    display: block;
                    font-size: 14px;
                    font-weight: 600;
                    color: #a0a0c0;
                    margin-bottom: 8px;
                }

                .style-dropdown {
                    width: 100%;
                    padding: 12px 16px;
                    background: rgba(40, 40, 60, 0.9);
                    border: 2px solid rgba(100, 100, 150, 0.3);
                    border-radius: 8px;
                    color: #e0e0e0;
                    font-size: 16px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .style-dropdown:hover {
                    border-color: rgba(150, 150, 200, 0.6);
                    background: rgba(50, 50, 70, 1);
                }

                .style-dropdown:focus {
                    outline: none;
                    border-color: #7c4dff;
                    box-shadow: 0 0 0 3px rgba(124, 77, 255, 0.2);
                }

                .style-description {
                    padding: 12px 16px;
                    background: rgba(50, 50, 70, 0.5);
                    border-radius: 8px;
                    margin-bottom: 16px;
                }

                .style-description p {
                    margin: 0 0 8px 0;
                    color: #c0c0d0;
                    font-size: 14px;
                    line-height: 1.6;
                }

                .orchestration-badge {
                    display: inline-block;
                    padding: 4px 12px;
                    background: rgba(124, 77, 255, 0.2);
                    border: 1px solid rgba(124, 77, 255, 0.4);
                    border-radius: 12px;
                    color: #a78bfa;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .style-parameters {
                    margin-top: 20px;
                }

                .style-parameters h4 {
                    margin: 0 0 16px 0;
                    color: #e0e0e0;
                    font-size: 16px;
                    font-weight: 700;
                }

                .param-group {
                    margin-bottom: 20px;
                    padding: 16px;
                    background: rgba(30, 30, 45, 0.6);
                    border-radius: 8px;
                    border: 1px solid rgba(80, 80, 100, 0.3);
                }

                .param-group h5 {
                    margin: 0 0 12px 0;
                    color: #b0b0c0;
                    font-size: 14px;
                    font-weight: 600;
                }

                .param-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                    font-size: 13px;
                }

                .param-row span:first-child {
                    color: #9090a0;
                    flex: 0 0 120px;
                }

                .param-value {
                    color: #d0d0e0;
                    font-weight: 500;
                }

                .param-value.modes {
                    font-size: 12px;
                    text-align: right;
                    flex: 1;
                }

                .param-bar {
                    flex: 1;
                    height: 24px;
                    background: rgba(40, 40, 60, 0.8);
                    border-radius: 12px;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    padding: 0 8px;
                }

                .param-bar-fill {
                    position: absolute;
                    left: 0;
                    top: 0;
                    height: 100%;
                    background: linear-gradient(90deg, #7c4dff 0%, #a78bfa 100%);
                    transition: width 0.3s ease;
                }

                .param-bar-fill.dissonance {
                    background: linear-gradient(90deg, #ef4444 0%, #f87171 100%);
                }

                .param-bar .param-value {
                    position: relative;
                    z-index: 1;
                    margin-left: auto;
                    font-size: 11px;
                    font-weight: 700;
                }

                .loading, .error {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px;
                    color: #c0c0d0;
                }

                .spinner {
                    width: 20px;
                    height: 20px;
                    border: 3px solid rgba(124, 77, 255, 0.2);
                    border-top-color: #7c4dff;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
