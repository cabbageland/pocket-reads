# Tool notes

This directory stores Pocket Reads tool cards.

Use one markdown file per tool, similar in spirit to `paper_notes/`, but optimized for product/tool references instead of papers.

## Required goals

Each tool card should make it easy to answer:
- what the tool is
- what it is used for
- any additional notes, caveats, workflow context, or specific info Tracy supplied

## Suggested front matter

```yaml
---
title: Example Tool
slug: example-tool
tool_url: https://example.com
category: Research tool
platform: Web app
pricing: Free / Paid / OSS
status: Keep
date_read: 2026-04-06
date_surfaced: 2026-04-06
surfaced_via: Tracy in #pocket-reads
summary: One-sentence summary.
why_selected: Why this tool was added.
tags:
  - search
  - agents
  - workflow
---
```

## Required body structure

```md
# Example Tool

## What it is

Short explanation of the tool itself.

## What it is used for

Concrete use cases, not marketing mush.

## Additional notes

Anything Tracy said, caveats, comparisons, pricing notes, workflow implications, or why it matters.
```

## Workflow rule

When Tracy sends a tool link for Pocket Reads:
1. create/update the corresponding markdown note here
2. keep tags keyword-rich so search works well
3. rebuild `data/content.json` with `python3 build_content.py`
4. verify the new card appears in the Tools tab and is searchable
