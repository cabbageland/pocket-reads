---
title: VISTA: A Visual Harness for Reasoning in an Interactive World
slug: vista-visual-harness-reasoning-interactive-world
authors: Qiushi Han; Keya Hu; Linlu Qiu; Cathy Wu; Kaiming He
year: 2026
venue: Project-page manuscript / technical report
date_read: 2026-08-06
paper_url: https://vista-research.github.io/
verdict: Highly relevant
summary: VISTA is a minimalist agent harness for ARC-AGI-3-style interactive visual worlds. It gives a general-purpose multimodal model raw PNG observations, free-form language reasoning, explicit lossless visual memory, small text notes, and a simple act-observe loop. On the public ARC-AGI-3 set, the reported Claude Opus 5.0 run completes all 183 levels across 25 games with 100.00 RHAE and 7,542 actions versus 17,135 first-time-human reference actions; GPT-5.6 Sol completes all levels too, with 98.27 RHAE. The result is interesting less as a new learned model and more as a clean demonstration that interface design, memory access, and model-directed visual attention can unlock existing VLM capability without program synthesis. The caveat is large: this is a project-page manuscript, no separate PDF/arXiv paper was found, the games are public, and the authors explicitly note that private-set evaluation is the real generalization test.
why_it_matters: VISTA is a useful counterweight to program-synthesis-heavy ARC work. It says some interactive reasoning may not need a full executable world model if the model can retain exact observations, revisit them on demand, write revisable notes, and act through a tight feedback loop. That framing matters for agent design beyond ARC: memory and perception tools are not just implementation details, they shape which capabilities become visible.
final_decision: Keep, but label the access and evaluation caveats. This belongs in Pocket Reads because the mechanism is crisp and reusable, but do not treat the public-set score as proof of robust generalization.
tags: ARC-AGI-3, visual-agents, multimodal-agents, agent-harnesses, visual-memory, interactive-worlds, VLMs, reasoning, no-program-synthesis
---

# VISTA: A Visual Harness for Reasoning in an Interactive World

## Basic info

* Title: VISTA: A Visual Harness for Reasoning in an Interactive World
* Authors: Qiushi Han; Keya Hu; Linlu Qiu; Cathy Wu; Kaiming He
* Year: 2026
* Venue / source: Project-page manuscript / technical report, MIT
* Link: https://vista-research.github.io/
* Date read: 2026-08-06
* Date surfaced: 2026-08-06
* Surfaced via: Tracy in Slack DM
* Why selected in one sentence: It is a clean, mechanism-first example of an agent harness where raw visual input, lossless memory, notes, and free-form reasoning are enough to solve the public ARC-AGI-3 games without program synthesis.
* Access note: Project-page manuscript read. I made full-text resolution attempts through the project page, raw HTML link list, exact-title web search, title/authors search, arXiv search/API, OpenReview search, Crossref search, Semantic Scholar search, GitHub search, and direct PDF URL guesses. I found no separate arXiv/PDF/conference paper for VISTA itself, so this note is based on the project-page manuscript and its linked replays/resources.

## Quick verdict

* Highly relevant

VISTA is worth keeping because the mechanism is unusually legible: let the model see the actual pixels, preserve every observed frame, give it tools to re-inspect history, let it keep compact revisable notes, and let it act in a simple loop. The reported public ARC-AGI-3 result is dramatic, but the important part is not the leaderboard brag; it is the claim that a good perceptual/memory interface can replace a lot of elaborate program-synthesis machinery. The caveat is equally important: this is not yet a normal paper read from a PDF, and public ARC-AGI-3 cannot settle generalization.

## One-paragraph overview

VISTA is a visual agent harness for ARC-AGI-3, a suite of interactive games where the agent begins without rules or goals and must learn from action-observation feedback. Instead of translating the game into an explicit program world model, VISTA gives a general-purpose multimodal model high-dimensional observations as PNG images, lets it reason in unconstrained language, stores every visual frame in an explicit lossless memory, and gives it tools to inspect old frames or exact pixels when needed. The agent also maintains two lightweight notes: a durable `GUIDE.md` for game-level abstractions and a scratch `WORKING.md` for the current level. With Claude Opus 5.0, the page reports perfect public-set performance: all 183 levels across 25 games completed, 100.00 RHAE, 25 perfect game scores, and 56% fewer environment actions than first-time human players. GPT-5.6 Sol also completes all 183 levels, with 98.27 RHAE and 22 perfect game scores.

## Model definition

### Inputs

The agent receives the current visual state as a PNG image, public game status and level progress, and the currently available environment actions. In the main setup, the visual input is a 512 by 512 nearest-neighbor upscaling of the official 64 by 64 ARC-AGI-3 frame, with grid lines, but the model is not told that the world is a 64 by 64 grid. The agent can optionally retrieve previous visual evidence by calling `inspect` on earlier states, animation frames, or enlarged spatial regions, and can use `read_pixels` for exact color samples. It also has text notes and action history available across the run.

