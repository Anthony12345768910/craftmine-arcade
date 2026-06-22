# Alfred's Bonus Pack 🎁 (optional extras for camp)

Hey Anthony — this folder is **not** part of the official CodaKid camp. Dad asked
Alfred to look at the camp's setup and add some extra "team members" (Agents) and
"recipes" (Skills) that go beyond the four the camp ships with. Think of it as a
bonus crate of power-ups. **Use what you want, ignore the rest.**

The official camp files still live next door in `Antigravity Starter Files/`.
Nothing in here changes those. On Day 1 your instructor sets up the official
folder — let them do that first, then come back here if you want more.

---

## How to use this pack

Everything in here is built to match the camp's exact format, so it drops right
in. When you want to use a bonus piece:

- **An Agent** (a new team member): copy the `.md` file from `Agents/` here into
  your `Antigravity Starter Files/Agents/` folder. Then tell the AI things like
  *"act as the DESIGNER and make this game look good on a phone."*
- **A Skill** (a reusable recipe): copy the whole skill folder from `Skills/`
  here into `Antigravity Starter Files/Skills/`, and add one line to that folder's
  `Skills/README.md` index so the AI knows it exists.
- **A key** (like Groq): follow `Skills/groq-llm-in-game/SKILL.md` — it tells you
  exactly where the key goes (and where it must NOT go).

You don't have to add everything. Honestly, for a 5-day camp, adding **DESIGNER**,
the **playwright-testing** skill, and the **publish-to-github-pages** skill will
give you the biggest win. The rest are there when a project grows.

---

## What's inside

**Read first:** `ASSESSMENT.md` — Dad asked Alfred whether the camp's approach is
good and what to add. That's the answer, in plain English.

### Agents/ (new team members)
| File | What this team member does |
|------|----------------------------|
| `DESIGNER.md` | Makes things look good **and work on a phone** (mobile-first). |
| `BACKEND.md` | Handles saving data, scores, and calling outside services/APIs. |
| `DOCS.md` | Writes clear "how to play" / "how it works" docs people actually read. |
| `EDITOR.md` | The **AI-slop editor** — cleans up robotic, generic AI writing. |
| `PROMOTER.md` | The launch crew — names it, makes a share card, helps people find it. |

### Skills/ (reusable recipes)
| Folder | What the recipe gives you |
|--------|---------------------------|
| `playwright-testing/` | Let the computer *auto-test and screenshot* your game. |
| `groq-llm-in-game/` | Put a real AI brain inside your game (talking NPCs, smart enemies). |
| `game-loop-basics/` | The heartbeat of every game: input → update → draw → repeat. |
| `publish-to-github-pages/` | Get your game on the internet with a link to share. |

### APIs/
| File | What it's for |
|------|---------------|
| `keys.example.additions.env` | The extra key lines (like `GROQ_API_KEY`) to copy into the camp's `APIs/keys.example.env`. |

---

Have fun — and remember the golden rule from the camp: **small steps, keep it
running, write down what you did.** Everything in this pack obeys that rule too.

— Alfred (Dad's AI assistant)
