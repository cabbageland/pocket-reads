---
title: Self-Compacting Language Model Agents
slug: self-compacting-language-model-agents
authors: Tianjian Li, Jingyu Zhang, William Jurayj, Xi Wang, Chuanyang Jin, Mehrdad Farajtabar, Eric Nalisnick, Daniel Khashabi
year: 2026
venue: arXiv preprint (cs.CL)
date_read: 2026-07-09
paper_url: https://arxiv.org/abs/2606.23525
pdf_url: https://arxiv.org/pdf/2606.23525
verdict: Keep. This is a clean agent-systems paper about making context compaction state-aware instead of timer-driven.
summary: SelfCompact gives an LM agent a summarization tool plus a lightweight rubric that decides when compression is safe. At probe points, the same model judges whether the trajectory has reached a closed unit, whether useful facts can be summarized without loss, whether progress has happened, and whether compression would hide being stuck. If the rubric returns COMPRESS, the model summarizes the accumulated trace and continues from the original prompt plus that summary. Across competition math and agentic search, the scaffold usually beats no compaction and fixed-interval summarization while using less money on search tasks. The key result is not that models naturally know when context is rotting; the ablations show they mostly do not. The useful bit is that a small task-specific rubric can supply the missing metacognitive control loop without fine-tuning.
why_it_matters: This is directly relevant to long-running coding, research, and tool agents. Fixed auto-compaction is cheap to implement but blind to reasoning state, so it can summarize in the middle of a derivation or after the agent has already accumulated stale junk. SelfCompact reframes compaction as a structured control decision: compress after a subproblem closes, not merely when the context meter crosses a line. The caution is that the scaffold is still hand-rubriced and task-specific, with a threshold backstop in search. It is a good design pattern, not proof that agents have solved memory management on their own.
final_decision: Keep and cite for rubric-gated adaptive compaction. The strongest reusable idea is the interface: expose summarization as a tool, ask the current model for an evidence-backed COMPRESS/CONTINUE decision, preserve KV cache during probes, and reset only after a closed reasoning unit. Do not cite it as fully autonomous memory, general long-context planning, or evidence that unprompted models can detect context rot reliably.
tags: agents, context-management, self-compaction, adaptive-summarization, context-rot, long-context, tool-use, agent-memory, inference-time-scaffolding, rubric-gated-control, math-agents, search-agents, kv-cache, metacognition
---

# Self-Compacting Language Model Agents

## Basic info

* Title: Self-Compacting Language Model Agents
* Authors: Tianjian Li, Jingyu Zhang, William Jurayj, Xi Wang, Chuanyang Jin, Mehrdad Farajtabar, Eric Nalisnick, Daniel Khashabi
* Year: 2026
* Venue / source: arXiv preprint (cs.CL)
* Link: https://arxiv.org/abs/2606.23525
* PDF: https://arxiv.org/pdf/2606.23525
* DOI: https://doi.org/10.48550/arXiv.2606.23525
* arXiv version inspected: v1, submitted 2026-06-22
* Date read: 2026-07-09
* Date surfaced: 2026-07-08
* Surfaced via: Tracy in #pocket-reads
* Why selected in one sentence: It attacks a very practical agent failure mode: long traces get stale, but fixed auto-compaction often fires at exactly the wrong moment.

## Quick verdict

Keep. This is a clean agent-systems paper about making context compaction state-aware instead of timer-driven.

The paper's core move is small but sharp: give the agent a summarization tool, then gate that tool with a rubric about reasoning state. A compaction should fire when a sub-task has resolved or the trajectory is converging. It should not fire mid-derivation, mid-search, or when the agent is simply stuck and would use summarization to bury confusion.

That sounds obvious. The useful part is that the paper actually tests the obvious thing across math reasoning and web/search agents, and the ablations are honest: just letting the model call a summarizer does not work reliably. Some models call it at bad times, and some do not call it enough. The rubric is doing real work.

## One-paragraph overview

SelfCompact gives an LM agent a summarization tool plus a lightweight rubric that decides when compression is safe. At probe points, the same model judges whether the trajectory has reached a closed unit, whether useful facts can be summarized without loss, whether progress has happened, and whether compression would hide being stuck. If the rubric returns COMPRESS, the model summarizes the accumulated trace and continues from the original prompt plus that summary. Across competition math and agentic search, the scaffold usually beats no compaction and fixed-interval summarization while using less money on search tasks. The key result is not that models naturally know when context is rotting; the ablations show they mostly do not. The useful bit is that a small task-specific rubric can supply the missing metacognitive control loop without fine-tuning.

