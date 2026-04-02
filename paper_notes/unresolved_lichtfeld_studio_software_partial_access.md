# LichtFeld Studio

## Basic info

* Title: LichtFeld Studio
* Authors: LichtFeld Studio / MrNeRF project contributors
* Year: 2025
* Venue / source: Project website + GitHub software repository
* Link: https://lichtfeld.io/
* Date surfaced: 2026-04-01
* Why selected in one sentence: It looks like a potentially relevant 3D Gaussian Splatting tooling surface for training, editing, and automation, but the supplied link resolves to a software/project page rather than a paper.

## Access / resolution status

**Partial access / unresolved source type.**

This note is intentionally labeled unresolved because the supplied URL points to a project/software landing page, not to a paper, PDF, arXiv page, or OpenReview submission. I checked the project page and the public GitHub repository, and the repository currently cites the project as software (`@software{lichtfeld2025, ...}`) rather than pointing to a companion research paper. Under the pocket-reads workflow, that means this should not be treated as a canonical paper reading note yet.

Brave Search was unavailable in this environment because the Brave API key is missing, so discovery fell back to direct inspection of the project page and GitHub repo. Based on that inspection, I do not currently have evidence of a resolved underlying paper source for this project.

## Quick verdict

* Useful to keep on the radar, but not yet a proper pocket-reads paper note.

The project itself looks relevant as tooling infrastructure around 3D Gaussian Splatting, especially because it combines training, scene inspection/editing, export, Python plugins, and MCP-based automation in one native application. But this is still a software artifact note, not a paper note written from a real primary research source. Until a paper, technical report, or other substantive research document is identified, the right stance is: interesting project, unresolved paper provenance.

## One-paragraph overview

LichtFeld Studio is an open-source native workstation for 3D Gaussian Splatting workflows. The project pitches itself as an integrated toolchain rather than a single training script or viewer: train new scenes from COLMAP data, resume checkpoints, inspect reconstructions live, edit gaussian subsets in context, export multiple scene formats, extend the app with Python plugins, and automate parts of the workflow through MCP and embedded Python. The key appeal is not a new learning algorithm so much as consolidating fragmented 3DGS workflow surfaces into one desktop runtime with stronger editing and automation affordances.

## What appears genuinely interesting

### 1. Unified workflow surface
The strongest practical idea here is collapsing training, inspection, editing, and export into one application. Most 3DGS work still feels scattered across scripts, viewers, and one-off utilities. A single runtime for iterative scene work is useful even if it is not itself a research contribution.

### 2. Editing inside the live scene context
The brush/lasso/polygon/crop/alignment tooling matters because many Gaussian pipelines still treat reconstruction outputs as mostly fixed artifacts. A scene editor that treats gaussian cleanup and transformation as first-class operations could be valuable for production and dataset curation workflows.

### 3. Plugin and MCP surface
The automation angle is the most cabbageland-relevant part. A native graphics tool that exposes Python plugins and MCP endpoints is much more interesting than a sealed desktop app. Even if the core rendering/training ideas are inherited, the tool-surface design could make it useful as infrastructure.

### 4. Save / resume as productized workflow support
This is not glamorous, but it is real. Long-running 3DGS jobs and iterative scene cleanup benefit from explicit save/resume support rather than fragile ad hoc scripting.

## What is missing / why this is unresolved

### No resolved paper source
I did not find an arXiv/OpenReview/PDF paper link on the project page.

### Repo citation is for software, not a paper
The public repository includes a software citation entry rather than a paper citation.

### Mechanism claims are product-level, not paper-level
The site and README describe capabilities, architecture choices, and workflow value, but they do not give the level of methodological detail, evaluation framing, or ablation logic needed for a real paper note.

## Why this still might matter for cabbageland

Even without a paper, LichtFeld Studio may still matter as a signal about where 3DGS tooling is heading: away from narrow demo pipelines and toward integrated, editable, automatable workstations. The plugin + MCP angle is especially worth watching because it suggests a future where generative/reconstruction tools are not just models but extensible agent-facing environments.

## What to do next

1. Check whether the project maintainers have released a companion paper, technical report, workshop submission, or benchmark writeup elsewhere.
2. If a real paper exists, replace this unresolved note with a canonical paper note written from the actual source.
3. If no paper exists, treat this as tooling intelligence rather than as a research-note artifact.

## Final decision

Keep this as an **unresolved / partial-access note** for now.

Do **not** treat it as a finished pocket-reads paper note unless we later resolve an actual paper or technical-report source behind the project.
