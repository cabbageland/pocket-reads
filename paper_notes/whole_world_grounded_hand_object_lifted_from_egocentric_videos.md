# WHOLE: World-Grounded Hand-Object Lifted from Egocentric Videos

## Basic info

* Title: WHOLE: World-Grounded Hand-Object Lifted from Egocentric Videos
* Authors: Yufei Ye, Jiaman Li, Ryan Rong, C. Karen Liu
* Year: 2026
* Venue / source: arXiv
* Link: https://arxiv.org/abs/2602.22209
* Date read: 2026-03-31
* Date surfaced: 2026-03-02 (via Zhiwen Fan)
* Why selected in one sentence: It tries to jointly reconstruct hands and objects in world space instead of pretending those two problems can be solved independently without breaking interaction consistency.

## Quick verdict

* Useful

The main value is the joint world-space reconstruction story. Egocentric hand-object videos are exactly where separate hand and object estimators fall apart, and the paper addresses that directly. I had paper-level access, but the note remains at the mechanism level rather than a full metric audit.

## One-paragraph overview

WHOLE reconstructs hand and object motion jointly in world coordinates from egocentric videos, assuming object templates are available. The key idea is to learn a generative prior over hand-object motion so that test-time inference can use the prior to maintain interaction consistency even when either the hand or object leaves the field of view. That matters because egocentric interaction videos are full of occlusions and out-of-sight intervals that make separate hand and object pipelines disagree.

## Model definition

### Inputs
Egocentric video observations and object templates.

### Outputs
World-space hand trajectories, 6D object poses, and consistent hand-object interaction reconstruction.

### Training objective (loss)
The accessible abstract makes the generative-prior story clear but does not expose the exact objective terms.

### Architecture / parameterization
A generative prior over joint hand-object motion, guided at test time by video observations.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
Egocentric interaction videos are hard because hands and objects occlude each other and frequently leave view.

### 2. What is the method?
Learn a joint hand-object motion prior in world space and guide it with video evidence at test time.

### 3. What is the method motivation?
Separate hand and object estimators create inconsistent interaction geometry.

### 4. What data does it use?
Egocentric manipulation videos with object templates; the exact dataset list was not visible in the material I used.

### 5. How is it evaluated?
On hand motion estimation, 6D object pose estimation, and relative interaction reconstruction.

### 6. What are the main results?
The paper claims state-of-the-art results on those three fronts. I did not verify exact tables.

### 7. What is actually novel?
A joint generative prior for hand-object motion in world space under egocentric occlusion.

### 8. What are the strengths?
Targets a real failure mode and uses a representation that matches the interaction problem.

### 9. What are the weaknesses, limitations, or red flags?
Dependence on object templates and likely difficulty with unknown object geometry.

### 10. What challenges or open problems remain?
Unknown objects, richer contacts, and broader scene context.

### 11. What future work naturally follows?
Template-free extensions and coupling to manipulation planning or imitation learning.

### 12. Why does this matter?
Because consistent hand-object reconstruction is basic infrastructure for learning from egocentric interaction.

### 13. What ideas are steal-worthy?
Joint generative priors over interaction entities instead of separate estimators plus post-hoc cleanup.

### 14. Final decision
Keep. Good representation paper for egocentric interaction.
