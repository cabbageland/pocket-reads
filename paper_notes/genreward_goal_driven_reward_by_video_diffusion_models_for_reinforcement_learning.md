# GenReward: Goal-Driven Reward by Video Diffusion Models for Reinforcement Learning

## Basic info

* Title: Goal-Driven Reward by Video Diffusion Models for Reinforcement Learning
* Authors: Qi Wang, Mian Wu, Yuyang Zhang, Mingqi Yuan, Wenyao Zhang, Haoxiang You, Yunbo Wang, Xin Jin, Xiaokang Yang, Wenjun Zeng
* Year: 2025
* Venue / source: arXiv
* Link: https://qiwang067.github.io/genreward
* Date read: 2026-03-31
* Date surfaced: 2026-03-12 (via Li Dayou)
* Why selected in one sentence: It uses a video diffusion model as a reward source, which is much more interesting than using it only for prediction or imitation.

## Quick verdict

* Useful

The paper is attractive because it uses generative video priors for reward construction rather than only for planning or rollouts. That is a more targeted use of world knowledge. I had abstract-level access plus secondary summaries, so the high-level mechanism is clear but the exact optimization details are not.

## One-paragraph overview

GenReward uses pretrained video diffusion models to provide goal-driven reward signals for reinforcement learning without manually engineered reward code. The method builds both a video-level reward and a frame-level reward. For video-level reward, it compares the agent trajectory with generated goal-video latents from a finetuned video model. For frame-level reward, it extracts a relevant goal frame from the generated video with CLIP and then uses a learned forward-backward representation to estimate the probability of reaching that goal state from the current state-action pair.

## Model definition

### Inputs
Current observations or trajectory history, a desired goal specification, generated goal-video samples, and state-action pairs for the RL agent.

### Outputs
Reward signals at both video level and frame level, which are fed into RL training.

### Training objective (loss)
The method uses a finetuned video diffusion model and a learned forward-backward representation. The accessible summaries mention latent similarity and goal-reaching probability, but I did not inspect the exact RL objective or weighting.

### Architecture / parameterization
A pretrained / finetuned video diffusion model plus a forward-backward representation model, with CLIP used for selecting a frame-level goal.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
RL reward design is tedious, brittle, and often task-specific.

### 2. What is the method?
Generate goal videos with a video diffusion model and turn them into video-level and frame-level reward signals.

### 3. What is the method motivation?
Video models encode a lot of knowledge about what successful trajectories should look like; reward design can piggyback on that.

### 4. What data does it use?
The paper reports experiments on Meta-World tasks and uses domain-specific video finetuning for the reward model.

### 5. How is it evaluated?
On various Meta-World manipulation tasks against reward baselines.

### 6. What are the main results?
The claim is competitive or superior RL performance with reduced manual reward engineering. I did not verify exact tables.

### 7. What is actually novel?
Using generated goal videos directly as a structured reward source rather than only for planning or imitation.

### 8. What are the strengths?
The decomposition into coarse trajectory-level and fine frame-level reward is sensible.

### 9. What are the weaknesses, limitations, or red flags?
Reward quality will depend on the video model quality, and the setup is likely computationally heavy.

### 10. What challenges or open problems remain?
Scaling beyond simple manipulation domains and making generative rewards stable enough for harder RL settings.

### 11. What future work naturally follows?
Use stronger video models, better goal conditioning, and broader policy-learning benchmarks.

### 12. Why does this matter?
Because reward engineering is still one of the least scalable parts of RL.

### 13. What ideas are steal-worthy?
Use generative models as structured reward priors, not just as simulators.

### 14. Final decision
Keep as a useful reward-modeling paper.
