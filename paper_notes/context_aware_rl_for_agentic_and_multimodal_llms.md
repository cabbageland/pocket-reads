---
title: Context-Aware RL for Agentic and Multimodal LLMs
slug: context-aware-rl-for-agentic-and-multimodal-llms
authors: Peiyang Xu, Bangzheng Li, Sijia Liu, Karthik R. Narasimhan, Pramod Viswanath, Prateek Mittal, Xingyu Fu
year: 2026
venue: arXiv preprint (cs.CL, cs.CV)
date_read: 2026-06-23
paper_url: https://arxiv.org/abs/2606.17053
pdf_url: https://arxiv.org/pdf/2606.17053
verdict: Strong auxiliary-objective idea, still scale-limited
summary: ContextRL targets a specific failure mode in agentic and multimodal LLMs: the model has the decisive evidence somewhere in the supplied context, but its final answer is not actually grounded in that evidence. The paper adds a context-selection auxiliary loss to GRPO. Given a query, an answer, and two highly similar contexts, the model is trained to choose which context supports the answer. For coding agents, the contexts are mined SWE-smith trajectories sharing repo, commit, file, and function; for multimodal reasoning, they are image pairs built by localized generative editing or similarity retrieval. Across five long-horizon benchmarks and 12 VQA-style benchmarks, the paper reports consistent gains over standard GRPO. The important control is that simply using the same contrastive examples as SFT or outcome-RL data does not reproduce the gains, and can collapse long-horizon agent behavior.
why_it_matters: This is a clean reminder that outcome rewards do not necessarily teach evidence use. For agents and VLMs, a correct final answer can hide a brittle or shortcut-based relationship to context. ContextRL gives a cheap process-level signal: ask the policy to identify the context that makes a fixed query-answer pair true, while preserving the main on-policy RL loop. That pattern is useful beyond this exact paper for tool traces, browser histories, code edits, visual grounding, retrieval-augmented QA, and any workflow where the important question is not only "was the answer right?" but "did the model use the right evidence?"
final_decision: Keep. Cite it for context grounding as an auxiliary RL objective and for the warning that contrastive data alone is not enough. Do not overclaim broad generality yet: experiments are under 10B parameters, mostly Qwen-family models, and the contrastive data construction depends on strong foundation-model filtering plus expensive generation.
tags: reinforcement-learning, llm-agents, multimodal-llms, grpo, context-grounding, contrastive-learning, evidence-use, coding-agents, vqa, post-training, process-supervision, tool-use
---

# Context-Aware RL for Agentic and Multimodal LLMs

## Basic info

* Title: Context-Aware RL for Agentic and Multimodal LLMs
* Authors: Peiyang Xu, Bangzheng Li, Sijia Liu, Karthik R. Narasimhan, Pramod Viswanath, Prateek Mittal, Xingyu Fu
* Year: 2026
* Venue / source: arXiv preprint (cs.CL, cs.CV)
* Link: https://arxiv.org/abs/2606.17053
* PDF: https://arxiv.org/pdf/2606.17053
* HTML: https://arxiv.org/html/2606.17053v1
* DOI: https://doi.org/10.48550/arXiv.2606.17053
* Project page: https://xupy2003.github.io/ContextRL_Website/
* Code: https://github.com/xupy2003/ContextAwareRL
* Model collection: https://huggingface.co/collections/xupy21/contextrl-models
* Dataset collection: https://huggingface.co/collections/xupy21/contextrl-datasets
* arXiv version inspected: v1, submitted 2026-06-15
* Date read: 2026-06-23
* Date surfaced: 2026-06-23
* Surfaced via: Tracy in #pocket-reads via arXiv PDF
* Why selected in one sentence: It proposes a simple post-training signal for making agents and VLMs identify the context that actually supports their answer.

## Quick verdict

Strong auxiliary-objective idea, still scale-limited

This is worth keeping because it targets a real hole in current RL post-training. Standard outcome rewards can make a model better at producing correct answers without making it reliably more faithful to the evidence in the prompt, tool trace, codebase, or image. ContextRL adds a small but pointed process-level objective: hold the query and answer fixed, show two similar contexts, and train the model to choose the context that supports that answer. The good part is not merely "contrastive data helps." The paper explicitly tests that story and finds that using the same contrastive examples as normal SFT or outcome-RL data mostly fails, and in long-horizon agents SFT can wreck the policy. The caveat is that the evidence is still bounded: models are under 10B parameters, mostly from the Qwen family, and the data pipeline leans on expensive, strong-model filtering.

## One-paragraph overview