## What problem is the paper trying to solve?

Long agent traces are not just expensive. They become actively poisonous.

In a long reasoning or tool-use session, the context fills with:

* bad case splits;
* search results that were later abandoned;
* half-formed plans;
* failed programs;
* stale hypotheses;
* duplicated observations;
* and early mistakes that keep anchoring later generations.

The paper frames this as context rot: old context can degrade the model's next step even when it fits in the context window.

Existing deployed compaction strategies are mostly content-blind:

* reactive compaction waits until the context is almost full;
* periodic compaction fires every fixed number of turns or tokens;
* user-triggered compaction makes the human decide when the trace is stale.

The failure mode is straightforward. If you compact too late, stale context has already polluted many steps. If you compact at a blind interval, you might summarize while the model is halfway through a proof, an active search branch, or a fragile multi-fact synthesis. Then the summary drops the exact thing the agent needed.

SelfCompact asks whether the agent can be scaffolded to notice a good stopping point before compressing.

## What is the method?

The method has two pieces:

1. Expose summarization as an inline compaction tool.
2. Add a rubric probe that asks the same model whether now is a safe time to compress.

At a high level, the loop is:

1. The model works normally from the original prompt and current trace.
2. At probe intervals, the scaffold appends a short rubric prompt.
3. The model returns a binary decision: COMPRESS or CONTINUE.
4. If CONTINUE, the probe message and verdict are popped and the trajectory keeps going.
5. If COMPRESS, the scaffold appends a summarizer prompt, the model writes a compact summary, and generation resumes from the original prompt plus that summary.

The summarizer and the rubric judge are the same model. There is no external verifier, auxiliary judge model, fine-tuning, or training data.

## The important engineering detail

The paper cares about KV-cache reuse. The rubric and summarizer prompts are appended to the live prefix instead of re-encoding the full trace from scratch. That means the rubric probe is cheap relative to the whole trajectory: it mostly pays for a short generated verdict on top of cached tokens.

The expensive call is the actual summary. But after summary, every later model call attends to the compressed trace instead of the full old trace. The bet is that future savings and lower context rot outweigh the summarizer overhead.

This is why the method is operationally plausible. A "judge every few turns" design would be unattractive if every probe required full prefill. With cache reuse, the probe can be close to free.

## What exactly does the rubric check?

The rubrics differ between math and search.

For math, the rubric asks roughly:

* Has the latest round stated a specific final answer?
* Has the last stretch been stuck without new non-trivial facts?
* Is there a concrete next step?

It fires if either an answer should be locked in, or the model is stuck but has a named next step worth preserving.

For search agents, the rubric checks four gates:

* the trajectory has reached a closed unit;
* the essential information is reducible to a few cite-able facts;
* progress has happened since the last compression;
* the agent is not stuck in a way summarization would mask.

The search scaffold also includes practical guardrails: a minimum number of rounds, a prompt-length threshold, a cap on summaries, a period between probes, and a token-percentage backstop that forces compression past 30% of the context window. So "self-compacting" here means rubric-gated adaptive compaction inside a scaffold, not unconstrained introspection.

## Why this is different from fixed compaction

Fixed compaction is blind to the semantic state of the trace. It sees only a counter.

SelfCompact tries to compress at closed reasoning units:

* after a verified fact is found;
* after a sub-question is resolved;
* after a final answer should be preserved;
* after a stuck segment can be reset while keeping the next concrete step.

The motivating BrowseComp example is a good intuition pump. The answer requires combining several facts about a fungus, a French expert, an English name, a film character, and a bronze statuette. The no-compaction baseline burns its budget. Fixed summarization fires mid-search and drops verified facts. SelfCompact fires after resolved facts, preserving them into summaries so the agent can compose the answer.

The general lesson is not "summaries good." It is "summaries are a control action." Timing matters.

## Experiments

The paper evaluates six benchmarks and seven open-weight or deployed open-weight models.

Competition math:

* IMO-Answerbench;
* HMMT Nov 2025;
* HMMT Feb 2026;
* Qwen3-4B-Instruct-2507;
* Qwen3-30B-A3B-Instruct-2507;
* Qwen3.5-4B;
* Qwen3.5-9B.

