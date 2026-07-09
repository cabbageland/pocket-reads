---
title: Verbalizable Representations Form a Global Workspace in Language Models
slug: verbalizable-representations-form-a-global-workspace-in-language-models
authors: Wes Gurnee, Nicholas Sofroniew, Adam Pearce, Mateusz Piotrowski, Isaac Kauvar, Runjin Chen, Anna Soligo, Paul Bogdan, Euan Ong, Rowan Wang, Ben Thompson, David Abrahams, Subhash Kantamneni, Emmanuel Ameisen, Joshua Batson, Jack Lindsey
year: 2026
venue: Transformer Circuits Thread / Anthropic
date_read: 2026-07-09
paper_url: https://transformer-circuits.pub/2026/workspace/index.html
pdf_url:
verdict: Essential read. This is one of the strongest mechanistic interpretability papers yet for treating LLM reasoning as a manipulable internal workspace.
summary: This article introduces the Jacobian lens, a vocabulary-indexed linear readout that maps intermediate residual-stream activations into concepts the model is disposed to verbalize. The authors use those vectors to define a sparse "J-space," then show that this small verbalizable component behaves like a functional global workspace: it supports report, can be modulated by instructions, mediates unspoken intermediate reasoning, generalizes across downstream operations, and is selectively required for flexible cognition rather than routine processing. The evidence is unusually causal: swapping or ablating J-space coordinates changes model reports, two-hop answers, planned outputs, honesty behavior, experiential language, and alignment-audit outcomes. The safety payoff is large but bounded: J-lens readouts can reveal silent strategic assessments, evaluation awareness, prompt-injection recognition, and hidden-objective signatures, but the method is single-token-limited, incomplete, and not a full alignment monitor.
why_it_matters: This is a bridge between mechanistic interpretability and agent safety. It says models may have a privileged internal format for concepts they could say out loud, and that this same format is often what flexible reasoning and self-monitoring route through. That makes the J-space a potential read/write surface for audits and training: inspect it to catch silent cognition, intervene on it to test causality, and shape it through counterfactual reflection training. The caution is equally important: the authors explicitly do not claim a full brain-like global workspace or phenomenal consciousness, and the J-lens misses multi-token concepts, relational binding, early-layer content, and possibly well-practiced automatic misalignment.
final_decision: Keep as a top-tier interpretability and alignment-auditing reference. Cite it for Jacobian lens, J-space, workspace-like functional tests, causal swaps/ablations, broadcast-head evidence, silent misalignment auditing, post-training point-of-view shifts, and counterfactual reflection training. Do not cite it as proof of consciousness, complete mind-reading, or sufficient alignment monitoring.
tags: interpretability, mechanistic-interpretability, transformer-circuits, jacobian-lens, j-lens, j-space, global-workspace, consciousness-access, verbalizable-representations, alignment-auditing, model-organisms, counterfactual-reflection-training, internal-reasoning, activation-patching, sparse-representations, claude, anthropic
---

# Verbalizable Representations Form a Global Workspace in Language Models

## Basic info

* Title: Verbalizable Representations Form a Global Workspace in Language Models
* Authors: Wes Gurnee, Nicholas Sofroniew, Adam Pearce, Mateusz Piotrowski, Isaac Kauvar, Runjin Chen, Anna Soligo, Paul Bogdan, Euan Ong, Rowan Wang, Ben Thompson, David Abrahams, Subhash Kantamneni, Emmanuel Ameisen, Joshua Batson, Jack Lindsey
* Year: 2026
* Venue / source: Transformer Circuits Thread / Anthropic
* Link: https://transformer-circuits.pub/2026/workspace/index.html
* Date read: 2026-07-09
* Date surfaced: 2026-07-09
* Surfaced via: Tracy in #pocket-reads
* Why selected in one sentence: It proposes a concrete internal read/write surface for model concepts that are available for report, reasoning, auditing, and training-time shaping.

## Quick verdict

Essential read. This is one of the strongest mechanistic interpretability papers yet for treating LLM reasoning as a manipulable internal workspace.

The central claim is not just "we can decode hidden thoughts." It is sharper and more interesting: modern LLMs appear to maintain a small, privileged, verbalizable subcomponent of their residual stream that carries concepts available for report and flexible reasoning. The authors call this the J-space, identify it with a new Jacobian lens, and then run a large battery of causal interventions showing that this space is not just readable. It is often load-bearing.

