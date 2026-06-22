# Bonus Agents — extra team members (optional)

These are **extra** roles, on top of the camp's four mandatory ones
(DISPATCHER, BUILDER, QA, SECURITY). The camp's flow still runs the show:

```
DISPATCHER → BUILDER → QA → (SECURITY if needed) → done
```

These bonus roles plug into that flow when a project needs them:

| Bonus role | When DISPATCHER should call it |
|------------|-------------------------------|
| **DESIGNER** | Anytime there's a screen people look at — i.e. almost always. Runs alongside BUILDER. |
| **BACKEND** | When the project saves data (scores, progress) or calls an outside API. |
| **DOCS** | Before publishing — write the player-facing "how to play". |
| **EDITOR** | Whenever the AI wrote text that will ship (menus, descriptions, the project page). |
| **PROMOTER** | At the very end, after QA passes and it's published — to launch it. |

## How to add one to your real workspace
1. Copy the role's `.md` file into `Antigravity Starter Files/Agents/`.
2. Tell the AI to use it, e.g. *"Act as the DESIGNER agent and make the start
   screen look good on a phone."*

## Rule of thumb
Don't add all five at once. Start with **DESIGNER**. Add the others the moment a
project actually needs them — that's how a real toolbox grows (it's the same idea
as the Skills folder).
