---
title: Diffusion Reward Models
slug: diffusion-reward-models
authors: Xiangyang Wang, Bingxiang He, Zeyuan Liu, Jiaze Wang, Ziqing Qiao, Yuxin Zuo, Tianyu Yu, Qianyu Chen, Huan-ang Gao, Cheng Qian, Wenbin Zhang, Ran Li, Youbang Sun, Ning Ding, Yuanchun Shi, Zhiyuan Liu, Chaojun Xiao, Chun Yu
year: 2026
venue: arXiv preprint (cs.LG, cs.AI)
date_read: 2026-10-13
paper_url: https://arxiv.org/abs/2609.33803
pdf_url: https://arxiv.org/pdf/2609.33803
verdict: Keep. The paper is a serious attempt to stop pretending human preference is a single scalar.
summary: Diffusion Reward Models replaces the usual scalar reward head with a small Diffusion Transformer that samples from a conditional reward distribution p(r | x, y). A frozen LLM encoder represents the prompt-response pair, and the trainable diffusion head denoises reward vectors, supporting both 19-dimensional multi-attribute labels and pairwise preference data. The useful claim is that human feedback is not just noisy around one truth: repeated annotations often form clustered or polarized distributions, and DRM can model that shape directly enough to improve uncertainty-aware rejection, lower-confidence-bound selection, reward-axis test-time scaling, and downstream RLHF.
why_it_matters: RLHF systems often compress disagreement, uncertainty, rubric tradeoffs, and value pluralism into one reward number, then optimize hard against it. DRM gives that collapse a better alternative: keep a distribution over rewards, use the mean when a scalar is needed, but also expose variance, quantiles, and multimodality when the decision is risky.
final_decision: Keep as an alignment/reward-modeling reference. The result is not an absolute SOTA reward model and the study is still at one 8B frozen encoder and modest open data scale, but the framing is valuable and the code/checkpoints are public.
tags: reward-modeling, rlhf, diffusion-models, human-preference, preference-modeling, uncertainty, distributional-rewards, alignment, best-of-n, reward-axis-scaling, lower-confidence-bound, test-time-scaling
---

# Diffusion Reward Models

## Basic info

* Title: Diffusion Reward Models
* Authors: Xiangyang Wang, Bingxiang He, Zeyuan Liu, Jiaze Wang, Ziqing Qiao, Yuxin Zuo, Tianyu Yu, Qianyu Chen, Huan-ang Gao, Cheng Qian, Wenbin Zhang, Ran Li, Youbang Sun, Ning Ding, Yuanchun Shi, Zhiyuan Liu, Chaojun Xiao, Chun Yu
* Year: 2026
* Venue / source: arXiv preprint (cs.LG, cs.AI)
* Link: https://arxiv.org/abs/2609.33803
* PDF: https://arxiv.org/pdf/2609.33803
* DOI: https://doi.org/10.48550/arXiv.2609.33803
* arXiv version inspected: v2, last revised 2026-09-29
* Date read: 2026-10-13
* Date surfaced: 2026-10-13
* Surfaced via: Tracy via Pocket Reads command
* Code / repo: https://github.com/thunlp/DRM
* Model weights: https://huggingface.co/Teburile/DRM
* Code status inspected: repository is public; Hugging Face model page is public, Apache-2.0, and lists DRM-Multi-8B and DRM-Pref-8B checkpoints.
* Metadata note: the arXiv/PDF metadata omits Tianyu Yu and Qianyu Chen in some machine-readable fields; this note follows the v2 PDF title page.
* Why selected in one sentence: It attacks the scalar-reward bottleneck directly by asking reward models to represent the distribution of plausible human judgments, not only the average.

## Quick verdict

Keep. The paper is a serious attempt to stop pretending human preference is a single scalar.

The good idea is simple and sharp: human preference is often multi-modal in the statistical sense. Two annotators may not be random noise around one hidden gold reward. They may be applying different values, rubrics, risk tolerances, or helpfulness/harmlessness tradeoffs. Most reward models flatten all of that into one score, then RLHF optimizes hard against the flattened artifact.

