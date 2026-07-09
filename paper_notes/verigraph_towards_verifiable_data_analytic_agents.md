---
title: VeriGraph: Towards Verifiable Data-Analytic Agents
slug: verigraph-towards-verifiable-data-analytic-agents
authors: Jiajie Jin, Zhao Yang, Wenle Liao, Yuyang Hu, Guanting Dong, Xiaoxi Li, Yutao Zhu, Zhicheng Dou
year: 2026
venue: arXiv preprint (cs.CL)
date_read: 2026-07-09
paper_url: https://arxiv.org/abs/2606.16603
pdf_url: https://arxiv.org/pdf/2606.16603
verdict: Keep as a strong evidence-graph agent paper; useful for agent auditability, but not a substitute for formal verification
summary: VeriGraph turns data-analysis agent reasoning from a linear ReAct-style transcript into an explicit heterogeneous evidence DAG. Data nodes hold raw files and interpreter artifacts; claim nodes hold natural-language claims; computational, grounding, and derivational edges connect raw data, computed variables, atomic claims, and higher-level conclusions. The agent expands this graph during execution through normal Python computation plus two graph primitives, bind and infer, then submits terminal claims whose ancestors form the audit artifact. The training recipe starts with distilled graph-augmented trajectories and then uses graph-aware RL with rewards for executable process steps, valid derivational edges, and final answer quality. On four data-intensive benchmarks, VeriGraph-8B reports the highest overall score, 73.68, and the highest claim-level Grounding Rate, 87.61, roughly matching Claude-4.5-Opus ReAct overall while exposing both computational and derivational provenance.
why_it_matters: This is directly relevant to building agents that can be inspected after they act. The core idea is simple and sharp: do not leave evidence as a prose afterthought. Make the agent create a checkable support graph while it computes. The paper is especially useful because it separates deterministic provenance from semantic derivation and then rewards both. The caution is that the system still depends on LLM judges, LLM-generated trajectory distillation, and benchmark-specific data-analysis scaffolding. It gives a strong design pattern for auditable agent work, not a proof that the agent's conclusions are formally true.
final_decision: Keep and revisit. This is one of the cleaner formulations of "agent reasoning should leave a typed evidence object behind." Cite it for evidence-DAG construction, bind/infer primitives, graph-aware RL, and claim-level grounding evaluation. Do not cite it as full formal verification: bind only proves a claim points at an artifact, infer is checked by an LLM verifier, and Grounding Rate measures support recoverability rather than real-world truth.
tags: data-agents, verifiable-agents, evidence-graphs, provenance, auditability, neuro-symbolic-reasoning, codeact, react-agents, graph-rl, grounding-rate, claim-grounding, tool-use, data-analysis, qwen3, dapo, llm-as-judge, agent-evaluation
---

# VeriGraph: Towards Verifiable Data-Analytic Agents

## Basic info

* Title: VeriGraph: Towards Verifiable Data-Analytic Agents
* Authors: Jiajie Jin, Zhao Yang, Wenle Liao, Yuyang Hu, Guanting Dong, Xiaoxi Li, Yutao Zhu, Zhicheng Dou
* Year: 2026
* Venue / source: arXiv preprint (cs.CL)
* Link: https://arxiv.org/abs/2606.16603
* PDF: https://arxiv.org/pdf/2606.16603
* DOI: https://doi.org/10.48550/arXiv.2606.16603
* arXiv version inspected: v1, submitted 2026-06-15
* Date read: 2026-07-09
* Date surfaced: 2026-07-07
* Surfaced via: Tracy in #pocket-reads
* Code / repo: https://github.com/ignorejjj/VeriGraph
* Why selected in one sentence: It is a practical paper about making data-analysis agents leave behind a structured evidence graph instead of a vague linear transcript.

## Quick verdict

Keep as a strong evidence-graph agent paper; useful for agent auditability, but not a substitute for formal verification.

The paper's core move is exactly the right kind of boring-important agent engineering: stop treating the final answer and the chat transcript as the audit object. Instead, force the agent to build a typed evidence DAG while it works.

VeriGraph splits the world into:

* data nodes: raw files, interpreter variables, computed results;
* claim nodes: atomic factual claims and derived conclusions;
* computational edges: which variables came from which other variables;
* grounding edges: which computed artifacts support which atomic claims;
* derivational edges: which claims support which higher-level conclusions.

That turns a data-agent run into something a reviewer can trace backward from the final answer to raw data. The system is not proving truth in a theorem-prover sense. It is making provenance explicit enough that unsupported jumps are local and inspectable.

