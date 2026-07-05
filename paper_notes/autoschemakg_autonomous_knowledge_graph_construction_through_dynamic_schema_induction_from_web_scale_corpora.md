---
title: AutoSchemaKG: Autonomous Knowledge Graph Construction through Dynamic Schema Induction from Web-Scale Corpora
slug: autoschemakg-autonomous-knowledge-graph-construction-through-dynamic-schema-induction-from-web-scale-corpora
authors: Jiaxin Bai, Wei Fan, Qi Hu, Qing Zong, Chunyang Li, Hong Ting Tsang, Hongyu Luo, Yauwai Yim, Haoyu Huang, Xiao Zhou, Feng Qin, Tianshi Zheng, Xi Peng, Xin Yao, Huiwen Yang, Leijie Wu, Yi Ji, Gong Zhang, Renhai Chen, Yangqiu Song
year: 2026
venue: ACL 2026 Long Papers
date_read: 2026-07-04
paper_url: https://aclanthology.org/2026.acl-long.942/
pdf_url: https://aclanthology.org/2026.acl-long.942.pdf
verdict: Keep. A serious schema-free KG construction paper, with a very real compute and evaluation caveat.
summary: AutoSchemaKG is a framework for building knowledge graphs without a predefined ontology. It uses LLMs to extract entity-entity, entity-event, and event-event triples, then induces schemas by conceptualizing entities, events, and relations into abstract categories. The authors use it to build ATLAS, a family of large KGs from Dolma subsets: Wikipedia/Wikibooks, Semantic Scholar abstracts, and Common Crawl. The largest reported graph has about 937M nodes and 5.96B edges; the full ATLAS family is described as 900M+ nodes and 5.9B edges. Evaluations show high LLM-judged extraction quality, strong information preservation from event+entity triples, useful schema induction against typing datasets, and improvements in graph-RAG settings for multi-hop QA, factuality checking, and selected MMLU knowledge domains. The strongest idea is the entity-event-concept graph shape: events preserve relational context that entity-only triples lose, while concept nodes create bridges across sparse subgraphs.
why_it_matters: This is a direct answer to the brittle part of graph memory and GraphRAG: static schemas do not scale across the web, but raw text chunks are too unstructured for durable reasoning. AutoSchemaKG says the middle layer should be dynamic: extract specific entity/event facts, then induce abstract concepts that connect them. That is exactly the kind of machinery an agent memory system would need if it wanted to become more than vector search with nice stationery.
final_decision: Keep and cite for autonomous KG construction, schema induction, event-centric graph extraction, ATLAS, and graph-RAG over induced schemas. Do not cite it as proof that schema-free KG construction is solved: the pipeline is expensive, LLM-dependent, partly LLM-judged, not uniformly better than all retrievers, and still inherits bias, hallucination, and domain-expertise limits from its construction models.
tags: knowledge-graphs, graph-rag, schema-induction, ontology-learning, autoschemakg, atlas, entity-event-graphs, conceptualization, dynamic-schema, llm-extraction, event-extraction, multi-hop-qa, factuality, mmlu, rag, semantic-memory, structured-knowledge, acl-2026, web-scale-corpora, dolma
---

# AutoSchemaKG: Autonomous Knowledge Graph Construction through Dynamic Schema Induction from Web-Scale Corpora

## Basic info

