---
title: ProvenanceGuard: Source-Aware Factuality Verification for MCP-Based LLM Agents
slug: provenanceguard-source-aware-factuality-verification-for-mcp-based-llm-agents
authors: Ander Alvarez, Santhiya Rajan, Samuel Mugel, Roman Orus
year: 2026
venue: arXiv preprint (cs.AI, cs.CL, cs.MA)
date_read: 2026-06-17
paper_url: https://arxiv.org/abs/2606.18037
pdf_url: https://arxiv.org/pdf/2606.18037
verdict: Highly relevant
summary: ProvenanceGuard is a source-aware verifier for MCP-grounded tool-agent answers. Its target is cross-source conflation: a claim may be supported somewhere in pooled evidence while being attributed to the wrong MCP source. The system preserves stable tool/source IDs from captured MCP traces, decomposes answers into atomic claims, routes each claim to source-specific evidence, checks support with NLI plus token-alignment and protected-value features, compares routed source against stated or implied attribution, and blocks or repairs answers fail-closed. On 281 medical-domain MCP-agent traces, the held-out 40-trace / 361-claim split reaches block F1 0.802 and source accuracy 0.858 over source-eligible claims. A harder multi-source benchmark keeps block F1 high at 0.846 but drops source-plus-relation accuracy to 0.229, which is the honest part: exact source ownership remains hard when several plausible sources discuss the same topic.
why_it_matters: MCP and tool-agent evaluation cannot stop at "is this claim supported somewhere in the context?" Once agents pull from FHIR records, PubMed, search, files, tickets, and other tools, the source of support becomes part of the factual claim. ProvenanceGuard gives a concrete benchmark and verifier design for that problem. The contribution is not a huge binary factuality win over MiniCheck; it is the claim-to-source accountability that source-blind support checkers cannot emit.
final_decision: Keep. This is a useful design and benchmark paper for source-aware evaluation of tool-using agents. Cite it when arguing that MCP-agent factuality needs source ownership, not just pooled-context support. Do not overread it as solved factuality, solved clinical safety, or a universal provenance verifier.
tags: MCP, LLM-agents, factuality-verification, provenance, source-attribution, RAG, NLI, agent-evaluation, medical-agents, tool-use
---

# ProvenanceGuard: Source-Aware Factuality Verification for MCP-Based LLM Agents

## Basic info

* Title: ProvenanceGuard: Source-Aware Factuality Verification for MCP-Based LLM Agents
* Authors: Ander Alvarez, Santhiya Rajan, Samuel Mugel, Roman Orus
* Year: 2026
* Venue / source: arXiv preprint (cs.AI, cs.CL, cs.MA)
* Link: https://arxiv.org/abs/2606.18037
* PDF: https://arxiv.org/pdf/2606.18037
* HTML: https://arxiv.org/html/2606.18037v1
* DOI: https://doi.org/10.48550/arXiv.2606.18037
* Date read: 2026-06-17
* Date surfaced: 2026-06-17
* Surfaced via: Tracy in #pocket-reads
* Why selected in one sentence: It directly targets a failure mode that becomes central for MCP agents: an answer can be supported by some tool output while still lying about which source supports it.

## Quick verdict

* Highly relevant

This is a useful paper because it names a real tool-agent evaluation problem cleanly. Standard factuality checks usually ask whether a claim is supported by the retrieved context. MCP agents make that insufficient. If a medical agent says "the patient's chart shows X" when X only came from a PubMed abstract, the answer is not merely vaguely unsupported; it has assigned the fact to the wrong provenance object. ProvenanceGuard attacks exactly that source-ownership problem by keeping MCP tool/source IDs through verification, routing each atomic claim to source-specific evidence, and blocking answers when support and attribution disagree. The results are promising but not magical: MiniCheck is close on binary block F1, the held-out split is small, the domain is one medical MCP-agent stack, and exact source attribution gets much harder in multi-source same-topic cases. The value is the framing and instrumentation: support somewhere is not the same as support from the claimed source.

## One-paragraph overview

ProvenanceGuard is a source-aware verifier for MCP-grounded tool-agent answers. Its target is cross-source conflation: a claim may be supported somewhere in pooled evidence while being attributed to the wrong MCP source. The system preserves stable tool/source IDs from captured MCP traces, decomposes answers into atomic claims, routes each claim to source-specific evidence, checks support with NLI plus token-alignment and protected-value features, compares routed source against stated or implied attribution, and blocks or repairs answers fail-closed. On 281 medical-domain MCP-agent traces, the held-out 40-trace / 361-claim split reaches block F1 0.802 and source accuracy 0.858 over source-eligible claims. A harder multi-source benchmark keeps block F1 high at 0.846 but drops source-plus-relation accuracy to 0.229, which is the honest part: exact source ownership remains hard when several plausible sources discuss the same topic.

## System definition

### Inputs