The strongest part is the training recipe. The authors do not merely prompt the model to be careful. They post-train a Qwen3-8B backbone to use the evidence-graph interface, first with graph-augmented SFT trajectories and then with RL rewards that separately supervise executable computation, valid semantic derivations, and final answer quality. That is the part worth stealing.

## One-paragraph overview

VeriGraph is a neuro-symbolic framework for data-analytic agents. Standard ReAct or CodeAct agents solve a task by alternating natural-language thoughts, code actions, and observations, then emitting a final answer. VeriGraph keeps the code-interpreter loop but changes the persistent object of reasoning: each rollout incrementally constructs a heterogeneous evidence DAG. Computation automatically creates data-node dependencies, `bind` grounds runtime artifacts into atomic claims, and `infer` derives higher-level claims from prior claims. At the end, `submit_answer` selects terminal claims; the answer is composed from those claims and their ancestor subgraph. Training uses distilled graph trajectories for cold start, then DAPO-style RL with a composite reward over process execution, infer-edge validity, and final answer quality. On TableBench, InfiAgent-DABench, DSBench, and DAB-Step Research, VeriGraph-8B reports 73.68 overall and 87.61 Grounding Rate, beating specialized data-agent baselines and matching Claude-4.5-Opus ReAct's overall score while exposing stronger provenance.

## Model definition

### Inputs

The task is a data-intensive user query plus heterogeneous files such as CSVs, databases, spreadsheets, documentation, or tables. During execution, the policy sees a structured state containing compressed interaction history, the current interpreter namespace, and the partial evidence graph.

### Outputs

The agent outputs executable code actions that solve the data task and expand the evidence graph. The final answer is not free-floating prose; it is produced by selecting final claim nodes with `submit_answer`, then composing a response from the selected claims and their ancestor graph.

### Training objective

The training objective is not just final answer correctness. The paper uses a composite RL reward:

* process reward for successful executable actions;
* inference reward for whether derived claims follow from their premises;
* outcome reward for whether the terminal evidence subgraph supports a correct final answer.

In the implementation, the RL stage uses weighted components, a missing-submission penalty, and reward clipping. The main-text abstraction is still the important bit: reward the evidence object, not only the final string.

### Architecture / parameterization

The main model is built on Qwen3-8B. The runtime is a Python code-interpreter scaffold with evidence-graph APIs embedded in the action space. VeriGraph also reports 4B and 14B variants to test robustness across backbone sizes.

The graph has two node types and three edge types:

* `Vdata`: raw sources and intermediate computational artifacts;
* `Vclaim`: natural-language claim nodes;
* `Ecomp`: computational dependencies between data artifacts;
* `Eground`: grounding edges from data artifacts to claims;
* `Ederive`: derivational edges between claims.

## What problem is the paper trying to solve?

Data-analysis agents can get the final number right while leaving a transcript that is almost impossible to audit. A linear ReAct trace entangles code execution, observations, hand-wavy semantic interpretation, and final prose. If the agent says "Q3 revenue grew 12.3% year over year," the user needs to know whether that number came from the table, which rows were selected, which calculation was used, and how that calculation became the claim.

The authors frame this as two evidence requirements:

* quantitative claims should be reproducible from raw data through deterministic computations;
* qualitative judgments should be grounded in inspectable reasoning chains.

Standard CodeAct gives you some computation, but it does not make the semantic bridge explicit. A variable might exist in Python, and a final claim might appear in prose, but the edge between them is usually just "the model said so."

## What is the method?

VeriGraph keeps a normal agent loop but makes the agent maintain an evidence DAG as part of the loop.

### 1. Computational expansion

When code executes, the runtime snapshots the interpreter namespace and identifies newly created or modified variables. It then uses a static AST walk over the code to infer which variables were read to compute each new variable. This creates computational edges between data nodes.

This is not deep program analysis, but it is useful enough for the intended scaffold: if `total_rev` was computed from `df`, the graph records that dependency.

### 2. Grounding expansion with `bind`

`bind` turns an existing runtime artifact into an atomic claim. The key constraint is that the claim must point to an existing variable or value. The runtime can enforce that the artifact exists, so the grounding edge has executable provenance.

Important caveat: `bind` enforces provenance, not semantic truth. If the agent binds a real variable with a misleading description, the graph exposes the exact grounding edge that needs inspection, but it does not magically make the description correct.

### 3. Derivational expansion with `infer`

`infer` takes premise claims, a natural-language reasoning annotation, and a conclusion, then creates a new derived claim. This externalizes the agent's semantic reasoning as explicit claim-to-claim edges.