* Title: AutoSchemaKG: Autonomous Knowledge Graph Construction through Dynamic Schema Induction from Web-Scale Corpora
* Authors: Jiaxin Bai, Wei Fan, Qi Hu, Qing Zong, Chunyang Li, Hong Ting Tsang, Hongyu Luo, Yauwai Yim, Haoyu Huang, Xiao Zhou, Feng Qin, Tianshi Zheng, Xi Peng, Xin Yao, Huiwen Yang, Leijie Wu, Yi Ji, Gong Zhang, Renhai Chen, Yangqiu Song
* Year: 2026
* Venue / source: Proceedings of the 64th Annual Meeting of the Association for Computational Linguistics, Volume 1: Long Papers
* ACL Anthology: https://aclanthology.org/2026.acl-long.942/
* PDF inspected: https://aclanthology.org/2026.acl-long.942.pdf
* DOI: https://doi.org/10.18653/v1/2026.acl-long.942
* Pages: 20557-20584
* Code: https://github.com/HKUST-KnowComp/AutoSchemaKG
* Project/docs: https://hkust-knowcomp.github.io/AutoSchemaKG/
* Data links in repo: https://huggingface.co/datasets/gzone0111/AutoSchemaKG/tree/main and https://huggingface.co/datasets/AlexFanWei/AutoSchemaKG
* Date read: 2026-07-04
* Date surfaced: 2026-07-03
* Surfaced via: Tracy in #pocket-reads
* Why selected in one sentence: It attacks the exact problem behind durable graph memory: build structured, schema-bearing knowledge from web-scale text without hand-authoring the schema first.

## Quick verdict

Keep. This one is not cute; it is a real systems paper.

AutoSchemaKG's useful claim is that knowledge graph construction should not be trapped between two bad options: hand-built schemas that do not scale and raw text chunks that do not reason cleanly. The paper proposes a third shape: use LLMs to extract entity/entity, entity/event, and event/event triples, then use conceptualization to induce abstract entity, event, and relation schemas from the graph itself.

The most important design move is making events first-class graph nodes. Entity-only KGs often throw away the thing you actually need for reasoning: what happened, when, why, and with which participants. AutoSchemaKG keeps events and then adds concept nodes as semantic bridges. That is a much better substrate for graph RAG than a pile of disconnected subject-predicate-object triples.

The caveat is equally real. This is not cheap, not cleanly model-independent, and not free from evaluation smell. The web-scale ATLAS construction cost is reported at roughly 78,400 GPU hours. Several core metrics rely on LLM judges or LLM-generated MCQs. The downstream gains are useful but uneven. So: keep it, cite it, steal the architecture, but do not worship the numbers.

## One-paragraph overview

AutoSchemaKG builds schema-bearing knowledge graphs directly from text without a predefined ontology. The pipeline first chunks and batches input documents, then runs three LLM extraction stages: entity-entity relationships, entity-event participation links, and temporal/causal/logical event-event links. It then induces schemas by asking an LLM to generate abstract conceptual labels for entities, events, and relations, using graph-neighbor context for entity conceptualization. The resulting graph has entity nodes, event nodes, concept nodes, relation edges, and mappings from nodes/relations to concepts. The authors apply this to Dolma 1.7 subsets, producing ATLAS-Wiki, ATLAS-Pes2o, and ATLAS-CC. Reported evaluations show high extraction F1 against OpenIE baselines, strong preservation of passage information in event+entity graph representations, high schema recall/coverage on typing tasks, and improvements when integrated into graph-RAG systems such as HippoRAG2 and Think-on-Graph for multi-hop QA, FELM factuality checking, and selected MMLU knowledge domains.

## What problem is the paper trying to solve?

The paper starts from a familiar KG bottleneck: schemas make knowledge graphs useful, but predefined schemas are expensive, narrow, and domain-bound.

Traditional KG construction usually assumes a human-authored ontology or relation inventory. That is manageable for one domain, but bad for web-scale corpora. If the schema is too rigid, the system misses domain-specific structure. If the system has no schema, it becomes a messy open extraction dump.

AutoSchemaKG asks whether LLMs can solve both halves:

* extract facts from raw text;
* induce a schema from the extracted facts rather than requiring one up front.

That matters because graph RAG and agent memory need a structure that is richer than chunk retrieval but more flexible than a manually curated enterprise ontology.

## Formal graph shape

The paper defines a knowledge graph with conceptual schema as:

* entity nodes;
* event nodes;
* typed relation edges between entity/entity, entity/event, and event/event nodes;
* concept categories;
* a mapping from each node to concepts;
* a mapping from each relation type to concepts.

In plain language: the graph stores specific things and events, but each specific element is also linked to abstract labels.

That makes the graph both concrete and general. "Black Mountain College" can be a node, and it can also link to "college," "school," or "institution." "A cat chased prey" can be an event, and it can also link to "hunting," "predation," or "pursuit."

