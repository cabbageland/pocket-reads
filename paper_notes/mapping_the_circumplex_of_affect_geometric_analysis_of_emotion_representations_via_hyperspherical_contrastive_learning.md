---
title: Mapping the Circumplex of Affect: Geometric Analysis of Emotion Representations via Hyperspherical Contrastive Learning
slug: mapping-the-circumplex-of-affect-geometric-analysis-of-emotion-representations-via-hyperspherical-contrastive-learning
authors: Yusuke Yamauchi, Akiko Aizawa
year: 2026
venue: ACL 2026 Long Papers; Best Theme Paper
date_read: 2026-07-19
paper_url: https://aclanthology.org/2026.acl-long.772/
pdf_url: https://aclanthology.org/2026.acl-long.772.pdf
verdict: Elegant geometry probe, honest about the accuracy tax
summary: This paper asks whether language-model emotion embeddings should be forced to follow the psychological circumplex model of affect: a circular space organized by valence and arousal. The authors build a 12-label empirical circumplex, train projection heads on top of several embedding/LLM backbones with SINCERE, SoftCSE, and their proposed CircularCSE loss, then evaluate both clustering quality and agreement with circumplex distances. The main result is a clean trade-off. CircularCSE and hyperspherical nGPT heads produce emotion maps that are far more interpretable and robust under dimensionality reduction, but they usually lose high-dimensional, fine-grained discriminative power versus conventional contrastive objectives that arrange labels like a high-dimensional simplex.
why_it_matters: The useful lesson is broader than emotion classification: human-legible representation geometry can be a real inductive bias, but it is not free. If we want models whose internal spaces can be inspected, visualized, steered, or matched to cognitive theories, we may have to accept less raw class separation, especially when the downstream task rewards many crisp boundaries. This is exactly the sort of trade-off that matters for interpretable AI systems, affect modeling, and any interface that lets humans steer models through representation space.
final_decision: Keep as a crisp example of representation geometry as design, not just post-hoc visualization. Cite it for the accuracy-vs-interpretability trade-off, CircularCSE-style geometry-aware contrastive learning, and the warning that a beautiful low-dimensional psychological prior can fight the high-dimensional margins that classifiers like.
tags: emotion-representation, circumplex-model, affect, contrastive-learning, hyperspherical-embeddings, representation-geometry, interpretability, nGPT, CircularCSE, SoftCSE, SINCERE, ACL-2026, embedding-models, mechanistic-interpretability, human-centered-ai
---

# Mapping the Circumplex of Affect: Geometric Analysis of Emotion Representations via Hyperspherical Contrastive Learning

## Basic info

