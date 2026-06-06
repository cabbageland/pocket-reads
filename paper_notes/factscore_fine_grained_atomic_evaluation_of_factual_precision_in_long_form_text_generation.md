# FActScore: Fine-grained Atomic Evaluation of Factual Precision in Long Form Text Generation

## Basic info

* Title: FActScore: Fine-grained Atomic Evaluation of Factual Precision in Long Form Text Generation
* Authors: Sewon Min, Kalpesh Krishna, Xinxi Lyu, Mike Lewis, Wen-tau Yih, Pang Wei Koh, Mohit Iyyer, Luke Zettlemoyer, Hannaneh Hajishirzi
* Year: 2023
* Venue / source: Proceedings of the 2023 Conference on Empirical Methods in Natural Language Processing, ACL Anthology
* Link: https://aclanthology.org/2023.emnlp-main.741/
* PDF: https://aclanthology.org/2023.emnlp-main.741.pdf
* arXiv PDF: https://arxiv.org/pdf/2305.14251
* DOI: https://doi.org/10.18653/v1/2023.emnlp-main.741
* Code: https://github.com/shmsw25/FActScore
* Date read: 2026-06-05
* Date surfaced: 2026-06-05
* Surfaced via: Tracy in #pocket-reads via arXiv PDF link
* Why selected in one sentence: It is one of the papers that turned long-form factuality evaluation from a mushy passage-level judgment into a concrete claim-level measurement pipeline.

## Quick verdict

Important, cleanly motivated, and still more useful as a measurement discipline than as a magic score

This paper is worth keeping because it made a very productive move: stop asking whether a whole long-form answer is "factual" and instead ask what fraction of its atomic claims are supported by a trusted source. That sounds obvious after the fact, but it fixed a real evaluation mismatch. Long generations are usually not all right or all wrong; they are a bag of correct facts, wrong facts, irrelevant additions, and underspecified claims. FActScore gives that mess a useful unit of account. The catch is that the paper also inherits the hard parts: atomic facts have to be generated somehow, the support source has to be chosen, retrieval can miss evidence, and precision alone can be gamed by abstaining or saying less. So the right takeaway is not "FActScore solves factuality." It is "claim-level factual precision is the minimum serious baseline for evaluating long-form factual text."

## One-paragraph overview

FActScore evaluates long-form generations by decomposing each response into atomic facts and computing the percentage of those facts supported by a reliable knowledge source. The paper studies biography generation because biographical claims are usually objective, specific, and well covered by Wikipedia. The authors first run a human evaluation on biographies produced by InstructGPT, ChatGPT, and search-augmented PerplexityAI, finding substantial factual precision errors even in commercial systems: 42.5% for InstructGPT, 58.3% for ChatGPT, and 71.5% for PerplexityAI. They then build an automatic estimator that decomposes generations, retrieves evidence from the knowledge source, and validates each atomic fact with a language model or nonparametric likelihood method. Retrieval-based estimators track human FActScore closely enough to evaluate 6,500 biographies from 13 subjects, showing that GPT-4 and ChatGPT outperform public models but remain below human-written biographies. The broader contribution is a practical measurement recipe for long-form factual precision, plus a clear warning that citations, search access, and fluent writing are not the same thing as supported claims.

## Model definition

### Inputs
Prompts asking for long-form text, especially "Tell me a bio of <entity>" in the main experiments; generated responses from the model being evaluated; and a trusted knowledge source used for support judgments, usually Wikipedia in this paper.

### Outputs
A FActScore for the subject model: the fraction of atomic facts in its non-abstained generations that are supported by the selected knowledge source. The pipeline also produces intermediate atomic facts and binary support labels for each fact.

### Training objective (loss)
This is not a new trained generator. It is an evaluation metric and estimator. The automated estimator uses existing language models, retrieval models, and a nonparametric likelihood method to approximate human support labels.

### Architecture / parameterization
The metric has two conceptual stages:

- Atomic fact generation: split a long response into short factual statements, each intended to express one piece of information.
- Atomic fact validation: decide whether each fact is supported by the chosen corpus.

The automated estimator compares several validation variants:

- No-context LM: asks a language model whether an atomic fact is true or false without retrieval.
- Retrieve -> LM: retrieves passages from the knowledge source, then asks a language model to judge support.
- Nonparametric Probability (NP): scores masked-token likelihood against retrieved/nonparametric evidence.
- Retrieve -> LM + NP: marks a fact supported only when both methods support it.

