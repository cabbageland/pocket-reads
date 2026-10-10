---
title: VisionWeave: Weaving Elastic Visual Representations as a Native Capability of MLLMs
slug: visionweave-weaving-elastic-visual-representations-as-a-native-capability-of-mllms
authors: Yuan Feng, Qize Yang, Ruizhe Chen, Sibo Song, Haolin He, Muzhi Zhu, Zihan Liu, Yunfei Chu, Xize Cheng, Yuxuan Wang, Jin Xu, Xike Xie
year: 2026
venue: arXiv preprint (cs.CV, cs.AI, cs.CL)
date_read: 2026-10-09
paper_url: https://arxiv.org/abs/2610.07987
pdf_url: https://arxiv.org/pdf/2610.07987
verdict: Keep. This is a strong MLLM efficiency paper because it treats visual token budget as a learned representational choice, not just a pruning knob.
summary: VisionWeave teaches Qwen-style MLLMs to mix fine and coarse visual representations natively. A gated spatial pooler builds coarse tokens that share the same MRoPE coordinate frame as native fine tokens, while a granularity router probes ViT features at multiple depths to decide which image blocks need detail. The system is trained by three-stage self-distillation from the native model: all-coarse pooler training, differentiable soft routing, then hard mixed-granularity routing. On Qwen3.8-27B, it saves 43.0% visual tokens on average while preserving 98.9% native performance across eight benchmarks, with especially large gains over pruning baselines on GUI grounding and document-heavy inputs. The SGLang integration is the practical kicker: on LongVideoBench it reports 2.30x throughput, 54.4% lower mean TTFT, and 60.6% lower mean TPOT.
why_it_matters: The useful idea is not merely "compress visual tokens." It is preserving spatial coverage while changing representation granularity. Token pruning can delete the exact evidence a grounding or OCR task needs; VisionWeave keeps every region represented and decides whether each block deserves four native tokens or one coarse token. That is a better substrate for production MLLMs because the efficiency policy is content-adaptive, trainable, and compatible with a real serving engine.
final_decision: Keep and revisit for MLLM serving, visual-token efficiency, and adaptive representation design. Do not treat it as fully reproducible yet: training is expensive, the strongest results depend on Alibaba/Qwen-scale infrastructure, the public repo currently says model weights are unavailable, and the method is still only a two-granularity post-training retrofit.
tags: multimodal-llms, visual-token-efficiency, qwen, mrope, adaptive-computation, token-compression, visual-representations, self-distillation, sglang, serving-efficiency, document-vqa, gui-grounding, video-understanding, vision-language-models
---

# VisionWeave: Weaving Elastic Visual Representations as a Native Capability of MLLMs

## Basic info

* Title: VisionWeave: Weaving Elastic Visual Representations as a Native Capability of MLLMs
* Authors: Yuan Feng, Qize Yang, Ruizhe Chen, Sibo Song, Haolin He, Muzhi Zhu, Zihan Liu, Yunfei Chu, Xize Cheng, Yuxuan Wang, Jin Xu, Xike Xie
* Year: 2026
* Venue / source: arXiv preprint (cs.CV, cs.AI, cs.CL)
* Link: https://arxiv.org/abs/2610.07987
* PDF: https://arxiv.org/pdf/2610.07987
* DOI: https://doi.org/10.48550/arXiv.2610.07987
* arXiv version inspected: v1, submitted 2026-10-06
* Date read: 2026-10-09
* Date surfaced: 2026-10-09
* Surfaced via: Tracy via Pocket Reads command
* Code / repo: https://github.com/FFY0/VisionWeave
* Code status inspected: repository is public and contains setup/inference scaffolding; README says model weights are currently unavailable pending compliance approval.
* Why selected in one sentence: It is a serious answer to a real MLLM systems problem: keep visual detail where it matters, compress where it does not, and make that choice native to the model instead of a brittle post-hoc pruning trick.

## Quick verdict

Keep. This is a strong MLLM efficiency paper because it treats visual token budget as a learned representational choice, not just a pruning knob.

The pitch is exactly the right kind of boring-important systems intelligence: visual information is not uniformly dense, so a model should not spend the same token budget on a blank wall, a chart axis label, a GUI click target, and a long video background frame. But the paper avoids the worst version of token pruning, where "compression" means deleting patches and hoping the missing evidence was not important.

VisionWeave instead keeps the spatial field covered. For each block, it chooses between four fine-grained native tokens and one coarse token in the same MRoPE coordinate frame. That sounds modest, but it changes the failure mode. A pruning method can drop the star button in a web UI or chop up text in a form. VisionWeave can represent the same region coarsely or finely, which is much more compatible with grounding, OCR, and document tasks.

