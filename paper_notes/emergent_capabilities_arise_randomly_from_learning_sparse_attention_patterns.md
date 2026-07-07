---
title: Emergent Capabilities Arise Randomly from Learning Sparse Attention Patterns
slug: emergent-capabilities-arise-randomly-from-learning-sparse-attention-patterns
authors: Vatsal Baherwani, Zixi Chen, Shikai Qiu, Andrew Gordon Wilson, Pavel Izmailov
year: 2026
venue: arXiv preprint (cs.LG)
date_read: 2026-07-06
paper_url: https://arxiv.org/abs/2606.25010
pdf_url: https://arxiv.org/pdf/2606.25010
verdict: Keep as a mechanistic emergence paper, with scale and task-scope caveats
summary: This paper argues that some language-model capabilities look random and abrupt because they depend on discovering task-relevant sparse attention patterns. The authors study Pythia checkpoints across scales and random seeds, probe tasks such as copying, in-context repetition, pattern completion, and indirect object identification, and show that capability jumps coincide with learned attention patterns. Causal attention patching is the sharpest evidence: transplanting post-emergence attention maps from selected heads into a pre-emergence checkpoint can recover much of the capability before it naturally appears. The paper then isolates the bottleneck with synthetic linear-map and cellular-automata tasks where the ground-truth token dependencies are known, showing that context length and intermediate sparsity make attention-pattern search hard, while more heads and certain token-mixing architectures can help.
why_it_matters: This is useful because it gives a concrete mechanism behind a slippery word: emergence. The claim is not that capabilities appear by magic, but that discrete internal pattern discoveries can be invisible in smooth aggregate loss curves and then surface as sudden downstream jumps. For long-context and agentic systems, the most steal-worthy lesson is that finding the right tokens may be the bottleneck, not doing the computation after they are found.
final_decision: Keep. Cite it for stochastic emergence across seeds and training time, causal attention-head patching around emergence, and synthetic evidence that sparse/long-context token-mixing patterns are hard for transformers to discover. Do not overgeneralize it to all frontier capabilities: the natural-language experiments use Pythia models below 1B parameters, several probes are single-sample next-token tasks, and the synthetic tasks are deliberately simplified.
tags: emergence, mechanistic-interpretability, attention-patterns, sparse-attention, transformers, scaling-laws, pythia, induction-heads, in-context-learning, abrupt-learning, phase-transitions, token-mixing, long-context, synthetic-tasks, mlp-mixer, architecture, pretraining-dynamics
---

# Emergent Capabilities Arise Randomly from Learning Sparse Attention Patterns

## Basic info

* Title: Emergent Capabilities Arise Randomly from Learning Sparse Attention Patterns
* Blog title: Why Language Model Capabilities Emerge Randomly
* Authors: Vatsal Baherwani, Zixi Chen, Shikai Qiu, Andrew Gordon Wilson, Pavel Izmailov
* Year: 2026
* Venue / source: arXiv preprint (cs.LG)
* Link: https://arxiv.org/abs/2606.25010
* PDF: https://arxiv.org/pdf/2606.25010
* DOI: https://doi.org/10.48550/arXiv.2606.25010
* arXiv version inspected: v1, submitted 2026-06-23
* Blog post: https://vatsal0.github.io/blog/emergence.html
* Blog published: 2026-06-25
* Date read: 2026-07-06
* Date surfaced: 2026-07-03
* Surfaced via: Tracy in #pocket-reads via the author blog post
* Code: Not found on the blog, arXiv page, or paper text.
* Why selected in one sentence: It gives a mechanistic explanation for why capabilities can look seed-random and phase-change abrupt even while training loss scales smoothly.

## Quick verdict

Keep as a mechanistic emergence paper, with scale and task-scope caveats.

This is a clean, useful paper because it replaces "emergence is mysterious" with a more inspectable story: a capability can hinge on whether the model discovers the right token-mixing pattern. If that pattern is found suddenly, downstream behavior jumps. If one random seed finds it and another does not, emergence looks random at fixed scale.

The strongest evidence is the causal patching result around Pythia checkpoints. The authors identify the first checkpoint where a probe capability appears, then patch post-emergence attention maps into the immediately previous checkpoint. For selected heads, this recovers much of the capability before it would have appeared naturally. That is a real mechanistic claim, not just a curve-fitting story.

The caveat is that the natural-language experiments are small-to-mid Pythia models and deliberately narrow next-token probes. The synthetic tasks are valuable precisely because they are simplified. So the paper is best read as evidence for one important emergence mechanism, not a universal theory of all frontier-model capability jumps.

## One-paragraph overview

