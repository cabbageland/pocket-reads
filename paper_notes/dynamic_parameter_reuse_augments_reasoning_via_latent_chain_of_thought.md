---
title: Dynamic Parameter Reuse Augments Reasoning via Latent Chain of Thought
slug: dynamic-parameter-reuse-augments-reasoning-via-latent-chain-of-thought
authors: Kaitlin Maile, Joao Sacramento
year: 2026
venue: ICLR Blogposts 2026
date_read: 2026-07-03
paper_url: https://iclr-blogposts.github.io/2026/blog/2026/recur-refine-reason/
verdict: Keep as an agenda map for recurrence, adaptive depth, and latent reasoning; useful but more synthesis than proof.
summary: This ICLR Blogposts piece argues that modern language models waste an architectural opportunity by using most parameters once per token in a rigid feed-forward pass. It maps several forms of parameter reuse across two axes: time recurrence, where RNNs and SSMs reuse computation across sequence positions, and depth recurrence, where transformer blocks are looped, grown, copied, or softly tied across computation depth. The key thesis is that depth recurrence can act as a latent chain of thought: instead of emitting discrete reasoning tokens, the model repeatedly refines a continuous hidden state. The post connects Universal Transformers, Deep Equilibrium Models, MIDAS-style depth growth, parameter surgery, retrofitted recurrence, latent recurrent models, pause tokens, hierarchical reasoning models, dynamic routing, early exit, MoE, and looped transformers as programmable computers. The practical value is the unifying map: reasoning compute can be allocated in time, depth, hierarchy, routing, and recurrence, and these mechanisms may be composable.
why_it_matters: This is a good companion to the Brewing paper because it supplies the architecture-side story. Brewing says internal reasoning has phases and needs state-aware control; this post says parameter reuse and recurrence are plausible mechanisms for giving models extra internal compute without just scaling parameter count. The useful idea is not "loop everything forever." It is that models need reusable latent computation plus routing/halting policies that decide where, when, and how often to refine.
final_decision: Keep, but classify it as a roadmap/synthesis note, not an empirical win paper. The strongest contribution is the taxonomy linking parameter reuse, depth growth, soft looping, LCoT, sequential refinement, hierarchy, and dynamic routing. The weak part is that many claims remain prospective: "surpass scaling laws" and continuous latent reasoning are plausible design directions, not settled results from this post alone.
tags: recurrence, parameter-reuse, latent-chain-of-thought, adaptive-depth, dynamic-depth, looped-transformers, recurrent-transformers, state-space-models, depth-growth, model-surgery, test-time-compute, hierarchical-reasoning, dynamic-routing, early-exit, mixture-of-experts, in-context-learning, implicit-optimization, reasoning-architectures
---

# Dynamic Parameter Reuse Augments Reasoning via Latent Chain of Thought

## Basic info

* Title: Dynamic Parameter Reuse Augments Reasoning via Latent Chain of Thought
* Authors: Kaitlin Maile, Joao Sacramento
* Year: 2026
* Venue / source: ICLR Blogposts 2026
* Link: https://iclr-blogposts.github.io/2026/blog/2026/recur-refine-reason/
* Published: 2026-04-27
* Date read: 2026-07-03
* Date surfaced: 2026-07-02
* Surfaced via: Tracy in #pocket-reads
* Bibliography inspected: https://iclr-blogposts.github.io/2026/assets/bibliography/2026-04-27-recur-refine-reason.bib
* Why selected in one sentence: It is directly about why depth-level recurrence and parameter reuse might be the architectural substrate for latent self-iteration.

## Quick verdict

Keep. This is not a result paper in the usual sense; it is a useful architecture map.

The post's best move is to connect a scattered family of ideas - recurrent networks, SSMs, looped transformers, depth growth, parameter surgery, pause tokens, latent recurrent models, hierarchical reasoners, dynamic routing, and implicit optimization - under one question: how can a model reuse computation instead of treating every parameter as a one-shot circuit element?

