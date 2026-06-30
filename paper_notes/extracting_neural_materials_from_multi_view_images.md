---
title: Extracting Neural Materials from Multi-view Images
slug: extracting-neural-materials-from-multi-view-images
authors: Kim Youwang, Jon Hasselgren, Peter Kocsis, Andrea Weidlich, Tae-Hyun Oh, Jacob Munkberg
year: 2026
venue: arXiv preprint
date_read: 2026-06-29
paper_url: https://arxiv.org/abs/2606.26715
pdf_url: https://arxiv.org/pdf/2606.26715
verdict: Strong but specialized
summary: NeuMatEx is a two-stage method for extracting neural material representations from multi-view images. Instead of fitting ordinary PBR maps such as base color, roughness, and metallicity, it recovers a richer neural SVBSDF representation that can model clearcoat, dust, fuzz, haze, scattering, and mixtures of layered specular effects. The first stage trains a Large Material Reconstruction Model, based on a repurposed Wan2.1 video diffusion transformer, to predict a triplane whose decoders produce initial diffuse color, neural specular latents, and per-material aleatoric uncertainty. The second stage performs differentiable inverse path tracing and optimizes only the triplane, using the predicted uncertainty to anchor confident regions while letting ambiguous regions move. The result is much better relit material appearance than PBR baselines on synthetic neural-material assets, plus plausible proof-of-concept results on real Digital Twin Catalog captures.
why_it_matters: This is a useful graphics paper because it pushes inverse rendering beyond the PBR bottleneck. If asset pipelines keep trying to squeeze layered, dusty, fuzzy, clearcoat-heavy real materials into a single-lobe PBR model, the optimizer will bake lighting and view effects into texture maps. NeuMatEx shows a plausible path toward recoverable, relightable, real-time neural materials instead.
final_decision: Keep as a strong but specialized neural material capture reference. The core idea is excellent: combine a large feed-forward material prior with uncertainty-guided differentiable path-tracing refinement. Do not treat it as a general 3D asset reconstruction system: it assumes known geometry, camera poses, and lighting, relies on a pre-existing neural material basis, and still shows artifacts on out-of-domain real captures.
tags: neural-materials, inverse-rendering, graphics, svbsdf, pbr, differentiable-rendering, material-capture, path-tracing, uncertainty, triplane, 3d-assets, relighting
---

# Extracting Neural Materials from Multi-view Images

## Basic info

* Title: Extracting Neural Materials from Multi-view Images
* Authors: Kim Youwang, Jon Hasselgren, Peter Kocsis, Andrea Weidlich, Tae-Hyun Oh, Jacob Munkberg
* Year: 2026
* Venue / source: arXiv preprint
* Link: https://arxiv.org/abs/2606.26715
* PDF: https://arxiv.org/pdf/2606.26715
* Project page: https://nvlabs.github.io/neumatex/
* Supplement: https://nvlabs.github.io/neumatex/assets/supp.pdf
* DOI: https://doi.org/10.48550/arXiv.2606.26715
* arXiv version inspected: v2, submitted 2026-06-25, revised 2026-06-26
* Date read: 2026-06-29
* Date surfaced: 2026-06-29 (via Tracy)
* Why selected in one sentence: It is a serious attempt to make inverse rendering recover neural material latents rather than forcing complex real-world appearance into PBR texture maps.

## Quick verdict

* Strong but specialized

This is a strong graphics paper, and much less generic than the title first sounds. NeuMatEx is not "make a 3D asset from a photo." It is closer to photogrammetry for neural materials: given multi-view images, known geometry, poses, and lighting, recover a relightable material representation richer than PBR. The best idea is the hybrid pipeline. A large feed-forward model gives a sane neural-material initialization and uncertainty estimate; differentiable path tracing then refines the material, with uncertainty deciding which regions should stay anchored to the prior. The main caveat is that the setup is still specialized and assumption-heavy. It is exciting for production material capture and real-time path-traced assets, not a solved casual capture system.

## One-paragraph overview

