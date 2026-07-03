---
title: From Brewing to Resolution: Tracing the Internal Lifecycle of Code Reasoning in LLMs
slug: from-brewing-to-resolution-tracing-the-internal-lifecycle-of-code-reasoning-in-llms
authors: Siyue Chen, Yifu Guo, Yuquan Lu, Zishan Xu, Jiaye Lin, Jianbo Lin, Siyu Zhang, Cheng Yang, Junxin Li, Yujia Li, Yu Huo, Ruixuan Wang
year: 2026
venue: arXiv preprint (cs.AI)
date_read: 2026-07-03
paper_url: https://arxiv.org/abs/2606.17648
pdf_url: https://arxiv.org/pdf/2606.17648
verdict: Keep. Strong diagnostic paper for layer-wise reasoning dynamics and adaptive-depth/self-iteration design.
summary: This paper studies code reasoning as a layer-wise lifecycle rather than a final-output event. It pairs linear probing, which tests whether the answer is externally readable from a hidden state, with Context-Stripped Decoding, which tests whether the model can itself decode that answer from the same layer once the original code context is removed. The gap between those two moments is called brewing: answer information appears early, but it takes many more layers before it becomes self-decodable. On six synthetic code-reasoning task families across 16 decoder-only models, the anchor Qwen2.5-Coder-7B resolves only 41.5% of brewing samples; 26.4% are overprocessed, 8.5% misresolved, and 23.7% unresolved. The key practical lesson is that extra depth is not uniformly good: overprocessed samples need stopping or rollback, while unresolved samples need more computation or re-injection. That makes the paper directly relevant to layer-level self-iteration, adaptive depth, and runtime reasoning-state monitors.
why_it_matters: The paper gives a concrete reason not to treat transformer depth as a dumb more-compute knob. Some examples contain the answer early and are later corrupted; others have partial information but need more layers. Layer-level self-iteration only makes sense if it can tell those states apart. Otherwise it will keep thinking when it should stop, or stop when it should keep brewing.
final_decision: Keep and connect to layer-level self-iteration. Use it as evidence that internal reasoning has phase structure, that availability and readiness are different, and that adaptive-depth policies need outcome-aware signals. Do not overclaim universality: the benchmark is synthetic, single-digit, code-only, and much of the causal validation is anchored on Qwen2.5-Coder-7B.
tags: mechanistic-interpretability, code-reasoning, layer-wise-analysis, adaptive-depth, self-iteration, transformer-depth, context-stripped-decoding, linear-probing, overthinking, overprocessing, runtime-monitoring, qwen, llama, deepseek, code-models, reasoning-dynamics
---

# From Brewing to Resolution: Tracing the Internal Lifecycle of Code Reasoning in LLMs

## Basic info

* Title: From Brewing to Resolution: Tracing the Internal Lifecycle of Code Reasoning in LLMs
* Authors: Siyue Chen, Yifu Guo, Yuquan Lu, Zishan Xu, Jiaye Lin, Jianbo Lin, Siyu Zhang, Cheng Yang, Junxin Li, Yujia Li, Yu Huo, Ruixuan Wang
* Year: 2026
* Venue / source: arXiv preprint (cs.AI)
* Link: https://arxiv.org/abs/2606.17648
* PDF: https://arxiv.org/pdf/2606.17648
* DOI: https://doi.org/10.48550/arXiv.2606.17648
* arXiv version inspected: v1, submitted 2026-06-16
* Date read: 2026-07-03
* Date surfaced: 2026-07-02
* Surfaced via: Tracy in #pocket-reads
* Code: https://github.com/euyis1019/llm-brewing
* Experiment branch: https://github.com/euyis1019/llm-brewing/tree/paper_experiment
* Why selected in one sentence: Tracy flagged it as useful for understanding why layer-level self-iteration matters, and that is exactly the right read.

## Quick verdict

Keep. This is a useful diagnostic paper because it gives depth-adaptive reasoning a real failure taxonomy.

The central idea is simple but sharp: an answer can be present in the hidden state before the model can use it. Linear probing may recover the correct digit early, while the model's own decoding path does not become correct until many layers later. The paper calls that gap brewing.

The self-iteration angle is the main reason to save it. If some examples are Overprocessed, more layers corrupt a correct answer. If others are Unresolved, more layers or re-injection can help. So "let the model think longer" is not a policy; it is a coin flip with a lab coat unless you can diagnose the internal state.

## One-paragraph overview

