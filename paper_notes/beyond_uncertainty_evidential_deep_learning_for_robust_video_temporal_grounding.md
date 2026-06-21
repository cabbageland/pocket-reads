---
title: Beyond Uncertainty: Evidential Deep Learning for Robust Video Temporal Grounding
slug: beyond-uncertainty-evidential-deep-learning-for-robust-video-temporal-grounding
authors: Kaijing Ma, Haojian Huang, Jin Chen, Haodong Chen, Pengliang Ji, Xianghao Zang, Han Fang, Chao Ban, Hao Sun, Mulin Chen, Xuelong Li
year: 2024
venue: arXiv preprint (cs.CV, cs.AI)
date_read: 2026-06-20
paper_url: https://arxiv.org/abs/2408.16272
pdf_url: https://arxiv.org/pdf/2408.16272
verdict: Useful uncertainty-aware video grounding paper
summary: This paper introduces SRAM, a video temporal grounding model that tries to make temporal localization less recklessly deterministic. Standard VTG models receive an untrimmed video plus a natural-language query and return moments, highlights, or summaries, but they usually give confident-looking predictions even when the query is ambiguous, the video is noisy, or the input is out of distribution. SRAM adds two things: a two-stage cross-modal alignment pipeline with Semantic Masking Alignment and Reflective Flipped Fusion blocks, and an evidential head based on Deep Evidential Regression for start/end boundary uncertainty. The paper's most reusable contribution is the Geom-regularizer, which replaces vanilla DER's blunt error-times-evidence penalty with a line constraint that encourages low error/high evidence and high error/low evidence. SRAM is competitive on QVHighlights, TACoS, Charades-STA, and TVSum, and its qualitative OOD tests show uncertainty rising under noise, wrong text queries, infrared videos, and abstract/ambiguous prompts.
why_it_matters: For agentic video systems, the important move is not the leaderboard bump. It is giving a video grounding model a calibrated refusal/uncertainty surface instead of forcing it to localize every query. That matters for surveillance, robotics, retrieval, and multimodal agents that need to know when the video-query pair is outside their competence.
final_decision: Keep as a useful uncertainty-aware VTG reference. Cite it for DER-style uncertainty in temporal grounding, the Geom-regularizer idea, and OOD query/video stress tests. Do not treat it as a solved open-world video interface: the paper itself notes limited modality alignment from data quality/scale, and some robustness evidence is qualitative or perturbation-based rather than a clean open-world benchmark.
tags: video-temporal-grounding, video-understanding, uncertainty, evidential-deep-learning, deep-evidential-regression, OOD, multimodal-alignment, moment-retrieval, highlight-detection, video-summarization, robust-ai, SRAM
---

# Beyond Uncertainty: Evidential Deep Learning for Robust Video Temporal Grounding

## Basic info

* Title: Beyond Uncertainty: Evidential Deep Learning for Robust Video Temporal Grounding
* Authors: Kaijing Ma, Haojian Huang, Jin Chen, Haodong Chen, Pengliang Ji, Xianghao Zang, Han Fang, Chao Ban, Hao Sun, Mulin Chen, Xuelong Li
* Year: 2024
* Venue / source: arXiv preprint (cs.CV, cs.AI)
* Link: https://arxiv.org/abs/2408.16272
* PDF: https://arxiv.org/pdf/2408.16272
* HTML: https://arxiv.org/html/2408.16272v1
* DOI: https://doi.org/10.48550/arXiv.2408.16272
* Project page: https://kaijing.space/SRAM/
* Code: https://github.com/KaijingOfficial/sram_vtg
* arXiv version inspected: v1, submitted 2024-08-29
* Date read: 2026-06-20
* Date surfaced: 2026-06-20
* Surfaced via: Tracy in #pocket-reads via arXiv PDF link
* Why selected in one sentence: It asks a good systems question for video agents: can a temporal grounding model know when it should be uncertain instead of confidently localizing a bad or ambiguous query?

## Quick verdict

