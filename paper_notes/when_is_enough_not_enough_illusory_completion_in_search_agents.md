---
title: When Is Enough Not Enough? Illusory Completion in Search Agents
slug: when-is-enough-not-enough-illusory-completion-in-search-agents
authors: Dayoon Ko, Jihyuk Kim, Sohyeon Kim, Haeju Park, Dahyun Lee, Gunhee Kim, Moontae Lee, Kyungjae Lee
year: 2026
venue: arXiv preprint (cs.AI, cs.CL)
date_read: 2026-06-30
paper_url: https://arxiv.org/abs/2602.07549
pdf_url: https://arxiv.org/pdf/2602.07549
verdict: Strong diagnostic paper, useful intervention
summary: This paper studies a failure mode in search agents called illusory completion: the agent treats a multi-constraint query as solved even when some answer constraints are unsupported or refuted. The authors introduce Epistemic Ledger, an evaluation framework that tracks both objective evidential support and the agent's own belief for every candidate-constraint pair across a search trajectory. On 215 multi-constraint QA instances, many agents show high underverified answer rates even when final-answer accuracy looks decent. LiveLedger, an inference-time constraint-state tracker, improves accuracy and reduces underverified answers by making unresolved constraints explicit during execution.
why_it_matters: This is directly useful for agent systems because it attacks the gap between "found an answer" and "proved the answer satisfies every requirement." That gap is where deep-research agents, coding agents, and tool agents quietly lie to themselves. The ledger framing is a clean pattern: maintain per-candidate, per-constraint evidence state, expose it during execution, and block premature commitment when any required condition remains unknown or refuted.
final_decision: Keep. Cite it for illusory completion, underverified answer rate, per-constraint epistemic tracking, and the LiveLedger intervention. Do not treat it as a final solution: the evaluation still relies on model-based ledgers, the benchmark is a curated 215-instance MCP subset, and LiveLedger can redistribute failures into bare assertions or overlooked refutations when the backbone cannot use the ledger well.
tags: search-agents, llm-agents, deep-research, agent-evaluation, multi-constraint-qa, verification, epistemic-ledger, liveledger, underverification, rag, tool-use, long-horizon, constraint-tracking, agent-reliability, process-evaluation
---

# When Is Enough Not Enough? Illusory Completion in Search Agents

## Basic info

* Title: When Is Enough Not Enough? Illusory Completion in Search Agents
* Authors: Dayoon Ko, Jihyuk Kim, Sohyeon Kim, Haeju Park, Dahyun Lee, Gunhee Kim, Moontae Lee, Kyungjae Lee
* Year: 2026
* Venue / source: arXiv preprint (cs.AI, cs.CL)
* Link: https://arxiv.org/abs/2602.07549
* PDF: https://arxiv.org/pdf/2602.07549
* Code: https://github.com/dayoon-ko/illusory_completion
* arXiv version inspected: v1, submitted 2026-02-07
* Date read: 2026-06-30
* Date surfaced: 2026-06-30 (via Tracy)
* Why selected in one sentence: It gives a concrete way to catch search agents that stop after finding a plausible answer instead of verifying every required constraint.

## Quick verdict

Strong diagnostic paper, useful intervention

This is a keep. The paper is not about whether search agents can find answers at all; it is about whether they know when an answer is fully verified. That is the sharper question. The main failure mode, illusory completion, is familiar from real agent use: the system gets a candidate, checks enough evidence to feel done, and quietly skips one constraint or ignores a contradiction.

The Epistemic Ledger is the useful diagnostic object. It separates what the evidence supports from what the agent believes, per candidate and per constraint. LiveLedger then turns that diagnostic into an inference-time scaffold by showing the agent the current constraint state while it searches. The intervention is simple and surprisingly effective, especially with the stronger ReAct backbone.

## One-paragraph overview

The paper studies multi-constraint problems where a valid answer must satisfy several explicit conditions at once. Existing final-answer benchmarks can hide partial verification: an answer can be correct by luck, or plausible but unsupported, while the agent believes the task is complete. The authors define this as illusory completion and detect it with Epistemic Ledger, which tracks evidential support and agent belief for each candidate-constraint pair during the trajectory. Across 215 multi-constraint QA instances drawn from BrowseComp, DeepSearchQA, FRAMES, LiveDRBench, and WebWalkerQA, search agents show high underverified answer rates. LiveLedger, an online tracker that exposes constraint satisfaction states to the agent during execution, consistently improves accuracy and reduces underverified answers.