ContextRL is a GRPO-compatible post-training method for improving evidence grounding in agentic and multimodal LLMs. The paper starts from the observation that models often miss a decisive but sparse piece of context: a line in a tool trace, a variable definition in a code edit trajectory, or a small visual cue in an image. It builds contrastive context pairs in two settings. For agentic coding, the contexts are two similar trajectories mined from SWE-smith, constrained to share repository, commit, modified file, and target function or class, with patch contents masked to prevent leakage. For multimodal reasoning, the contexts are image pairs generated either by localized image editing or by similarity retrieval over structured images. During training, GRPO still optimizes the main task reward, but an auxiliary context-awareness loss trains the policy to select the supporting context for a fixed query-answer pair. The paper reports gains over standard GRPO on five long-horizon benchmarks and 12 visual reasoning benchmarks. Its strongest mechanistic claim is that direct data augmentation with the same contrastive examples does not work: DA-SFT learns selection but disrupts agent behavior, while DA-RL provides too sparse a signal.

## What problem is the paper trying to solve?

The target failure is "context unawareness": the relevant evidence is present, but the model does not ground its prediction in it.

That shows up in two places:

- In agentic coding, the model may inspect files and tool outputs but make an edit that violates nearby code state or an earlier observation.
- In multimodal reasoning, the model may produce a plausible answer while missing the exact visual detail that determines the answer.

This is not the same as ordinary reasoning weakness. A model can be strong on standard benchmarks and still fail when the answer depends on one small contextual distinction. The authors diagnose this with a contrastive context probe: given a query, a candidate answer, and two similar contexts, choose which context supports the answer. In their probe, large proprietary models do well, while the open-source Qwen models they test sit much closer to random choice despite decent standard benchmark performance.

## Core idea

Outcome rewards say whether the answer worked. ContextRL adds a second question: which context makes this answer true?

Each auxiliary training example is:

- a query `Q`,
- an answer `A`,
- a positive context `C+` that supports `A`,
- and a highly similar negative context `C-` that supports a different answer.

The model sees `Q`, `A`, and the two contexts as options. It is rewarded, through a supervised auxiliary loss rather than a sampled rollout reward, for assigning higher next-token logit to the option corresponding to `C+`.

This matters because the context-selection signal is dense and direct. Standard GRPO can assign a sparse pass/fail reward to the final output, but it does not tell the model which part of the context mattered. ContextRL makes evidence selection explicit while leaving the main task reward in place.

## Method

The training objective is:

- standard GRPO on task data,
- plus a weighted context-awareness loss on contrastive context pairs.

The auxiliary loss computes a margin between the next-token logits for the correct and incorrect option letters. The paper clips the margin before applying the logistic loss, which keeps already-separated examples from dominating training. The loss weight `lambda` is deliberately small because the auxiliary task should shape the policy, not replace the task objective.

For coding agents, the contrastive contexts are trajectories. The pipeline starts from 66k SWE-smith trajectories and filters aggressively:

- same repository and commit,
- same modified file,
- same target function or class,
- related but distinct issue descriptions,
- patch contents masked inside edit commands,
- automatic verification plus manual inspection for ambiguous cases.

Only 1k trajectory pairs survive, about 1.5% of the source trajectories. This is important: the method is not relying on a giant noisy preference set. It is a small, high-precision signal aimed at the exact evidence-selection behavior.

For multimodal tasks, the contexts are images. Natural-image pairs are created with localized generative editing: alter the answer-relevant region while preserving the rest of the scene. Structured images are paired by similarity retrieval because direct editing can break chart, geometry, or diagram constraints. The final multimodal set has 7k contrastive image pairs, with about 700 from generative editing and 6,300 from retrieval.

## Experiments

The long-horizon setup tests two base models:

- Qwen3-8B, a general model,
- Klear-AgentForge-8B, a coding-agent-oriented model.

Training uses 8k total instances: 7k standard SWE-Gym / SWE-Smith coding tasks for GRPO and 1k contrastive trajectory pairs for the auxiliary loss. The RL baseline gets the same total data budget, replacing the 1k contrastive pairs with more standard coding tasks.

Evaluation covers five benchmarks:

- SWE-Bench Verified,
- SWE-Bench Lite,
- LiveCodeBench v6,
- LongBench v2,
- Needle-in-a-Haystack.

The reported gains are consistent but not huge. From Qwen3-8B, ContextRL improves over RL baseline by +0.8 on SWE-Bench Verified, +1.3 on SWE-Bench Lite, +1.1 on LiveCodeBench, +1.4 on LongBench v2 overall, +2.7 on the long subset, and +0.5 on NIAH. From Klear-AgentForge-8B, the gains are larger: +2.2 Verified, +2.3 Lite, +1.7 LiveCodeBench, +2.6 LongBench overall, +4.6 on the long subset, and +5.8 NIAH.

The multimodal setup tests:

- Qwen2.5-VL-7B-Instruct,
- Qwen3-VL-8B-Instruct.

Training uses 45k total examples: 38k standard single-image QA examples for GRPO and 7k contrastive image pairs for the context-awareness loss. The RL baseline again gets the same total data budget.

Evaluation spans 12 benchmarks across math reasoning, general multimodal understanding, fine-grained visual perception, scientific reasoning, and real-world scene understanding. ContextRL improves over standard GRPO on every listed benchmark for both base models. The paper reports average gains of +2.0 points for Qwen2.5-VL-7B and +1.6 points for Qwen3-VL-8B. On Qwen2.5-VL, it also beats PAPO's average in their table, though PAPO is not a perfectly controlled baseline because it uses its own curated data and reward formulation.

