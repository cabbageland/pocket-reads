# Colon-Bench: An Agentic Workflow for Scalable Dense Lesion Annotation in Full-Procedure Colonoscopy Videos

## Basic info

* Title: Colon-Bench: An Agentic Workflow for Scalable Dense Lesion Annotation in Full-Procedure Colonoscopy Videos
* Authors: Abdullah Hamdi et al.
* Year: 2026
* Venue / source: arXiv
* Link: https://arxiv.org/abs/2603.25645
* Project page: https://abdullahamdi.com/colon-bench
* Why selected in one sentence: It looks like one of the clearest current attempts to turn colonoscopy from a single-lesion detection niche into a broader multimodal video-understanding benchmark with dense spatial, temporal, and linguistic supervision.

## TL;DR

This paper introduces **Colon-Bench**, a new colonoscopy benchmark built through a multi-stage **agentic annotation pipeline** that combines temporal proposal generation, box tracking, AI confirmation, and clinician review. The contribution is not just “more colonoscopy labels,” but a more ambitious benchmark structure for evaluating modern multimodal video models: 528 videos, 14 lesion categories, over 300k bounding boxes, 213k segmentation masks, and 133k words of clinical descriptions, with tasks spanning lesion classification, open-vocabulary video object segmentation, and video VQA. The paper’s deeper argument is that current colonoscopy AI work has been constrained by brittle, narrow datasets focused mostly on polyps, whereas actual colonoscopy understanding requires long-horizon temporal reasoning, robustness to occlusion/noise, richer lesion taxonomies, and language-grounded interpretation. The most interesting thing here is not only the dataset scale, but the attempt to use an agentic workflow as the data-engine itself.

## What problem are they solving?

Colonoscopy is important for early cancer detection, but it is visually nasty data. Lesions are sparse, many frames are boring or obstructed, the camera moves awkwardly, blur and fluids constantly degrade visibility, and clinically meaningful structures may only appear briefly. That makes the domain hard twice over:

1. **It is hard for models** because lesion detection and understanding require temporal context and robustness to ugly video conditions.
2. **It is hard for annotators** because dense manual labeling of full-procedure videos is slow, expensive, and inconsistent.

The paper argues that this annotation bottleneck is one reason colonoscopy AI has stayed too narrow. A lot of existing datasets are strong enough for single-class polyp detection or anatomy classification, but not rich enough for evaluating modern MLLMs on video understanding, segmentation, and language-grounded reasoning.

That framing feels right. If the available datasets mostly ask “is there a polyp here?”, then of course the models and papers will mostly optimize for that.

## Main idea

The main idea is to build a **scalable dense annotation workflow** rather than rely on brute-force manual labeling. Their pipeline stages are roughly:

* temporal lesion proposals,
* bounding-box tracking across windows,
* AI-driven visual confirmation / filtering,
* human-in-the-loop final review,
* plus dense spatial and textual labeling on retained windows.

So the “agentic” part is not agentic in the overhyped sense of “autonomous scientist.” It is more like a staged orchestration pipeline where different tools/models progressively filter and enrich candidate annotations before a clinician verifies them.

That is actually the sensible use of agentic machinery here: not replacing expert judgment, but shrinking the amount of human attention needed per useful label.

## What the benchmark contains

The reported scale is substantial for this domain:

* **528 videos**
* **14 lesion categories**
* **300k+ bounding boxes**
* **213k segmentation masks**
* **133k words of clinical descriptions**
* **464k+ frames** mentioned in the contribution summary

The lesion taxonomy is broader than the usual polyp-only world, explicitly including things like **ulcers** and **bleeding**, which matters because clinical video understanding should not collapse into a single-object detection problem.

The benchmark supports several tasks:

* **binary lesion classification**
* **open-vocabulary video object segmentation (OV-VOS)**
* **video VQA**, with two difficulty tiers

That task spread is part of what makes the paper interesting. It is not only a data release; it is a proposed evaluation regime for colonoscopy-aware multimodal models.

## Why the paper matters

### 1. It broadens what “colonoscopy AI” is allowed to mean

Most prior colonoscopy benchmarks have been structurally biased toward narrow lesion detection or anatomical labeling. Colon-Bench tries to drag the field toward a richer conception: long-sequence video understanding with spatial, temporal, and textual grounding.

That is a real shift. If the benchmark sticks, it could push the literature away from endless incremental detector papers and toward more general multimodal medical video systems.

### 2. The annotation pipeline is arguably as important as the dataset

The paper is not only saying “here is a benchmark.” It is saying “here is a viable way to create more benchmarks like this without drowning in annotation cost.”

That matters because many medical-video domains have the same basic problem: experts are expensive, frames are many, and dense labels are painful. A successful semi-automated pipeline with clinician verification could generalize beyond colonoscopy.

### 3. It treats MLLMs as evaluation targets, not just generic image backbones

The benchmark is built with MLLM evaluation in mind. That means language descriptions, VQA, and open-vocabulary segmentation are not side dishes—they are part of the main benchmark design. This is important because a lot of medical AI work still assumes a small closed task format and therefore never really tests whether “general multimodal reasoning” claims survive contact with hard clinical video.