Useful uncertainty-aware video grounding paper

This is worth keeping because it shifts video temporal grounding from "pick the best segment no matter what" toward "localize when appropriate, express uncertainty when the video-query pair is shaky." The paper introduces SRAM, a VTG model with two-stage cross-modal alignment and a Deep Evidential Regression head for start/end boundary uncertainty. Its best idea is the Geom-regularizer: instead of vanilla DER's product of error and evidence, which can over-suppress evidence and produce misleading uncertainty, it pushes normalized error and normalized evidence toward a sensible geometric relation. The paper is not a full open-world video-agent solution. The robustness evidence is a mix of standard benchmarks, synthetic noise perturbations, bias visualizations, and qualitative adversarial cases. Still, the direction is exactly right: grounding models should have a calibrated "I don't know" mode.

## One-paragraph overview

Video Temporal Grounding (VTG) maps an untrimmed video and a text query to relevant temporal clips, highlights, or summaries. Existing VTG systems usually return deterministic boundaries, even when the query is ambiguous, the video is corrupted, or the requested concept is outside the training distribution. SRAM tries to fix this by combining better cross-modal alignment with explicit uncertainty modeling. First, Semantic Masking Alignment masks noun entities in a query and trains the model to reconstruct them from video and remaining text, encouraging video-text grounding before the main task. Second, Reflective Flipped Fusion blocks alternately treat video and text as queries/keys/values in shared cross-attention, followed by branch self-attention. Third, an evidential head models start and end boundaries through Normal-Inverse-Gamma parameters, yielding aleatoric and epistemic uncertainty estimates. The authors argue vanilla DER regularization is structurally flawed because it suppresses evidence too bluntly, so they introduce Geom-regularization to make evidence decrease as error increases. SRAM is competitive across QVHighlights, TACoS, Charades-STA, Ego4D-NLQ, and TVSum, while uncertainty visualizations and adversarial tests show higher uncertainty for temporal OOD regions, noisy embeddings, wrong text queries, infrared video, animated-domain shift, and abstract prompts.

## What problem is the paper trying to solve?

The target problem is not just temporal localization accuracy. It is overconfident temporal localization under messy open-world use.

In ordinary VTG, a user asks something like "when does the black and white cat appear?" and the model returns a segment. That works when the query and video are in distribution and the event is clear. But real inputs can break those assumptions:

- the query may reference something not in the video,
- the video may be noisy, blurry, low-light, jittery, infrared, animated, or otherwise out of distribution,
- the target concept may be ambiguous,
- annotators may disagree about exact temporal boundaries,
- and subjective prompts like "the funniest moment" may not have a crisp answer.

Conventional VTG models often still return a confident segment. SRAM's goal is to preserve localization performance while also estimating whether the prediction should be trusted.

## Model definition

### Inputs

An untrimmed video and a natural-language query.

The paper supports three VTG-style outputs:

- Moment Retrieval: start/end temporal spans for query-relevant moments.
- Highlight Detection: per-clip saliency/relevance scores.
- Video Summarization: selected clips for a concise summary.

### Outputs

SRAM outputs task predictions plus uncertainty estimates. For moment retrieval, the evidential head models the start and end boundary distributions and reports:

- prediction,
- aleatoric uncertainty,
- epistemic uncertainty.

In the intended user-facing behavior, high uncertainty means the system should avoid pretending that a dubious localization is reliable.

### Core architecture

SRAM has:

- frozen video/text encoders,
- Semantic Masking Alignment (SMA),
- Reflective Flipped Fusion (RFF) blocks,
- a task-specific VTG head,
- an MLM head used only in the first alignment stage,
- and an evidential head for uncertainty.

The two-stage training flow:

1. Mask noun entities in the query and train the model to reconstruct them using video and unmasked text.
2. Freeze the MLM head and train the VTG/evidential objective on the full query.

The RFF block alternates cross-attention directions: video attends to text and text attends to video with shared parameters, then each branch refines itself through self-attention. This is meant to progressively tighten cross-modal alignment rather than simply concatenate modalities and hope.

