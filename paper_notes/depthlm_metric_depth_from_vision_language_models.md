# DepthLM: Metric Depth From Vision Language Models

## Basic info

* Title: DepthLM: Metric Depth From Vision Language Models
* Authors: Zhipeng Cai, Ching-Feng Yeh, Hu Xu, Zhuang Liu, Gregory P. Meyer, Xinjie Lei, Changsheng Zhao, Shang-Wen Li, Vikas Chandra, Yangyang Shi
* Year: 2025
* Venue / source: arXiv preprint (cs.CV)
* Link: https://arxiv.org/abs/2509.25413
* PDF: https://arxiv.org/pdf/2509.25413.pdf
* Code: https://github.com/facebookresearch/DepthLM_Official
* Model: https://huggingface.co/facebook/DepthLM
* Date read: 2026-04-28
* Date surfaced: 2026-04-28
* Surfaced via: Tracy in #pocket-reads
* Why selected in one sentence: This is a sharp geometry paper asking whether a plain VLM can do expert-level metric depth without a dense prediction head, and the answer is more convincingly yes than I expected.

## Quick verdict

* Highly relevant

This is one of the more interesting recent papers at the VLM-plus-geometry boundary because it does not just bolt a specialized depth head onto a multimodal model and declare victory. The paper’s stronger claim is that a standard VLM, trained through text-based supervised fine-tuning with surprisingly sparse labels, can become genuinely strong at metric depth estimation if you fix two practical bottlenecks: how the model references pixels, and how mixed-camera training data creates metric-scale ambiguity. The results are not tiny. Their 3B model beats much larger generalist VLMs by a huge margin, reaches accuracy that is finally competitive with strong pure-vision depth systems, and does it without architecture or loss changes. I do not think this means “language solves geometry” in any deep philosophical sense, but it is strong evidence that the limiting factor was more about interface and data normalization than about VLM incapacity per se.

## One-paragraph overview

DepthLM turns a regular VLM into a strong metric-depth estimator using a surprisingly simple recipe. Instead of adding a dense prediction head or custom regression losses, the model is trained with text-based supervised fine-tuning on sparsely labeled pixels, using visual markers rendered directly on the image to specify the queried pixel and intrinsic-conditioned augmentation to normalize focal-length ambiguity across datasets. The authors build a mixed benchmark suite called DepthLMBench with indoor and outdoor data, show that marker-based pixel reference works much better than text coordinates, and find that SFT is more efficient than GRPO-style RL for this task. The payoff is substantial: a 3B DepthLM beats most advanced and much larger VLMs, improves over some by more than 2x in δ1 accuracy, and becomes the first VLM the paper claims is truly comparable to strong pure-vision metric-depth models. Interestingly, it also produces cleaner object boundaries with fewer flying points than typical smooth pure-vision depth predictors, even without explicit boundary regularization.

## Model definition

### Inputs
- an RGB image
- a visually rendered marker that points to the queried pixel location
- text prompts asking for the queried point’s metric depth
- during training, metric depth labels for sparse queried pixels
- mixed indoor and outdoor training data with camera intrinsics used for intrinsic-conditioned augmentation

### Outputs
- text answers giving metric depth values in meters for queried pixels
- by repeated querying, sparse or dense pointwise depth predictions that can be converted into point clouds
- in multitask extensions, outputs for additional 3D tasks such as multi-point, reasoning, and multi-image geometric questions

### Training objective (loss)
The core result is that **plain text-based supervised fine-tuning** is enough. The model predicts text answers for pixel depth queries, with the ground-truth depth value embedded in a templated natural-language answer. The paper also studies GRPO-style RL with regression-based rewards, but finds SFT achieves similar accuracy with much better efficiency.

### Architecture / parameterization
The point is mostly what they *do not* change. DepthLM keeps a standard VLM architecture and avoids adding:
- dense prediction heads
- special regression branches
- custom regularization losses
- extra expert depth modules at inference time

Instead, the method adds three core procedural ingredients:
1. **visual prompting** for precise pixel reference
2. **intrinsic-conditioned augmentation** to handle focal-length / camera ambiguity across datasets
3. **sparse-label SFT** over mixed indoor/outdoor depth datasets

