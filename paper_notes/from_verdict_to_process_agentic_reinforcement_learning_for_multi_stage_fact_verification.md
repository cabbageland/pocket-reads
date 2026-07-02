---
title: From Verdict to Process: Agentic Reinforcement Learning for Multi-Stage Fact Verification
slug: from-verdict-to-process-agentic-reinforcement-learning-for-multi-stage-fact-verification
authors: Rongxin Yang, Shenghong He, Siyuan Zhu, Chao Yu
year: 2026
venue: arXiv preprint (cs.AI)
date_read: 2026-07-02
paper_url: https://arxiv.org/abs/2606.13262
pdf_url: https://arxiv.org/pdf/2606.13262
verdict: Keep for process-aware verification RL, with annotation-shaped caveats
summary: This paper introduces ProFact, a reinforcement-learning framework that turns open-domain fact verification into a three-stage agent trajectory: generate verification questions, retrieve evidence and answer those questions, then predict a final veracity label. Instead of training only on final correctness, ProFact uses process-aware rewards: METEOR overlap against gold verification questions, METEOR overlap against gold question-answer evidence, and a final verdict-correctness indicator. With GRPO over grouped rollouts on AVeriTeC, ProFact beats Consistency, InFact, and HerO on AVeriTeC Score across four Qwen backbones, with the best reported score at 48.00 for Qwen2.5-7B. The strongest lesson is that fact-checking agents need stage-level supervision, but the paper's gains depend heavily on AVeriTeC-style gold intermediate annotations and a fixed evidence store.
why_it_matters: This is a useful companion to claim-decomposition and auditability work because it says the verification process itself can be optimized, not merely prompted. The important move is not "make an agent"; it is to expose question generation, evidence seeking, answer synthesis, and verdict prediction as trainable trajectory stages with separate reward signals. For real systems, the lesson is sharp: final labels are too sparse for reliable process improvement, but dense process rewards are expensive and easy to overfit to benchmark artifacts.
final_decision: Keep. Cite it for process-aware RL in fact verification, GRPO-style trajectory optimization over retrieval-augmented verification, and the empirical value of intermediate rewards. Do not cite it as proof that agentic fact-checking is solved: retrieval is over a static AVeriTeC store, process rewards require gold questions and Q/A evidence, METEOR is a blunt proxy, and the experiments are limited to Qwen-family backbones on one benchmark.
tags: fact-verification, automated-fact-checking, agentic-rl, llm-agents, process-supervision, retrieval-augmented-generation, evidence-seeking, claim-decomposition, averitec, grpo, qwen, verification-agents, process-rewards, rl-for-llms, factuality
---

# From Verdict to Process: Agentic Reinforcement Learning for Multi-Stage Fact Verification

## Basic info

* Title: From Verdict to Process: Agentic Reinforcement Learning for Multi-Stage Fact Verification
* Authors: Rongxin Yang, Shenghong He, Siyuan Zhu, Chao Yu
* Year: 2026
* Venue / source: arXiv preprint (cs.AI)
* Link: https://arxiv.org/abs/2606.13262
* PDF: https://arxiv.org/pdf/2606.13262
* DOI: https://doi.org/10.48550/arXiv.2606.13262
* arXiv version inspected: v1, submitted 2026-06-11
* Date read: 2026-07-02
* Date surfaced: 2026-07-01
* Surfaced via: Tracy in #pocket-reads
* Code: Not found in the paper or a quick web search.
* Why selected in one sentence: It tries to train the full evidence-seeking fact-verification process, not just prompt or score the final verdict.

## Quick verdict

Keep for process-aware verification RL, with annotation-shaped caveats.

This is useful because it frames fact verification as a trainable multi-stage trajectory. The paper's best idea is simple and sturdy: if a fact-checking pipeline has question generation, evidence search, answer synthesis, and verdict prediction, then a single final label is too sparse to teach the system which stage went wrong. ProFact therefore adds rewards at the process level, then uses GRPO to increase the likelihood of better full verification trajectories.

The caveat is equally important. The dense rewards are not magic. They come from AVeriTeC's gold verification questions and gold question-answer evidence annotations, with METEOR used as the matching signal. That makes the result more like "process-supervised RL can improve a benchmarked verification workflow" than "agentic fact-checkers can discover truth end-to-end."

So: preserve it. It belongs in the pile for evidence-seeking agents, process supervision, and claim-verification pipelines. Just keep the warning label attached.

## One-paragraph overview

