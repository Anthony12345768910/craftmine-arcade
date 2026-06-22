---
name: publish-to-github-pages
description: "Put a finished browser game/app on the internet with a free, shareable link using GitHub Pages. Covers the steps, the gotchas (file names, paths), and the must-check-before-you-share list. Use on the last day when a project is ready to publish."
risk: low
source: alfred-bonus-pack
---

# Publish to GitHub Pages (get a shareable link)

> Turn your finished game into a real website with a link anyone can open — for
> free — using GitHub Pages. This is the camp's Friday deliverable.

## When to Use It
- A project works (QA passed) and you want a link to share.
- You want your "passion project" live on the web.

## Do not use it when
- It doesn't work yet. Publish *working* things (ask QA first).
- It has a secret key in the front-end code. Take the key out first (ask SECURITY,
  and see the `groq-llm-in-game` skill).

## Steps / Pattern
1. **Name your main file `index.html`.** GitHub Pages opens `index.html` by
   default. If your game's main page has another name, rename it.
2. **Make a GitHub repo** (or use the one the camp set up) and put your project
   files in it (push them up). The instructor will show this in camp.
3. **Turn on Pages:** in the repo, go to **Settings → Pages → Build and
   deployment → Source: "Deploy from a branch"**, pick the `main` branch and the
   `/ (root)` folder, **Save**.
4. **Wait ~1 minute,** then GitHub shows your link, like:
   `https://YOURNAME.github.io/your-repo/`
5. **Open the link in a fresh browser** (or your phone) to confirm it really works
   for other people, not just on your computer.

## Before-you-share checklist (must all pass)
- [ ] QA passed — works on a phone and a computer.
- [ ] No secret keys anywhere in the published code (SECURITY checked).
- [ ] "How to Play" is visible (DOCS wrote it).
- [ ] The link works in a browser where you're NOT logged in.
- [ ] Nothing private is on the page (check with Dad — see the PROMOTER role).

## Notes & Gotchas
- **Paths must be relative.** Use `src="game.js"` and `src="images/hero.png"`, NOT
  `src="/game.js"` (a leading `/` breaks on Pages because your site lives in a
  sub-folder). Same for CSS and images.
- **File names are case-sensitive online.** `Hero.png` ≠ `hero.png` on GitHub even
  though it might "work" on a Mac. Match the case exactly.
- **Updates take a minute.** After you push a change, give Pages ~1 minute and then
  refresh (hard-refresh: Cmd-Shift-R) to see it.
- **It's a static host** — no server, no database, no hidden keys. For saving data
  use the browser (`localStorage`, see the BACKEND role); for an AI brain see the
  key-safety section of the `groq-llm-in-game` skill.
- Once it's live, hand the link to the **PROMOTER** role to launch it.
