# A Self-supervised Large View Synthesis Model

## Basic info

* Title: RayZer: A Self-supervised Large View Synthesis Model
* Authors: Hanwen Jiang, Hao Tan, Peng Wang, Haian Jin, Yue Zhao, Sai Bi, Kai Zhang, Fujun Luan, Kalyan Sunkavalli, Qixing Huang, Georgios Pavlakos
* Year: 2025
* Venue / source: arXiv preprint (cs.CV)
* Link: https://arxiv.org/abs/2505.00702
* PDF: https://arxiv.org/pdf/2505.00702
* DOI: https://doi.org/10.48550/arXiv.2505.00702
* Date read: 2026-04-09
* Date surfaced: 2026-04-09
* Surfaced via: Lulin Liu in #pocket-reads
* Why selected in one sentence: It asks a strong question for 3D vision: how far can multi-view view-synthesis models get with **zero 3D supervision**, not even camera poses?

## Quick verdict

* Strong paper, ambitious and pretty convincing

This is a good paper. RayZer tries to do something that a lot of 3D-vision systems still dodge: learn multi-view 3D understanding **without** pose labels or geometry supervision. The paper’s central move is to let the model predict its own cameras, then use those self-predicted cameras to render target views and train from photometric losses alone. That sounds risky, but the authors make it work with a carefully controlled information flow and a ray-based transformer design. The paper is strongest because it does not just claim “self-supervision is possible” — it claims self-supervision can be competitive with, or even beat, oracle-pose methods when pose annotations are noisy, which is a genuinely interesting result.

## One-paragraph overview

The paper proposes **RayZer**, a self-supervised multi-view 3D vision model that takes **unposed and uncalibrated images** and learns to recover camera parameters, reconstruct a latent scene representation, and render novel views — all without ground-truth 3D geometry or camera labels. The system first predicts camera intrinsics and poses, converts them into pixel-aligned **Plücker ray maps**, and then uses those predicted rays as conditioning for a transformer-based reconstruction stage. Training is self-supervised: the model splits input views into one subset for scene reconstruction and another subset for target-view supervision, then renders the target views using its own predicted cameras and learns via photometric and perceptual loss. The result is a feed-forward model that exhibits what the paper calls **emerging 3D awareness**, reaching view-synthesis performance comparable to or better than supervised oracle methods that require pose labels in both training and inference.

## Model definition

### Inputs
Sets of unposed, uncalibrated multi-view images, coming from videos or unordered multi-view captures.

### Outputs
Predicted camera intrinsics, per-view camera poses, a latent scene representation, and rendered novel views.

### Training objective (loss)
Self-supervised photometric training with reconstruction losses between predicted and target views, including MSE and perceptual loss, using **self-predicted cameras** rather than ground-truth pose labels.

### Architecture / parameterization
RayZer is a pure-transformer system with three main parts:
- a **camera estimator** that predicts intrinsics and relative poses,
- a conversion from predicted cameras to **Plücker ray maps**,
- a **scene reconstruction / rendering stack** that uses those rays to build a latent set scene representation and synthesize views.

The paper emphasizes that the only 3D prior is the **ray structure**, not an explicit hand-crafted 3D representation or rendering equation.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
The paper is trying to break the dependence of large-scale 3D vision models on expensive 3D supervision. Today, many strong multi-view models still need ground-truth or optimized camera poses, and often geometry labels too. That limits data scale and bakes in the noise or failures of systems like COLMAP.

### 2. What is the method?
The method is self-supervised 3D-aware autoencoding from multi-view images.

Concretely:
- input unposed images,
- predict cameras,
- convert cameras to ray maps,
- use a subset of views to infer scene representation,
- use the predicted cameras of held-out views to render those views,
- and train with photometric/perceptual losses.

The information split between reconstruction views and supervision views is important because it prevents trivial copying and encourages actual 3D disentanglement.