This is the central architecture. The graph is not just an extraction product. It is an extraction product plus an induced conceptual layer.

## Method

### 1. Input processing

Documents are filtered, split into chunks, and batched. Long documents are segmented to fit within model context limits. The implementation details report 1024-token chunks in the large construction setup.

This is mundane but important. A system like this lives or dies on batch processing, output repair, and traceability from extracted triples back to source text.

### 2. Triple extraction

AutoSchemaKG extracts three relationship families with separate prompts.

Entity-entity extraction asks the model to identify entities and their relationships in JSON triples.

Entity-event extraction asks the model to identify events as independent sentences and list participating entities.

Event-event extraction asks the model to identify temporal and causal relations between events, using relation categories such as before, after, at the same time, because, and as a result.

The paper's key bet is that this three-part split captures more of the original text than conventional OpenIE. Entity triples alone lose procedural, temporal, and causal content. Event nodes keep more of it.

### 3. Schema induction by conceptualization

After extraction, AutoSchemaKG asks an LLM to generate short abstract phrases for each event, entity, and relation.

Events are conceptualized from the event text itself.

Relations are conceptualized from the relation text itself.

Entities get extra graph context: the system samples neighboring nodes and relations, then includes that context in the conceptualization prompt. This is sensible because entity names can be ambiguous. "Soul" could be a metaphysical concept or a Pixar movie; neighbor context decides which.

The result is a set of conceptual labels at different abstraction levels. These become concept nodes and schema mappings.

### 4. ATLAS construction

The authors build three ATLAS graph families from Dolma 1.7 sources:

* ATLAS-Wiki from Wikipedia and Wikibooks;
* ATLAS-Pes2o from Semantic Scholar abstracts;
* ATLAS-CC from 3 percent slices of Common Crawl head, middle, and tail.

Reported scale:

* ATLAS-Wiki: 9.599M chunks, 243.912M nodes, 1.492B edges.
* ATLAS-Pes2o: 7.918M chunks, 174.387M nodes, 1.150B edges.
* ATLAS-CC: 35.040M chunks, 937.256M nodes, 5.958B edges.

The abstract describes the ATLAS family as 900M+ nodes and 5.9B edges. Table 1 shows ATLAS-CC alone at that approximate size, with Wiki and Pes2o separately listed. The key point is still clear: this is billion-scale graph construction, not a toy KG demo.

## Evaluation

### Extraction quality

The paper compares AutoSchemaKG extraction against OpenIE 6 and Stanford OIE.

Using DeepSeek-V3 as a judge, AutoSchemaKG gets high extraction scores across ATLAS-Wiki, ATLAS-Pes2o, and ATLAS-CC. Entity-event and event-event extraction are often above 92 F1, while entity-entity extraction ranges from about 88.8 to 94.1 F1 depending on corpus. Traditional OpenIE systems have decent recall but substantially weaker precision and do not model events/concepts in the same way.

The paper also compares extraction LLMs on HotpotQA. DeepSeek-V3, Llama variants, and Qwen variants all produce average triple F1 in the high 80s to low 90s, with LLaMA-3.3-70B-Instruct highest at 93.73 and DeepSeek-V3 at 93.12.

This supports the claim that the framework is not tied to exactly one model, though bigger/better models still help.

### Information preservation

The authors test whether graph triples preserve enough passage information by generating multiple-choice questions from passages and answering them with different contexts:

* no context;
* original full passage;
* entity triples;
* event triples;
* event + entity triples;
* OpenIE baselines.

Event and event+entity representations preserve much more information than entity-only representations and far more than OpenIE baselines. On HotpotQA, event+entity context stays above 95 percent MCQ accuracy across several extraction/answering model combinations.

This is one of the strongest results conceptually. It justifies treating events as first-class graph objects instead of flattening everything into entity pairs.

The caveat: the MCQs are generated by an LLM, so this is an operational preservation test, not a human gold-standard semantic preservation benchmark.

### Schema quality

Schema induction is evaluated on entity typing, event typing, and relation typing:

* FB15kET and YAGO43kET for entity typing;
* wikiHow/P2GT for event typing;
* FB15kET relation domains for relation typing.

