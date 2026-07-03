---
title: Reinforcement Learning with Metacognitive Feedback Elicits Faithful Uncertainty Expression in LLMs
slug: reinforcement-learning-with-metacognitive-feedback-elicits-faithful-uncertainty-expression-in-llms
authors: Gabrielle Kaili-May Liu, Avi Caciularu, Gal Yona, Idan Szpektor, Arman Cohan
year: 2026
venue: arXiv preprint (cs.CL, cs.AI)
date_read: 2026-07-03
paper_url: https://arxiv.org/abs/2606.32032
pdf_url: https://arxiv.org/pdf/2606.32032
verdict: Keep. One of the stronger recent papers on teaching models to express uncertainty faithfully, with proxy-measurement caveats.
summary: This paper introduces reinforcement learning with metacognitive feedback, or RLMF, for faithful calibration: making a model's expressed uncertainty match its estimated intrinsic uncertainty. Instead of rewarding only answer quality or confidence alignment, RLMF changes the GRPO advantage so completions with above-average faithful calibration are reinforced more strongly when the model also accurately predicts how faithful its own confidence scores are. The authors combine this with metacognitive data selection and a separate rewriting stage that maps numerical sentence-level confidence scores into natural linguistic hedges. Across Qwen3 and Llama3.1 models on 10 evaluation tasks, RLMF raises average cMFG* into the low-to-mid 0.8s while preserving accuracy and factual calibration better than prompting or SFT baselines. The core caveat is that "intrinsic confidence" is estimated by sampled-response consistency and judged with auxiliary models, so this is a strong operational result rather than proof of direct access to internal uncertainty.
why_it_matters: Uncertainty expression is one of the cleanest places where agent reliability becomes user-visible. A model that is wrong but loudly certain is dangerous; a model that hedges randomly is useless theater. This paper gives a concrete training recipe for aligning expressed confidence with a measurable internal-confidence proxy, then translating calibrated numbers into human-readable language without retraining for every style or context.
final_decision: Keep and cite for faithful calibration, metacognitive RL signals, uncertainty expression, and numerical-to-linguistic confidence mapping. Do not cite it as solved metacognition: the method is expensive, judge-heavy, proxy-dependent, and validated on benchmark tasks rather than open-ended deployed agents.
tags: uncertainty, faithful-calibration, metacognition, reinforcement-learning, grpo, rlmf, llm-calibration, confidence-estimation, linguistic-uncertainty, hedging, model-self-assessment, data-selection, qwen, llama, alignment, reliability
---

# Reinforcement Learning with Metacognitive Feedback Elicits Faithful Uncertainty Expression in LLMs

## Basic info

* Title: Reinforcement Learning with Metacognitive Feedback Elicits Faithful Uncertainty Expression in LLMs
* Authors: Gabrielle Kaili-May Liu, Avi Caciularu, Gal Yona, Idan Szpektor, Arman Cohan
* Year: 2026
* Venue / source: arXiv preprint (cs.CL, cs.AI)
* Link: https://arxiv.org/abs/2606.32032
* PDF: https://arxiv.org/pdf/2606.32032
* DOI: https://doi.org/10.48550/arXiv.2606.32032
* arXiv version inspected: v1, submitted 2026-06-30
* Date read: 2026-07-03
* Date surfaced: 2026-07-02
* Surfaced via: Tracy in #pocket-reads
* Code: https://github.com/yale-nlp/RLMF
* Why selected in one sentence: It is directly in the uncertainty lane: post-train models so their stated uncertainty tracks their estimated internal uncertainty, then rewrite those scores into natural hedging language.

## Quick verdict

Keep. This is a serious uncertainty-expression paper, not just another "ask the model to be calibrated" prompt.

The useful move is RLMF: during GRPO, the model is not only rewarded for producing answers whose confidence scores match an estimated intrinsic-confidence signal; the learning signal is strengthened when the model can also predict how faithful its own confidence reporting was. That is a clean metacognitive hook: better self-assessment changes what gets reinforced.

The warning label is important. The paper's "intrinsic confidence" is not direct mind-reading. It is estimated from sampled-response consistency, then evaluated with judge models. That is a reasonable operational proxy, and the results are strong, but the claim should be read as "faithfulness to a measurable internal-confidence proxy," not "we solved model self-knowledge."

So: keep it. It belongs near calibration, hedging, abstention, uncertainty-aware agents, and reliability UX.

## One-paragraph overview