### 3. What is the method motivation?
The motivation is excellent. If other foundation-style models can scale on unlabeled data, 3D vision should try to do the same instead of remaining stuck behind pose-label pipelines and per-scene optimization. The authors also correctly point out that “oracle” camera labels are not always truly oracle; they are often noisy estimates themselves.

### 4. What data does it use?
The paper evaluates RayZer on **three datasets** spanning scene-level and object-level settings with different camera configurations. The main point is to test whether the self-supervised formulation works across different multi-view conditions, not just one tidy benchmark.

### 5. How is it evaluated?
The main evaluation is **novel view synthesis**, comparing RayZer against supervised “oracle” methods such as GS-LRM and LVSM. It also studies the role of noisy COLMAP annotations and shows cases where supervised methods fail because the labels they depend on are imperfect.

### 6. What are the main results?
The headline result is strong: RayZer achieves **comparable or even superior** novel view synthesis performance relative to oracle methods that use camera labels in both training and inference.

The most interesting result is the asymmetry the paper highlights:
- if supervised models rely on noisy estimated camera annotations, they can fail systematically,
- whereas RayZer’s self-supervised setup can avoid inheriting those pose-label errors directly.

That makes the paper more interesting than a mere “self-supervision almost catches up” story.

### 7. What is actually novel?
The novelty is not just “self-supervised NVS.” It is the specific combination of:
- **self-predicted cameras as training supervision anchors**,
- a controlled two-set view split for 3D-aware autoencoding,
- a **pure transformer** design with only ray-structure prior,
- and explicit camera prediction followed by ray-conditioned reconstruction.

The camera-first, reconstruction-second ordering is also a notable design choice relative to reconstruction-first alternatives.

### 8. What are the strengths?
- Tackles a genuinely important bottleneck in 3D vision.
- Clear and elegant self-supervised framing.
- The view split is a smart anti-shortcut mechanism.
- Ray conditioning gives the model just enough 3D structure without hard-coding a full rendering pipeline.
- Strong empirical story against supervised baselines.
- The argument about noisy pose labels is actually persuasive and practically relevant.

### 9. What are the weaknesses, limitations, or red flags?
- The model still has a meaningful geometric prior via rays, so “no 3D prior” would be overstating it.
- Static-scene assumptions remain important.
- Self-predicted cameras can still drift or collapse if the training setup is not carefully controlled.
- The latent scene representation is less interpretable than explicit geometry-based reconstructions.
- It is not obvious yet how well the approach extends to highly dynamic or low-overlap scenes.

### 10. What challenges or open problems remain?
Major open problems include scaling self-supervised 3D learning to more dynamic scenes, stronger uncertainty handling in self-predicted cameras, and understanding how much explicit geometry still helps versus fully latent scene modeling.

### 11. What future work naturally follows?
- Extending the self-supervised setup to dynamic 4D scenes.
- Combining this with continual self-improvement on unlabeled video.
- Better interpretability or explicit geometry extraction from the learned latent scene representation.
- Larger-scale pretraining on broad video corpora.

### 12. Why does this matter?
Because 3D vision will not really scale like language or 2D vision if every model still needs curated pose labels and geometry supervision. This paper points to a more scalable route.

## Why It Matters

The best part of the paper is not just that it removes supervision. It is that it exposes a hidden weakness in “supervised oracle” pipelines: their camera labels are often not very oracle. That makes self-supervision more than a cost-saving trick; it can be a robustness play too.

## What ideas are steal-worthy?
- Use **self-predicted cameras** as part of the learning loop instead of treating pose labels as sacred.
- Split views into reconstruction and supervision sets to force actual 3D-aware encoding.
- Use **ray structure** as a minimal geometric prior in a transformer system.
- Let camera and scene predictions regularize each other.

## Final decision
Keep.

Strong paper. Ambitious, well-motivated, and one of the more convincing arguments that large-scale 3D models can move meaningfully toward self-supervised training.
