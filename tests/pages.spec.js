import { test, expect } from 'playwright-test-coverage';

test('not found page', async ({ page }) =>
{
  await page.goto('/not-found');

  expect(await page.title()).toBe('JWT Pizza');
  const errorMessage = page.locator('div.text-neutral-100');
  await expect(errorMessage).toContainText(
    'It looks like we have dropped a pizza on the floor. Please try another page.'
  );
});

test('about page', async ({ page }) =>
{
  await page.goto('/about');

  expect(await page.title()).toBe('JWT Pizza');
  expect(await page.getByText('The secret sauce'));

  const homeLink = page.getByRole('link', { name: 'home' });
  expect(await homeLink.textContent()).toBe('home');
  expect(await homeLink.getAttribute('href')).toBe('/');
});

test('home page', async ({ page }) =>
{
  await page.goto('/');

  expect(await page.title()).toBe('JWT Pizza');
  expect(await page.getByText('Welcome to JWT Pizza'));

  const aboutLink = page.getByRole('link', { name: 'about' });
  expect(await aboutLink.textContent()).toBe('About');
  expect(await aboutLink.getAttribute('href')).toBe('/about');
});

test('docs page', async ({ page }) =>
{
  await page.route('*/**/api/docs', async (route) =>
  {
    const method = route.request().method();
    if (method === 'GET')
    {
      const docsRes = {
        "version": "20240518.154317",
        "endpoints": [
          {
            "method": "POST",
            "path": "/api/auth",
            "description": "Register a new user",
            "example": "curl -X POST localhost:3000/api/auth -d '{\"name\":\"pizza diner\", \"email\":\"d@jwt.com\", \"password\":\"diner\"}' -H 'Content-Type: application/json'",
            "response": {
              "user": {
                "id": 2,
                "name": "pizza diner",
                "email": "d@jwt.com",
                "roles": [
                  {
                    "role": "diner"
                  }
                ]
              },
              "token": "tttttt"
            }
          },
          {
            "method": "PUT",
            "path": "/api/auth",
            "description": "Login existing user",
            "example": "curl -X PUT localhost:3000/api/auth -d '{\"email\":\"a@jwt.com\", \"password\":\"admin\"}' -H 'Content-Type: application/json'",
            "response": {
              "user": {
                "id": 1,
                "name": "常用名字",
                "email": "a@jwt.com",
                "roles": [
                  {
                    "role": "admin"
                  }
                ]
              },
              "token": "tttttt"
            }
          },
          {
            "method": "PUT",
            "path": "/api/auth/:userId",
            "requiresAuth": true,
            "description": "Update user",
            "example": "curl -X PUT localhost:3000/api/auth/1 -d '{\"email\":\"a@jwt.com\", \"password\":\"admin\"}' -H 'Content-Type: application/json' -H 'Authorization: Bearer tttttt'",
            "response": {
              "id": 1,
              "name": "常用名字",
              "email": "a@jwt.com",
              "roles": [
                {
                  "role": "admin"
                }
              ]
            }
          },
          {
            "method": "DELETE",
            "path": "/api/auth",
            "requiresAuth": true,
            "description": "Logout a user",
            "example": "curl -X DELETE localhost:3000/api/auth -H 'Authorization: Bearer tttttt'",
            "response": {
              "message": "logout successful"
            }
          },
          {
            "method": "GET",
            "path": "/api/order/menu",
            "description": "Get the pizza menu",
            "example": "curl localhost:3000/api/order/menu",
            "response": [
              {
                "id": 1,
                "title": "Veggie",
                "image": "pizza1.png",
                "price": 0.0038,
                "description": "A garden of delight"
              }
            ]
          },
          {
            "method": "PUT",
            "path": "/api/order/menu",
            "requiresAuth": true,
            "description": "Add an item to the menu",
            "example": "curl -X PUT localhost:3000/api/order/menu -H 'Content-Type: application/json' -d '{ \"title\":\"Student\", \"description\": \"No topping, no sauce, just carbs\", \"image\":\"pizza9.png\", \"price\": 0.0001 }'  -H 'Authorization: Bearer tttttt'",
            "response": [
              {
                "id": 1,
                "title": "Student",
                "description": "No topping, no sauce, just carbs",
                "image": "pizza9.png",
                "price": 0.0001
              }
            ]
          },
          {
            "method": "GET",
            "path": "/api/order",
            "requiresAuth": true,
            "description": "Get the orders for the authenticated user",
            "example": "curl -X GET localhost:3000/api/order  -H 'Authorization: Bearer tttttt'",
            "response": {
              "dinerId": 4,
              "orders": [
                {
                  "id": 1,
                  "franchiseId": 1,
                  "storeId": 1,
                  "date": "2024-06-05T05:14:40.000Z",
                  "items": [
                    {
                      "id": 1,
                      "menuId": 1,
                      "description": "Veggie",
                      "price": 0.05
                    }
                  ]
                }
              ],
              "page": 1
            }
          },
          {
            "method": "POST",
            "path": "/api/order",
            "requiresAuth": true,
            "description": "Create a order for the authenticated user",
            "example": "curl -X POST localhost:3000/api/order -H 'Content-Type: application/json' -d '{\"franchiseId\": 1, \"storeId\":1, \"items\":[{ \"menuId\": 1, \"description\": \"Veggie\", \"price\": 0.05 }]}'  -H 'Authorization: Bearer tttttt'",
            "response": {
              "order": {
                "franchiseId": 1,
                "storeId": 1,
                "items": [
                  {
                    "menuId": 1,
                    "description": "Veggie",
                    "price": 0.05
                  }
                ],
                "id": 1
              },
              "jwt": "1111111111"
            }
          },
          {
            "method": "GET",
            "path": "/api/franchise",
            "description": "List all the franchises",
            "example": "curl localhost:3000/api/franchise",
            "response": [
              {
                "id": 1,
                "name": "pizzaPocket",
                "stores": [
                  {
                    "id": 1,
                    "name": "SLC"
                  }
                ]
              }
            ]
          },
          {
            "method": "GET",
            "path": "/api/franchise/:userId",
            "requiresAuth": true,
            "description": "List a user's franchises",
            "example": "curl localhost:3000/api/franchise/4  -H 'Authorization: Bearer tttttt'",
            "response": [
              {
                "id": 2,
                "name": "pizzaPocket",
                "admins": [
                  {
                    "id": 4,
                    "name": "pizza franchisee",
                    "email": "f@jwt.com"
                  }
                ],
                "stores": [
                  {
                    "id": 4,
                    "name": "SLC",
                    "totalRevenue": 0
                  }
                ]
              }
            ]
          },
          {
            "method": "POST",
            "path": "/api/franchise",
            "requiresAuth": true,
            "description": "Create a new franchise",
            "example": "curl -X POST localhost:3000/api/franchise -H 'Content-Type: application/json' -H 'Authorization: Bearer tttttt' -d '{\"name\": \"pizzaPocket\", \"admins\": [{\"email\": \"f@jwt.com\"}]}'",
            "response": {
              "name": "pizzaPocket",
              "admins": [
                {
                  "email": "f@jwt.com",
                  "id": 4,
                  "name": "pizza franchisee"
                }
              ],
              "id": 1
            }
          },
          {
            "method": "DELETE",
            "path": "/api/franchise/:franchiseId",
            "requiresAuth": true,
            "description": "Delete a franchises",
            "example": "curl -X DELETE localhost:3000/api/franchise/1 -H 'Authorization: Bearer tttttt'",
            "response": {
              "message": "franchise deleted"
            }
          },
          {
            "method": "POST",
            "path": "/api/franchise/:franchiseId/store",
            "requiresAuth": true,
            "description": "Create a new franchise store",
            "example": "curl -X POST localhost:3000/api/franchise/1/store -H 'Content-Type: application/json' -d '{\"franchiseId\": 1, \"name\":\"SLC\"}' -H 'Authorization: Bearer tttttt'",
            "response": {
              "id": 1,
              "franchiseId": 1,
              "name": "SLC"
            }
          },
          {
            "method": "DELETE",
            "path": "/api/franchise/:franchiseId/store/:storeId",
            "requiresAuth": true,
            "description": "Delete a store",
            "example": "curl -X DELETE localhost:3000/api/franchise/1/store/1  -H 'Authorization: Bearer tttttt'",
            "response": {
              "message": "store deleted"
            }
          }
        ],
        "config": {
          "factory": "https://pizza-factory.cs329.click",
          "db": "localhost"
        }
      };
      await route.fulfill({ json: docsRes });
    }
  });

  await page.goto('/docs');

  expect(await page.title()).toBe('JWT Pizza');
  await expect(page.getByRole('main')).toContainText('JWT Pizza API');

  const homeLink = page.getByRole('link', { name: 'home' });
  expect(await homeLink.textContent()).toBe('home');
  expect(await homeLink.getAttribute('href')).toBe('/');
});

test('history page', async ({ page }) =>
{
  await page.goto('/history');

  expect(await page.title()).toBe('JWT Pizza');

  const homeLink = page.getByRole('link', { name: 'home' });
  expect(await homeLink.textContent()).toBe('home');
  expect(await homeLink.getAttribute('href')).toBe('/');
});

test('franchise base page', async ({ page }) =>
{
  await page.goto('/franchise-dashboard');

  expect(await page.title()).toBe('JWT Pizza');

  const homeLink = page.getByRole('link', { name: 'home' });
  expect(await homeLink.textContent()).toBe('home');
  expect(await homeLink.getAttribute('href')).toBe('/');
});

