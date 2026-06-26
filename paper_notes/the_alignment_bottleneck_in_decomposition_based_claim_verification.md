---
title: The Alignment Bottleneck in Decomposition-Based Claim Verification
slug: the-alignment-bottleneck-in-decomposition-based-claim-verification
authors: Mahmud Elahi Akhter, Federico Ruggeri, Iman Munire Bilal, Rob Procter, Maria Liakata
year: 2026
venue: arXiv preprint (cs.CL, cs.AI)
date_read: 2026-06-26
paper_url: https://arxiv.org/abs/2602.10380
pdf_url: https://arxiv.org/pdf/2602.10380
verdict: Keep. Very relevant for claim verification, evidence routing, and agent auditability.
summary: This paper argues that claim decomposition is not automatically useful for fact-checking. It helps only when each sub-claim is paired with precise evidence and reliable sub-claim labels. The authors build a PHEMEPlus-derived dataset of 399 real-world complex claims and 1,169 sub-claims with human-annotated evidence spans, then compare two setups: SAE, where each sub-claim receives its own aligned evidence, and SRE, where every sub-claim gets the same repeated claim-level evidence. Oracle SAE improves PHEMEPlus claim verification from 0.5643 to 0.6268 macro-F1, but repeated claim-level evidence is weak or harmful, including a 0.7550 to 0.6878 macro-F1 drop on MMM-Fact. The durable lesson is blunt: decomposition without evidence alignment is mostly decorative structure plus more ways for errors to propagate.
why_it_matters: A lot of fact-checking and research-agent systems say "split the answer into atomic claims, then verify them" as if splitting is the hard part. This paper shows the next bottleneck: each split claim needs its own evidence span and calibrated uncertainty. Otherwise the pipeline can become worse than checking the original claim directly.
final_decision: Keep. This is a useful empirical companion to claim-decomposition and auditability papers. Cite it when arguing that claim-level verification needs evidence routing and abstention policy, not just more atomic claims.
tags: claim-verification, fact-checking, claim-decomposition, evidence-alignment, sub-claims, factuality, auditability, PHEMEPlus, MMM-Fact, COVID-Fact, LLM-evaluation
---

# The Alignment Bottleneck in Decomposition-Based Claim Verification

## Basic info

* Title: The Alignment Bottleneck in Decomposition-Based Claim Verification
* Authors: Mahmud Elahi Akhter, Federico Ruggeri, Iman Munire Bilal, Rob Procter, Maria Liakata
* Year: 2026
* Venue / source: arXiv preprint (cs.CL, cs.AI)
* Link: https://arxiv.org/abs/2602.10380
* PDF: https://arxiv.org/pdf/2602.10380
* DOI: https://doi.org/10.48550/arXiv.2602.10380
* Date read: 2026-06-26
* Date surfaced: 2026-06-26
* Surfaced via: Tracy in #pocket-reads via arXiv PDF link
* Version inspected: arXiv v1, submitted 2026-02-11
* Why selected in one sentence: It tests a hidden assumption behind fact-checking agents: decomposing a complex claim helps only if the system can align evidence to the decomposed pieces.

## Quick verdict

Keep. Very relevant for claim verification, evidence routing, and agent auditability.

This is a good paper because it catches the exact place where "decompose then verify" stops being a slogan and becomes an engineering problem. Splitting a complex claim into sub-claims can make verification more transparent, but it also creates new intermediate objects that need evidence, labels, and aggregation. The paper's core result is that decomposition helps under an idealized sub-claim aligned evidence setup, but repeated broad evidence under each sub-claim is often neutral or actively harmful. That is a useful correction to a lot of agentic fact-checking optimism. The weakness is that the paper isolates the verification setting with fixed evidence and fixed decomposition, so it does not solve end-to-end retrieval or learned decomposition. Still, the takeaway is sturdy: decomposition is only as useful as the evidence alignment and label calibration underneath it.

