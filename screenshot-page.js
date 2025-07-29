import { chromium } from "playwright"
import process from "process" // To access command line arguments

async function captureScreenshot(url) {
  if (!url) {
    console.error("Usage: node screenshot-page.js <URL>")
    console.error("Example: node screenshot-page.js https://vercel.com")
    return
  }

  let browser
  try {
    console.log(`Launching browser...`)
    browser = await chromium.launch()
    const page = await browser.newPage()

    console.log(`Navigating to ${url}...`)
    await page.goto(url)
    console.log(`Page title: ${await page.title()}`)

    const screenshotPath = "example.png"
    await page.screenshot({ path: screenshotPath })
    console.log(`Screenshot saved to ${screenshotPath}`)
  } catch (error) {
    console.error(`Failed to capture screenshot for ${url}:`, error)
  } finally {
    if (browser) {
      await browser.close()
      console.log("Browser closed.")
    }
  }
}

// Get URL from command line arguments
const targetUrl = process.argv[2]
captureScreenshot(targetUrl)
