import { test, expect } from 'playwright-test-coverage';

test('admin login, dashboard, add franchise', async ({ page }) =>
{
    const defaultAdmin = { name: 'diner', email: 'd@jwt.com', password: 'diner' };

    await page.route('*/**/api/auth', async (route) =>
    {
        const method = route.request().method();
        if (method === 'PUT')
        {
            const loginReq = { email: defaultAdmin.email, password: defaultAdmin.password };
            const loginRes = {
                user: { id: 1, name: defaultAdmin.name, email: defaultAdmin.email, roles: [{ role: 'diner' }] },
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

    // Test flow: login -> dashboard
    await page.goto('/');

    // Navigate to login page
    await page.getByRole('link', { name: 'Login' }).click();

    // Perform login
    await page.getByPlaceholder('Email address').fill(defaultAdmin.email);
    await page.getByPlaceholder('Password').fill(defaultAdmin.password);
    await page.getByRole('button', { name: 'Login' }).click();

    // go to dashboard
    await page.goto('diner-dashboard');

    
    // Logout
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.locator('#navbar-dark')).toContainText('Login');
});