This is the part that makes the graph more than a computation trace. A data-analysis report often requires judgments like "Warehouse A is the highest restocking risk" or "data-center revenue dependence is high." Those are not raw variables; they are derived interpretations.

### 4. Terminal extraction

At the end, the agent calls `submit_answer` on a subset of final claims. The system traverses backward through the graph to collect the ancestor subgraph supporting those claims. That extracted subgraph is the audit artifact.

This is a good design choice. It prevents the final evidence view from becoming the whole messy trajectory and instead gives the reviewer the support graph for the submitted answer.

## What is the method motivation?

The paper's useful motivation is that data-analysis reasoning crosses two spaces:

* deterministic code space, where raw data becomes computed artifacts;
* semantic reasoning space, where artifacts become claims and claims become conclusions.

A linear transcript is a bad fit for that. It records time order, not support structure. A DAG is a better fit because a final conclusion might depend on multiple computations and multiple intermediate claims, and a single computed artifact might support several claims.

The other motivation is training. If you only reward final answers, the model can learn shortcuts that are correct-looking but badly supported. VeriGraph tries to make the evidence graph itself part of the objective.

## What data does it use?

The evaluation uses four data-intensive benchmarks:

* TableBench: about 700 single-table QA questions across fact checking, numerical reasoning, and data analysis; the visualization subset is excluded.
* InfiAgent-DABench: 257 single-CSV closed-form data-analysis questions.
* DSBench: 466 multi-table data-analysis tasks with large files and long contexts.
* DAB-Step Research: 100 multi-step research-style tasks over structured tables plus unstructured payments-processing documentation.

For training, the paper draws from public table-grounded and data-agent datasets, including TableInstruct, TAT-QA, CRT-QA, MultiHiertt, DataScience-Instruct, and DataMind-54K. A stronger teacher model, Qwen3-32B, synthesizes graph-aware solution trajectories inside the VeriGraph runtime. The SFT mixture is roughly 42K examples in the appendix, while the main text describes roughly 36K supervised examples after filtering; the difference appears to be reporting granularity rather than a new dataset.

RL prompts are non-overlapping with SFT queries and are filtered for medium difficulty using rollouts from the SFT policy.

## How is it evaluated?

The paper evaluates two axes:

* task performance: answer correctness/completeness on the underlying benchmark;
* traceability: whether claims in the final answer can be recovered from the method's exposed evidence artifact.

The traceability metric is Grounding Rate. The evaluation first decomposes each final answer into atomic factual claims, then retrieves candidate evidence units from the method's audit artifact, then asks an independent LLM judge whether each claim is sufficiently supported. CodeAct systems expose the full linear trajectory as evidence. VeriGraph exposes the terminal evidence subgraph.

This is a reasonable metric, but it must be read carefully. Grounding Rate is not "truth rate." It is support recoverability from the provided artifact. A system can have high GR and still answer the wrong question if it emits a small set of well-grounded but incomplete claims, which the ablations actually demonstrate.

## What are the main results?

The headline table is strong:

* VeriGraph-8B: 73.68 overall, 87.61 Grounding Rate.
* Claude-4.5-Opus ReAct: 73.22 overall, 73.57 GR.
* GPT-5.4 ReAct: 72.01 overall, 78.52 GR.
* Qwen3-32B ReAct: 70.98 overall, 71.95 GR.
* DeepAnalyze: 66.54 overall, 61.35 GR.
* DataMind: 55.06 overall, 71.64 GR.

On individual benchmarks, VeriGraph-8B reports:

* DABench: 85.99;
* DSBench: 66.43;
* TableBench average: 73.58;
* DAB-Step Research: 3.31 content and 3.56 format;
* Overall: 73.68;
* Grounding Rate: 87.61.

The most interesting interpretation is not "8B beats all frontier models everywhere." It does not. Direct proprietary models score higher on DAB-Step presentation metrics, likely because their free-form prose is more judge-friendly. The important result is that VeriGraph gets near-frontier aggregate task performance while exposing a stronger audit artifact.

## What is actually novel?

The novelty is the combination of three things:

* the evidence graph is the online action interface, not a post-hoc explanation;
* the graph crosses deterministic computation and semantic derivation in one object;
* the RL reward explicitly supervises different layers of that object.

Pieces of this exist elsewhere: code execution, chain-of-thought, citation grounding, process supervision, graph reasoning. The paper's useful contribution is putting those pieces into a coherent data-agent runtime where evidence construction is a first-class behavior.

The `bind` / `infer` split is especially clean. It draws a bright line between "this computed value says X" and "given claims A and B, we conclude C." That is the line most agent transcripts currently blur.