* Title: Mapping the Circumplex of Affect: Geometric Analysis of Emotion Representations via Hyperspherical Contrastive Learning
* Authors: Yusuke Yamauchi, Akiko Aizawa
* Year: 2026
* Venue / source: ACL 2026 Long Papers; Best Theme Paper
* Pages: 16981-17004
* Link: https://aclanthology.org/2026.acl-long.772/
* PDF: https://aclanthology.org/2026.acl-long.772.pdf
* Code: https://github.com/yama11235/EmpiricalCircumplexModel
* DOI: https://doi.org/10.18653/v1/2026.acl-long.772
* PDF inspected: ACL Anthology PDF, 24 pages
* Date read: 2026-07-19
* Date surfaced: 2026-07-19 (via Tracy in #pocket-reads)
* Why selected in one sentence: It is an unusually clean paper about when psychologically meaningful geometry helps representation learning, and when it taxes raw discriminative accuracy.

## Quick verdict

Elegant geometry probe, honest about the accuracy tax

This is a keep. The paper is not just "emotion classification with another loss." It directly asks whether a classic human psychological model - the circumplex of affect - can be made into the geometry of a language model's emotion embeddings.

The answer is satisfyingly non-magical. Yes, if you train for circular geometry, you can get emotion representations that look like the circumplex and remain readable after dimensionality reduction. No, that does not automatically make the classifier better. In high-dimensional spaces with many fine-grained labels, ordinary contrastive learning wins because it can push classes apart like vertices of a simplex. A 2D ring has much tighter margins.

That is the useful contribution: interpretability is treated as a structural constraint, not as a screenshot afterthought.

## One-paragraph overview

The paper builds an empirical circumplex model with 12 emotion labels placed around a circle, then trains sentence-level emotion embeddings using several backbones and contrastive objectives. The backbones include BERT-like encoders, LLM-based encoders, and decoder-only LLMs. The heads are either standard Transformer projection heads or normalized Transformer heads (nGPT) that keep representations on a hypersphere. The losses form a spectrum: SINCERE pushes labels apart for maximum discriminability, SoftCSE softens negative-pair weights according to circumplex distance, and CircularCSE directly forces pairwise cosine similarity to match circular angular distance. Evaluation uses V-Measure for clustering quality and CD-r, a Pearson correlation between circumplex distance and learned embedding distance. Across datasets and models, SINCERE and SoftCSE usually win on clustering, while CircularCSE wins on circumplex alignment and low-dimensional interpretability.

## What problem is the paper trying to solve?

Emotion in psychology is often represented geometrically. The circumplex model places emotions around two axes:

* valence: positive to negative
* arousal: activated to deactivated

So joy, excitement, anger, fear, sadness, boredom, calmness, and related labels are not just independent classes. They have distances and oppositions.

Deep learning classifiers usually do not care. If anger and fear are different labels, the classifier wants them separated. If joy and excitement are different labels, it wants them separated too. A high-dimensional contrastive objective can make every label far from every other label, even if psychology says some should be neighbors.

The paper asks whether explicitly imposing the circular affect manifold gives better human-aligned representations, and what it costs.

## The empirical circumplex

The authors define a 12-label empirical circumplex model (ECM). It is mostly inspired by Russell's circumplex of affect, but adapted to labels that actually appear in available text-emotion datasets.

The labels are:

* love
* joy
* excitement
* surprise
* anger
* fear
* disgust
* sadness
* boredom
* calmness
* relief
* trust

Some substitutions matter. Russell's model would place neutral near the center, not on the circle, and the deactivated region would ideally include labels like sleepy or quiet. The authors use calmness and trust partly because those labels are available. That is a limitation, but not a fatal one for the paper's main claim, which is about the dimensional trade-off imposed by circular geometry.

## Architecture

The paper attaches a single Transformer block as a projection head on top of pretrained backbones. It compares two head types:

* GPT head: a normal Transformer block in Euclidean space.
* nGPT head: a normalized Transformer block where hidden states and weights are constrained to the unit hypersphere.

The nGPT choice is important because the paper's geometric story depends on angle. If representations are allowed to encode meaning in vector norms, circular structure is harder to interpret. Putting embeddings on a hypersphere makes differences primarily angular.

The authors fully fine-tune the BERT-like encoders, but freeze the larger LLM backbones and train only the heads. Sentence embeddings are derived with the pooling style appropriate to each model family: CLS pooling for BERT-like encoders, last-token pooling for decoder-only models and Qwen3-Embedding, and mean pooling for Llama-Embed-Nemotron.

## Loss functions

The paper compares three contrastive objectives.

SINCERE is the discriminative baseline. It avoids the intra-class repulsion problem of supervised contrastive learning, but it treats negative labels as simply negative. The practical effect is that it tries to push every emotion class away from every other emotion class.

SoftCSE makes the negative-pair force depend on circumplex distance. Nearby emotions repel less; opposing emotions repel more. This keeps some psychological structure without requiring the embedding space to become an actual ring.

CircularCSE is the strong circular constraint. It directly trains pairwise dot products to match the cosine of the angular distance between emotion labels on the circumplex. Same-label examples are allowed a margin, but different-label examples are pushed toward their target circular distances.

This setup is nicely diagnostic because the objectives form a ladder:

* SINCERE: best for class separation.
* SoftCSE: class separation with soft psychological geometry.
* CircularCSE: direct circular manifold alignment.

## Datasets

The experiments use three real-world datasets and one synthetic dataset:

* Emolit: literature text from Project Gutenberg with fine-grained emotion labels.
* Empathetic Dialogue: conversational data, using the speaker's first utterance and mapping some labels to the ECM.
* SuperEmotion: a merged social-media-style emotion dataset.
* PersonaGen: synthetic persona-conditioned emotion sentences.

The authors balance the datasets by under-sampling. Most use 500 train examples per label and 100 test examples per label, with SuperEmotion using 450 train examples per label.

PersonaGen is much easier than the real-world datasets, which is itself useful. Synthetic emotion text tends to be cleaner, more explicit, and less ambiguous than literature, dialogue, or social media.

## Metrics

The paper uses two main metrics.

V-Measure evaluates clustering quality. The authors run spherical k-means on the learned embeddings and compare clusters to ground-truth labels. This measures whether the embedding separates emotion classes cleanly.

CD-r evaluates agreement with the circumplex. The authors define Circumplex Distance (CD) using angular steps around the ECM plus polarity constants, then compute the Pearson correlation between CD and learned embedding distance. This measures whether the representation geometry respects the psychological layout.

These two metrics are deliberately in tension. V-Measure asks "can I separate the labels?" CD-r asks "are the learned distances psychologically plausible?"

## Main results

The headline result is stable across model families:

* SINCERE and SoftCSE usually produce higher V-Measure.
* CircularCSE produces much higher CD-r.
* nGPT often improves geometric alignment, but can hurt discriminative performance, especially for smaller decoder-only LLMs.

The selected average results in Table 1 make the trade-off easy to see:

* mE5 with SINCERE-GPT: V-Measure 0.760, CD-r 0.317.
* mE5 with CircularCSE-nGPT: V-Measure 0.720, CD-r 0.764.
* Qwen3-Embedding-4B with SINCERE-GPT: V-Measure 0.756, CD-r 0.305.
* Qwen3-Embedding-4B with CircularCSE-nGPT: V-Measure 0.659, CD-r 0.753.
* Llama-3.2-3B with SINCERE-GPT: V-Measure 0.725, CD-r 0.358.
* Llama-3.2-3B with CircularCSE-GPT: V-Measure 0.579, CD-r 0.728.

So CircularCSE often roughly doubles the circumplex-alignment metric while dropping clustering quality. SoftCSE is the compromise objective: it usually lands between SINCERE and CircularCSE on both metrics.

## Why CircularCSE loses discriminability

The paper's best analysis is geometric.

SINCERE is happiest when classes form a high-dimensional regular simplex. In practice, this means different labels can be pushed toward orthogonality, giving a roughly 90-degree class margin.

CircularCSE instead arranges labels around a 2D ring. With 12 emotion classes, adjacent classes on the ring have much smaller angular separation. The paper notes that the maximum boundary margin between positive and negative pairs is only 30 degrees in the 12-class setting.

That means the circular model starts with less class-separation room. It is interpretable because labels are neighbors and opposites in the right places, but that same neighborhood structure makes fine-grained classification harder.

This is the core lesson: a psychologically meaningful manifold is a constraint, and constraints reduce degrees of freedom.

## Dimensionality reduction

CircularCSE looks much better when the representation has to survive dimensionality reduction. PCA plots of mE5 embeddings show SINCERE and SoftCSE producing separated clusters without clear global shape, while CircularCSE-nGPT produces a readable ring with a higher explained variance ratio.

The robustness experiment makes that concrete. When embeddings are reduced to low dimensions before clustering, CircularCSE keeps performance more stable than the more discriminative losses.

That matters because human interpretability often happens in low-dimensional views. If an embedding model's useful structure exists only in a thousand-dimensional simplex, it may classify well but be hard to inspect, steer, or debug visually.

## Label-count robustness

CircularCSE also performs better when the number of emotion labels is small. With fewer classes, a ring leaves enough angular room between labels. As the number of labels grows, adjacent class boundaries tighten and the discriminative tax grows.

This suggests a practical design rule: circular affect geometry may be reasonable for coarse emotion families, but risky for very fine-grained label taxonomies unless the goal is visualization or semantic organization rather than classification accuracy.

## Unseen emotion labels

One of the more interesting discussion results uses all 39 Emolit labels, including labels not used during training. SINCERE-nGPT tends to collapse unseen labels into a rough positive-negative structure. CircularCSE-nGPT preserves the circular geometry and places unseen labels in semantically plausible locations relative to the trained classes.

That is the best argument for the psychological prior. Even if it loses on standard clustering, it can give a more coherent map for labels outside the training set. The authors point out that neutral ends up near low-arousal states such as calmness and relief, rather than in the center as Russell's original model would suggest. That is not automatically "right," but it is exactly the kind of representational fact a geometric model lets you inspect.

## nGPT observations

The nGPT head is not a universal win. For decoder-only models, especially Llama-3.2-3B, nGPT sometimes hurts V-Measure substantially. The authors argue that decoder-only models may encode contextual information more heavily in vector norms, so normalization can throw away useful signal.

This caveat is important. Hyperspherical geometry makes embeddings easier to reason about, but if the backbone has learned to use norm as part of its representational code, forcing everything onto a unit sphere is not harmless.

The paper's MDS visualizations also show that GPT and nGPT heads form different internal structures even when metrics look similar. GPT heads can let MLP norm amplification dominate; nGPT heads produce more angular, non-linear cluster shapes.

## What is actually novel?

The novelty is not that emotions can be plotted in 2D. People have been doing circumplex diagrams for decades.

The useful contribution is forcing the model's learned embedding geometry to match the psychological prior, then measuring the cost with both discriminative and geometric metrics.

CircularCSE is the concrete mechanism. CD-r is the diagnostic metric. The broader contribution is the experimental framing: treat interpretability as a design objective that competes with accuracy, then quantify the trade.

## Strengths

The paper is conceptually clean. The three losses line up neatly from discriminative to geometry-aware to geometry-forcing.

The evaluation separates two questions that are often mashed together: "does this classify well?" and "does this representation have the structure humans expect?"

The theoretical explanation is useful. The simplex-vs-ring margin story explains why high-dimensional classifiers and low-dimensional psychological maps want different things.

The paper avoids the lazy version of interpretability. It does not just produce pretty PCA plots. It trains for the geometry, evaluates against a defined distance metric, and then asks where the geometry helps or hurts.

The unseen-label discussion is genuinely interesting because it shows where a human prior may buy semantic organization outside the exact training taxonomy.

## Weaknesses and caveats

The task is simplified. Real emotional states are often mixed, layered, conflicting, or context-dependent. A single-label setup cannot express things like bittersweetness, anxious excitement, or calm anger.

Neutral is awkward. Russell's circumplex places neutral near the center, but this paper's model operates on a ring. The authors know this and flag it as a limitation.

The empirical circumplex is partly constrained by available labels. Calmness and trust are practical substitutions, not psychologically perfect anchors.

The work is text-only. Some low-arousal states are easier to read from voice, gesture, facial expression, or context than from isolated text.

CD-r is useful but not definitive. It measures agreement with the paper's chosen circumplex distances, not interpretability in every practical sense.

The paper does not show downstream generation or steering. The conclusion gestures toward humans steering model behavior inside visualized representation spaces, but this paper studies embeddings and clustering, not generation control.

## Why It Matters

This paper is a good reminder that "make the model interpretable" is not a garnish. It changes the optimization problem.

If we want a model whose affect representations are human-navigable, circular geometry is attractive. It gives us neighbors, opposites, smooth transitions, and low-dimensional visual structure. That could be useful for affective interfaces, dataset audits, representation editing, or model-steering tools.

But if the job is maximum fine-grained classification, the circular prior may be wrong. A high-dimensional simplex is ugly to humans and excellent for separating labels.

The general version applies beyond emotions. Political ideology, interpersonal style, value systems, taste spaces, and other human concepts may have structured manifolds. Imposing those manifolds could make models more inspectable, but the same accuracy tax may appear whenever the task rewards sharp many-way boundaries.

## Steal-worthy ideas

Evaluate representation geometry separately from task performance.

Use psychologically meaningful distances as training signals, not only as post-hoc interpretation.

Treat SoftCSE-style weighting as a compromise when hard manifold constraints are too expensive.

Stress-test embeddings under dimensionality reduction if humans are supposed to inspect them visually.

Check performance as the number of labels changes. A geometry that works for 6 labels may break at 30.

Look at unseen labels, not only held-out examples from seen labels. Human priors may matter most when the taxonomy expands.

Be suspicious of pretty PCA plots unless the underlying geometry was explicitly measured.

## Final Decision

Keep. This is a sharp, compact example of how representation geometry can be engineered toward a human theory and why that engineering has costs.

The best citation use is the trade-off itself: circular affect embeddings are more interpretable, more robust in low-dimensional views, and better aligned with circumplex distances, but they give up high-dimensional class margin. That is not a failure. It is the point.

Use this paper when arguing that interpretability should be treated as an explicit design constraint, not a decorative visualization after the classifier is already trained.
