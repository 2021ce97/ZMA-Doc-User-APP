import { test, expect } from '@playwright/test';

test.describe('Appointment Booking Flow', () => {
  test('should allow user to search, select a doctor, and book an appointment', async ({ page }) => {
    // 1. Navigate to the app
    await page.goto('/');

    // 2. Click the "Get Started" onboarding button if it exists
    const onboardingBtn = page.getByRole('button', { name: /شروع کنید|Get Started/i });
    if (await onboardingBtn.isVisible()) {
      await onboardingBtn.click();
    }

    // 3. Search for a doctor
    const searchInput = page.getByPlaceholder(/جستجو|Search/i);
    await expect(searchInput).toBeVisible();
    await searchInput.fill('دکتر احمد نوری'); // Dr. Ahmad Noori

    // 4. Select the doctor from results
    const doctorCard = page.locator('button').filter({ hasText: 'دکتر احمد نوری' }).first();
    await expect(doctorCard).toBeVisible();
    await doctorCard.click();

    // 5. Click "Book Appointment" in profile
    const bookBtn = page.getByRole('button', { name: /نوبت گرفتن|Book Appointment/i });
    await expect(bookBtn).toBeVisible();
    await bookBtn.click();

    // 6. Select a date (e.g. tomorrow)
    const tomorrowBtn = page.locator('.overflow-x-auto button').nth(1); // 2nd date
    await tomorrowBtn.click();

    // 7. Select a time slot
    const timeSlot = page.locator('.grid button').first();
    await timeSlot.click();

    // 8. Confirm booking
    const confirmBtn = page.getByRole('button', { name: /تایید نوبت|Confirm Appointment/i });
    await confirmBtn.click();

    // 9. Verify success modal/message
    const successTitle = page.getByText(/نوبت شما با موفقیت ثبت شد|Appointment confirmed/i);
    await expect(successTitle).toBeVisible();
  });

  test('should show offline banner when offline during booking search', async ({ page, context }) => {
    // Navigate home
    await page.goto('/');

    // Go offline
    await context.setOffline(true);

    // Verify offline indicator
    const offlineBanner = page.getByText(/شما آفلاین هستید|You are offline/i);
    await expect(offlineBanner).toBeVisible();

    // Re-enable
    await context.setOffline(false);
  });
});