The caution is reproducibility. This is a large post-training story over Qwen3.5-4B and Qwen3.8-27B, with over 30K A100 GPU-hours for the 27B-scale run. The public repo exists, but the README says weights are not available yet. So the result is worth keeping as an architectural and serving reference, but it is not yet a drop-in open reproducibility artifact.

## One-paragraph overview

VisionWeave teaches Qwen-style MLLMs to mix fine and coarse visual representations natively. The base model already turns a ViT patch grid into fine visual tokens through Qwen's native merger. VisionWeave adds a gated spatial pooler that builds coarse tokens covering larger spatial blocks, then adds a granularity router that probes ViT features at multiple depths and decides which blocks should use coarse or fine representation at inference. The router and pooler are trained by three-stage self-distillation from the original native model: first all-coarse pooler training, then differentiable soft routing, then hard mixed-granularity routing. On Qwen3.8-27B, the default router threshold saves 43.0% visual tokens on average while preserving 98.9% native performance across eight benchmarks. The strongest evidence is not only benchmark retention, but deployment: an SGLang integration on LongVideoBench reports 2.30x throughput with 54.4% lower mean TTFT and 60.6% lower mean TPOT.

## What problem is the paper trying to solve?

Modern MLLMs pay a huge cost for visual inputs because images and video frames are encoded as dense, fixed-size patch-token sequences. Higher-resolution images, documents, GUIs, and long videos make this painful quickly.

The obvious answer is to use fewer visual tokens, but the common shortcuts are ugly:

* Downsampling saves compute but throws away fine detail.
* Token pruning can remove the exact region needed for OCR or grounding.
* Token merging often uses fixed budgets rather than content-dependent needs.
* Many pruning methods are awkward to serve because they rely on attention weights, in-LLM pruning, or implementation hooks that do not fit modern engines cleanly.

The paper's diagnosis is that visual efficiency should be a native capability of the MLLM, not a post-hoc patch. The model should learn where detail matters and where a compact representation is enough.

## Model definition

### Inputs

The model consumes the same kind of image or video visual inputs as the native Qwen MLLM, plus text context. In experiments, images use up to 4,096 native visual tokens during training, while videos use 512 native visual tokens per frame with up to 64 sampled frames.

### Outputs

The output is the same autoregressive language response as the original MLLM. VisionWeave changes the visual token sequence fed into the language model: some spatial blocks remain fine-grained, while others are represented by one coarse token.

### Architecture / parameterization

The native Qwen visual path maps ViT patch features into fine-grained tokens through a merger. VisionWeave adds two pieces.

First, the **gated spatial pooler** creates coarse-grained visual tokens. Each coarse token corresponds to a larger patch block and can replace four native fine tokens. The pooler is a learnable extension of mean pooling: it normalizes patch features, builds a shared context over a local neighborhood, computes channel-wise gates, refines values with a small MLP, and sums them.

Second, the **granularity router** decides which representation each spatial block should use. It uses one query state per block, probes ViT features at three depths (patch embeddings, middle layer, final layer), and uses local plus global cross-attention at each depth. A linear router head outputs the probability of using the coarse representation. At inference, a threshold controls whether the block uses one coarse token or four fine tokens.

The important engineering detail is positional compatibility. Coarse tokens are placed at the geometric center of the fine tokens they replace, in the same MRoPE coordinate frame. For SGLang, the authors support half-integer block-center positions by doubling coordinates and halving rotary frequencies, preserving the phases while reusing integer-indexed RoPE machinery.

### Training objective

The training is three-stage self-distillation from the native model.

1. **Stage 1: coarse-grained self-distillation.** The router is bypassed and every block uses the coarse representation. Only the pooler trains. The teacher is the frozen native model, and the student minimizes KL divergence over the teacher's top-512 vocabulary entries at each response position.

2. **Stage 2: soft-mixing self-distillation.** Only the router trains. Hard routing is replaced by a differentiable soft-mixing surrogate that interpolates fine and coarse representations while separating direction and magnitude. A small balance loss encourages a target coarse-routing fraction.

3. **Stage 3: mixed-granularity self-distillation.** The model trains on the hard-routed mixed-granularity sequences used at inference. The router receives an offline-calibrated coarse-routing bias; the pooler and LLM update, while the ViT, native merger, and router stay frozen.

This is not supervised by task labels for "which patches matter." The signal comes from preserving the native model's output distribution.

## What data does it use?