### 4. The domain is exactly where long-video reasoning should matter

Colonoscopy is a good stress test for long-horizon multimodal models because it mixes sparse relevant events, noisy frames, shifting perspectives, and clinically meaningful local details. If a video-language model claims long-context competence, this is the kind of domain where it should prove it.

## The specific interesting claims

### Dense long-procedure supervision

The paper repeatedly emphasizes that prior datasets are either small, narrow, or focused on one lesion class. Colon-Bench claims to provide dense boxes, masks, and text over longer videos and more lesion types. If true in practice, that alone makes it useful.

### OV-VOS in colonoscopy

They position this as the **first open-vocabulary video object segmentation dataset in colonoscopy** with lesion mask tracking under occlusion. That is genuinely interesting because colonoscopy scenes are full of partial visibility and unstable camera geometry. Tracking masks in that setting is a much harder and more clinically realistic problem than framewise still-image segmentation.

### MLLM evaluation surprises

The authors say MLLMs show **surprisingly high localization performance in medical domains compared to SAM-3**. That is provocative, though I would want to inspect the exact setup and baselines before turning it into a slogan. Still, if language-conditioned models are doing better than expected in lesion localization, that is worth attention.

### “Colon-skill” prompting

This is probably the most unusually contemporary part of the paper. They analyze recurring VQA error patterns from MLLMs and distill them into a structured textual guidance prompt they call **colon-skill**, which improves zero-shot performance by up to **9.7%** on many models without further training.

This is interesting for two reasons:

1. it suggests the benchmark exposes recurring domain-specific reasoning mistakes that can be partially patched through better task guidance;
2. it implicitly treats prompting not just as model interaction but as a lightweight domain adaptation layer.

That said, this is also the part I would trust least until independently replicated. Prompt-based gains are often real but annoyingly fragile.

## What I like most

The paper is sharpest when it makes a quiet but important point: **data engineering is part of model progress**. In messy real domains, benchmark construction is not just administrative plumbing. It determines what kinds of intelligence the field even bothers to measure.

Colon-Bench is useful if and because it changes the benchmark geometry:

* from short clips to long procedures,
* from one lesion type to many,
* from sparse labels to dense annotations,
* from closed detection to multimodal understanding.

That is a better target.

## What I’m skeptical about

### 1. “Agentic” can hide a lot of implementation detail

The paper’s pipeline sounds sensible, but agentic pipelines often look cleaner in diagrams than in reality. I would want to know more about failure modes, reviewer burden after filtering, inter-rater disagreement, and how much clinician time was still required per accepted example.

### 2. Benchmark richness does not automatically mean benchmark quality

Big numbers are nice, but the real question is whether the annotation quality is consistently high across lesion types, occlusions, and long temporal spans. The human verification step helps, but dataset papers always look best in aggregate.

### 3. Medical MLLM evaluation remains fragile

Even if the benchmark is better, model evaluations in specialized medical settings can be brittle: prompt wording, frame sampling, task decomposition, and answer grading all matter. I would not overread headline rankings.

### 4. Colon-skill might be a useful patch, not a deep fix

A 9.7% zero-shot improvement via structured prompting is nice, but it may mostly reflect benchmark/task alignment rather than real domain competence. Useful, yes. Evidence of robust colonoscopy reasoning, not yet.

## Relation to the bigger picture

This paper fits a broader pattern in multimodal AI and robotics/medicine alike: once generalist models arrive, the next bottleneck becomes **domain-specific evaluation infrastructure**. The hard part is no longer only “can a model reason multimodally?” but “can we build the right data and benchmark surfaces to reveal whether it actually can do that in a difficult real domain?”

Colon-Bench is best understood in that light. It is less a new model paper than an **infrastructure paper for future colonoscopy multimodal research**.

## My take

I think this is a strong and useful direction. Not because the phrase “agentic workflow” is exciting—it is often marketing mush—but because here it seems attached to an actually legitimate use case: scaling dense expert-reviewed annotation for ugly long-horizon medical video.

The most important contribution is probably not any one benchmark result. It is the claim that colonoscopy should be treated as a serious multimodal video-understanding domain with richer tasks than legacy polyp detection. That feels right and overdue.

If this benchmark gets adopted, it could help move the field from “detect obvious lesions in curated frames” toward “understand full procedures with clinically relevant temporal and linguistic grounding.” That is a much better ambition.

## Bottom line

Worth having in Pocket Reads.

Colon-Bench looks like a meaningful step toward **real colonoscopy understanding benchmarks**, not just another detector dataset. The paper’s biggest value is its combination of:

* a scalable annotation pipeline,
* richer lesion taxonomy,
* dense multimodal supervision,
* and explicit evaluation of modern MLLMs on long, noisy medical video.

Whether the exact benchmark and prompting tricks become standard is secondary. The broader move—treating colonoscopy as a multimodal long-video reasoning problem—is the right one.
