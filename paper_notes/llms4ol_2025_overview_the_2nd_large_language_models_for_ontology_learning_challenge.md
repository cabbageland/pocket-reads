---
title: LLMs4OL 2025 Overview: The 2nd Large Language Models for Ontology Learning Challenge
slug: llms4ol-2025-overview-the-2nd-large-language-models-for-ontology-learning-challenge
authors: Hamed Babaei Giglou, Jennifer D'Souza, Nandana Mihindukulasooriya, Soren Auer
year: 2025
venue: Open Conference Proceedings 6; ISWC 2025 LLMs4OL Challenge overview
date_read: 2026-07-04
paper_url: https://www.tib-op.org/ojs/index.php/ocp/article/view/2913
pdf_url: https://d-nb.info/1382528000/34
verdict: Keep as a benchmark and field map for LLM-based ontology learning; do not treat it as a single-method result paper.
summary: This paper reports the second LLMs4OL shared task at ISWC 2025, a challenge for using large language models in ontology learning. The benchmark covers Text2Onto term/type extraction, term typing, taxonomy discovery, and non-taxonomic relation extraction across biomedical, materials, ecology, scholarly, engineering, agriculture, chemistry, general-web, and biology ontologies. Across 1,038 submissions and 26 subtasks, the clearest result is not that one model wins everywhere; it is that hybrid systems do best. Strong teams combine instruction-tuned LLMs with prompt engineering, retrieval, embeddings, clustering, data augmentation, domain-specific encoders, candidate pruning, and ensemble validation. Term typing can reach high F1 in some domains, but taxonomy and especially non-taxonomic relation extraction remain brittle, sparse, and strongly domain-sensitive.
why_it_matters: This is useful for anyone trying to turn language into durable structured knowledge. The paper is a reality check against "just ask an LLM for the ontology": the better systems manage context windows, retrieve examples, prune candidate spaces, use domain encoders, and validate outputs. It also gives a compact map of where LLMs help ontology engineering today and where symbolic/embedding/domain machinery is still doing real work.
final_decision: Keep. Cite it for the LLMs4OL 2025 benchmark, task framing, participant system patterns, and the conclusion that ontology learning needs hybrid pipelines rather than single-model bravado. Use caution with leaderboard numbers: teams attempted different subsets, some tasks had very few submissions, Task A uses synthetic text generated from ontology axioms, and the overview summarizes participant systems rather than running controlled ablations under one codebase.
tags: ontology-learning, semantic-web, llms, knowledge-graphs, text2onto, term-typing, taxonomy-discovery, relation-extraction, rag, embeddings, prompt-engineering, clustering, data-augmentation, domain-adaptation, benchmark, shared-task, iswc, llms4ol, structured-knowledge, knowledge-engineering
---

# LLMs4OL 2025 Overview: The 2nd Large Language Models for Ontology Learning Challenge

## Basic info

* Title: LLMs4OL 2025 Overview: The 2nd Large Language Models for Ontology Learning Challenge
* Authors: Hamed Babaei Giglou, Jennifer D'Souza, Nandana Mihindukulasooriya, Soren Auer
* Year: 2025
* Venue / source: Open Conference Proceedings 6; LLMs4OL 2025 Task Overview at ISWC
* Article page: https://www.tib-op.org/ojs/index.php/ocp/article/view/2913
* DOI: https://doi.org/10.52825/ocp.v6i.2913
* PDF inspected: https://d-nb.info/1382528000/34
* Official PDF listed by article metadata: https://www.tib-op.org/ojs/index.php/ocp/article/download/2913/2922
* Published: 2025-10-01
* Date read: 2026-07-04
* Date surfaced: 2026-07-03
* Surfaced via: Tracy in #pocket-reads
* Data / challenge repository: https://github.com/sciknoworg/LLMs4OL-Challenge/tree/main/2025
* Why selected in one sentence: It is a useful benchmark snapshot for the practical problem of turning unstructured language into ontology-grade structured knowledge with LLMs.

## Quick verdict

Keep, but keep it in the right bucket.

This is not a new architecture paper and not a clean controlled study of one method. It is a challenge overview: tasks, datasets, leaderboard, participant systems, and lessons from a field trying to make LLMs useful for ontology learning.

The value is the pattern across submissions. Strong entries did not just prompt one big model and call it a day. They mixed LLM prompting with retrieval, embeddings, clustering, chunking, candidate filtering, data augmentation, domain encoders, lightweight fine-tuning, and ensemble validation. That is the actual result worth remembering.

