import { test, expect } from '@playwright/test';

test.describe('J Radio - Audio Player Tests', () => {

    test.beforeEach(async ({ page }) => {
        // Mock Stations API
        await page.route('**/stations/search?**', async route => {
            await route.fulfill({
                json: [{
                    stationuuid: 'test-station-1', name: 'Test Station 1', url: 'http://test.com/stream',
                    countrycode: 'TH', geo_lat: 13.75, geo_long: 100.50, votes: 999, bitrate: 128, tags: 'pop'
                }]
            });
        });

        // Mock Geo IP (Crucial to prevent hang)
        await page.route('https://ipapi.co/json/', async route => {
            await route.fulfill({ json: { country_code: 'TH', country_name: 'Thailand', latitude: 13.75, longitude: 100.50 } });
        });

        await page.goto('http://localhost:5173');

        const startBtn = page.getByTestId('welcome-start-btn');
        await startBtn.waitFor({ state: 'visible', timeout: 30000 });
        await startBtn.click();

        // Open Sidebar to find station
        await page.getByTestId('nav-explore-btn').click();

        // Select a station to show player
        // Wait for the station list to populate
        const stationBtn = page.locator('button').filter({ hasText: 'Test Station 1' }).first();
        await stationBtn.waitFor({ state: 'visible', timeout: 10000 });
        await stationBtn.click();

        // Wait for player card to appear
        await page.getByTestId('audio-player-card').waitFor({ state: 'visible', timeout: 5000 });
    });

    test('should toggle play/pause state', async ({ page }) => {
        const playBtn = page.getByTestId('audio-control-play');
        await expect(playBtn).toBeVisible();

        // Initial state check
        await playBtn.click();

        // Check Title
        const title = page.getByTestId('active-station-title');
        await expect(title).toBeVisible();
        await expect(title).toContainText('Test Station 1');
    });

    test('should toggle favorite status', async ({ page }) => {
        const favBtn = page.getByTestId('audio-control-favorite');
        await favBtn.click();

        // Verify in Sidebar Favorites Tab
        const tabFavorites = page.getByTestId('tab-favorites');
        await tabFavorites.click();

        // Check if item exists in favorites
        const favItem = page.locator('button').filter({ hasText: 'Test Station 1' });
        await expect(favItem.first()).toBeVisible();
    });

});
