# Vision-Geometry-Action Model for Autonomous Driving at Scale

## Basic info

* Title: Vision-Geometry-Action Model for Autonomous Driving at Scale
* Authors: Sicheng Zuo, Zixun Xie, Wenzhao Zheng, Shaoqing Xu, Fang Li, Hanbing Li, Long Chen, Zhi-Xin Yang, Jiwen Lu
* Year: 2026
* Venue / source: arXiv
* Link: https://arxiv.org/abs/2604.00813
* Code: https://github.com/wzzheng/DVGT
* Date read: 2026-04-04
* Why selected in one sentence: It is a strong counterproposal to the current driving-VLA wave, arguing that dense streamed 3D geometry is a better bridge from pixels to action than language descriptions.

## Quick verdict

**Worth keeping.**

This is one of the more interesting recent autonomous-driving papers because it is not just another “put an LLM near a planner and call it intelligence” story. The paper makes a sharper claim: for driving, dense 3D geometry is a more faithful intermediate representation than either sparse detection/map outputs or language descriptions, and if you build the geometry stack in a properly streaming way, you can get strong planning performance without leaning on language supervision at all.

## Why It Matters

The field has been drifting toward the idea that “foundation model for driving” naturally means a VLM/VLA with language somewhere in the loop. This paper is a useful correction. It argues that the real planning bottleneck is not better scene narration but better 3D structure, and then backs that up with strong geometry reconstruction, good closed-loop planning, and unusually low collision rates in open-loop evaluation. Even if the exact implementation is not the final form, the design lesson is strong: for driving, geometry looks like a better core substrate than language.

## One-paragraph overview

The paper proposes a **Vision-Geometry-Action (VGA)** paradigm for end-to-end autonomous driving. Instead of routing images through sparse perception modules or using language as an auxiliary scene-description layer, DVGT-2 takes multi-view driving images and jointly predicts dense 3D pointmaps, relative ego poses, and future trajectories. The technical core is a streaming geometry transformer with temporal causal attention and a fixed-size sliding-window cache, so it can process long driving sequences online without recomputing the whole history. The larger bet is conceptual: the authors claim dense geometry is the right intermediate object for planning because cars operate in a 3D world, and language is too coarse while sparse object/map abstractions throw away too much structure.

## Model definition

### Inputs
- Multi-view camera images from the current frame plus cached history
- Ego status features for planning, including velocity, acceleration, and driving command
- Historical cached features from a fixed-size sliding window

### Outputs
- Dense local 3D pointmaps for the current frame
- Ego pose relative to the previous frame
- Future ego trajectory over multiple steps

### Training objective (loss)
The training is two-stage.
- Stage 1: geometry reconstruction pretraining without streaming enabled
- Stage 2: Vision-Geometry-Action training with trajectory-planning supervision and the streaming mechanism enabled

From the paper text I read, the exact full loss decomposition is not the memorable part; the memorable part is the staged training setup and the shared geometry/planning backbone.

### Architecture / parameterization
- DINOv3-pretrained ViT-L image encoder
- Geometry transformer with 24 blocks
- Each block has:
  - intra-view local attention
  - cross-view spatial attention
  - temporal causal attention
- DPT-style head for dense pointmap prediction
- DiffusionDrive-style heads (with minor modifications) for ego pose and future trajectory
- Fixed history window of `W = 4` during evaluation for efficient streaming inference

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
Two related problems.

First, most end-to-end driving systems still rely on **sparse perception interfaces** such as boxes, maps, motion tracks, or occupancy abstractions. Those are useful, but they compress the world in ways that can lose geometrically important detail.

Second, the newer driving-VLA line tries to use **language descriptions** as an auxiliary representation for planning. The authors think that is the wrong inductive bias for precise control: natural language is semantically rich but geometrically vague. If the task is safe trajectory planning in a 3D world, they argue that a dense 3D scene representation should be a better bridge from visual input to action.

So the paper is trying to show both that dense geometry is the better representation **and** that it can be made online/streaming enough to be practically useful.

### 2. What is the method?
The method is DVGT-2, a streaming **Driving Visual Geometry Transformer** inside the broader VGA paradigm.

At each step, the model:
- takes the current multi-view frame,
- attends to a fixed-size cache of historical features,
- reconstructs dense local geometry for the current frame,
- predicts relative ego pose to the previous frame,
- predicts the future trajectory.