The verifier consumes a captured MCP trace and an agent answer. The trace is not treated as anonymous pooled context. Each evidence object keeps a stable tool ID, source ID, and raw text, roughly:

- tool identifier,
- source identifier,
- source text,
- and the answer span or claim to be checked.

This interface matters because the system needs to know whether a claim was grounded in the patient chart, PubMed/literature, search, or another tool/source family.

### Outputs

The system returns claim-level verdicts and an answer-level allow/block decision. A claim can be blocked because it is unsupported, contradicted, not enough evidence, routed to the wrong source, missing protected values, or conflated across source families. Blocked answers can enter a bounded RARR-style repair loop and then be reverified.

### Core method

The pipeline is:

1. Capture MCP traces with stable tool/source IDs and raw outputs.
2. Decompose the answer into atomic factual claims while preserving numbers, dates, units, identifiers, and other protected values.
3. Route each claim to source-specific candidate evidence using embedding similarity and source-level ranking.
4. Check support with an NLI model plus attention-derived token-alignment proxy, lexical overlap, and protected-value features.
5. Compare the routed support source against the answer's stated or implied attribution.
6. Use a calibrated classifier to make a fail-closed block decision.
7. Repair blocked answers by rewriting unsupported spans, correcting attribution, pruning bad claims, or falling back to a conservative non-claim response.

The reported configuration uses all-MiniLM-L6-v2 for source routing and MoritzLaurer/DeBERTa-v3-base-mnli-fever-anli for NLI. The deployment threshold is selected on validation for block F1, with a high-recall operating point.

## What problem is it trying to solve?

The problem is not generic hallucination detection. The paper is narrower and more interesting: source-aware factuality for MCP-based agents.

In a tool-agent trace, multiple sources can contain related facts:

- a patient's FHIR/chart data,
- a PubMed abstract,
- a guideline document,
- a literature search result,
- a resource summary,
- or another tool output.

A source-blind verifier can concatenate evidence and ask whether the answer is supported somewhere. That catches many unsupported claims, but it misses source conflation. If the answer attributes a literature statement to the patient record, or attributes a patient-specific fact to a paper, the pooled-evidence check can pass even though the answer is wrong in a way that matters.

ProvenanceGuard's core claim is that the provenance object is part of the factual statement. The verifier therefore needs to preserve source identity through routing, support checking, decision, and repair.

## Why the method is motivated

MCP makes source identity explicit at the protocol and trace level. Throwing that away during evaluation is wasteful and dangerous. The paper's design follows a good principle: if the runtime has tool/source boundaries, the evaluator should use those boundaries instead of flattening the evidence into one blob.

The medical domain makes the failure mode vivid. "The patient's chart says X" and "a paper says X" are not interchangeable even when X is a true sentence. This is especially important for agents that cite, summarize, triage, or combine private records with public knowledge.

## Data and benchmarks

The primary corpus is a frozen prospective corpus of 281 captured medical-domain MCP-agent traces. The claim-labeled subset contains 2,325 LLM-assisted claim labels split by trace:

- 1,597 training claims,
- 367 validation claims,
- 361 held-out claims from 40 held-out traces.

The 361 held-out labels are human-expert reviewed. Human review does not cover the train/validation labels, which matters for interpreting the benchmark.

The paper also introduces a harder multi-source adjudicated benchmark. Its locked test split has:

- 59 questions,
- 254 pairwise claim cases,
- 2,587 pairwise source-candidate rows,
- 263 frozen extracted claims.

This benchmark is designed to stress the cases that source-blind evaluation hides: chart-plus-literature mixtures, literature summary versus exact citation, same-topic wrong chart/patient cases, count/resource-summary claims, and semantically close wrong candidates.

## Main results

On the primary held-out split, ProvenanceGuard reports:

- block precision: 0.673,
- block recall: 0.993,
- block F1: 0.802,
- block accuracy: 0.812,
- source accuracy: 0.858 over 260 source-eligible claims,
- source-plus-relation accuracy: 0.681,
- 95% trace-bootstrap CI for block F1: [0.664, 0.900].

Against source-blind support baselines on the same 361-claim held-out packet:

- ProvenanceGuard block F1: 0.802,
- MiniCheck: 0.783,
- RAGAS Faithfulness: 0.758,
- AlignScore: 0.662,
- SummaC-ZS: 0.436.

This comparison should be read carefully. The MiniCheck gap is not the exciting part, and the paper says the paired trace-level bootstrap does not make that gap statistically decisive. The useful difference is that MiniCheck, RAGAS, AlignScore, and SummaC-ZS do not emit MCP source IDs, so they cannot evaluate source ownership.

On the harder multi-source benchmark, ProvenanceGuard gets:

- block F1: 0.846,
- source accuracy: 0.503,
- source-plus-relation accuracy: 0.229.

The drop is important. Binary blocking stays feasible, but exact provenance is hard when multiple plausible sources discuss similar facts.

## Repair results