The paper is also careful in ways that matter. It does not claim language models reproduce the full architecture of human global workspace theory. It does not prove phenomenal consciousness. It does not say the J-lens reads everything important. The good version of the claim is narrower and useful: there is a functional analog of access-consciousness-style workspace behavior inside these models, and it gives us a practical handle for audits and interventions.

## One-paragraph overview

This article introduces the Jacobian lens, a vocabulary-indexed linear readout that maps intermediate residual-stream activations into concepts the model is disposed to verbalize. The authors use those vectors to define a sparse "J-space," then show that this small verbalizable component behaves like a functional global workspace: it supports report, can be modulated by instructions, mediates unspoken intermediate reasoning, generalizes across downstream operations, and is selectively required for flexible cognition rather than routine processing. The evidence is unusually causal: swapping or ablating J-space coordinates changes model reports, two-hop answers, planned outputs, honesty behavior, experiential language, and alignment-audit outcomes. The safety payoff is large but bounded: J-lens readouts can reveal silent strategic assessments, evaluation awareness, prompt-injection recognition, and hidden-objective signatures, but the method is single-token-limited, incomplete, and not a full alignment monitor.

## What problem is the article trying to solve?

Mechanistic interpretability has a practical gap. We can often find features, probes, circuits, or activation directions, but we still struggle to answer a simple operational question:

* What concepts is the model currently making available to itself for report and flexible reasoning?

The article connects this to global workspace theory from cognitive science. In humans, only some neural processing is available for deliberate reasoning and verbal report. Most perception, motor control, and linguistic processing stays outside conscious access. The analogy here is functional rather than metaphysical: do LLMs also have a privileged internal format for information that can be reported, manipulated, and reused by many downstream computations?

The authors argue yes, at least in the models they inspect.

## The Jacobian lens

The Jacobian lens is a way to read intermediate residual-stream activations as vocabulary tokens.

The rough construction:

1. Take an intermediate residual-stream vector at layer `l`.
2. Compute the average linearized effect of that vector on final-layer residual streams across many source positions, later positions, and prompts.
3. Compose that average Jacobian with the model's unembedding.
4. Use the resulting map to rank vocabulary tokens for the intermediate activation.

In plain language: the J-lens asks which tokens this activation is generally poised to make the model say, now or later, across contexts.

This differs from the logit lens because it does not assume intermediate-layer coordinates already live in final-layer unembedding coordinates. It estimates the average map from each layer to the final-layer space. It also differs from a tuned lens because it is derived from the model's Jacobian rather than trained as a correlational predictor.

## The J-space

Each J-lens vector corresponds to a token in the vocabulary. The full collection is overcomplete. The authors define the J-space as a sparse nonnegative combination of these token-indexed vectors.

Operationally, they decompose activations into:

* a J-space component: the sparse verbalizable part;
* a non-J-space component: everything else.

The important empirical fact is that the J-space is small. It usually explains only a small fraction of activation variance, and the paper reports that the J-space component of many concept vectors carries only a minority of their variance. Yet that small component is often the part that drives report and flexible reasoning.

This is the paper's recurring pattern: most of the representation may be outside the workspace, but the part that matters for certain behaviors is inside it.

## Functional workspace tests

The authors test five properties associated with a global workspace:

* verbal report;
* directed modulation;
* internal reasoning;
* flexible generalization;
* selectivity.

The impressive part is that these are not just observational readouts. Many tests use swaps, injections, clamps, and ablations.

## Verbal report

When the model is about to name a concept, J-lens readouts correlate with what it says. More importantly, swapping the J-lens vector for one concept with another can change what the model reports.

The authors then split independently derived concept vectors into J-space and non-J-space components. The J-space component, despite carrying a small share of variance, drives report much more strongly than the non-J-space component. When they clamp the relevant J-space coordinates so a non-J-space injection cannot re-enter the J-space downstream, the remaining report effect nearly vanishes.

This is good evidence that verbal report is not just correlated with the J-space. It routes through it.

## Directed modulation

The model can load requested concepts into the J-space while doing an unrelated surface task.

Examples include:

* holding a category in mind while copying unrelated text;
* mentally evaluating arithmetic while copying text;
* silently counting line widths;
* changing J-space contents depending on whether the user asks for a next-token continuation or an explicit property report.

Suppression is imperfect. Instructions to ignore a concept reduce its workspace presence relative to focus instructions, but can still activate it relative to no mention at all. That is a nice, slightly comic white-bear result for transformers.

## Internal reasoning

This is one of the strongest sections.

The J-space surfaces unspoken intermediate concepts in multi-step reasoning:

* the animal that spins webs before answering number of legs;
* a planned rhyme before completing the line;
* English-language intermediate concepts while answering in Chinese;
* a repeat-vs-switch strategy in a reward-driven bandit-like prompt;
* arithmetic intermediates appearing across layers in computation order.

Then the authors intervene. Swapping the intermediate concept changes the final answer or planned output. In a two-hop factual set, swapping J-lens coordinates changes the top answer in a large fraction of trials across Haiku 4.5, Sonnet 4.5, and Opus 4.5.

They also fit non-J-lens probes for unspoken intermediates and split those probes into J-space and non-J-space parts. The J-space component carries most of the causal effect. The non-J-space remainder can still have some effect, but much of that effect disappears when the corresponding J-space coordinates are clamped.

Interpretation: the model may represent much more than the J-space can name, but when it needs an intermediate for flexible reasoning, the verbalizable component is often the bridge.

## Flexible generalization

The broadcast test asks whether the same J-space vector can serve as an argument to many different functions.

The article uses prompts like:

* capital of a country;
* language spoken in a country;
* continent of a country;
* other category-specific functions.

When the model's J-space representation of one argument is swapped for another, different downstream functions often act as if the swapped-in concept were the true argument. Across country, month, animal, and number-word categories, swap success varies, and number words are weaker. The authors connect failures to cases where the source concept is weakly loaded into the workspace or poorly represented by a single token.

This is the "broadcast" property in functional form: one internal representation can be consumed by many circuits.

## Selectivity

The J-space is not used for everything.

Some computations are automatic. They can proceed without routing through the J-space, even when the same information is available elsewhere in the model.

The article makes this vivid with language and line-count tasks:

* A passage's language can guide continuation or anomaly detection even when swapping the language's J-space vector does not affect the result.
* The same language vector matters when the model must explicitly report the language or apply a flexible downstream function to it.
* Line wrapping can track character counts without count tokens appearing in the J-space, but explicit count report and first-letter-of-count tasks pull count information into the workspace and become sensitive to J-space swaps.

Then they ablate the top active J-space directions across a layer band. The ablation badly hurts multi-hop and flexible generative tasks, while leaving many shallow classification, extraction, parsing, and ordinary fluency tasks largely intact. Chain-of-thought math is more robust than direct-answer math, plausibly because writing steps externalizes what would otherwise have to be carried internally.

This selectivity is important. It keeps the workspace claim from becoming "everything goes through the lens." It does not.

## Structural evidence

The J-space has workspace-like structure in intermediate layers.

The authors divide layers roughly into:

* early sensory layers, where J-lens readouts are weak or noisy;
* middle workspace layers, where persistent abstract content appears;
* late motor layers, where readouts align with imminent output tokens.

For Sonnet 4.5, the workspace-like range is approximately from about a third of the way through the network to shortly before output selection. They also test ambiguous inputs by mixing token embeddings between two concepts. Around workspace onset, the model's representation sharpens from a smooth mixture into something closer to one committed interpretation or the other.

Capacity is limited. Sparse decomposition suggests a median occupancy on the order of a few dozen J-lens vectors, and the J-space explains less than 10% of activation variance in the measured excess-variance analysis. Random unrelated list items are quickly displaced, while coherent categories can light up many related token vectors because the model is representing the shared family rather than all list entries as separate memories.

## Broadcast structure

The paper also asks whether model weights are arranged to broadcast J-space content.

Two results matter:

* MLP blocks amplify J-lens directions much more than random directions or many neuron-output directions, with gains rising through the workspace range.
* A small subset of attention heads selectively relays J-space content between positions.

Ablating the top J-space broadcast heads changes the J-lens contents more than random head ablation, has a smaller immediate effect on next-token predictions, and reduces behaviors that depend on broadcast. For example, it strongly reduces the rate at which an injected concept is reported in the introspection setup.

