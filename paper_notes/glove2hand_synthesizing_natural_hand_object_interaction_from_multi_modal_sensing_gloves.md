# Glove2Hand: Synthesizing Natural Hand-Object Interaction from Multi-Modal Sensing Gloves

## Basic info

* Title: Glove2Hand: Synthesizing Natural Hand-Object Interaction from Multi-Modal Sensing Gloves
* Authors: Xinyu Zhang, Ziyi Kou, Chuan Qin, Mia Huang, Ergys Ristani, Ankit Kumar, Lele Chen, Kun He, Abdeslam Boularias, Li Guan
* Year: 2026
* Venue / source: arXiv
* Link: https://arxiv.org/pdf/2603.20850
* Date read: 2026-03-31
* Date surfaced: 2026-03-24 (via Lulin Liu)
* Why selected in one sentence: It turns instrumented glove data into photorealistic bare-hand interaction video instead of treating sensing gloves as a dead-end data modality.

## Quick verdict

* Useful

This is a smart bridge paper: use sensing gloves to capture information normal RGB video misses, then render back into a bare-hand visual domain that downstream models actually want. The mechanism is more interesting than the headline. I only had abstract-level access, so I am not claiming detailed benchmark literacy.

## One-paragraph overview

Glove2Hand uses multi-modal sensing gloves as the capture interface for hand-object interaction, then synthesizes photorealistic bare-hand videos that preserve the underlying interaction dynamics. The pipeline combines a temporally consistent 3D Gaussian hand model with a diffusion-based hand restorer that blends the reconstructed hand into the observed scene. On top of that, the authors build HandSense, a glove-to-hand dataset with synchronized tactile and IMU signals, and argue that this synthetic-to-bare-hand conversion improves downstream tasks such as hand tracking and contact estimation under severe occlusion.

## Model definition

### Inputs
Glove-captured hand-object interaction video plus synchronized multi-modal glove signals such as tactile and IMU measurements.

### Outputs
Photorealistic bare-hand interaction video that preserves the captured interaction dynamics, along with data suitable for downstream HOI learning.

### Training objective (loss)
The accessible abstract confirms a 3D Gaussian hand model and a diffusion-based restoration stage, but it does not expose the exact reconstruction, perceptual, temporal, or diffusion losses.

### Architecture / parameterization
A 3D Gaussian hand model for temporally stable hand representation plus a diffusion-based hand restorer for realistic in-scene synthesis.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
Bare-hand HOI videos lose critical physical signals and suffer from heavy occlusion.

### 2. What is the method?
Capture HOI with multi-modal gloves, reconstruct a temporally stable Gaussian hand, then synthesize a realistic bare-hand video view.

### 3. What is the method motivation?
The glove has the information you want, but the visual domain you need for downstream learning is still bare hands.

### 4. What data does it use?
A new dataset called HandSense with glove-to-hand videos and synchronized tactile / IMU signals.

### 5. How is it evaluated?
On the synthesis task itself and on downstream bare-hand applications like contact estimation and hand tracking under occlusion.

### 6. What are the main results?
The paper claims HandSense and the Glove2Hand pipeline improve downstream HOI tasks, especially under occlusion. I did not verify exact margins.

### 7. What is actually novel?
Treating glove sensing as privileged supervision that gets translated back into a bare-hand visual domain.

### 8. What are the strengths?
The problem setup is practical, the representation choice is concrete, and the downstream use case is clear.

### 9. What are the weaknesses, limitations, or red flags?
Domain transfer could still leak artifacts. The quality of glove-to-hand synthesis may cap downstream usefulness.

### 10. What challenges or open problems remain?
Better object interaction realism, stronger hand-object contact supervision, and broader generalization beyond the capture setup.

### 11. What future work naturally follows?
Use the same setup for contact-rich manipulation datasets and policy pretraining.

### 12. Why does this matter?
Because HOI data collection is limited by occlusion exactly where interaction matters most.

### 13. What ideas are steal-worthy?
Capture in a privileged sensor domain, then render into the downstream training domain you actually need.

### 14. Final decision
Keep as a useful data-and-representation paper.
