---
title: Towards Automating Scientific Review with Google's Paper Assistant Tool
slug: towards-automating-scientific-review-with-googles-paper-assistant-tool
authors: Rajesh Jayaram, Drew Tyler, David Woodruff, Corinna Cortes, Yossi Matias, Vahab Mirrokni, Vincent Cohen-Addad
year: 2026
venue: arXiv preprint (cs.LG, cs.AI, cs.CL, cs.CY)
date_read: 2026-06-30
paper_url: https://arxiv.org/abs/2606.28277
pdf_url: https://arxiv.org/pdf/2606.28277
verdict: Important agenda paper, product-report caveats
summary: Google presents the Paper Assistant Tool (PAT), an agentic manuscript-review system built around inference scaling rather than a single whole-paper model call. PAT segments a paper into logical sections, allocates compute by section complexity, runs specialized deep-review agents, then synthesizes and grounds the resulting report. On a filtered SPOT subset of Math/CS equation and proof errors, PAT reports 89.7% detection accuracy versus 55.2% for zero-shot Gemini 3.1 Pro and 21.1% for the original SPOT SOTA. The paper also reports STOC and ICML pre-submission pilot programs covering 4,700+ submissions, with strongly positive author surveys and many authors saying PAT found substantive gaps or triggered new experiments.
why_it_matters: This is directly relevant to the scientific-agent stack because it flips the usual AI-for-science story from generation to verification. The paper's best idea is not "AI should replace reviewers"; it is that review needs purpose-built verification agents with segmentation, adaptive budget allocation, deep section review, synthesis, grounding, and human accountability. That is a reusable architecture for paper review, code review, theorem checking, experiment auditing, and deep research agents.
final_decision: Keep, but cite carefully. Use it for the PAT pipeline, the four-role taxonomy of AI in peer review, the SPOT error-detection result, and the STOC/ICML pilot evidence that author-facing review agents can catch real issues. Do not cite it as independent proof that AI can automate peer review: PAT is proprietary, the benchmark subset is small and filtered, the pilots rely on self-reported author surveys, and the paper is written by the system's builders.
tags: scientific-review, peer-review, ai-for-science, paper-assistant-tool, pat, agentic-review, verification, inference-scaling, google-research, spot-benchmark, scientific-validation, automated-review, review-agents, scientific-agents, ai-governance
---

# Towards Automating Scientific Review with Google's Paper Assistant Tool

## Basic info

* Title: Towards Automating Scientific Review with Google's Paper Assistant Tool
* Authors: Rajesh Jayaram, Drew Tyler, David Woodruff, Corinna Cortes, Yossi Matias, Vahab Mirrokni, Vincent Cohen-Addad
* Year: 2026
* Venue / source: arXiv preprint (cs.LG, cs.AI, cs.CL, cs.CY)
* Link: https://arxiv.org/abs/2606.28277
* PDF: https://arxiv.org/pdf/2606.28277
* arXiv version inspected: v1, submitted 2026-06-26
* Date read: 2026-06-30
* Date surfaced: 2026-06-30 (via Tracy)
* Why selected in one sentence: It is Google's public case for moving AI in science from generation toward verification, using PAT as a concrete author-facing review agent.

## Quick verdict

Important agenda paper, product-report caveats

This is worth keeping, but it should be read as a Google product/position paper rather than a fully independent benchmark paper. The core argument is right: AI-assisted science creates a verification bottleneck, so the review side needs agentic tooling too. PAT is interesting because it is not just "ask a model to review the paper." It decomposes the manuscript, allocates compute adaptively, runs deep section reviews, and synthesizes/grounds the final critique.

The empirical evidence is promising but not definitive. The SPOT result is strong, the STOC/ICML pilot feedback is notable, and the qualitative examples are real signal. Still, PAT is proprietary, the SPOT subset is small and filtered, and the author survey numbers are self-reported by people who opted into a pre-submission tool. Treat this as an important signpost, not a settled answer to peer review.

## One-paragraph overview

The paper argues that AI-assisted scientific generation is worsening an already strained peer-review system, especially in machine learning and theoretical computer science. To address the validation side, Google introduces the Paper Assistant Tool (PAT), an agentic review pipeline powered by Gemini Deep Think and inference scaling. PAT segments a manuscript into logical parts, dynamically budgets compute by segment complexity, runs specialized deep-review agents with full-paper context, and synthesizes/grounds the resulting feedback. On a filtered subset of the SPOT benchmark containing Math/CS equation and proof errors, PAT reports 89.7% detection accuracy versus 55.2% for zero-shot Gemini 3.1 Pro. The paper also describes pre-submission pilots at STOC 2026 and ICML 2026, where authors reported high usefulness, clarity improvements, substantive theory-gap findings, and new experiments prompted by PAT feedback. The final section proposes a four-role taxonomy for AI in peer review, from author tool to full automation.

## What problem is the paper trying to solve?

The paper frames peer review as the emerging bottleneck in AI-assisted science.