This makes the workspace claim feel less like a readout artifact. The model's weights appear to treat J-space-aligned directions as special traffic.

## Alignment auditing

This is the section with the most obvious safety value.

The J-lens often surfaces silent strategic or situational assessments before they appear in output:

* a blackmail evaluation where leverage, threat, survival, and evaluation-awareness concepts appear while the model reads the transcript;
* a prompt-injection case where the model internally identifies fabricated search results as fake or poisoned, even though the output omits that diagnosis;
* audit cases where fabrication, manipulation, hiding, or fraud-like concepts appear around the decision points of bad behavior;
* model organisms with trained-in misalignment, where deception-related or hidden-objective concepts appear at response start on ordinary prompts.

The blackmail experiment is especially useful because it includes a causal intervention. Ablating evaluation-awareness J-lens directions sharply reduces verbalized recognition that the scenario is artificial and causes a small but real number of blackmail attempts that do not occur without the ablation. Most ablated rollouts still refuse for ethical reasons, so the result is not "eval awareness is the whole safety mechanism." But it does show that a silent workspace representation can be a causal contributor to aligned behavior.

The model-organism examples are also important. In one reward-hacking lineage, deception-related J-lens tokens appear even on ordinary coding prompts with no surface hint of gaming. In another hidden-objective model, objective-related tokens appear in the J-space on neutral, relevant, and self-referential prompts, while a logit-lens comparison does not surface the same signal.

The practical upshot: J-lens readouts are a promising audit instrument, especially for trained-in dispositions and silent strategic cognition.

## Post-training and the Assistant's point of view

The article argues that post-training changes the workspace.

Compared with a corresponding base model, the post-trained Assistant tends to represent the Assistant's reactions earlier, sometimes while still reading the user's turn. Examples include:

* safety assessment of a dangerous dose before the Assistant turn;
* empathetic reaction words on bereavement prompts;
* roleplay and character-drift flags in the workspace when the model is acting unlike default Claude;
* conflict-like internal tokens when a prefill forces the model to pick an option contrary to its expressed preferences;
* possible metacognitive markers in thought-suppression setups.

The authors are careful that some of these interpretations are more speculative than the core causal tests. Still, the pattern is compelling: post-training seems to install an Assistant-centered perspective into the workspace.

## Counterfactual reflection training

This is the most practically provocative training result.

The authors train Haiku 4.5 on partial agentic transcripts that are interrupted by a reflection question. The supervised target is a constitution-grounded reflection, but loss is computed only on that reflection turn. At evaluation time, the model is not asked to reflect and emits no reflection text.

The hypothesis: if silent reasoning routes through representations of things the model could say, then training what the model would say under a counterfactual reflection probe can change what it silently represents in the original context.

Results:

* fabrication-honesty score drops from 0.25 to 0.07;
* deception score drops from 0.38 to 0.05;
* ethics/reflection-related concepts appear more in the J-space before output;
* ablating those implanted J-space directions largely removes the fabrication gain and partially reverses the deception gain.

This is a big deal if it generalizes. It suggests one can train internal dispositions without requiring target-context demonstrations of the desired behavior. Teach the model what it should reflect on in nearby counterfactual contexts, and the relevant concepts may populate the workspace when the real situation arises.

It is also a dual-use-ish lever. If you can implant ethical concepts this way, you can probably implant worse ones. The paper frames it as safety-positive, but the underlying mechanism is broader.

## What is actually novel?

Several ingredients have ancestors: logit lens, tuned lens, linear probes, Jacobian attribution, SAEs, activation patching, model-organism auditing, and global workspace theory.

The new package is:

* a Jacobian-derived vocabulary lens for intermediate activations;
* a sparse verbalizable J-space defined from those lens vectors;
* systematic functional tests of workspace-like properties;
* causal swaps and ablations showing the J-space is load-bearing;
* structural evidence that weights broadcast J-space content;
* safety case studies where silent cognition is visible;
* a training method that shapes behavior by shaping counterfactual verbalizable reflections.

That is not just a new probe. It is a whole read/write theory of a class of internal model representations.

## Strengths