The paper proposes a layer-wise diagnostic framework for code reasoning. For each prompt, it reads the final-token hidden state at each layer and applies two tests: a trained linear probe asks whether the answer is externally recoverable, while Context-Stripped Decoding (CSD) asks whether the model can decode the answer from that hidden state after the original code context is stripped away. Across six synthetic code-reasoning tasks and 16 decoder-only models, the authors find a stable "brewing" phase: the answer becomes linearly readable early, but it takes many more layers before it becomes self-decodable. On the anchor Qwen2.5-Coder-7B, probing first becomes correct around 14% of depth and CSD catches up around 50%, leaving a large mid-network brewing interval. After that, samples split into four outcomes: Resolved, Overprocessed, Misresolved, and Unresolved. The important engineering lesson is that these outcomes demand different inference interventions, which makes this paper a clean argument for outcome-aware layer-level self-iteration rather than blind extra compute.

## What problem is the paper trying to solve?

Surface accuracy cannot explain why a model handles one code primitive but fails on a semantically nearby one. A model may track variables but fail on equivalent loops, or correctly form an answer internally and then lose it before output.

The authors argue that the better question is not just "is the answer encoded?" but:

* when does the answer become externally readable?
* when does it become usable by the model's own decoding pipeline?
* does later processing preserve it, corrupt it, or never finish forming it?

That is a good question for any adaptive-depth or self-iterating transformer design. If depth is an internal computation budget, then the policy needs to know whether the current representation is still brewing, already resolved, or starting to rot.

## Method

The paper builds a dual diagnostic framework.

### Linear probing: information availability

At each layer, the authors train a logistic classifier on the last-token hidden state to predict the single-digit answer. If the probe is correct, the answer is linearly recoverable from that layer.

This measures availability: an external readout can see the answer.

### Context-Stripped Decoding: information readiness

The second diagnostic is Context-Stripped Decoding (CSD), inspired by Patchscopes. The hidden state from the original code prompt is injected into a target prompt that contains only the question suffix, stripping away the code context. The model then continues the forward pass from that layer.

If CSD decodes the correct digit, the answer is not merely present; it is self-decodable by the model's own downstream layers.

This measures readiness.

### Brewing

The paper defines:

* FPCL: first probe-correct layer
* FJC: first joint-correct layer, where both probing and CSD are correct
* brewing interval: FPCL to FJC

On Qwen2.5-Coder-7B, FPCL occurs at about 14% normalized depth and FJC around 50%. The average brewing interval is about 10.7 layers, or 38% of the model depth.

This is the paper's deepest point: code reasoning is not just "compute answer at the end." The model first forms an externally readable latent answer, then spends a large fraction of depth making that answer usable by itself.

## Outcome taxonomy

After applying the two diagnostics, each sample falls into one of four main outcomes:

* Resolved: FJC exists and the final output is correct.
* Overprocessed: FJC exists but the final output is wrong. The model had a self-decodable correct answer and later corrupted it.
* Misresolved: FJC never exists, but the tail CSD confidently converges to a wrong answer.
* Unresolved: FJC never exists and the tail remains uncertain.

There is also a NO_BREWING category, where the probe never finds the correct answer at any layer. The main four-way percentages exclude these.

For Qwen2.5-Coder-7B across six task families:

* Resolved: 41.5%
* Overprocessed: 26.4%
* Misresolved: 8.5%
* Unresolved: 23.7%
* NO_BREWING: 2.7% of all samples

The taxonomy matters because it splits "wrong" into different diseases. Overprocessed is late-layer corruption. Unresolved is insufficient depth or incomplete formation. Misresolved is confident convergence to the wrong computation. Those should not receive the same inference-time treatment.

## Experimental setup

Benchmark:

* CUE-Bench, a synthetic code-reasoning benchmark.
* Six task families: Value Tracking, Computing, Conditional, Function Call, Loop, Loop-unrolled.
* All answers are single digits from 0 to 9, making a unified 11-class diagnostic space with one residual non-digit class.
* 4,050 samples per task per model, 24,300 per model.

Models:

* Qwen2.5-Coder: 0.5B, 1.5B, 3B, 7B, 14B
* Qwen2.5 base: 0.5B, 1.5B, 3B, 7B
* Qwen3 base: 0.6B, 1.7B, 4B, 8B
* DeepSeek-Coder-6.7B
* CodeLlama-7B
* Llama-2-7B

The anchor model for causal validation is Qwen2.5-Coder-7B.