## One-paragraph overview

The paper studies why decomposition-based claim verification has produced mixed empirical results. The authors argue that the disagreement comes from two bottlenecks: evidence alignment and sub-claim error profiles. They create a real-world dataset from PHEME/PHEMEPlus with temporally bounded evidence, 399 complex claims, 1,169 sub-claims, human-labeled sub-claim veracity, and human-selected sub-claim evidence spans. They then compare vanilla claim verification with two decomposition setups. SRE, or Sub-claims with Repeated Claim-level Evidence, attaches the whole claim-level evidence block to every sub-claim. SAE, or Sub-claims with Aligned Evidence, attaches the specific evidence span that supports or refutes each sub-claim. On PHEMEPlus, oracle SAE improves claim verification substantially over vanilla, while SRE has only a small non-significant gain. On MMM-Fact and COVID-Fact, where aligned sub-claim evidence is unavailable, SRE fails to help and can hurt. When oracle sub-claim labels are replaced with predicted labels, SAE degrades moderately but SRE collapses. The paper concludes that the real bottleneck is not decomposition itself, but precise evidence synthesis plus calibrated sub-claim label behavior.

## System definition

This is an empirical evaluation paper, not a new model architecture paper. The important object is the verification pipeline.

### Inputs

- a complex claim
- a claim-level evidence set
- decomposed sub-claims
- optionally, sub-claim-level evidence spans
- optionally, sub-claim veracity labels
- a claim-level verifier or sub-claim verifier

### Outputs

- claim-level veracity labels, evaluated as true or false at the final claim level
- sub-claim veracity labels, evaluated as true, false, or unverified
- comparisons between vanilla verification, SRE, SAE, ablations, and noisy-label variants

### Core distinction

The paper's most important distinction is:

- SRE: every sub-claim gets the same repeated claim-level evidence block.
- SAE: each sub-claim gets the evidence span aligned to that specific sub-claim.

That sounds like a small prompting detail. It is not. It decides whether decomposition gives the model useful structure or just more text to reason over badly.

## What problem is it trying to solve?

Complex claims often bundle several facts together. A breaking-news post might say four people were killed, identify their roles, mention a location, and add a condition about someone else being injured. A single claim-level verdict can hide which part was supported, contradicted, or still unresolved.

Claim decomposition is supposed to help by splitting the original claim into checkable sub-claims. But the field has mixed evidence about whether it actually improves fact-checking. Some work finds gains; other work finds little benefit or method-specific effects.

This paper says the missing variable is alignment. A decomposition pipeline has not really solved the problem if it splits the claim but then gives each sub-claim the same broad evidence dump. The sub-claim needs the right evidence span, and the final aggregator needs reliable information about the sub-claim's status.

## Dataset

The authors start from PHEME, a dataset of Twitter rumours around breaking-news events, then use PHEMEPlus evidence annotations. The temporal constraint matters: evidence is limited to what was available around the time of the event, avoiding leakage from later reporting.

Dataset construction:

- Filter PHEME to more complex claims, using a heuristic requiring at least three verbs and two sentences.
- Decompose claims with a FActScore-style `gpt-3.5-turbo-instruct` schema.
- Manually check that sub-claims are check-worthy and comprehensive.
- Use PHEMEPlus articles as temporally bounded evidence.
- Remove image-only evidence, links, embedded ads, and cases where images make the decomposed text nonsensical.
- Annotate sub-claims as true, false, or unverified.
- Highlight minimal evidence sentences supporting the assigned sub-claim label.

Final PHEMEPlus-derived dataset:

- 399 complex claims
- 1,169 sub-claims
- three annotators, all PhD students in CS and fluent in English
- 300 sub-claims double-annotated for agreement
- Bennett's S of 0.81 for label agreement
- moderate to strong overlap in selected evidence spans, with BLEU around 0.40-0.48 and BERTScore F1 around 0.49-0.56

