# Modality Forcing for Scalable Spatial Generation

## Basic info

* Title: Modality Forcing for Scalable Spatial Generation
* Authors: Bardienus Pieter Duisterhof, Deva Ramanan, Jeffrey Ichnowski, Justin Johnson, Keunhong Park
* Year: 2026
* Venue / source: arXiv
* Link: https://arxiv.org/abs/2606.13676
* PDF: https://arxiv.org/pdf/2606.13676
* Project page: https://modality-forcing.github.io/
* Date read: 2026-07-11
* Date surfaced: 2026-07-09
* Surfaced via: Tracy in #pocket-reads via arXiv link
* Access: Full arXiv PDF inspected.
* Why selected in one sentence: It gives a scalable recipe for turning text-to-image diffusion transformers into joint RGB-depth generators by assigning separate noise levels per modality.

## Quick verdict

* Highly relevant

This is one of the stronger vision papers in the batch. The central idea is simple: give RGB and depth separate diffusion timesteps, so either modality can be clean conditioning or noisy target. The paper is useful because it combines an elegant formulation with a scaling study and strong depth results, especially against other joint RGB-depth generative models. The main caveat is that the strongest model leans on a large FLUX.2-klein-9B backbone, ensembles, and a big mixed depth dataset, so the method is clean but the headline quality is not free.

## One-paragraph overview

Modality Forcing post-trains a text-to-image DiT to model the joint distribution over images and depth. RGB is represented in a pretrained image VAE latent space; depth is tokenized in pixel space so the model can train on sparse real-world depth annotations. During training, RGB and depth receive independent noise levels. If both are noisy, the model learns joint RGB-depth generation; if RGB is clean and depth is noisy, it learns image-to-depth; if depth is clean and RGB is noisy, it learns depth-to-image. The same model supports all three inference modes by changing per-modality timesteps. The paper also trains a controlled family of T2I models from 370M to 3.3B parameters and shows depth improves with model size and T2I pretraining data, supporting the claim that image generation learns scalable spatial priors.

## Model definition

### Inputs
A text prompt, RGB image latents, depth tokens, and separate RGB/depth noise levels. Depending on inference mode, RGB or depth can be clean conditioning, noisy target, or both noisy for joint generation.

### Outputs
The model can output:

* a jointly generated RGB image and depth map from text;
* a depth map conditioned on an input image and text;
* an RGB image conditioned on an input depth map and text.

### Training objective (loss)
The base T2I models use flow matching with clean-sample prediction. Modality Forcing trains with separate losses for RGB and depth under per-modality noise schedules. The paper also adds self-distillation for the RGB stream: a frozen original T2I checkpoint predicts RGB velocity, and the student is penalized for drifting too far from it, especially when depth is fully noised and therefore uninformative.

### Architecture / parameterization
The model is a DiT-style text-to-image transformer adapted for RGB-depth joint modeling. RGB uses a frozen pretrained VAE. Depth is denoised directly in pixel space through a depth tokenizer and detokenizer, allowing sparse supervision. RGB and depth have separate timestep embedders, with lightweight cross-stream mixing so each stream can see the other modality's noise level. The strongest experiments post-train FLUX.2-klein-9B; the scaling study trains smaller DiTs from scratch.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
The paper wants a scalable way to extract spatial perception from text-to-image models. T2I systems clearly learn some geometry because photorealistic images require perspective, object size, and scene layout. But prior diffusion-based depth and RGB-depth methods often represent depth as images, require dense depth supervision, or add adapters/branches that complicate scaling.

Modality Forcing tries to make a single generative model support image-to-depth, depth-to-image, and joint RGB-depth generation without separate specialist systems.

### 2. What is the method?
The method assigns an independent noise level to each modality. A clean modality at timestep 0 acts as conditioning. A fully noised modality is the target to generate. Intermediate values allow partial conditioning.

Training samples three regimes:

* joint RGB-depth: both RGB and depth have sampled noise levels;
* image-to-depth: RGB is fixed clean while depth is noised;
* depth-to-image: depth is fixed clean while RGB is noised.

Depth is tokenized in pixel space rather than through the image VAE, which lets the system learn from sparse depth maps. The model uses per-modality timestep conditioning and a self-distillation loss to preserve the original T2I prior.

### 3. What is the method motivation?
The motivation is that modality should be treated like a controllable denoising axis. Teacher forcing fixes past tokens and predicts future tokens; diffusion forcing can vary noise per token; Modality Forcing varies noise per modality.

This turns conditional generation into a schedule choice instead of an architectural choice. The same weights can be used for RGB-to-depth, depth-to-RGB, or joint generation.

### 4. What data does it use?
For depth post-training, the paper uses about 17M frames across roughly 58K scenes from twelve real and synthetic datasets, including Argoverse 2, Aria Project Sim, ARKitScenes, BlendedMVS, FoundationStereo, Hypersim, MegaDepth, ParallelDomain, ScanNet v2, TartanAir v2, Taskonomy, and Waymo Open.

The scaling study trains T2I models from scratch at 370M, 800M, and 3.3B parameters, with T2I pretraining data sizes from none to 1.92B images. The strongest model applies Modality Forcing to FLUX.2-klein-9B.

