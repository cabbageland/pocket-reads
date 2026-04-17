# Grid2Matrix: Revealing Digital Agnosia in Vision-Language Models

## Basic info

* Title: Grid2Matrix: Revealing Digital Agnosia in Vision-Language Models
* Authors: Yunkai Zhang, Linda Li, Yingxin Cui, Xiyuan Ruan, Zeyu Zheng, Kezhen Chen, Yi Zhang, Diji Yang
* Year: 2026
* Venue / source: arXiv preprint (cs.CV)
* Link: https://arxiv.org/abs/2604.09687
* PDF: https://arxiv.org/pdf/2604.09687.pdf
* Code: https://github.com/zhykoties/Grid2Matrix_DigitalAgnosia
* Date read: 2026-04-16
* Date surfaced: 2026-04-16
* Surfaced via: Tracy in #pocket-reads
* Why selected in one sentence: It is a clean attack on a blurry but important question—whether VLMs actually read dense visual structure faithfully, or just look smart on multimodal benchmarks that let them get away with sparse semantic cues.

## Quick verdict

* Highly relevant

This is a sharp, useful benchmark paper. The core idea is almost annoyingly simple: show a VLM a color grid plus a color→number legend and ask it to output the exact matrix. That strips away most semantic excuses and tests whether the model can actually preserve and express dense spatial detail. The result is ugly for current VLMs. End-to-end performance collapses on surprisingly small grids, often abruptly rather than gracefully, while probes of the isolated vision encoders show that much more of the structure is still internally recoverable. The paper names that representation-to-expression gap “Digital Agnosia,” and the term is a bit theatrical but directionally right.

## One-paragraph overview

Grid2Matrix (G2M) is a synthetic benchmark for dense spatial transcription. Each example contains an N×N color grid and a mapping from colors to integers; the model must output the exact integer matrix. Because the setup is procedural and semantically thin, failure is hard to explain away as world-knowledge confusion or benchmark weirdness. Across proprietary and open-weight VLMs, the authors find that exact-match performance falls off a cliff on modest grid sizes, even though the isolated vision encoders of open models still retain substantial recoverable information under a shallow spatial probe. This suggests that dense visual details are often encoded more faithfully than they are later preserved through multimodal projection and language generation. The rest of the paper digs into how this failure depends on spatial location, patch-grid alignment, model scaling, and multimodal alignment.

## Model definition

### Inputs
A synthetic image containing a fixed-resolution color grid plus a color-to-integer dictionary shown to the model.

### Outputs
An exact textual serialization of the corresponding integer matrix.

### Training objective (loss)
This is primarily a benchmark/analysis paper, not a new training method. The probing component freezes the open-weight vision encoder and trains a shallow convolutional spatial probe to predict the grid layout from the encoder features.

### Architecture / parameterization
The benchmark is evaluated on proprietary GPT-5 and Gemini-3 series models, plus open-weight Qwen3-VL and InternVL3.5 families. For open models, the paper probes the vision encoder before multimodal compression/projection to compare what is visually recoverable versus what the full VLM ultimately expresses.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
A lot of multimodal benchmarks reward high-level semantic competence without requiring a faithful readout of all image details. That leaves a hole: do VLMs actually preserve dense spatial information well enough for tasks like tables, charts, forms, and GUIs, or do they mostly look good when sparse cues are enough?

### 2. What is the method?
Build a controlled benchmark where the task is direct visual transcription rather than interpretation. The model sees a color grid and a color→number legend, then must emit the exact matrix. Difficulty is scaled by increasing grid size and number of colors while keeping image resolution fixed. For open-weight models, probe the frozen vision encoder with a shallow spatial decoder to test what information exists before multimodal projection and text generation.

### 3. What is the method motivation?
If you want to test dense spatial fidelity, natural images are too messy and semantically overloaded. A synthetic grid strips away excuses. If a model cannot reliably transcribe a small artificial grid, then claims about robust perception for structured visual tasks should be taken with a fistful of salt.

### 4. What data does it use?
Procedurally generated color-grid images at fixed 512×512 resolution, with controlled variation over grid size and palette size. The probing experiments use features from open-weight VLM vision encoders.

### 5. How is it evaluated?
With two main metrics:
- Exact Match: whether the full matrix is perfectly correct.
- Cell Accuracy: fraction of individual cells transcribed correctly.

The paper runs zero-shot end-to-end evaluation on proprietary and open-weight VLMs, then compares this to supervised spatial probing on extracted vision-encoder features. It also analyzes spatial error heatmaps, patch-grid alignment effects, scaling effects, and alignment effects.