## The important control: data augmentation does not explain it

The paper's strongest section is the comparison against direct data augmentation.

The authors test two ways of consuming the same contrastive examples:

- DA-SFT: supervised fine-tuning to select the correct context, followed by standard GRPO.
- DA-RL: mix contrastive examples directly into RL with binary context-selection reward.

In the agentic setting, DA-SFT is disastrous. Klear-AgentForge-8B drops from 28.0 / 21.7 on SWE-Bench Verified / Lite under the RL baseline to 6.4 / 1.3. Qwen3-8B collapses to 0.0 / 0.0. DA-RL is almost indistinguishable from the RL baseline. ContextRL is the only setup that improves both models.

In the multimodal setting, DA-SFT does not collapse, but it barely helps. DA-SFT and DA-RL sit near the RL baseline average, while ContextRL gives the consistent gains.

This distinction is the core lesson. The contrastive examples contain useful supervision, but dumping them into the training stream is the wrong interface. The auxiliary loss works because it is bounded, dense, and attached to the on-policy GRPO loop without pulling the policy distribution away from the main task format.

## What is actually novel?

The novelty is not that contrastive pairs exist, and not that RL can improve models. The useful contribution is the axis of contrast.

Most preference and contrastive methods compare two answers under one context. ContextRL compares two contexts under one query-answer pair. That turns grounding into the object of training.

This is a nice abstraction:

- fixed answer,
- competing contexts,
- choose the evidence that makes the answer valid.

It is also modality-agnostic. A "context" can be a trajectory, image, tool trace, browser history, retrieved document chunk, execution log, or codebase view. That makes the idea portable even if the exact dataset construction is not.

## Strengths

The failure mode is real and well-framed. "The model had the evidence but did not use it" is one of the most important agent reliability problems.

The auxiliary signal is simple. It does not require changing the model architecture, adding a verifier at inference time, or asking for dense human rationales.

The data controls are much better than a normal "we added another dataset and got gains" paper. The DA-SFT and DA-RL comparisons make the objective-level claim more credible.

The OOD evaluation is useful. Gains on LiveCodeBench, LongBench v2, NIAH, and standard multimodal benchmarks suggest the model is not only learning the exact constructed selection task.

The artifact discussion is more serious than usual. The authors explicitly describe filters for shortcut cues, aggressive rejection rates, and why high selection accuracy alone does not explain downstream improvement.

## Weaknesses and caveats

The scale range is narrow. All experiments use base models under 10B parameters. The paper does not show whether the method still matters for 30B, 70B, or frontier-scale models, where context selection may behave differently.

The model-family coverage is narrow. Most experiments are on Qwen-family models, plus Klear-AgentForge-8B. That is enough for a first claim, not enough for a universal one.

The data pipeline is not cheap. It uses strong foundation models for verification, Nano Banana 2 for image editing, manual inspection for uncertain cases, and H200-scale training. The method is conceptually simple, but the "clean contrastive context" dataset is work.

The paper's diagnostic probe uses future/frontier proprietary model labels as reference points. Those comparisons are interesting, but the reusable evidence is the controlled training/evaluation on open-ish models, not the exact proprietary-model gap.

The agentic setting is coding-heavy. It is plausible that the method transfers to browser agents, research agents, and tool-use traces, but the paper does not demonstrate those domains directly.

The reported gains are consistent but modest. That is not a strike against the idea; it means the claim should be "better grounding signal" rather than "solves long-context reasoning."

## What to steal

For agent training:

- Add an evidence-selection task beside outcome RL.
- Mine pairs that share most of their surface context and differ only in the decisive region.
- Mask direct answer leakage in tool traces and edit commands.
- Keep the auxiliary loss small and bounded so it shapes the policy without replacing task learning.
- Evaluate on downstream tasks that do not contain the constructed selection format.

For multimodal training:

- Use contrastive image pairs where the answer changes but most of the scene stays fixed.
- Prefer retrieval over generation when editing would violate chart, geometry, or diagram constraints.
- Treat artifact filtering as part of dataset construction, not a decorative appendix.

For evaluation:

- Test "which context supports this answer?" not only "what is the answer?"
- Separate context-selection accuracy from downstream task performance.
- Include data-augmentation baselines that consume the same contrastive examples.

## Why this matters

The paper makes a useful distinction between correctness and grounded correctness. Agentic and multimodal systems increasingly operate over large, messy contexts. In those settings, the dangerous failure is not always that the model cannot reason. It is that it reasons from the wrong evidence, then produces something locally plausible. ContextRL is a compact training pattern for pressing on that exact weakness.

## Final decision

Keep. The method is a clean reusable pattern: make the model identify the evidence that supports a fixed answer, then use that as a bounded auxiliary objective during RL post-training. Cite it when talking about context grounding, process supervision for agents, contrastive trace training, and multimodal evidence use. Keep the caveats attached: scale is under 10B, model families are narrow, and clean contrastive context data is the real cost center.
