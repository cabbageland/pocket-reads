# Dexterous World Models

## Basic info

* Title: Dexterous World Models
* Authors: Byungjun Kim, Taeksoo Kim, Junyoung Lee, Hanbyul Joo
* Year: 2026
* Venue / source: CVPR 2026 / arXiv preprint
* Link: https://arxiv.org/abs/2512.17907
* Date read: 2026-03-31
* Date surfaced: 2026-03-11 (via Zhiwen Fan)
* Why selected in one sentence: It tries to make static digital twins actually interactive by predicting dexterous human-scene interaction instead of just rendering navigation viewpoints.

## Quick verdict

* Useful

This is a strong interaction-centric world-model paper. The main value is not the digital-twin framing; it is the explicit conditioning on scene renderings plus hand-action sequences to model how the scene changes under manipulation. I had paper-level access, but not a full experimental audit.

## One-paragraph overview

Dexterous World Models turns a static 3D scene into an interactive one by learning a scene-action-conditioned video diffusion model. Given a rendering of the scene and an egocentric hand-motion sequence, the model predicts the resulting human-scene interaction video. The goal is to make digital twins useful for embodied interaction rather than just view synthesis. The paper emphasizes temporally coherent, physically plausible interaction over longer horizons than most video generation demos.

## Model definition

### Inputs
A rendered view of a static 3D scene plus an egocentric hand motion or action sequence.

### Outputs
A temporally coherent interaction video showing how the scene changes under the specified dexterous action.

### Training objective (loss)
The accessible material supports that it is a video diffusion model, but I did not inspect the exact denoising losses or auxiliary objectives.

### Architecture / parameterization
A scene-action-conditioned video diffusion framework for human-scene interaction generation.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
Static digital twins are good for navigation and rendering but bad for embodied interactivity.

### 2. What is the method?
Condition a video diffusion model on scene rendering and dexterous action to generate interactive future videos.

### 3. What is the method motivation?
If digital twins are going to support robotics, they need to model how scenes respond to action.

### 4. What data does it use?
Human-scene interaction data collected to train the interaction model, though the exact dataset composition was not visible in the accessible summary.

### 5. How is it evaluated?
On realism, coherence, and physical plausibility of generated interaction videos.

### 6. What are the main results?
The paper claims realistic and coherent interaction generation from static scene context. I did not verify exact numbers.

### 7. What is actually novel?
Making digital twins interactive through explicit scene-plus-action-conditioned video generation.

### 8. What are the strengths?
Clear problem target and a concrete conditioning interface.

### 9. What are the weaknesses, limitations, or red flags?
Video realism is still not the same as a grounded physics model, and long-horizon interaction remains fragile.

### 10. What challenges or open problems remain?
Better physical grounding, richer action spaces, and direct use for control/planning.

### 11. What future work naturally follows?
Use the model for simulation-based policy learning or pair it with object/state representations.

### 12. Why does this matter?
Because digital twins that cannot react to hands are still mostly passive graphics assets.

### 13. What ideas are steal-worthy?
Condition interaction models on scene renderings plus action trajectories to retrofit interactivity into static reconstructions.

### 14. Final decision
Keep. Good reference for interaction-centric world modeling.
