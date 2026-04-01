# VLM4VLA: Revisiting Vision-Language-Models in Vision-Language-Action Models

## Basic info

* Title: VLM4VLA: Revisiting Vision-Language-Models in Vision-Language-Action Models
* Authors: Jianke Zhang, Xiaoyu Chen, Yanjiang Guo, Yucheng Hu, Jianyu Chen
* Year: 2026
* Venue / source: ICLR 2026 poster / OpenReview PDF
* Link: https://openreview.net/forum?id=tc2UsBeODW
* Date read: 2026-03-31
* Date surfaced: 2026-03-02 (via Zhiwen Fan)
* Why selected in one sentence: It asks a needed uncomfortable question: do stronger general VLMs actually make stronger VLA policies.

## Quick verdict

* Highly relevant

This note is worth keeping because the paper actually does the annoying controlled comparison most VLA work handwaves away. The result is sharper than "bigger VLMs are not always better." Their minimalist adapter is competitive enough that the backbone comparison matters, and the mismatch across CALVIN, SIMPLER, and LIBERO makes it hard to keep pretending generic VLM leaderboard strength is a reliable proxy for control quality.

## One-paragraph overview

VLM4VLA builds a deliberately small adapter that turns a pretrained VLM into a robot policy with fewer than 1% new parameters and a deterministic MLP action head instead of a stochastic diffusion decoder. That design is the whole point: keep the policy head boring so the paper can isolate what the VLM backbone itself contributes. Using this setup, the authors compare seven open VLM backbones and 17 total variants across CALVIN ABC-D, SIMPLER-Bridge, and LIBERO-10, then run follow-up studies on auxiliary embodied finetuning and vision-encoder training. The headline finding is not that pretraining is useless. Pretraining helps a lot versus training from scratch, but better generic VLM capability only predicts one benchmark well and transfers weakly or inconsistently to the others. Even more damaging to the usual story, finetuning VLMs on seven embodied auxiliary tasks mostly hurts downstream control, while injecting control-relevant supervision into the vision encoder gives consistent gains. The paper's real contribution is turning "VLM for VLA" from a vibes claim into a falsifiable interface study.

## Model definition

### Inputs
Image observations and language instructions only. The framework intentionally excludes proprioception and other extra modalities to isolate what the VLM contributes.

### Outputs
A 7D continuous action prediction produced by a lightweight policy head attached to the VLM backbone.

### Training objective (loss)
Downstream robot imitation learning on benchmark-specific robot data, using a deterministic policy head rather than a diffusion action decoder. The paper frames this as a clean finetuning interface instead of a new learning objective contribution.

### Architecture / parameterization
The backbone VLM produces multimodal features, then VLM4VLA adds a tiny action module with one learnable token and a two-layer MLP-style policy head. The extra trainable parameter count is in the single-digit millions to low tens of millions depending on hidden size, which is under 1% of the backbone. The backbone set includes Qwen2.5-VL, Qwen3-VL, PaliGemma, KosMos-2, and InternVL variants.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
VLA papers keep attributing control quality to the underlying VLM, but the field rarely measures that cleanly because backbone changes are entangled with different action heads, training recipes, and extra modalities.

### 2. What is the method?
Build one standardized VLM-to-VLA adapter, plug in different pretrained VLMs, finetune them under the same training recipe, and compare them across three manipulation benchmarks. Then run two deeper ablations: whether embodied auxiliary-task finetuning helps, and whether the vision encoder or language module is the real bottleneck.

### 3. What is the method motivation?
If you want to know whether a VLM is actually useful for robot control, stop changing ten other things at the same time. The paper's minimalist adapter is basically a measurement instrument.

### 4. What data does it use?
The downstream policy study uses three standard control benchmarks: CALVIN ABC-D, SIMPLER-Bridge, and LIBERO-10. For the auxiliary-task study, the paper uses seven embodied or quasi-embodied finetuning sources around Qwen2.5-VL, including Robopoint, Vica-332k, BridgeVQA, Robo2VLM, RoboBrain2, Omni-Generation, and VQA-Mix.

### 5. How is it evaluated?
By downstream manipulation performance on the three benchmarks, plus correlation analysis between generic VLM capability and control scores, plus ablations on pretrained versus scratch initialization and frozen versus finetuned vision encoders.

### 6. What are the main results?
On CALVIN, Qwen2.5-VL-7B reaches an average of 4.057 completed tasks, beating reproduced OpenVLA at 2.548 and beating reproduced pi0 at 3.509 in this controlled setup. On SIMPLER-Bridge, the best VLM4VLA result is Qwen3-VL-4B at 56.3 average success, while on LIBERO-10 reproduced ThinkAct remains strongest at 70.9 because it uses proprioceptive state information that VLM4VLA intentionally omits. Pretraining matters a lot: Qwen2.5-VL-7B drops from 4.057 to 1.769 on CALVIN and from 46.75 to 18.20 on SIMPLER when trained from scratch. But generic VLM capability only correlates strongly with CALVIN; the paper reports weak correlation on SIMPLER and LIBERO. Auxiliary embodied finetuning mostly degrades CALVIN performance, and the least harmful variant is the broad VQA-Mix rather than narrowly embodied data.

### 7. What is actually novel?
The novelty is not a fancy policy architecture. It is the controlled experimental interface plus the empirical conclusion that current VLM competence and current VLA competence are only loosely aligned. That is much more useful than another benchmark win from a bespoke stack.

### 8. What are the strengths?
The adapter is simple enough to make the comparison believable. The paper checks multiple benchmarks instead of one convenient environment. It also avoids the usual escape hatch by showing that pretraining is genuinely useful while still arguing that current VLM objectives are misaligned with embodied control.

### 9. What are the weaknesses, limitations, or red flags?
The framework intentionally excludes proprioception and uses a simple deterministic head, so it is measuring one important slice of VLM usefulness rather than the full design space of VLAs. The strong CALVIN correlation versus weak SIMPLER/LIBERO correlation also suggests benchmark-specific artifacts still matter.

### 10. What challenges or open problems remain?
Identify which pretraining signals actually help control, especially in the vision encoder. Build embodied pretraining tasks that transfer without collapsing other useful capabilities. Separate genuine planning skill from dataset- or benchmark-specific shortcut behavior.

### 11. What future work naturally follows?
Use the same controlled interface to test stronger visual pretraining, action-aware visual supervision, proprioception reintroduction under matched conditions, and cross-embodiment or long-horizon settings where the current gap may widen further.

### 12. Why does this matter?
Because a lot of VLA design is still cargo culting general VLM progress. This paper says the transfer is real but partial, and that the missing piece is probably not in the language head at all.

### 13. What ideas are steal-worthy?
Use a tiny deterministic adapter as a measurement tool. Compare pretrained backbones under one policy head before making sweeping claims about "foundation model transfer." Treat the vision encoder as the first suspect when VLM-to-control transfer underperforms.

### 14. Final decision
Keep. Strong corrective paper and much better than the old abstract-level note.