For Qwen3.8-27B, all three stages use a roughly 777K-sample mixture:

* LLaVA-OneVision: about 246K image-understanding samples
* LLaVA-Video-178K: about 281K video-understanding samples
* UGround: about 250K GUI-grounding samples

This data mixture is a good clue about the paper's actual concern. It is not trying to optimize only pretty natural-image VQA. It explicitly includes video and GUI grounding, which are exactly where naive visual token reduction can become dangerous.

## How is it evaluated?

The paper evaluates two backbone scales, Qwen3.5-4B and Qwen3.8-27B, on eight benchmarks:

* RealWorldQA for natural-image QA
* DocVQA and InfoVQA for document and infographic understanding
* ScreenSpotV2 for GUI grounding
* HallusionBench for hallucination-related visual understanding
* VideoOCR
* Video-MME
* LongVideoBench

Baselines include downsampling, FastV dagger, and VisionZip. The dagger variant of FastV selects tokens after the vision encoder so it can be evaluated more consistently in the SGLang-style setting.

They also evaluate:

* resolution and frame-budget trade-offs,
* inference-time routing-threshold control,
* ablations for the gated pooler and learned router,
* SGLang end-to-end serving throughput and latency.

## Main results

### 1. The average trade-off is strong

At the default threshold of `t = 0.5`, VisionWeave preserves near-native quality while saving substantial visual tokens.

For Qwen3.8-27B:

* Average native score: 77.65
* VisionWeave average score: 76.73
* Average relative performance loss: 1.08%
* Average token savings: 43.0%

For Qwen3.5-4B:

* Average native score: 73.25
* VisionWeave average score: 72.59
* Average relative performance loss: 0.90%
* Average token savings: 35.8%

That is the headline, but the per-task behavior matters more than the average.

### 2. The router spends tokens where the task needs them

For Qwen3.8-27B, VisionWeave saves only 16.5% on InfoVQA and 27.3% on DocVQA, but saves about 49.6% to 54.2% on the video benchmarks. That is exactly the behavior you want from an adaptive visual representation: documents and infographics keep more detail; video can often absorb more compression.

This is also where pruning baselines look bad. At a fixed 50% savings target on Qwen3.8-27B:

* FastV dagger loses 25.15% on InfoVQA and 47.54% on ScreenSpotV2.
* VisionZip loses 27.21% on InfoVQA and 47.88% on ScreenSpotV2.
* VisionWeave loses 3.40% on InfoVQA and 3.17% on ScreenSpotV2, while still saving content-adaptive token budget.

The ScreenSpotV2 result is the paper's best sanity check. If a method saves tokens by dropping click targets, it is not a good general MLLM compression method. VisionWeave's mixed granularity helps preserve spatial coverage.

### 3. Matching the savings ratio is not enough

The authors also assign FastV dagger and VisionZip the same dataset-level savings ratio that VisionWeave achieves. This controls for "maybe VisionWeave just saved fewer tokens." VisionWeave still has the best average score:

* Qwen3.5-4B: 72.59 for VisionWeave versus 72.20 for FastV dagger and 71.90 for VisionZip
* Qwen3.8-27B: 76.73 for VisionWeave versus 70.10 for FastV dagger and 70.33 for VisionZip

That gap says the value is not only the amount of compression. It is where and how the compression happens.

### 4. Serving gains are real in the reported setup

On LongVideoBench with Qwen3.8-27B in SGLang, using 2 x A100-80GB GPUs and a long-video workload, the reported serving improvements are large:

* Throughput: 0.90 to 2.07 requests/min, or 2.30x
* Mean TTFT: 169.90s to 77.54s, 54.4% lower
* P95 TTFT: 281.41s to 120.59s, 57.1% lower
* Mean TPOT: 355.64ms to 140.29ms, 60.6% lower
* P95 TPOT: 715.58ms to 289.19ms, 59.6% lower

The absolute latency is still long because this is a heavy long-video 27B setup, but the relative gain matters. The paper is not only reporting a synthetic token count reduction; it wires the method into a serving engine and measures end-to-end behavior.

### 5. The ablations support the core mechanism

Two ablations are especially useful.

The gated pooler beats a pixel-unshuffle projector after Stage 1 at 75% token savings, with improvements across all eight benchmarks.

The learned router matters beyond the savings count. When the authors shuffle routing scores within each input, preserving the same number of coarse selections but breaking the alignment to content, average scores drop by 2.31 points on Qwen3.5-4B and 5.36 points on Qwen3.8-27B. The ScreenSpotV2 drop is enormous for Qwen3.8-27B: 91.43 to 59.28. That strongly supports the claim that local allocation, not just global compression rate, is doing real work.

