# VLM4VLA: Revisiting Vision-Language-Models in Vision-Language-Action Models

## Basic info

* Title: VLM4VLA: Revisiting Vision-Language-Models in Vision-Language-Action Models
* Authors: Jianke Zhang, Xiaoyu Chen, Qiuyue Wang, Mingsheng Li, Yanjiang Guo, Yucheng Hu, Jiajun Zhang, Shuai Bai, Junyang Lin, Jianyu Chen
* Year: 2026
* Venue / source: ICLR 2026 poster / arXiv preprint
* Link: https://arxiv.org/abs/2601.03309
* Date read: 2026-03-31
* Date surfaced: 2026-03-02 (via Zhiwen Fan)
* Why selected in one sentence: It asks a needed uncomfortable question: do stronger general VLMs actually make stronger VLA policies.

## Quick verdict

* Highly relevant

The paper is worth keeping because it cuts against a lazy embodied-AI assumption. Stronger general VLM competence does not automatically translate into better control. That is the kind of negative or corrective result the field needs more of.

## One-paragraph overview

VLM4VLA builds a minimal adaptation pipeline that turns general-purpose VLMs into VLA policies with only a small number of added trainable parameters, specifically to make the comparison fair. Across multiple benchmarks, the paper finds that general VLM strength is a poor predictor of downstream control performance. It also probes several embodied auxiliary tasks and finds that improving those skills in the VLM does not reliably improve control either. The deeper conclusion is that embodied control likely wants capabilities current VLM pretraining does not optimize for.

## Model definition

### Inputs
Visual observations, language instructions, and the robot-control context required by downstream VLA tasks.

### Outputs
Robot policy actions under the minimal VLM-to-VLA adaptation pipeline.

### Training objective (loss)
The paper adapts pretrained VLMs into VLA policies with lightweight trainable parameters, but the accessible sources did not expose the exact control losses in detail.

### Architecture / parameterization
A minimal VLM-to-VLA adaptation pipeline designed for controlled comparison across different base VLMs.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
Whether choice of base VLM and its capabilities meaningfully predict downstream VLA performance.

### 2. What is the method?
Convert several VLMs into VLA policies with a minimal adaptation pipeline, then compare them across benchmarks and auxiliary embodied skills.

### 3. What is the method motivation?
The field keeps assuming better VLMs will naturally yield better VLAs, but that assumption was never properly stress-tested.

### 4. What data does it use?
Three downstream benchmarks and seven auxiliary embodied tasks, according to the accessible abstract.

### 5. How is it evaluated?
By comparing downstream control performance across different base VLMs and adaptation settings.

### 6. What are the main results?
General VLM capability is a poor predictor of VLA performance; auxiliary embodied-skill improvements do not reliably help control; the vision encoder is a major bottleneck.

### 7. What is actually novel?
The controlled comparison setup and the willingness to report that the obvious scaling story mostly fails.

### 8. What are the strengths?
Clear question, fairer comparison pipeline, and genuinely useful negative findings.

### 9. What are the weaknesses, limitations, or red flags?
Benchmark coverage still matters, and minimal adaptation may understate what a more optimized system could do.

### 10. What challenges or open problems remain?
Figure out which pretraining capabilities actually matter for embodied control.

### 11. What future work naturally follows?
Embodied pretraining objectives, stronger visual encoders, and better transfer diagnostics.

### 12. Why does this matter?
Because VLA design is currently too dependent on cargo-culting whatever wins generic VLM evals.

### 13. What ideas are steal-worthy?
Run controlled conversion pipelines to isolate backbone value instead of comparing giant end-to-end systems.

### 14. Final decision
Keep. Very good corrective paper.
