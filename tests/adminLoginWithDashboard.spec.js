import { test, expect } from 'playwright-test-coverage';

test('admin login, dashboard, add franchise', async ({ page }) => {
    const defaultAdmin = { name: '常用名字', email: 'a@jwt.com', password: 'admin' };

    await page.route('*/api/auth', async (route) => {
        const loginReq = { email: defaultAdmin.email, password: defaultAdmin.password };
        const loginRes = {
            user: { id: 1, name: defaultAdmin.name, email: defaultAdmin.email, roles: [{ role: 'admin' }] },
            token: 'abcdef',
        };
        expect(route.request().method()).toBe('PUT');
        expect(route.request().postDataJSON()).toMatchObject(loginReq);
        await route.fulfill({ json: loginRes });
    });

    await page.route('*/api/franchise', async (route) => {
        const createFranchiseReq = { name: 'pizzaPocket', admins: [{ email: 'f@jwt.com' }] };
        const createFranchiseRes = {
            name: 'pizzaPocket',
            admins: [{ email: 'f@jwt.com', id: 4, name: 'pizza franchisee' }],
            id: 1,
        };
        expect(route.request().method()).toBe('POST');
        expect(route.request().postDataJSON()).toMatchObject(createFranchiseReq);
        await route.fulfill({ json: createFranchiseRes });
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

    // Test flow: login -> dashboard -> add franchise -> logout
    await page.goto('/');
    await page.getByRole('link', { name: 'Login' }).click();

    // Perform login
    await page.getByPlaceholder('Email address').fill(defaultAdmin.email);
    await page.getByPlaceholder('Password').fill(defaultAdmin.password);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.locator('#navbar-dark')).toContainText('Admin');
    await page.getByRole('link', { name: 'Admin' }).click();

    // Add franchise
    await page.getByRole('button', { name: 'Add Franchise' }).click();
    await page.getByPlaceholder('franchise name').fill('pizzaPocket');
    await page.getByPlaceholder('franchisee admin email').fill('a@jwt.com');
    await page.getByRole('button', { name: 'Create' }).click();

    // Verify franchise addition
    await expect(page.locator('tbody')).toContainText('pizzaPocket');
    await expect(page.locator('tbody')).toContainText('常用名字');

    // Create Store
    await expect(page.getByRole('link', { name: 'Franchise' })).toBeVisible();
    await page.getByRole('link', { name: 'Franchise' }).click();
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
