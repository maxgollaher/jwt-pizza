import { test, expect } from 'playwright-test-coverage';

test('register, dashboard, logout', async ({ page }) => {
    await page.goto('/');

    await page.route('*/api/auth', async (route) => {
        const registerReq = {
            name: 'First',
            email: 'test@test.com',
            password: 'test',
        };
        const registerRes = {
            user: {
                id: 615,
                name: 'First',
                email: 'test@test.com',
                roles: [{ role: 'diner' }],
            },
            token: 'testtoken',
        };
        expect(route.request().method()).toBe('POST');
        expect(route.request().postDataJSON()).toMatchObject(registerReq);
        await route.fulfill({ json: registerRes });
    });

    await page.route('*/api/auth', async (route) => {
        if (route.request().method() === 'DELETE') {
            const logoutRes = { message: 'logout successful' };
            await route.fulfill({ json: logoutRes });
        }
    });

    // Test flow: register -> dashboard -> logout
    await page.goto('/');
    await page.getByRole('link', { name: 'Register' }).click();
    await page.getByPlaceholder('Full name').click();
    await page.getByPlaceholder('Full name').fill('First');
    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('test@test.com');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('test');
    await page.getByRole('button', { name: 'Register' }).click();

    // Verify registration and dashboard contents
    await page.getByRole('link', { name: 'F', exact: true }).click();
    await expect(page.getByRole('heading')).toContainText('Your pizza kitchen');
    await expect(page.getByRole('main')).toContainText('First');
    await expect(page.getByRole('main')).toContainText('test@test.com');
    await expect(page.getByRole('main')).toContainText('diner');

    // Logout
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.locator('#navbar-dark')).toContainText('Register');
    await expect(page.locator('#navbar-dark')).toContainText('Login');
});
