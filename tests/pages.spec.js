import { test, expect } from 'playwright-test-coverage';

test('not found page', async ({ page }) => {
  await page.goto('/not-found');

  expect(await page.title()).toBe('JWT Pizza');
  const errorMessage = page.locator('div.text-neutral-100');
  await expect(errorMessage).toContainText(
    'It looks like we have dropped a pizza on the floor. Please try another page.'
  );
});

test('about page', async ({ page }) => {
  await page.goto('/about');

  expect(await page.title()).toBe('JWT Pizza');
  expect(await page.getByText('The secret sauce'));

  const homeLink = page.getByRole('link', { name: 'home' });
  expect(await homeLink.textContent()).toBe('home');
  expect(await homeLink.getAttribute('href')).toBe('/');
});

test('home page', async ({ page }) => {
  await page.goto('/');

  expect(await page.title()).toBe('JWT Pizza');
  expect(await page.getByText('Welcome to JWT Pizza'));

  const aboutLink = page.getByRole('link', { name: 'about' });
  expect(await aboutLink.textContent()).toBe('About');
  expect(await aboutLink.getAttribute('href')).toBe('/about');
});

test('docs page', async ({ page }) => {
  await page.goto('/docs');

  expect(await page.title()).toBe('JWT Pizza');
  await expect(page.getByRole('main')).toContainText('JWT Pizza API');

  const homeLink = page.getByRole('link', { name: 'home' });
  expect(await homeLink.textContent()).toBe('home');
  expect(await homeLink.getAttribute('href')).toBe('/');
});

test('history page', async ({ page }) => {
  await page.goto('/history');

  expect(await page.title()).toBe('JWT Pizza');

  const homeLink = page.getByRole('link', { name: 'home' });
  expect(await homeLink.textContent()).toBe('home');
  expect(await homeLink.getAttribute('href')).toBe('/');
});

test('franchise base page', async ({ page }) => {
  await page.goto('/franchise-dashboard');

  expect(await page.title()).toBe('JWT Pizza');

  const homeLink = page.getByRole('link', { name: 'home' });
  expect(await homeLink.textContent()).toBe('home');
  expect(await homeLink.getAttribute('href')).toBe('/');
});

