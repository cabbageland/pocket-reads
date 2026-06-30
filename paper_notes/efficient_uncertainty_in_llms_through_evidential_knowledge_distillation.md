---
title: Efficient Uncertainty in LLMs through Evidential Knowledge Distillation
slug: efficient-uncertainty-in-llms-through-evidential-knowledge-distillation
authors: Lakshmana Sri Harsha Nemani, P. K. Srijith, Tomasz Kusmierczyk
year: 2025
venue: arXiv preprint
date_read: 2026-06-29
paper_url: https://arxiv.org/abs/2507.18366
pdf_url: https://arxiv.org/pdf/2507.18366
verdict: Useful but narrow
summary: This paper proposes a way to turn expensive uncertainty-aware LLM inference into a single forward pass for classification tasks. The teacher is a Bayesian prompt ensemble, BayesPE, that estimates predictive uncertainty by querying the same Mistral-7B-Instruct backbone with multiple semantically equivalent prompts. The student keeps the same backbone but is LoRA-tuned to imitate the teacher outputs. The authors compare a plain softmax student, which can only learn the teacher's mean predictive probabilities, with an evidential student whose head outputs Dirichlet concentration parameters. The Dirichlet head preserves a distribution over class-probability vectors, so it can express total, aleatoric, and epistemic uncertainty in one deterministic pass. On four text-classification datasets, the Dirichlet student roughly matches or beats the BayesPE teacher on accuracy and calibration while running 11x to 36x faster at inference.
why_it_matters: This is a practical bridge between Bayesian uncertainty and deployable LLM classification. The useful move is not "LLMs now know when they are wrong" in general; it is that a sampling-heavy uncertainty teacher can train a cheap student that keeps some uncertainty structure instead of collapsing everything into a softmax confidence score.
final_decision: Keep as a useful implementation reference for uncertainty-aware distillation. Do not overgeneralize it to open-ended generation or hallucination detection: the experiments are classification-only, use a 7B backbone, and show that the learned Dirichlet uncertainty can still misallocate epistemic versus aleatoric uncertainty under shift.
tags: uncertainty, llm, knowledge-distillation, evidential-learning, dirichlet, bayespe, calibration, lora, classification, ood, bayesian-prompt-ensembles
---

# Efficient Uncertainty in LLMs through Evidential Knowledge Distillation

## Basic info

* Title: Efficient Uncertainty in LLMs through Evidential Knowledge Distillation
* Authors: Lakshmana Sri Harsha Nemani, P. K. Srijith, Tomasz Kusmierczyk
* Year: 2025
* Venue / source: arXiv preprint
* Link: https://arxiv.org/abs/2507.18366
* PDF: https://arxiv.org/pdf/2507.18366
* Code: https://github.com/Harsha1969/BPE-KD
* arXiv version inspected: v1, submitted 2025-07-24
* Date read: 2026-06-29
* Date surfaced: 2026-06-29 (via Tracy)
* Why selected in one sentence: It tries to make Bayesian-style uncertainty in LLM classifiers cheap enough for deployment by distilling a multi-pass teacher into a single-pass evidential student.

## Quick verdict

* Useful but narrow

This is a useful implementation paper, especially as a companion to uncertainty-propagation-in-distillation work. The headline is attractive: train a LoRA student to mimic an uncertainty-aware BayesPE teacher, then get uncertainty in one forward pass instead of many prompt-sampled passes. The strongest idea is the Dirichlet student head, which preserves more than a mean softmax vector and gives a place to represent epistemic uncertainty. The catch is scope. This is text classification with discrete labels, not open-ended generation; the student copies a 7B backbone rather than becoming a tiny model; and the OOD results show higher uncertainty mostly through aleatoric entropy, not always through the epistemic signal one would hope for.

## One-paragraph overview

The paper tackles the inference cost of uncertainty quantification in LLMs. Bayesian and ensemble methods can estimate uncertainty by sampling model weights, adapters, prompts, or model variants, but that usually means multiple forward passes per input. Here the teacher is BayesPE, a Bayesian prompt ensemble that queries Mistral-7B-Instruct with multiple semantically equivalent prompts and learns prompt weights from validation data. The student starts from the same pretrained backbone and is fine-tuned with LoRA, using teacher output distributions as supervision. The authors compare two student heads. A softmax student learns only the teacher's weighted mean class probabilities. A Dirichlet/evidential student outputs concentration parameters over class-probability vectors, so it can represent both the expected prediction and uncertainty about that expectation. Across Amazon Reviews, SST-2, Yahoo Answers, and YouTube Comments classification, the Dirichlet student roughly matches or improves teacher accuracy, NLL, Brier score, and often ECE, while replacing multi-prompt inference with a single pass.

## Model definition

### Inputs

Text-classification examples, a set of semantically equivalent task prompts, prompt weights learned by BayesPE, and the teacher's per-prompt class-probability outputs.

### Outputs

For the softmax student: one categorical probability vector per input.