## Deep Evidential Regression piece

For moment boundaries, the paper treats start and end positions as Gaussian variables. The evidential head predicts Normal-Inverse-Gamma parameters for the Gaussian mean and variance. This lets it compute:

- expected prediction,
- aleatoric uncertainty from predicted observation noise,
- epistemic uncertainty from uncertainty over the mean.

That is the DER appeal: a single forward pass can output both a regression prediction and uncertainty, rather than requiring ensembles or sampling-heavy procedures.

## Geom-regularizer

The regularizer is the most transferable idea in the paper.

Vanilla DER uses an error-times-evidence regularizer. The intended behavior is reasonable: if the error is high, reduce evidence so the model is uncertain. But the authors argue the gradient only depends on error, not on current evidence. That means evidence can keep getting suppressed after it is already low enough, and batch imbalance can produce badly biased uncertainty behavior.

Geom-regularization reframes the target as a geometry problem. Normalize error and evidence, then encourage them to sit near a line where:

- low error corresponds to high evidence,
- high error corresponds to low evidence.

The Type I line regularizer constrains normalized error plus normalized evidence to be close to 1. The Type II variant adds a stricter term for extreme samples. The key practical change is that the gradient depends on both error and evidence, so suppression is adaptive instead of a blunt hammer.

## Experiments

The paper evaluates on:

- QVHighlights for moment retrieval and highlight detection,
- TACoS for cooking-scene moment retrieval,
- Charades-STA for indoor activity moment retrieval,
- Ego4D-NLQ for egocentric natural-language queries,
- TVSum for video summarization.

Backbones are frozen CLIP ViT-B/32 and SlowFast ResNet-50 features. SRAM has base and large variants with RFF hidden dimensions 512 and 1024. The default number of RFF blocks is 4. The SMA warm-up masks noun entities extracted with spaCy and usually runs at learning rate 1e-5.

## Main results

On QVHighlights test, SRAM-Large reports:

- Moment Retrieval R1@0.5: 62.3
- Moment Retrieval R1@0.7: 45.5
- mAP avg: 40.6
- Highlight Detection HIT@1: 63.0

The paper says SRAM-Large beats MomentDiff by an average of 5.72 points in moment retrieval and beats UniVTG by an average of 1.65 points in highlight detection.

On TACoS, SRAM-Base reports R@0.5 of 37.3 and R@0.7 of 19.4, above UniVTG's 35.0 and 17.4.

On Charades-STA, SRAM-Base reports R@0.5 of 60.2 and R@0.7 of 38.0, above UniVTG's 58.0 and 35.7.

On Ego4D-NLQ, the picture is weaker: SRAM-Base is not broadly better than UniVTG, though it slightly improves R@0.7. The authors note Ego4D-NLQ has long videos and ambiguous question-style text, which makes grounding harder.

On TVSum, SRAM-Base reports average mAP 84.6, above UniVTG's 81.0 and UMT's 83.1, even though UMT uses audio modality.

## Ablations

The SMA/RFF ablations support the alignment story.

Increasing SMA epochs from 0 to 50 improves mAP by about 1.5 points. In Table 4, using flipped cross-attention with 2 RFF blocks improves R1@0.5 from 54.58 to 56.13 compared with split cross-attention. Four RFF blocks reaches 58.94 R1@0.5 and 40.39 R1@0.7, while six blocks drops slightly, suggesting there is a sweet spot rather than "more blocks forever."

For the evidential component, the appendix defines Error-Uncertainty Consistency Measure (EUCM), lower is better. On QVHighlights, Geom regularization improves EUCM versus NLL-only and vanilla DER regularization for both aleatoric and epistemic uncertainty. The authors also warn that vanilla regularization can have higher entropy while encoding misleading uncertainty, which is exactly the kind of metric trap that makes uncertainty papers annoying.

## OOD and uncertainty behavior

The qualitative uncertainty section is where the paper is most interesting.

