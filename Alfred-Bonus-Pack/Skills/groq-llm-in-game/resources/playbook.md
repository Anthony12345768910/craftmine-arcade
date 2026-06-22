# Groq-in-game playbook (extra patterns)

More ways to use an AI brain in a browser game. All of these call the same
endpoint as `SKILL.md`; only the prompt and how you use the answer change.

## Pattern 1: An enemy that DECIDES its move (structured output)

Instead of free text, ask the AI to pick from a fixed set of choices and answer in
JSON. Then your game code can act on the choice. This keeps the AI's creativity but
makes the answer safe to use in code.

```js
async function enemyDecision(state, apiKey) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + apiKey },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" },   // ask for clean JSON
      messages: [
        { role: "system", content:
          "You control a goblin enemy. Choose ONE action: attack, flee, or hide. " +
          "Reply ONLY as JSON: {\"action\":\"...\",\"reason\":\"short\"}." },
        { role: "user", content: "Game state: " + JSON.stringify(state) },
      ],
      max_tokens: 50,
      temperature: 0.7,
    }),
  });
  const data = await res.json();
  const choice = JSON.parse(data.choices[0].message.content);

  // ALWAYS guard against a weird answer:
  const valid = ["attack", "flee", "hide"];
  if (!valid.includes(choice.action)) choice.action = "attack";  // safe default
  return choice;   // e.g. { action: "flee", reason: "player is too strong" }
}
```

**Gotcha:** even with `json_object`, never trust the answer blindly — check it's
one of your allowed values and have a safe default. That's the same "validate
everything from outside" rule the camp's SECURITY skill teaches.

## Pattern 2: A reusable game-AI helper

Wrap all your AI calls in one small helper so the rest of the game stays clean and
every call fails gracefully.

```js
// gameAI.js
export function makeGameAI(apiKey, model = "llama-3.1-8b-instant") {
  return async function ask(systemPrompt, userPrompt, opts = {}) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + apiKey },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          max_tokens: opts.maxTokens ?? 80,
          temperature: opts.temperature ?? 0.7,
        }),
      });
      if (!res.ok) throw new Error("Groq " + res.status);
      const data = await res.json();
      return data.choices[0].message.content.trim();
    } catch (err) {
      console.error("Game AI failed:", err);
      return opts.fallback ?? "(the AI is thinking too hard right now)";
    }
  };
}

// Usage:
// const ai = makeGameAI(GROQ_API_KEY);
// const line = await ai("You are a wise wizard.", "Greet the player.");
```

## Pattern 3: Loading the key from APIs/keys.env in a browser game

Browsers can't read `.env` files directly. Two simple ways during local dev:

- **Easiest for camp:** make a `config.local.js` that is git-ignored and sets the
  key, and load it before your game:
  ```html
  <script src="config.local.js"></script>   <!-- sets window.GROQ_API_KEY -->
  <script src="game.js"></script>
  ```
  ```js
  // config.local.js  (ADD THIS FILE TO .gitignore — never commit it)
  window.GROQ_API_KEY = "gsk_your_key_here";
  ```
- Then in code: `const apiKey = window.GROQ_API_KEY;`

Make sure `.gitignore` includes:
```
keys.env
config.local.js
.env
```

## Speed & quota tips
- `llama-3.1-8b-instant` answers in well under a second — good enough to feel
  "live" in a game.
- Don't call the AI every frame. Call it on an *event* (player talks, a turn
  starts), not 60 times a second.
- If you hit a rate limit (HTTP 429), slow down or show "thinking…" and retry once.
