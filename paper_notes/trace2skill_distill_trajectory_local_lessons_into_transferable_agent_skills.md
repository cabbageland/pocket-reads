---
title: Trace2Skill: Distill Trajectory-Local Lessons into Transferable Agent Skills
slug: trace2skill-distill-trajectory-local-lessons-into-transferable-agent-skills
authors: Jingwei Ni, Yihao Liu, Xinpeng Liu, Yutao Sun, Mengyu Zhou, Pengyu Cheng, Dexin Wang, Erchao Zhao, Xiaoxi Jiang, Guanjun Jiang
year: 2026
venue: arXiv preprint (cs.AI)
date_read: 2026-06-27
paper_url: https://arxiv.org/abs/2603.25158
pdf_url: https://arxiv.org/pdf/2603.25158
verdict: Keep. Directly relevant for agent skills, workflow memory, and experience-to-procedure distillation.
summary: Trace2Skill is a framework for turning many agent execution traces into one portable skill directory. A frozen ReAct-style agent runs tasks with an initial skill, producing success and failure trajectories; parallel analyst agents convert those trajectories into local skill patches; then a hierarchical merge step deduplicates, resolves conflicts, and writes a consolidated SKILL.md plus references. The important move is representational: experience is not stored as raw traces or retrieved as episodic memory at test time, but compressed into reusable standard operating procedures. The empirical story is broad enough to take seriously: spreadsheet skills transfer across Qwen model scales, Gemma/GPT-family users, WikiTableQuestions/HiTab, math reasoning, DocVQA, and document workflows. The caveat is that the strongest evidence is still benchmark/harness-specific, Qwen-heavy, and very dependent on clean verifiers and skill-writing prompts.
why_it_matters: This is one of the sharper answers to a real agent-memory question: when an agent learns from prior work, what artifact should the learning become? Trace2Skill says it should become a maintained skill, not a pile of memories. That is immediately relevant to any system trying to make agent experience accumulate without stuffing more and more trace text into context.
final_decision: Keep. Cite it for the claim that trajectory-local lessons can be distilled into portable skill artifacts, and for the warning that retrieval memories and sequential skill edits are not the only way to reuse agent experience.
tags: agents, skills, agent-skills, trace-distillation, self-improving-agents, agent-memory, workflow-memory, skill-evolution, standard-operating-procedures, ReAct, spreadsheets, DocVQA, math-reasoning, office-automation, Qwen
---

# Trace2Skill: Distill Trajectory-Local Lessons into Transferable Agent Skills

## Basic info

* Title: Trace2Skill: Distill Trajectory-Local Lessons into Transferable Agent Skills
* Authors: Jingwei Ni, Yihao Liu, Xinpeng Liu, Yutao Sun, Mengyu Zhou, Pengyu Cheng, Dexin Wang, Erchao Zhao, Xiaoxi Jiang, Guanjun Jiang
* Year: 2026
* Venue / source: arXiv preprint (cs.AI)
* Link: https://arxiv.org/abs/2603.25158
* PDF: https://arxiv.org/pdf/2603.25158
* DOI: https://doi.org/10.48550/arXiv.2603.25158
* Code: https://github.com/Qwen-Applications/Trace2Skill
* Date read: 2026-06-27
* Date surfaced: 2026-06-27
* Surfaced via: Tracy in #pocket-reads via arXiv link
* Version inspected: arXiv v5, last revised 2026-06-04; 25-page PDF
* Why selected in one sentence: It is a concrete method for turning messy agent traces into reusable skill files instead of leaving experience as raw logs, retrieval memories, or ad hoc prompt edits.

## Quick verdict

Keep. Directly relevant for agent skills, workflow memory, and experience-to-procedure distillation.

This is one of the better recent agent-skills papers because it is not just waving at "memory." It asks what form reusable agent experience should take. Trace2Skill's answer is practical: run an agent, inspect its failures and successes, propose small skill patches, then merge the recurring patterns into one ordinary skill directory that can be loaded later without test-time retrieval or parameter updates. The strongest part is the analysis showing why the artifact form matters: parallel consolidation beats order-dependent sequential edits, one consolidated skill beats ReasoningBank-style retrieval in their settings, and agentic error analysts produce better patches than a single log-reading LLM call. The caveat is that the whole story is still quite harness-shaped. Spreadsheets dominate the evidence, the experiments are Qwen/Alibaba-centered, clean local verifiers do a lot of work, and the paper's future-model naming makes some results feel like evidence from a particular simulated/forward-looking ecosystem rather than a universally stable law.

## One-paragraph overview

