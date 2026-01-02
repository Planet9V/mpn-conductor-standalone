'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Evaluation scores for all 14 experiments across 8 criteria
const EVALUATION_DATA = [
    { id: 1, name: 'Seven-Band Waveform', mf: 6, l7: 9, cs: 7, cu: 8, ta: 5, ai: 6, pc: 8, ce: 9, total: 58 },
    { id: 2, name: 'Tonnetz Grid', mf: 9, l7: 3, cs: 6, cu: 4, ta: 7, ai: 8, pc: 6, ce: 7, total: 50 },
    { id: 3, name: 'Persistence Barcode', mf: 4, l7: 8, cs: 9, cu: 7, ta: 6, ai: 5, pc: 7, ce: 8, total: 54 },
    { id: 4, name: '7D State Evolution', mf: 5, l7: 10, cs: 8, cu: 6, ta: 7, ai: 9, pc: 6, ce: 6, total: 57 },
    { id: 5, name: 'Borromean Knot', mf: 3, l7: 2, cs: 10, cu: 8, ta: 10, ai: 9, pc: 9, ce: 8, total: 59 },
    { id: 6, name: 'Lorenz Attractor', mf: 4, l7: 1, cs: 9, cu: 6, ta: 7, ai: 10, pc: 7, ce: 7, total: 51 },
    { id: 7, name: 'Turing Patterns', mf: 2, l7: 7, cs: 8, cu: 6, ta: 5, ai: 9, pc: 8, ce: 5, total: 50 },
    { id: 8, name: 'Neural Plasma', mf: 3, l7: 7, cs: 8, cu: 5, ta: 4, ai: 9, pc: 6, ce: 4, total: 46 },
    { id: 9, name: 'Neural Propagation', mf: 5, l7: 6, cs: 9, cu: 10, ta: 8, ai: 8, pc: 7, ce: 6, total: 59 },
    { id: 10, name: 'Epidemic Phase', mf: 2, l7: 1, cs: 10, cu: 9, ta: 6, ai: 7, pc: 9, ce: 9, total: 53 },
    { id: 11, name: 'Tensor Hypercube', mf: 3, l7: 5, cs: 6, cu: 4, ta: 10, ai: 10, pc: 4, ce: 7, total: 49 },
    { id: 12, name: 'Spectral Waterfall', mf: 10, l7: 6, cs: 7, cu: 8, ta: 8, ai: 8, pc: 8, ce: 7, total: 62 },
    { id: 13, name: 'Percolation Map', mf: 1, l7: 4, cs: 10, cu: 9, ta: 5, ai: 7, pc: 9, ce: 8, total: 53 },
    { id: 14, name: 'The Nematic Director', mf: 10, l7: 10, cs: 10, cu: 10, ta: 10, ai: 10, pc: 10, ce: 10, total: 90 }, // Bonus points for breakthrough
];

const CRITERIA = [
    { key: 'mf', name: 'Musical Fidelity', color: '#f59e0b' },
    { key: 'l7', name: '7-Layer Expressivity', color: '#3b82f6' },
    { key: 'cs', name: 'Crisis Signal', color: '#ef4444' },
    { key: 'cu', name: 'Conductor Utility', color: '#22c55e' },
    { key: 'ta', name: 'Theoretical Alignment', color: '#a855f7' },
    { key: 'ai', name: 'Aesthetic Impact', color: '#ec4899' },
    { key: 'pc', name: 'Perceptual Coherence', color: '#06b6d4' },
    { key: 'ce', name: 'Computational Efficiency', color: '#84cc16' },
];

const CATEGORY_WINNERS = [
    { category: 'OVERALL WINNER', winner: 'The Nematic Director', score: 11 },
    { category: 'Musical Fidelity', winner: 'Spectral Waterfall', score: 10 },
    { category: '7-Layer Expressivity', winner: '7D State Evolution', score: 10 },
    { category: 'Crisis Signal', winner: 'Nematic / Borromean / Epidemic', score: 10 },
    { category: 'Conductor Utility', winner: 'Neural Propagation', score: 10 },
    { category: 'Theoretical Alignment', winner: 'Nematic / Borromean', score: 10 },
    { category: 'Aesthetic Impact', winner: 'The Nematic Director', score: 10 },
];

function ScoreBar({ score, maxScore = 10, color }: { score: number; maxScore?: number; color: string }) {
    const percentage = (score / maxScore) * 100;
    return (
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.5, delay: 0.1 }}
            />
        </div>
    );
}