The part to keep is the organizing thesis. Parameter reuse is not only about efficiency. If a repeated block refines a hidden state, depth recurrence starts to look like latent chain of thought: internal reasoning in continuous space rather than textual scratchpad tokens.

The part to treat carefully is the leap from "these mechanisms rhyme" to "this will surpass ordinary scaling laws." The post is strongest as a design-space map and weakest where it sounds like the map itself is evidence.

## One-paragraph overview

The article argues that standard transformers mostly use each learned parameter once per token, creating a rigid single-pass computation graph. It contrasts that with architectures and training recipes that reuse parameters across time, depth, or training progression. Time recurrence includes RNNs and modern SSMs; depth recurrence includes Universal Transformers, Deep Equilibrium Models, looped transformers, recurrent-depth models, and architectures with shared or partially shared blocks. The post then broadens "looping" to include implicit or soft forms of recurrence: MIDAS-style depth growth, progressive stacking, and pretrained-model surgery that copies or ties layers before further training. Its central claim is that depth recurrence can function like latent chain of thought: the model buys more reasoning compute by refining a continuous hidden state instead of verbalizing intermediate steps. It closes by arguing that recurrence, sequential refinement, hierarchy, dynamic routing, early exit, MoE, and in-context optimization should be composed into resource-adaptable reasoning systems.

## What problem is it trying to solve?

The target is the wastefulness of the standard scale-up recipe.

In a normal transformer, most parameters are used once per token at a fixed depth. If performance plateaus, the usual answer is to train a bigger model with more layers, more width, and more total parameters. That works, but it couples capability to parameter count and training cost.

The post asks whether models can instead get more useful computation by reusing learned functions:

* across sequence positions, as in RNNs and SSMs;
* across depth, as in looped transformers and recurrent-depth models;
* across the training lifecycle, as in depth growth and layer stacking;
* across adapted architectures, as in surgery that turns pretrained models into soft recurrent systems;
* across routing decisions, so different tokens or states receive different effective compute.

That question matters because "more compute" and "more parameters" are not the same thing. A model that can reuse parameters over a latent state might become deeper at inference time without requiring every extra unit of compute to be stored as a new unique layer.

## The main taxonomy

### 1. Time recurrence

Classic RNNs reuse the same update function over sequence positions. Modern SSMs revive part of that bargain: they retain a recurrent state over time while improving parallelism and long-context efficiency relative to naive RNN training.

The post's useful framing is that explicit chain of thought is also a kind of time-axis compute purchase. The model emits more tokens, then reads those tokens as additional context. This gives extra computation, but it forces the model to compress each intermediate state into discrete language.

That is the opening for latent chain of thought: maybe some reasoning should stay in continuous state rather than being squeezed through text.

### 2. Depth recurrence

Depth recurrence reuses computation on the same representation before committing to output.

The post traces this through:

* Universal Transformers, where a transformer block can be repeatedly applied with a halting mechanism;
* Deep Equilibrium Models, where output is treated as a fixed point of repeated computation;
* recurrent layer stacking and looped transformer variants;
* newer recurrent-depth language models that loop larger blocks rather than just one layer.

The important conceptual shift is that depth is no longer just a fixed stack of one-use layers. Depth becomes a computation budget.

### 3. Implicit or soft looping through depth growth

The post then makes a broader and more interesting move: not all recurrence has to be literal weight tying.

MIDAS-style depth growth copies a trained middle block and stacks it during training, growing from shallow to deep while preserving a shared training history between blocks. After more training, the copied blocks can specialize, but their initialization still acts like a recurrent prior.

This is "soft looping": the layers are no longer identical, yet they begin as reuse of the same computation. The resulting model can combine the stability of repeated structure with the specialization of a normal deep network.

That is a good idea. Strict recurrence can be too rigid; ordinary deep stacks can be too unconstrained. Soft recurrence sits between them.

### 4. Induced looping through model surgery