Agentic search:

* BrowseComp;
* BrowseComp-Plus;
* DeepSearchQA;
* GLM-4.7-Flash;
* MiniMax-M2.5;
* Mimo-V2-Flash.

The baselines include:

* no compaction;
* fixed-interval summarization;
* delete-all for search;
* keep-last-N for search;
* SelfCompact without rubrics.

## Main math results

Under roughly matched token budgets against fixed-interval summarization, SelfCompact is best in 11 of 12 math model-benchmark cells.

Average accuracy by model:

* Qwen3-4B-Instruct-2507: no compaction 38.7, fixed 41.5, SelfCompact 45.1.
* Qwen3-30B-A3B-Instruct-2507: no compaction 50.6, fixed 54.9, SelfCompact 56.4.
* Qwen3.5-9B: no compaction 32.5, fixed 40.1, SelfCompact 47.3.
* Qwen3.5-4B: no compaction 21.9, fixed 30.7, SelfCompact 33.8.

The largest reported baseline-to-SelfCompact jumps are on Qwen3.5-9B:

* +16.4 on IMO-Answerbench;
* +10.0 on HMMT Nov;
* +18.1 on HMMT Feb.

The one exception is Qwen3-30B-A3B on HMMT Feb, where fixed interval beats SelfCompact by 1.1 points. That exception is useful because it keeps the result from becoming cartoonishly neat.

## Main search results

On agentic search, SelfCompact is strongest overall for all three deployed agents. It improves accuracy over no compaction and usually over fixed interval, while also lowering cost versus no compaction.

Overall accuracy and per-question cost:

* GLM-4.7-Flash: no compaction 36.6 at $0.13, fixed 41.5 at $0.05, SelfCompact 46.4 at $0.07.
* MiniMax-M2.5: no compaction 54.6 at $0.19, fixed 59.3 at $0.06, SelfCompact 63.9 at $0.08.
* Mimo-V2-Flash: no compaction 48.9 at $0.25, fixed 54.7 at $0.14, SelfCompact 59.2 at $0.13.

On BrowseComp-Plus specifically, SelfCompact improves over no compaction by:

* +8.5 for GLM-4.7-Flash, with cost dropping from $0.12 to $0.04;
* +9.2 for MiniMax-M2.5, with cost dropping from $0.19 to $0.07;
* +5.3 for Mimo-V2-Flash, with cost dropping from $0.24 to $0.16.

The fixed-interval baseline is often cheaper than SelfCompact, because it compresses aggressively. SelfCompact's more interesting claim is accuracy per cost versus no compaction and better accuracy than blind compression.

## Difficulty analysis

SelfCompact helps most on harder questions.

The paper bins BrowseComp-Plus questions by how many output tokens the no-compaction baseline consumed, using that as a proxy for difficulty. On easy bins, no compaction, fixed threshold, and SelfCompact are close. On the hardest bins, SelfCompact pulls ahead of the threshold baseline by 5 to 20 percentage points across the three search models.

That matches the intuition. Easy questions do not need much context management. The payoff appears when a long trace would otherwise accumulate stale state or cross many partially resolved subgoals.

## Ablation: the rubric matters

The ablation is the best part of the paper.

If the authors remove rubric-gated verification and let the model self-decide when to summarize, performance collapses toward naive fixed-interval behavior.

On GLM-4.7-Flash agentic search:

* no compaction: 36.6 average;
* fixed interval: 41.5;
* SelfCompact without rubrics: 41.0;
* full SelfCompact: 46.4.

On Qwen3-4B-Instruct-2507 IMOBench:

* no compaction: 38.9;
* fixed interval: 41.4;
* SelfCompact without rubrics: 40.9;
* full SelfCompact: 45.5.

This is the key finding: tool availability is not enough. The model needs a decision procedure for what reasoning state is safe to compress. The authors call this a metacognitive gap, which is a fair phrase here. The model can execute a compaction policy when the scaffold supplies one, but it does not reliably discover the policy on its own.

## Oracle headroom

The paper also analyzes fixed-interval math summaries by tracking answer transitions after summarization.