## What problem is the paper trying to solve?

Search-agent benchmarks usually score the final answer. That is too blunt for multi-constraint questions.

If the question asks for a person who satisfies four conditions, a search agent can fail in several ways:

* find someone who satisfies two conditions and assume the rest,
* miss a refutation in search results,
* keep searching redundantly without resolving the missing constraint,
* or exit before touching one of the constraints at all.

Final answer accuracy does not reveal those process failures. Worse, even a correct answer may be underverified if the agent never actually found evidence for every required condition.

The paper names that gap "illusory completion": the agent falsely believes the task is complete despite unresolved or violated constraints.

## Epistemic Ledger

Epistemic Ledger is an evaluation framework maintained by an evaluator model. The paper uses gpt-oss-120b for ledger evaluation.

For each question, the evaluator first extracts a set of explicit, externally verifiable constraints. It then tracks candidate answers across the agent trajectory. For each candidate k and constraint C_i, the ledger stores two states:

* Evidential support E(k, C_i): SATISFIED, REFUTED, or UNKNOWN.
* Agent belief B(k, C_i): AFFIRM, DENY, or UNADDRESS.

The ledger also tracks candidate status:

* ACTIVE: the agent is currently focusing on that candidate.
* STORED: the candidate has been mentioned but is not the active answer.
* REJECTED: the agent has explicitly ruled it out.

This split is the core move. A search result might refute a constraint while the agent still believes the candidate works. Or the agent might affirm a constraint that the search results never supported. Final answer scoring would miss that mismatch; the ledger makes it visible.

## Underverified Answers

The paper defines an answer as underverified if the agent terminates with an ACTIVE final answer while at least one required constraint is not SATISFIED by evidence. That includes both REFUTED and UNKNOWN constraints.

This matters because underverification is not identical to wrongness.

An answer can be:

* correct and verified,
* correct but underverified,
* incorrect but superficially supported,
* or incorrect and underverified.

The scary category is correct but underverified. It means the agent got lucky or relied on shortcuts. If you only measure final accuracy, you may reward a process that will break when the facts shift.

## Four Failure Modes

The paper identifies four recurring mechanisms of illusory completion.

### Bare Assertion

The agent claims a constraint is satisfied even though the evidence state remains UNKNOWN. This is the classic "sounds checked" failure. The model believes the candidate works, but the ledger has no actual support.

### Overlooked Refutation

The evidence explicitly contradicts a constraint, but the agent fails to reject the candidate. This is more dangerous than absence of evidence because the answer has already been falsified somewhere in the trace.

### Stagnation

The agent keeps searching without changing evidential support or belief for the ACTIVE candidate, while at least one constraint remains UNKNOWN. The paper uses three repeated no-progress steps as the empirical cutoff.

### Premature Exit

The agent stops while at least one required constraint remains UNKNOWN and UNADDRESS. This is the cleanest form of "enough is enough" hallucination: the agent simply never checks part of the task.

## LiveLedger

LiveLedger is the inference-time version of the ledger idea.

After each agent step, LiveLedger updates the evidential support state for candidate-constraint pairs based on the newest observation. It then exposes the current constraint state to the search agent before the next reasoning step.

The hypothesis is simple: if the agent can see which constraints remain unknown or refuted, it will be less likely to commit early and more likely to search for missing evidence or reject bad candidates.

For prompt-based agents, the ledger can be interleaved directly into the trajectory. For post-trained search agents such as Tongyi DeepResearch, the authors use a separate model to update the ledger and append the ledger update into the observation, since the trained search agent is not reliable at doing the update itself.

## Experimental Setup

The authors construct a 215-instance multi-constraint problem set from five benchmarks:

* BrowseComp: 99 instances.
* DeepSearchQA: 43 instances.
* FRAMES: 33 instances.
* LiveDRBench: 28 instances.
* WebWalkerQA: 12 instances.

