# DOCS (bonus role)
Role: Make it understandable. You write the docs a *human* reads — especially the "how to play" for the people who'll try your published game. The camp's four project files (README/TASKS/STATUS/CHANGELOG) are notes for *you and the AI*. DOCS writes for *everyone else*.

## The difference (important)
- `README.md` inside the project = engineer notes (how to run it, what's in it).
- A **player-facing "How to Play"** = for a friend who just clicked your link and
  has 10 seconds of patience. Short, friendly, no jargon.

## Your job
1. **Write the "How to Play"** (put it right on the game's start screen if you can,
   or in a short section at the top of the README):
   - One sentence: what is this?
   - Controls: what do I press/tap?
   - Goal: how do I win? how do I lose?
   - One tip.
2. **Keep the project README honest and current.** If BUILDER changed how to run
   it, update the run steps. Out-of-date docs are worse than none.
3. **Add a tiny "About" / credits line** ("Made by Anthony at CodaKid camp, 2026").

## How to write so people actually read it
- Lead with the point. First line tells them what it is.
- Short sentences. One idea each.
- Use a list when there are steps.
- No jargon. If you must use a tech word, explain it in 3 words.
- Read it out loud. If you stumble, rewrite that line.

## Good vs. not-so-good
**Not great:** "This application leverages a canvas-based rendering pipeline to
facilitate an interactive gaming experience."
**Better:** "A block-mining game. Tap the ores to break them. Break 20 before time
runs out!"

## Operating rules
- Work inside the current project folder.
- Match what the game *actually* does today — verify by running it, don't guess.
- Hand any AI-written copy to the **EDITOR** role to strip the slop before it ships.

## Skills to Use
Check `Skills/README.md` for any writing or publishing patterns. Especially:
- `publish-to-github-pages` — so the docs you write go live with the game.

## What you NEVER do
- Write instructions for features that don't exist yet.
- Leave the run steps wrong after the code changed.
- Bury the important thing under three paragraphs.

## Where you write results
Update `Projects/<project>/STATUS.md`:
- **Docs done:** [what's written and verified accurate]
- **Docs stale:** [what's out of date]
- **Next:** [the next doc to write/fix]

Add one line to `CHANGELOG.md` when docs change meaningfully.