The experiments use InstructGPT for automatic atomic fact generation, Inst-LLAMA and ChatGPT as evaluators, and GTR for passage retrieval.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
The paper is trying to solve the problem of evaluating factual precision in long-form model outputs.

Binary judgments are too crude for long responses. A biography can contain ten correct claims and five false ones; calling the whole answer correct or incorrect throws away the thing we care about. Sentence-level support is also too coarse, because a single sentence can mix supported and unsupported facts.

FActScore asks for a smaller evaluation unit: the atomic fact. The metric then evaluates factual precision as a percentage of supported atomic facts rather than as a single passage-level judgment.

### 2. What is the method?
The method is:

1. Generate a long-form answer from the model being evaluated.
2. Split the answer into atomic factual statements.
3. Check each atomic fact against a trusted knowledge source.
4. Compute the fraction of supported facts among all atomic facts in non-abstained responses.

Formally, for a response y with atomic facts A_y and knowledge source C, the response score is the average indicator that each atomic fact is supported by C. The model score averages that over prompts where the model actually responds.

The human study uses expert annotators to revise atomic facts and label support against Wikipedia. The automatic version approximates those labels with retrieval plus language-model validation.

### 3. What is the method motivation?
The motivation is that long-form factuality is partial and source-relative.

"Partial" matters because long responses almost always contain mixtures. One unsupported fact should not erase ten supported facts, but ten supported facts should not hide one fabricated date, role, or relation either.

"Source-relative" matters because the paper defines factual precision as support by a chosen corpus, not free-floating truth. That is a sensible operational move: for biographies, Wikipedia is treated as the reference source; for scientific claims, one could imagine an ACL Anthology or PubMed corpus; for current events, a news corpus.

### 4. What data does it use?
The main human evaluation samples 183 people from Wikidata with corresponding Wikipedia pages. The authors prompt InstructGPT, ChatGPT, and PerplexityAI with "Tell me a bio of <entity>" and evaluate the generated biographies against English Wikipedia.

For the larger automatic evaluation, they sample 500 human entities and collect generations from 12 language models plus human-written DBPedia biographies. The resulting large-scale comparison covers 6,500 generations.

### 5. How is it evaluated?
There are two layers of evaluation.

First, the paper manually evaluates the factual precision of commercial long-form generations. Annotators split or revise atomic facts, then label each fact as supported, not supported, or irrelevant with respect to Wikipedia.

Second, the paper evaluates automated FActScore estimators by comparing estimated scores to human scores. The main reported metric is error rate: the absolute difference between the estimated FActScore and the human FActScore. They also check whether estimators preserve the ranking of subject models.

The automatic estimator is then used as a case study to rank additional models, where full human evaluation would have been expensive.

### 6. What are the main results?
The human evaluation is bracing:

- InstructGPT reaches a FActScore of 42.5%.
- ChatGPT reaches 58.3%.
- PerplexityAI reaches 71.5%, despite using search.

Factual precision drops for rarer entities across all three systems. Precision also gets worse later in the generation, which is important because short-answer benchmarks can miss long-tail degradation inside long responses.

The search result is especially useful. PerplexityAI is better than the non-search systems, but it still produces unsupported or irrelevant claims. The paper also finds that citation presence is weak evidence of correctness: supported and unsupported sentences have citations at similar rates.

For automatic estimation, retrieval helps a lot. No-context language-model judging is weak; retrieval-based methods better approximate human labels and preserve rankings more reliably. The best estimator depends on the subject model, and ChatGPT is not automatically the best evaluator because it can over-label unsupported facts as supported.

In the large-scale model comparison, human-written biographies rank highest, GPT-4 and ChatGPT are the strongest model outputs, public models lag behind them, and model family/size/training recipe matter.

### 7. What is actually novel?
The novelty is the operationalization.

Atomic fact evaluation was not invented from nowhere, but this paper packaged it into a practical metric, collected a human evaluation dataset, built an automatic estimator, and released code/data in a way that made the metric easy to reuse.

The source-relative framing is also important. The paper is not asking whether a statement is metaphysically true. It asks whether the statement is supported by the knowledge source the evaluator trusts.

