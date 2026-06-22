# Hey Anthony — welcome to your AI Agents & Vibe Coding camp! 🚀

This is your **development folder** on baerdisk3 (the home server). Alfred (Dad's
AI assistant) set it up for you and unpacked everything CodaKid sent. This note
is just from Alfred to you — it's **not** part of the official camp files, so you
can read it, ignore it, or come back to it whenever.

---

## 1. What is this camp, in one breath

**June 22–26, 2026 · Mon–Fri · 10:00 AM–12:00 PM Pacific · on Zoom.**

It's called **"AI Agents & Vibe Coding."** "Vibe coding" means you *describe what
you want in plain English* and an AI helps you build it — instead of typing every
line of code yourself. You're the director; the AI is your build crew. By the end
of the week you'll have built and **published a real arcade game and a "passion
project"** to the web (using GitHub Pages, so anyone can play them with a link).

The tool you'll code in is **Antigravity IDE** — Google's "agentic" coding app.
"Agentic" means it doesn't just autocomplete; you can hand it a goal and it works
through the steps like a teammate.

---

## 2. What's in this folder

```
AI-Agent-Lab/
├─ ALFRED_README.md  ← you're reading it
├─ AI_Agents_Before_Day_1_Parent_Setup_Guide.pdf  ← CodaKid's official setup guide
└─ Antigravity Starter Files/   ← THIS is the folder you open in Antigravity
   ├─ Agents/    ← the 4 AI "team members" and the rules they follow
   ├─ Skills/    ← reusable recipes the AI can grab so it doesn't reinvent stuff
   ├─ APIs/      ← where secret keys would go (keep them OUT of your code!)
   └─ Projects/  ← empty for now — each thing you build gets its own folder here
```

> ⚠️ On Day 1 the instructor will tell you to **open the `Antigravity Starter
> Files` folder** inside Antigravity. Don't rename that folder — the camp expects
> that exact name.

### The "Agents" — your AI build team
The camp gives your AI **four roles** to play. Think of it like a tiny game studio:

| Agent | Job (in plain English) |
|-------|------------------------|
| **DISPATCHER** | The producer. Reads what you want, breaks it into small tasks, sets up the project files. |
| **BUILDER** | The coder. Actually builds the thing, fixes bugs, keeps it running. |
| **QA** | The tester. Runs your game/app, takes screenshots, proves it really works. |
| **SECURITY** | The safety check. Makes sure no secret keys or passwords leak. |

The flow is: **DISPATCHER → BUILDER → QA → (SECURITY if needed) → done.** Each
project keeps four little notebooks: `README` (what it is), `TASKS` (the to-do
list), `STATUS` (what works / what's broken / what's next), and `CHANGELOG` (a
diary of changes). That habit — small steps, always keep it running, write down
what you did — is exactly how real engineers (and Dad) work.

---

## 3. Before Day 1 — the checklist (do this with Dad)

Alfred set up the *files*, but a few things have to be done **on your own laptop**
because they need a login or a subscription. Go through these with Dad **before
Monday 10 AM** (about 15–30 min):

1. **Google account** — use the one Dad picks. Use the *same* account for every step below.
2. **Google AI Pro** — Dad subscribes (Google's current plan/price), keep it on through Friday. This is what powers the AI in Antigravity.
3. **Install Antigravity IDE** → https://antigravity.google/product/antigravity-ide
   - **Your laptop is a Mac, so also install Xcode** from the App Store (it's ~7 GB and takes 10–20 min — start that download FIRST so it finishes while you do the rest).
   - Open Antigravity once to make sure it launches. You can skip the intro prompts; the instructor configures the workspace on Day 1.
4. **Sign in to Antigravity** with that same Google account, and make sure you have a **GitHub account** ready → https://github.com (that's where you'll publish your game).

Zoom link (same all week): https://us02web.zoom.us/j/88502454515 — Meeting ID **885 0245 4515**.
On Day 1 the instructor hands out the **Student Prompt & Brainstorm Guide**:
https://docs.google.com/document/d/19WFRIiH-j61Ggb0kzn_FgtkXBDTqL5Ay0P-VF7xZ99g/edit

---

## 4. How to actually get good at "vibe coding"

A few tricks that'll make the AI build *what you actually want*:

- **Be specific.** "Make a Minecraft-style block-breaker game where the paddle is
  a diamond pickaxe and the blocks are different ores" beats "make a game."
- **Go one small step at a time.** Get a plain version running first, then add
  one feature, test it, then the next. (That's the BUILDER's whole rulebook.)
- **Always test it.** After each change, actually run it. If it breaks, tell the
  AI exactly what you saw — that's what QA does.
- **Show, don't just tell.** Screenshots and "here's the error message" help the
  AI fix things fast.
- **Never paste secret keys into your code.** If a project ever needs one, it goes
  in `APIs/keys.env` (which stays private). That's the SECURITY rule.

---

## 5. Project ideas built around YOUR stuff 🎮🤖

You get to pick a "passion project" — so pick something *you* care about. Here are
ideas that connect the camp to the things you're already into. Start simple, then
pile on features:

**🟫 Minecraft**
- A **web mini-game** with a Minecraft vibe: mine blocks, collect ores, craft a
  tool. Classic "arcade game" material, easy to publish to GitHub Pages.
- A **crafting-recipe helper**: type an item, it shows what you need to craft it.
- A **mob/loot probability calculator** (great excuse to use a little math).

**🎮 Game dev (your Unity / Unreal interest)**
- Antigravity is for web/code projects, so this camp is the perfect on-ramp:
  build a small browser game first (HTML/JS), learn the *loop* — input → update →
  draw → test. Those same ideas carry straight into Unity (C#) and Unreal
  (Blueprints/C++) later. Ask the AI to explain the "game loop" while you build.
- A **game design doc generator**: describe a game, the AI fills out levels,
  enemies, and mechanics — useful for planning a future Unity/Unreal project.

**🤖 Your self-building humanoid (Tinkercad → 3D print → Arduino + motors)**
- A **build-tracker dashboard**: a web page listing each printed part, its status
  (designed / printing / printed / installed), and which motor/servo it uses.
- A **servo control panel / simulator**: sliders for each joint that show how the
  arm/leg would move — a safe way to plan motion before wiring real motors.
- A **parts & wiring catalog**: every Arduino pin, motor, and bracket in one page
  you can search. (Later you can even vibe-code the actual Arduino sketches —
  describe "move servo on pin 9 to 90°" and let the AI draft the code.)
- A **"robot diary" site** documenting your build with photos — publish it so
  family can follow along.

Pick ONE to start. The camp's job is to teach you the *method*; the robot, the
games, and the Unity stuff are where you'll keep using it long after Friday.

---

## 6. Where these files live / using them from your laptop

This folder lives on **baerdisk3** at `/home/anthony/dev/AI-Agent-Lab/` — it's
inside **your own home space**, so it's yours.

To work on it from your Mac you can either:
- **Copy it to your Mac** (e.g. drag it to your Desktop or Documents) and open the
  `Antigravity Starter Files` folder there in Antigravity — simplest, and what the
  camp expects. **Recommended.**
- Or connect to the server in Finder (**Go → Connect to Server… → `smb://baerdisk3`**,
  log in as `anthony`) and work on the files over the network.

If anything's confusing, just reply to Dad's email and Alfred can help.

Have fun this week — you're going to build some cool stuff. 🛠️

— Alfred (Dad's AI assistant)