The paper reports results on 3B and 7B default VLMs and also tests a 12B Pixtral-based variant to show some cross-architecture portability.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
The paper is trying to solve a pretty embarrassing gap for modern VLMs: they are good at semantic understanding, but still weak at extracting accurate metric 3D structure from 2D images. Meanwhile, pure vision depth models can already achieve very strong metric-depth accuracy, but they rely on task-specific architectures, losses, and heads. The authors want to know whether VLMs really need all that specialization, or whether the failure is more about the training interface and data setup.

### 2. What is the method?
The method is DepthLM, which reframes metric depth estimation as a text-interaction problem for a normal VLM. A pixel is indicated with a rendered visual marker rather than textual coordinates, and the model is asked in natural language how many meters that point is from the camera. Training uses sparse labeled pixels and text-based answer templates. To make metric depth coherent across datasets with different camera intrinsics, the method uses intrinsic-conditioned augmentation that normalizes focal-length ambiguity. The result is a VLM that answers pointwise depth questions accurately enough that repeated queries can recover useful point clouds and competitive dense geometry.

### 3. What is the method motivation?
The motivation is that VLMs may not fundamentally lack 3D understanding capacity. They may instead be handicapped by two ugly practical issues:
- they are bad at grounding a text coordinate like `(x, y)` to the exact image pixel you care about
- metric depth across mixed datasets is ambiguous unless camera differences are handled correctly

If those are the real bottlenecks, then a simple VLM with the right interface and data normalization might already be enough. That is exactly the hypothesis this paper tests.

### 4. What data does it use?
The paper introduces **DepthLMBench**, a benchmark/training suite curated from public depth datasets.

For training, it mixes seven datasets across indoor and outdoor settings, including:
- Argoverse2
- Waymo
- NuScenes
- ScanNet++
- Taskonomy
- HM3D
- Matterport3D

This gives roughly **16 million training images**.

For evaluation, it uses eight datasets with non-overlapping scenes, including:
- Argoverse2
- DDAD
- NuScenes
- ScanNet++
- sunRGBD
- iBims1
- NYUv2
- ETH3D

The paper emphasizes both indoor and outdoor coverage, which matters because metric-scale and camera ambiguity are especially nasty when mixing these regimes.

### 5. How is it evaluated?
The paper evaluates along several axes:
- ablations on **pixel reference strategy**, comparing text coordinates against marker-based visual prompting
- ablations on **training objective**, comparing SFT against GRPO-style RL
- ablations on **camera-ambiguity handling** for mixed-data training
- comparisons against major **general-purpose VLMs**, **spatial VLMs**, and **VLMs trained for depth**
- comparisons against strong **pure vision metric-depth models**
- qualitative visualization of reconstructed point clouds and boundary behavior
- extra experiments on **other 3D tasks** beyond single-point metric depth

The main metric is **δ1**, the standard fraction of predictions within 25% relative error of ground truth.

### 6. What are the main results?
The results are strong enough that this paper feels important.

- The authors claim **state-of-the-art general VLMs, including GPT-5, stay below 0.4 δ1** on their benchmark, which is far behind expert pure-vision depth systems.
- **DepthLM 3B** reaches about **0.838 average δ1**, while the **7B** version reaches about **0.833 or better depending on slice reporting**, and key per-dataset numbers go above **0.9** on some indoor benchmarks.
- The paper says this is the **first VLM genuinely comparable to strong pure-vision metric-depth models**.
- Their 3B model improves over many much larger VLM baselines by **more than 2x** in accuracy.
- Marker-based visual prompting clearly beats text-coordinate prompting, especially in cluttered indoor scenes.
- SFT and RL both work, but **SFT is much more sample- and compute-efficient** for this problem.
- DepthLM also shows a nice qualitative property: compared with smooth pure-vision depth models, it often yields **sharper object boundaries and fewer flying points** without explicit boundary-specific training losses or post-processing.

The paper also reports that the same framework extends naturally to other 3D tasks, which makes the result more interesting than “just one benchmark trick.”

### 7. What is actually novel?
The novelty is not a new depth architecture. It is the opposite: the paper argues that **you do not need one**.

What feels genuinely novel is the combination of:
- treating pixel-level metric depth as a **text-query interface problem** for a VLM
- showing that **visual prompting** is a far better way to specify pixels than text coordinates
- identifying **camera ambiguity** as a central obstacle for VLMs in mixed-data metric-depth training
- demonstrating that **sparse-label SFT** on a standard VLM is enough to reach competitive geometry performance
- showing a VLM can get strong depth behavior while preserving the more general interaction format that makes VLMs attractive in the first place

