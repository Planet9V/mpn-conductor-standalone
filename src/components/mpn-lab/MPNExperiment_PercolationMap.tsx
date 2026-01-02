'use client';

import React, { useRef, useEffect, useMemo, useCallback } from 'react';

interface PercolationMapProps {
    trauma: number;
    entropy: number;
}

type CellState = 0 | 1 | 2; // 0=healthy, 1=vulnerable, 2=infected

export default function MPNExperiment_PercolationMap({ trauma, entropy }: PercolationMapProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const gridRef = useRef<CellState[][]>([]);
    const timeRef = useRef<number>(0);

    const gridSize = 25;

    // Initialize grid
    const initializeGrid = useCallback(() => {
        const grid: CellState[][] = [];
        for (let y = 0; y < gridSize; y++) {
            const row: CellState[] = [];
            for (let x = 0; x < gridSize; x++) {
                // Initial random vulnerable cells
                row.push(Math.random() < 0.2 ? 1 : 0);
            }
            grid.push(row);
        }
        // Seed some initial infections on the left
        for (let i = 0; i < 3; i++) {
            const y = Math.floor(Math.random() * gridSize);
            if (grid[y]) grid[y][0] = 2;
        }
        gridRef.current = grid;
    }, [gridSize]);

    useEffect(() => {
        initializeGrid();
    }, [initializeGrid]);

    // Find largest cluster using flood fill
    const findLargestCluster = useCallback((): { size: number; cells: Set<string>; spans: boolean } => {
        const grid = gridRef.current;
        const visited = new Set<string>();
        let largestCluster: Set<string> = new Set();
        let spans = false;

        function floodFill(startX: number, startY: number): Set<string> {
            const cluster = new Set<string>();
            const stack = [[startX, startY]];

            while (stack.length > 0) {
                const [x, y] = stack.pop()!;
                const key = `${x},${y}`;

                if (visited.has(key)) continue;
                if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) continue;
                if (grid[y][x] !== 2) continue;

                visited.add(key);
                cluster.add(key);

                // 4-connected neighbors
                stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
            }

            return cluster;
        }

        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                if (grid[y][x] === 2 && !visited.has(`${x},${y}`)) {
                    const cluster = floodFill(x, y);
                    if (cluster.size > largestCluster.size) {
                        largestCluster = cluster;
                    }
                }
            }
        }

        // Check if largest cluster spans left to right
        let hasLeft = false, hasRight = false;
        largestCluster.forEach(key => {
            const x = parseInt(key.split(',')[0]);
            if (x === 0) hasLeft = true;
            if (x === gridSize - 1) hasRight = true;
        });
        spans = hasLeft && hasRight;

        return { size: largestCluster.size, cells: largestCluster, spans };
    }, [gridSize]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = 350;
        const height = 300;
        canvas.width = width;
        canvas.height = height;

        const cellWidth = (width - 80) / gridSize;
        const cellHeight = (height - 60) / gridSize;
        const marginLeft = 40;
        const marginTop = 30;

        function step() {
            const grid = gridRef.current;
            const newGrid: CellState[][] = grid.map(row => [...row]);

            // Infection probability based on trauma
            const infectionProb = 0.1 + trauma * 0.4;
            // Vulnerability spread based on entropy
            const vulnProb = entropy * 0.1;

            for (let y = 0; y < gridSize; y++) {
                for (let x = 0; x < gridSize; x++) {
                    const state = grid[y][x];

                    if (state === 0) {
                        // Healthy -> Vulnerable
                        if (Math.random() < vulnProb) {
                            newGrid[y][x] = 1;
                        }
                    } else if (state === 1) {
                        // Vulnerable -> Infected (if neighbor is infected)
                        const neighbors = [
                            [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]
                        ];

                        let infectedNeighbors = 0;
                        neighbors.forEach(([nx, ny]) => {
                            if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
                                if (grid[ny][nx] === 2) infectedNeighbors++;
                            }
                        });

                        if (infectedNeighbors > 0 && Math.random() < infectionProb * infectedNeighbors) {
                            newGrid[y][x] = 2;
                        }
                    } else {
                        // Infected -> can recover (low probability)
                        if (Math.random() < 0.01 * (1 - trauma)) {
                            newGrid[y][x] = 0;
                        }
                    }
                }
            }

            // Occasionally seed new infections on left edge (attack entry)
            if (Math.random() < trauma * 0.1) {
                const y = Math.floor(Math.random() * gridSize);
                newGrid[y][0] = 2;
            }

            gridRef.current = newGrid;
        }

        function render() {
            timeRef.current++;

            if (timeRef.current % 5 === 0) {
                step();
            }

            const grid = gridRef.current;
            const { size: clusterSize, cells: largestCells, spans } = findLargestCluster();

            // Clear
            ctx!.fillStyle = '#000';
            ctx!.fillRect(0, 0, width, height);

            // Draw grid
            for (let y = 0; y < gridSize; y++) {
                for (let x = 0; x < gridSize; x++) {
                    const state = grid[y][x];
                    const isInLargestCluster = largestCells.has(`${x},${y}`);

                    let color: string;
                    if (state === 0) {
                        color = 'rgba(50, 50, 50, 0.8)';
                    } else if (state === 1) {
                        color = 'rgba(250, 204, 21, 0.6)'; // yellow - vulnerable
                    } else {
                        // Infected - highlight if in largest cluster
                        color = isInLargestCluster && spans
                            ? 'rgba(255, 50, 50, 1)' // bright red if spanning
                            : 'rgba(239, 68, 68, 0.8)'; // normal red
                    }

                    const cx = marginLeft + x * cellWidth;
                    const cy = marginTop + y * cellHeight;

                    ctx!.fillStyle = color;
                    ctx!.fillRect(cx + 1, cy + 1, cellWidth - 2, cellHeight - 2);

                    // Border for spanning cluster
                    if (isInLargestCluster && spans) {
                        ctx!.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                        ctx!.lineWidth = 1;
                        ctx!.strokeRect(cx + 1, cy + 1, cellWidth - 2, cellHeight - 2);
                    }
                }
            }

            // Draw edge labels
            ctx!.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx!.font = '9px monospace';
            ctx!.fillText('ENTRY', marginLeft - 30, marginTop + gridSize * cellHeight / 2);
            ctx!.fillText('EXIT', marginLeft + gridSize * cellWidth + 5, marginTop + gridSize * cellHeight / 2);

            // Draw spanning indicator
            if (spans) {
                ctx!.fillStyle = 'rgba(239, 68, 68, 0.8)';
                ctx!.font = 'bold 10px monospace';
                ctx!.fillText('⚠ PERCOLATION!', marginLeft + gridSize * cellWidth / 2 - 40, height - 10);
            }

            animationRef.current = requestAnimationFrame(render);
        }

        render();

        return () => {
            cancelAnimationFrame(animationRef.current);
        };
    }, [trauma, entropy, gridSize, findLargestCluster]);

    // Calculate stats
    const stats = useMemo(() => {
        const grid = gridRef.current;
        let healthy = 0, vulnerable = 0, infected = 0;
        grid.forEach(row => {
            row.forEach(cell => {
                if (cell === 0) healthy++;
                else if (cell === 1) vulnerable++;
                else infected++;
            });
        });
        const total = gridSize * gridSize;
        return {
            healthy,
            vulnerable,
            infected,
            infectedPct: ((infected / total) * 100).toFixed(1)
        };
    }, [gridSize]);

    // Percolation threshold calculation
    const pThreshold = useMemo(() => {
        // For 2D square lattice, critical threshold is ~0.593
        const currentP = 0.2 + trauma * 0.4; // effective infection probability
        return { current: currentP, critical: 0.593 };
    }, [trauma]);

    return (
        <div className="relative w-full h-full bg-gray-950/90 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center">
            {/* Title */}
            <div className="absolute top-4 left-4 z-10">
                <div className="text-[10px] font-mono text-oxot-gold uppercase tracking-widest mb-1">Experiment 13</div>
                <div className="text-lg font-bold text-white">Percolation Map</div>
                <div className="text-xs text-gray-500">Attack Penetration Threshold</div>
            </div>

            {/* P∞ Order Parameter */}
            <div className="absolute top-4 right-4 z-10 text-right">
                <div className="text-[9px] font-mono text-gray-500 uppercase">P∞ (Infected)</div>
                <div className={`text-xl font-bold ${parseFloat(stats.infectedPct) > 30 ? 'text-red-400' : 'text-green-400'}`}>
                    {stats.infectedPct}%
                </div>
                <div className="text-[8px] font-mono text-gray-600">
                    p = {pThreshold.current.toFixed(2)} | pₓ = {pThreshold.critical.toFixed(2)}
                </div>
            </div>

            {/* Canvas */}
            <canvas
                ref={canvasRef}
                className="w-full h-full"
                style={{ imageRendering: 'auto' }}
            />

            {/* Legend */}
            <div className="absolute bottom-4 left-4 flex gap-3 text-[7px] font-mono">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-600"></div>
                    <span className="text-gray-500">Healthy</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-yellow-400"></div>
                    <span className="text-gray-500">Vulnerable</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500"></div>
                    <span className="text-gray-500">Infected</span>
                </div>
            </div>
        </div>
    );
}