### Outputs

The operational output is a selected game action through `play`. Around that action, the model produces free-form reasoning, a short expectation for what it predicts the action will do, observations after the action, and updates to `GUIDE.md` or `WORKING.md` when useful. The harness also allows read-only output in the form of inspection requests or pixel reads, but ARC-AGI-3 scoring counts only environment actions.

### Training objective (loss)

VISTA itself is not a newly trained model in the project-page text. It is an agent interface and runtime harness around pretrained multimodal backends: Claude Opus 5.0 through Claude Code CLI and GPT-5.6 Sol through Codex CLI. No VISTA-specific supervised, RL, or imitation loss is described. The training objectives of the base proprietary models are not available from this source.

### Architecture / parameterization

The architecture is a tool-using multimodal agent loop, not a neural architecture contribution:

* environment emits visual frames and action availability;
* all returned frames are stored in explicit visual memory with turn/frame indices;
* `inspect` reintroduces old frames, animations, or regions as visual inputs;
* `read_pixels` exposes exact pixel samples for fine details;
* `GUIDE.md` stores compact durable rules and abstractions;
* `WORKING.md` stores local scratch reasoning;
* when context fills, the agent writes a continuation state and resumes in a fresh context with the same notes, visual memory, and action history.

The paper's central parameterization choice is negative: do not force an executable symbolic world model. Let language hold fuzzy, revisable hypotheses, and let exact visual memory remain externally retrievable.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?

VISTA asks whether a general-purpose multimodal model can understand and act in an unfamiliar interactive visual world directly from sensory observations. ARC-AGI-3 is a good stress case because the agent starts each game with no instructions, no known rules, and no stated goal. It has to infer object roles, transition rules, hidden state, and win conditions from feedback, then carry what it learns across later levels.

The broader problem is not just game solving. It is the agent-interface question: what kind of perceptual input, memory, and action loop lets a frontier VLM express useful long-horizon reasoning?

### 2. What is the method?

The method is a minimal visual harness:

* feed the model the current game state as an image, not a symbolic grid by default;
* let it reason in unconstrained natural language;
* preserve every visual frame returned by the environment;
* expose old frames, regions, and exact pixels through read-only tools;
* maintain compact revisable notes;
* require the model to predict the expected visual result before each `play`;
* run the same short prompt and interface across all public ARC-AGI-3 games.

The harness does not synthesize a Python world model. It relies on the model's ability to form, revise, and use informal hypotheses while retaining access to exact perceptual evidence.

### 3. What is the method motivation?

The motivation is that executable world models are powerful but expensive and brittle. A programmatic ARC agent has to name the board, encode object identities and coordinates, reconstruct transition rules, and keep that reconstruction consistent. VISTA argues that a lot of useful game understanding can live in natural language instead: fuzzy, compact, easy to revise, and good enough for action selection when backed by exact visual memory.

The deeper bet is that representation is part of cognition. If old observations are only compressed into the context window or a textual summary, details disappear. If old frames remain exactly retrievable, the model can choose where to spend attention later.

### 4. What data does it use?

This is not a training-data paper. The evaluation uses the 25 public ARC-AGI-3 games, containing 183 total levels. For each game, VISTA starts from the first observation and plays through the environment with the same interface. The page also reports small representation-transfer checks on S5I5 and CD82, where the same underlying worlds are presented as text grids, native 2D images, and 3D renderings.

### 5. How is it evaluated?

The main metric is ARC-AGI-3 Relative Human Action Efficiency (RHAE). Completed levels receive score based on action efficiency relative to first-time human players, with later levels weighted more heavily. Only environment actions count; internal reasoning and read-only visual inspection are free. The page reports full public-set results for two backends, plus level-by-level tables and replay links.

The evaluation also compares VISTA against community leaderboard systems, including program-based systems such as Schema, Tycho, Retrodict, and ewma_sv_v1.6, and against the official minimal interface baselines.

### 6. What are the main results?

The headline results are:

* Claude Opus 5.0 backend: all 183 levels across all 25 public games completed, mean game score 100.00, 25 perfect game scores, 7,542 environment actions versus 17,135 first-time-human reference actions.
* GPT-5.6 Sol backend: all 183 levels completed, 98.27 mean score, 22 perfect game scores.
* System comparison: VISTA with Opus 5.0 reaches 100.00 RHAE without program synthesis; VISTA with GPT-5.6 Sol reaches 98.27. Tycho also reaches 100.00 in the reported table but is program-based.
* Representation variation: on S5I5 and CD82 level 1, VISTA succeeds from text-grid, 2D image, and 3D rendering inputs, though these are independent trajectories rather than a controlled large-scale robustness benchmark.