The crucial design changes versus earlier geometry models are:
- **temporal causal attention** instead of reprocessing all frames jointly,
- a **sliding-window cache** instead of an ever-growing full-history memory,
- predicting **local geometry + relative pose** rather than anchoring everything to the very first frame.

That last change is important because it is what lets the model escape full-history dependence and keep compute bounded over long sequences.

### 3. What is the method motivation?
The motivation is pretty good.

If you think the planner needs a faithful representation of scene layout, free space, foreground objects, and their geometry over time, then dense pointmaps are a more direct representation than either:
- symbolic-ish sparse perception outputs, or
- natural-language scene descriptions.

The paper’s philosophy is basically: driving is a spatial-control problem first, not a captioning problem. That does not mean language is useless. It means language is probably not the right **core bottleneck representation** for actual planning.

### 4. What data does it use?
The general DVGT-2 model is trained on a mixture of five driving datasets:
- nuScenes
- OpenScene
- Waymo
- KITTI
- DDAD

The paper says the training data consists of multi-view video sequences sampled at 2 Hz, and dense geometric supervision is derived using the depth foundation model **MoGe-2** plus filtering.

For planning evaluation, they use:
- **NAVSIM v1 and v2** for closed-loop planning
- **nuScenes** for open-loop planning

There is also a specialized **DVGT-2-NAVSIM** fine-tuned model for stronger closed-loop benchmark performance.

### 5. How is it evaluated?
Three main buckets:

1. **Geometry reconstruction** on OpenScene, nuScenes, Waymo, and DDAD
   - Accuracy / Completeness
   - Abs Rel
   - `δ < 1.25`
   - ego-pose AUC

2. **Closed-loop planning** on NAVSIM v1 and v2
   - PDMS / EPDMS and constituent safety/comfort/progress metrics

3. **Open-loop planning** on nuScenes
   - L2 displacement error over 1s/2s/3s horizons
   - collision rate

They also include an **inference-efficiency comparison** against earlier geometry models, focusing on latency and memory growth over long sequences.

### 6. What are the main results?
The paper’s results are actually pretty interesting.

#### Geometry reconstruction
DVGT-2 is strong across all reported datasets while also being faster than prior batch-style geometry models.

Examples:
- **OpenScene**: Abs Rel `0.040`, `δ<1.25 = 0.977`, about `0.27s` per frame
- **nuScenes**: Abs Rel `0.055`, `δ<1.25 = 0.965`
- **Waymo**: Abs Rel `0.073`, `δ<1.25 = 0.949`
- **DDAD**: Abs Rel `0.093`, `δ<1.25 = 0.919`

So the geometry side is not just a philosophical pitch; the model does appear to be genuinely competitive as a geometry foundation model for driving.

#### Closed-loop planning
- On **NAVSIM v1**, DVGT-2 gets **88.6 PDMS**, and the NAVSIM-finetuned variant gets **90.3 PDMS**.
- On **NAVSIM v2**, the text claims DVGT-2 gets **88.9 EPDMS** and the fine-tuned version sets a new SOTA.

That is a real result. It means the dense-geometry-first approach is not just reconstructing pretty 3D; it supports strong actual planning.

#### Open-loop planning on nuScenes
This is where the paper becomes more nuanced.

DVGT-2 is not the best on average L2 prediction error. Its open-loop L2 is described by the authors as **comparable** rather than dominant. But its collision numbers are strikingly low for a model trained with dense geometry instead of rich semantic auxiliary labels.

Reported DVGT-2 open-loop metrics:
- L2: `0.25 / 0.67 / 1.43` at `1s / 2s / 3s`
- average L2: `0.78`
- collision rate: `0.00 / 0.07 / 0.50`
- average collision: `0.19`

That tradeoff is important. The paper’s strongest planning claim is not “best path-regression score everywhere”; it is more like **good trajectory accuracy plus unusually good safety/collision behavior**, which matches the geometry-first story.

#### Efficiency
The efficiency result is conceptually strong, though the absolute latency is less magical than the abstract’s tone might make you expect.

- DVGT/DVGT-style full-sequence methods hit OOM quickly as history grows.
- StreamVGGT grows linearly and still becomes too expensive over longer horizons.
- DVGT-2 keeps **constant memory** and stable latency over long sequences via the fixed cache.
- The reported latency is around **260 ms per frame** in the long-sequence comparison.