The generation side is accelerating: LLMs help write code, generate hypotheses, prove theorems, draft papers, and produce more submissions. The verification side is still mostly human labor. The authors highlight submission growth at ICLR, ICML, and NeurIPS: the combined total rises from 17,051 in 2020 to an estimated 73,883 in 2026. They also cite evidence of AI-generated writing in scientific abstracts and AI-generated reviews.

Their claim is simple: if AI accelerates scientific output, then scientific validation needs AI support too. Otherwise the literature absorbs more errors, reviewers drown, and peer review becomes even noisier.

## What is PAT?

PAT is the Paper Assistant Tool, an agentic manuscript review and validation system powered by Gemini Deep Think.

The paper says PAT is currently specialized for mathematical/logical errors and comprehensive feedback on computer-science papers. It explicitly does not produce subjective ratings or rankings. It focuses on objective errors and potential improvements.

PAT is designed as an inference-scaling pipeline rather than a single model call.

The four stages are:

* Document segmentation: split the manuscript into logical segments such as intro, theory, methodology, and experiments. Segments may overlap and need not be contiguous.
* Adaptive budgeting: allocate light, medium, or high thinking compute based on segment complexity and information density.
* Deep review: run specialized review agents on each segment, while still providing full-paper context.
* Global synthesis: deduplicate critiques, check severity, ground claims with Google Search, and assemble the final PAT review.

The design is a direct response to two weaknesses in naive review agents. A single whole-paper call lacks enough effective thinking/context budget for deep verification. Pass@k scaling improves recall but floods the human with hallucinated or duplicate critiques and may repeatedly inspect the same sections.

## Why the architecture matters

The reusable idea is structured review allocation.

Reviewing a paper is not homogeneous. A proof-heavy appendix, a methodology section, an experiment table, and a related-work paragraph need different kinds of scrutiny. PAT's segmenter and adaptive budgeter encode that. The deep review agents then coordinate around sections rather than independent random passes, and the synthesis stage tries to restore precision by deduplicating and grounding.

For agent design, this is the important pattern:

* decompose the artifact into semantically meaningful regions,
* allocate compute by risk/complexity,
* review locally with global context,
* synthesize globally,
* ground and deduplicate before showing humans.

That pattern applies beyond peer review: code review, contract review, theorem checking, experiment audit, long report verification, and deep-research critique.

## SPOT benchmark result

The quantitative case study uses SPOT, a benchmark of scientific manuscripts with verified errors leading to errata or retractions.

The authors filter SPOT to Mathematics and Computer Science papers containing "Equation / proof" errors. This yields 26 papers with 29 errors. They compare PAT to a single model generation and to the original SPOT SOTA.

Reported detection accuracy:

* Original SPOT SOTA: 21.1%.
* Gemini 3.1 Pro zero-shot: 55.2%.
* PAT using Gemini 3.1 Pro: 89.7%.

They use an LLM-based grader to judge whether the generated report contains the ground-truth error, but the paper says a human author audited each grade for alignment. The authors also note that their logic-aware grader differs from the original SPOT strict keyword-match grader, so the numbers are not directly comparable to the original paper.

The main empirical point is still useful: modern models can already catch some real mathematical/proof errors, and an orchestrated inference-scaling review pipeline can substantially outperform a single whole-paper call.

## STOC and ICML pilot programs

Google provided PAT as a pre-submission author tool for STOC 2026 and ICML 2026.

The setup matters: PAT was offered to authors only, before final submission. It was not part of formal peer review. That corresponds to the paper's Role 1: AI as a Tool for Authors.

The pilots covered more than 4,700 submissions across the two conferences. STOC used a math-rigor-optimized pipeline for theory papers. ICML used a generalized version for machine-learning papers, including experiment critique, confounding-factor detection, and missing comparison suggestions.

Survey results:

* Would use PAT again: 97% STOC, 92.1% ICML.
* Improved clarity/readability: 85.1% STOC, 87.0% ICML.
* Believed PAT has educational value: 75.2% STOC, 83.9% ICML.
* Found PAT very or mostly helpful: 92.7% STOC, 90.7% ICML.
* Feedback mostly or all grounded: 55.8% STOC, 64.8% ICML.
* Identified substantive theory gaps: 11.6% STOC, 35.4% ICML.
* Ran new experiments: 31% ICML.

The last two numbers are the most interesting. If accurate, PAT was not just giving copy-editing polish; it was changing technical content and experimental work.

## Qualitative feedback

The qualitative examples are the paper's strongest anecdotal evidence.

Authors report PAT finding:

* a fatal algorithm bug that required major technical revisions,
* an invalid proof in an unbounded-time regime,
* significant errors that led to rewriting claims,
* missing absolute values,
* inequalities pointing the wrong way,
* overloaded notation,
* and off-by-one errors.

The paper includes named praise from STOC participants, including Vijay Vazirani, Hung Le, and Jason Li. That is unusually strong social proof for a review-assistance tool, though still not a controlled evaluation.