DRM replaces the scalar head with a small diffusion head that samples reward vectors. That means the reward model can still return a scalar when standard RLHF or Best-of-N needs one, but it can also expose uncertainty, variance, quantiles, and multiple reward modes. The paper is strongest when it shows that those extra statistics are not decorative: uncertainty-aware rejection improves retained-example accuracy, lower-confidence-bound aggregation improves full-coverage Best-of-N ranking, reward-axis sampling improves RewardBench scores, and DRM as the training-time reward improves downstream RLHF over ArmoRM and FsfairX in the reported setup.

The caveat is scale. This is not the strongest absolute reward model in the table, and the experiments fix one 8B frozen encoder with a few hundred thousand open samples. But as a paradigm paper, it is worth keeping because it gives a concrete architecture for distributional reward modeling that is more flexible than Gaussian, categorical, or quantile heads.

## One-paragraph overview

Diffusion Reward Models recasts reward modeling as conditional density estimation over `p(r | x, y)`. A frozen LLM encoder maps the prompt-response pair to a hidden state, then a lightweight Diffusion Transformer denoises Gaussian noise into a reward vector conditioned on that state. The same head supports multi-attribute regression, where it denoises partially observed 19-dimensional reward labels with a mask, and pairwise preference learning, where it combines denoising with a Bradley-Terry objective over denoised preferred/rejected rewards. At inference, the model draws multiple reward samples with DDIM, usually 10 steps and 32 samples in the released/default setup, forming an empirical reward distribution. That distribution can be averaged into a scalar reward, used for uncertainty/rejection, turned into a lower-confidence-bound score, or sampled more heavily as a reward-axis test-time scaling knob.

## What problem is the paper trying to solve?

RLHF reward models are usually trained as if there is one stable number for each prompt-response pair. That is convenient, but it erases the structure of human preference.

The paper's argument is not just "labels are noisy." The stronger point is that disagreement can be structured. A response may be concise but cold, harmless but evasive, creative but factually risky, useful to one user and inappropriate to another. In repeated annotation data, this often appears as separated clusters or polarized ratings rather than tiny perturbations around a mean. If a reward model learns only a point estimate, it cannot distinguish:

* confident consensus,
* mild uncertainty,
* true value disagreement,
* multi-attribute tradeoff,
* unstable ranking between candidate outputs.

That distinction matters because RLHF optimization treats reward as an objective. A flattened reward can reward-hack the average, overfit the dominant rubric, or hide exactly the cases where a system should be cautious.

## Method

### Inputs

The model consumes a prompt-response pair `(x, y)`.

For multi-attribute data, the supervision is a reward vector `r` with only some annotated dimensions. The mask says which dimensions are present. For the main multi-attribute variant, the reward space has 19 dimensions from the ArmoRM aggregated corpus.

For pairwise preference data, the supervision is a chosen/rejected pair. Since there is no absolute scalar label, the paper constructs symmetric pseudo-reward targets around zero with a fixed margin, then adds a Bradley-Terry ranking loss on the denoised reward estimates.

### Architecture

DRM has two components:

* A frozen LLM encoder, using the FsfairX-LLaMA3-RM-v0.1 encoder in the main experiments.
* A trainable Diffusion Reward Head, implemented as a small Diffusion Transformer.

The encoder represents `(x, y)` with the last-token hidden state. The diffusion head receives a noisy reward vector, a diffusion timestep, and the frozen semantic hidden state, then predicts the noise. During sampling, the head denoises from Gaussian noise into reward vectors.

The useful implementation detail is cost separation. The 7.5B-scale encoder is frozen, and the trainable RewardDiT is only about 12M parameters according to the released README. The expensive text representation step can be precomputed, so the paper is not asking people to train a whole new reward LLM from scratch.

### Training objectives

For multi-attribute regression, DRM uses a masked denoising loss. Only observed reward dimensions contribute to the loss, which lets one unified reward space absorb heterogeneously labeled data.

For pairwise preference learning, DRM reconstructs denoised reward estimates for the winner and loser, applies a Bradley-Terry ranking loss, and keeps the denoising loss as an auxiliary signal. This is how the same diffusion head works for both dense attribute labels and ordinary preference pairs.

During training, the model also uses classifier-free guidance by sometimes replacing the text condition with a learned unconditional vector. At inference, this enables guided sampling.