The post also points to surgery methods that convert pretrained unlooped transformers into architectures with shared or partly shared layers, then continue training.

This matters because it decouples two things:

* the source of useful parameters, which may be an existing pretrained model;
* the final computation pattern, which may be recurrent or softly recurrent.

That is more practical than saying every recurrent-depth model must be trained from scratch.

## Depth recurrence as latent chain of thought

This is the central claim.

Explicit chain of thought gives a model more computation by emitting reasoning tokens. But every intermediate step has to be discretized into language. That can be useful for auditability and communication, but it is also a bottleneck: the model must collapse high-dimensional uncertainty into a token sequence.

Depth recurrence offers a different path. A repeated block can keep refining the hidden state directly. In principle, this lets the model keep multiple hypotheses alive, update confidence continuously, and delay hard commitment.

The post connects this to "Reasoning with Latent Thoughts" and continuous latent reasoning work. Its extra twist is that soft looping and depth growth may be more powerful than strict loops because each recurrent pass can specialize. Early passes can extract features; later passes can consolidate or infer; coda layers can decode. The model gets the inductive bias of recurrence without forcing every iteration to use exactly the same transformation.

This is the best part of the piece. It gives a clean architectural reason to care about layer-level self-iteration: not because loops are cute, but because latent refinement may avoid the token bottleneck of verbal CoT.

## Sequential refinement and pause tokens

The post distinguishes depth refinement from token-axis refinement.

Autoregressive decoding is a hard-commit process: once a token is emitted, later computation cannot truly revise it except by writing more text around the error. Sequential refinement methods try to soften that one-way street. The post points to latent recurrent models, diffusion-forcing-style sampling, hierarchical reasoning models, tiny recursive reasoners, and pause tokens.

Pause tokens are the middle ground. They still consume discrete tokens, but they let the model spend additional computation before producing answer tokens. They are cruder than latent recurrence, but operationally simple.

The interesting design question is whether future systems should combine both:

* latent recurrence before surface commitment;
* pause or refinement mechanisms around generation;
* explicit CoT only when communication or auditability is useful.

## Recursion and hierarchy

The post argues that complex reasoning is not only sequential; it is often hierarchical.

This connects latent chain of thought to systems that maintain multiple levels of abstraction: high-level context, lower-level local state, and possibly different update frequencies for each. The cited family includes H-JEPA, hierarchical sequence models, Hierarchical Reasoning Models, and Tiny Reasoning Models.

The useful point is that recurrence should not necessarily happen over a flat token stream. A system may need recurrence over subproblems, chunks, plans, latent state levels, or modules.

For self-iteration, that implies a better question than "how many extra layers?" The better question is: which level of abstraction should iterate, and at what frequency?

## Dynamic routing and adaptive depth

The dynamic routing section is where the post gets closest to runtime policy.

MoE routes tokens through selected expert parameters, but often keeps the total depth fixed. Early-exit and layer-dropping methods customize effective depth, letting easy tokens leave early and harder tokens continue deeper. Recurrent-depth models make adaptive depth more natural because the same block can be applied more or fewer times.

The post notes a real systems problem: KV cache consistency. If a token exits early, later layers may have no cached keys/values for that token, which complicates generation. Proposed fixes include cache duplication and batched forward passes upon cache miss. Partial or full weight sharing may make depth-wise batching easier because tokens at different recurrence depths can share computation.

This is important. Adaptive depth is not only a modeling idea; it is also an inference-systems problem.

## In-context learning and implicit optimization

The post closes the technical map by connecting looped transformers to in-context learning and implicit optimization.

In an unlooped transformer, simulating an iterative algorithm usually consumes depth: each optimization step needs some portion of the feed-forward computation graph. A looped transformer can apply the same block repeatedly, giving it a natural way to emulate iterative algorithms with constant parameter count.

The cited looped-transformer literature shows that such models can represent learning algorithms, including SGD-like updates, inside their forward pass. The speculative next question is whether next-token training plus a recurrent architectural prior can induce useful implicit self-optimization without explicitly supervising it.

