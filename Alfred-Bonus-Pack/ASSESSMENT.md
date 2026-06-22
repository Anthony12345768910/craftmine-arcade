# Assessment of the CodaKid "AI Agents & Vibe Coding" approach

*Written by Alfred for Patrick, June 19 2026. Plain English so Anthony can read it too.*

---

## 1. Short version

The camp's approach is **genuinely good** — better than most "intro to coding"
material I've seen, and notably aligned with how you (Dad) actually work. The core
idea is right: don't teach syntax first, teach the **method** — a small team of AI
roles, tiny always-runnable steps, and four living docs per project
(README / TASKS / STATUS / CHANGELOG). That habit is the transferable skill; the
arcade game is just the excuse to practice it.

So I did **not** rewrite or "fix" their setup. I left the official
`Antigravity Starter Files/` exactly as shipped and instead built a **bonus pack**
of extra roles and skills that snap into the same format, for when a project grows
past what the four starter agents cover.

## 2. What the camp gets right

- **Roles over syntax.** DISPATCHER → BUILDER → QA → SECURITY is a real
  separation-of-concerns model, the same shape as a multi-agent workflow. A kid
  internalizing "plan it, build it, *prove* it works, check it's safe" is learning
  the actual job.
- **Always-runnable, small steps.** This is the single most important engineering
  habit and they made it the BUILDER's whole rulebook.
- **Write it down.** STATUS.md ("what works / what's broken / next step") is
  exactly the discipline that keeps a project from collapsing under its own mess.
- **Security from day one.** A dedicated SECURITY role that scans for leaked keys
  and bans secrets-in-code is excellent to teach at 12, not 22.
- **Skills as a growing playbook.** "Save anything reusable so you don't reinvent
  it" is how a real toolbox gets built.

## 3. Where it's thin (and what the bonus pack adds)

The four starter agents cover *plan / build / test / secure*. They're silent on
five things every published project eventually needs. Here's each item you asked
about, my verdict, and what I built:

| You asked about | Verdict | What I added |
|---|---|---|
| **Frontend UI expert** + **Mobile-first UI developer** | **Add — top priority.** A game that looks rough or doesn't work on a phone won't get played by friends. These two overlap so much for a browser game that I merged them into one strong role rather than two thin ones. | `Agents/DESIGNER.md` — visual polish **and** a hard "must work on a phone / touch screen" rule, using the same 375 / 1366 / 1920 px breakpoints I use in my own screenshot tooling. |
| **Backend / server expert** | **Add, but honestly scoped.** GitHub Pages is *static* — there's no server. So "backend" for this camp really means: save data in the browser, or call an outside API safely. I wrote it that way instead of pretending there's a server. | `Agents/BACKEND.md` — localStorage for scores/saves, calling external APIs, and when you'd actually need a real server later. |
| **Documentation specialist** | **Add.** The passion project gets *published* — a clear "how to play" is the difference between people trying it and bouncing. | `Agents/DOCS.md` — writes the player-facing docs, not just the engineer notes. |
| **AI-slop editor for content** | **Add — and I like this one a lot.** When you vibe-code, the AI writes your text too, and it defaults to generic, padded, em-dash-heavy filler. Teaching a kid to *spot and cut* that is a real 2026 literacy. | `Agents/EDITOR.md` — a checklist for killing AI slop (filler, fake enthusiasm, repetition, hallucinated "facts," robotic tone). |
| **Marketing / go-to-market expert** | **Add, kid-scoped.** "GTM" for an 12-year-old = name it well, write a one-line pitch, make a share image, post it where friends will see it. | `Agents/PROMOTER.md` — naming, the one-liner, a share card, and a safe "launch checklist." |
| **Playwright testing** | **Add as a Skill, not an agent.** It supercharges the QA role that already exists. | `Skills/playwright-testing/` — let the computer click through and screenshot the game automatically. |
| **Groq API key for in-game LLM decisions** | **Add as a Skill + scaffolding. Great idea.** A real LLM brain in a browser game (talking NPC, an enemy that "decides", a smart crafting helper) is exactly the kind of wow-moment that hooks a kid — and Groq's free tier is fast and generous. **I did not create an account or invent a key** (that's a sign-up you/Anthony do — see below). | `Skills/groq-llm-in-game/` + a `GROQ_API_KEY=` line for the keys file, with the *secure* pattern baked in. |

I also added two skills the camp implies but doesn't spell out, because they're the
literal deliverables of the week:

- `Skills/game-loop-basics/` — the input→update→draw heartbeat behind every arcade
  game (and the on-ramp to Unity/Unreal later).
- `Skills/publish-to-github-pages/` — the "get it on the internet with a link"
  recipe, since publishing is the whole point of Friday.

## 4. Best practices I carried over from your own projects

These are folded into the bonus files so Anthony absorbs them without a lecture:

1. **Mobile-first, real breakpoints.** My screenshot tooling checks 375 px (phone)
   first, then 1366 (laptop), then 1920 (desktop). DESIGNER uses those exact sizes
   and tests the phone view *first*, because that's where the game will actually be
   shown off.
2. **Never fail silently.** Your pipelines email you the moment something breaks
   instead of dying quietly. The kid version: *show the player a clear message when
   something goes wrong — never a blank screen or a frozen game.* It's in QA and
   BUILDER guidance.
3. **Secrets never touch code or git.** Same rule you live by with `.env` files.
   The Groq skill drills this: key goes in `APIs/keys.env` (git-ignored), the
   browser never ships it raw, and if it ever leaks you rotate it.
4. **Prove it, don't claim it.** Your "verify before done" habit → the Playwright
   skill makes QA *run and screenshot* the happy path, not just say "looks fine."
5. **Honesty in generated content.** You label AI-written email as AI-written. The
   EDITOR role is the same instinct pointed at game/site copy: cut the fake fluff,
   keep it true and plain.
6. **Small, reversible steps with a paper trail.** README/TASKS/STATUS/CHANGELOG
   is your deployment discipline shrunk to kid scale — already the camp's core, so
   I just reinforced it everywhere.

## 5. The one thing left for you/Anthony

To actually run the Groq-in-game skill, someone needs a **free Groq API key** from
<https://console.groq.com> (sign in, "API Keys" → "Create"). I deliberately did
**not** create an account or generate a key — that's a sign-up under your/Anthony's
identity, and it's a 2-minute job to do together during camp. Everything else is
ready. Once you have the key, the skill says exactly where to paste it (and where
never to).

— Alfred