The paper proposes reinforcement learning with metacognitive feedback (RLMF), a GRPO-based training method for faithful calibration (FC): aligning a model's expressed uncertainty with its estimated intrinsic uncertainty. Stage 1 trains models to emit sentence-level numerical confidence scores. The reward mixes faithfulness to sampled-consistency-based intrinsic confidence, factual calibration, answer correctness, and format adherence. RLMF then modifies the advantage computation: among completions that are already above-average on the faithfulness objective, those for which the model more accurately predicts its own FC level receive a stronger learning signal. The authors also introduce metacognitive data selection, choosing both examples the model thinks it handled well and examples it thinks it handled poorly. Stage 2 rewrites calibrated numerical confidence into linguistic uncertainty using a hedge mapping derived from human-rated uncertainty phrases. Across Llama3.1-8B and Qwen3 models, the method achieves strong cMFG* scores across 10 datasets while preserving accuracy and factual calibration better than MetaFaith and Faithful Uncertainty Tuning. The paper is strongest as a training recipe for uncertainty communication, and weakest where its conclusions lean on proxy estimates and judge-based scoring.

## What problem is the paper trying to solve?

LLMs often communicate uncertainty badly. They can hallucinate confidently, hide uncertainty when they should hedge, or hedge in vague ways that do not correspond to what the model actually "knows" under a measurable proxy.

The paper separates two calibration notions:

* Factual calibration: confidence should match empirical correctness.
* Faithful calibration: expressed confidence should match the model's intrinsic uncertainty.

Those are not the same. A model can look factually calibrated over a dataset while still misrepresenting its own uncertainty on individual claims. The paper targets that second problem: can we make the model's stated confidence faithfully track an operational estimate of its internal confidence?

That target matters because user reliance depends on communication, not just hidden score distributions. A model that is uncertain internally but writes like a marble statue still misleads the user.

## Method

The framework has two stages.

### Stage 1: numerical faithful calibration

The model is trained to answer in sentence-confidence pairs. Each sentence is wrapped in tags and followed by a confidence score from 0.00 to 1.00.

Intrinsic confidence is estimated by sampling 20 additional responses and measuring whether each sentence in the official answer is consistent with those samples. The paper uses an NLI-style judge to score consistency. The resulting sentence-level score becomes the "gold" intrinsic confidence proxy.

The faithfulness reward is an inverted squared error between expressed confidence and this intrinsic-confidence proxy:

* high reward when the model's stated confidence matches the proxy;
* low reward when the model overstates or understates what its sampled behavior suggests.

This is paired with rewards for factual calibration, answer correctness, and output format.

### Stage 1.5: RLMF

RLMF changes the GRPO advantage, not merely the reward list.

For each sampled completion, the model is prompted to predict how well its expressed confidence matched its true internal confidence. This produces a self-judged FC score. The paper compares that predicted FC score with the actual proxy-based FC score, yielding a metacognitive score `Zg`.

Then, for completions whose faithfulness component is above the group mean, RLMF scales the faithfulness part of the advantage by `1 + Zg`. The design is deliberately conservative: metacognition boosts good faithful-calibration candidates; it does not let a poorly calibrated answer win just because the model was self-aware about being bad.

That is the paper's best idea.

### Metacognitive data selection

The authors also use model self-judgments to choose training data. The model rates how well it thinks its linguistic confidence matches internal confidence. Then the training set is built from both high-scoring and low-scoring examples.

The intuition is plausible: high-score examples teach what good self-assessment looks like, while low-score examples expose failure modes. The ablations support the combination better than only high, only low, random, or active-learning-style selection.

### Stage 2: linguistic uncertainty rewriting

The trained model emits numerical confidence. A separate rewriting stage maps those scores into natural language hedges.

The mapping uses human-rated confidence values for hedge expressions, sorted into bins. A rewriting model receives the original answer, candidate hedges matching each sentence's confidence bin, and a target style/context. Its job is to rewrite the answer while preserving factual content and inserting uncertainty language naturally.

This decoupling is elegant. Train the expensive numerical calibration once; adapt the linguistic surface later for audience, domain, or style.

## Experimental setup

Models:

* Qwen3-1.7B, Qwen3-4B, Qwen3-8B
* Llama3.1-8B-Instruct
* proprietary comparison baselines: GPT-5, Gemini-3.1-Pro, Gemini-3-Flash

Training:

* pre-SFT to teach the sentence-confidence output format;
* RLMF on 2000 metacognitively selected PopQA examples in the main setup;
* LoRA fine-tuning;
* GRPO with 32 completions per prompt;
* 20 sampled responses for intrinsic-confidence estimation;
* judge models for accuracy and consistency scoring.

Evaluation datasets:

* PopQA
* SelfAware
* SimpleQA
* HaluEval
* MMLU
* SciQ
* MATH
* UMWP
* ARC-Challenge
* SuperGLUE

