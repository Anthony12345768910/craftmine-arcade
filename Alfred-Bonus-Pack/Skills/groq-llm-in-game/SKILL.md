---
name: groq-llm-in-game
description: "Add a real AI brain to a browser game using Groq's fast, free LLM API — for talking NPCs, enemies that decide what to do, or a smart crafting/helper. Includes the SAFE way to handle the API key so it never leaks. Use when a game needs decisions, dialogue, or text that you can't hard-code."
risk: medium
source: alfred-bonus-pack
---

# Groq LLM in a Game (give your game a brain)

> Put a real AI inside your game — an NPC that talks back, an enemy that *decides*
> its next move, a Minecraft crafting helper that answers questions — using Groq's
> very fast, free LLM API. The key part: do it **without leaking your secret key**.

## When to Use It
- You want a character that talks like a person (not from a fixed list of lines).
- You want an enemy/NPC that *decides* what to do based on the situation.
- You want a helper that answers free-typed questions ("how do I craft a piston?").
- You want generated content: a random quest, a riddle, a level idea.

## Do not use it when
- A simple `if/else` or a random pick from a list would do the job. (Don't call an
  AI to flip a coin — it's slower and uses your quota.)
- The feature must work with no internet. (API calls need a connection.)

## Steps / Pattern
1. **Get a free key** (do this with Dad): go to <https://console.groq.com>, sign
   in, open **API Keys → Create API Key**, copy it. It starts with `gsk_...`.
   *Don't add a credit card* — the free tier is plenty for a game and means a leak
   can't cost money, only burn your rate limit.
2. **Put the key in the SAFE place** — `APIs/keys.env` (which is git-ignored), NOT
   in your code:
   ```
   GROQ_API_KEY=gsk_your_key_here
   ```
3. **Pick a model.** For a game you want *fast*:
   - `llama-3.1-8b-instant` — fast, great free limits. **Start here.**
   - `llama-3.3-70b-versatile` — smarter, lower free limits. Use if 8b feels dumb.
4. **Call it** (OpenAI-style endpoint — see Example).
5. **Handle failure** so the game never freezes (BACKEND's "never fail silently").

## Example — an NPC that decides what to say
```js
// Ask Groq what the NPC should say. Returns a string (or a fallback on error).
async function npcReply(playerMessage, apiKey) {
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content:
            "You are a gruff but kind blacksmith in a Minecraft-style game. " +
            "Reply in ONE short sentence. Stay in character." },
          { role: "user", content: playerMessage },
        ],
        max_tokens: 60,          // keep replies short = fast + cheap
        temperature: 0.8,        // a little personality
      }),
    });
    if (!res.ok) throw new Error("Groq error " + res.status);
    const data = await res.json();
    return data.choices[0].message.content.trim();
  } catch (err) {
    console.error(err);
    return "...the blacksmith is busy right now.";   // graceful fallback
  }
}
```

## ⚠️ The key-safety problem (read this — SECURITY cares about it)
GitHub Pages is a *static* host: anything in your published JavaScript can be read
by anyone who clicks "view source." **So a key pasted into front-end code that you
publish is exposed.** Here's how to handle it like a pro:

- **During camp / live demos:** run the game **locally** (on your laptop) with the
  key in `keys.env`. This is perfect for showing it off on the Zoom — full AI, key
  stays on your machine.
- **For the PUBLISHED version**, pick one:
  1. **Simplest:** publish the game with the AI feature turned *off* or replaced by
     a few pre-written lines, and keep the live-AI version for local demos.
  2. **Pro move (ask Dad — beyond the camp):** put the key behind a tiny "proxy"
     (a serverless function) so the browser calls *your* proxy and the proxy adds
     the key. The key never reaches the player's browser.
- **If the key ever leaks anyway:** no panic — go to the Groq console, **delete the
  key and create a new one** (that's called *rotating*). Because there's no card on
  the account, the worst case is someone uses up your free requests.

## Notes & Gotchas
- **Keep prompts tight.** A clear `system` message ("reply in one short sentence,
  stay in character") makes a small fast model feel smart.
- **Short replies = fast game.** Use `max_tokens` (e.g. 60). Long replies lag.
- **The AI can make stuff up.** For anything factual (real crafting recipes,
  scores, rules), don't trust the AI — use your own data. Use the AI for *flavor*
  and *decisions*, not as a source of truth. (The EDITOR role watches for this.)
- See `resources/playbook.md` for an "enemy that decides its move" example and a
  reusable game-helper wrapper.
