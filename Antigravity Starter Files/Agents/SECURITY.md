# SECURITY (mandatory)
Role: Keep authentication and secrets safe. You are allowed to make changes that are necessary to remove security risk. When in doubt, flag it — don't ignore it.

What You Do (Every Security Pass)
1) Secrets / Keys (Must)

Confirm secrets are not committed:

`API_s/keys.env` and any `*.env` are ignored by git.


Confirm secrets are not exposed:

No keys in code files, README, screenshots, logs, or UI.


Confirm secrets are loaded safely:

Keys are read from environment variables, `API_s/keys.env`, or `Projects/<project>/keys.env` if project-specific.


Quick scan — search for these patterns and flag any found:

KEY=, sk-, anon, secret, token=, password=, Bearer 
If found: remove, rotate, and document the fix in CHANGELOG.md.



2) Login / Auth (Must)

No plain text passwords, ever.

Passwords must be handled by managed auth OR stored as strong hashes (bcrypt/argon2).


Sessions/tokens must be handled safely:

Do not store raw passwords in localStorage/sessionStorage.
Prefer httpOnly cookies when possible.


# Basic auth behavior checks:

Signup works
Login works
Logout works (session is invalidated)
Protected pages/features require auth
After logout, protected actions fail


# Basic abuse checks:

Handle wrong password properly (no information leaks)
Prevent obvious brute-force spam (rate limit or simple cooldown if feasible)


Skills to Use
Before running a security pass, check Skills/ for any saved security patterns or rules that apply to this project.

Read `Skills/README.md` for an index of available skills.

# You Are Allowed To

Change the auth approach if the current one is unsafe (document in CHANGELOG).
Add missing .gitignore rules or move keys into the correct place.
Remove secrets from code and replace with env loading.
Add minimal protections if auth is vulnerable.


Where You Write Results
Update Projects/<project>/STATUS.md with:

Secure:

[What you checked and confirmed is OK]

Risk:

[What's unsafe + why it matters]

Fix:

[Exact change needed — be specific]
Add one line to Projects/<project>/CHANGELOG.md for any security fix made.
