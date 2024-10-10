import { test, expect } from 'playwright-test-coverage';

test('admin login, dashboard, add franchise', async ({ page }) => {
    const defaultAdmin = { name: '常用名字', email: 'a@jwt.com', password: 'admin' };

    await page.route('*/**/api/auth', async (route) => {
        const method = route.request().method();
        if (method === 'PUT') {
            const loginReq = { email: defaultAdmin.email, password: defaultAdmin.password };
            const loginRes = {
                user: { id: 1, name: defaultAdmin.name, email: defaultAdmin.email, roles: [{ role: 'admin' }] },
                token: 'abcdef',
            };
            expect(route.request().postDataJSON()).toMatchObject(loginReq);
            await route.fulfill({ json: loginRes });
        } else if (method === 'DELETE') {
            const logoutRes = { message: 'logout successful' };
            await route.fulfill({ json: logoutRes });
        }
    });

    // Handle both GET and POST requests for franchises
    await page.route('*/**/api/franchise', async (route) => {
        const method = route.request().method();
        if (method === 'GET') {
            const franchisesRes = []; // Return an empty array or any existing franchises
            await route.fulfill({ json: franchisesRes });
        } else if (method === 'POST') {
            const createFranchiseReq = { name: 'pizzaPocket', admins: [{ email: 'f@jwt.com' }] };
            expect(route.request().postDataJSON()).toMatchObject(createFranchiseReq);
            await route.fulfill({
                json: {
                    name: 'pizzaPocket',
                    admins: [{ email: 'f@jwt.com', id: 4, name: 'pizza franchisee' }],
                    id: 1,
                },
            });
        }
    });

    await page.route('*/**/api/franchise/1/store', async (route) => {
        const createStoreReq = { franchiseId: 1, name: 'test store' };
        expect(route.request().method()).toBe('POST');
        expect(route.request().postDataJSON()).toMatchObject(createStoreReq);
        await route.fulfill({ json: { id: 1, franchiseId: 1, name: 'test store' } });
    });

    await page.route('*/**/api/franchise/1/store/1', async (route) => {
        if (route.request().method() === 'DELETE') {
            await route.fulfill({ json: { message: 'store deleted' } });
        }
    });

    // Test flow: login -> dashboard -> add franchise -> logout
    await page.goto('/');

    // Navigate to login page
    await page.getByRole('link', { name: 'Login' }).click();

    // Perform login
    await page.getByPlaceholder('Email address').fill(defaultAdmin.email);
    await page.getByPlaceholder('Password').fill(defaultAdmin.password);
    await page.getByRole('button', { name: 'Login' }).click();

    // Verify successful login
    await expect(page.locator('#navbar-dark')).toContainText('Admin');
    await page.getByRole('link', { name: 'Admin' }).click();

    // Add franchise
    await page.getByRole('button', { name: 'Add Franchise' }).click();
    await page.getByPlaceholder('franchise name').fill('pizzaPocket');
    await page.getByPlaceholder('franchisee admin email').fill('f@jwt.com');
    await page.getByRole('button', { name: 'Create' }).click();

    // Logout
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.locator('#navbar-dark')).toContainText('Login');
});
