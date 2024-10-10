import { test, expect } from 'playwright-test-coverage';

test('admin login, dashboard, add franchise', async ({ page }) => {
    await page.route('*/**/api/auth', async (route) => {
        const loginReq = { email: 'admin@admin.com', password: 'admin' };
        const loginRes = { user: { id: 3, name: 'admin', email: 'admin@admin.com', roles: [{ role: 'admin' }] }, token: 'abcdef' };
        expect(route.request().method()).toBe('PUT');
        expect(route.request().postDataJSON()).toMatchObject(loginReq);
        await route.fulfill({ json: loginRes });
    });

    await page.route('*/api/auth', async (route) => {
        if (route.request().method() === 'DELETE') {
            const logoutRes = { message: 'logout successful' };
            await route.fulfill({ json: logoutRes });
        }
    });

    await page.goto('/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByPlaceholder('Email address').fill('admin@admin.com');
    await page.getByPlaceholder('Email address').press('Tab');
    await page.getByPlaceholder('Password').fill('admin');
    await page.getByRole('button', { name: 'Login' }).click();


    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('admin@test.com');
    await page.getByPlaceholder('Email address').press('Tab');
    await page.getByPlaceholder('Password').fill('test');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByPlaceholder('Password').dblclick();
    await page.getByPlaceholder('Password').fill('password');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByPlaceholder('Password').dblclick();
    await page.getByPlaceholder('Password').fill('pass');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByPlaceholder('Password').dblclick();
    await page.getByPlaceholder('Password').fill('admin');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByPlaceholder('Password').dblclick();
    await page.getByPlaceholder('Password').fill('test');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Logout
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.locator('#navbar-dark')).toContainText('Register');
    await expect(page.locator('#navbar-dark')).toContainText('Login');
});