The paper studies why some downstream language-model capabilities appear abruptly and at seed-dependent training points. In Pythia models from 14M to 410M parameters, the authors track when simple capabilities such as copying, in-context repetition, pattern completion, and indirect object identification first become solvable under greedy next-token prediction. They find that larger models acquire these skills earlier and more often, but the exact emergence point varies by initialization. Around the emergence checkpoint, attention heads shift into interpretable task-relevant patterns, and causal attention patching can transfer post-emergence patterns into a pre-emergence model to elicit the capability early. To isolate the mechanism, the paper then trains transformers on synthetic linear-map and cellular-automata tasks where the ground-truth attention pattern is known. Those experiments show that context length and medium sparsity make pattern discovery difficult; attention biases toward the ground-truth pattern remove long loss plateaus; more heads help more than simply making heads wider; and MLP-Mixer can outperform transformers on fixed positional linear-map patterns.

## What problem is the paper trying to solve?

Scaling laws make pretraining loss look smooth and predictable, but downstream capabilities often do not feel smooth. A model either copies, retrieves, follows an in-context pattern, or handles a circuit-like linguistic dependency, or it does not. Prior work also showed that emergence at a fixed scale can depend heavily on random initialization.

The paper asks what changes inside the model when a capability suddenly appears. More specifically:

* why does emergence vary across random seeds?
* why does a capability appear abruptly during training?
* why do larger models acquire the same capability earlier and more reliably?
* and can these effects be explained by learning specific attention patterns?

That is the right question. The paper does not try to relitigate whether all emergent-ability plots are metric artifacts. It asks what internal event could make a real continuous probability metric jump sharply.

## Method

The paper has two halves: observational mechanistic analysis on pretrained language-model checkpoints, then controlled synthetic training experiments.

### Pythia emergence probes

The authors use the Pythia suite because it exposes checkpoints across training and multiple random seeds. They evaluate models from 14M to 410M parameters, with ten initialization seeds per scale.

For a given prompt and target token, a capability is counted as emerged when greedy next-token prediction first returns the target token. The paper then binary-searches checkpoints to estimate the point of emergence.

Tasks include:

* copying / repetition,
* in-context repetition related to induction-style behavior,
* pattern completion in numbered-list style prompts,
* indirect object identification.

Several probes are single-sample evaluations. The paper argues this is useful for pinpointing exact emergence timing, and the appendix checks multi-sample overlap for causal heads, but this is still an important scope caveat.

### Causal attention-head patching

For each task, the authors compare the pre-emergence checkpoint with the first post-emergence checkpoint. They take attention score patterns from individual heads in the post-emergence model and patch them into the pre-emergence model while keeping the rest of the old model.

They then measure how much the correct target probability increases. The top causal heads often correspond to interpretable patterns such as previous-token, copy, induction-like, or name-mover behavior.

The key result is that patching a small set of learned attention patterns can recover much of the capability jump. That implies the abrupt behavior is not merely output noise: the model learned a token-routing pattern that was missing before.

### Synthetic tasks with known token dependencies

The authors then build synthetic settings where the correct token-mixing pattern is explicit.

The linear-map task uses binary state vectors. The next state is produced by applying a sparse binary matrix mod 2. Each output position depends on a subset of input positions, so the sparse matrix defines the ground-truth attention pattern.

The cellular-automata task uses trajectories of discrete states. Each next-state cell depends on a local window of the previous state, and in the multi-rule setup the model must infer the active rule from context before predicting.

These tasks let the authors vary:

* state size / context length,
* sparsity,
* number of heads,
* head dimension,
* depth,
* and token-mixing architecture.

## Main findings

### 1. Emergence is seed-dependent and training-time-dependent

At small scales, some Pythia seeds learn a capability and others never do by the final checkpoint. Larger models solve the same probes more often and earlier on average.

This supports the "random scaling" view: scale increases the probability and speed of capability acquisition, but the event itself still depends on whether training discovers the relevant internal pattern.

### 2. Capability jumps coincide with learned attention patterns

When the model starts solving a task, relevant attention heads often change from diffuse or wrong routing into interpretable task-relevant patterns.

For copying, the paper points to previous-token and copy-like heads. For indirect object identification, selected heads resemble name-mover behavior, shifting attention toward the correct entity.

The causal patching result is the strongest part: transferring post-emergence attention maps into the previous checkpoint can elicit the capability early.

### 3. Pattern discovery is the bottleneck in the synthetic tasks

In the linear-map task, loss drops occur row by row, and individual output-token losses can stay flat for a long time before abruptly falling. Those drops correspond to attention entropy drops in specific heads and to learning a row of the ground-truth sparse matrix.

When the authors bias attention logits toward the ground-truth pattern, the loss plateau disappears and the model learns quickly. That is a strong indication that the difficult part is finding the right token dependencies, not computing the mod-2 output once the dependencies are routed.

### 4. Context length and intermediate sparsity make discovery hard

Very sparse and very dense patterns are easier. Medium-sparsity patterns are hardest because the search space over possible dependencies is largest.

Longer context makes even simple local dependencies harder to learn. In cellular automata, increasing state size turns a fixed local-window problem into a needle-in-a-haystack routing problem, stretching the initial loss plateau or making the task fail within the training budget.

