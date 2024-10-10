import { test, expect } from 'playwright-test-coverage';

test('franchisee login, dashboard, add store', async ({ page }) => {
    const defaultUser = { name: 'pizza franchisee', email: 'f@jwt.com', password: 'franchisee' };

    await page.route('*/api/auth', async (route) => {
        const loginReq = { email: defaultUser.email, password: defaultUser.password };
        const loginRes = {
            user: { id: 2, name: defaultUser.name, email: defaultUser.email, roles: [{ role: 'diner' }] },
            token: 'token2',
        };
        expect(route.request().method()).toBe('PUT');
        expect(route.request().postDataJSON()).toMatchObject(loginReq);
        await route.fulfill({ json: loginRes });
    });

    await page.route('*/api/franchise/1/store', async (route) => {
        const createStoreReq = { franchiseId: 1, name: 'test store' };
        const createStoreRes = { id: 1, franchiseId: 1, name: 'test store' };
        expect(route.request().method()).toBe('POST');
        expect(route.request().postDataJSON()).toMatchObject(createStoreReq);
        await route.fulfill({ json: createStoreRes });
    });

    await page.route('*/api/franchise/1/store/1', async (route) => {
        if (route.request().method() === 'DELETE') {
            const deleteStoreRes = { message: 'store deleted' };
            await route.fulfill({ json: deleteStoreRes });
        }
    });

    await page.route('*/api/auth', async (route) => {
        if (route.request().method() === 'DELETE') {
            const logoutRes = { message: 'logout successful' };
            await route.fulfill({ json: logoutRes });
        }
    });

    // Test flow: login -> dashboard -> add store -> logout
    await page.goto('/');
    await page.getByRole('link', { name: 'Login' }).click();

    // Perform login
    await page.getByPlaceholder('Email address').fill(defaultUser.email);
    await page.getByPlaceholder('Password').fill(defaultUser.password);
    await page.getByRole('button', { name: 'Login' }).click();

    // Go to franchise dashboard
    await page.goto('/franchise-dashboard');

    // Add store
    await expect(page.getByRole('button', { name: 'Create store' })).toBeVisible();
    await page.getByRole('button', { name: 'Create store' }).click();
    await page.getByPlaceholder('store name').fill('test store');
    await page.getByRole('button', { name: 'Create' }).click();

    // Verify store addition
    await expect(page.locator('tbody')).toContainText('test store');

    // Delete Store
    await page.getByRole('button', { name: 'Close' }).click();
    await page.getByRole('button', { name: 'Close' }).click();
    await page.getByRole('link', { name: 'Admin' }).click();

    // Close Franchise
    await page.getByRole('button', { name: 'Close' }).click();
    await page.getByRole('button', { name: 'Close' }).click();

    // Logout
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.locator('#navbar-dark')).toContainText('Login');
});
