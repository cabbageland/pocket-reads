# Pocket Reads

Pocket Reads is a plain static site for browsing paper notes as polished cards and full markdown detail views.

It borrows the visual feel and note-detail presentation style from `cabbageclaw-paper-daily-web`, but this repo is intentionally simpler:

- no daily digests
- no audio
- only paper notes
- content generated locally from markdown files in `paper_notes/`

## Repo structure

- `index.html` - static shell
- `styles.css` - site styling
- `app.js` - client-side rendering for overview, cards, and detail view
- `paper_notes/` - source markdown notes
- `build_content.py` - parses note metadata and markdown into `data/content.json`
- `data/content.json` - generated content snapshot committed with the site

## Add a note

Add a new markdown file under `paper_notes/`. The site expects simple front matter followed by normal markdown body content.

Example:

```md
---
title: Example Paper Title
authors: Jane Doe, John Smith
year: 2026
venue: arXiv
date_read: 2026-03-31
paper_url: https://arxiv.org/abs/1234.5678
pdf_url: https://arxiv.org/pdf/1234.5678.pdf
verdict: Must read
tags:
  - world models
  - robotics
why_selected: One sentence on why this paper made the list.
summary: One paragraph summary used on cards and in the overview.
why_it_matters: One paragraph on why it matters for Pocket Reads.
final_decision: A short final judgment.
---

# Example Paper Title

## Summary

Longer markdown content goes here.

## Why It Matters

Why it matters goes here.

## Final Decision

Final note goes here.
```

Notes:

- front matter is parsed without external dependencies, so keep it simple
- `tags` can be comma-separated on one line or written as `- item` lines
- the full markdown note is preserved in `data/content.json` and rendered in the detail view

## Rebuild content

Run:

```bash
python3 build_content.py
```

That regenerates `data/content.json` from `paper_notes/*.md`.

## Local preview

Any static file server works. For example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages

This repo is ready for basic GitHub Pages hosting from the repository root:

1. Push `main`
2. In GitHub settings, enable Pages
3. Choose `Deploy from branch`
4. Use branch `main` and folder `/ (root)`