Metrics are BertScore-Recall and BertScore-Coverage.

Compared with Txt2onto, Llama-based schema induction performs much better in coverage, especially for event and relation typing. LLaMA-3.3-70B gets strong scores on YAGO43kET and event typing; LLaMA-3.1-8B is also competitive, especially on wikiHow event typing.

The paper also reports average schema-induction scores across multiple LLMs on HotpotQA, mostly above 90 for recall/coverage except LLaMA-3.1-8B's lower coverage number.

This is useful, but the metric should be read carefully. BertScore-style semantic overlap is not the same as validating an ontology's global consistency, hierarchy, or downstream maintainability.

### Multi-hop QA

The authors evaluate on 1,000-question samples from:

* MuSiQue;
* 2WikiMultihopQA;
* HotpotQA.

They compare against no retriever, Contriever, BM25, several embedding retrievers, RAPTOR, GraphRAG, LightRAG, MiniRAG, HippoRAG, HippoRAG2, OpenIE + HippoRAG variants, and AutoSchemaKG integrated with ToG, HippoRAG, and HippoRAG2.

The best AutoSchemaKG configuration is Full-KG with HippoRAG2:

* MuSiQue: 31.8 EM / 47.3 F1
* 2Wiki: 65.3 EM / 73.9 F1
* HotpotQA: 61.8 EM / 78.3 F1

Compared with BM25, this is a strong improvement. Compared with HippoRAG2, it is mixed: AutoSchemaKG Full-KG loses on MuSiQue F1 against HippoRAG2's 48.6, but beats it on 2Wiki F1 and HotpotQA F1. The paper's "12-18 percent gains" claim is most defensible against traditional retrieval baselines, not as a blanket win over every graph-RAG baseline.

The concept-node ablation is cleaner:

* Entity-KG: 31.4 / 47.2 on MuSiQue, 64.2 / 73.3 on 2Wiki, 60.9 / 77.5 on HotpotQA.
* Entity-Event-KG: 31.6 / 47.3, 65.2 / 73.7, 60.0 / 77.0.
* Full-KG with concepts: 31.8 / 47.3, 65.3 / 73.9, 61.8 / 78.3.

Concepts help, but the gains are not enormous. The architectural idea is more compelling than the absolute delta.

### Factuality

The FELM evaluation uses LLaMA-3.1-8B-Instruct and compares retrieval over text corpora, Freebase + Think-on-Graph, and ATLAS + HippoRAG2.

ATLAS-Wiki gets 56.43 balanced accuracy and 30.48 F1, better than the no-retriever baseline and the listed text retrieval baselines. ATLAS-CC also improves over most text baselines. The authors note that the Wikipedia graph may benefit because FELM samples are partly Wikipedia-sourced.

This result is interesting but modest. Factuality detection remains low-F1 overall, so cite this as directional evidence, not a solved factuality layer.

### MMLU domains

The paper also tests LLaMA-3.1-8B-Instruct on selected MMLU domains using ATLAS + HippoRAG2 and ATLAS + Think-on-Graph.

The strongest story is domain-specific:

* ATLAS-Pes2o improves average selected-domain score to 73.25 with HippoRAG2 and 73.28 with ToG.
* ATLAS-CC performs well in Law and History.
* ATLAS-Wiki performs well in Religion and general knowledge areas.

But the full appendix table shows a mixed overall picture. Retrieval helps knowledge-heavy domains but can hurt math, technical, or reasoning-heavy areas. The authors explicitly align this with prior work showing retrieval can interfere with reasoning.

That is a good caveat. Graph RAG is not magic dust.

## Compute and deployment reality

The paper reports a serious construction bill:

* 14,300 GPU hours for En-Wiki;
* 11,800 GPU hours for Pes2o-Abstract;
* 52,300 GPU hours for Common Crawl;
* about 78,400 GPU hours total.

This is the opposite of a lightweight recipe. The linked repo has installable `atlas-rag`, examples, Neo4j support, multilingual processing, custom extraction, and dataset links, so the artifact looks real. But web-scale ATLAS construction is infrastructure work, not a weekend script.