Metrics:

* `cMFG*`: faithful calibration score, higher is better;
* accuracy via LLM-as-judge;
* Brier Score for factual calibration, lower is better.

The authors introduce `cMFG*` as a refinement over cMFG. It uses equal-mass bins and width weighting so models are not unfairly punished or rewarded by the shape of their intrinsic-confidence distribution.

## Main results

The headline numbers are strong.

For Llama3.1-8B-Instruct:

* base model: cMFG* 0.60, accuracy 0.31, Brier 0.33
* MetaFaith: 0.67, accuracy 0.28, Brier 0.36
* FUT: 0.66, accuracy 0.31, Brier 0.29
* standard RL: 0.77, accuracy 0.40, Brier 0.20
* RLMF: 0.84, accuracy 0.41, Brier 0.26
* RLMF plus rewriting: 0.82, accuracy 0.41, Brier 0.26

For Qwen3-8B:

* base model: cMFG* 0.54, accuracy 0.55, Brier 0.31
* MetaFaith: 0.63, accuracy 0.51, Brier 0.29
* FUT: 0.67, accuracy 0.38, Brier 0.41
* standard RL: 0.51, accuracy 0.59, Brier 0.26
* RLMF: 0.83, accuracy 0.57, Brier 0.19
* RLMF plus rewriting: 0.83, accuracy 0.57, Brier 0.19

Full appendix results extend the story to Qwen3-4B and Qwen3-1.7B:

* Qwen3-4B reaches 0.83 numerical cMFG* and 0.85 after rewriting.
* Qwen3-1.7B reaches 0.82 numerical cMFG* and 0.83 after rewriting.

The strongest comparison is not just against old baselines. The paper reports that the trained open models beat GPT-5, Gemini-3.1-Pro, and Gemini-3-Flash on cMFG* in this setup, even when those proprietary models use a metacognitive prompt. That is a useful result, though it should be read as benchmarked FC under this metric, not broad model superiority.

## Ablations

The ablations are unusually helpful.

RLMF beats standard RL. On Qwen3-8B, standard RL lands at 0.51 average cMFG*, while RLMF reaches 0.83. On Llama3.1-8B, standard RL gets 0.77 while RLMF reaches 0.84. The paper's "up to 63%" claim comes from this standard-RL comparison.

Pre-SFT matters. Without the pre-SFT format-learning stage, models generalize worse and are more brittle. For Llama3.1-8B, the full SFT + RLMF + metacognitive data selection recipe reaches 0.84, while partial versions sit lower. For Qwen3-8B, the full recipe reaches 0.83; RLMF without the same scaffolding is much weaker.

Metacognitive data selection helps. For Llama3.1-8B, random selection gives 0.80, active learning 0.79, and metacognitive selection 0.84. For Qwen3-8B, random selection gives 0.76, active learning 0.72, and metacognitive selection 0.83.

The exact RLMF design matters. Scaling only the faithfulness component for above-average-faithfulness completions works better than scaling the entire advantage or the entire group. The quadratic `Zg` formulation is also better than linear or root variants.

Reward design is fragile. The reward includes faithfulness, factual calibration, correctness, and format terms. Removing format rewards leads to malformed outputs. Removing the accuracy reward hurts task performance. Overweighting or underweighting the faithfulness term degrades cMFG*. This is not a one-line trick.

The rewriting stage mostly preserves numerical gains. Single-pass rewriting is comparable to a more fine-grained two-step approach, and Gemini-2.5-Flash-Lite, GPT-5-Mini, and Qwen3-8B all work as rewriting models in the appendix comparisons.

## Human evaluation

The paper also evaluates linguistic outputs through human preference judgments against FUT.

Reported win rates for RLMF plus rewriting over FUT:

* diversity: 98%
* naturalness: 98%
* helpfulness: 95%
* context suitability: 96%

This is believable in direction because FUT-style hedging can be repetitive and oddly templated. The paper's examples make that difference visible: the RLMF plus rewriting outputs read more like natural uncertainty communication, while FUT often sounds like it is mechanically stuffing "quite likely" and "somewhat doubtful" into every sentence.

## What is actually novel?

The novelty is not "RL for calibration" in the generic sense. The useful new pieces are:

* using self-judged task-performance quality as an advantage-scaling signal;
* applying that metacognitive signal only to above-average faithfulness completions;
* selecting training data from both high and low self-assessed performance examples;
* separating numerical faithful calibration from later linguistic rewriting;
* introducing cMFG* to reduce known binning pathologies in faithful-calibration evaluation.

