# Agents — Workspace Rules & Roles
This folder holds the mandatory agent roles and the rules they follow across every project.
Keep this folder general. Project-specific work lives inside Projects/<project-name>/.
Reusable patterns and components live inside Skills/.

# Mandatory Roles (Do Not Delete)

DISPATCHER.md - Routes work, creates project docs, keeps the plan coherent

BUILDER.md - Implements features in small, testable steps

QA.md - Tests, reproduces bugs, writes clear verification checklists

SECURITY.md - Prevents key leaks, unsafe installs, and risky auth mistakes

# How the Agents Work Together
Every project follows this flow:
DISPATCHER -> BUILDER -> QA -> (SECURITY if needed) -> Done

DISPATCHER reads the request, sets up the project docs, and routes the first task.
BUILDER implements the task in small steps, keeping the project always runnable.
QA verifies the work actually works before anything is marked done.
SECURITY is included any time keys, auth, payments, or installs are touched.

If QA fails, the task goes back to BUILDER.
If SECURITY finds a risk, BUILDER fixes it before moving on.

# The Skills Folder
The Skills/ folder is where reusable patterns, components, and workflows are stored so your agent doesn't have to reinvent the wheel on every project.

Before starting any project, agents should check `Skills/README.md` for an index of what's available.
Over time, your Skills/ folder becomes your agent's personal playbook.

# For Every New Project (Must Do)
Create a folder: Projects/<project-name>/
Inside it, create these four files:

README.md Template
- Project name: [FILL]
- What it does (one sentence): [FILL]
- How to run it: [FILL]
- Main folders/files: [FILL]
- APIs used: [FILL]
- Skills used: [FILL — list any Skills/ files referenced]

TASKS.md Template
## Milestone 1: [FILL]
- [ ] Task A: [FILL]
- [ ] Task B: [FILL]

## Milestone 2: [FILL]
- [ ] Task A: [FILL]
- [ ] Task B: [FILL]

## Milestone 3: [FILL]
- [ ] Task A: [FILL]

STATUS.md Template
- Goal today: [FILL]
- Current milestone: [FILL]
- Working now: [FILL]
- Broken now: [FILL]
- Next action (one step only): [FILL]
- Last QA pass: [FILL — date + pass/fail]
- Last security pass: [FILL — date + pass/fail]

CHANGELOG.md Template
YYYY-MM-DD — [FILL: what changed, one line]
YYYY-MM-DD — [FILL: what changed, one line]

# Global Guidelines
Put a comment at least every 50-150 lines of code.
Build a working prototype early. Improve later.
Keep changes small and testable.
If something is ambiguous, make a reasonable decision and log it in CHANGELOG.md.
Never commit secrets. Optional keys belong in `API_s/keys.env` or a project-local `.env` that is git-ignored.
