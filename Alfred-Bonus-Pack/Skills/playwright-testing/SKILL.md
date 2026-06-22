---
name: playwright-testing
description: "Automatically open a web game/app in a real browser, click through the main path, and capture screenshots at phone, laptop, and desktop sizes. Use to give the QA role real proof and to compare how the UI looks across screen sizes."
risk: low
source: alfred-bonus-pack
---

# Playwright Testing (auto-run + screenshot your game)

> Let the computer be your tester: it opens the game in a real browser, does the
> main actions, and saves screenshots — so QA can *prove* it works instead of
> just saying it does.

## When to Use It
- The QA role needs real proof (screenshots) that the happy path works.
- You want to see the game at phone (375), laptop (1366), and desktop (1920) widths.
- You changed the look (DESIGNER) and want a before/after to compare.

## Do not use it when
- The project isn't a web page yet (Playwright drives a browser).
- You only need to eyeball one thing once — just open it yourself.

## Steps / Pattern
1. **Install once** (in the project folder, in the terminal):
   ```bash
   npm init -y
   npm install -D playwright
   npx playwright install chromium
   ```
2. **Serve the game** so the browser can open it (static games need a tiny server):
   ```bash
   npx http-server -p 8080   # or: python3 -m http.server 8080
   ```
3. **Write a tiny test script** `qa.mjs` (see Example), then run it:
   ```bash
   node qa.mjs
   ```
4. Look at the screenshots it saved in `qa_screenshots/`. Put them where QA wants
   them: `Projects/<project>/qa_screenshots/`.

## Example
```js
// qa.mjs — open the game at 3 sizes and screenshot it
import { chromium } from "playwright";

const SIZES = [
  { name: "phone",   width: 375,  height: 812 },
  { name: "laptop",  width: 1366, height: 768 },
  { name: "desktop", width: 1920, height: 1080 },
];

const browser = await chromium.launch();
for (const s of SIZES) {
  const page = await browser.newPage({ viewport: { width: s.width, height: s.height } });
  await page.goto("http://localhost:8080");          // your served game
  await page.screenshot({ path: `qa_screenshots/01_home_${s.name}.png` });

  // --- do the main action (edit these to match YOUR game) ---
  await page.click("text=Play");                      // click the Play button
  await page.waitForTimeout(1000);                    // let it start
  await page.screenshot({ path: `qa_screenshots/02_playing_${s.name}.png` });

  await page.close();
}
await browser.close();
console.log("Done — check the qa_screenshots/ folder!");
```

## Notes & Gotchas
- **Find buttons by what they say:** `page.click("text=Play")` finds a button
  labeled "Play". You can also use `page.getByRole("button", { name: "Play" })`.
- **Phone first.** Look at the 375 px screenshots first — that's where the game
  will really be played. (Same habit Dad's screenshot tooling uses.)
- **It catches "blank screen" bugs** a human might miss — if a screenshot is
  empty, something broke on load.
- This is the *automated* partner to the QA role. QA still decides pass/fail; this
  just gives QA the evidence fast.
- Keep the test tiny. One happy path is enough for a camp project.
