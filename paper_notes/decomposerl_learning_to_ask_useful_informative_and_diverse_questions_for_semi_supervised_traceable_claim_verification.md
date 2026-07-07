---
title: DecomposeRL: Learning to Ask Useful, Informative, and Diverse Questions for Semi-Supervised, Traceable Claim Verification
slug: decomposerl-learning-to-ask-useful-informative-and-diverse-questions-for-semi-supervised-traceable-claim-verification
authors: Shubhashis Roy Dipta, Ankur Padia, Francis Ferraro
year: 2026
venue: arXiv preprint (cs.CL)
date_read: 2026-07-06
paper_url: https://arxiv.org/abs/2605.27858
pdf_url: https://arxiv.org/pdf/2605.27858
verdict: Keep for traceable fact-verification RL, especially the necessity reward
summary: DecomposeRL is a reinforcement-learning approach for claim verification that tries to keep the accuracy of end-to-end verifiers while preserving the auditability of decomposition methods. Given a claim and a fixed evidence document, a Qwen2.5-7B-Instruct policy emits a structured trace: analysis, atomic verification questions, evidence-grounded answers, and a final Supported/Refuted verdict. The policy is trained with GRPO and a seven-part reward ensemble covering output format, verdict correctness, question count, diversity, answer coverage, leave-one-out question necessity, and multiplicative per-question quality. The reported result is strong for this niche: 86.3 in-domain and 69.8 out-of-domain balanced accuracy across 11 benchmarks, with only about 5.5k curated training claims, while producing inspectable traces. The useful idea is not just "RL for fact checking"; it is credit assignment over which questions actually matter to the verdict.
why_it_matters: This paper is a good companion to process-aware verification-agent work because it treats decomposition quality as something trainable rather than a prompting aesthetic. The strongest reusable idea is leave-one-out necessity: a question earns reward if removing its answer changes the reconstructed verdict. That is a sharper target than generic relevance or plausibility. The caution is that DecomposeRL is still verification given pre-retrieved evidence, not open-world fact checking, and five of seven rewards depend on a large LLM judge.
final_decision: Keep. Cite it for RL-trained claim decomposition, traceable fact verification, semi-supervised reward design, and necessity-style credit assignment over sub-questions. Do not cite it as solved fact checking: retrieval is out of scope, the final label space is binary, the reward stack depends heavily on judge models, and the hardest counting/tabular failures still expose cross-question consistency gaps.
tags: fact-verification, claim-verification, claim-decomposition, automated-fact-checking, traceability, auditability, reinforcement-learning, grpo, process-rewards, semi-supervised-learning, llm-as-judge, qwen, evidence-grounding, factuality, misinformation, decomposition
---

# DecomposeRL: Learning to Ask Useful, Informative, and Diverse Questions for Semi-Supervised, Traceable Claim Verification

## Basic info

* Title: DecomposeRL: Learning to Ask Useful, Informative, and Diverse Questions for Semi-Supervised, Traceable Claim Verification
* Authors: Shubhashis Roy Dipta, Ankur Padia, Francis Ferraro
* Year: 2026
* Venue / source: arXiv preprint (cs.CL)
* Link: https://arxiv.org/abs/2605.27858
* PDF: https://arxiv.org/pdf/2605.27858
* DOI: https://doi.org/10.48550/arXiv.2605.27858
* arXiv version inspected: v1, submitted 2026-05-27
* Date read: 2026-07-06
* Date surfaced: 2026-07-03
* Surfaced via: Tracy in #pocket-reads
* Project page: https://dipta007.github.io/DecomposeRL
* Code: https://github.com/dipta007/DecomposeRL
* Model: https://huggingface.co/dipta007/decomposeRL-7b
* Dataset: https://huggingface.co/datasets/dipta007/DecomposeRL
* Why selected in one sentence: It directly targets the annoying gap between accurate-but-opaque fact-checking classifiers and traceable-but-weaker decomposition pipelines.

## Quick verdict

Keep for traceable fact-verification RL, especially the necessity reward.

This is a useful paper. DecomposeRL is not merely another "ask subquestions" prompting pipeline. It trains the decomposer itself with GRPO and a reward stack that scores whether each generated question is formatted, necessary, diverse, answerable, atomic, evidence-grounded, and collectively sufficient for the final verdict.

The standout idea is the leave-one-out necessity reward. Instead of asking whether a sub-question looks relevant, the method asks whether removing that question's answer changes the reconstructed verdict. That is a much better proxy for "did this question actually matter?" than generic LLM-judge salience.

The main caveat is scope. The model assumes a fixed evidence document and does not retrieve. It also uses a Qwen3-32B judge for five reward components during training, so the result is partly a judge-shaped training system. Still, as a paper about training decompositions to be useful rather than merely pretty, it is absolutely worth keeping.

## One-paragraph overview

