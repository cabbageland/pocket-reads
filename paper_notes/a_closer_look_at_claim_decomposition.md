# A Closer Look at Claim Decomposition

## Basic info

* Title: A Closer Look at Claim Decomposition
* Authors: Miriam Wanner, Seth Ebner, Zhengping Jiang, Mark Dredze, Benjamin Van Durme
* Year: 2024
* Venue / source: Proceedings of the 13th Joint Conference on Lexical and Computational Semantics (*SEM 2024), ACL Anthology
* Link: https://aclanthology.org/2024.starsem-1.13/
* PDF: https://aclanthology.org/anthology-files/pdf/starsem/2024.starsem-1.13.pdf
* arXiv HTML: https://arxiv.org/html/2403.11903v1
* DOI: https://doi.org/10.18653/v1/2024.starsem-1.13
* Date read: 2026-06-05
* Date surfaced: 2026-06-05
* Surfaced via: Tracy in #pocket-reads via arXiv HTML link
* Why selected in one sentence: It tackles the awkward hidden dependency in factuality scoring: if a metric first decomposes text into subclaims, then decomposition quality becomes part of the measurement rather than harmless preprocessing.

## Quick verdict

Strong, compact, and more important than it looks

This is a good paper because it notices a measurement leak that a lot of factuality work quietly inherits. Metrics like FActScore are often described as judging whether generated text is supported by evidence, but before the evidence check happens, the system has already chosen what counts as a claim. If that decomposition is too coarse, too sparse, or invents information, the final factuality score partly measures the decomposer. The paper's answer is not a giant new benchmark. It introduces DecompScore, a simple adaptation of FActScore that checks whether generated subclaims are supported by the original sentence, then uses it to compare decomposition methods. The Russellian/neo-Davidsonian prompting idea is a little philosophy-flavored, but it is not decorative: it gives the LLM better in-context examples for splitting claims into smaller property and relation statements.

## One-paragraph overview

The paper studies claim decomposition for localized textual support metrics such as FActScore and WiCE-style entailment scoring. These metrics decompose generated text into subclaims, validate each subclaim against a source, then aggregate support judgments. The authors show that this decomposition step is not neutral: different decomposers assign different FActScores to the same fixed generated biographies. To evaluate the decomposition step directly, they introduce DecompScore, which asks whether each produced subclaim is supported by the original sentence rather than by an external knowledge source. They then compare several LLM-prompted decomposition methods, syntax-assisted methods, and a new LLM prompting strategy whose in-context examples are manually decomposed using Russellian logical atomism and neo-Davidsonian event semantics. The new method, DR-ND, produces the most supported subclaims per biography and appears qualitatively better at coverage and atomicity, though all methods still miss some subclaims and sometimes produce non-atomic outputs.

## Model definition

### Inputs
Generated biography passages from the FActScore data, split into sentences or sentence-level claims, plus prompts or syntactic parses used by each decomposer.

### Outputs
Natural-language subclaims for each input sentence, then support judgments for those subclaims either against the original sentence (DecompScore) or against retrieved knowledge (FActScore).

### Training objective (loss)
This is not a new trained model paper. It is an evaluation and prompting study. LLMs and parsers are used as components; the main contribution is the decomposition-quality metric plus the in-context decomposition design.

### Architecture / parameterization
The paper compares:
- LLM prompting variants based on FActScore, WiCE, and Chen et al. style instructions.
- A syntactic parse based variant using CoNLL-U dependency parses.
- A PredPatt shallow-semantic parser, with an LLM used to convert extracted predicate-argument fragments into fluent natural language.
- DR-ND, an LLM-prompted method using manual in-context examples decomposed with Russellian and neo-Davidsonian intuitions.

The validator for DecompScore and FActScore is Inst-LLAMA from the FActScore setup. The authors use gpt-3.5-turbo-instruct for decomposition and for turning PredPatt fragments into fluent sentences.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
The paper is trying to solve a measurement problem in factuality and textual-support evaluation.

Decompose-then-verify metrics assume that the list of subclaims is a faithful, complete, and useful representation of the original text. But if the decomposition omits claims, merges claims, or introduces unclaimed information, then the downstream factuality score can be wrong for reasons that have nothing to do with the generator being evaluated. The metric blames or rewards the text generator for artifacts introduced by the decomposer.

That is especially dangerous because claim decomposition often happens through LLM prompting, which feels simple enough to disappear into the background. The paper's point is that this background step needs its own audit.

### 2. What is the method?
The method has two parts.

First, the authors introduce DecompScore. It reuses the FActScore-style binary support judgment, but swaps the evidence source. Instead of asking whether a subclaim is supported by external retrieved evidence, DecompScore asks whether the subclaim is supported by the original sentence that was decomposed. The score is the average number of supported subclaims per passage.

Second, they propose DR-ND, a decomposition prompt whose in-context examples are manually decomposed according to logical atomism and neo-Davidsonian semantics. In practice, that means pushing the examples toward small statements about properties of entities, properties of events, and relations between individuals or events.

### 3. What is the method motivation?
The motivation is clean: a good localized factuality metric needs subclaims that are:
- coherent with the original claim,
- high coverage,
- and atomic enough to localize support or error.

LLM prompting can generate fluent decompositions, but it has no hard guarantee of coherence or atomicity. Parse-based methods are more grounded in the sentence, but can be ungrammatical, brittle, or too tied to surface syntax. The authors want a way to compare these choices directly and to guide the LLM toward smaller, more semantically motivated units without building a full formal semantic parser.