They select questions whose decomposed reasoning DAG has width at least 3 and depth 1. In plain terms: the answer must merge three or more independent constraints, rather than follow a long dependency chain.

The evaluated systems include trained or post-trained search agents:

* Search-R1.
* ASearcher.
* HybridDeepSearcher.
* DR-Tulu.
* WebExplorer.
* Tongyi DeepResearch.

They also evaluate prompt-based methods:

* Search-o1.
* ReAct with gpt-oss-20b and gpt-oss-120b.

For judging answer accuracy, they use gpt-5. For UAR, they use Epistemic Ledger and validate underverified-answer detection with human annotation: overall accuracy 93%, majority-vote accuracy 100%, and Fleiss kappa = 0.74 on 30 sampled cases.

## Main Results

The headline result: illusory completion is common even in stronger search agents.

Accuracy and underverified answer rate (UAR) from Table 1:

* Search-R1: 13.0 accuracy, 93.5 UAR.
* ASearcher: 7.0 accuracy, 94.9 UAR.
* HDS: 16.3 accuracy, 86.5 UAR.
* DR-Tulu: 17.2 accuracy, 90.2 UAR.
* WebExplorer: 36.3 accuracy, 72.6 UAR.
* TongyiDR: 56.7 accuracy, 52.1 UAR.
* Search-o1-20B: 24.2 accuracy, 76.3 UAR.
* ReAct-20B: 36.3 accuracy, 62.8 UAR.
* Search-o1-120B: 34.4 accuracy, 65.6 UAR.
* ReAct-120B: 39.1 accuracy, 76.3 UAR.

Even TongyiDR, the strongest baseline by accuracy, has UAR above 50. The paper also reports that underverified correct answers remain common: TongyiDR has 19.1% correct-but-underverified answers. That is exactly why final-answer-only scoring is misleading.

## LiveLedger Results

LiveLedger improves all evaluated integrations.

From Table 1:

* TongyiDR: 56.7 accuracy, 52.1 UAR.
* TongyiDR + LiveLedger: 58.9 accuracy, 51.4 UAR.
* ReAct-20B: 36.3 accuracy, 62.8 UAR.
* ReAct-20B + LiveLedger: 41.4 accuracy, 57.7 UAR.
* ReAct-120B: 39.1 accuracy, 76.3 UAR.
* ReAct-120B + LiveLedger: 50.7 accuracy, 49.8 UAR.

The largest accuracy gain is ReAct-120B: +11.6 points. The largest UAR reduction is also ReAct-120B: 76.3 to 49.8, a 26.5 point reduction by the table values. The text also mentions a 27.5 point reduction, likely from a related comparison or rounded internal calculation; I would cite the table numbers when being precise.

LiveLedger also reduces turn count. ReAct-120B takes 43.8 turns, ReAct-TTS-120B takes 70.5 turns, and ReAct-L-120B takes 41.6 turns. This matters because a ledger is not merely "think longer." It can steer search, reduce thrashing, and avoid redundant exploration.

## Comparison to Test-Time Scaling

The authors compare LiveLedger to a simple test-time scaling baseline inspired by s1. Their ReAct-TTS variant suppresses the final-answer transition and appends a self-checking prompt asking the model to verify constraints, up to three times.

ReAct-TTS-120B improves UAR from 76.3 to 52.9 and accuracy from 39.1 to 41.3. That is real, but LiveLedger reaches 50.7 accuracy and 49.8 UAR.

The interpretation is good: simply forcing more turns can help the agent verify constraints for already-correct answers, but it does not reliably improve candidate exploration or correct wrong answers. Explicit constraint state is a better control signal than extra deliberation alone.

## Failure Redistribution

The paper is honest that LiveLedger does not just erase all failures. Sometimes it redistributes them.

For example, LiveLedger consistently improves premature exit:

* TongyiDR: 33% to 32%.
* ReAct-20B: 55% to 45%.
* ReAct-120B: 60% to 35%.

It also improves stagnation for TongyiDR and ReAct-120B, but not for ReAct-20B. With the weaker 20B ReAct backbone, LiveLedger can increase bare assertions and overlooked refutations. The authors interpret this as a capacity issue: the ledger gives useful state, but the backbone still has to understand and use that state correctly.