For the Dirichlet student: concentration parameters for a Dirichlet distribution over categorical probability vectors. The Dirichlet mean gives class probabilities, while the total concentration and induced entropy decomposition provide uncertainty estimates.

### Training objective (loss)

The softmax student minimizes a weighted cross-entropy against the teacher's average predictive distribution.

The Dirichlet student minimizes the negative log likelihood of the teacher's sampled predictive vectors under the student's Dirichlet distribution. This encourages the student to match not only the teacher mean but also the spread of teacher predictions across prompts.

Ground-truth labels are not used directly in the distillation objective. They are used to compute per-epoch NLL for early stopping.

### Architecture / parameterization

All experiments use Mistral Instruct 7B v0.3 as the common backbone. The student copies the teacher's base architecture and weights, freezes the backbone, and trains LoRA adapters plus an adjusted classification head. The paper calls the student compact in the parameter-efficient fine-tuning sense, not in the sense of distilling into a much smaller backbone.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?

Uncertainty-aware LLM inference is often too slow for routine use. If a method needs many prompt samples, weight samples, or ensemble members, it may be good science and bad product plumbing. The paper asks whether a student can learn the teacher's uncertainty behavior once, then serve calibrated predictions with only one forward pass.

### 2. What is the method?

Use BayesPE as an uncertainty-aware teacher. For each input, query the teacher under multiple prompts and aggregate predictions with learned prompt weights. Then fine-tune a LoRA student to imitate either:

* the teacher's mean probabilities with a softmax head, or
* the teacher's distribution over class probabilities with a Dirichlet evidential head.

At inference time, feed the input through the student once using the best teacher prompt.

### 3. What is BayesPE doing here?

BayesPE treats prompt choice as a source of epistemic uncertainty. Instead of assuming a single prompt reveals the model's stable belief, it evaluates multiple semantically equivalent prompts, learns reliability weights for them, and interprets variation across prompt-conditioned predictions as uncertainty.

This is attractive for black-box or semi-black-box settings because it only needs teacher outputs, not internal weights.

### 4. Why is softmax distillation insufficient?

A softmax student can match the teacher's average class-probability vector. That is useful for prediction, but it collapses away higher-order information: two teacher ensembles can have the same mean but very different disagreement across prompts.

The paper's useful distinction is:

* Softmax distillation transfers the mean.
* Dirichlet distillation tries to transfer the distribution around the mean.

If uncertainty matters, the second object is closer to what one wants.

### 5. What does the Dirichlet head add?

For a K-class task, the student outputs logits that are transformed into Dirichlet concentration parameters. The expected class probability is alpha_c / alpha_0, where alpha_0 is total evidence.

High concentration means the model has a sharp belief around its expected class probabilities. Low concentration means the model is unsure about the probability vector itself. This lets the model estimate total predictive entropy, aleatoric uncertainty, and epistemic uncertainty without repeated sampling.

### 6. What data does it use?

Four classification datasets:

* Amazon Reviews Polarity: 10,000 train, 5,000 test, 2 classes.
* SST-2: 10,000 train, 872 test, 2 classes.
* Yahoo Answers: 10,000 train, 5,000 test, 10 classes.
* YouTube Comments: 1,100 train, 711 test, 2 classes.

The tasks cover sentiment, topic selection, and social-media spam/content classification.

### 7. How is it evaluated?

The paper reports accuracy, expected calibration error, negative log likelihood, Brier score, out-of-distribution entropy behavior, OOD discrimination with Wasserstein distance and AUROC, prompt sensitivity, and inference time.

OOD experiments train on Amazon Reviews and test on SST-2, Yahoo Answers, and YouTube Comments.

### 8. What are the main in-domain results?

The Dirichlet student matches or beats the BayesPE teacher on the four classification datasets:

* Amazon Reviews: accuracy 0.958 versus teacher 0.959, ECE 0.011 versus 0.021, NLL 0.132 versus 0.160.
* SST-2: accuracy 0.954 versus teacher 0.955, ECE 0.017 versus 0.029, NLL 0.142 versus 0.165.
* Yahoo Answers: accuracy 0.610 versus teacher 0.593, ECE 0.042 versus 0.194, NLL 1.385 versus 2.173.
* YouTube Comments: accuracy 0.900 versus teacher 0.875, Brier 0.079 versus 0.091, but ECE is worse at 0.097 versus teacher 0.031.

The softmax student is competitive, but the Dirichlet head is usually better on NLL, Brier, and calibration. YouTube is the main exception: softmax gets much lower ECE, though with slightly lower accuracy and a worse Brier score.

### 9. What are the OOD results?

The Dirichlet student raises total predictive entropy more strongly under distribution shift than BayesPE or softmax. For example, when trained on Amazon and evaluated on Yahoo Answers, total entropy is 2.156 nats for Dirichlet versus 0.525 for BayesPE and 0.566 for softmax.

For OOD detection, the Dirichlet student gets strong AUROC numbers in the paper's plots, including 0.96 total-entropy AUROC and 0.90 epistemic-uncertainty AUROC for Amazon versus YouTube.