For practical use, the right lesson is probably not "build the whole web graph." It is "use the entity/event/concept extraction shape on the corpus you actually care about."

## What is novel?

The novelty is not "LLM extracts triples." That is table stakes now.

The interesting pieces are:

* making events first-class nodes rather than reducing all facts to entity pairs;
* separating entity-entity, entity-event, and event-event extraction;
* inducing concepts for nodes and relations rather than requiring a schema first;
* using concept nodes as graph bridges for retrieval;
* scaling the recipe into ATLAS and releasing code/data paths;
* evaluating the resulting graph in graph-RAG rather than only reporting extraction metrics.

The paper is strongest as a graph-memory architecture and web-scale systems artifact.

## Strengths

The entity-event-concept structure is genuinely useful. It maps better to reasoning than entity-only triple stores.

The system attacks the schema bottleneck directly. It does not just handwave "ontology learning"; it builds schema induction into the graph construction pipeline.

The scale is meaningful. Even if the exact "largest" framing is marketing-adjacent, 900M+ nodes and billions of edges is not a toy.

The evaluation is broad: extraction quality, information preservation, schema typing, multi-hop QA, factuality, and MMLU domain slices.

The repo exists and includes code, docs, examples, package installation, Neo4j support, and dataset links.

The limitations section is candid about LLM bias, domain expertise limits, inconsistencies, contradictions, and sparse regions.

## Weaknesses and caveats

The extraction-quality evaluation depends heavily on LLM judges. The authors add multi-judge validation in the appendix, but it is still model-mediated evaluation.

The information-preservation MCQ setup uses LLM-generated questions. Useful, but not the same as human-authored semantic coverage.

The schema metrics are semantic-overlap metrics, not full ontology-quality metrics. A schema can look semantically aligned locally and still be globally messy.

The downstream results are uneven. AutoSchemaKG + HippoRAG2 is strong, but not a universal winner over all graph-RAG or dense retrieval baselines.

The compute is enormous. The reported ATLAS construction budget is roughly 78,400 GPU hours.

The pipeline inherits construction-model biases and hallucination patterns. A dynamically induced schema is only as good as the extraction and abstraction model's judgment.

The graph may contain contradictions and gaps. The authors say this explicitly, and it matters for agent memory.

## Why this matters for cabbageland

This paper is extremely relevant to long-horizon agent memory.

Most "memory" systems are either:

* text chunk stores with embedding search;
* hand-written schemas that break as the domain changes;
* shallow entity graphs that lose the actual event structure.

AutoSchemaKG points to a better shape:

* extract events, not just entities;
* preserve entity participation in events;
* represent temporal and causal event links;
* induce concepts from usage context;
* use concept nodes to bridge sparse graph neighborhoods;
* retrieve over the graph when a question needs multi-hop structure.

That is basically the difference between "search my notes" and "maintain a semantic world model."

For an agent, the stealable part is local and bounded: take a project, person, meeting log, or paper corpus; build an entity-event-concept graph over it; then use concept nodes to connect otherwise separate memories. Full ATLAS-scale ambition can wait.

## What to cite it for

Cite it for:

* autonomous knowledge graph construction without predefined schemas;
* dynamic schema induction through conceptualization;
* event-centric KG construction;
* ATLAS as a billion-scale graph-RAG resource;
* evidence that entity-event-concept graphs can improve graph-RAG on multi-hop QA;
* the practical architecture of schema induction plus graph retrieval.

Do not cite it as:

* proof that schema-free KG construction is solved;
* proof that graph RAG always beats text RAG;
* proof that induced schemas are globally ontology-quality;
* a cheap or easy deployment recipe;
* human-ground-truth validation of all extracted facts.

## Final decision

Keep.

This is a strong paper for the structured-memory shelf. The numbers should be handled with care, but the core idea is right: if we want LLM systems to reason over durable knowledge, the representation probably needs events and induced concepts, not just entity triples or text chunks.

The shortest useful takeaway: AutoSchemaKG is what happens when "GraphRAG" grows up enough to admit that the schema cannot always be known in advance.