The authors visualize temporal dataset bias in QVHighlights: some start/end regions are almost absent from the training distribution. They argue these temporal OOD regions should have higher epistemic uncertainty. Without DER, uncertainty follows dataset bias. With only NLL, epistemic uncertainty collapses too low almost everywhere. Vanilla regularization diffuses uncertainty but does not cleanly highlight OOD regions. Geom regularization raises epistemic uncertainty in the sparse temporal regions.

They also add Gaussian noise to video embeddings, text embeddings, and both modalities. As noise increases, epistemic uncertainty shifts upward, with the strongest effect when both modalities are corrupted.

The case studies are intuitive:

- plane versus bird query mismatch raises uncertainty,
- real versus animated wolf video exposes domain shift,
- infrared thermal video gets very high uncertainty,
- abstract "funniest moment" style queries get high uncertainty compared with simple object/action queries.

This is the behavior a video assistant should have. It should not always return a timestamp just because the API requires one.

## What is actually novel?

The paper's novelty is the combination, not any one ingredient alone:

- applying DER to VTG boundary regression,
- pairing uncertainty with a competitive VTG architecture,
- adding the Geom-regularizer to fix vanilla DER behavior,
- using SMA for video-text entity reconstruction before temporal grounding,
- and testing uncertainty under temporal bias, noise, and adversarial query/video cases.

The Geom-regularizer is the idea most likely to travel beyond this exact VTG setup.

## Strengths

The paper attacks a real failure mode. VTG models are usually evaluated as if every query has a clean answer. Real video interfaces do not work that way.

It also distinguishes uncertainty sources reasonably well:

- epistemic uncertainty for knowledge gaps, OOD input, and semantic ambiguity,
- aleatoric uncertainty for annotation subjectivity and low-level feature variation.

The model remains competitive on standard metrics, which matters because uncertainty add-ons often make a system more principled but worse at the base task.

The qualitative examples are useful because they show what the user-facing behavior might actually look like: high-confidence localization when the query is plausible, high uncertainty when the query/video pair is wrong or outside the model's experience.

## Weaknesses and caveats

The paper sometimes oversells the phrase "open world." The stress tests are useful, but they are not a comprehensive open-world benchmark.

Some uncertainty evidence is visual and qualitative. The EUCM tables help, but the most compelling OOD examples are still case studies and perturbation distributions.

The paper itself admits that data quality and scale limit the modality-alignment capability. That matters: uncertainty calibration is not a substitute for actually understanding the video-query pair.

The project page has some template-like metadata, which makes the surrounding release feel a bit rough even though the paper and code repo are real.

Ego4D-NLQ results are not a clean win, which is worth remembering because long egocentric videos with ambiguous natural questions are closer to hard real use than short clean localization clips.

The method is still a supervised VTG model with frozen features and dataset-specific training. It is not yet a general video agent or a multimodal model that can robustly negotiate ambiguity with users.

## What to steal

For agentic video systems:

- Always separate "best localized segment" from "how much should we trust this localization?"
- Treat wrong or abstract queries as first-class test cases, not edge cases.
- Track aleatoric and epistemic uncertainty separately when boundaries are ambiguous.
- Evaluate uncertainty under both video corruption and text-query corruption.
- Build a user behavior where the model can say "I don't know" rather than hallucinating timestamps.

For model design:

- Use masked entity reconstruction as a cheap way to force video-text alignment before downstream grounding.
- Prefer regularizers whose gradients depend on both error and evidence; blunt evidence suppression can make uncertainty worse.
- Test temporal OOD regions created by dataset boundary bias, not just visual noise.

## Final decision

Keep.

This is a useful reference for making video grounding more trustworthy. The headline is not that SRAM solves open-world video understanding. It does not. The useful lesson is narrower and stronger: temporal grounding systems need an uncertainty surface, and DER-style evidence can be made more sensible if the regularizer explicitly couples error and evidence instead of just punishing evidence whenever error is high.
