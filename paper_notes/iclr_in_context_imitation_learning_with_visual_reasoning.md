# ICLR: In-Context Imitation Learning with Visual Reasoning

## Basic info

* Title: ICLR: In-Context Imitation Learning with Visual Reasoning
* Authors: Toan Nguyen, Weiduo Yuan, Songlin Wei, Hui Li, Daniel Seita, Yue Wang
* Year: 2026
* Venue / source: arXiv
* Link: https://arxiv.org/abs/2603.07530
* Date read: 2026-03-31
* Date surfaced: 2026-03-12 (via Zhiwen Fan)
* Why selected in one sentence: It asks a sharper question than most robot reasoning papers: can explicit visual reasoning traces improve in-context imitation rather than merely decorate it.

## Quick verdict

* Useful

This is a cleaner reasoning paper than most robot-reasoning work because the intermediate representation is not free-form text. It is a future robot trajectory drawn in image space. After reading the paper website and PDF text, the method is much more concrete than the old note: the model first predicts a short keypoint-style future trace, then predicts the low-level action conditioned on that trace. That makes the "reasoning" step operational instead of theatrical.

## One-paragraph overview

ICLR studies in-context imitation learning in the setting where a robot must infer a new task from a few prompt demonstrations without weight updates. The paper argues that prompt trajectories alone often under-specify intent in cluttered or ambiguous scenes: the same early motion can be consistent with several goals. Their fix is to augment each prompt with a visual reasoning trace, represented as anticipated future gripper locations in image space, and to train one causal transformer that autoregressively predicts both the reasoning trace and the action. The trace is not hand-written natural language. It is extracted from future frames by sampling five third-view images from the current time to the end of the trajectory and using Molmo2 to localize the gripper. Multi-view images and proprioceptive state become state tokens, the trace becomes reasoning tokens, and action chunks become action tokens. At inference, the model generates the reasoning trace first, then the action, repeatedly in closed loop. The paper's claim is that this explicit image-space intent token helps generalization to unseen tasks and new object layouts better than standard in-context imitation baselines.

## Model definition

### Inputs
Prompt demonstrations containing multi-view images, proprioceptive robot state, low-level actions, and visual reasoning traces; plus the current rollout observation at inference time.

### Outputs
A generated visual reasoning trace for the next step and the corresponding low-level robot action.

### Training objective (loss)
Teacher-forced autoregressive prediction over interleaved reasoning and action tokens. The model is trained to predict the next reasoning trace before the next action, so the intermediate plan is part of the supervised sequence rather than an external side channel.

### Architecture / parameterization
A unified causal transformer with three token sources: state encoder outputs for camera and proprioceptive observations, reasoning encoder outputs for the image-space trajectory trace, and action encoder outputs for low-level control. The generation order is reasoning first, action second.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
In-context imitation can adapt quickly from a few demos, but it often fails when the demonstrations do not make task intent explicit. Ambiguous scenes and multiple plausible targets make raw state-action prompting brittle.

### 2. What is the method?
Augment prompt demonstrations with structured visual reasoning traces that describe anticipated future gripper motion in the image plane, then train a transformer to jointly autoregress over reasoning and action. During deployment, the model reasons visually before acting.

### 3. What is the method motivation?
If the missing information is intent, the intermediate representation should expose intent in a form tied directly to control geometry. A future gripper path does that much more cleanly than a paragraph of text.

### 4. What data does it use?
The paper evaluates in both simulation and real-world manipulation. The project page lists simulation benchmarks on LIBERO-Object, LIBERO-90 Kitchen, LIBERO-90 Living Room, and LIBERO-90 Study, plus real-world pick-and-place and poking tasks.

### 5. How is it evaluated?
By success rate and generalization to unseen tasks and novel object configurations, compared against other in-context imitation learning methods. The qualitative comparisons emphasize ambiguous placements such as moving a dumpling to a red box or a tomato to a gray bowl, where the intended target needs to be inferred from prompt context.

### 6. What are the main results?
The exact tables are not exposed cleanly on the project page, but the paper reports consistent gains over in-context imitation baselines in both simulation and real-world tests. The important result is not a single leaderboard number. It is that the reasoning-augmented version improves both success and generalization in precisely the ambiguous settings where plain prompt imitation should be weakest.

### 7. What is actually novel?
The novel part is the representation choice and the training interface. The paper does not bolt a reasoning caption onto the policy. It turns future image-space robot motion into a supervised intermediate token stream inside in-context imitation.

### 8. What are the strengths?
The reasoning signal is embodied and cheap enough to supervise from trajectory video. The architecture is conceptually clean. The method attacks a real weakness of prompt-conditioned policies instead of claiming that "reasoning" helps everywhere by magic.

### 9. What are the weaknesses, limitations, or red flags?
The trace still depends on a particular task geometry and camera framing. Five sampled third-view images and a keypoint-style trajectory are a fairly specific design choice. The public materials show the method clearly, but the quantitative breakdown is lighter than I would like.

### 10. What challenges or open problems remain?
Extend the trace idea to richer contact structure, object-centric intent, multi-arm tasks, or long-horizon plans that cannot be summarized well by a short 2D gripper path. Also test whether the representation survives harder camera changes and partial observability.

### 11. What future work naturally follows?
Learn better visual traces automatically, add uncertainty over future trace branches, and combine this approach with object-centric memory or world-model predictions so the policy can reason over more than a short local path.

### 12. Why does this matter?
Because robot reasoning only matters if it changes action selection in a legible way. This paper gives one of the more plausible examples of how to do that.

### 13. What ideas are steal-worthy?
Use future image-space gripper trajectories as an intermediate supervision target. Make reasoning part of the autoregressive action sequence rather than a separate explanation channel.

### 14. Final decision
Keep. Good paper for making "reasoning" in robot imitation actually mean something.