## Main experimental setup

The paper trains two variants:

* `DRM-Multi-8B`: trained on the ArmoRM aggregated multi-attribute corpus, 569K samples over 19 attributes.
* `DRM-Pref-8B`: trained on the Tulu3 preference mixture, 273K chosen/rejected pairs.

Both use the same frozen FsfairX-LLaMA3-RM-v0.1 encoder. The diffusion head has hidden size 384, 3 blocks, 6 heads, 1000 diffusion training steps, and uses 10 DDIM inference steps, guidance 7, and 32 reward samples by default.

Evaluation covers RewardBench v2, PPE Preference, PPE Correctness, RMB Pairwise, RM-Bench, and JudgeBench. The paper compares against discriminative reward models, generative reward models, and parametric distributional reward models such as QRM and URM.

## Main results

### 1. The matched-head comparison is the cleanest win

The strongest controlled comparison holds data and encoder fixed and changes the reward head.

On the six-metric average:

* ArmoRM-Llama3-8B-v0.1: 62.3
* QRM-Llama3.1-8B-v2: 64.1
* URM-LLaMA-3.1-8B: 66.1
* DRM-Multi-8B: 66.2
* DRM-Pref-8B: 65.8

DRM-Multi improves over ArmoRM by 3.9 points under matched training data and backbone. That isolates the head as the interesting variable. It is not simply "more data" or "bigger model."

The honest caveat: Skywork-Reward-V2-Qwen3-8B is much stronger overall at 76.9, so DRM is not absolute SOTA. The paper's claim is more precise: diffusion heads are a viable and flexible distributional reward head, not that this checkpoint beats every industrial RM.

### 2. Human disagreement really is distributional

The paper inspects repeated human annotations rather than only benchmark scores.

On HelpSteer2-Disagreements:

* Helpfulness has rating range at least 2 in 43.49% of examples.
* Correctness has rating range at least 2 in 41.99% of examples.
* About a quarter of examples show low-high polarization.

On MultiPref:

* Overall preference has opposite-side judgments in 45.64% of examples.
* Overall preference shows separated clusters in 37.23% of examples.

This is the paper's philosophical backbone. If annotations often form clusters, then a scalar reward is not merely compressing noise. It is destroying structure.

### 3. DRM tracks disagreement better than point or global baselines

The authors compare DRM samples against empirical human rating distributions on HelpSteer2-Disagreements.

On helpfulness, DRM has the best Wasserstein, JS, and L1 distances among the tested baselines. The Wasserstein distance is 0.804 for DRM versus about 1.03 for the empirical prior, global Gaussian, and pointwise baseline.

On correctness, DRM also has the best Wasserstein distance, 0.846, and substantially beats the pointwise baseline on distributional shape.

They also show that DRM's multimodal-output ratio rises with human disagreement:

* Helpfulness: 37.6% at low disagreement, 55.5% when rating range is at least 2, 63.2% for polarized examples.
* Correctness: 37.6%, 54.7%, 62.0% across the same disagreement levels.

That is exactly what you want from a distributional reward model: not "always uncertain," but more multimodal where humans actually disagree.

### 4. Distributional statistics are useful decision signals

The paper tests whether the full distribution helps decisions, not only descriptions.

For selective prediction, DRM rejects the most uncertain examples first. When coverage drops from 100% to 70%:

* PPE Correctness improves by 2.81 points on average across five subtasks.
* RMB improves by 4.56 to 7.31 points across helpfulness/harmlessness and BoN/pairwise settings.

For full-coverage ranking, the paper uses lower-confidence-bound aggregation:

`LCB = mean - lambda * std`

with `lambda = 0.4`. LCB consistently improves over mean aggregation across the evaluated PPE and RMB Best-of-N settings. The gains are small, but the direction is consistent and conceptually useful: high average reward with high instability should be treated differently from high average reward with tight agreement.

### 5. DRM adds a second test-time scaling axis

Standard reward models can scale along the response axis: generate more candidate responses, score them, choose the best.

DRM adds a reward axis: for the same fixed response, draw more reward samples and get a sharper estimate of the reward distribution. On RewardBench v2:

* DRM-Multi-8B rises from 56.5 at one reward sample to 65.6 at 32 samples.
* DRM-Pref-8B rises from 64.4 to 65.7.

This is computationally expensive compared with one scalar head pass, but it gives a real knob: spend more reward-model compute on high-stakes scoring without changing the candidate response set.

### 6. Downstream RLHF improves in the small reported setup

The paper also uses DRM-Multi as the training-time reward in RLHF. Starting from Tulu3-8B-SFT and training on UltraFeedback prompts:

* Tulu3-8B-SFT: Arena-Hard v2 1.0, MT-Bench 59.4
* ArmoRM RLHF: Arena-Hard v2 1.0, MT-Bench 71.5
* FsfairX RLHF: Arena-Hard v2 1.3, MT-Bench 73.6
* DRM-Multi RLHF: Arena-Hard v2 2.0, MT-Bench 74.8

This matters because reward-model benchmark gains can be sterile. The downstream result suggests the distributional reward head can actually improve policy optimization, at least in this controlled experiment.

## What is worth stealing?

### 1. Treat reward as a distribution by default

Even if a downstream system needs one scalar, the model should not be forced to forget the distribution. Mean reward, variance, quantiles, multimodality, and pairwise overlap are different signals.

The useful design pattern is:

* sample multiple possible rewards,
* aggregate to a scalar only at the boundary,
* keep distributional statistics available for abstention, safety, and risk-sensitive ranking.

### 2. Separate representational cost from reward-head training

Freezing the encoder and training only a small distributional head is practical. It turns "build a new reward model" into "learn a richer reward readout on top of an existing reward encoder."

That is not always ideal, because the frozen encoder may limit what the head can express. But it is a smart first move for testing the reward-head hypothesis.

### 3. Use uncertainty operationally, not decoratively

The paper does not stop at calibration plots. It uses uncertainty to reject unstable decisions and LCB to rank candidates under risk. That is the right standard for uncertainty work: if it does not change a decision rule, it is probably just a chart.

### 4. Distinguish disagreement from ignorance

This is the deeper conceptual point. Some uncertainty means "the model has not learned enough." Some uncertainty means "humans genuinely disagree." A useful alignment system should not crush both into one confidence score.

DRM does not fully solve that distinction, but it gives a mechanism that can represent it more naturally than scalar heads.

## Weaknesses and caveats

### Absolute performance is not the headline

The model is competitive, not dominant. Skywork-Reward-V2-Qwen3-8B is far ahead on the average table. The paper should be read as a paradigm and architecture proposal, not as "the best reward model."

### The scaling story is incomplete

The experiments fix one 8B frozen encoder and modest open-source training data. We do not know how diffusion reward heads behave with larger encoders, larger preference corpora, better data curation, or industrial RLHF pipelines.

### Distributional samples cost inference time

The default setting uses 32 samples and 10 DDIM steps. The paper says 10 steps are enough and the head is small, but this is still heavier than a scalar head. The right deployment mode may be selective: use cheap mean scoring for routine cases, then spend reward-axis compute on contested or high-impact cases.

### Bias and reward hacking are not magically solved

DRM can still inherit biased labels, reward persuasive-but-wrong outputs, or become an optimization target for reward hacking. Modeling a richer distribution helps expose instability; it does not by itself guarantee better values or safer RL.

### Multi-modality is only useful if downstream policy respects it

If you sample a distribution and immediately average it away everywhere, the method becomes an expensive scalar head. The value appears when the system actually uses uncertainty, lower bounds, quantiles, abstention, or risk-aware selection.

## Final take

This is worth keeping because it shifts the reward-modeling question from "what score should this response get?" to "what distribution of plausible judgments does this response induce?"

That shift matters. Alignment work keeps running into value pluralism, annotator disagreement, brittle reward hacking, and hidden uncertainty, then pretending a scalar reward objective is a neutral compression. DRM is not the final answer, but it is a concrete mechanism for preserving some of that lost structure and making it usable in RLHF.

The most reusable idea is not "diffusion is cool." It is this: a reward model should expose the shape of judgment, and the optimizer should know when the shape is sharp, broad, unstable, or genuinely split.