The authors also test generalization with two existing datasets:

- MMM-Fact intermediate subset: 1,181 complex claims and 2,326 sub-claims extracted from 21,873 intermediate-difficulty samples.
- COVID-Fact: 163 complex claims and 447 sub-claims.

Those extra datasets do not have human sub-claim labels or sub-claim aligned evidence, so they mostly test the weaker repeated-evidence setup.

## Experimental setups

The main claim-level setups are:

- Vanilla: verify the original complex claim with claim-level evidence.
- Oracle SRE: verify with sub-claims, oracle sub-claim labels, and repeated claim-level evidence.
- Oracle SAE: verify with sub-claims, oracle sub-claim labels, and aligned sub-claim evidence.
- Ablation SRE: sub-claims plus repeated claim-level evidence, but no sub-claim labels.
- Ablation SAE: sub-claims plus aligned sub-claim evidence, but no sub-claim labels.
- Noisy SRE/SAE: replace oracle sub-claim labels with predicted labels from Qwen3-14B or a GNN.

Claim-level verification uses Qwen3-14B. Sub-claim verification compares Qwen3-14B, a structured GNN baseline, BERT-Chunk, and CHEF variants.

The paper uses macro-F1 and balanced accuracy because the labels are imbalanced. It reports paired bootstrap tests and McNemar tests for claim-level comparisons.

## Main results

The cleanest result is on PHEMEPlus under oracle labels:

- Vanilla: 0.5643 macro-F1, 0.6072 balanced accuracy
- Oracle SRE: 0.5872 macro-F1, 0.6117 balanced accuracy
- Oracle SAE: 0.6268 macro-F1, 0.6558 balanced accuracy

The SAE gain over vanilla is statistically significant: +0.0625 macro-F1 and +0.0486 balanced accuracy. SRE's gain is much smaller and not compelling.

The generalization tests are less friendly to decomposition:

- COVID-Fact vanilla: 0.7365 macro-F1
- COVID-Fact Ablation SRE: 0.7252 macro-F1
- MMM-Fact vanilla: 0.7550 macro-F1
- MMM-Fact Ablation SRE: 0.6878 macro-F1

The MMM-Fact drop is the big warning sign. Adding sub-claims without aligned evidence or labels can make the final verifier worse.

The ablations show that evidence granularity and label reliability interact:

- Oracle SRE: 0.5872 macro-F1
- Ablation SRE: 0.5808 macro-F1
- Oracle SAE: 0.6268 macro-F1
- Ablation SAE: 0.5485 macro-F1

That last drop is important. Aligned evidence alone is not enough if the model does not have reliable sub-claim veracity labels. Granular information can become harder to synthesize without the right label signal.

## Noisy sub-claim labels

When oracle sub-claim labels are replaced with predicted labels, performance drops. The size of the drop depends heavily on evidence alignment:

- Oracle SAE: 0.6268 macro-F1
- Qwen Noisy SAE: 0.5964 macro-F1
- GNN Noisy SAE: 0.5839 macro-F1
- Qwen Noisy SRE: 0.4335 macro-F1
- GNN Noisy SRE: 0.4416 macro-F1

SAE stays somewhat usable under noise. SRE collapses. This is the paper's strongest argument that repeated claim-level evidence amplifies upstream mistakes instead of containing them.

The paper also shows why sub-claim macro-F1 is not enough. Qwen is better overall at sub-claim classification, reaching 56.94 percent macro-F1, while the GNN reaches 45.79 percent. But their error profiles differ:

- Qwen predicts unverified 15.8 percent of the time and false 24.2 percent of the time.
- GNN predicts unverified 35.0 percent of the time and false only 5.4 percent of the time.
- Qwen has much higher refutation recall.
- GNN is conservative and almost never detects refutations.

