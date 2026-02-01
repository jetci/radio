import { test, expect } from '@playwright/test';

test.describe('J Radio - Smoke Tests', () => {

    test.beforeEach(async ({ page }) => {
        // Mock API to speed up loading and prevent fetching 30k stations
        await page.route('**/stations/search?**', async route => {
            const json = [{
                stationuuid: '123',
                name: 'Test Station',
                url: 'http://test.com',
                countrycode: 'TH',
                geo_lat: 13.75,
                geo_long: 100.50
            }];
            await route.fulfill({ json });
        });

        // Mock Geo IP to force specific logic path if needed (Optional)
        await page.route('https://ipapi.co/json/', async route => {
            await route.fulfill({ json: { country_code: 'TH', country_name: 'Thailand', latitude: 13.75, longitude: 100.50 } });
        });

        await page.goto('http://localhost:5173');
        // Wait for loader to disappear ensures app is ready
        await page.locator('text=Detecting Local Sector...').waitFor({ state: 'visible', timeout: 5000 }).catch(() => { });
        // Wait slightly longer for overlay transition
        await page.getByTestId('welcome-start-btn').waitFor({ state: 'visible', timeout: 15000 });
    });

    test('should load the application and show welcome overlay', async ({ page }) => {
        // 1. Verify Title
        await expect(page).toHaveTitle(/J Radio|TongThin/i);

        // 2. Check Welcome Overlay Elements
        const getStartedBtn = page.getByTestId('welcome-start-btn');
        await expect(getStartedBtn).toBeVisible();
        await expect(page.getByText('ฟังวิทยุจากทั่วทุกมุมโลก ฟรี !!')).toBeVisible();
    });

    test('should dismiss overlay and show main UI components', async ({ page }) => {
        const getStartedBtn = page.getByTestId('welcome-start-btn');

        // Action: Click Get Started
        await getStartedBtn.click();

        // Expect: Overlay Disappears
        await expect(getStartedBtn).not.toBeVisible();

        // Expect: Sidebar is visible (Wait for animation)
        const sidebarSearch = page.getByTestId('sidebar-search-input');
        await expect(sidebarSearch).toBeVisible({ timeout: 10000 });

        // Expect: Canvas (Globe) is present
        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible();
    });

});