The paper introduces NeuMatEx, a pipeline for extracting spatially varying neural materials from multi-view images. Standard inverse-rendering pipelines usually recover PBR parameters like base color, roughness, and metallicity, but those are too limited for layered appearance effects such as clearcoat, dust, fuzz, haze, skin-like scattering, and mixed specular lobes. NeuMatEx instead targets a pre-trained neural material basis that represents a diffuse lobe plus neural specular latents. Because the neural material latent space is nonlinear and hard to optimize directly, the method first trains a Large Material Reconstruction Model (LMRM) to predict an initial material triplane and per-material uncertainty from 17 orbital views plus 6 canonical views. Then it runs test-time optimization with differentiable Monte Carlo path tracing, optimizing the triplane against the input images while using uncertainty-weighted regularization to prevent confident regions from drifting into lighting-baked fake materials. On synthetic held-out assets, NeuMatEx substantially beats PBR baselines in relit path-trace PSNR and material decomposition; on real Digital Twin Catalog captures, it shows plausible recovery of glossy and clearcoat-like effects.

## Model definition

### Inputs

Multi-view images of an object, corresponding mesh geometry, camera poses, and lighting information. The LMRM stage expects 17 orbital views plus 6 canonical views; for real DTC captures, the authors synthesize these preset views first and then optimize against the real photographs.

### Outputs

A spatially varying neural material:

* diffuse base color,
* neural specular latent codes,
* uncertainty estimates over material parameters,
* and a relightable asset compatible with their neural-material path tracer.

### Training objective (loss)

The LMRM is trained with a material regression loss plus a beta-NLL-style heteroscedastic uncertainty loss. The test-time optimization objective combines:

* a tonemapped photometric rendering loss between differentiable path-traced images and reference images,
* and an uncertainty-weighted material regularizer anchoring the optimized material near the LMRM prediction.

High-confidence regions are regularized strongly. High-uncertainty regions can move more freely during optimization.

### Architecture / parameterization

The feed-forward prior repurposes Wan2.1-1.3B, a video diffusion transformer, as a single-step multi-view material reconstruction model without text conditioning. It outputs triplane features, which two small MLPs decode into material parameters and log-variance uncertainty.

The neural material representation comes from prior work by Yu et al. It uses a diffuse Lambertian lobe plus a neural specular BSDF decoded from a compact 6D latent code, which compresses a richer procedural material parameter space into a real-time-renderable basis.

During test-time optimization, the triplane is updated, while the triplane material decoder and neural material decoder stay frozen.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?

PBR material extraction is too constrained for many real materials. A single GGX-like specular lobe plus base color can look fine for simple plastics or metals, but it breaks down for layered and messy material behavior: dust, clearcoat, fuzz, haze, scatter, and mixtures of these effects.

When inverse rendering is forced to explain these effects with PBR maps, it often cheats by baking lighting, view-dependent highlights, or complex specular behavior into diffuse texture. That may match the capture views, but it fails under relighting and animation.

### 2. What is the method?

NeuMatEx has two stages.

First, LMRM predicts a neural material initialization from multi-view images. It outputs a triplane that decodes to diffuse base color and neural specular latents, plus uncertainty over those material parameters.

Second, test-time optimization refines the triplane with differentiable neural-material path tracing. The photometric loss pushes rendered images toward the captures, while the uncertainty-weighted regularizer keeps the optimizer from drifting into implausible materials where the LMRM was confident.

### 3. Why is a feed-forward prior needed?

Naive optimization in the neural material latent space is brittle. The paper emphasizes that neural material latents are more expressive than PBR parameters, but that also gives the optimizer more ways to get stuck in local minima or bake lighting into the material.

The LMRM prior gives the optimizer a good starting point inside the valid material manifold. Without it, the ablations show poor decomposition and much lower material-parameter PSNR.

### 4. Why is uncertainty useful here?

The uncertainty is not decorative. It is used as a spatial/material-channel prior during test-time optimization.

