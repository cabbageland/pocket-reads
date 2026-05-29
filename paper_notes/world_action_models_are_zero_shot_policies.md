# World Action Models are Zero-shot Policies

## Basic info

* Title: World Action Models are Zero-shot Policies
* Authors: Seonghyeon Ye, Yunhao Ge, Kaiyuan Zheng, Shenyuan Gao, Sihyun Yu, George Kurian, Suneel Indupuru, You Liang Tan, Chuning Zhu, Jiannan Xiang, Ayaan Malik, Kyungmin Lee, William Liang, Nadun Ranawaka, Jiasheng Gu, Yinzhen Xu, Guanzhi Wang, Fengyuan Hu, Avnish Narayan, Johan Bjorck, Jing Wang, Gwanghyun Kim, Dantong Niu, Ruijie Zheng, Yuqi Xie, Jimmy Wu, Qi Wang, Ryan Julian, Danfei Xu, Yilun Du, Yevgen Chebotar, Scott Reed, Jan Kautz, Yuke Zhu, Linxi “Jim” Fan, Joel Jang
* Year: 2026
* Venue / source: arXiv preprint (cs.RO)
* Link: https://arxiv.org/abs/2602.15922
* PDF: https://arxiv.org/pdf/2602.15922.pdf
* Project page: https://dreamzero0.github.io
* Date read: 2026-04-03
* Date surfaced: 2026-04-03
* Surfaced via: Tracy in #pocket-reads
* Why selected in one sentence: This is one of the most aggressive recent claims for video-first robot foundation models: that a world-action model can function directly as a zero-shot policy and beat current VLAs on genuinely new motions, environments, and even embodiments.

## Quick verdict

* Highly relevant

This paper is the real thing, not just branding spray paint on a diffusion model. DreamZero is a 14B autoregressive video diffusion robot policy that jointly predicts future video and continuous actions, and the paper backs the framing with serious empirical claims: better zero-shot environment and task generalization than strong VLA baselines, useful learning from diverse non-repetitive robot data, video-only cross-embodiment transfer, few-shot adaptation to a new robot with only 30 minutes of play data, and a substantial systems push to make a giant video model actually run in closed loop at 7Hz. The strongest conceptual claim is that jointly predicting visual futures and actions gives the policy better physical priors than static-image-pretrained VLAs, especially for unseen motions rather than just unseen nouns.

## One-paragraph overview

DreamZero is a World Action Model (WAM): a robot foundation model that predicts both future observations and action sequences together, rather than treating action as the only output. It is initialized from a pretrained 14B image-to-video diffusion backbone and trained autoregressively with a teacher-forcing chunk-wise video denoising objective so that language, visual context, future video, and continuous robot actions stay aligned. The policy argument is blunt: video prediction gives the model spatiotemporal and physics priors that ordinary vision-language-action models largely lack because those models inherit mostly semantic knowledge from static image-text pretraining. The empirical story mostly supports that framing. DreamZero substantially outperforms VLA baselines on zero-shot environment and unseen-task evaluations, gets meaningful gains from video-only transfer data from humans or another robot embodiment, and can adapt from one embodiment to another with just 30 minutes of play data. The paper also matters as systems work because it turns a giant autoregressive diffusion model into a real-time controller using DreamZero-Flash, parallelism, caching, quantization, and kernel-level optimization to reach about 7Hz closed-loop control.

## Model definition

### Inputs
Current visual observations, language instructions, proprioceptive signals, and recent context frames; during training, action chunks and future video targets; during some transfer settings, video-only demonstrations from humans or other robots.

### Outputs
Future video predictions and continuous action chunks for robot control, jointly generated in an aligned autoregressive sequence.

### Training objective (loss)
The model is trained with a teacher-forcing chunk-wise video denoising objective while jointly learning action prediction. The core setup aligns action generation with predicted visual futures, effectively shifting action learning toward an inverse-dynamics style problem grounded in future-world prediction rather than pure direct imitation from observations.