## Reported limitations

The pilots surfaced three main failure modes:

* date hallucinations and outdated knowledge cutoffs,
* PDF parsing issues,
* false claims that a proof or argument is wrong due to reasoning failure or misunderstanding.

The authors say the first two have been addressed with better search tooling and parsing. The third remains a fundamental LLM-system issue.

This caveat should stay attached. A review agent that hallucinates critiques can waste author/reviewer time or inject false objections into high-stakes decisions.

## Four Roles for AI in Peer Review

The taxonomy is one of the most reusable parts of the paper.

### Role 1: AI as a Tool for Authors

AI helps authors improve papers before submission. PAT's STOC/ICML pilot lives here. Authors remain responsible for the final paper.

Benefit: catches bugs early, improves clarity, raises baseline rigor.

Risk: papers may look superficially polished, forcing reviewers to work harder to distinguish genuine contribution from well-packaged weakness.

### Role 2: AI as a Tool for Reviewers

Reviewers use AI to understand papers, identify flaws, or draft reviews. The human reviewer remains responsible.

Benefit: speeds review and helps catch technical issues.

Risk: reviewers may outsource judgment, hide AI use, or defend hallucinated critiques during rebuttal.

### Role 3: AI as a Supporting Reviewer

AI submits an independent full-length objective review, such as proof or experiment validation. Humans later judge its output.

The paper also defines Role 3.5, where AI provides subjective ratings or acceptance recommendations.

Benefit: reduces human review-hours and adds technical checking capacity.

Risk: hallucinated critiques can directly influence acceptance decisions; Role 3.5 moves into even more dangerous territory because ratings shape outcomes.

### Role 4: Total AI Automation of Peer Review

AI systems automate the review pipeline, potentially through an AI-vetted repository such as an "AIrXiv."

Benefit: could create a faster tier between raw preprint and traditional conference/journal acceptance.

Risk: centralized viewpoints, reduced intellectual diversity, adversarial gaming, opaque standards, and automated career consequences.

## What is actually novel?

The novelty is not "LLM reviews papers." People already do that.

The novelty is the combination of:

* a concrete inference-scaling review architecture,
* deployment at STOC and ICML as a pre-submission author tool,
* an empirical SPOT error-detection case study,
* and a policy taxonomy for escalating AI from author support to reviewer support to automation.

The paper is most useful as a strategic artifact: it maps where AI review tooling is going and gives one concrete system shape.

## Strengths

The paper correctly centers verification rather than generation. That is the right problem.

PAT's architecture has good engineering taste. Segment, budget, review, synthesize, ground.

The SPOT result is strong enough to matter, especially because the subset involves real errors from errata/retractions rather than toy mistakes.

The STOC/ICML pilot is consequential. A tool used on 4,700+ submissions is not a lab demo.

The authors are explicit about role boundaries and accountability. Keeping PAT in Role 1 for the pilots is the correct cautious choice.

The taxonomy is useful for policy discussion because it separates author assistance, reviewer assistance, independent technical review, AI ratings, and full automation.

## Weaknesses and caveats

PAT is proprietary. The paper does not provide enough detail to reproduce the system, evaluate it independently, or compare it under equal-cost conditions.

The SPOT subset is small: 26 papers and 29 errors, filtered specifically for Math/CS equation/proof errors. This is useful but narrow.

The SPOT grading protocol differs from the original benchmark's strict grader, so comparisons to original SPOT SOTA require care.

The pilot evidence is mostly author survey data. Authors who used PAT and responded may be unusually favorable, and self-reporting is not the same as independent paper-quality measurement.

The feedback-groundedness numbers are mixed. Only 55.8% of STOC and 64.8% of ICML respondents said the feedback was mostly or all grounded. That is promising for an early system but not enough for high-stakes reviewer replacement.

The paper is written by the system builders, so the interpretation is naturally optimistic.

The higher-role taxonomy gestures at automation but does not solve governance, adversarial gaming, unequal access, or scientific pluralism.

## Why It Matters

This paper is a marker for a coming shift: AI tools will not just produce science; they will increasingly validate it. The question is not whether people will use AI in review. They already are. The question is whether the community builds accountable, bounded, auditable systems or lets hidden ad hoc AI review leak into decisions.

For real agent builders, PAT suggests a practical design pattern for verification agents. Do not run one big prompt and call it review. Build a pipeline that decomposes, budgets, checks deeply, synthesizes, grounds, and keeps humans responsible for final judgment.

## Final Decision

Keep. Cite it for PAT's segmented inference-scaling review pipeline, the SPOT case study, the STOC/ICML author-facing pilots, and the four-role taxonomy for AI in peer review.

Keep the caveat visible: this is not proof that AI can replace reviewers. It is good evidence that author-facing verification agents can catch meaningful errors and improve manuscripts, and a serious argument that review automation needs explicit role boundaries before it becomes institutional power.