So yes, this is much more streamable than prior geometry approaches. But no, this is not “30 FPS real-time planning” in the ordinary robotics sense. It is better described as **bounded online inference suitable for long-horizon streaming**, not high-frequency reactive control.

### 7. What is actually novel?
The main novelty is not just “use geometry.” It is the combination of:
- a **VGA framing** that explicitly argues geometry should replace language as the key intermediate representation for driving,
- a **streaming geometry architecture** that predicts local geometry and relative pose,
- a **fixed-size sliding-window cache** that keeps inference cost bounded,
- joint geometry reconstruction and planning in the same model.

The conceptual novelty is almost more important than the architectural one: this paper is openly pushing back on the field’s recent VLA fetish.

### 8. What are the strengths?
- It has a clean thesis: dense geometry is the right planning substrate for driving.
- It actually supports that thesis with both reconstruction and planning results.
- The sliding-window design is a sensible systems fix to the online-inference problem.
- The model appears robust across multiple datasets and camera configurations.
- The planning story is especially compelling on **collision/safety behavior**, not just trajectory fit.
- It avoids needing language labels or RL-heavy VLA tuning just to get decent driving behavior.

### 9. What are the weaknesses, limitations, or red flags?
A few.

#### The “real-time” vibe needs restraint
The model is much more online-friendly than earlier geometry models, but the paper’s own efficiency figure reports roughly **260 ms per frame**, which is nowhere near camera-rate 30 FPS control. So this is not the same kind of latency breakthrough as a robotics paper that actually crosses hard reactive thresholds.

#### The geometry supervision is not exactly cheap in a conceptual sense
The approach avoids semantic annotations, but it still depends on strong geometric pseudo-supervision derived from MoGe-2 and large-scale mixed-dataset training. That is annotation-efficient, yes, but not simple.

#### Closed-loop strength partly benefits from benchmark-specific fine-tuning
The foundation model is already strong, but the top SOTA claims rely on **DVGT-2-NAVSIM**, which is benchmark-specialized. That is normal, but worth keeping straight.

#### It does not fully prove language is useless
What it really proves is that **dense geometry can outperform the current language-heavy driving framing for planning**. That is not the same as showing language has no role. Language may still matter for instruction following, explanation, rare scenario grounding, or human interaction.

### 10. What challenges or open problems remain?
- Can the geometry-first approach scale to truly high-frequency control?
- How well does it handle extreme long-tail behaviors that may benefit from semantic/world knowledge?
- Can dense geometry and language be combined cleanly without collapsing into VLA marketing mush?
- How robust is this representation under major sensor shifts and rare environments?
- Can the streaming design stay effective as planning stacks become more interactive and multimodal?

### 11. What future work naturally follows?
- Hybrid models where **geometry is primary** and language is auxiliary rather than the other way around
- Stronger closed-loop studies in more interactive or adversarial traffic
- Better latency optimization to get closer to truly reactive rates
- Ablations on which geometry fidelity actually matters most for planning quality
- More explicit treatment of uncertainty in reconstructed geometry and downstream action choice

### 12. Why does this matter?
Because the field has been drifting toward the idea that “foundation model for driving” naturally means some kind of VLM/VLA with language in the loop. This paper says: maybe that is backwards.

For driving, what you fundamentally need is not a poetic textual description of the scene. You need a faithful evolving 3D structure that a planner can act on safely. That is a strong and, honestly, refreshing corrective.

### 13. What ideas are steal-worthy?
- Treat **dense geometry** as the primary shared representation between perception and planning.
- Predict **local geometry + relative pose** to avoid first-frame anchoring.
- Use **fixed-window streaming caches** to bound memory and latency over long sequences.
- Judge planning not just by average L2 but by **collision behavior**, because geometry-rich models may win there even when plain trajectory error looks merely competitive.

### 14. Final decision
**Keep.**

This is one of the better recent papers in autonomous driving because it has a clear worldview and backs it up with substantive results. The main thing worth remembering is not the specific benchmark table. It is the design argument:

**for autonomous driving, dense streamed 3D geometry may be a better core representation than both sparse perception interfaces and language descriptions.**

That does not kill the whole VLA story, but it definitely punctures the idea that language should be the default bridge from vision to driving action.

## Final Decision

**Keep.** Useful reference for geometry-first autonomous driving. The memorable takeaway is not “streaming VGA beats everything forever,” but that dense 3D geometry looks like a more faithful planning interface than both sparse perception summaries and language-description intermediates.
