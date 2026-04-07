---
title: Slides with Claude + TypeScript / TSX (and Codex as a comparable path)
slug: slides-with-claude-typescript-and-codex
tool_url: https://claude.ai/
category: Presentation generation
platform: LLM workflow / code-driven slides
pricing: Depends on model/tool access
status: Keep
date_read: 2026-04-06
date_surfaced: 2026-04-06
surfaced_via: Tracy in #pocket-reads
summary: A practical workflow for generating clean lightweight slides by having Claude write TypeScript or TSX, then rendering that into HTML slides.
why_selected: Tracy explicitly wants a Tools tab workflow for links and tool ideas, and surfaced this as a useful quick-slide workflow worth preserving.
tags:
  - slides
  - presentation
  - typescript
  - tsx
  - html
  - claude
  - codex
  - workflow
  - rapid-prototyping
---

# Slides with Claude + TypeScript / TSX (and Codex as a comparable path)

## What it is

This is less a single packaged app and more a practical **code-first slide-making workflow**: ask Claude to generate slides in **TypeScript or TSX**, keep the visual language simple and clean, then render the result into HTML slides or a browser-viewable presentation.

The key idea is that slides do not need a heavy GUI tool first. If the content structure is clear, an LLM can generate a compact slide deck as code quickly, and code-based slides are easy to revise, restyle, diff, version, and convert.

Tracy’s specific note here is that **Claude is good at producing simple, clean slides this way**, and that **TSX is also easy to convert to HTML**.

## What it is used for

Useful applications:

- **Fast first-draft slide decks** when the priority is clarity over fancy templates
- **Research talk drafts** where content changes often and editing in code is easier than dragging boxes around
- **Internal presentations** that need to be clean, lightweight, and easy to regenerate
- **Agent-assisted presentation workflows** where an LLM can update slides from notes, markdown, or structured outlines
- **HTML-native slide publishing** when the output should live on the web rather than inside PowerPoint/Keynote
- **Version-controlled slides** where Git-friendly source matters

This is especially good when:
- the deck is text/diagram-heavy rather than animation-heavy
- you want repeatable style
- you may want the same source to produce both slides and web output

## Additional notes

### Why this workflow is appealing

The main appeal is not novelty. It is leverage.

If the slides are written as TS / TSX:
- layout can be templated
- themes can be reused
- content can be regenerated from notes or documents
- HTML export becomes straightforward
- later automation is easier than with manual slide-editing tools

That makes it a good fit for Pocket Reads / cabbageland-style publishing pipelines, where content often starts as notes and later gets rendered into different surfaces.

### Claude-specific observation from Tracy

Tracy’s note is that Claude can generate these code-based slides in a way that comes out **very simple and clean**, which is the right aesthetic for many quick decks.

### Codex comparison

Tracy also asked whether **Codex has similar functionality**.

Practical answer: **yes, in the broad sense**. Codex can also generate TypeScript/TSX/HTML/CSS-based slide decks or slide components if prompted well. The difference is not that Codex has a magical “slides mode”; it is that it can act as a coding agent for the same code-first presentation workflow.

So the real reusable tool concept is:
- use an LLM to generate or edit **slide source code**
- keep output simple and web-native
- render to HTML or another web-facing format

Claude may currently feel especially good for quick tasteful drafts, but Codex can clearly participate in the same pipeline.

### Relevant documents and links

Useful primary references for this workflow family:

- Claude: https://claude.ai/
- Codex CLI / coding agent direction: https://github.com/openai/codex
- TypeScript: https://www.typescriptlang.org/docs/
- TSX docs (React-style TSX syntax reference lives through TypeScript + React ecosystems):
  - https://www.typescriptlang.org/docs/handbook/jsx.html
  - https://react.dev/learn/writing-markup-with-jsx
- HTML reference:
  - https://developer.mozilla.org/en-US/docs/Web/HTML

Common slide frameworks / rendering targets worth considering for this workflow:

- Slidev: https://sli.dev/
- Marp: https://marp.app/
- Reveal.js: https://revealjs.com/
- Spectacle: https://spectacle.js.org/

These are relevant because they provide realistic targets for “generate slides as code, then render cleanly in the browser.”

### Recommendation

Keep this as a **workflow card**, not as a claim about one special proprietary feature.

The durable lesson is:
- **LLM + TS/TSX + HTML slide rendering** is a useful fast-slide pipeline
- Claude seems especially good for quick clean drafts
- Codex can likely serve the same pattern when used as a coding agent
- code-based slides are attractive because they are easy to revise, render, and republish
