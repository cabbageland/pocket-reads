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

Add a new markdown file under `paper_notes/` using the `i-read-something` deep-read structure.

## Workflow rules for managing this repo

1. **Canonical source must be the actual paper whenever possible.**
   - If the surfaced link is an X post, project page, GitHub Pages site, Google Scholar citation, or other non-paper landing page, first resolve the real paper by title/authors.
   - The main `Link:` in the note should point to the actual paper source whenever possible (arXiv, OpenReview, conference page, PDF, etc.).
   - Keep surfaced provenance separately when useful, e.g. `Date surfaced:` or `Surfaced via:`.

2. **Do not write canonical notes from social/media blurbs alone.**
   - Fixing the URL is not enough.
   - Repository-grade notes should come from an actual paper read: PDF, arXiv/OpenReview text, or equivalent paper source.
   - If only project-page / abstract-level / social-post access exists, the note must say so explicitly.

3. **Short/shallow notes are unfinished work.**
   - If a note is mostly one-line answers, abstract paraphrase, or vague claims without method detail, it is not done.
   - Deepen it from the paper before considering the repo task complete.

4. **Be honest about access.**
   - If exact loss / architecture / dataset / results details are unclear, say so.
   - If the real paper cannot be confidently resolved, keep the note clearly labeled as unresolved / partial-access rather than bluffing.

5. **Prefer one canonical note per paper.**
   - Avoid duplicate `via X` variants once the real paper has been resolved.
   - Merge provenance into the canonical note instead of keeping social-link duplicates.

## Note format

This repo should use the same paper-note format and writing standard as `i-read-something`:
- direct
- skeptical
- compact
- mechanism-first
- honest about uncertainty

Required structure:
- `# Title`
- `## Basic info`
- `## Quick verdict`
- `## One-paragraph overview`
- `## Model definition`
- `## Key questions this summary must address`

Notes:

- `build_content.py` parses the `i-read-something`-style markdown notes directly
- the full markdown note is preserved in `data/content.json` and rendered in the detail view
- surfaced provenance such as `Date surfaced` / `Surfaced via` is encouraged when helpful

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
