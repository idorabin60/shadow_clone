import { test, expect } from "@playwright/test";

test("has generic RTL setup", async ({ page }) => {
    await page.goto("/");

    // Verify the HTML tag has dir="rtl" and lang="he"
    const htmlTag = page.locator("html");
    await expect(htmlTag).toHaveAttribute("dir", "rtl");
    await expect(htmlTag).toHaveAttribute("lang", "he");

    // Verify the Page Title
    await expect(page).toHaveTitle(/Hebrew Landing Page Builder/);

    // Verify the sidebar title
    const sidebarTitle = page.locator("aside.shell-sidebar h1");
    await expect(sidebarTitle).toContainText("בונה דפי נחיתה");
});
