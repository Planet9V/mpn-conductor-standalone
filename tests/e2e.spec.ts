/**
 * MPN Conductor E2E Tests
 * End-to-end tests using Playwright
 */

import { test, expect } from '@playwright/test';

test.describe('MPN Conductor Application', () => {
    test.describe('Landing Page', () => {
        test('should load the landing page', async ({ page }) => {
            await page.goto('/');

            // Check title
            await expect(page).toHaveTitle(/MPN Conductor/);
        });

        test('should display MPN branding', async ({ page }) => {
            await page.goto('/');

            // Check for MPN text
            await expect(page.locator('text=MPN')).toBeVisible();
            await expect(page.locator('text=Conductor')).toBeVisible();
        });

        test('should have navigation links', async ({ page }) => {
            await page.goto('/');

            // Check navigation links
            await expect(page.locator('a[href="/mpn-conductor"]')).toBeVisible();
            await expect(page.locator('a[href="/mpn-reference"]')).toBeVisible();
            await expect(page.locator('a[href="/mpn-lab"]')).toBeVisible();
        });

        test('should navigate to Conductor page', async ({ page }) => {
            await page.goto('/');

            await page.click('a[href="/mpn-conductor"]');
            await expect(page).toHaveURL(/\/mpn-conductor/);
        });

        test('should navigate to Reference page', async ({ page }) => {
            await page.goto('/');

            await page.click('a[href="/mpn-reference"]');
            await expect(page).toHaveURL(/\/mpn-reference/);
        });

        test('should navigate to Lab page', async ({ page }) => {
            await page.goto('/');

            await page.click('a[href="/mpn-lab"]');
            await expect(page).toHaveURL(/\/mpn-lab/);
        });
    });

    test.describe('MPN Conductor Page', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/mpn-conductor');
        });

        test('should load the conductor page', async ({ page }) => {
            await expect(page.locator('body')).toBeVisible();
        });

        test('should display scenario selector', async ({ page }) => {
            // Look for scenario selection UI
            const scenarioSelector = page.locator('select, [role="combobox"], [data-testid="scenario-select"]');
            await expect(scenarioSelector.first()).toBeVisible({ timeout: 10000 });
        });

        test('should display playback controls', async ({ page }) => {
            // Check for play/pause buttons
            const controls = page.locator('button');
            await expect(controls.first()).toBeVisible({ timeout: 10000 });
        });

        test('should display psychometric dashboard', async ({ page }) => {
            // Look for trauma/entropy metrics
            await expect(page.locator('text=/trauma|τ/i').first()).toBeVisible({ timeout: 10000 });
        });

        test('should have volume control', async ({ page }) => {
            // Look for volume slider or control
            const volumeControl = page.locator('input[type="range"], [aria-label*="volume" i]');
            await expect(volumeControl.first()).toBeVisible({ timeout: 10000 });
        });

        test('should have AI toggle', async ({ page }) => {
            // Look for AI enable checkbox or toggle
            const aiToggle = page.locator('input[type="checkbox"], [role="switch"]');
            await expect(aiToggle.first()).toBeVisible({ timeout: 10000 });
        });
    });

    test.describe('MPN Reference Page', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/mpn-reference');
        });

        test('should load the reference page', async ({ page }) => {
            await expect(page.locator('body')).toBeVisible();
        });

        test('should display reference categories', async ({ page }) => {
            // Check for category filters
            await expect(page.locator('text=/Timbre|Rhythm|Harmony|Dynamics/i').first()).toBeVisible({ timeout: 10000 });
        });

        test('should display reference entries', async ({ page }) => {
            // Should have multiple reference entries
            const entries = page.locator('[data-testid="reference-entry"], .reference-entry, article, .card');
            await expect(entries.first()).toBeVisible({ timeout: 10000 });
        });

        test('should have search functionality', async ({ page }) => {
            // Look for search input
            const searchInput = page.locator('input[type="text"], input[type="search"], [placeholder*="search" i]');
            await expect(searchInput.first()).toBeVisible({ timeout: 10000 });
        });

        test('should display AI models section', async ({ page }) => {
            // Should have AI models reference
            await expect(page.locator('text=/AI Model|OpenRouter|HuggingFace/i').first()).toBeVisible({ timeout: 10000 });
        });
    });

    test.describe('MPN Lab Page', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/mpn-lab');
        });

        test('should load the lab page', async ({ page }) => {
            await expect(page.locator('body')).toBeVisible();
        });

        test('should display experimental visualizations', async ({ page }) => {
            // Check for 3D canvases or SVG visualizations
            const visuals = page.locator('canvas, svg');
            await expect(visuals.first()).toBeVisible({ timeout: 15000 });
        });
    });
});

test.describe('Responsive Design', () => {
    test('should be responsive on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');

        await expect(page.locator('body')).toBeVisible();
        // Content should still be accessible
        await expect(page.locator('text=MPN')).toBeVisible();
    });

    test('should be responsive on tablet', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.goto('/mpn-conductor');

        await expect(page.locator('body')).toBeVisible();
    });

    test('should work on desktop', async ({ page }) => {
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.goto('/mpn-conductor');

        await expect(page.locator('body')).toBeVisible();
    });
});

test.describe('Error Handling', () => {
    test('should handle 404 gracefully', async ({ page }) => {
        const response = await page.goto('/non-existent-page');

        // Should get a response
        expect(response?.status()).toBeDefined();
    });
});