DecomposeRL frames claim verification as iterative question-answer decomposition. Given a claim and an evidence document, a Qwen2.5-7B-Instruct policy generates a structured trace with an initial analysis, a sequence of atomic questions, evidence-grounded answers or abstentions, and a final binary verdict. The policy is trained with GRPO over a curated 5,464-claim dataset distilled from 14 fact-verification corpora, using LoRA and a reward ensemble: output format, verdict correctness, question count, question diversity, coverage, leave-one-out necessity, and multiplicative per-question quality. The method supports semi-supervised training by replacing gold labels for unlabeled claims with majority-vote pseudo-labels from sampled rollouts. Across 11 benchmarks, the fully supervised 7B model reports 86.3 in-domain and 69.8 out-of-domain balanced accuracy, beating matched 7B prompted and decomposition baselines while producing auditable traces. The paper's strongest contribution is credit assignment over decomposition: it tries to reward not just correct final answers, but the process by which the verifier got there.

## What problem is the paper trying to solve?

Claim verification has an ugly split.

End-to-end verifiers can be accurate and cheap at inference time, but they often emit a naked Supported/Refuted label. That is bad for scientific, biomedical, political, or long-form factuality settings where a user needs to inspect what the system checked.

Decomposition-based methods are more auditable because they break a claim into sub-questions and answer those questions from evidence. But many of them are prompt-only, brittle, or trained by imitation rather than by whether the decomposition actually helps the verifier reach the right verdict.

DecomposeRL tries to close that gap: keep traceability, but train the trace generator with rewards tied to verification utility.

## What is the method?

The method has three major pieces.

First, it represents verification as a structured trace. The policy receives a claim and evidence document, then emits:

* an initial analysis block,
* two or more question-answer cycles,
* evidence-only answers or explicit abstentions,
* and a final Supported or Refuted verdict.

Second, it trains the trace generator with GRPO. The policy is Qwen2.5-7B-Instruct with LoRA adapters. The reward signal is not a single outcome score; it is a seven-part ensemble.

Third, it makes GRPO tractable with a curation funnel. The paper aggregates public fact-verification corpora, removes trivial/noisy/duplicate/contaminated items, generates silver decompositions, selects a diverse 5k-ish subset, and adds long-evidence examples.

## Reward stack

The reward ensemble is the main technical artifact.

### Format

The model is rewarded for producing the expected structured trace: well-formed blocks, question-answer alternation, and a valid final label.

### Verification

The final verdict is compared with the gold label. This anchors the trace to task accuracy.

### Question count

The number of questions is compared with a silver decomposition length. This discourages both one-question under-decomposition and sprawling question spam.

### Diversity

Questions are embedded with Qwen3-Embedding-8B and penalized for redundancy through a maximal marginal relevance style score.

### Coverage

The system collects the generated answers and asks an LLM judge to reconstruct the verdict from the answers and claim alone. If the judge can recover the gold verdict, the answer set is treated as collectively sufficient.

### Necessity

This is the paper's best reward. For each answer, the method removes it and asks whether the reconstructed verdict changes. A question can be necessary, redundant, neutral, or harmful. This gives the model process-level credit assignment: a question is valuable when its answer changes the decision.

### Joint multiplicative quality

Each question-answer pair is judged for answerability, atomicity, and answer correctness. The signals are multiplied, not added, so a question cannot compensate for being unanswerable by being nicely phrased. Abstentions are handled separately: an honest "I don't know" can still earn reward if the question is good but the document lacks the answer.

## Semi-supervised training

The semi-supervised path is surprisingly central.

For unlabeled claims, DecomposeRL drops the direct verdict reward, replaces coverage with a majority-vote pseudo-label over GRPO rollouts, and turns necessity into a relative question: does removing this answer change the model's reconstructed verdict?

That lets the model train when only a fraction of examples have gold labels. The headline result here is that the 10%-supervision variant still reports 84.6 in-domain and 69.7 out-of-domain balanced accuracy, close to the fully supervised model's 86.3 and 69.8.

The interesting lesson is that, for this setup, much of the useful gradient comes from structured process rewards rather than from final labels alone.

## Data

The training pool comes from 14 claim-verification corpora, including FEVER-style Wikipedia datasets, LLM-AggreFact, PubHealth, SciFact, SciTab, ClaimDecomp, and PubMedClaim.

The curation funnel:

* aggregates the raw pool,
* filters out claims with too little evidence, too much evidence, too little entity grounding, or trivial claim-evidence overlap,
* keeps medium-difficulty items using MiniCheck-7B confidence,
* deduplicates and decontaminates against holdout data,
* generates silver decompositions,
* selects a balanced and diverse subset with a facility-location objective,
* and adds long-evidence examples.

The final training set has 5,464 claims. One small paper-level wrinkle: the abstract says the funnel distills 115K claims, while the method table reports 155,506 raw training rows. The method table is the more specific number, so I would cite that if precision matters.