The paper proposes ProFact, an agentic RL framework for open-domain fact verification on AVeriTeC. ProFact treats verification as a finite-horizon Markov decision process with three stages: Question, Search, and Verdict. Given a claim, a unified policy generates up to five verification questions, issues search actions against a static evidence store, synthesizes evidence-grounded answers, and predicts one of four AVeriTeC labels: Supported, Refuted, Not Enough Evidence, or Conflicting Evidence. The policy is post-trained with GRPO over groups of sampled rollouts. Its reward is process-aware: generated questions are scored against gold questions, generated question-answer pairs are scored against gold Q/A evidence, and final verdicts get a correctness reward. Across Qwen2.5-3B, Qwen2.5-7B, Qwen3-4B, and Qwen3-8B, ProFact improves AVeriTeC Score over Consistency, InFact, and HerO, while using fewer tokens than InFact. The main empirical lesson is that intermediate supervision matters; the main practical limitation is that the supervision is highly structured and benchmark-specific.

## What problem is the paper trying to solve?

Most LLM fact-checking systems are pipelines. They decompose claims, retrieve evidence, answer subquestions, and then predict a verdict. But the training or prompting often treats those stages separately.

That creates a credit-assignment problem. If the final verdict is wrong, the system usually does not know whether:

* the original claim was decomposed into the wrong questions,
* the search query retrieved weak evidence,
* the evidence-grounded answer contradicted the evidence,
* the final verifier ignored the useful evidence,
* or the whole trajectory wandered into a plausible but unsupported story.

The paper argues that this is a long-horizon decision problem, not a static classification problem. A fact-checking agent should learn which earlier process decisions actually lead to correct evidence-grounded verdicts.

That is a good diagnosis. The hard part is whether the proposed rewards are general enough to survive outside the benchmark that provides the intermediate annotations.

## ProFact as an agentic verification process

ProFact instantiates fact verification as a three-stage rollout.

### 1. Question stage

Given a claim, the policy generates verification questions. These questions are supposed to capture the information needs required to decide the claim's veracity.

During training, the generated question set is compared with gold AVeriTeC questions using a METEOR-based matching reward. The paper uses maximum-weight bipartite matching so generated and gold questions are aligned one-to-one before averaging similarity scores.

### 2. Search stage

For each generated question, the agent performs an explicit search action. The evidence source is AVeriTeC's static knowledge store of pre-collected web documents.

The retrieval system is semantic search:

* resource documents are embedded with Qwen3-Embedding-0.6B,
* a pre-built kNN index is queried,
* each search call returns the top 3 evidence items,
* the agent synthesizes an evidence-grounded answer for the current question,
* the transient search context is reset before the next question.

That context reset is a nice engineering detail. It reduces context bloat across decomposed questions and partly explains the lower inference cost versus InFact.

The Search-stage reward compares generated question-answer pairs against gold question-answer annotations, again using METEOR-based matching.

### 3. Verdict stage

After question answering, the policy predicts the final AVeriTeC label:

* Supported
* Refuted
* Not Enough Evidence
* Conflicting Evidence

The verdict reward is a simple indicator: 1 if the predicted label matches the gold label, otherwise 0.

## Training objective

The paper post-trains the policy with GRPO, using grouped rollouts for each claim.

For each claim, the old policy samples a group of trajectories. Each trajectory receives a total process-aware return. Those returns are normalized within the group to produce group-relative advantages, and the policy is updated with the clipped GRPO objective plus KL regularization.

The implementation details that matter:

* 8 trajectories per claim
* mini-batch size 32
* micro-batch size 4
* KL coefficient 0.001
* maximum 12 interaction steps per episode
* deterministic decoding at evaluation time
* at most 5 generated verification questions
* top 3 evidence items per search call

The setup is recognizably modern RL-for-LLMs: no learned value function, grouped rollouts, a reward that mixes process quality and final task outcome, and KL to keep the policy from drifting too far.

## Process-aware reward

The reward is the heart of the paper.

For a generated set X and gold set Y, ProFact computes pairwise METEOR similarities and then finds a maximum-weight bipartite matching. The reward is the average matched similarity normalized by the number of gold items.

The stage rewards are:

* Question reward: Match(generated questions, gold questions)
* Search reward: Match(generated Q/A pairs, gold Q/A pairs)
* Verdict reward: indicator(predicted label equals gold label)

Invalid or empty outputs get zero reward.

This is useful but very revealing. The method does not merely learn from final veracity labels. It leans on gold intermediate supervision from AVeriTeC. That is a perfectly reasonable research setup, but it means the result is closer to process-supervised RL than weakly supervised autonomous fact-checking.

## Experimental setup

The paper evaluates on AVeriTeC, a real-world claim-verification benchmark with claims, veracity labels, annotated question-answer evidence, and a fixed knowledge store of pre-collected web documents.

The reported evaluation uses the development set. The efficiency table says the dev set has 500 claims.

Backbones:

* Qwen2.5-3B-Instruct
* Qwen2.5-7B-Instruct
* Qwen3-4B-Instruct-2507
* Qwen3-8B

Baselines:

* Consistency: fixed released baseline Q/A evidence plus repeated generation and aggregation for verdict prediction.
* InFact: a structured multi-step fact-checking workflow.
* HerO: a strong AVeriTeC system using hypothetical fact-checking documents and fine-tuned LLM components.
* w/o PR: ProFact without intermediate process rewards, keeping only the final verdict reward.

Metrics:

* Q-only METEOR for generated verification questions
* Q&A METEOR for generated question-answer evidence
* Accuracy for final label prediction
* AVeriTeC Score, which requires both sufficient evidence score and correct veracity label

## Main results

The headline is that ProFact gets the best AVeriTeC Score across all four backbones in Table 1.

ProFact results:

* Qwen2.5-3B: Q-only 46.01, Q&A 31.14, Accuracy 68.80, AVeriTeC Score 47.80
* Qwen2.5-7B: Q-only 45.26, Q&A 30.36, Accuracy 70.20, AVeriTeC Score 48.00
* Qwen3-4B: Q-only 46.08, Q&A 30.11, Accuracy 69.60, AVeriTeC Score 46.20
* Qwen3-8B: Q-only 46.05, Q&A 30.02, Accuracy 70.28, AVeriTeC Score 46.40

Strongest baseline AVeriTeC Scores:

* Qwen2.5-3B: HerO 43.40
* Qwen2.5-7B: HerO 42.80
* Qwen3-4B: InFact 45.29, HerO 43.60
* Qwen3-8B: HerO 44.40, InFact 31.50

So the improvements are real, though not equally dramatic everywhere. The largest practical gain is on smaller Qwen2.5 models. The Qwen3-4B comparison is closer because InFact already reaches 45.29 AVeriTeC Score.

The paper also observes that bigger backbones do not monotonically improve fact verification. Qwen3-8B has the highest raw accuracy, but not the highest AVeriTeC Score. The authors attribute this to larger models sometimes leaning harder on parametric priors instead of retrieved evidence. That is plausible, and it fits the broader fact-checking theme: fluent models can be worse evidence citizens.

## Ablation: process rewards matter

The w/o PR ablation removes the intermediate Question and Search rewards and trains only with final verdict reward.

AVeriTeC Scores drop sharply:

* Qwen2.5-3B: ProFact 47.80 vs w/o PR 34.40
* Qwen2.5-7B: ProFact 48.00 vs w/o PR 31.00
* Qwen3-4B: ProFact 46.20 vs w/o PR 39.00
* Qwen3-8B: ProFact 46.40 vs w/o PR 35.40

This is the paper's cleanest evidence. Final-label reward alone is too sparse and delayed for this kind of multi-stage verification trajectory. The model needs process-level signals to learn useful decomposition and evidence behavior.

The caveat is that the ablation proves the value of process rewards under gold intermediate annotations. It does not prove that we can cheaply generate those rewards in the wild.

## Efficiency results

The paper compares ProFact with InFact because both use a single backbone to run a complete verification workflow end-to-end.

Over the 500-claim development set, ProFact is much cheaper:

* Qwen2.5-3B: 7.29 seconds per claim vs InFact 16.32; 7.26M input tokens vs 55.15M.
* Qwen2.5-7B: 7.82 seconds per claim vs InFact 50.44; 7.58M input tokens vs 131.44M.
* Qwen3-4B: 7.81 seconds per claim vs InFact 114.81; 7.22M input tokens vs 52.40M.
* Qwen3-8B: 22.06 seconds per claim vs InFact 288.00; 6.59M input tokens vs 34.04M.

The authors credit workflow simplification, context isolation, fewer redundant intermediate steps, and learned evidence-seeking behavior.

This is important, but keep the attribution sober. Some of the efficiency gain is from RL making behavior more targeted; some is from ProFact's pipeline design being leaner than InFact's workflow.

## RL algorithm comparison

The paper compares PPO, GRPO, DAPO, and GiGPO for Qwen2.5-3B and Qwen2.5-7B.

GRPO is best overall:

* Qwen2.5-3B AVeriTeC Score: PPO 31.00, GRPO 47.80, DAPO 42.00, GiGPO 38.80
* Qwen2.5-7B AVeriTeC Score: PPO 37.27, GRPO 48.00, DAPO 42.80, GiGPO 43.20

The authors argue that GRPO works well because the task naturally supports comparing multiple rollouts for the same claim. PPO's value-function estimation is harder with heterogeneous stage rewards and retrieval-dependent outcomes. GiGPO's anchor-state grouping is less useful because verification trajectories have fewer reusable anchor states.