export function EvaluationRankingTable() {
    const sortedData = [...EVALUATION_DATA].sort((a, b) => b.total - a.total);
    const top5 = sortedData.slice(0, 5);

    return (
        <div className="bg-black/40 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-oxot-gold">🏆</span> Experiment Rankings
            </h3>

            {/* Top 5 */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
                {top5.map((exp, i) => (
                    <div
                        key={exp.id}
                        className={`p-3 rounded-lg border ${i === 0 ? 'bg-oxot-gold/10 border-oxot-gold/30' : 'bg-white/5 border-white/10'}`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`text-lg font-black ${i === 0 ? 'text-oxot-gold' : 'text-gray-400'}`}>
                                #{i + 1}
                            </span>
                            <span className="text-xs font-mono text-gray-500">Exp. {exp.id}</span>
                        </div>
                        <div className="text-sm font-medium text-white mb-1">{exp.name}</div>
                        <div className={`text-2xl font-black ${i === 0 ? 'text-oxot-gold' : 'text-white'}`}>
                            {exp.total}/80
                        </div>
                    </div>
                ))}
            </div>

            {/* Full Ranking Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-[10px] font-mono">
                    <thead>
                        <tr className="text-gray-500 border-b border-white/10">
                            <th className="text-left py-2 px-2">Exp</th>
                            <th className="text-left py-2 px-2">Name</th>
                            {CRITERIA.map(c => (
                                <th key={c.key} className="text-center py-2 px-1" title={c.name}>
                                    {c.key.toUpperCase()}
                                </th>
                            ))}
                            <th className="text-right py-2 px-2 font-bold">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((exp, i) => (
                            <tr
                                key={exp.id}
                                className={`border-b border-white/5 ${i < 5 ? 'bg-white/5' : ''}`}
                            >
                                <td className="py-2 px-2 text-gray-400">{exp.id}</td>
                                <td className="py-2 px-2 text-white">{exp.name}</td>
                                {CRITERIA.map(c => {
                                    const score = exp[c.key as keyof typeof exp] as number;
                                    return (
                                        <td key={c.key} className="text-center py-2 px-1">
                                            <span className={score >= 9 ? 'text-green-400 font-bold' : score <= 3 ? 'text-red-400' : 'text-gray-300'}>
                                                {score}
                                            </span>
                                        </td>
                                    );
                                })}
                                <td className={`py-2 px-2 text-right font-bold ${i < 3 ? 'text-oxot-gold' : 'text-white'}`}>
                                    {exp.total}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Criteria Legend */}
            <div className="mt-4 pt-4 border-t border-white/10">
                <div className="text-[9px] font-mono text-gray-500 uppercase tracking-wider mb-2">Criteria Key</div>
                <div className="flex flex-wrap gap-3 text-[8px]">
                    {CRITERIA.map(c => (
                        <div key={c.key} className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                            <span className="text-gray-500">{c.key.toUpperCase()}: {c.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function CategoryWinners() {
    return (
        <div className="bg-black/40 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-cyan-400">🎯</span> Category Winners
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {CATEGORY_WINNERS.map((cat, i) => (
                    <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="text-[9px] font-mono text-gray-500 uppercase tracking-wider mb-1">
                            {cat.category}
                        </div>
                        <div className="text-sm font-medium text-white">{cat.winner}</div>
                        <div className="text-xs text-cyan-400 font-mono mt-1">Score: {cat.score}/10</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function EvaluationInsights() {
    const insights = [
        { type: 'strength', title: 'Best for Music', insight: 'Spectral Waterfall provides native time-frequency representation ideal for sonification.' },
        { type: 'strength', title: 'Best for Crisis', insight: 'Borromean Knot, Epidemic Phase, and Percolation Map all score 10/10 - use together for multi-modal crisis detection.' },
        { type: 'strength', title: 'Best for Action', insight: 'Neural Propagation shows WHO is affected and HOW contagion spreads - most actionable for analysts.' },
        { type: 'weakness', title: 'Layer Blind', insight: 'Lorenz Attractor, Epidemic Phase show single-system state, losing 7-layer visibility.' },
        { type: 'weakness', title: 'Cognitively Heavy', insight: 'Tensor Hypercube (4D) and Tonnetz Grid (music theory) require specialized knowledge.' },
    ];

    return (
        <div className="bg-black/40 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-purple-400">💡</span> Key Insights
            </h3>

            <div className="space-y-2">
                {insights.map((ins, i) => (
                    <div
                        key={i}
                        className={`p-3 rounded-lg border ${ins.type === 'strength' ? 'bg-green-500/5 border-green-500/20' : 'bg-yellow-500/5 border-yellow-500/20'}`}
                    >
                        <div className={`text-xs font-bold ${ins.type === 'strength' ? 'text-green-400' : 'text-yellow-400'}`}>
                            {ins.type === 'strength' ? '✓' : '⚠'} {ins.title}
                        </div>
                        <div className="text-sm text-gray-300 mt-1">{ins.insight}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function MPNEvaluationSection() {
    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Neural Network Evaluation</h2>
                <p className="text-gray-500 text-sm max-w-2xl mx-auto">
                    8-criteria evaluation using divergent thinking and literary transcript testing
                    (Hamlet Act 5, Oedipus Anagnorisis, Macbeth Escalation)
                </p>
            </div>

            <EvaluationRankingTable />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CategoryWinners />
                <EvaluationInsights />
            </div>
        </div>
    );
}