Trace2Skill is a framework for automatic skill deepening and skill creation. Given an initial skill directory, the system runs a frozen ReAct-style agent over an evolution set and records labeled success/failure trajectories. Failure trajectories go to an interactive error analyst that can inspect artifacts, compare outputs against ground truth, and validate candidate fixes; success trajectories go to a success analyst that extracts reusable behavior patterns. These analysts propose trajectory-local patches to the skill. A hierarchical merge operator then consolidates all patches into one coherent skill update, deduplicating repeated advice, resolving conflicts, and pushing rare details into references when appropriate. The resulting skill is just a portable skill directory: no model weights are changed, and no retrieval memory is needed at inference. The paper tests this on spreadsheet workflows, math reasoning, DocVQA, PDF extraction, PPTX editing, and DOCX editing, with a focus on whether the learned skill transfers across model scales, model families, and out-of-distribution tasks.

## What problem is it trying to solve?

Agent skills are useful, but good skills are hard to write and harder to keep current. A hand-authored skill can encode strong procedural guidance, but it may be tuned to one model's behavior and fail to transfer. A skill generated from model parametric knowledge can sound plausible while missing the operational traps that show up only during real tool use.

The usual "agent learns from experience" alternatives have their own problems:

- raw trajectories are too long and noisy,
- episodic memories can fragment reusable knowledge across many retrieved snippets,
- retrieval quality becomes a test-time dependency,
- sequential skill editing makes the final skill depend on update order,
- and one-off reflections often encode symptoms instead of procedures.

Trace2Skill tries to turn many local lessons into a stable artifact: a compact skill directory with reusable standard operating procedures.

## Core idea

The core idea is that agent experience should be compressed into maintained procedure, not merely remembered.

Each trajectory contains local evidence: a formula went stale, a table range was misread, a visual-document answer needed OCR cleanup, or a math solution benefited from checking code. One local lesson is brittle. Many local lessons, if they recur independently, are evidence of a general operating rule. Trace2Skill treats the merge step as inductive reasoning over traces: keep patterns that appear repeatedly, discard idiosyncratic patches, and encode the result as normal skill guidance.

That is a clean distinction from retrieval memory. Retrieval says "find a similar past case." Trace2Skill says "learn the reusable procedure once, then make it part of the skill."

## Method

The pipeline has three stages.

### 1. Trajectory generation

A fixed agent runs each evolution task using the initial skill. The trace includes the user query, reasoning/tool-use history, final output, and a correctness label. The paper evaluates two starting points:

- skill deepening: start from a human-written skill, such as Anthropic's xlsx skill,
- skill creation: start from a weak parametric skill draft, or from no skill in some domains.

The model is not fine-tuned. All improvement must come from the skill artifact.

### 2. Parallel patch proposal

The system splits traces into successes and failures.

Failure traces go to an error analyst. This analyst is agentic: it can inspect execution artifacts, compare the submitted output with ground truth, implement a minimal fix, and rerun validation before proposing a patch. That matters because log-only explanations are easy to hallucinate.

Success traces go to a success analyst. This analyst extracts behavior patterns that contributed to a correct solution.

Both analysts output concise skill patches rather than full rewritten skills.

### 3. Patch consolidation

The patch pool is merged hierarchically. The merge operator is asked to deduplicate overlapping edits, resolve conflicts, preserve unique insights, and prefer patterns that recur across independent patches. The final patch is applied with deterministic guardrails, producing an updated skill directory.

The paper's skill format is ordinary: a root SKILL.md plus optional references, scripts, or assets. That is part of the point. The learned artifact is readable and portable.

## Main spreadsheet experiments

The main evaluation uses SpreadsheetBench-Verified. The authors split 400 examples into 200 evolution tasks and 200 held-out test tasks, then also evaluate on full SpreadsheetBench with evolution examples removed plus OOD table-QA transfer to WikiTableQuestions and HiTab.

Baselines:

- No Skill
- Human-Written: Anthropic's official xlsx skill
- Parametric: a skill generated from model knowledge without traces
- Trace2Skill +Error, +Success, and +Combined

They use Qwen3.5-122B-A10B and Qwen3.5-35B-A3B as both skill authors and skill users.

The baseline table is already instructive. The human-written xlsx skill helps the 122B spreadsheet agent on SpreadsheetBench-Verified, moving from 27.67 to 48.33 Vrf, but it hurts the 35B agent, dropping from 19.00 to 9.67 Vrf. That is a useful warning: a good-looking skill is not automatically portable across model scales.

Trace2Skill improves both skill-deepening and skill-creation settings. A few results worth remembering:

- 122B-authored Deepening +Combined improves the 122B user over the human-written skill by +21.50 Vrf, +10.87 Soft, and +12.50 Hard on spreadsheet tasks.
- 122B-authored Deepening +Combined also improves the 35B user by +21.16 Vrf over the same human-written starting skill.
- 35B-authored Deepening +Combined reaches the best reported average summary score in the main table, showing that smaller-model traces can still produce useful skill artifacts.
- Skill Creation from a weak parametric seed can become competitive with human-written skills in favorable settings.
- The most eye-catching OOD result is that a 35B-authored +Error skill created from a parametric seed improves the 122B user on WikiTableQuestions by +57.65 percentage points.

The precise cells vary by author, user, and task. The robust lesson is not "one variant always wins." It is that trajectory-grounded skill evolution often helps across model scales and can transfer beyond the source benchmark.

## Math and DocVQA

The paper then tests whether the idea is spreadsheet-specific.

For math, the agent uses a command-line Python interpreter in a ReAct loop. Skills are created from scratch on 400 DAPO questions and evaluated on 100 held-out DAPO questions plus AIME 2026. The no-skill baselines are already high, but Trace2Skill still helps. The most stable setting is +Error: with 122B-authored skills, the 122B user gains +4.0 on held-out DAPO and +2.9 on AIME, while the 35B user gains +5.0 on held-out DAPO and +5.0 on AIME.

For DocVQA, the evolution set is tiny: 50 examples, excluded from a 5,299-example held-out evaluation. All evolved skills improve over No Skill. The largest same-model gains are substantial: 122B-authored +Combined gives +0.2534 ANLS and +22.25 accuracy points for the 122B user, and 35B-authored +Combined gives +0.2158 ANLS and +18.83 accuracy points for the 35B user.

That is important because DocVQA is not just another spreadsheet. It suggests the method can distill visual-document procedures too, at least in this harness.

## Design comparisons

The analysis section is the most useful part of the paper.

### Parallel consolidation beats sequential edits

The authors compare Trace2Skill's many-to-one merge against sequential skill editing on the same trace pool. On spreadsheet +Error, parallel consolidation produces stronger 122B results than both sequential variants and takes about 3 minutes, versus about 15 minutes for batch-4 sequential edits and about 60 minutes for one-trace-at-a-time edits. The same broad trend appears in math and DocVQA.

This is a systems result, not just a quality result. If a skill depends on hundreds of traces, update-order dependence is a real maintenance smell.

### One consolidated skill beats retrieval memory here

The paper instantiates a ReasoningBank-style memory baseline: store lessons from success and failure trajectories, retrieve the top memory at inference with Qwen3-Embedding-8B, and compare against +Combined using the same trace pool.

Trace2Skill wins in their reported settings:

- Spreadsheet same-model Deepening: 122B Vrf/Soft/Hard is 69.83/47.17/29.53 for Trace2Skill versus 56.00/40.10/21.30 for ReasoningBank.
- 35B spreadsheet user: 29.67/18.80/5.73 versus 20.50/17.30/4.97.
- Math: Trace2Skill +Error reaches 95.0/91.7 for 122B DAPO/AIME and 94.0/88.3 for 35B, beating the ReasoningBank variants.
- DocVQA: Trace2Skill +Combined reaches 0.8833 ANLS / 92.52 accuracy for 122B and 0.8740 / 92.00 for 35B, above ReasoningBank's 0.8668 / 90.90 and 0.8568 / 89.62.

This does not prove retrieval memory is bad. It proves a narrower and useful thing: in these procedural domains, compressing lessons into a skill can beat retrieving isolated memories.

### Agentic error analysis beats log-only patching

The error analyst's ability to inspect artifacts matters. In a qualitative audit of 33 shared error cases, the agentic analyst and single-call LLM agree strongly on only 12.1 percent of cases, while 54.5 percent show clear disagreement about root cause or patch. In parse-error cases, the log-only analyzer blames parse errors as the primary root cause 57 percent of the time, versus 14 percent for the agentic analyst.

This is exactly the kind of result agent systems need more of. Failure analysis from logs is cheap and tempting, but file/tool artifacts often tell a different story.

## What kinds of skills does it learn?

The learned patches are not just vague "be careful" reflections. In the spreadsheet run, recurring patches consolidate into recognizable standard operating procedures:

- formula recalculation and write-back verification, cited by 55.1 percent of patches,
- using openpyxl rather than pandas.to_excel when preserving formulas and workbook structure, 54.8 percent,
- explicit read-back verification after edits, 42.7 percent,
- structural-edit safety such as deleting rows in descending order, 16.4 percent,
- lower-frequency details like target-range validation, datatype preservation, and pre-edit workbook exploration.

Rare task-specific quirks are routed into references instead of bloating the main SKILL.md. That is a nice design choice: main skill for general procedure, references for edge cases.

## Broader document-agent transfer