The warning label is that the leaderboard is uneven. Teams attempted different subsets, some subtasks had only one or two participants, and the reported mean F1 scores are more a competition summary than a universal model ranking. Cite the paper for task structure and system lessons, not for "model X beats model Y" in a general sense.

## One-paragraph overview

The paper presents the second LLMs4OL challenge at ISWC 2025, a shared task for ontology learning with LLMs. The challenge is organized around four task families: Text2Onto, which extracts terms and types from unstructured text; term typing, which assigns generalized semantic types to lexical terms; taxonomy discovery, which predicts hierarchical parent-child type relations; and non-taxonomic relation extraction, which predicts semantic relation triples beyond `is-a`. The benchmark spans ontologies such as OBI, MatOnto, SWEET, DOID, Schema.org, PROCO, FoodON, PO, and GO, with seen and blind evaluation splits. The competition received 1,038 submissions from 35 participants across 26 subtasks; 13 system papers were submitted, 11 were accepted into the challenge proceedings, and one evaluated team appears only in the leaderboard. The top overall leaderboard entries were SBU-NLP, Alexbek, and silp nlp, but the more important conclusion is methodological: ontology learning with LLMs currently works best as a hybrid engineering problem rather than a pure generative-model problem.

## What problem is this trying to solve?

Ontology learning asks a very specific question: can we turn unstructured or weakly structured language into reusable machine-readable knowledge?

The paper frames ontology learning around five primitives:

* lexical entries;
* conceptual types;
* hierarchical taxonomy;
* non-taxonomic relations;
* axioms for constraints and rules.

That maps into a pipeline: prepare a corpus, extract terminology, assign types, build taxonomies, extract non-taxonomic relations, and eventually discover axioms.

LLMs are tempting here because they are good at language understanding, paraphrase, semantic association, and generalization. But ontology learning is not merely "generate plausible labels." The output has to be precise, reusable, and structurally consistent. That is where naive LLM use starts to wobble.

The challenge is useful because it turns that tension into concrete tasks.

## Challenge tasks

### Task A: Text2Onto

Task A extracts ontology candidates from raw text.

Subtask A1 asks for relevant lexical terms. Subtask A2 asks for conceptual types. The paper describes a dataset construction process where ontology elements are partitioned into semantically connected subsets, axioms are verbalized with templates, and an LLM paraphrases them into natural text while preserving semantic content.

That design makes the task useful for controlled benchmarking, but it is also a caveat: this is not the same as fully messy web-scale text extraction. Some of the text is synthetic and ontology-derived.

### Task B: Term Typing

Task B maps a lexical term to one or more generalized types. The paper gives the biomedical example of mapping "aspirin" to a class like "Pharmaceutical Drug."

This is the task where the leaderboard contains some of the strongest numbers. SBU-NLP reaches 0.9425 F1 on B1 OBI and 0.9271 F1 on B5 blind scholarly. DREAM-LLMs also performs strongly on B1, and IRIS leads B2 MatOnto with 0.6667 F1.

Term typing seems comparatively tractable when lexical cues, retrieved definitions, examples, or domain encoders are good.

### Task C: Taxonomy Discovery

Task C predicts hierarchical parent-child relations between types. This is harder because the system must produce structurally correct `is-a` edges, not just semantically nearby labels.

The results vary widely. Alexbek is strong on several C-series subtasks, SBU-NLP leads some, and silp nlp performs well on blind scholarly and engineering subtasks. But many scores are low, especially in large or sparse domains.

This is one of the places where embeddings and candidate pruning matter. Without pruning, taxonomy discovery has a combinatorial search problem hiding under the language-model wrapper.

### Task D: Non-taxonomic Relation Extraction

Task D extracts relation triples such as part-whole, causal, functional, or associative relations. It is the hardest and least-populated task family in the paper.

Subtask D3 GO had no participant score in the final table. D2 FoodON had extremely low F1 from the two participating teams. D1 SWEET and D4 blind ecology did better for silp nlp, but the task is clearly not solved.

This matters because non-taxonomic relations are where ontologies become more than clean trees. The paper quietly shows that LLMs still struggle to construct rich semantic relation structure reliably.

## Evaluation setup

The challenge uses precision, recall, and F1, with task-specific matching rules.

Task A uses Jaccard similarity over string labels with a threshold of 0.8. Task B treats predicted and true types as sets. Task C requires exact parent-child pair matches. Task D normalizes triples and handles symmetric relations by adding symmetric counterparts before scoring.

Those choices are reasonable for a shared task, but they shape what the leaderboard means. Exact parent-child scoring can be unforgiving when a prediction is semantically close but structurally offset. String thresholds can reward surface similarity. F1 is easy to compare, but ontology quality also depends on global coherence, maintainability, and downstream reasoning usefulness.