### Architecture / parameterization
A 14B autoregressive diffusion transformer initialized from the Wan2.1-I2V-14B-480P image-to-video model. The paper positions DreamZero as a WAM rather than a VLA because it jointly models future observations and actions. Deployment uses DreamZero-Flash plus system and low-level optimizations to make inference fast enough for real-time control.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
Current VLAs are pretty good at semantic transfer and object-level language grounding, but they often fall apart when the task requires a genuinely new physical motion or execution pattern in a novel environment. In other words, they know what but not how. This paper is trying to build a robot foundation model that generalizes to unseen motions, unseen tasks, and unseen environments by inheriting physical and spatiotemporal priors from video prediction rather than only semantic priors from image-text pretraining.

### 2. What is the method?
The method is DreamZero, a World Action Model that jointly predicts future video and robot actions. Instead of treating video generation as a separate planner or an offline auxiliary objective, the model directly learns a joint distribution over future observations and actions, conditioned on current observations and language. It uses an autoregressive architecture rather than a bidirectional one, a pretrained 14B video diffusion backbone, and a set of inference optimizations called DreamZero-Flash plus caching / quantization / CUDA tuning to make the whole thing usable online.

### 3. What is the method motivation?
The motivation is that video models see how the world evolves. That gives them a shot at learning physical dynamics, geometry, temporal structure, and motion priors that static-image-pretrained VLAs do not naturally get. If actions are learned in alignment with predicted visual futures, then the policy can inherit those priors and behave more like an embodied predictor of how to make the world evolve, not just a token generator for motor commands.

### 4. What data does it use?
The paper trains and evaluates on heterogeneous real robot data, emphasizing diverse, non-repetitive behavior rather than only many repeated demonstrations per task. It evaluates on both AgiBot G1 and DROID-Franka style setups, uses additional video-only transfer data from humans and another robot embodiment called YAM, and reports public benchmark compatibility with RoboArena plus some simulation hooks. One key claim is that around 500 hours of diverse real-world robot data can support strong performance without the usual obsession with repetitive demo-heavy curation.

### 5. How is it evaluated?
The paper evaluates along several axes:
- seen-task but unseen-environment zero-shot generalization,
- zero-shot generalization to truly unseen tasks,
- post-training / fine-tuning performance while retaining environment generalization,
- cross-embodiment transfer from video-only data,
- few-shot adaptation to a new embodiment,
- architecture and scaling ablations,
- and inference-speed / deployment measurements.

Metrics include average task progress and success rate across rollouts, plus system latency and control frequency.

### 6. What are the main results?
There are a bunch, and several are substantial rather than decorative:
- On seen tasks in new environments, DreamZero gets 62.2% average task progress on AgiBot G1, more than 2× the best pretrained VLA baseline at 27.4%.
- On 10 unseen tasks, DreamZero reaches 39.5% average task progress on AgiBot G1, versus 16.3% for the best pretrained VLA baseline; on DROID-Franka it reports 49% task progress and 22.5% success rate, beating strong pretrained baselines.
- On post-training evaluations, the paper says DreamZero retains environment generalization and outperforms or matches VLA baselines, with about a 10% average task-progress gain after task-specific post-training.
- Cross-embodiment transfer from only 10–20 minutes of video-only data improves unseen-task average task progress from 38.3% to 54.3% with human-to-robot transfer and 55.4% with robot-to-robot transfer.
- Few-shot embodiment adaptation works with roughly 30 minutes of play data on a new bimanual robot (YAM), while retaining strong language-following behavior.
- The 14B WAM scales much better than the 5B version for this setting, reported as 50% versus 21% in a key generalization comparison.
- System and model optimizations produce a 38× inference speedup and enable real-time closed-loop control at about 7Hz.

### 7. What is actually novel?
The paper’s novelty is not merely “video as auxiliary loss.” Its stronger claim is that a sufficiently large pretrained video diffusion model, trained as a joint world-action model, can itself function as a zero-shot policy with better motion generalization than current VLAs. A second novelty is the practical systems work required to make a 14B autoregressive diffusion controller run in real time. A third is the evidence that video-only cross-embodiment transfer is already useful, which is strategically important because action-labeled robot data are scarce while human and cross-robot video are abundant.