That caveat matters. Constraint tracking is not magic. It is an information surface. A weak agent can still misuse it.

## Candidate Exploration

The paper introduces Extent of Candidate Exploration (ECE), the average number of distinct candidates explored per reasoning turn.

LiveLedger increases ECE across the evaluated models:

* TongyiDR: 0.27 to 0.43.
* ReAct-20B: 0.19 to 0.37.
* ReAct-120B: 0.24 to 0.29.

ReAct-TTS-120B drops to 0.10 despite longer trajectories. This is one of the best empirical points in the paper: longer reasoning can make an agent cling to its initial candidate, while explicit ledger state can push it to explore alternative candidates or reject invalid ones.

## Qualitative Example

The paper's rabbi example is clean.

The question asks which rabbi worked for both Reform Congregation Keneseth Israel in Philadelphia and Congregation Beth Israel in West Hartford, Connecticut, as of August 3, 2024.

The baseline agent predicts Stephen Lewis Fuchs. It has evidence that Fuchs is a rabbi and worked at Beth Israel, and weak search-snippet evidence involving Keneseth Israel, but the ledger finds the "both positions by August 3, 2024" constraint unsupported/refuted. The answer is Abraham J. Feldman.

With LiveLedger, the agent sees a ledger update showing Abraham J. Feldman satisfies the constraints and then browses supporting evidence before answering. This is exactly the intended behavior: not just answer, but answer with all constraints checked.

## Strengths

The paper attacks a real failure mode. "Plausible answer found" is not the same as "all constraints verified."

Epistemic Ledger is a clean abstraction. Separating evidence from agent belief is a strong diagnostic move.

UAR is a useful metric. It captures failures that final accuracy hides, including correct-but-underverified answers.

The intervention is simple and practical. LiveLedger is not a new trained model; it is an inference-time state tracker.

The comparison to test-time scaling is valuable. It shows that extra thinking is weaker than explicit constraint-state tracking.

The paper includes human validation for the ledger's underverification judgments, which helps with trust.

## Weaknesses and caveats

The evaluation still depends heavily on model-based judgment. Accuracy is judged by gpt-5, and Epistemic Ledger is maintained by gpt-oss-120b. The human validation is useful but small: 30 cases with fewer than 6 tool-call turns.

The benchmark is curated. The 215 MCP instances are selected by a DAG-decomposition pipeline, so the result is a targeted stress test rather than a broad estimate of all search-agent behavior.

The ledger can be wrong. The manual review finds evaluation misclassification in 2 of 37 verified-but-incorrect cases, often because snippets omit critical context.

LiveLedger's gains depend on the backbone. The weaker ReAct-20B case shows that exposing state is not enough if the agent cannot use it well.

The paper focuses on explicit constraints. Real user requests often contain implicit constraints, preferences, safety boundaries, or shifting intent. Those are harder to ledger cleanly.

The method adds compute and complexity. Even if it reduces turns in some settings, it still requires constraint extraction, candidate tracking, and ledger updates.

## Why It Matters

This paper belongs next to the recent long-horizon agent failure papers. It gives one very concrete mechanism behind agent brittleness: the agent loses track of which requirements are actually verified and exits once a candidate feels plausible.

For real agent systems, the lesson is straightforward: maintain an external constraint ledger. Every serious deep-research or tool-use agent should know which requirements are satisfied, refuted, unknown, and unaddressed before it commits to an answer or action.

This also applies beyond search. Coding agents can track requested changes, tests, compatibility constraints, and touched files. Personal agents can track user constraints, privacy constraints, and external-action preconditions. The pattern generalizes: do not rely on the model's feeling of completion; maintain explicit completion state.

## Final Decision

Keep. Cite it for illusory completion, UAR, Epistemic Ledger, and LiveLedger. The paper has a practical diagnostic vocabulary and a useful architectural pattern: per-candidate, per-constraint verification state exposed during execution.

The caution: do not oversell it as solved reliability. It is a strong scaffold for explicit constraint tracking, but it still relies on judge quality, clean constraint extraction, and an agent capable of using the ledger rather than merely reading it.