## Main results

The first result is the brewing gap. Answers become linearly readable before they become self-decodable. Across the anchor setting, probing detects answers early and CSD catches up much later.

The second result is task-specific failure fingerprints:

* Value Tracking is easiest: 70.8% Resolved.
* Computing has the largest Overprocessed share: 35.6%, suggesting arithmetic often forms a useful signal and then destabilizes.
* Function Call is brutal: only 27.7% Resolved and 39.6% Unresolved.
* Function Call depth is the clearest collapse: Resolved drops from 61.1% at depth 1 to 2.5% at depth 3.
* Conditional reaches 59.2% Resolved, but boolean flag conditions produce a notable Misresolved bottleneck.
* Loop beats Loop-unrolled: 35.5% vs. 28.0% Resolved. Explicit loop syntax seems to provide a structural scaffold.
* In dual-variable tracking, Loop-unrolled has much higher Unresolved rate than Loop, 53.6% vs. 23.5%.

The third result is cross-model stability. Across 16 models, the normalized brewing duration sits in a 24-42% band. Scaling improves resolution success, but it does not erase the brewing scaffold. In the Qwen2.5-Coder series, average Resolved rises from about 18% at 0.5B to 50.3% at 14B, while Overprocessed remains stubbornly present.

The fourth result is that code pretraining helps resolution more than it changes the basic lifecycle. Coder and base Qwen models show similar FJC positions by task, but the Coder models resolve more successfully on harder code primitives.

## Causal validation

The paper does not leave the taxonomy as a post-hoc label set. It runs interventions.

### Activation patching at FJC

Patching the FJC-layer hidden state into a neutral prompt produces a clear jump in answer-flip rate. Pre-FJC layers have low flip rates; FJC and post-FJC layers flip much more often. This supports FJC as a causally meaningful transition.

### Layer skipping for Overprocessed

For Overprocessed samples, the model once had the right answer but later lost it. Injecting the FJC hidden state into later layers can rescue many such cases. A direct replacement underperforms because of representation norm mismatch; an alpha-blend injection works better.

The reported mean rescue rate for Overprocessed samples under alpha-blend is 47.8%, with task-level examples like 67.3% for Value Tracking and 39.6% for Computing.

### Re-injection for Unresolved

For Unresolved samples, injecting FPCL-layer information into late layers rescues 22-38% depending on task, while Resolved controls remain mostly stable. This suggests some Unresolved samples contain partial computation that can be recovered, while the rest likely reflect real capability gaps.

### Component localization

For Qwen2.5-Coder-7B, late layers 22-27 form a decision zone. In Overprocessed cases, the wrong digit often overtakes the correct digit late in this segment. The paper attributes this to attention in the anchor Qwen model, while noting that the responsible component is family-specific: Llama and DeepSeek variants look more MLP-dominated.

For Loop vs. Loop-unrolled, the loop advantage appears in late MLP consolidation. Transplanting late MLP outputs from matched loop examples into unrolled examples closes 82.6% of the readiness gap and flips 18.6% of originally wrong dual-variable unrolled examples.

## Ground-truth-free signals

The paper also asks whether outcome state can be detected without ground-truth labels.

It derives signals from CSD/probe entropy, confidence, probe-CSD divergence, argmax agreement, and layer-wise dynamics.

The headline:

* endpoint-only Resolution Functional gets global Resolved-vs-Rest AUC 0.850;
* per-model AUC is as high as 0.901 for Qwen2.5-Coder-7B;
* five-class closed-form discrimination reaches overall accuracy 0.55 and kappa 0.38 over 372,600 samples;
* Resolved F1 is 0.75, Unresolved F1 is 0.64, Overprocessed F1 is 0.38, Misresolved F1 is 0.35, and NO_BREWING F1 is weak at 0.14.

This is not production-ready state detection, but it is an important start. The binary "resolved or not" signal is much stronger than the fine-grained five-way taxonomy.

## Why this helps explain layer-level self-iteration

This is the main reason to care about the paper.

Layer-level self-iteration assumes that a model can use extra internal computation productively. This paper says: yes, but only conditionally.

There are at least four layer-state regimes:

* Not brewed: the answer is not even linearly available. The model may need re-encoding, retrieval, or a different route.
* Brewing but not ready: the answer is available but not self-decodable. More depth or iterative refinement may help.
* Resolved: the answer is ready. Stop or preserve it.
* Overprocessed: the answer was ready and then got corrupted. More depth hurts; rollback, early exit, or state preservation is needed.