If the LMRM is confident, the material should not drift much just because a specular highlight or lighting artifact can reduce image loss. If the LMRM is uncertain, the optimizer is allowed to move further to recover missing detail.

This is exactly the right use of uncertainty: not a user-facing confidence number, but a control signal for an ill-posed inverse problem.

### 5. What data does it use?

For training, the authors use a two-stage curriculum:

* PBR pre-training on large 3D shape/material datasets, so the model learns the image-to-material mapping.
* Fine-tuning on assets annotated with procedurally enhanced neural materials from Yu et al., so it learns diffuse base color plus neural specular latents.

For evaluation, they use 40 held-out synthetic neural-material meshes from Yu et al. and real objects from the Digital Twin Catalog, which includes high-quality multi-view captures, meshes, camera poses, and measured environment lighting.

### 6. How is it evaluated?

The paper evaluates:

* relit path-traced rendering quality,
* base-color material decomposition,
* neural latent reconstruction,
* qualitative relighting stability,
* ablations for parameterization, LMRM initialization, and uncertainty-guided regularization,
* and real-world capture examples.

The main quantitative metric is PSNR over held-out test meshes and orbital views.

### 7. What are the main results?

On 40 held-out synthetic neural-material assets, NeuMatEx beats the PBR baselines strongly in relit rendering:

* Hunyuan3D-2.1 single-view PBR: 24.42 PSNR path trace.
* TRELLIS.2 single-view PBR: 23.55.
* NVDiffRecMC++ multi-view PBR optimization: 26.25.
* NeuMatEx multi-view neural material: 34.78.

Base-color PSNR improves more modestly:

* Hunyuan3D-2.1: 23.01.
* TRELLIS.2: 23.95.
* NVDiffRecMC++: 24.89.
* NeuMatEx: 25.30.

The visual result matters more than the base-color number: PBR methods often bake specular effects into base color, while NeuMatEx better separates diffuse and specular components.

### 8. What do the ablations show?

The LMRM initialization is essential. Randomly initialized neural-material optimization performs badly, while LMRM initialization greatly improves both decomposition and render quality.

The triplane parameterization helps by enforcing stronger spatial coherence than naive UV texture optimization.

Uncertainty regularization improves material decomposition but can slightly reduce pure photometric render PSNR compared with unconstrained test-time optimization. That is actually a useful tradeoff: unconstrained optimization can get prettier capture-view images by baking lighting into materials. The uncertainty prior pushes toward more relightable decomposition.

In the TTO regularization ablation:

* no TTO gets 31.99 path-trace PSNR,
* TTO without regularization gets 35.51,
* TTO with predicted uncertainty gets 34.78 but better base-color and latent PSNR,
* an oracle uncertainty upper bound gets 35.05 and slightly better decomposition.

The predicted uncertainty is close enough to the oracle to be practically useful.

### 9. How fast are the recovered materials?

The paper reports a real-time path-tracing demonstration at 1080p on an RTX 5090: a tabletop scene with four neural materials runs in 3.88 ms per frame at 1 sample per pixel and 10 bounces.

That number includes neural material evaluation and path tracing, but it is still a very specific rendering setting. It is evidence that the representation is deployable in real-time rendering contexts, not that final high-quality rendering is free.

### 10. What is actually novel?

The novelty is the full extraction pipeline, not just the neural material basis.

Important pieces:

* extracting neural material latents from multi-view images rather than baking them from existing procedural node graphs,
* using a large feed-forward reconstruction prior for initialization,
* predicting uncertainty over material parameters,
* using that uncertainty to regularize differentiable path-tracing optimization,
* and showing that this beats strong PBR extraction on layered specular effects.

### 11. What are the strengths?

The paper attacks a real bottleneck in asset pipelines: PBR is convenient, but not expressive enough for many real materials.

The method uses uncertainty in a concrete way. It is not a chart bolted onto the end; it changes the optimization behavior.

The comparison to PBR is visually convincing. The paper shows the exact failure mode one would expect: PBR base color absorbs view-dependent effects because the model cannot represent them properly.