The paper also reports transfer to other office-style domains using Anthropic's official PDF, PPTX, and DOCX skills as starting points:

- PDF extraction: VRDU Registration traces transfer to VAREX Flat, improving pass rate from 76.9 percent to 85.3 percent.
- PPTX editing: TSBench training traces transfer to a deck-disjoint TSBench OOD split, improving 72.5 percent to 88.8 percent.
- DOCX editing: generated document-operation traces transfer to OfficeBench DOCX, improving 79.7 percent to 87.5 percent.

These are compact but useful because they reinforce the paper's main thesis: document-workflow failures often recur as procedures, not just as examples.

## What is actually novel?

The novelty is not "agents use skills" and not "agents remember traces." The real contribution is the many-to-one distillation pattern:

- collect broad success/failure trajectories,
- extract trajectory-local skill patches,
- use agentic validation for failure diagnosis,
- hierarchically consolidate the patch pool,
- output one portable skill directory,
- avoid test-time retrieval and model weight updates.

That artifact-level focus is the interesting part. Trace2Skill treats a skill as a maintained software object, not just a prompt blob.

## Strengths

- The paper asks a real representation question: what should reusable experience become?
- The method outputs a readable artifact, which makes the learning easier to inspect than hidden parameter updates.
- The evaluation checks transfer across model scales, model families, and OOD tasks instead of only same-model self-improvement.
- The ablations are useful: sequential editing, retrieval memory, and log-only error analysis are all plausible alternatives.
- The SoP analysis makes the learned content concrete.
- The distinction between deepening a human-written skill and creating one from a weak draft matches real deployment scenarios.

## Weaknesses and caveats

The evidence is strongest for file/tool workflows with local verifiers. That is an important domain, but it is not all agent work.

The spreadsheet results dominate the paper. Math and DocVQA help, but the system still feels most proven where artifacts are inspectable and failures can be locally validated.

The setup uses a lot of machinery: ReAct harnesses, analyst prompts, merge prompts, deterministic patch guards, benchmark-specific evaluators, and substantial compute. The appendix reports roughly 20,000 GPU hours across experiments and exploration.

The main models and authorship are centered around Qwen/Alibaba. The cross-family results help, but I would still want more independent replication before treating the claims as model-agnostic.

The paper's use of model names like GPT-5.5-high and Gemma-4-31B-it makes parts of the result table feel tied to a fast-moving or forward-looking benchmark context. I would cite the pattern, not over-index on those exact model labels.

Patch selection remains unresolved. Applying all consolidated patches is the default, and greedy subset selection can plateau because patches both fix and break tasks. Bayesian optimization can improve some metrics, but it is expensive because each candidate subset must be materialized and validated.

Long-term skill maintenance is mostly out of scope. The paper shows one-shot evolution from a trace pool, not months of conflicting updates, stale references, and live deployment drift.

## Relation to other Pocket Reads notes

This is a strong companion to SkillX. SkillX builds a hierarchical skill knowledge base and retrieves skills at deployment time. Trace2Skill compresses trajectory evidence into one static skill directory. Both treat experience as reusable systems infrastructure, but Trace2Skill is more aggressive about avoiding retrieval.

It also pairs with Trajectory-Informed Memory Generation. That paper converts trajectories into typed strategy, recovery, and optimization tips, then retrieves them. Trace2Skill asks whether those tips should instead be consolidated into the standing skill itself.

It connects cleanly to the Anthropic agent-architecture guide. That guide says skills are a modular way to improve single agents before multiplying agents. Trace2Skill is basically a proposal for how those skills can be created and deepened from real execution evidence.

The graph-memory survey is useful background, but Trace2Skill is almost an anti-graph-memory paper in spirit: before building an elaborate memory substrate, ask whether the reusable part can just become procedure.

## What ideas are steal-worthy?

- Treat skills as maintained artifacts with versionable procedures, not prompt garnish.
- Analyze many traces in parallel before editing the skill.
- Separate failure-derived and success-derived lessons; they contain different information.
- Validate failure explanations against artifacts when possible.
- Merge based on recurrence across independent patches, not only rhetorical quality.
- Keep high-frequency procedures in SKILL.md and route rare quirks to references.
- Compare against retrieval memory explicitly; do not assume memory is the right reuse interface.
- Evaluate learned skills across model scales and OOD task families, because skill portability is the whole point.

## Final decision

Keep.

This is a useful paper for anyone building agent systems with real tools. The durable phrase is: experience should become procedure. Trace2Skill does not prove that every memory should be flattened into a skill, but it makes a strong case that for operational workflows, a consolidated skill file can be a better reuse target than a pile of retrieved memories or a sequence of brittle prompt edits.
