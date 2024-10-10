import { test, expect } from 'playwright-test-coverage';

test('franchisee login, dashboard, add store', async ({ page }) =>
{
    const defaultUser = { name: 'pizza franchisee', email: 'f@jwt.com', password: 'franchisee' };

    await page.route('*/**/api/auth', async (route) =>
    {
        const method = route.request().method();
        if (method === 'PUT')
        {
            const loginReq = { email: defaultUser.email, password: defaultUser.password };
            const loginRes = {
                user: {
                    id: 2,
                    name: defaultUser.name,
                    email: defaultUser.email,
                    roles: [
                        {
                            role: "diner"
                        },
                        {
                            objectId: 1,
                            role: "franchisee"
                        }
                    ]},
                token: 'abcdef',
            };
            expect(route.request().postDataJSON()).toMatchObject(loginReq);
            await route.fulfill({ json: loginRes });
        } else if (method === 'DELETE')
        {
            const logoutRes = { message: 'logout successful' };
            await route.fulfill({ json: logoutRes });
        }
    });

    await page.route('*/**/api/franchise/2', async (route) =>
    {
        const method = route.request().method();
        if (method === 'GET')
        {
            const franchisesRes = [{
                "id": 1,
                "name": "pizzaPocket",
                "admins": [
                    {
                        "id": 1,
                        "name": "pizza franchisee",
                        "email": "f@jwt.com"
                    }
                ],
                "stores": [
                    {
                        "id": 1,
                        "name": "SLC",
                        "totalRevenue": 0
                    }
                ]
            },];
            await route.fulfill({ json: franchisesRes });
        }
    });

    await page.route('*/**/api/franchise/1/store', async (route) =>
    {
        const method = route.request().method();
        if (method === 'POST')
        {
            const createStoreReq = { name: 'test store' };
            expect(route.request().postDataJSON()).toMatchObject(createStoreReq);
            await route.fulfill({ json: { id: 2, franchiseId: 1, name: 'test store' } });
        } else if (method === 'DELETE')
        {
            const deleteStoreRes = { message: 'store deleted' };
            await route.fulfill({ json: deleteStoreRes });
        }
    });

    // Test flow: login -> dashboard -> add store -> logout
    await page.goto('/');

    // Navigate to login page
    await page.getByRole('link', { name: 'Login' }).click();

    // Perform login
    await page.getByPlaceholder('Email address').fill(defaultUser.email);
    await page.getByPlaceholder('Password').fill(defaultUser.password);
    await page.getByRole('button', { name: 'Login' }).click();

    // Go to franchise dashboard
    await page.getByRole('link', { name: 'Franchise' }).first().click();

    // Add store
    await expect(page.getByRole('button', { name: 'Create store' })).toBeVisible();
    await page.getByRole('button', { name: 'Create store' }).click();
    await page.getByPlaceholder('store name').fill('test store');
    await page.getByRole('button', { name: 'Create' }).click();

});