### 6. What are the main results?
Several results are strong and clean:
- Proprietary models already crack early. GPT-5-mini drops to 0% Exact Match by 9×9 on 3-color grids, and Gemini-3-Flash—though much better—also eventually collapses, reaching 0% Exact Match by 20×20 while still keeping high cell accuracy.
- Open-weight models show the same general story: strong performance on tiny grids, rapid collapse as density rises, and zero exact-match performance by relatively modest sizes.
- The vision encoders of open models retain much more structure than end-to-end outputs reveal. On 32×32 grids, the probes for both InternVL3.5 and Qwen3-VL hit 100% Cell Accuracy even when the full model has already cratered.
- Errors are structured, not random. Different models show stable spatial blind spots and directional degradation patterns.
- Patch-grid alignment matters a lot: recoverability depends heavily on how cells intersect encoder patch boundaries.
- Standard fixes do not simply solve it. Model scaling and stronger multimodal alignment help in some ways but do not remove the representation-to-expression gap.

### 7. What is actually novel?
The novelty is less about algorithmics and more about measurement discipline. G2M gives a deliberately low-semantic, high-control test for dense spatial fidelity, and the paper’s strongest conceptual move is separating visual recoverability from language-level expression by probing the isolated encoder. That is what makes “Digital Agnosia” more than just a catchy complaint.

### 8. What are the strengths?
- Extremely clean benchmark design. Hard to hide behind semantics when the task is just reading a colored grid.
- The probe comparison is the whole paper’s backbone and it works: it localizes failure instead of merely reporting it.
- The patch-alignment analysis is useful because it turns failure from vague “model weakness” into something more mechanistic.
- The scaling and alignment sections avoid an easy fairy tale. Bigger and more aligned is not identical to better dense readout.
- The implications are practical: this failure mode matters for structured vision tasks people actually want VLMs to do.

### 9. What are the weaknesses, limitations, or red flags?
- It is still a synthetic diagnostic benchmark, so the jump from color grids to real documents and GUIs is suggestive rather than fully established.
- The term “Digital Agnosia” is memorable, but maybe slightly overdramatic for what is fundamentally a representation-to-expression bottleneck.
- The paper is strongest at showing that end-to-end VLM output is worse than the encoder probe, but weaker at fully pinning down which downstream component is most responsible: projector, alignment interface, autoregressive decoding, or LLM serialization limits.
- Some findings may be somewhat prompt/parsing-sensitive even though the paper tries to control formatting and decoding confounds.

### 10. What challenges or open problems remain?
The obvious next step is to build more natural but still controlled tasks that test the same dense-readout bottleneck in tables, charts, OCR-heavy forms, spreadsheets, and GUIs. There is also a systems question: how exactly does information get lost between encoder features and textual output, and which architectural changes help most?

### 11. What future work naturally follows?
- Benchmarks for real structured artifacts, not just synthetic grids.
- Better interfaces between visual encoders and LLMs for preserving local spatial topology.
- Non-textual or structured output heads for dense transcription tasks.
- Architectural studies that isolate whether the key failure is multimodal compression, alignment training, decoding, or context bottlenecks.
- Training interventions explicitly aimed at exhaustive readout rather than sparse semantic success.

### 12. Why does this matter?
Because a model that can talk intelligently about an image is not necessarily a model that can faithfully read it. That distinction matters a lot if you want reliable multimodal systems for spreadsheets, dashboards, GUI agents, forms, scientific figures, or anything else where one missed local detail can break the task.

## Why It Matters

This paper matters because it punches a hole in the lazy equation of “strong multimodal benchmark scores” with “strong visual fidelity.” G2M makes the uncomfortable point that VLMs may internally retain more visual detail than they can actually surface in language, which means the bottleneck is not just seeing but preserving and expressing what was seen. That is a meaningful design warning for basically the entire current VLM stack.

### 13. What ideas are steal-worthy?
- Separate visual recoverability from end-to-end generation quality with targeted probing.
- Use synthetic tasks not as toys but as scalpels for isolating model failure modes.
- Treat patch-boundary interactions as first-class analysis targets when evaluating dense perception.
- Stop assuming model scaling fixes perception problems just because it fixes benchmark scores.
- For structured visual tasks, consider outputs and interfaces that are not forced through fragile free-form language serialization.

### 14. Final decision
Keep. This is a genuinely useful benchmark paper: clean setup, clear failure mode, and a diagnosis that should make anyone building document/GUI/table VLM systems at least mildly uncomfortable.