## What is actually novel?

The novelty is the combination:

* learned coarse visual tokens that live in the same MRoPE frame as native fine tokens,
* a router that probes ViT features at multiple depths and chooses granularity per block,
* a self-distillation schedule that implants the capability without task-specific routing labels,
* hard mixed-granularity inference with a threshold knob,
* SGLang support for block-center RoPE and mixed-granularity sequences.

Individually, none of those ideas is alien. Together, they make visual-token efficiency feel like an architectural capability rather than a patched-on heuristic.

## Why does this matter?

This paper lands because it points at a broader rule for multimodal systems: **representation density should be adaptive**.

For text, we are used to thinking about dynamic compute: longer reasoning when needed, retrieval when needed, tool use when needed. VisionWeave makes the analogous visual claim. A multimodal model should spend different representational budgets on different regions of the same image or video, because the evidence density is different.

That is especially relevant for agents and real products. GUIs, documents, charts, maps, medical images, and dashboards are not like natural-image classification. They contain small high-value details interleaved with low-value background. A method that drops tokens is risky. A method that keeps coverage while changing granularity is closer to what a production MLLM needs.

## Strengths

The central design has the right failure-mode awareness. The authors are not satisfied with average token savings; they explicitly care about tasks where deleted visual evidence is catastrophic.

The evaluation covers a useful spread: natural images, documents, infographics, GUI grounding, hallucination, video OCR, and video understanding. That makes the adaptivity claim more believable than if it were only tested on one easy VQA suite.

The serving section is unusually important. Many visual token papers stop at FLOPs or token counts. VisionWeave shows how the method fits SGLang and reports real throughput and latency changes.

The self-distillation recipe is practical in spirit. It does not require manual routing labels or a separate teacher model; the native model supervises the compressed student.

The case studies are conceptually persuasive. They show why keeping spatial coverage matters: VisionWeave may use coarse tokens for unimportant regions, but it does not leave holes where task evidence used to be.

## Weaknesses and caveats

The training cost is large. The 27B-scale run uses over 30K A100 GPU-hours, so this is not a cheap recipe for every lab.

The strongest results are tied to Qwen-style architecture and Alibaba infrastructure. The paper frames the capability broadly, but the demonstrated recipe is not yet proven across very different MLLM families.

The public repo exists, but the README says model weights are currently unavailable. That makes independent reproduction limited for now.

The method currently has only two granularities: four fine tokens or one coarse token per block. The authors note that richer multi-scale designs are future work.

The router is trained post hoc by self-distillation. That is probably the right first step, but the bigger question is whether future MLLMs should learn elastic visual representations during base pretraining rather than as a retrofit.

The benchmark set is broad but still mostly public academic tasks. It would be good to see more production-ish UI, PDF, spreadsheet, slide, map, and long-screen workflows, where visual detail allocation is even more operationally important.

## What challenges remain?

The obvious next problem is multi-scale routing. Two levels are enough to show the principle, but real inputs often need several levels: tiny text, medium UI elements, large background structure, and temporal redundancy in video.

Another challenge is routing stability under distribution shift. A router that learns from LLaVA, UGround, and video data may behave differently on medical diagrams, scientific figures, dense IDE screenshots, or weird phone captures.

Serving integration also needs to mature. The paper shows SGLang support, but production systems will care about batching variance, cache fragmentation, mixed request workloads, and interactions with speculative decoding or disaggregated serving.

Finally, there is a training question: should elastic visual representation be baked into pretraining from the start? The authors think yes eventually, and that sounds right. If the model learns visual understanding and visual economy together, the router may become less like a bolt-on efficiency head and more like part of perception.

## Steal-worthy ideas

Keep spatial coverage; change granularity instead of deleting evidence.

Use the native model as the teacher and train the compressed representation to preserve output distributions.

Probe visual features at multiple depths for routing, because low-level detail and high-level semantics both matter.

Place coarse tokens at block-center coordinates in the same positional frame as fine tokens, so the LLM does not need a separate spatial language.

Measure serving. Token count wins are not enough.

Use a threshold knob as a runtime quality-cost dial, instead of training separate models for every compression target.

## Final decision

Keep and revisit. This is one of the more compelling recent MLLM efficiency papers because it is not just trying to make the visual prefix shorter. It is trying to make visual representation density itself a learned degree of freedom.

For cabbageland purposes, the durable phrase is: **do not prune away the evidence; change its granularity**.