The appendix extends this point: varying state size and trajectory length matters more for plateau length than several other cellular-automata parameters, unless the task becomes globally too hard.

### 5. More heads help because they create more parallel search attempts

Increasing the number of attention heads consistently helps on the synthetic tasks. At fixed width, many small heads can beat fewer large heads on the linear-map task.

The paper's intuition is basically a lottery-ticket story for heads: more heads means more independent chances to discover the right token-mixing pattern.

There is a qualification. Cellular automata still needs enough head dimension to store or infer rule information, so head count is not the only axis that matters.

### 6. Architecture matters, but not in a one-size-fits-all way

MLP-Mixer beats transformers by a large margin on the linear-map task, presumably because a learned sequence-dimension MLP can express fixed positional token dependencies more directly than dot-product attention.

But MLP-Mixer underperforms on cellular automata, where the relevant token mixing is context-dependent. Other alternatives tested in the appendix, including Mamba, Gated DeltaNet, RWKV, xLSTM, and linear RNN variants, generally underperform transformers in these synthetic settings.

The right takeaway is not "MLP-Mixer is better." It is that different token-mixing mechanisms have different inductive biases for discovering sparse patterns.

## What is actually novel?

The novelty is the bridge between three observations that are often discussed separately:

* emergence can be abrupt,
* emergence can depend on random seed,
* and attention heads can implement discrete algorithmic primitives.

The paper ties these together with causal patching and controlled synthetic tasks. The result is a concrete mechanism: downstream capability appears when training discovers a sparse token-routing pattern that was previously missing.

It also contributes a useful experimental frame. Instead of only asking whether a model has a capability at the end of training, it asks when the capability appears, which heads changed, whether those heads causally matter, and what synthetic knobs make analogous pattern discovery easier or harder.

## Strengths

The paper's explanation is satisfyingly mechanical. It does not just say "larger models have more capacity." It says larger models may have more parallel opportunities to find the right attention patterns, especially through more heads.

The causal attention patching is much stronger than just plotting attention maps after the fact. It tests whether the learned patterns can move behavior.

The synthetic experiments are well chosen. Linear maps make the exact sparse dependency graph visible. Cellular automata adds context-dependent rule inference and long-context pressure.

The paper is also careful about the metric-artifact concern. It shows sharp jumps in correct-token probability, not only thresholded accuracy.

The architecture section is useful even though it is narrow. It pushes the discussion from "scale harder" toward "what inductive biases make token dependency discovery easier?"

## Weaknesses and caveats

The natural-language models are small by current standards: Pythia up to 410M parameters in the main experiments. The authors explicitly note the open question of whether the same mechanism explains more sophisticated capabilities in larger models.

Several Pythia probes are single-sample next-token tasks. That makes emergence timing and head analysis tractable, but it is not the same as showing broad benchmark-level capability acquisition.

The synthetic tasks are intentionally artificial. That is a strength for causal control, but it means the claims transfer as mechanism hypotheses, not direct evidence about all real-world LLM skills.

The paper focuses on attention patterns. Some capabilities may bottleneck on other things: representation learning, memorized facts, tool-use policies, multi-step search, reward-shaped post-training, or data coverage.

The architecture results are not a simple prescription. MLP-Mixer helps on fixed positional linear maps and hurts on cellular automata. The broader lesson is about inductive bias, not about replacing transformers wholesale.

## Why this matters

This matters because "emergence" is often used as a fog machine. This paper gives the term a cleaner mechanistic interpretation for at least one class of abilities: a discrete internal routing pattern appears, and downstream behavior changes abruptly.

For long-context systems, the implication is especially sharp. Many agent and coding failures are not about doing hard computation after the relevant evidence is found. They are about finding the relevant needle in a huge context. If attention-pattern discovery is the bottleneck during training, then architectural and data interventions should target token routing directly.

The paper also makes smooth loss curves look less reassuring. Two models can have similar aggregate training loss but different downstream circuits because they discovered different sparse patterns. That is a useful warning for evaluation and ensembling.

## Ideas to steal

* Track when capabilities emerge during training, not just whether they exist at the end.
* Use continuous target-token probability to avoid confusing thresholded metrics with real discontinuities.
* Around an emergence point, compare pre/post attention maps and patch candidate heads causally.
* Treat long-context learning as a token-routing search problem.
* Scale head count as a way to increase parallel pattern-search attempts, while preserving enough per-head capacity for tasks that need state/rule inference.
* Explore attention biases, distillation of attention maps, or data pretraining that makes useful sparse routing patterns easier to find.
* Do not assume all equal-loss checkpoints have equal downstream circuits.

## Final decision

Keep.

This is a strong mechanistic note for the emergence pile. The most important sentence to remember is: sudden capability jumps can be the visible surface of sparse attention-pattern discovery.

Use it as support for architecture/training work that targets token routing, sparse attention, long-context retrieval, and capability emergence across random seeds. Keep the caveat attached: small Pythia probes plus synthetic tasks are not the whole story of frontier emergence.