That means the central problem for layer-level self-iteration is not "how do we add more layers?" It is "how do we decide whether this token/state needs more computation, less computation, rollback, or a different correction?"

This paper gives empirical evidence for that control problem. It also suggests what the controller could look at: probe-CSD agreement, entropy dynamics, confidence, endpoint convergence, and layer-wise stability.

The right design lesson is outcome-aware recurrence:

* continue for Unresolved-like states;
* stop or freeze for Resolved-like states;
* rollback or blend earlier states for Overprocessed-like states;
* use different interventions for Misresolved states, because confident wrong convergence is not fixed by naive extra depth.

## Strengths

The availability/readiness distinction is genuinely useful. It explains why "the model knows it somewhere" is not enough.

The taxonomy is actionable. Overprocessed and Unresolved call for opposite inference interventions.

The benchmark is controlled enough to isolate code primitives. Function-call indirection, boolean branch selection, loop syntax, and unrolled computation produce different fingerprints.

The causal interventions make the story much more credible than a purely observational probe paper.

The cross-model sweep is broad for this kind of analysis: 16 models across Qwen, DeepSeek, Llama, and CodeLlama families.

The paper explicitly connects to adaptive-depth systems, looped transformers, and runtime monitors rather than pretending interpretability diagrams are the end product.

## Weaknesses and caveats

The benchmark is synthetic and intentionally narrow. All answers are single digits, snippets are short, and task families are single-primitive by design. That is good for control, bad for immediate generality.

The causal validation is anchored mostly on Qwen2.5-Coder-7B. Cross-model statistics are broad, but the strongest intervention story is not equally deep for every architecture.

Linear probing can show recoverability, but recoverability is not the same as the model naturally using that feature. The paper handles this by pairing probing with CSD, which helps, but probing caveats still matter.

CSD is clever but artificial. Stripping the code context and injecting hidden states creates a diagnostic setting, not a normal forward pass.

The ground-truth-free detectors are promising but imperfect. Binary Resolved-vs-Rest looks strong; fine-grained detection, especially Overprocessed and NO_BREWING, remains rough.

Component attribution is family-specific. The paper itself says the late rewrite appears stable, but whether attention or MLP does it differs by model family.

The paper does not yet solve how to train or deploy a layer-level self-iteration controller. It provides the diagnostic reason and some signal candidates.

## Relation to other Pocket Reads notes

This pairs well with work on long-horizon agents that fail because "thinking longer" is not equivalent to planning better. Here the same lesson appears inside the model stack: more internal depth can either complete a computation or corrupt it.

It also sits next to uncertainty and belief-state papers. A runtime system needs to know not only what the final token says, but what internal state it is in: resolved, unstable, confidently wrong, or still brewing.

For layer-level self-iteration, this paper is probably more useful than generic adaptive-compute work because it names the opposing failure modes. Without that, adaptive depth is just compute budgeting. With it, adaptive depth becomes state control.

## Ideas worth stealing

Distinguish answer availability from answer readiness.

Build monitors that compare external readouts to the model's own decodability, not just confidence.

Treat overthinking as multiple mechanisms. Overprocessed and Unresolved are opposites.

Use rollback/blending interventions for late-layer corruption, not just early exit.

Use re-injection or additional depth for incomplete computation, but only when the state looks Unresolved rather than Overprocessed.

For self-iteration, define the controller around state transitions: brew, resolve, preserve, repair.

## Why It Matters

This paper matters because it turns "deeper reasoning" into a concrete control problem.

It says transformer layers are doing at least two separable jobs: forming the answer and making that answer self-decodable. Those jobs can succeed, stall, or get undone. That is exactly the kind of internal lifecycle a layer-level self-iterating model would need to observe and manage.

So yes: this is useful for understanding why layer-level self-iteration should exist. But more importantly, it explains why naive self-iteration is dangerous. The point is not to loop layers for the aesthetic pleasure of recurrence. The point is to give the model a way to continue, stop, preserve, or repair depending on what kind of internal computation state it is actually in.

## Final Decision

Keep. This is a strong diagnostic paper for layer-wise reasoning dynamics.

Cite it for brewing, availability vs. readiness, Overprocessed vs. Unresolved, and the need for outcome-aware adaptive depth.

For our own thinking, the takeaway is: layer-level self-iteration needs a state monitor. Otherwise it will keep stirring soup that was already done, and sometimes burn the answer.
