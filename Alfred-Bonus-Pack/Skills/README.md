# Bonus Skills — extra recipes (optional)

These are extra reusable recipes, on top of the camp's `auth-implementation-patterns`
skill. Same format, same idea: read them before building so the AI doesn't reinvent
the wheel.

## How to add one to your real workspace
1. Copy the whole skill folder into `Antigravity Starter Files/Skills/`.
2. Add one line for it to that folder's own `Skills/README.md` index, so the AI
   knows it exists.

## What's here

- `playwright-testing/` — Let the computer automatically open your game, click
  through it, and take screenshots at phone/laptop/desktop sizes. Supercharges QA.
- `groq-llm-in-game/` — Put a real AI brain inside your game (a talking NPC, an
  enemy that decides what to do, a smart crafting helper) using Groq's fast, free
  API — with the *safe* key-handling pattern built in.
- `game-loop-basics/` — The heartbeat of every game: input → update → draw →
  repeat. The foundation for your arcade game (and for Unity/Unreal later).
- `publish-to-github-pages/` — Get your finished game on the internet with a link
  you can share. This is the camp's Friday deliverable.

## Skill File Template (same as the camp's)
```markdown
# Skill Name

> One sentence describing what this skill does.

## When to Use It
- ...

## Steps / Pattern
1. ...

## Example
...

## Notes & Gotchas
- ...
```