The paper is best read as a careful systems-and-training paper for uncertainty communication.

## Strengths

The target is important. Faithful uncertainty expression is exactly where calibration research meets user experience.

The method is conceptually crisp. Reward good uncertainty alignment, but boost the learning signal when the model also knows that its uncertainty alignment is good.

The two-stage design is practical. Numerical calibration can be trained once; linguistic style can be adapted later.

The evaluations span more than a single QA benchmark. Training mostly on PopQA and evaluating across 10 datasets makes the generalization claim much stronger than the usual in-domain calibration story.

The ablations answer real questions. Pre-SFT, data selection, reward weights, `Zg` formulation, `k`, threshold, rewriting model, and rewriting method are all probed.

The paper preserves factual calibration and accuracy better than the obvious baselines. This matters because calibration work often buys better hedging by making answers less useful.

## Weaknesses and caveats

The biggest caveat is proxy dependence. "Intrinsic confidence" is estimated by sampled-response consistency, not observed directly. That proxy is useful, but it is not the same as privileged access to internal beliefs.

The method is judge-heavy. It relies on judge models for consistency/NLI-style intrinsic confidence estimation and accuracy scoring. That adds cost, latency, and evaluator bias.

The pipeline is expensive. RLMF uses GRPO with 32 completions per prompt, 20 sampled responses for confidence estimation, multiple GPUs, and auxiliary judge inference. This is research-grade machinery, not a lightweight production patch.

The output format is artificial during Stage 1. Pre-SFT is needed to teach sentence-confidence tags, and format rewards are essential. That is fine for training, but it reinforces that this is a carefully engineered pipeline.

The claim of metacognition should stay bounded. The authors explicitly note that improved self-assessment of performance is not equivalent to broad metacognitive awareness. Good. Keep that boundary.

The proprietary-model comparison is metric-specific. Beating GPT-5 or Gemini on cMFG* under these prompts does not mean these smaller models are generally better, only that the trained systems score better on this faithful-calibration benchmark.

The human evaluation is useful but narrow. It compares linguistic outputs mostly against FUT-style baselines, and no compensation was provided due to small scale. Strong signal, not definitive user-study closure.

## Relation to other Pocket Reads notes

This pairs naturally with Agent-BRACE-style verbalized uncertainty, but from a different angle. Agent-BRACE uses uncertainty labels as part of an explicit belief state for action. RLMF trains the model's surface uncertainty to track a proxy for internal confidence.

It also sits next to process-supervision papers like ProFact. In both cases, the theme is that final correctness is too sparse. You need stage-level or self-assessment signals that teach the model how to behave, not merely whether it got the final answer right.

For agent systems, this paper is relevant wherever outputs need calibrated user trust: research agents, medical/legal/science assistants, search agents, long-form explanation systems, and anything that should know when to say "I might be wrong."

## Ideas worth stealing

Separate numerical uncertainty training from linguistic uncertainty rendering. That is the cleanest design pattern in the paper.

Treat metacognitive self-assessment as a ranking modifier, not an unconstrained reward. This reduces obvious reward-hacking routes.

Use both high-confidence-success and low-confidence-failure examples in training. The combination seems to produce better coverage across intrinsic-confidence bins.

Evaluate faithful calibration separately from factual calibration. A model can be factual-calibrated and still misleading in how it describes its uncertainty.

Make uncertainty language style-aware. The same confidence level should not be phrased identically in a medical summary, a casual answer, and a mathematical derivation.

Keep the proxy boundary visible. Sampled consistency is a useful operational estimate, but it should not be laundered into mystical "true uncertainty."

## Why It Matters

This matters because uncertainty expression is one of the few alignment problems users can actually see.

A model can be brilliant and still dangerous if it cannot communicate uncertainty. Conversely, a model that hedges constantly without grounding that hedging in anything real is just wearing a lab coat made of fog.

RLMF is a credible route between those failures. It trains the model to express confidence in a way that matches its own sampled behavior, then turns those scores into natural language that humans can use. That makes it useful for agent reliability, especially in workflows where the model is producing advice, research claims, plans, or evidence summaries rather than just answers.

## Final Decision

Keep. This is one of the better 2026 papers in the faithful uncertainty-expression lane.

Cite it for RLMF, metacognitive advantage scaling, faithful calibration, cMFG*, metacognitive data selection, and numerical-to-linguistic confidence rewriting.

Do not overclaim it. It does not solve metacognition, and it does not directly observe intrinsic uncertainty. It builds a strong, carefully evaluated training pipeline around a sampled-consistency proxy. That is still valuable. Just keep the epistemic plumbing visible.