## Results

The main reported numbers are strong for a 7B trace-producing verifier.

On 11 held-out benchmarks, DecomposeRL-7B reports:

* 86.3 average balanced accuracy over 9 in-domain datasets,
* 69.8 average balanced accuracy over 2 out-of-domain datasets,
* 84.6 / 69.7 when trained with only 10% gold labels.

Against matched 7B baselines, it beats direct prompting, CoT, MiniCheck-7B, and several decomposition-style methods on the aggregate numbers. Against larger systems, it is close to Decomposed Prompting with Qwen2.5-32B and GPT-4.1-mini on in-domain average, though the larger/frontier systems still lead more clearly out-of-domain.

The ablations are the more interesting result. Removing any one non-structural reward barely hurts in-domain accuracy, but out-of-domain accuracy drops materially. Necessity is the dominant signal: removing it causes the biggest out-of-domain loss, especially on CoverBench. Coverage and diversity are the next most important.

The appendix also shows:

* a 3B DecomposeRL variant still beats same-size baselines,
* submodular data selection beats random sampling at the same 5,464-claim budget,
* replacing the Qwen3-32B judge with smaller task-specific judge heads saves substantial compute with a modest accuracy hit,
* halving training to one epoch keeps in-domain accuracy but hurts out-of-domain benchmarks by about four points.

## What is actually novel?

The novelty is not "fact-checking with subquestions." That family is old.

The real novelty is the reward design:

* score whether a sub-question is necessary for the verdict,
* score whether the answer set collectively covers the claim,
* score per-question quality multiplicatively,
* make those rewards work in both supervised and semi-supervised settings,
* and train a decomposer to produce traces optimized for verification utility rather than imitation of gold decompositions.

The data curation is also important. The paper does not just dump every available claim into GRPO; it aggressively selects examples likely to produce learning signal.

## Strengths

The paper goes after the right failure mode. A lot of "explainable fact checking" produces traces that look plausible but are not actually causally tied to the verdict. The necessity reward is an unusually direct attempt to fix that.

The evaluation is broader than a toy demo: 11 benchmarks, in-domain and out-of-domain splits, same-size baselines, larger-model comparisons, supervision-rate sweeps, reward ablations, data-selection ablations, model-size ablations, and qualitative traces.

The semi-supervised result is practically interesting. If a verifier can learn from unlabeled claim-evidence pairs by scoring consistency and relative necessity, that matters in domains where gold labels are expensive.

The paper is also honest about failures. The tabular/counting example in the appendix is a real weakness: the model asks sensible questions, retrieves the relevant ordering, undercounts one item, and then confidently supports the wrong claim. That is exactly the kind of cross-question consistency gap these systems still have.

## Weaknesses and caveats

This is not end-to-end fact checking. It assumes the evidence document is already available, so the results measure verification and decomposition given evidence, not retrieval, source selection, or open-web truth finding.

The reward stack is judge-heavy. Five of seven reward components use Qwen3-32B during training. The paper mitigates this with deterministic caching, heterogeneous reward types, and a tiny-judge ablation, but judge bias and reward hacking remain real concerns.

The final verdict space is binary. The model can abstain inside sub-answers, but the final output is only Supported or Refuted. That is awkward for real-world claims where Not Enough Information is not a corner case.

Traceability is not the same as faithfulness. DecomposeRL improves the incentive structure, but an inspectable trace can still contain a wrong intermediate answer, especially in counting, table, or multi-hop consistency cases.

The strongest in-domain comparison is very good; the out-of-domain picture is more mixed. DecomposeRL is competitive, but GPT-4.1-mini and larger prompted baselines still have room over it on some out-of-domain averages.

## How I would use this paper

Use it as a reference for training verification traces with process rewards.

In particular, steal:

* leave-one-out necessity for question utility,
* coverage-from-answers as a sufficiency check,
* multiplicative per-step quality rewards,
* semi-supervised majority-vote pseudo-labeling for unlabeled claim-evidence pairs,
* and learning-signal-dense data selection before expensive RL.

Do not use it as evidence that a model can autonomously fact-check the web. It is a verifier over fixed evidence, and that boundary matters.

## Why It Matters

DecomposeRL matters because it reframes claim decomposition as a trainable control problem rather than a prompt template. The important question is not "can the model ask subquestions?" It is "which subquestions actually change the verdict, and can the model learn to ask those reliably?"

That is the right shape of problem for fact-checking agents, deep research audit trails, and any system where a user needs more than a final factuality score. The paper does not solve truth-seeking, but it gives a solid reward-design vocabulary for making verification traces less decorative and more accountable.

## Final decision

Keep.

This belongs next to process-aware fact verification, claim-decomposition, and factuality audit papers. The leave-one-out necessity reward is the part most worth remembering.

Citation posture: strong for "train the verification process"; weak for "open-world fact checking is solved."
