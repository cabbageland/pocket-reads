---
title: Slides with Claude + TypeScript / TSX (and Codex as a comparable path)
slug: slides-with-claude-typescript-and-codex
tool_url: https://claude.ai/
category: Presentation generation
platform: LLM workflow / code-driven slides
pricing: Depends on model/tool access
status: Keep
date_read: 2026-04-14
date_surfaced: 2026-04-14
surfaced_via: Tracy in #pocket-reads
summary: A practical code-first slide workflow where Claude or Codex generates React/TSX slide decks with inline styling, explicit palette objects, and browser-native navigation/UI rather than relying on heavyweight slide GUIs.
why_selected: Tracy explicitly called out a Claude-code slide trick and wanted the TS/TSX slide-template pattern remembered and preserved as a reusable tool card.
tags:
  - slides
  - presentation
  - typescript
  - tsx
  - react
  - claude
  - codex
  - workflow
  - rapid-prototyping
---

# Slides with Claude + TypeScript / TSX (and Codex as a comparable path)

## What it is

This is a **code-first slide workflow**: use an LLM to generate slides directly in **TypeScript / TSX / React-style JSX**, keep the output browser-native, and structure the deck so it can be iterated like normal code instead of dragged around in a GUI slide editor.

The durable trick is not just “ask Claude for slides.” The real pattern is:

- write slides as **React/TSX artifacts**
- use a **tight visual template**
- keep styling inline and explicit
- make the result easy to render as HTML and easy to revise in code

For Tracy’s preferred variant, the deck should follow a fairly specific artifact style:

- slides are shaped like `{ section, title, content: JSX }`
- use an explicit palette object like `C={ blue:{bg,border,text,accent}, ... }`
- use CSS vars for theming
- use `Box` / `Arrow` SVG helpers with **hardcoded fills**, not className-driven SVG styling
- include nav buttons, keyboard arrows, progress bar, and dot indicators
- match a `pitch-deck.tsx` pattern: **section header + progress + title + content + nav footer**
- keep tables, code blocks, and cards **inline styled**

That makes the deck much more reproducible than ad hoc prompting.

## What it is used for

This workflow is useful for:

- **fast first-draft decks** when the content matters more than fancy animation
- **research talks / startup decks / tool demos** that need quick iteration
- **agent-generated presentations** from notes, outlines, or docs
- **HTML-native slide publishing**
- **version-controlled decks** where Git diffs are useful
- **reusable visual systems** where one template can support many decks

It is especially good when:

- you want simple, clean slides rather than PowerPoint maximalism
- you expect the deck to evolve quickly
- you want the same source to be editable by humans and coding agents

## Additional notes

### Claude-specific observation

The original trick here came from using **Claude Code** to generate slides. Tracy’s observation is that Claude is particularly good at producing **clean TS/TSX slides** without too much ugliness or overengineering.

That tracks. Claude often does well on tasteful layout scaffolding, especially when the visual language is constrained up front.

### Does Codex support native React / TS too?

Yes — **absolutely in the practical sense**.

Codex does not need a special “slides mode” to do this. If the target is React / TS / TSX, Codex can generate and edit that natively as a coding workflow. So if the question is:

> can Codex do native React/TSX-based slide generation too?

The answer is **yes**.

More precisely:

- Codex can generate **React components**, **TSX**, **HTML/CSS**, and small app-style slide shells
- it can work from a rigid template and preserve structure well
- it is a good fit when the slide deck is really just a small React UI with pagination and presentation affordances

So the difference is mostly one of workflow feel, not capability ceiling.

### The most reusable part of the trick

The strongest reusable part is the **template discipline**.

If the prompt just says “make slides,” results get mushy.
If the prompt says:

- use React artifact format
- use explicit palette constants
- use fixed helper components
- keep all content inline styled
- structure each slide identically
- include nav/progress/footer affordances

then both Claude and Codex have a much better chance of producing something stable rather than chaotic.

### Why the explicit palette / hardcoded SVG rule matters

This is one of those tiny implementation details that saves a lot of ugliness.

When SVG colors rely on className inheritance or loose CSS coupling, generated decks often break visually or become annoying to theme. Hardcoding fills in helpers like `Box` and `Arrow` is more boring, but much more robust for generated artifact-style slides.

Likewise, a palette object like:

```ts
const C = {
  blue: { bg: '#EAF2FF', border: '#B7CCFF', text: '#123A8C', accent: '#2E6BFF' },
  green: { bg: '#EAF8EF', border: '#B7E0C2', text: '#1F6B3A', accent: '#2FA45A' },
}
```

is much easier for an agent to use consistently than an abstract design system hidden elsewhere.

### Good targets / neighboring tools

This workflow can feed or resemble:

- React artifact-style single-page decks
- custom HTML slide apps
- Reveal.js-style presentations
- Spectacle / custom React presentation shells
- TSX-to-static-export pipelines

Primary references:

- Claude: https://claude.ai/
- Codex: https://github.com/openai/codex
- TypeScript JSX docs: https://www.typescriptlang.org/docs/handbook/jsx.html
- React JSX docs: https://react.dev/learn/writing-markup-with-jsx
- HTML reference: https://developer.mozilla.org/en-US/docs/Web/HTML
- Reveal.js: https://revealjs.com/
- Spectacle: https://spectacle.js.org/
- Slidev: https://sli.dev/
- Marp: https://marp.app/

## Recommendation

Keep this as a **workflow card**, not a product card.

The durable lesson is:

- for “create slides with ts/tsx,” use a **React artifact slide template**
- Claude is good at generating this style
- Codex also supports native React / TSX generation and can use the same pattern
- the template constraints matter more than the model branding

If I were using this in practice, I would not start from a blank prompt every time. I would start from the same strict artifact skeleton and swap only the deck content.