### 8. What are the strengths?
- The paper directly targets the real weakness of many VLAs: unseen motions and physical execution, not just semantic relabeling.
- The evaluation is much better than the usual “here are three cute demos” standard; it includes unseen tasks, new environments, transfer, adaptation, scaling, and deployment.
- The data-diversity argument is important and believable: WAMs may need varied state-action correspondences more than repetitive task cloning.
- Video-only cross-embodiment transfer is genuinely interesting because it points toward a path where unlabeled visual experience matters.
- The systems contribution is nontrivial. Getting a giant diffusion-based controller to 7Hz closed loop is a real engineering result.
- The paper is unusually clear about one core failure mode: when the generated video is wrong, the actions are often faithfully wrong in the same way. That honesty makes the rest more credible.

### 9. What are the weaknesses, limitations, or red flags?
- The biggest limitation is also the central dependency: if video generation quality degrades, action quality degrades with it. The policy is only as sane as its imagined future.
- 7Hz is impressive for this class of model, but it is still not obviously enough for every manipulation regime, especially very fast or contact-rich behaviors.
- A lot of the strongest baselines are VLA-family systems with known weaknesses on motion generalization, so the paper still leaves room for comparisons against other strong world-model-style alternatives.
- The cross-embodiment transfer results are promising but still moderate in absolute terms; this is an early signal, not a solved problem.
- The few-shot embodiment adaptation may partly depend on embodiment similarity, which the authors themselves note.
- “Zero-shot policy” is rhetorically spicy. The model is pretrained and heavily engineered; the interesting thing is not magical zero-shotness but what kind of prior this training setup buys.

### 10. What challenges or open problems remain?
A lot of obvious next problems remain: pushing control frequency higher, making the policy less brittle to video hallucinations, handling more dexterous and contact-sensitive manipulation, quantifying how embodiment similarity affects transfer, and understanding whether video-prediction quality is a sufficient proxy for policy quality. There is also a deeper question of whether WAMs can absorb huge amounts of human egocentric video in a way that truly helps robot control rather than just improving visual storytelling.

### 11. What future work naturally follows?
- Stronger video backbones, because the paper basically argues policy quality tracks video quality.
- Better uncertainty handling or verification so wrong imagined futures do not directly turn into wrong actions.
- More diverse cross-embodiment studies, especially with more dissimilar morphologies.
- Hybrid approaches that combine WAM priors with faster low-level controllers or safety layers.
- More direct comparisons with latent world models and search-based world-model policies under equal deployment constraints.

### 12. Why does this matter?
Because this is one of the clearest recent attempts to shift robot foundation modeling away from “language-grounded imitation policy” toward “predictive embodied model that happens to act.” If that shift is right, then the next leap in robot generalization may come less from stuffing more captions into a VLA and more from giving policies better learned priors about how the physical world evolves.

## Why It Matters

DreamZero is strategically important because it makes the case that video prediction is not just a nice auxiliary objective for robot learning but a serious source of policy prior. If world-action models keep scaling, then the data bottleneck for robotics may loosen in a very specific way: we may be able to exploit vast amounts of human and cross-robot video without needing fully labeled action traces for everything.

### 13. What ideas are steal-worthy?
- Treat future-world prediction as the backbone of policy learning, not just a planner bolted on top.
- Use diverse, non-repetitive robot data instead of assuming repeated demonstrations are the only route to generalization.
- Exploit video-only cross-embodiment data as a transfer source.
- Make alignment between predicted futures and executed actions a first-class design target.
- Attack inference latency as a core algorithmic problem, not as an afterthought.

### 14. Final decision
Keep and revisit. This is one of the more important robotics papers in this slice of the 2026 landscape. It does not prove that WAMs have won, but it gives the strongest recent argument I have seen that video-first world-action models may be the right direction for zero-shot robot generalization.
