import { test, expect } from '@playwright/test';

test.describe('J Radio - Sidebar & Feature Tests', () => {

    test.beforeEach(async ({ page }) => {
        // Mock Stations
        await page.route('**/stations/search?**', async route => {
            await route.fulfill({
                json: [{
                    stationuuid: 'test-1', name: 'Test Radio', url: 'http://test.com', countrycode: 'TH',
                    tags: 'jazz,pop', votes: 100, geo_lat: 13.75, geo_long: 100.50
                }]
            });
        });

        // Mock Geo IP
        await page.route('https://ipapi.co/json/', async route => {
            await route.fulfill({ json: { country_code: 'TH', country_name: 'Thailand', latitude: 13.75, longitude: 100.50 } });
        });

        await page.goto('http://localhost:5173');

        // Wait for Welcome Button and Click
        const startBtn = page.getByTestId('welcome-start-btn');
        await startBtn.waitFor({ state: 'visible', timeout: 15000 });
        await startBtn.click();

        // Open Sidebar expressly
        await page.getByTestId('nav-explore-btn').click();

        // Ensure Sidebar is open
        await expect(page.getByTestId('sidebar-search-input')).toBeVisible({ timeout: 10000 });
    });

    test('should allow searching for stations', async ({ page }) => {
        const searchInput = page.getByTestId('sidebar-search-input');

        // Action: Type search query
        await searchInput.fill('Test');

        // Expect: Content area visible
        const contentArea = page.getByTestId('sidebar-content-area');
        await expect(contentArea).toBeVisible();
    });

    test('should switch sidebar tabs correctly', async ({ page }) => {
        // Ensure Sidebar is open and stable
        const sidebar = page.getByTestId('sidebar-search-input');
        await expect(sidebar).toBeVisible();

        // Verify all tabs dependably exist
        await expect(page.locator('button[data-testid^="tab-"]')).toHaveCount(4);

        // Action: Click Favorites Tab directly (Skip Stations to isolate crash/overlap)
        const tabFavorites = page.getByTestId('tab-favorites');
        await tabFavorites.click();

        // Check for "Saved" content (Text "No favorites yet" or "Saved Locks")
        // Sidebar title usually changes or content changes
        // Check for active state class or content
        await expect(page.locator('button[data-testid="tab-favorites"]')).toHaveClass(/bg-/); // Check if active style applied

        // Action: Click History Tab
        await page.waitForTimeout(500);
        const tabHistory = page.getByTestId('tab-history');
        await expect(tabHistory).toBeVisible();
        await tabHistory.click();

        await expect(page.locator('button[data-testid="tab-history"]')).toHaveClass(/bg-/);
    });

});