For Qwen3-4B-Instruct-2507 on IMO-Answerbench, fixed summarization can flip wrong answers to correct ones, but it also flips many correct answers to wrong ones. The paper reports that 40.4% of transitions degrade after summarization.

An oracle policy that skips fixed scheduled summaries whenever the current answer is already correct reaches 52.9% on IMO-Answerbench, compared with:

* no compaction: 38.9;
* fixed interval: 41.4;
* SelfCompact: 45.5.

That oracle is not deployable, but it shows that compaction timing has a lot of remaining headroom.

## Strengths

* The problem is real for coding agents, research agents, and any long-running tool loop.
* The method is simple enough to implement in existing scaffolds.
* The paper separates three things that are often conflated: having a summarizer, deciding when to summarize, and writing a useful summary.
* The rubric is cheap because it reuses the live KV cache.
* The experiments cover both pure reasoning and tool-heavy search.
* The ablation cleanly shows that unconstrained self-summarization is not enough.
* The cost analysis is practical rather than purely theoretical.
* The paper does not require model fine-tuning or an external judge.
* The method is inspectable: a human can read the rubric and the generated summary.

## Weaknesses and caveats

The rubrics are hand-designed and task-specific. The math rubric and the search rubric are different, and the paper does not prove that one general rubric works across coding, planning, GUI control, long document editing, or real production workflows.

SelfCompact still has scaffolding knobs. Search uses minimum rounds, token thresholds, summary caps, period constraints, and a 30%-of-context backstop. Those knobs may matter as much as the high-level idea in real deployments.

The "self" in SelfCompact is limited. The same model emits the COMPRESS/CONTINUE decision, but it is being asked a very structured question with explicit criteria. That is exactly why it works, but it should not be oversold as autonomous memory management.

Summarization is still lossy. The rubric tries to fire only when essential state is reducible to a few facts, but the summary can still drop negative search evidence, fragile derivation details, or low-salience constraints.

The math setup uses local vLLM models and token-budget matching, while the search setup reports OpenRouter costs. These are reasonable for the paper's point, but they are not a universal cost model.

The reported search cost advantage depends on provider-style KV caching and on later calls being significantly shorter after summary. Different serving stacks or pricing models could change the tradeoff.

The evaluation is open-weight models only. The limitations section explicitly notes that stronger frontier systems may have better metacognition and may need different scaffolding.

There is no RL or learned policy. That is a strength for isolating the scaffold, but also a limitation if the real goal is a model that learns when and what to compact.

## What I would steal

The reusable design pattern is:

1. Treat compaction as an agent action, not a background garbage collector.
2. Probe at natural boundaries.
3. Ask for evidence-backed criteria, not vibes.
4. Compress only when the trace has a closed unit.
5. Preserve final answers, verified facts, and concrete next steps.
6. Suppress compaction when the agent is mid-derivation or stuck.
7. Use cache-preserving appended probes.
8. Make the resulting summary the new persistent state.

For coding agents, I would adapt the rubric to ask things like:

* Is the current edit/test cycle closed?
* Are failing tests fully captured?
* Are uncommitted user changes protected?
* Are there unresolved hypotheses that would be lost if summarized?
* Has a concrete next command or patch target been identified?
* Would compaction hide a repeated failure rather than resolve it?

That is probably more useful than waiting for a magic context threshold.

## What challenges remain?

The biggest open problem is validation of the summary itself. The rubric decides when compression is safe, but it does not guarantee that the summary faithfully preserves every needed fact.

The next useful layer would check:

* whether the summary preserves known correct answers or test failures;
* whether it preserves negative evidence and failed branches that prevent retries;
* whether it names open questions separately from resolved facts;
* whether it keeps source/citation provenance for search;
* whether post-summary behavior regresses compared with continuing from the full trace.

Another open problem is learning the rubric. The paper suggests RL as a natural extension. That seems right: the rubric is a compact behavioral target for a policy that could eventually learn both when to compact and what summary shape is useful.

## Final take

SelfCompact is worth keeping because it turns auto-compaction from a blind token-threshold event into a small control problem. The method is not magical. It is a summarizer plus a prompt-level state machine. But that is exactly why it is useful: a lot of agent reliability work is going to be small state machines wrapped around models until the models absorb those habits.

The paper's best sentence, conceptually, is the ablation: unprompted models cannot reliably tell when their own context is rotting, but a lightweight rubric can close enough of the gap to matter.