## What are the strengths?

* The problem is real. Data agents need auditability, not just answer accuracy.
* The method externalizes support structure during execution instead of asking for a pretty explanation afterward.
* The graph schema is simple enough to implement: data nodes, claim nodes, computational edges, grounding edges, derivational edges.
* The training recipe is credible: cold-start graph imitation before RL is necessary, and the ablations show why.
* The reward design matches the object being learned. Executability, local derivation validity, and final answer quality are different failure surfaces.
* The evaluation separates task performance from grounding quality, which avoids collapsing "correct answer" and "auditable answer" into one number.
* The results are strong for an 8B model, especially against larger ReAct baselines.
* The paper is honest that `bind` proves provenance, not semantic correctness.

## What are the weaknesses, limitations, or red flags?

* The system still leans heavily on LLM judges: for answer grading, inference-edge verification, and Grounding Rate evaluation.
* Grounding Rate can be gamed by terse, conservative outputs. The paper reports this indirectly: without trajectory SFT, GR reaches 95.01 but overall performance collapses to 37.78.
* The runtime is specialized for data-analysis agents with Python execution. Extending the same scheme to web, GUI, robotics, or multimodal agents is plausible but not solved here.
* The provenance tracing is lightweight. Static AST dependency tracking is useful, but it is not a complete semantic analysis of Python programs.
* `bind` can attach an existing artifact to a misleading description. The graph makes the error visible, but a judge or human still has to catch it.
* The DAB-Step presentation scores show a tradeoff: structured evidence can be less polished than free-form prose under current LLM judges.
* Teacher-generated SFT trajectories and graph-specific scaffolding are doing a lot of work. This is not simply an emergent ability from a base model.
* The strongest claims are about auditability within benchmarks, not production-grade compliance, formal verification, or complete hallucination removal.

## What challenges or open problems remain?

The big open problem is trustworthy graph validation. VeriGraph makes reasoning inspectable, but inspection still depends on judges and humans. A production system would need stronger validators for:

* whether a grounded claim faithfully describes the variable it binds;
* whether a derivational edge follows from the premise claims;
* whether the final answer omits important counter-evidence;
* whether the graph is minimal enough to audit but complete enough to trust;
* whether graph construction overfits benchmark conventions.

Another open problem is portability. The design is clean for Python data analysis because raw data, variables, and computations are naturally available. It is less obvious how to represent browser interactions, UI screenshots, retrieved documents, or long-running real-world actions with the same crisp edge semantics.

## What future work naturally follows?

* Add stronger validators for `bind`, not just `infer`.
* Use formal or symbolic checks where possible for numerical claims.
* Build graph-diff and regression tools so agent changes can be audited across versions.
* Extend the graph schema to retrieval provenance, citations, browser state, screenshots, and multimodal evidence.
* Study whether users can actually audit these graphs faster than linear trajectories.
* Train models to produce concise, human-readable final reports from the evidence subgraph without losing the graph itself.
* Use graph-level critics instead of only local edge judges.
* Investigate whether evidence-graph supervision should happen during pretraining rather than post-training.

## Why does this matter?

Because the future of useful agents is not just models that answer. It is systems that leave evidence behind in a form you can inspect, replay, and challenge.

This paper is a good step toward that. It says: the answer is not enough, the transcript is not enough, and a post-hoc explanation is definitely not enough. The agent should construct a durable support object as it works. For data analysis, that support object can be an evidence DAG connecting raw sources, computed artifacts, atomic claims, and derived conclusions.

That is exactly the kind of infrastructure real agents need if they are going to handle work where numbers, provenance, and trust matter.

## Ideas worth stealing

* Treat the evidence graph as a runtime object, not a reporting flourish.
* Separate grounding claims from derived claims.
* Make final answers select terminal evidence nodes, then serialize from the ancestor subgraph.
* Reward local derivation validity, not only final answer score.
* Track computational provenance automatically where the runtime can do it.
* Expose a compact terminal subgraph instead of dumping a full linear trace.
* Measure answer quality and grounding quality separately.
* Use ablations that show high grounding with low task quality, because that keeps everyone honest.

## Final decision

Keep and revisit. This is a clean agent-systems paper with a design pattern worth absorbing: if an agent's work must be trusted, the agent should create a typed evidence object while doing the work.

The durable takeaway is not the exact benchmark numbers. It is the interface: `compute` produces artifacts, `bind` turns artifacts into atomic claims, `infer` turns supported claims into higher-level conclusions, and `submit_answer` exposes the terminal support graph. That shape is portable even if the current implementation is data-analysis-specific.