These numbers are impressive, but they are public-set numbers. The page explicitly says the private set remains the real generalization test and notes that the model releases postdate the public environments.

### 7. What is actually novel?

The novelty is not a new model architecture or loss. It is the harness recipe:

* raw visual state as the primary observation;
* exact external visual memory instead of relying on KV cache or text summary;
* model-directed inspection as an attention mechanism over past frames, regions, and pixels;
* free-form natural language hypotheses rather than executable world reconstruction;
* compact revisable notes that persist across levels and context resets;
* the same interface applied broadly across ARC-AGI-3 public games.

That combination is strong because it makes memory and perception first-class tools rather than background plumbing.

### 8. What are the strengths?

The biggest strength is conceptual cleanliness. VISTA shows a small set of interface choices producing a large performance jump on a hard interactive benchmark.

Other strengths:

* It isolates a useful contrast with program-synthesis approaches.
* It preserves evidence losslessly rather than asking the model to remember everything in text.
* It makes inspection model-directed, which is more flexible than fixed retrieval.
* It uses readable notes, so the agent's working abstractions are at least partly inspectable.
* It reports complete public-game trajectories and replay links rather than only aggregate scores.
* It checks multiple observation representations, which supports the claim that the harness is not tied only to 2D grid images.

### 9. What are the weaknesses, limitations, or red flags?

The first limitation is access: I found no separate PDF/arXiv paper, so this is a project-page manuscript note.

The second limitation is evaluation leakage/generalization. The public ARC-AGI-3 games are public, and the page states that the models used were released after those public environments, so prior exposure cannot be ruled out. The private ARC-AGI-3 set is the meaningful test.

Third, RHAE does not charge internal reasoning or inspection. That is reasonable for the official scoring protocol, but it means the score is action-efficient rather than compute-efficient. A system can think and inspect a lot while still looking excellent on environment actions.

Fourth, one run per game is not enough to understand variance. The page reports a strong capability demonstration, not a stability study.

Finally, the harness includes nontrivial runtime engineering: visual archiving, tool transport, context recovery, and reset boundaries. The clean idea is simple, but reliable execution is not magic dust.

### 10. What challenges or open problems remain?

The main open problem is private-set generalization. Does the same harness solve new games that the base model almost certainly has not seen?

Other open questions:

* How much does each component contribute: raw pixels, visual memory, pixel reads, notes, expectation-before-action prompting, or context reset?
* How robust is the method across repeated runs?
* What is the true compute/token/latency cost compared with program-based systems?
* Can this extend from ARC-style games to embodied environments where physics, partial observability, and continuous action matter?
* How should benchmarks score internal inspection and memory usage, not just outward actions?

### 11. What future work naturally follows?

Natural follow-ups:

* run the exact harness on the ARC-AGI-3 private set;
* run ablations that remove visual memory, pixel reads, notes, or expectation prompting;
* report repeated-run variance and failure traces;
* compare against program-synthesis agents on total compute, not just action count;
* test richer 3D and embodied tasks where raw visual priors help but public-game memorization is less plausible;
* turn the replay traces into a dataset for studying when VLMs build correct versus wrong informal world models.

### 12. Why does this matter?

VISTA matters because it reframes agent capability as a function of interface design. It is easy to say "the model can or cannot solve the task." VISTA makes a sharper point: the same model may look much smarter when it receives natural perceptual input, keeps exact external memory, can direct its own attention backward, and stores compact revisable abstractions.

That idea travels. For practical agents, memory and perception tools are not accessories; they are part of the cognitive architecture.

## Why It Matters

The steal-worthy idea is that lossless perceptual memory can substitute for a lot of premature symbolic modeling. Program world models are powerful when the environment is cleanly formalizable, but many real agent settings are messier. VISTA suggests a different default: keep the evidence exact, keep the model's explanation revisable, and let the model choose when to re-open the perceptual record.

### 13. What ideas are steal-worthy?

* Treat visual memory as an external exact record, not just what happens to remain in context.
* Make "inspect old evidence" an explicit tool call controlled by the model.
* Ask the agent to state expected visual consequences before acting; this creates a lightweight self-check loop.
* Use durable and scratch notes separately: `GUIDE.md` for stable abstractions, `WORKING.md` for local hypotheses.
* Do not rush to program synthesis when fuzzy language plus exact evidence may be enough.
* Preserve full replay traces so result claims can be audited.
* Evaluate observation representation as part of the system, not as a cosmetic input choice.

### 14. Final decision

Keep, with caveats.

This is a high-signal agent-harness note, especially for visual memory and interactive reasoning. The result should not be overclaimed until private-set and ablation evidence exists, but the interface recipe is concrete enough to reuse immediately.