### 5. How is it evaluated?
The paper evaluates:

* scaling of depth accuracy with T2I model size and image pretraining data;
* affine-invariant monocular depth estimation on NYUv2, KITTI, ETH3D, ScanNet, and DIODE;
* joint RGB-depth generation qualitatively against JointDiT;
* depth-to-image generation on OpenImages 6K using FID and a depth-following proxy;
* denoising trajectory ablations for partial depth conditioning and RGB-first versus depth-first generation.

### 6. What are the main results?
The controlled scaling study shows that depth improves with both model size and T2I pretraining size. This is the paper's strongest conceptual evidence: T2I pretraining appears to provide spatial priors that transfer to depth.

With FLUX.2-klein-9B, Modality Forcing strongly outperforms prior joint image-depth generators on affine-invariant depth. It reports AbsRel / delta1 of 2.52 / 98.9 on NYUv2, 5.37 / 96.6 on KITTI, 2.37 / 99.3 on ETH3D, 2.32 / 98.9 on ScanNet, and 3.35 / 97.7 on DIODE. These numbers beat JointNet, UniCon, and JointDiT by large margins, and are competitive with top specialist depth models such as MoGe-2.

For depth-to-image, it achieves the best FID in the table, 11.41, but its depth-following proxy AbsRel is 9.26, worse than JointDiT's 6.99. So the model produces attractive images but does not always obey depth as tightly as the best depth-conditioned baseline.

The denoising trajectory study finds that denoising RGB first improves consistency between generated image and generated depth, suggesting RGB latent space can act like a useful scratchpad before depth is finalized.

### 7. What is actually novel?
The novelty is using per-modality noise schedules as the control interface for joint and conditional RGB-depth generation. The idea is simple, but powerful: the modality's timestep determines whether it is condition, target, or partially constrained.

The pixel-space depth tokenizer is also important. It avoids forcing sparse depth into an image VAE that expects dense image-like channels.

The scaling study is a useful contribution because it tests whether stronger T2I pretraining actually improves spatial prediction rather than merely assuming it.

### 8. What are the strengths?
The formulation is clean and unifying. One model supports I2D, D2I, and joint generation.

The method can train on sparse real-world depth, which is a practical advantage over dense-only joint RGB-depth recipes.

The results are strong, especially against other joint generative models.

The scaling evidence is meaningful: larger and better-pretrained T2I models produce better depth after the same recipe.

The paper is honest about limitations in D2I depth adherence and about the scaling study not being a full scaling law.

### 9. What are the weaknesses, limitations, or red flags?
The strongest numbers depend on a very capable 9B T2I backbone and a large mixed dataset. The recipe is simple, but the quality depends on the base model and data scale.

The ScanNet result is partially confounded because ScanNet appears in the training mixture.

D2I follows depth less tightly than JointDiT by the paper's own proxy, even though generated images have better FID.

The method currently centers on depth. It is plausible for other spatial modalities, but not proven at the same level.

The scaling study reaches 3.3B parameters and 1.92B pretraining images, which is impressive but still not enough to claim a precise scaling law.

### 10. What challenges or open problems remain?
Metric depth remains open. The reported main setup is affine-invariant, so absolute scale and camera geometry are not fully solved.

The method needs broader tests on other spatial modalities: normals, point maps, occupancy, meshes, optical flow, and semantic maps.

Depth-conditioned image generation needs tighter controllability without losing image quality.

Future work also needs to separate gains from architecture, data, base model, ensembling, and the modality-forcing schedule itself.

### 11. What future work naturally follows?
Scale to larger T2I backbones and more depth data to test whether the trend continues.

Extend the modality-forcing axis to additional modalities, especially normals and 3D point maps.

Add camera and metric-scale conditioning for robotics and AR use cases.

Learn or adapt denoising trajectories instead of hand-selecting RGB-first or depth-first schedules.

Measure geometry consistency in downstream 3D tasks, not only image-space depth metrics.

### 12. Why does this matter?
The paper makes a strong case that image generation can be a scalable pretraining route for spatial perception. If web-scale T2I models already learn reusable geometry, then post-training them with the right modality interface may be more efficient than building every depth or spatial model from scratch.

### 13. What ideas are steal-worthy?
Use per-modality timesteps to turn one diffusion model into several conditional generators.

Represent sparse non-image modalities outside the image VAE when the VAE would destroy supervision.

Preserve pretrained generative priors with self-distillation during spatial post-training.

Treat inference trajectory as a controllability knob, not a fixed implementation detail.

Evaluate whether better base generative models produce better perception models under a matched recipe.

### 14. Final decision
Keep.

This is a strong Pocket Reads paper. It has a clean control mechanism, good empirical backing, and an important scaling claim: T2I pretraining appears to transfer into spatial generation in a way that improves with model and data scale.

## Why It Matters

This paper is worth keeping because it gives a clean recipe for turning image generators into spatial generators. The per-modality timestep idea unifies image-to-depth, depth-to-image, and joint RGB-depth generation, while the scaling study supports the broader claim that T2I pretraining carries usable geometry.

## Final Decision

Keep.

This is the strongest vision paper in the batch. The method is clean and the evidence is good, though the best results still depend on a large FLUX.2 backbone and substantial data.
