import { test, expect } from "@playwright/test"

test("can create a new task", async ({ page }) => {
  await page.goto("http://localhost:3000/tasks")
  await page.click("[data-testid=create-task-button]")
  await page.fill("input[placeholder='Enter task title']", "Playwright Test Task")
  await page.fill("input[type='date']", new Date().toISOString().slice(0, 10))
  await page.click("button:text('Create Task')")
  await expect(page.locator("h3:has-text('Playwright Test Task')")).toBeVisible()
})