## Leaderboard signal

The finalized leaderboard ranks teams by mean F1 across submitted subtasks:

* SBU-NLP: 0.3741 mean F1
* Alexbek: 0.3400
* silp nlp: 0.2751
* LABKAG: 0.1718
* IRIS: 0.1457
* ELLMO: 0.0902
* DREAM-LLMs: 0.0796
* Phoenixes: 0.0638
* T-GreC: 0.0604
* DaseLab: 0.0125
* CUET Zenith: 0.0077
* SEMA: 0.0055

Do not overread these as model rankings. Some teams attempted many subtasks, some attempted only narrow slices, and the mean is heavily affected by coverage. The high-level signal is more reliable than the exact ordering:

* Task B term typing can get high scores in favorable settings.
* Task C taxonomy discovery remains uneven.
* Task D non-taxonomic relation extraction is still sparse and difficult.
* Blind-domain generalization is not a solved property.

## Participant systems

### SBU-NLP

SBU-NLP uses prompt engineering and embeddings without a heavy training pipeline. The paper highlights batch-prompted LLMs, context-window management, stratified sampling, simple random sampling, and chunking. Claude Sonnet 4 batch prompting is described as strong for Task B, while embedding baselines such as BGE-M3, all-mpnet-base-v2, all-MiniLM-L6-v2, and Stella are also used.

The interesting lesson is not "prompting wins." It is that prompt packaging, batching, and sampling are real engineering variables in ontology learning.

### Alexbek

Alexbek builds a modular LLM framework spanning Tasks A, B, and C. It combines few-shot prompting, retrieval-augmented generation, ensemble typing, and lightweight representation learning. The system uses Qwen3-Embedding-4B, all-mpnet-base-v2, BGE-large, and Qwen3-0.6B with LoRA adapters for taxonomy discovery.

The strong part is adaptability: known-domain cases use retrieved examples; blind cases use more general zero-shot or embedding-based strategies. The weak point, acknowledged in the paper, is reduced precision in domains with sparse lexical cues or fine-grained semantic distinctions.

### silp nlp

silp nlp participates across all four tasks with clustering-enhanced LLM methods. The system combines lexical clustering, semantic clustering, adaptive prompting, RAG-style retrieval-augmented extraction, and domain-adapted transformer models such as MaterialsBERT and BioBERT.

This is a good example of what ontology learning probably looks like in practice: cluster to shrink the search space, retrieve examples to condition the model, use domain encoders where general models are too vague, and then ask LLMs to reason inside constrained neighborhoods.

### LABKAG

LABKAG focuses on prompt design. The big lesson is that in-domain examples and richer context help, while noisy examples hurt. The paper also notes that term expansion can boost recall in engineering extraction but may reduce precision.

This is a useful reminder that "prompt engineering" is not only vibes. It is data selection, context scope, noise control, and deciding when recall is worth a precision hit.

### IRIS

IRIS emphasizes model-agnostic data manipulations: data augmentation, synonym expansion, automatic definition mining, and similarity-based candidate filtering. It uses DeBERTa-v3-large as the core classifier and all-MiniLM-L6-v2 embeddings for candidate filtering in Tasks C and D.

The most useful lesson is that input enrichment and pruning can improve performance without changing the model architecture. For ontology work, cleaning the candidate space may matter more than swapping one large model for another.

### ELLMO

ELLMO finds that simple pattern-like prompts can outperform elaborate strategies in Task A, but that the best approach is dataset-dependent. For Task D, it reduces candidate edges with clustering or vector database methods, then asks LLMs for edge probabilities.

The probability-output detail is interesting. Asking an LLM for edge probabilities improved recall and F1 in their setup, but examples in the prompt shifted the probability distribution. That is a clean illustration of how fragile calibration-like behavior can be under prompt changes.

### DREAM-LLMs

DREAM-LLMs uses deliberation across multiple models for low-resource term typing. ChatGPT-4o, Claude Sonnet 4, DeepSeek-V3, and Gemini-2.5-Pro each produce labels and justifications, then one model reviews the others and makes the final decision.

This is ensemble learning in an LLM wrapper. It helps because low-resource ontology domains expose model-specific blind spots, and deliberation can reduce individual-model bias.

### Other teams

Phoenixes tests chain-of-thought few-shot prompting with Qwen2.5-72B-Instruct, Mistral-Small, and LLaMA-3.3-70B-Instruct for Text2Onto. T-GreC shows that k-NN over fine-tuned transformer embeddings can beat direct fine-tuning on OBI term typing, though it does not generalize cleanly to MatOnto and SWEET. CUET Zenith uses hybrid embedding-LLM pipelines with XGBoost, TinyLlama, GPT-4o, Qwen3-14B, and BioBERT. SEMA explores prompt-decoupled fine-tuning for MatOnto taxonomy discovery with LLaMA-3.1-8B.