The repair loop is useful but should not be over-celebrated.

On the full 281 captured traces:

- 108 answers are initially allowed,
- 173 are initially blocked,
- all 173 blocked answers are resolved by repair and pass the verifier afterward,
- but 144 of those repairs require a terminal conservative fallback.

On the 59 reconstructed multi-source benchmark answers:

- all 59 are initially blocked,
- all 59 are resolved and pass re-verification,
- 2 require terminal fallback.

On 50 controlled clinical source-conflation probes:

- all 50 deliberate source-attribution swaps are detected,
- all 50 are repaired,
- no repaired answer retains the deliberately wrong attribution.

That 50/50 result is good as a diagnostic, but the probes are simple explicit swaps. It is not evidence that adversarial, paraphrased, multi-error source conflation is solved.

## What is actually novel?

The novelty is not "NLI for factuality." The useful contribution is the source-aware contract:

- keep MCP source IDs through the verifier,
- route claims to source-specific evidence,
- compare support source against stated attribution,
- report claim-to-source provenance metrics,
- and repair only after rechecking against the same source-aware verifier.

The paper also contributes a benchmark shape: evaluate not only whether an answer is supported, but whether it assigns that support to the right source family and relation.

## Strengths

- It names a real MCP-agent failure mode instead of flattening everything into generic hallucination.
- It distinguishes "supported somewhere" from "supported by the claimed source."
- It uses stable tool/source IDs from traces rather than anonymous concatenated context.
- It reports both support and provenance metrics.
- It includes source-blind baselines but does not pretend they measure attribution.
- The multi-source benchmark exposes the hard part: same-topic distractors make exact source ownership difficult.
- The fail-closed operating point is appropriate for high-stakes review settings.
- The paper is refreshingly explicit about operating constants, model IDs, thresholds, calibration, and reproducibility artifacts.

## Weaknesses and caveats

The held-out split is small: 40 traces and 361 claims, with a wide trace-bootstrap interval. The benchmark is also from one medical MCP-agent stack, so it is not universal medical factuality validation or clinical safety validation.

The labels are LLM-assisted, and only the held-out packet is human-expert reviewed. That is acceptable for a first benchmark, but not enough to treat the dataset as clinician-gold factuality ground truth.

The random held-out split has few contradictions and no gold conflation relation, so the strongest conflation evidence comes from controlled injected probes. Those probes are useful but too clean.

The rule-based decomposer has high recall against the frozen extraction artifact but lower precision and imperfect protected-value preservation. Since the verifier depends on atomic claims, decomposition remains an evaluation and reliability gap.

Repair success is partly conservative fallback and is judged by the same verifier. Passing re-verification is not the same as producing a clinically complete answer.

Exact source ownership is still weak in the hard setting. Source-plus-relation accuracy falls to 0.229 overall on the multi-source frozen-claim rerun, and same-topic wrong-chart/wrong-patient cases are especially hard.

The binary F1 gain over MiniCheck is modest and not the main story. Anyone selling this as "beats factuality baselines by a mile" would be over-reading it. The paper is valuable because it measures something the baselines cannot.

## What challenges remain?

- Better claim decomposition with protected-value preservation.
- Stronger source-aware NLI or entailment models that do not rely so much on calibration.
- Larger multi-source traces with more simultaneous plausible candidates.
- Harder conflation benchmarks with paraphrase, multiple errors, implicit attribution, and adversarial wording.
- More domains beyond one medical MCP-agent stack.
- Human-authored gold atomic claims and relation labels.
- Repair evaluation by independent judges, not only by the same verifier that triggered repair.
- Clearer deployment policies for when fail-closed blocking creates too much review burden.

## Why It Matters

MCP and tool-agent evaluation cannot stop at "is this claim supported somewhere in the context?" Once agents pull from FHIR records, PubMed, search, files, tickets, and other tools, the source of support becomes part of the factual claim. ProvenanceGuard gives a concrete benchmark and verifier design for that problem. The contribution is not a huge binary factuality win over MiniCheck; it is the claim-to-source accountability that source-blind support checkers cannot emit.

## Steal-worthy ideas

- Preserve tool/source IDs all the way through evaluation.
- Treat source attribution as part of factuality, not as citation polish.
- Evaluate same-topic wrong-source distractors explicitly.
- Report source accuracy and source-plus-relation accuracy alongside support/block F1.
- Use fail-closed answer-level gating for high-stakes tool-agent settings.
- Separate "repair passed the verifier" from "repair produced a good substantive answer."
- Keep conservative fallback as a real outcome, not an embarrassment to hide.

## Final decision

Keep.

This is a strong reference for source-aware evaluation of MCP and tool-using agents. The keeper sentence: a claim being supported somewhere in the trace is not enough; the answer must be supported by the source it claims or implies. Use this paper when arguing that provenance is a first-class evaluation target for agentic systems. Do not cite it as proof that factuality checking, clinical safety, or automated repair is solved.
