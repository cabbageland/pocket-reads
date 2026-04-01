# Goal-Driven Reward by Video Diffusion Models for Reinforcement Learning

## Basic info

* Title: Goal-Driven Reward by Video Diffusion Models for Reinforcement Learning
* Authors: Qi Wang, Mian Wu, Yuyang Zhang, Mingqi Yuan, Wenyao Zhang, Haoxiang You, Yunbo Wang, Xin Jin, Xiaokang Yang, Wenjun Zeng
* Year: 2026
* Venue / source: CVPR 2026 / arXiv preprint
* Link: https://arxiv.org/abs/2512.00961
* Date read: 2026-03-31
* Date surfaced: 2026-03-12 (via Li Dayou)
* Surfaced as: GenReward project page alias
* Why selected in one sentence: It uses a video diffusion model as a reward source, which is much more interesting than using it only for prediction or imitation.

## Quick verdict

* Useful

This note is stronger now because the method is more than "use a video model as reward." GenReward explicitly splits the reward into a coarse video-level term and a fine frame-level term. The video-level reward measures latent agreement between the agent trajectory and generated goal videos, while the frame-level reward picks a goal frame with CLIP and then scores whether the current state-action pair is likely to reach that goal through a forward-backward representation. That decomposition makes the paper feel like a real reward-design proposal instead of a vague generative prior story.

## One-paragraph overview

GenReward tries to reduce manual reward engineering by turning pretrained video diffusion models into goal-driven reward providers for RL. The pipeline starts by finetuning an off-the-shelf video diffusion model on domain-specific data so it can generate plausible goal videos for a task. During RL, the agent receives two reward streams. First, a video-level reward compares latent representations of the agent's trajectory with the generated goal video, providing a coarse trajectory-alignment signal. Second, the method uses CLIP to pick the most relevant frame from the generated goal video as a concrete goal state, then trains a forward-backward model that estimates the probability of reaching that goal from a given state-action pair, yielding a dense frame-level reward. The paper's claim is that this combination transfers world knowledge from the video model into RL while avoiding brittle hand-coded rewards.

## Model definition

### Inputs
Current observations or trajectory snippets from the agent, a goal specification, generated goal videos from a finetuned video diffusion model, and state-action pairs for learning the frame-level reachability reward.

### Outputs
Two reward signals: a video-level trajectory-alignment reward and a frame-level goal-reaching reward, both used to train the RL policy.

### Training objective (loss)
The method combines a finetuned video diffusion model for goal-video generation with a learned forward-backward representation for estimating the probability of reaching the selected goal frame. The public paper summary does not expose the full RL weighting details, but the decomposition of the reward terms is clear.

### Architecture / parameterization
A pretrained or finetuned video diffusion model supplies goal-video latents, CLIP selects the most relevant goal frame, and a forward-backward model turns that frame into a state-action-conditioned reachability score.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
RL reward design is tedious, fragile, and task-specific. It does not scale well across manipulation tasks or domain shifts.

### 2. What is the method?
Generate goal videos with a video diffusion model and turn them into reward through two channels: latent trajectory similarity at the video level and goal-reaching probability at the frame level.

### 3. What is the method motivation?
Video models encode rich priors about successful behavior. If that prior can be converted into reward, RL can inherit goal structure without requiring a human to hand-code every success condition.

### 4. What data does it use?
The paper uses domain-specific data to adapt the video diffusion model and evaluates on Meta-World manipulation tasks.

### 5. How is it evaluated?
Against reward baselines on Meta-World tasks, including standard dense-reward comparisons and domain-shift studies. The public summary also lists ablations and sensitivity analyses, which suggests the paper does more than one headline table.

### 6. What are the main results?
The paper reports competitive to superior performance on Meta-World complex manipulation tasks and claims stronger robustness under domain shift, while reducing dependence on manually engineered reward functions. The summary also flags additional compute as the main cost.

### 7. What is actually novel?
Using generated goal videos as a reward source is the core novelty, but the more precise contribution is the split between coarse latent video alignment and fine-grained frame-level reachability.

### 8. What are the strengths?
The reward design is structurally sensible, the frame-level term gives a plausible dense signal, and the method uses generative models where they add the most value instead of asking them to replace control entirely.

### 9. What are the weaknesses, limitations, or red flags?
The quality of the reward is tied to the quality of the generated goals. The system is computationally heavier than standard reward shaping. The current evidence is still centered on Meta-World rather than harder long-horizon or open-world robotics settings.

### 10. What challenges or open problems remain?
Scaling to noisier visual domains, handling multimodal goals without collapse, and keeping the reward stable when the generated goal video is imperfect or ambiguous.

### 11. What future work naturally follows?
Use stronger video backbones, improve goal-frame selection, and push generative reward design into harder manipulation or embodied-navigation domains.

### 12. Why does this matter?
Because reward engineering is still one of the least scalable parts of RL, and this is a credible attempt to outsource some of that work to a learned world prior.

### 13. What ideas are steal-worthy?
Split generative reward into trajectory-level and state-level components. Use video generation to define what success looks like, then use a separate reachability model to make that success trainable.

### 14. Final decision
Keep. Good reward-modeling paper and materially deeper than the old skim note.