### 8. What are the strengths?
- The paper chooses the right unit of measurement for long-form factual precision.
- The metric is interpretable: a score is literally a percentage of supported atomic facts.
- The human evaluation exposes how flawed fluent commercial generations were, especially on rarer entities.
- The PerplexityAI analysis is a good antidote to "search + citations = factual."
- The automatic estimator is pragmatic and compares multiple validation strategies rather than pretending one prompt solves support checking.
- The paper reports abstention and number of facts, which helps keep precision scores from being read in isolation.
- The limitations are unusually honest about source choice, recall, abstention, and domain transfer.

### 9. What are the weaknesses, limitations, or red flags?
- FActScore measures precision, not recall. A model can score well by saying fewer facts, abstaining more often, or omitting the important part of the answer.
- Atomic facts are not naturally occurring objects. They are produced by a decomposer, and decomposition quality can change the final score.
- The main experiments are biographies against Wikipedia, a relatively convenient domain with crisp entities and broad source coverage.
- The metric assumes facts are objective, support judgments are not debatable, and the knowledge source is reasonably consistent.
- The automatic estimator can make individual support errors, especially when retrieval misses direct evidence.
- All atomic facts are weighted equally, even though some errors matter far more than others.
- The metric is less suitable for subjective, nuanced, contested, or intentionally misleading text.

### 10. What challenges or open problems remain?
The biggest open problem is a fuller factuality evaluation that balances precision, recall, relevance, and usefulness. FActScore can tell us what fraction of stated facts are supported; it does not tell us whether the answer included the facts it should have included.

Another open problem is robust decomposition. Later work on claim decomposition is basically poking at this pressure point: if the decomposition step omits, merges, or invents claims, then the final factuality score partly measures the decomposer rather than the generator.

There is also a retrieval problem. If the support source contains the evidence but retrieval fails to surface it, the validator may mark a true claim unsupported. This matters more as the domain shifts from biographies to scientific, legal, medical, or recent-event claims.

### 11. What future work naturally follows?
- Pair FActScore-like precision with factual recall and answer completeness metrics.
- Evaluate claim decomposition quality as its own first-class stage.
- Build domain-specific factuality evaluators for science, law, medicine, finance, and current events.
- Improve retrieval and decontextualization for support checking.
- Weight atomic facts by importance or downstream harm rather than treating all claims equally.
- Use FActScore labels not just to evaluate generated text, but to edit or repair unsupported claims.

### 12. Why does this matter?
This matters because long-form generation made old factuality evaluation habits look silly. A paragraph can be half right in ways that are operationally important. FActScore gave the field a practical way to measure that half-rightness without pretending the whole answer has one truth value.

For agents, research assistants, bios, reports, summaries, and retrieval-augmented systems, the lesson is durable: evaluate the claims, not the vibe of the paragraph. And when a system provides citations, still check whether each actual claim is supported.

## Why It Matters

FActScore is one of those papers whose best idea became obvious only after someone made it concrete. It made "atomic factual precision" a reusable engineering object: decomposed claims, source-backed support checks, and an aggregate score. That object is imperfect, but it is a better starting point than treating long-form factuality as a vibes tribunal.

Its deeper value is the discipline it imposes. If an evaluation depends on extracted claims, then extraction is part of the evaluation. If support depends on retrieval, retrieval is part of the evaluation. If precision ignores recall, the score must travel with abstention and fact-count statistics. The paper does not eliminate those dependencies, but it makes them visible enough to argue with.

### 13. What ideas are steal-worthy?
- Score long-form factual precision at the atomic-claim level.
- Define factuality relative to an explicit trusted source.
- Always report abstention rate and number of generated facts next to precision.
- Use retrieval before asking a model to judge factual support.
- Treat citations as claims to verify, not as evidence that verification happened.
- Keep an eye on position effects: later claims in a generation may be less reliable.
- Use FActScore-style labels as possible edit targets, not only evaluation artifacts.

### 14. Final decision
Keep.

This is foundational Pocket Reads material for evaluation-minded work. It is not the final answer to factuality, but it is a very good answer to one necessary subproblem: measuring the supported-claim fraction of long-form generated text. The right way to use it is with its caveats attached: precision only, source-relative, decomposition-dependent, and strongest when accompanied by abstention and fact-count reporting.
