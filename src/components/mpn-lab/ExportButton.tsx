'use client';

import React, { useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { PsychometricScoreFrame } from '@/components/mpn-lab/score_types';
import { exportScoreWithMetadata, downloadMP3 } from '@/lib/audio_exporter';

interface ExportButtonProps {
    frames: PsychometricScoreFrame[];
    title: string;
    author?: string;
    scenario?: string;
    tempo?: number;
    disabled?: boolean;
}

export default function ExportButton({
    frames,
    title,
    author,
    scenario,
    tempo = 80,
    disabled = false
}: ExportButtonProps) {
    const [isExporting, setIsExporting] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleExport = async () => {
        if (frames.length === 0) {
            alert('No score frames to export');
            return;
        }

        setIsExporting(true);
        setProgress(0);

        try {
            // Update progress
            const progressInterval = setInterval(() => {
                setProgress(prev => Math.min(prev + 10, 90));
            }, 200);

            const mp3Blob = await exportScoreWithMetadata(
                frames,
                {
                    title,
                    author,
                    scenario,
                    generatedAt: new Date().toISOString()
                },
                tempo
            );

            clearInterval(progressInterval);
            setProgress(100);

            // Download the file
            const filename = `${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`;
            downloadMP3(mp3Blob, filename);

            // Show success message
            setTimeout(() => {
                setIsExporting(false);
                setProgress(0);
            }, 1000);

        } catch (error) {
            console.error('[ExportButton] Export failed:', error);
            alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setIsExporting(false);
            setProgress(0);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={disabled || isExporting || frames.length === 0}
            className="export-button"
            title={`Export ${title} as MP3`}
        >
            {isExporting ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{progress}%</span>
                </>
            ) : (
                <>
                    <FileDown className="w-4 h-4" />
                    <span>Export MP3</span>
                </>
            )}

            <style jsx>{`
                .export-button {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 16px;
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    border: none;
                    border-radius: 8px;
                    color: white;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);
                }

                .export-button:hover:not(:disabled) {
                    background: linear-gradient(135deg, #059669 0%, #047857 100%);
                    transform: translateY(-2px);
                    box-shadow: 0 6px 10px rgba(16, 185, 129, 0.3);
                }

                .export-button:active:not(:disabled) {
                    transform: translateY(0);
                }

                .export-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    box-shadow: none;
                }
            `}</style>
        </button>
    );
}