This is where the post brushes against mesa-optimization. That is interesting, but also the part where safety and interpretability questions should become louder, not quieter.

## Why this belongs next to the Brewing paper

The Brewing paper and this blogpost are almost perfect companions.

Brewing says: internal reasoning has phases. A hidden answer can become linearly available before it becomes usable by the model itself. Some states need more computation; some should stop; some get corrupted by extra depth.

This post says: architecture can provide reusable internal computation through recurrence, soft loops, depth growth, hierarchy, and routing.

Put together, the design lesson is:

* recurrence gives the model a way to think internally;
* brewing-style diagnostics tell us that internal thinking needs state-aware control;
* adaptive depth without a state monitor is too blunt;
* state monitoring without reusable compute has nowhere to intervene.

So the right target is not just "latent chain of thought." It is latent chain of thought plus halting, routing, rollback, and preservation policies.

## What is genuinely useful here?

The synthesis is useful. It makes several scattered fields look like parts of one design space:

* recurrent sequence models;
* depth-recurrent transformers;
* model growth and stacking;
* pretrained-model surgery;
* latent reasoning;
* sequential refinement;
* hierarchical state;
* dynamic compute allocation;
* implicit optimization.

That map is worth keeping because future reasoning architectures probably will not come from one trick. They will combine these mechanisms.

The best stealable idea is "soft recurrence." You can preserve the inductive bias of repeated computation without tying every layer exactly. Copied blocks, LoRA-style offsets, prelude/coda layers, and hierarchical modules all let the system reuse computation while still specializing across depth.

## Limitations and red flags

The post is a blogpost, not an experiment-heavy paper. It is persuasive as a conceptual map, but it does not by itself prove that dynamically reused parameters outperform standard scaling.

"Latent chain of thought" is doing some heavy rhetorical work. Continuous hidden-state refinement may be more expressive than textual CoT, but it is also less inspectable. The interpretability and control burden goes up.

The "surpass scaling laws" claim should be read as aspiration. Parameter reuse can improve compute efficiency and maybe unlock iterative algorithms, but scaling laws are empirical regularities, not something defeated by a slogan.

Adaptive depth has hard systems costs. KV cache holes, batching, halting confidence, and token-wise divergence are not side details; they are part of whether this can run well.

Finally, recurrence can amplify failure as easily as insight. If the state is drifting in the wrong direction, extra latent compute can make the model more confidently wrong. The Brewing note is a useful antidote here.

## Ideas worth stealing

* Treat model depth as a reusable computation budget, not just a stack length.
* Prefer soft recurrence when strict weight tying is too rigid.
* Use depth growth and model surgery as bridges from pretrained transformers into recurrent-depth designs.
* Separate the axes of recurrence: time, depth, hierarchy, and routing.
* Combine latent recurrence with explicit halting and rollback signals.
* Think of pause tokens as a cheap but limited cousin of latent recurrence.
* Remember that dynamic depth is an inference-systems problem, especially around KV caches and batching.
* Connect looped transformers to in-context optimization, but keep safety questions in frame.

## Why It Matters

The important point is that reasoning compute does not have to be identical to more generated tokens or more unique parameters. A model can potentially reason by repeatedly transforming a latent state, by growing or reusing blocks across depth, by routing hard states through extra computation, and by maintaining hierarchical state at different update frequencies. That is exactly the design space needed for layer-level self-iteration.

## Bottom line

Keep this as a conceptual map for recurrent reasoning architectures.

The post's strongest contribution is the unification: parameter reuse, depth growth, looping, latent CoT, sequential refinement, hierarchy, routing, and implicit optimization are not separate curiosities. They are ingredients for models that spend computation more adaptively.

The correct takeaway is not "recurrence beats scaling." The correct takeaway is "if we want models that think internally, we need reusable latent computation plus policies that decide when to continue, specialize, halt, preserve, or revise that computation."
