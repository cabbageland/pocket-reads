# Pocket Reads

Pocket Reads is a plain static site for browsing compact knowledge cards and full markdown detail views.

It borrows the visual feel and note-detail presentation style from `cabbageclaw-paper-daily-web`, but this repo is intentionally simpler:

- no daily digests
- no audio
- static GitHub Pages-style site
- content generated locally from markdown files
- currently supports both **paper notes** and **tool cards**

## Repo structure

- `index.html` - static shell
- `styles.css` - site styling
- `app.js` - client-side rendering for overview, cards, detail view, tabs, and search
- `paper_notes/` - source markdown notes for papers
- `tool_notes/` - source markdown notes for tools/products
- `build_content.py` - parses markdown into `data/content.json`
- `data/content.json` - generated content snapshot committed with the site

## Content model

Pocket Reads now has two first-class collections:

### 1. Paper notes
For deep reads of papers, project writeups, or clearly labeled partial-access research notes.

### 2. Tool cards
For product / software / website links Tracy sends under the new `[tools]` workflow.
These should answer, at minimum:
- what the tool is
- what it is used for
- any additional notes or context from Tracy or the source material

Both collections are indexed into the same generated `content.json`, but they render in separate tabs in the UI and share the same keyword-search behavior.

## Add a paper note

Add a new markdown file under `paper_notes/` using the `i-read-something` deep-read structure.

## Add a tool card

Add a new markdown file under `tool_notes/`.
Use strong keyword-rich titles/tags so the built-in search can find tools by use case, domain, platform, or feature words.

Recommended structure:

```md
# Tool Name

## What it is

## What it is used for

## Additional notes
```

Recommended front matter fields:
- `title`
- `slug`
- `tool_url`
- `category`
- `platform`
- `pricing`
- `status`
- `date_read`
- `date_surfaced`
- `surfaced_via`
- `summary`
- `why_selected`
- `tags`

## Workflow rules for managing this repo

### Paper-note rules

1. **Canonical source must be the actual paper whenever possible.**
   - If the surfaced link is an X post, project page, GitHub Pages site, Google Scholar citation, or other non-paper landing page, first resolve the real paper by title/authors.
   - The main `Link:` in the note should point to the actual paper source whenever possible (arXiv, OpenReview, conference page, PDF, etc.).
   - Keep surfaced provenance separately when useful, e.g. `Date surfaced:` or `Surfaced via:`.

2. **Do not write canonical notes from social/media blurbs alone.**
   - Fixing the URL is not enough.
   - Repository-grade notes should come from an actual paper read: PDF, arXiv/OpenReview text, or equivalent paper source.
   - If only project-page / abstract-level / social-post access exists, the note must say so explicitly.

3. **Full text is the default, not a bonus.**
   - For every paper note you seriously consider preserving here, aggressively try to get the full text before relying on an abstract, project page, or social post.
   - Minimum requirement before falling back to abstract-only or partial-access inspection: make at least 10 distinct full-text acquisition attempts.
   - These attempts should span different access paths when possible, not the same failed click repeated 10 times.
   - Valid attempt categories include publisher landing page, direct PDF URL guess, DOI landing page, PubMed links, PMC / Europe PMC, arXiv / OpenReview / preprint versions, author manuscript search, lab page, Brave / Google Scholar PDF search, open-access lookup surfaces, institutional browser access, and mirrored accessible versions.
   - Abstract-only or landing-page-only inspection is allowed only when those 10 real attempts still fail in the current environment.
   - If fallback is necessary, say that 10 full-text attempts were made first, state the access limits explicitly, and lower confidence accordingly.

4. **Do not imply a deep read if you did not do one.**
   - "Inspected" should mean full text unless clearly qualified.
   - If the read was abstract-only, say "abstract-only inspection" explicitly.
   - If the read was partial full text, say which parts were actually inspected.
   - Never silently turn a failed full-text search into a normal-sounding canonical note.

5. **Prefer accessible full-text papers when choosing what to preserve.**
   - If two papers are similarly interesting, prefer the one with accessible full text.
   - Do not preserve a weak abstract-level note when a better full-text paper is available.

6. **Short/shallow notes are unfinished work.**
   - If a note is mostly one-line answers, abstract paraphrase, or vague claims without method detail, it is not done.
   - Deepen it from the paper before considering the repo task complete.

7. **Be honest about access.**
   - If exact loss / architecture / dataset / results details are unclear, say so.
   - If the real paper cannot be confidently resolved, keep the note clearly labeled as unresolved / partial-access rather than bluffing.

8. **Prefer one canonical note per paper.**
   - Avoid duplicate `via X` variants once the real paper has been resolved.
   - Merge provenance into the canonical note instead of keeping social-link duplicates.

### Tool-card rules

1. **Tool cards can be written directly from the supplied tool/product page.**
   - Unlike paper notes, the tool page itself is often the canonical source.
   - Preserve Tracy-supplied context if it matters.

2. **Keep them practical, not ad-like.**
   - Say what the tool actually does.
   - Say what it is useful for.
   - Add caveats, pricing, access constraints, or relevant workflow notes when available.

3. **Searchability matters.**
   - Use keyword-rich titles, summaries, and tags.
   - Include synonyms or domain words where they help future retrieval.

4. **Prefer one canonical card per tool.**
   - Update the existing card when the same tool is resurfaced.
   - Avoid duplicate cards for the same product unless there is a real reason.

## Rebuild content

Run:

```bash
python3 build_content.py
```

That regenerates `data/content.json` from both:
- `paper_notes/*.md`
- `tool_notes/*.md`

## Local preview

Any static file server works. For example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Basic verification checklist

After adding or updating notes:
1. run `python3 build_content.py`
2. load the local site
3. confirm the entry appears in the correct tab
4. confirm keyword search finds it using obvious query terms
5. confirm the detail page renders and the source link works

## GitHub Pages

This repo is ready for basic GitHub Pages hosting from the repository root:

1. Push `main`
2. In GitHub settings, enable Pages
3. Choose `Deploy from branch`
4. Use branch `main` and folder `/ (root)`