The important caveat: the paper says the trained Dirichlet model's increased uncertainty is predominantly aleatoric rather than epistemic in some OOD settings. That means it detects "this input is shaky" better than it cleanly identifies "the model does not know because this is out of distribution."

### 10. How much faster is it?

The speedup is the clean operational win. The Dirichlet student uses one forward pass, while BayesPE needs one pass per prompt.

Reported inference-time speedups:

* Amazon Reviews: 17x.
* SST-2: 14x.
* Yahoo Answers: 36x.
* YouTube Comments: 11x.

The softmax student has essentially the same inference time as the Dirichlet student because the only difference is the final output head.

### 11. What is actually novel?

The novelty is not LoRA, not BayesPE, and not evidential learning by themselves. The useful contribution is putting them together as a distillation pipeline for LLM classifiers:

* multi-pass uncertainty-aware prompt ensemble as teacher,
* single-pass LoRA student,
* Dirichlet output head to preserve uncertainty structure,
* direct comparison against mean-only softmax distillation.

The paper's best claim is modest but valuable: evidential distillation can transfer enough uncertainty behavior to make single-pass deployment plausible.

### 12. What are the strengths?

The method is practical. It uses teacher outputs, so it can work even when internal teacher weights are unavailable.

It separates the central tradeoff cleanly: teacher sampling gives better uncertainty but costs many passes; distillation amortizes that cost into training.

The softmax baseline is the right comparison because it tests whether the Dirichlet head adds more than ordinary probability matching.

The paper reports both calibration and runtime, which is exactly the axis that matters for deploying uncertainty rather than just admiring it.

### 13. What are the weaknesses, limitations, or red flags?

The experiments are classification-only. This does not solve uncertainty for open-ended generation, multi-step reasoning, tool use, or factual hallucination.

The student is not a small model in the usual compression sense. It shares the Mistral-7B backbone and gains efficiency mostly by replacing multi-prompt inference with one prompt plus LoRA adapters.

The teacher is BayesPE, so the uncertainty being distilled is partly prompt sensitivity. That is useful, but prompt disagreement is not the same as all epistemic uncertainty.

The OOD story is good but imperfect. The Dirichlet student raises uncertainty under shift, yet some of that increase appears as aleatoric rather than epistemic uncertainty.

The YouTube calibration result is a warning sign: the Dirichlet student has better accuracy and Brier score than the teacher, but worse ECE. The prompt analysis shows calibration can be sensitive to the prompt chosen for the student.

The paper does not settle how to choose or regularize alpha_0 generally. Its fixed-versus-learned alpha_0 experiment suggests global concentration can sometimes improve metrics, but principled selection remains future work.

### 14. What challenges or open problems remain?

The big open problem is moving beyond discrete classification. A Dirichlet over class probabilities is a clean object; uncertainty over generated explanations, answers, plans, or tool traces is much messier.

Other open questions:

* Can the method distill uncertainty from stronger or more diverse teachers?
* Does it scale to larger or sparse architectures?
* Can it distinguish epistemic from aleatoric uncertainty more reliably under shift?
* How should alpha_0 be regularized or calibrated?
* How much does prompt-template choice leak into the student's uncertainty behavior?

### 15. What future work naturally follows?

Try the same pipeline for selective prediction, abstention, retrieval-augmented classification, and verifier/reranker tasks where discrete labels are natural.

For generation, a plausible next step is not "Dirichlet over every token." Better targets might be answer-option distributions, claim-level verification labels, entailment states, or calibrated abstention heads trained from multi-sample teachers.

### 16. Why does this matter?

A lot of uncertainty methods die at inference time. They need too many samples, too many prompts, or too much model access. This paper is useful because it treats uncertainty as something you can amortize: pay the multi-pass teacher cost during distillation, then deploy a single-pass student.

### 17. What ideas are steal-worthy?

Use an expensive uncertainty teacher to generate distributional supervision, not just labels.

Do not assume softmax confidence preserves teacher uncertainty.

For discrete classification, use an evidential head when you need uncertainty about the probability vector itself.

Evaluate uncertainty distillation on calibration, OOD behavior, and runtime together. Any two of the three can fool you.

Treat prompt sensitivity as an uncertainty signal, but do not confuse it with the whole uncertainty problem.

### 18. Final decision

Keep. This is a solid practical reference for single-pass uncertainty in LLM classification. The main thing to remember is the boundary: it is an efficient classifier-UQ distillation recipe, not a general answer to generative uncertainty.

## Why It Matters

This is a practical bridge between Bayesian uncertainty and deployable LLM classification. The useful move is not "LLMs now know when they are wrong" in general; it is that a sampling-heavy uncertainty teacher can train a cheap student that keeps some uncertainty structure instead of collapsing everything into a softmax confidence score.

## Final Decision

Keep as a useful implementation reference for uncertainty-aware distillation. Do not overgeneralize it to open-ended generation or hallucination detection: the experiments are classification-only, use a 7B backbone, and show that the learned Dirichlet uncertainty can still misallocate epistemic versus aleatoric uncertainty under shift.