The authors are fairly clear about unfair comparisons. Hunyuan3D and TRELLIS are single-view PBR systems, while NeuMatEx is multi-view and assumption-heavy, so those baselines mainly illustrate PBR representation limits rather than a direct product bake-off.

### 12. What are the weaknesses, limitations, or red flags?

This is not a complete object reconstruction system. It assumes known geometry, camera poses, and lighting. The real-world examples use DTC captures with meshes and measured environment lighting.

The method depends on the pre-trained neural material basis. If a real material lies outside that basis, the paper shows artifacts, often reddish specular artifacts in crevices or out-of-domain regions.

The LMRM requires many structured views. For real captures, they use novel-view synthesis to generate the fixed 17+6 LMRM inputs before optimizing on all real photographs. That adds another moving part.

The quantitative comparison to single-view asset generators is not apples-to-apples. The strongest fair comparison is really NVDiffRecMC++ as a multi-view PBR inverse-rendering baseline.

The real-world section is proof-of-concept rather than a large, quantitative benchmark.

There is no obvious public code link on the project page at the time of reading, only the paper, supplement, video, and BibTeX.

### 13. What challenges or open problems remain?

The main challenge is robustness to real materials outside the current neural basis. The authors explicitly say that learning a more robust neural material model from real-world observations is an important future direction.

Other open problems:

* reducing the need for known geometry, lighting, and poses,
* improving the initial LMRM prediction quality,
* increasing spatial resolution for fine-scale material detail,
* building larger real-world neural-material capture benchmarks,
* and integrating this kind of material recovery into broader 3D asset generation pipelines.

### 14. What future work naturally follows?

Train neural material bases directly on real captured materials rather than mostly procedural/enhanced synthetic data.

Combine geometry reconstruction and material extraction more tightly, while keeping the material decomposition from collapsing into lighting bake-in.

Use uncertainty not only for optimization regularization but also for capture planning: ask for more views or lighting conditions where the material estimate is uncertain.

Adapt the idea to asset-generation systems as a post-process: generate or reconstruct geometry first, then recover a richer relightable neural material rather than emitting only PBR maps.

### 15. Why does this matter?

The graphics pipeline version of "looks good in the training view" is often "the material is lying." If the representation cannot express the real reflectance, optimization will hide the missing physics in textures. That is disastrous for relighting, animation, and reuse.

NeuMatEx matters because it attacks the representation bottleneck. It says: stop forcing rich materials through a too-small PBR keyhole, and use a neural material basis plus an uncertainty-aware optimizer to keep the decomposition honest.

### 16. What ideas are steal-worthy?

Use a strong feed-forward prior to initialize hard inverse problems, then use differentiable optimization for detail recovery.

Predict uncertainty over the latent/material parameters and use it as an optimization weight, not just a diagnostic.

Evaluate material recovery under relighting, not only original-view reconstruction.

Separate "image quality" from "decomposition quality"; a low-loss image can still be a bad material.

For ambiguous inverse problems, let uncertain regions move and keep confident regions anchored.

### 17. Final decision

Keep. This is a strong specialized reference for neural material extraction and uncertainty-guided inverse rendering. The reusable lesson is broader than graphics: when the latent space is expressive but hard to optimize, a learned prior plus calibrated uncertainty can make test-time optimization behave.

## Why It Matters

This is a useful graphics paper because it pushes inverse rendering beyond the PBR bottleneck. If asset pipelines keep trying to squeeze layered, dusty, fuzzy, clearcoat-heavy real materials into a single-lobe PBR model, the optimizer will bake lighting and view effects into texture maps. NeuMatEx shows a plausible path toward recoverable, relightable, real-time neural materials instead.

## Final Decision

Keep as a strong but specialized neural material capture reference. The core idea is excellent: combine a large feed-forward material prior with uncertainty-guided differentiable path-tracing refinement. Do not treat it as a general 3D asset reconstruction system: it assumes known geometry, camera poses, and lighting, relies on a pre-existing neural material basis, and still shows artifacts on out-of-domain real captures.
