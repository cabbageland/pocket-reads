# A Survey on Dataset Distillation: Approaches, Applications and Future Directions

## Basic info

* Title: A Survey on Dataset Distillation: Approaches, Applications and Future Directions
* Authors: Jiahui Geng, Zongxiong Chen, Yuandou Wang, Herbert Woisetschlaeger, Sonja Schimmler, Ruben Mayer, Zhiming Zhao, Chunming Rong
* Year: 2023
* Venue / source: arXiv preprint
* Link: https://arxiv.org/abs/2305.01975
* Date read: 2026-06-29
* Date surfaced: 2026-06-29 (via Tracy)
* Why selected in one sentence: It is a compact taxonomy for dataset distillation, useful for orienting around methods, modalities, and applications before diving into newer work.

## Quick verdict

* Useful, but dated

This is a map paper, not a method paper. Its value is that it organizes dataset distillation into a usable taxonomy: learning frameworks, enhancement methods, data modalities, and applications. The caveat is obvious in 2026: a 2023 survey will miss a lot of recent scaling, generative, and foundation-model-era work. Still worth keeping as a clean baseline reference.

## One-paragraph overview

The survey frames dataset distillation as the problem of replacing a large training set with a much smaller synthetic set that preserves enough training signal for downstream models. It organizes the field around three axes. First, approaches: meta-learning methods such as back-propagation-through-time and kernel ridge regression, and surrogate-objective methods such as parameter matching and distribution matching. Second, enhancement methods: parameterization, augmentation, and label distillation. Third, scope: image, audio, text, and graph modalities, plus applications in continual learning, neural architecture search, privacy-preserving data release, federated learning, and robustness. The paper's strongest contribution is not a new claim about performance. It is a readable decomposition of a messy area whose methods otherwise blur together.

## Model definition

### Inputs
A body of dataset-distillation literature covering synthetic-data optimization methods, benchmarks, data modalities, and application settings.

### Outputs
A taxonomy and qualitative review of dataset distillation approaches, use cases, and open problems.

### Training objective (loss)
Not applicable as a survey contribution. The paper does describe common objectives used by reviewed methods, including bi-level meta-learning, parameter/gradient matching, distribution matching, and kernel-based objectives.

### Architecture / parameterization
Not a new architecture. The paper is a literature survey and taxonomy.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
Dataset distillation has many related method families and application claims, but the field can be hard to navigate because "make a tiny useful dataset" can mean different objectives, representations, and deployment goals.

### 2. What is the method?
The authors propose a taxonomy and use it to review representative dataset-distillation work. The taxonomy divides the field by approach, data modality, and application.

### 3. What is the method motivation?
Training on full datasets is increasingly expensive, and many downstream workflows need compact training proxies: architecture search, continual learning, federated learning, privacy-aware data release, and fast experimentation.

### 4. What data does it use?
It is a survey, so the "data" is prior literature rather than a new benchmark. The reviewed modalities include image, audio, text, and graph data, with most mature work concentrated in image datasets.

### 5. How is it evaluated?
Qualitatively, through taxonomy construction and comparison of existing method families. It does not introduce a new benchmark, meta-analysis, or controlled reproduction.

### 6. What are the main results?
The survey groups learning frameworks into meta-learning and surrogate-objective methods.

Meta-learning includes direct optimization through training, such as back-propagation through time, and kernel-based variants such as KIP-style kernel ridge regression.

Surrogate-objective methods include parameter matching, gradient matching, trajectory matching, and distribution matching.

Common enhancement tricks include synthetic-data parameterization, differentiable augmentation, and label distillation.

Most work is image-centric because images are continuous and directly optimizable; text and graph distillation remain much less mature because discreteness and structure make optimization and interpretation harder.

The main application clusters are computationally intensive tasks, privacy-related settings, and robustness.

### 7. What is actually novel?
The novelty is the organization. The paper provides a structured taxonomy and connects method families to modalities and use cases.

### 8. What are the strengths?
The taxonomy is easy to remember. It separates core learning objectives from add-on enhancement methods, which is useful because papers often mix those together. It also does not pretend the field is equally mature across modalities: images dominate, while text and graphs remain hard.

### 9. What are the weaknesses, limitations, or red flags?
The paper is already dated. It was last revised in August 2023, so it cannot capture later foundation-model-era data distillation, synthetic-data generation, or dataset-pruning work.

It is also a qualitative survey rather than a benchmarked reproduction. That makes it good for orientation but weak for deciding which method actually wins under a modern setup.

The taxonomy is useful but somewhat broad: applications such as privacy, federated learning, and robustness need much more skeptical treatment than a short survey section can provide.

### 10. What challenges or open problems remain?
Computational efficiency remains a bottleneck, especially for methods that unroll training or store expensive expert trajectories. Performance can degrade as the number of images per class increases, sometimes approaching random sampling. Non-image modalities are still awkward. Weak-label and structured-output tasks such as detection, segmentation, summarization, and translation are underexplored.

### 11. What future work naturally follows?
Modernize the taxonomy with post-2023 methods, especially generative priors and foundation-model-assisted dataset synthesis. Build stronger cross-architecture and cross-task evaluations. Treat privacy claims rigorously rather than assuming synthetic equals safe. Push beyond image classification into language, graph, and structured prediction tasks.

### 12. Why does this matter?
Dataset distillation is one of the cleaner ways to ask what information a training set really contains. Even when the methods are not production-ready, the framing is valuable: can we compress data into a small object that still teaches the model the right behavior?

### 13. What ideas are steal-worthy?
Separate the distillation objective from enhancement tricks.

Use the approach / modality / application triad as a first-pass map when reading dataset-distillation papers.

Be suspicious of claims that transfer from image classification to text, graphs, or structured prediction without modality-specific evidence.

Treat privacy-preserving synthetic data as an empirical and formal claim, not a vibe.

### 14. Final decision
Keep as an orientation reference. It is not the latest map of dataset distillation, but it is still a useful starting scaffold.

## Why It Matters

Dataset distillation is one of the cleaner ways to ask what information a training set really contains. Even when the methods are not production-ready, the framing is valuable: can we compress data into a small object that still teaches the model the right behavior?

## Final Decision

Keep as an orientation reference. It is not the latest map of dataset distillation, but it is still a useful starting scaffold.