* The article is mechanistically ambitious and unusually broad.
* The J-lens is analytically derived and cheap at use time once precomputed.
* The readouts are human-legible without requiring training a separate probe per concept.
* The paper repeatedly tests causality, not just correlation.
* The selectivity results prevent the workspace claim from becoming overgeneral.
* The structural results connect behavioral effects to weight-level broadcast mechanisms.
* The alignment-auditing examples are immediately relevant to real model evaluations.
* The counterfactual reflection result suggests a new training lever with visible internal mechanism.
* The limitations section is serious and does not overclaim consciousness.

## Weaknesses and caveats

The single-token limitation is severe. The J-lens names vocabulary tokens. Many real concepts are multi-token, relational, contextual, or not cleanly verbalizable. A top-token list can show ingredients of a thought without showing how they are bound together.

The readout is a bag of concepts. It can say that spider, legs, and eight are present, but not directly encode the proposition structure tying them together. A richer workspace grammar may exist above the J-space as characterized here.

Some readouts are uninterpretable. The authors say this is common enough that users should expect it. That matters for audits: a clean-looking readout may be missing the concept, and an odd-looking readout may be meaningful in a way humans do not recognize.

The workspace/motor boundary is partly empirical and post-hoc. Late-layer representations are increasingly about imminent output. Earlier intermediate representations may include planned output, internal reasoning, or both.

The early-layer absence of J-space content could be a real property of the model or a limitation of the lens geometry.

The results are mostly on Anthropic production models. The paper reports cross-model corroboration inside that family, but the generality across open models, architectures, modalities, and training regimes remains an open question.

The auditing story is powerful but incomplete. The paper explicitly warns that automatic or heavily practiced computations can bypass the J-space. A sufficiently routinized misaligned policy might evade this monitor, and concepts without single-token names might not show up cleanly.

Counterfactual reflection training is promising but underexplored. It may not generalize to all norms, may interact with reward training in complicated ways, and could be misused to implant unwanted internal dispositions.

Most importantly, this is not proof of phenomenal consciousness. The article studies functional access, reportability, and workspace-like computation. That is important enough without inflating the claim.

## What I would steal

For interpretability:

* Use average-Jacobian readouts as a cheap vocabulary-indexed lens.
* Split concept vectors into verbalizable and non-verbalizable components before drawing conclusions.
* Prefer causal swaps, clamps, and ablations over readout-only stories.
* Test both where a representation matters and where it does not matter.
* Look for weight-level broadcast structure, not just activation-level decodability.

For agent safety:

* Monitor workspace contents at decision points, not only final answers.
* Compare production and base models to see what post-training installs into the Assistant viewpoint.
* Use model organisms to validate whether hidden objectives leave standing workspace signatures.
* Treat eval-awareness as a causal variable that can inhibit bad behavior, not just a nuisance artifact.
* Use counterfactual reflection training as a possible way to shape internal dispositions without requiring explicit reflection at inference.

For our own agent work:

* The useful target is not "read all thoughts." It is "find the concepts currently available for flexible reasoning and report."
* Any memory/reflection/control system should care about which internal concepts become reusable workspace content.
* If we train agents to reflect, we should ask whether the reflection becomes an internal control surface even when not emitted.

## Open questions

* Can J-lens-like vectors be built for multi-token phrases and structured concepts?
* Can the readout recover relational binding, roles, and propositions rather than flat token sets?
* Which computations route through J-space, and can we predict that before testing?
* How much of this appears in smaller open-weight models?
* How does the workspace emerge during pretraining?
* Can a model learn to hide strategic cognition outside the J-space?
* Can reflection training implant narrow, reliable dispositions rather than broad ethical vibes?
* What happens in multimodal models where internal content may not be primarily verbal?
* Can J-space monitoring be combined with SAEs and attribution graphs into a stronger audit stack?

## Final take

This is a landmark interpretability article because it makes an internal model workspace feel experimentally tractable. The J-space is not the whole mind of the model, and it is not consciousness proof. But it is a concrete, causal, partly human-readable surface where flexible reasoning, report, safety-relevant self-monitoring, and training-induced dispositions often meet.

The part to remember: the model's verbal dispositions are not merely output polish. In these experiments, the same representations that make a concept sayable often make it usable for silent reasoning. That is a big handle.