### 4. What data does it use?
The study uses the released FActScore biography data from Min et al. The data consists of biographies for 500 people generated by 12 language models, including GPT-4, ChatGPT, InstructGPT, Alpaca variants, Vicuna variants, Dolly, StableLM, Oasst-pythia, and MPT-Chat. The authors treat these generated biographies as fixed documents and apply different decomposition methods to the same text.

### 5. How is it evaluated?
The paper evaluates decomposition methods in three connected ways:

- DecompScore: average number of subclaims per biography that are supported by the original sentence.
- FActScore sensitivity: whether the same generated biographies receive different factual-precision scores depending only on the decomposition method.
- Qualitative analysis: hand inspection of decomposition behavior on example sentences, focusing on coherence, coverage, and atomicity.

They also compare DecompScore-style LLM support judgments with NLI entailment judgments and report very high correlation, which is reassuring but not a full replacement for human evaluation.

### 6. What are the main results?
The big empirical result is that decomposition choice changes FActScore on the same underlying generated biographies. That means the factuality metric is sensitive to preprocessing in a way that should not be waved away.

On DecompScore, DR-ND performs best. Macro-averaged across the generated biographies, it reaches 42.3 supported subclaims per biography. The next strongest methods, the FActScore-style and Chen et al. style LLM prompts, are around 32. WiCE-style decomposition is much lower at about 20, largely because it is less atomic. PredPatt and CoNLL-U variants land in the middle, with PredPatt around 29.2 and CoNLL-U around 27.1.

The coherence picture is also important. Most LLM-prompted decompositions have high support against the original sentence, while PredPatt is notably weaker. DR-ND produces many more subclaims while only about 1.2 of 43.5 subclaims per biography are filtered out as unsupported on average.

### 7. What is actually novel?
The novelty is not just "split facts better." The useful novelty is treating decomposition quality as its own metric target and showing that decomposition is a real source of measurement variance.

DR-ND is also a nice prompt-design result: changing the in-context decompositions appears to matter more than tiny variations in instruction wording. The paper gives an unusually concrete example of how semantic theory can improve LLM prompting without turning into a formal logic system.

### 8. What are the strengths?
- The problem framing is sharp and easy to underestimate.
- DecompScore is simple, interpretable, and directly tied to the failure mode.
- The paper evaluates both downstream score sensitivity and decomposition quality.
- The Russellian/neo-Davidsonian examples make the prompt target more precise without pretending LLM outputs are formally guaranteed.
- The qualitative section is useful because it shows exactly how methods fail: missed subclaims, low atomicity, incremental subclaims, and occasional incoherence.
- The recommendation to filter subclaims unsupported by the original sentence is practical and cheap relative to the full factuality pipeline.

### 9. What are the weaknesses, limitations, or red flags?
- DecompScore rewards more supported subclaims, so it still relies on the assumption that higher atomicity and coverage are good for the downstream task. That is usually right for localized support, but it is not a universal truth for every evaluation setting.
- The data is restricted to English generated biographies, which is a narrow domain.
- The validator is itself a model, so the decomposition audit is not independent of model-mediated judgment.
- DR-ND relies on manual in-context examples, which may not transfer cleanly to other domains, genres, or languages.
- The method evaluates claimed information only. It cannot detect when a generated answer omits information that was required by an upstream user query.
- The paper does not make the decomposer deterministic or formally constrained; it improves prompting and filtering, but the decomposition layer remains probabilistic and prompt-sensitive.

### 10. What challenges or open problems remain?
The biggest open problem is turning "good atomic decomposition" into something robust across domains. Biographical claims are convenient: entities, roles, dates, locations, and relations are relatively crisp. Scientific claims, legal claims, causal claims, and instructions are messier.

There is also a deeper evaluation question: sometimes a decomposition can be technically coherent but operationally unhelpful. Very tiny subclaims may be easy to verify but may lose context needed for evidence retrieval or decontextualized interpretation. The paper catches the first-order issue, but the next layer is about decomposition plus decontextualization plus retrieval as one pipeline.

### 11. What future work naturally follows?
- Domain-specific decomposition studies for science, medicine, law, and agent traces.
- Human evaluation of DecompScore judgments and decomposition usefulness.
- Mixed structured/natural-language decompositions that preserve context while enabling atomic checks.
- Better filters for unsupported or underspecified subclaims before downstream verification.
- Joint optimization of decomposition, retrieval, and verification rather than treating them as separable boxes.

### 12. Why does this matter?
Because factuality metrics are starting to shape how people judge generated text, and a metric that hides a weak decomposition step can look more objective than it is. The paper makes a useful epistemic demand: before asking whether the generated text is supported, make sure the metric is actually checking the claims the text made.

## Why It Matters

This paper is worth keeping because it is a small, precise correction to a big evaluation habit. "Atomic facts" are not magic objects that fall out of a sentence. They are produced by a method, and that method can erase, blur, or hallucinate parts of the thing being measured. For anyone building evaluations, fact-checking agents, research assistants, or retrieval-verification pipelines, this is a reminder to audit the claim-extraction layer instead of treating it as invisible plumbing.

### 13. What ideas are steal-worthy?
- Add an original-sentence support check before sending decomposed claims to external verification.
- Evaluate decomposition methods by coherence, coverage, and atomicity, not just by downstream score movement.
- Treat in-context examples as the real behavioral specification, not decoration around the instruction.
- Use semantic theory as prompt-design scaffolding when it gives clearer decomposition targets.
- Be suspicious of factuality scores that vary when only the decomposer changes.

### 14. Final decision
Keep.

This is not a giant systems paper, but it is a very useful evaluation paper. The main takeaway is simple and durable: if the metric decomposes first, the decomposer is part of the metric. Audit it, score it, and filter its mistakes before pretending the final number belongs entirely to the model being evaluated.
