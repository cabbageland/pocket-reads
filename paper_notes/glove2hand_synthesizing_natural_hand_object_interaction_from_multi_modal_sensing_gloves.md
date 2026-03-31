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

* Useful, but unfinished

This is still worth keeping, but it is not finished to repo standard yet because I could not recover readable full-paper text beyond the abstract-level artifact and project snippets. The core idea remains good: treat sensing gloves as privileged capture hardware, then synthesize back into a bare-hand visual domain that ordinary HOI models can use. But the old note overstated how deeply this had been read.

## One-paragraph overview

Glove2Hand uses multi-modal sensing gloves as the capture interface for hand-object interaction, then synthesizes photorealistic bare-hand videos that preserve the recorded interaction dynamics. From the accessible primary material, the pipeline has two main stages: a temporally consistent 3D Gaussian hand representation that reconstructs the glove-captured interaction geometry, and a diffusion-based hand restoration stage that inserts a realistic bare hand back into the scene. The paper also introduces HandSense, a glove-to-hand dataset with synchronized tactile and IMU signals. The intended payoff is that privileged glove sensing solves the hardest occlusion and contact-visibility problems during capture, while the final output remains in the bare-hand visual domain that downstream vision systems actually want.

## Model definition

### Inputs
Glove-captured hand-object interaction video plus synchronized multi-modal glove signals such as tactile and IMU measurements.

### Outputs
Photorealistic bare-hand interaction video that preserves the captured interaction dynamics, along with data suitable for downstream HOI learning.

### Training objective (loss)
I could verify the two-stage pipeline from the accessible paper artifact, but not the exact loss breakdown. This note should therefore be treated as partial-access honest: mechanism shape is known, detailed objective accounting is not.

### Architecture / parameterization
A temporally stable 3D Gaussian hand model followed by a diffusion-based hand restorer that maps from glove-observed interaction capture back to a photorealistic bare-hand scene.

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
On both synthesis fidelity and downstream bare-hand HOI tasks such as hand tracking and contact estimation under occlusion. I could verify those task categories, but not the full benchmark protocol.

### 6. What are the main results?
The primary claim is that Glove2Hand produces useful bare-hand interaction data from glove-captured sequences and improves downstream HOI tasks, especially in cases where occlusion makes ordinary visual supervision weak. Exact margins remain unverified in this note because full table access was not available.

### 7. What is actually novel?
Treating glove sensing as privileged supervision that gets translated back into a bare-hand visual domain.

### 8. What are the strengths?
The problem setup is practical, the representation choice is concrete, and the downstream use case is clear.

### 9. What are the weaknesses, limitations, or red flags?
The biggest limitation is still access: until I can read the full paper text, this note should not be treated as fully resolved. Methodologically, domain-transfer artifacts, glove-specific capture bias, and restoration errors around contact regions are the obvious risks.

### 10. What challenges or open problems remain?
Better object interaction realism, stronger hand-object contact supervision, and broader generalization beyond the capture setup.

### 11. What future work naturally follows?
Use the same setup for contact-rich manipulation datasets and policy pretraining.

### 12. Why does this matter?
Because HOI data collection is limited by occlusion exactly where interaction matters most.

### 13. What ideas are steal-worthy?
Capture in a privileged sensor domain, then render into the downstream training domain you actually need.

### 14. Final decision
Keep, but mark mentally as not yet fully deep-read. Revisit once a reliably readable full paper source is available.
