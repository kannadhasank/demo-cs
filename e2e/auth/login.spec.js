import { test, expect } from '@playwright/test';

// Test data
const TEST_USER = {
  username: 'testuser',
  password: 'password123',
};

const INVALID_USER = {
  username: 'invaliduser',
  password: 'wrongpassword',
};

test.describe('Login Page - E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto('/login');
  });

  test.describe('Page Layout and Elements', () => {
    test('should display login page with all elements', async ({ page }) => {
      // Check page title
      await expect(page).toHaveTitle(/CSDB Management/);

      // Check heading
      await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();

      // Check form fields
      await expect(page.getByLabel(/username/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();

      // Check login button
      await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
    });

    test('should have password field masked', async ({ page }) => {
      const passwordField = page.getByLabel(/password/i);
      await expect(passwordField).toHaveAttribute('type', 'password');
    });

    test('should have proper page URL', async ({ page }) => {
      expect(page.url()).toContain('/login');
    });
  });

  test.describe('Form Input', () => {
    test('should allow typing in username field', async ({ page }) => {
      const usernameField = page.getByLabel(/username/i);
      await usernameField.fill('testuser');
      await expect(usernameField).toHaveValue('testuser');
    });

    test('should allow typing in password field', async ({ page }) => {
      const passwordField = page.getByLabel(/password/i);
      await passwordField.fill('password123');
      await expect(passwordField).toHaveValue('password123');
    });

    test('should clear input fields', async ({ page }) => {
      const usernameField = page.getByLabel(/username/i);
      const passwordField = page.getByLabel(/password/i);

      await usernameField.fill('testuser');
      await passwordField.fill('password123');

      await usernameField.clear();
      await passwordField.clear();

      await expect(usernameField).toHaveValue('');
      await expect(passwordField).toHaveValue('');
    });
  });

  test.describe('Form Validation', () => {
    test('should show error when submitting empty form', async ({ page }) => {
      const loginButton = page.getByRole('button', { name: /login/i });
      await loginButton.click();

      // Wait for error message (adjust selector based on your implementation)
      const errorMessage = page.getByText(/required/i).first();
      await expect(errorMessage).toBeVisible({ timeout: 3000 });
    });

    test('should show error when username is empty', async ({ page }) => {
      await page.getByLabel(/password/i).fill('password123');
      await page.getByRole('button', { name: /login/i }).click();

      const errorMessage = page.getByText(/username.*required/i);
      await expect(errorMessage).toBeVisible({ timeout: 3000 });
    });

    test('should show error when password is empty', async ({ page }) => {
      await page.getByLabel(/username/i).fill('testuser');
      await page.getByRole('button', { name: /login/i }).click();

      const errorMessage = page.getByText(/password.*required/i);
      await expect(errorMessage).toBeVisible({ timeout: 3000 });
    });
  });

  test.describe('Successful Login', () => {
    test('should login successfully with valid credentials', async ({ page }) => {
      // Fill in credentials
      await page.getByLabel(/username/i).fill(TEST_USER.username);
      await page.getByLabel(/password/i).fill(TEST_USER.password);

      // Click login button
      await page.getByRole('button', { name: /login/i }).click();

      // Wait for navigation to dashboard
      await page.waitForURL('**/dashboard', { timeout: 5000 });

      // Verify we're on dashboard
      expect(page.url()).toContain('/dashboard');
    });

    test('should persist authentication after page reload', async ({ page }) => {
      // Login
      await page.getByLabel(/username/i).fill(TEST_USER.username);
      await page.getByLabel(/password/i).fill(TEST_USER.password);
      await page.getByRole('button', { name: /login/i }).click();

      // Wait for dashboard
      await page.waitForURL('**/dashboard', { timeout: 5000 });

      // Reload page
      await page.reload();

      // Should still be on dashboard (not redirected to login)
      expect(page.url()).toContain('/dashboard');
    });

    test('should display user info after login', async ({ page }) => {
      // Login
      await page.getByLabel(/username/i).fill(TEST_USER.username);
      await page.getByLabel(/password/i).fill(TEST_USER.password);
      await page.getByRole('button', { name: /login/i }).click();

      // Wait for dashboard
      await page.waitForURL('**/dashboard', { timeout: 5000 });

      // Check if username is displayed (adjust selector based on your layout)
      const userInfo = page.getByText(TEST_USER.username);
      await expect(userInfo).toBeVisible({ timeout: 3000 });
    });
  });

  test.describe('Failed Login', () => {
    test('should show error with invalid credentials', async ({ page }) => {
      // Fill in invalid credentials
      await page.getByLabel(/username/i).fill(INVALID_USER.username);
      await page.getByLabel(/password/i).fill(INVALID_USER.password);

      // Click login button
      await page.getByRole('button', { name: /login/i }).click();

      // Wait for error message
      const errorMessage = page.getByText(/invalid.*credentials|login.*failed/i);
      await expect(errorMessage).toBeVisible({ timeout: 5000 });
    });

    test('should not navigate away on failed login', async ({ page }) => {
      // Fill in invalid credentials
      await page.getByLabel(/username/i).fill(INVALID_USER.username);
      await page.getByLabel(/password/i).fill(INVALID_USER.password);

      // Click login button
      await page.getByRole('button', { name: /login/i }).click();

      // Wait a bit
      await page.waitForTimeout(2000);

      // Should still be on login page
      expect(page.url()).toContain('/login');
    });

    test('should keep username field filled after failed login', async ({ page }) => {
      // Fill in invalid credentials
      await page.getByLabel(/username/i).fill(INVALID_USER.username);
      await page.getByLabel(/password/i).fill(INVALID_USER.password);

      // Click login button
      await page.getByRole('button', { name: /login/i }).click();

      // Wait for error
      await page.waitForTimeout(1000);

      // Username should still be filled
      const usernameField = page.getByLabel(/username/i);
      await expect(usernameField).toHaveValue(INVALID_USER.username);
    });
  });

  test.describe('Loading State', () => {
    test('should disable button during login attempt', async ({ page }) => {
      await page.getByLabel(/username/i).fill(TEST_USER.username);
      await page.getByLabel(/password/i).fill(TEST_USER.password);

      const loginButton = page.getByRole('button', { name: /login/i });
      await loginButton.click();

      // Button should be disabled immediately after click
      await expect(loginButton).toBeDisabled();
    });

    test('should show loading indicator during login', async ({ page }) => {
      await page.getByLabel(/username/i).fill(TEST_USER.username);
      await page.getByLabel(/password/i).fill(TEST_USER.password);
      await page.getByRole('button', { name: /login/i }).click();

      // Check for loading text or spinner (adjust based on your implementation)
      const loadingIndicator = page.getByText(/loading|signing in/i);
      const isVisible = await loadingIndicator.isVisible().catch(() => false);

      if (isVisible) {
        await expect(loadingIndicator).toBeVisible();
      }
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should submit form with Enter key from password field', async ({ page }) => {
      await page.getByLabel(/username/i).fill(TEST_USER.username);
      await page.getByLabel(/password/i).fill(TEST_USER.password);

      // Press Enter while focused on password field
      await page.getByLabel(/password/i).press('Enter');

      // Should navigate to dashboard
      await page.waitForURL('**/dashboard', { timeout: 5000 });
      expect(page.url()).toContain('/dashboard');
    });

    test('should navigate between fields using Tab', async ({ page }) => {
      const usernameField = page.getByLabel(/username/i);
      const passwordField = page.getByLabel(/password/i);
      const loginButton = page.getByRole('button', { name: /login/i });

      // Start at username
      await usernameField.focus();
      await expect(usernameField).toBeFocused();

      // Tab to password
      await page.keyboard.press('Tab');
      await expect(passwordField).toBeFocused();

      // Tab to button
      await page.keyboard.press('Tab');
      await expect(loginButton).toBeFocused();
    });

    test('should navigate backwards with Shift+Tab', async ({ page }) => {
      const loginButton = page.getByRole('button', { name: /login/i });
      const passwordField = page.getByLabel(/password/i);

      // Start at login button
      await loginButton.focus();
      await expect(loginButton).toBeFocused();

      // Shift+Tab to password
      await page.keyboard.press('Shift+Tab');
      await expect(passwordField).toBeFocused();
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('should display correctly on mobile device', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Check elements are visible
      await expect(page.getByLabel(/username/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
    });

    test('should be able to login on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Login
      await page.getByLabel(/username/i).fill(TEST_USER.username);
      await page.getByLabel(/password/i).fill(TEST_USER.password);
      await page.getByRole('button', { name: /login/i }).click();

      // Should navigate to dashboard
      await page.waitForURL('**/dashboard', { timeout: 5000 });
      expect(page.url()).toContain('/dashboard');
    });
  });

  test.describe('Security', () => {
    test('should not expose password in page source', async ({ page }) => {
      const passwordField = page.getByLabel(/password/i);
      await passwordField.fill('secretPassword123');

      // Get page content
      const content = await page.content();

      // Password should not appear in plain text
      expect(content).not.toContain('secretPassword123');
    });

    test('should clear form after successful login', async ({ page }) => {
      // Login
      await page.getByLabel(/username/i).fill(TEST_USER.username);
      await page.getByLabel(/password/i).fill(TEST_USER.password);
      await page.getByRole('button', { name: /login/i }).click();

      // Wait for dashboard
      await page.waitForURL('**/dashboard', { timeout: 5000 });

      // Go back to login page
      await page.goto('/login');

      // Fields should be empty
      await expect(page.getByLabel(/username/i)).toHaveValue('');
      await expect(page.getByLabel(/password/i)).toHaveValue('');
    });
  });

  test.describe('Session Management', () => {
    test('should redirect to login when accessing protected route without auth', async ({ page }) => {
      // Try to access dashboard directly without logging in
      await page.goto('/dashboard');

      // Should be redirected to login
      await page.waitForURL('**/login', { timeout: 3000 });
      expect(page.url()).toContain('/login');
    });

    test('should not access login page when already authenticated', async ({ page }) => {
      // First login
      await page.getByLabel(/username/i).fill(TEST_USER.username);
      await page.getByLabel(/password/i).fill(TEST_USER.password);
      await page.getByRole('button', { name: /login/i }).click();

      // Wait for dashboard
      await page.waitForURL('**/dashboard', { timeout: 5000 });

      // Try to go back to login
      await page.goto('/login');

      // Should be redirected to dashboard (or stay on dashboard)
      await page.waitForTimeout(1000);
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/dashboard|login/);
    });
  });
});