In aligned-evidence settings, conservative abstention can act like a safety mechanism because it avoids injecting wrong polarity labels. But it also misses actual refutations. So the target is not just higher sub-claim accuracy; it is calibrated commit/abstain behavior.

## What is actually novel?

The novelty is not claim decomposition by itself. The useful contribution is the alignment diagnosis plus a dataset that allows the diagnosis to be tested.

The paper contributes:

- a PHEMEPlus-derived complex-claim dataset with human sub-claim labels and evidence spans
- a direct SAE versus SRE comparison
- evidence that aligned evidence plus reliable labels can make decomposition helpful
- evidence that repeated claim-level evidence can be useless or harmful
- an error-profile analysis showing why abstention and false-refutation behavior matter downstream

The strongest idea is that decomposition should be evaluated as a structured evidence-routing pipeline, not as a text-splitting preprocessor.

## Strengths

- The paper answers a real confusion in the literature: why decomposition sometimes helps and sometimes does not.
- SAE versus SRE is a clean experimental distinction.
- Temporally bounded evidence is a good design choice for rumour verification because later evidence would make the task unrealistically easy.
- Human-selected sub-claim evidence spans are expensive but exactly the right artifact for this question.
- The paper separates oracle-label upper bounds from predicted-label realistic scenarios.
- The noisy-label analysis is practical. It shows that the kind of error matters, not just the error rate.
- The results line up with agent-auditability intuitions: evidence must be routed to the claim unit being judged.

## Weaknesses and caveats

The decomposition method is fixed. That is good for isolating evidence alignment, but it means the paper does not tell us how much better the pipeline could get with stronger decomposition.

The PHEMEPlus-derived dataset is useful but small. The test split is not the same as broad web-scale or scientific fact-checking.

The claim-level task drops unverified labels and predicts only true/false, while the sub-claim task includes true/false/unverified. That mismatch makes it harder to reason about how uncertainty should propagate to the final verdict.

The setup uses closed, pre-linked evidence. This isolates the alignment effect, but real fact-checking agents also need retrieval, deduplication, temporal updates, source credibility, and contradiction management.

The external datasets lack human sub-claim aligned evidence, so the most important SAE condition cannot be tested there.

Qwen3-14B is the main claim-level model. Other models may behave differently under structured inputs, label noise, and long evidence contexts.

Human utility is left for future work. The paper shows metric gains, but not whether journalists or analysts actually benefit from the extra sub-claim structure versus being overloaded by it.

## Relation to other Pocket Reads notes

This is a strong companion to *A Closer Look at Claim Decomposition*. That paper says the decomposition step itself is part of the factuality metric and must be audited. This paper says that even if decomposition is decent, it will not help unless evidence is aligned to the sub-claims and uncertainty is handled carefully.

It also sits next to claim-level auditability work. Auditability needs more than atomic claims; it needs a trace from each claim to the right evidence, plus a policy for unresolved or contradictory evidence.

## What ideas are steal-worthy?

- Always distinguish "sub-claim with aligned evidence" from "sub-claim with repeated broad evidence."
- Do not celebrate decomposition unless it improves the evidence routing problem.
- Preserve an explicit unverified/abstain state for sub-claims.
- Evaluate sub-claim predictors by error profile, especially false-refutation rate and abstention rate.
- Treat granular evidence without reliable labels as potentially confusing, not automatically helpful.
- In breaking-news verification, keep evidence temporally bounded so later reporting does not leak into the decision.
- For agentic research or fact-checking systems, make claim decomposition, evidence retrieval, and claim-evidence alignment one joint design target.

## Final decision

Keep.

This paper is not flashy, but it is usefully annoying in the right way. It says the quiet part out loud: "split into atomic claims" is not a verification system. The hard part is putting the right evidence next to each small claim, deciding whether the system should commit or abstain, and aggregating those signals without letting upstream mistakes poison the final verdict.

For Pocket Reads, the durable phrase is: decomposition only earns its keep when evidence is aligned.