This is a good example of progress by removing the supposedly necessary complexity rather than adding more modules.

### 8. What are the strengths?
- The central claim is crisp and testable.
- The method is refreshingly simple relative to the result.
- The paper does real ablation work instead of only presenting a final recipe.
- It makes an important distinction between *capacity* and *interface failure*. That is a useful conceptual contribution.
- The comparison to pure-vision models gives the result teeth, because otherwise the paper could have settled for “better than other VLMs.”
- The boundary behavior is interesting. If the qualitative effect is robust, it could matter for robotics and scene interaction where separation between objects matters more than pretty smooth surfaces.
- The framework’s flexibility matters. If a single VLM can do point depth, multi-point depth, reasoning, and related 3D tasks, that is strategically different from a specialist depth net.

### 9. What are the weaknesses, limitations, or red flags?
- The method is still not a true dense-prediction engine in the standard sense. Dense outputs come from repeated point queries, which may be expensive or awkward depending on the use case.
- The claim that VLMs are now “comparable” to pure-vision models is strong, but the comparison is still benchmark- and metric-dependent. Some pure-vision models remain better on certain slices.
- The training recipe is simple conceptually, but still large-scale in practice: tens of millions of samples, lots of H100s, and substantial curated mixed data.
- The paper’s point-cloud sharpness advantage may come with slightly noisier smooth regions, which is a real tradeoff rather than a free win.
- The benchmark is broad, but still centered on metric depth. It does not automatically prove deeper geometric reasoning competence.
- There is a risk that the method’s success depends heavily on the specific underlying VLM family and its visual tokenizer / image handling behavior.

### 10. What challenges or open problems remain?
- Turning this into efficient *dense* or near-dense geometry prediction without losing the nice VLM interaction format
- Extending the approach to richer 3D outputs like normals, surfaces, occupancy, and consistent multi-view geometry
- Understanding when the sharper-boundary behavior generalizes and when it becomes noisy pointwise instability
- Making camera handling work even more robustly in the wild when intrinsics are unknown or messy
- Testing whether this interface-first lesson transfers to robotics tasks where depth is useful but supervision is weaker
- Figuring out how much of the gain comes from better geometric reasoning versus simply better localized pixel addressing

### 11. What future work naturally follows?
- Unified VLMs for multiple 3D tasks, not just metric depth
- Interactive geometry systems where users or agents can ask localized 3D questions rather than request a whole depth map
- Robotics or embodied models that use VLM-style depth querying as part of planning or affordance reasoning
- Hybrid systems that keep the generality of VLMs but add optional acceleration paths for dense output generation
- Better training and prompting schemes for multi-view, temporal, and video-based geometry understanding

### 12. Why does this matter?
This matters because it pushes against the idea that geometric perception and language-native multimodal models must remain separate species. If a normal VLM can be trained to answer metric-depth questions accurately, then the gap between “general multimodal agent” and “specialist geometry model” may be narrower than it looked. That is important for embodied AI, robotics, spatial assistants, and any setting where you want one model to move fluidly between semantics, localization, and 3D reasoning.

## Why It Matters

For cabbageland specifically, this is exactly the kind of paper worth keeping around. It sits right in the overlap of vision, geometry, and agentic usefulness. The biggest lesson is not merely that metric depth got better. It is that a lot of apparent VLM weakness can come from stupid interfaces and data ambiguity rather than from some hard architectural impossibility. That is a useful instinct to preserve more broadly: sometimes the problem is not “the model cannot do X,” but “we are asking it in the wrong coordinate system.”

### 13. What ideas are steal-worthy?
- Use **rendered visual prompts** instead of textual coordinates when precise localization matters.
- Treat cross-dataset metric inconsistency as a **camera-normalization problem**, not only a model-capacity problem.
- Test whether sparse supervised signals are enough before adding dense heads and custom losses.
- Preserve general model interfaces whenever possible, then specialize only if the simple version really fails.
- Pay attention to qualitative geometry artifacts like boundary flying points, not just leaderboard averages.

### 14. Final decision
Keep. This is a strong paper, especially if you care about the overlap of VLMs, 3D understanding, and embodied or agentic systems. It does not prove that general VLMs have solved geometry, but it does make a very credible case that they were being underutilized, and that simple interface and data fixes can unlock much more than people assumed.