The shared story is that smaller or specialized systems can work when the task is narrow and the pipeline is well shaped, but broad ontology learning still rewards hybridization.

## Main lessons

Hybrid pipelines are the central lesson. The paper explicitly says the top teams combined commercial LLMs, open-source models, prompt engineering, embeddings, RAG, clustering, and domain adaptation.

RAG and examples help the model stay inside the ontology's local vocabulary instead of hallucinating plausible-but-wrong semantic structure.

Embeddings are not boring infrastructure here. They support retrieval, clustering, k-NN typing, candidate filtering, and pruning of quadratic relation spaces.

Context-window management matters. Chunking, batching, and stratified sampling are not just cost tricks; they affect whether the model sees coherent ontology neighborhoods.

Domain-specific models still matter. BioBERT, MaterialsBERT, PubMedBERT, DeBERTa, and RoBERTa show up because biomedical, materials, and engineering terminology is not reliably handled by generic text fluency alone.

Ensembles and cascaded validation help reduce individual-model errors, especially when the task is hierarchical or low-resource.

Non-taxonomic relation extraction remains the hard part. If the goal is a useful ontology rather than a labeled vocabulary, this is the area that still needs much better structure, supervision, and verification.

## Why this matters for agents and memory systems

For agent memory, this paper is quietly important.

A durable memory system is an ontology-learning problem wearing an app costume. It needs to extract entities, assign types, preserve relationships, decide which facts belong under which abstraction, and update the graph without making a semantic mess.

The LLMs4OL result says a plain LLM pass is not enough. Good systems should:

* retrieve relevant prior schema and examples;
* constrain the candidate space;
* use embeddings to find near-neighbor concepts;
* separate type assignment from relation induction;
* treat taxonomy and non-taxonomic relations as different tasks;
* validate outputs with more than one signal;
* keep domain-specific machinery when the domain warrants it.

That is a useful design checklist for any "AI knowledge base" that claims to maintain structured understanding over time.

## Strengths

The task framing is good. Text2Onto, term typing, taxonomy discovery, and non-taxonomic relation extraction are distinct problems, and the paper keeps them distinct.

The benchmark covers a healthy spread of domains. Biomedical, materials, ecology, agriculture, chemistry, web schemas, and biology expose different failure modes.

The paper is practical. It does not pretend that LLMs magically solve ontology engineering. The strongest lessons are about method integration.

The leaderboard makes the difficulty gradient visible. Term typing is relatively tractable; taxonomy is harder; relation extraction is much harder.

## Caveats

This is an overview paper, so the evidence is a synthesis of participant systems rather than a controlled experiment where every approach is tested under one implementation.

The leaderboard is not apples-to-apples. Teams submitted to different subtasks, some subtasks had very few entrants, and mean F1 mixes task coverage with task difficulty.

Task A's data construction includes ontology-derived synthetic text, which is useful for controlled evaluation but not equivalent to arbitrary natural corpora.

Exact-match evaluation can understate semantically close outputs and overstate surface-aligned outputs. Ontology usefulness is not fully captured by per-edge or per-label F1.

The paper mostly summarizes system papers at a high level. To replicate or reuse any specific method, the individual participant papers and code would need to be inspected.

## What to cite it for

Cite this paper for:

* the LLMs4OL 2025 shared task;
* a taxonomy of LLM-based ontology-learning tasks;
* evidence that hybrid LLM + retrieval + embedding + domain adaptation pipelines outperform one-shot prompting patterns;
* the continued difficulty of taxonomy and non-taxonomic relation extraction;
* practical lessons for building structured knowledge from language.

Do not cite it as:

* proof that one proprietary LLM is best for ontology learning;
* proof that ontology learning is solved;
* a controlled ablation study of RAG, embeddings, prompting, or fine-tuning;
* evidence that synthetic Text2Onto performance transfers cleanly to open-world extraction.

## Final decision

Keep.

This is a useful map of the current ontology-learning-with-LLMs landscape. Its strongest contribution is not novelty but condensation: it shows, across a shared task, that useful ontology learning requires careful decomposition and hybrid engineering.

For cabbageland purposes, the takeaway is blunt and good: if we want agents to build durable structured knowledge, the winning shape is not "LLM writes a graph." It is retrieval, candidate generation, candidate pruning, type assignment, relation extraction, validation, and domain-aware repair, with LLMs used as one component in the pipeline rather than the whole cathedral.