This part is plausible but thin. The result is useful as an empirical preference for GRPO in this setting, not as a general algorithmic conclusion.

## What is actually novel?

The novelty is not "use RAG for fact-checking" or "decompose claims." Those are established.

The useful contribution is the training framing:

* formulate fact verification as a multi-stage policy trajectory,
* expose question generation, search, answer synthesis, and verdict prediction as actions,
* train with stage-specific rewards instead of only final correctness,
* use grouped rollout optimization so better complete trajectories become more likely,
* evaluate both verification accuracy and process/evidence quality.

The paper is strongest when read as a process-supervision paper for verification agents.

## Strengths

The problem framing is right. Fact verification is usually a process problem disguised as a classification problem.

The three-stage rollout is simple enough to inspect. It does not bury the system under a huge multi-agent bureaucracy.

The reward ablation is convincing. Removing process rewards hurts every backbone, often badly.

The paper reports intermediate metrics, final metrics, efficiency metrics, and algorithm comparisons.

The efficiency story matters. Better fact-checking systems cannot be infinite-token rituals.

The "bigger is not always better" observation is a useful reminder for evidence-grounded tasks.

## Weaknesses and caveats

The dense reward depends on AVeriTeC's gold questions and gold question-answer evidence. That is the central caveat. Outside such datasets, you would need human annotation, a learned evaluator, or some other proxy.

METEOR is a blunt reward for verification-process quality. It measures lexical/semantic overlap with reference questions and answers, not whether an evidence path is uniquely sufficient, source-reliable, or robust to adversarial phrasing.

The retrieval environment is a static AVeriTeC evidence store, not live web search. That makes the experiment reproducible, but it leaves out source discovery, freshness, adversarial SEO, page reliability, and contradictory evidence management.

The Search reward evaluates generated Q/A pairs, not retrieved documents directly. A bad retrieval step can be hidden if the answer happens to overlap with the gold annotation, and a good alternate evidence path may be penalized if it differs from the reference.

The experiments are limited to AVeriTeC and Qwen-family backbones. There is no broad cross-benchmark story.

The baseline comparisons are useful but not perfectly surgical. InFact, HerO, and Consistency have different pipeline assumptions and intermediate-module behavior, so the results are not a pure "RL versus prompting" comparison.

The paper does not provide much detail on training cost, failure cases, or qualitative trajectory examples. For a process paper, more trace-level examples would have helped.

No code was found during the read. That limits reproducibility for now.

## Relation to other Pocket Reads notes

This sits next to *The Alignment Bottleneck in Decomposition-Based Claim Verification*.

That paper says decomposition only helps when evidence is aligned to the decomposed claim units. ProFact pushes a nearby idea into RL: question generation and evidence-grounded answers should receive their own training signal, not merely feed an opaque final verdict.

The two papers agree on the deeper lesson: splitting claims is not enough. The system needs evidence routing, intermediate labels or answers, and a policy for propagating uncertainty to the final decision.

This also relates to claim-level auditability and provenance work. A final fact-checking verdict is only useful if you can inspect which questions were asked, which evidence answered them, and why the final label followed.

## Ideas worth stealing

Use process rewards for fact-checking agents. Even if the exact METEOR rewards are too benchmark-specific, the shape is right: reward decomposition, evidence grounding, and final verdict separately.

Keep search contexts isolated per question. It limits context bloat and makes traces easier to audit.

Evaluate both evidence process and final verdict. A high final accuracy with bad evidence behavior is not enough for a trustworthy verifier.

Compare multiple rollouts for the same claim. Group-relative ranking is a natural fit for verification because there are many plausible question/evidence paths, but only some actually support the final label.

Be suspicious of larger models in evidence tasks. They may know more, but that can make them less obedient to retrieved evidence.

## Why It Matters

This paper matters because it gives a concrete training recipe for a fact-checking workflow that is usually handled by prompt engineering.

The portable lesson is not "use ProFact exactly." The portable lesson is:

* make the verification process explicit,
* log each stage,
* score each stage,
* train on full trajectories,
* and do not expect final verdict labels to teach good evidence behavior by themselves.

For cabbageland's agent reliability stack, this belongs under process-level factuality. It is relevant to deep-research agents, claim audit trails, evidence provenance, and any system that needs to verify complex claims instead of merely sounding careful.

## Final Decision

Keep. Cite it for process-aware RL in fact verification, GRPO over evidence-seeking trajectories, and the empirical value of intermediate rewards.

Do not overclaim it. The reward signal is annotation-heavy, the retrieval setting is fixed, and METEOR is not a complete model of evidence quality. This is a useful benchmarked process-supervision paper, not a general solution to autonomous fact-checking.
