/**
 * E2E Test Fixtures for MPN Conductor
 * 
 * Provides reusable helper functions for common test setup operations,
 * enabling stable, state-aware tests following Playwright best practices.
 */

import { Page, expect } from '@playwright/test';

/**
 * Select a scenario in MPN Conductor by name or index
 * @param page - Playwright page object
 * @param scenarioName - Optional scenario name to search for (default: 'hamlet')
 */
export async function selectScenario(page: Page, scenarioName = 'hamlet'): Promise<void> {
    const selector = page.getByTestId('scenario-selector');
    await selector.waitFor({ state: 'visible', timeout: 10000 });

    // Try to find matching option
    const options = await selector.locator('option').allTextContents();
    const matchingIndex = options.findIndex(o =>
        o.toLowerCase().includes(scenarioName.toLowerCase())
    );

    if (matchingIndex >= 0) {
        await selector.selectOption({ index: matchingIndex });
    } else if (options.length > 1) {
        // Fallback to first non-placeholder option
        await selector.selectOption({ index: 1 });
    }

    // Wait for UI to update after scenario change
    await page.waitForTimeout(1500);
}

/**
 * Wait for the score canvas container to be visible
 * @param page - Playwright page object
 */
export async function waitForScoreReady(page: Page): Promise<void> {
    await page.getByTestId('score-canvas-container').waitFor({
        state: 'visible',
        timeout: 15000
    });
}

/**
 * Wait for metrics bar to be visible
 * @param page - Playwright page object
 */
export async function waitForMetrics(page: Page): Promise<void> {
    await page.getByTestId('metrics-bar').waitFor({
        state: 'visible',
        timeout: 10000
    });
}

/**
 * Complete setup for conductor page with scenario selected
 * @param page - Playwright page object
 * @param scenarioName - Optional scenario to select
 */
export async function setupConductorWithScenario(page: Page, scenarioName = 'hamlet'): Promise<void> {
    await page.goto('/mpn-conductor');
    await page.waitForLoadState('networkidle');
    await selectScenario(page, scenarioName);
    await waitForMetrics(page);
}

/**
 * Navigate to conductor and wait for initial load
 * @param page - Playwright page object
 */
export async function navigateToConductor(page: Page): Promise<void> {
    await page.goto('/mpn-conductor');
    await page.waitForLoadState('networkidle');
    // Wait for scenario selector to be interactive
    await page.getByTestId('scenario-selector').waitFor({ state: 'visible', timeout: 15000 });
}

/**
 * Toggle AI mode on/off
 * @param page - Playwright page object
 * @param enabled - Whether to enable or disable AI
 */
export async function toggleAI(page: Page, enabled: boolean): Promise<void> {
    const aiToggle = page.getByTestId('ai-toggle');
    await aiToggle.waitFor({ state: 'visible', timeout: 5000 });

    // Check current state
    const currentState = await aiToggle.getAttribute('class');
    const isCurrentlyEnabled = currentState?.includes('bg-green');

    if (isCurrentlyEnabled !== enabled) {
        await aiToggle.click();
        await page.waitForTimeout(500);
    }
}

/**
 * Click play button and optionally wait for frame advancement
 * @param page - Playwright page object
 * @param waitForFrames - Number of frames to wait for (0 = no wait)
 */
export async function clickPlay(page: Page, waitForFrames = 0): Promise<void> {
    const playButton = page.getByTestId('play-button');
    await playButton.waitFor({ state: 'visible', timeout: 5000 });
    await playButton.click();

    if (waitForFrames > 0) {
        await page.waitForTimeout(waitForFrames * 1000);
    }
}

/**
 * Get current trauma value from metrics bar
 * @param page - Playwright page object
 * @returns Current trauma value as a number
 */
export async function getTraumaValue(page: Page): Promise<number> {
    const traumaEl = page.getByTestId('trauma-value');
    const text = await traumaEl.textContent();
    const match = text?.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
}

/**
 * Get current entropy value from metrics bar
 * @param page - Playwright page object  
 * @returns Current entropy value as a number
 */
export async function getEntropyValue(page: Page): Promise<number> {
    const entropyEl = page.getByTestId('entropy-value');
    const text = await entropyEl.textContent();
    const match = text?.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
}

/**
 * Parse API response that may be wrapped in various formats
 * @param data - Response data from API
 * @returns Extracted array from response
 */
export function parseWrappedArray<T>(data: unknown): T[] {
    if (Array.isArray(data)) {
        return data as T[];
    }
    if (typeof data === 'object' && data !== null) {
        const obj = data as Record<string, unknown>;
        if (Array.isArray(obj.styles)) return obj.styles as T[];
        if (Array.isArray(obj.data)) return obj.data as T[];
        if (Array.isArray(obj.items)) return obj.items as T[];
        if (Array.isArray(obj.results)) return obj.results as T[];
    }
    return [];
}

/**
 * Wait for orchestrator dashboard to be visible
 * @param page - Playwright page object
 */
export async function waitForDashboard(page: Page): Promise<void> {
    await page.getByTestId('orchestrator-dashboard').waitFor({
        state: 'visible',
        timeout: 10000
    });
}

/**
 * Get current frame number from frame counter
 * @param page - Playwright page object
 * @returns Object with current and total frame numbers
 */
export async function getFrameInfo(page: Page): Promise<{ current: number; total: number }> {
    const frameEl = page.getByTestId('frame-counter');
    const text = await frameEl.textContent();
    const match = text?.match(/Frame\s*(\d+)\s*\/\s*(\d+)/i);
    if (match) {
        return { current: parseInt(match[1]), total: parseInt(match[2]) };
    }
    return { current: 0, total: 0 };
}
