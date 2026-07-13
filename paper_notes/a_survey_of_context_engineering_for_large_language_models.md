---
title: A Survey of Context Engineering for Large Language Models
slug: a-survey-of-context-engineering-for-large-language-models
authors: Lingrui Mei, Jiayu Yao, Yuyao Ge, Yiwei Wang, Baolong Bi, Yujun Cai, Jiazhi Liu, Mingyu Li, Zhong-Zhi Li, Duzhen Zhang, Chenlin Zhou, Jiayi Mao, Tianze Xia, Jiafeng Guo, Shenghua Liu
year: 2025
venue: arXiv preprint (cs.CL)
date_read: 2026-07-12
paper_url: https://arxiv.org/abs/2507.13334v2
pdf_url: https://arxiv.org/pdf/2507.13334v2
verdict: Useful map, overbroad survey
summary: This survey argues that "context engineering" should be treated as a formal discipline for designing, retrieving, processing, managing, and assembling the full information payload given to an LLM at inference time. The paper organizes more than 1400 cited works into foundational components - context retrieval/generation, context processing, and context management - and system implementations: RAG, memory systems, tool-integrated reasoning, and multi-agent systems. The best use of the paper is as a field map and bibliography. Its strongest conceptual point is that modern AI performance is increasingly determined by information logistics, not just prompts or model weights. Its weakest point is that the taxonomy is so broad that it sometimes flattens distinct research programs into a giant everything-bucket.
why_it_matters: For agent builders, the paper gives a decent shared vocabulary for the runtime stack: instructions, retrieved knowledge, tools, memory, state, user request, assembly policy, evaluation, and safety. That is a useful frame for OpenClaw/Codex-style systems, where failures often come from bad context selection, stale memory, malformed tool schemas, weak orchestration, or poor recovery rather than from the base model alone.
final_decision: Keep as a map and citation index, not as a deep technical authority on any one subarea. Use it for the phrase "context engineering," the component/implementation split, and the claim that context-aware systems need evaluation beyond static answer quality. For specific claims about RAG, memory, tool use, or multi-agent protocols, follow the cited primary papers.
tags: context-engineering, llm-agents, rag, memory-systems, tool-use, multi-agent-systems, context-management, long-context, evaluation, agent-runtime, prompt-engineering, orchestration, retrieval, surveys, ai-systems
---

# A Survey of Context Engineering for Large Language Models

## Basic info

* Title: A Survey of Context Engineering for Large Language Models
* Authors: Lingrui Mei, Jiayu Yao, Yuyao Ge, Yiwei Wang, Baolong Bi, Yujun Cai, Jiazhi Liu, Mingyu Li, Zhong-Zhi Li, Duzhen Zhang, Chenlin Zhou, Jiayi Mao, Tianze Xia, Jiafeng Guo, Shenghua Liu
* Year: 2025
* Venue / source: arXiv preprint (cs.CL)
* Link: https://arxiv.org/abs/2507.13334v2
* PDF: https://arxiv.org/pdf/2507.13334v2
* Code / companion repo: https://github.com/Meirtz/Awesome-Context-Engineering
* arXiv version inspected: v2, submitted 2025-07-21
* Date read: 2026-07-12
* Date surfaced: 2026-07-12 (via Tracy in #pocket-reads)
* Why selected in one sentence: It tries to name and organize the whole runtime-information layer around LLMs: prompts, retrieval, memory, tools, long context, multi-agent coordination, and evaluation.

## Quick verdict

Useful map, overbroad survey

This is worth keeping, but mostly as a map. The paper is a 166-page survey with more than 1400 cited papers, so its main value is not a crisp new algorithm. It is a taxonomy and bibliography for a term that has become unavoidable: context engineering.

The core claim is right: "prompt engineering" is too small a label for modern LLM systems. A serious agent runtime is not just a prompt. It is an assembled information payload containing instructions, retrieved knowledge, tool definitions, memory, state, user intent, intermediate observations, and sometimes multi-agent messages. Getting that payload right is now system engineering.

The caveat is that the paper tries to swallow nearly the whole agent-systems world. RAG, memory, tools, multi-agent communication, long context, multimodal context, graph reasoning, evaluation, safety, deployment, and future directions all appear. That breadth makes it useful for orientation, but not very discriminating.

## One-paragraph overview

The survey formalizes context engineering as the systematic optimization of the information payload supplied to an LLM during inference. Instead of treating the context as one static prompt string, it models context as a dynamically assembled set of components: system instructions, external knowledge, tool definitions, persistent memory, dynamic world or agent state, and the immediate user request. The paper then organizes the field into foundational components - context retrieval/generation, context processing, and context management - and system implementations: retrieval-augmented generation, memory systems, tool-integrated reasoning, and multi-agent systems. It also surveys evaluation frameworks and future challenges, especially long-context efficiency, graph/multimodal context, intelligent context assembly, multi-agent orchestration, safety, and the gap between models' ability to understand complex contexts and their weaker ability to generate equally complex long-form outputs.

## What problem is the paper trying to solve?

The paper is trying to clean up a vocabulary problem.

Modern LLM applications no longer look like "write a clever prompt and send it to the model." A production agent may assemble:

* system rules,
* developer instructions,
* retrieved documents,
* summaries,
* long-term memories,
* tool schemas,
* current workspace state,
* prior tool observations,
* other agents' messages,
* multimodal data,
* and the user's immediate request.

Calling all of that "prompt engineering" is misleading. The authors want "context engineering" to mean the broader discipline of designing, selecting, compressing, retrieving, structuring, and evaluating the model's full information environment.

That is a reasonable umbrella. The trick is not letting the umbrella become fog.

## Definition

The paper starts from the standard autoregressive LLM setup: the model generates output conditioned on context. In prompt engineering, context is usually treated as a static string.

The survey reframes context as a structured assembly:

* `cinstr`: system instructions and rules.
* `cknow`: external knowledge from RAG, knowledge graphs, or other sources.
* `ctools`: tool definitions and function signatures.
* `cmem`: persistent memory from prior interactions.
* `cstate`: dynamic user, world, or multi-agent state.
* `cquery`: the user's current request.

The context assembly function chooses, formats, filters, and combines those components under constraints like context length, latency, cost, and task quality.

This is the paper's best formal move. It shifts attention from "what words should I put in the prompt?" to "what context-generating functions should the system use?"

## Taxonomy

The paper's taxonomy has four layers.

Foundational components:

* Context Retrieval and Generation: prompt engineering, external knowledge retrieval, and dynamic context assembly.
* Context Processing: long-context processing, self-refinement, multimodal context, and relational/structured context.
* Context Management: context-window constraints, memory hierarchies, storage architectures, and compression.

System implementations:

* Retrieval-Augmented Generation: modular RAG, agentic RAG, graph-enhanced RAG, and real-time RAG.
* Memory Systems: long-term/short-term memory, persistent user memory, memory-enhanced agents, and memory evaluation.
* Tool-Integrated Reasoning: function calling, tool-use training, code execution, search, APIs, and agent-environment interaction.
* Multi-Agent Systems: communication protocols, orchestration, coordination, and agent collaboration.

Evaluation:

* Component-level assessment.
* System-level integration assessment.
* Benchmarks for long context, RAG, memory, tools, web agents, and multi-agent systems.
* Safety and robustness evaluation.

Future directions:

* Theoretical foundations.
* Scaling laws and computational efficiency.
* Multimodal/graph context.
* Intelligent context assembly.
* Domain specialization.
* Large-scale multi-agent coordination.
* Human-AI collaboration.
* Deployment, safety, security, and responsible development.

## Context engineering vs prompt engineering

The comparison table is useful.

Prompt engineering treats context as a prompt string. It optimizes a mostly static surface form.

Context engineering treats context as dynamic structured assembly. It optimizes the functions that retrieve, select, format, compress, and route information.

The paper's claim is that context engineering is inherently:

* modular,
* stateful,
* system-level,
* constrained by budgets,
* and debugged by inspecting individual context functions.

That is basically right. Agent failures are often not "the prompt was bad" in isolation. They are "the retrieved document was stale," "the tool schema was malformed," "the memory was irrelevant," "the state summary dropped a constraint," or "the wrong agent got routed the task."

## Important observations

The paper emphasizes several recurring constraints.

Long context is not solved just because windows got bigger. Attention cost, KV-cache memory, latency, and positional failures still matter. The survey specifically discusses lost-in-the-middle behavior, context overflow, and context collapse.

Memory is not just storage. Useful agent memory requires encoding, retrieval, reflection, summarization, utilization, forgetting, truncation, and importance judgment. The paper's memory section is sprawling but gets this part right.

Tool use turns LLMs from text generators into world interactors. That makes tool selection, argument construction, execution feedback, error recovery, and safety part of the context problem.

Multi-agent systems are context-orchestration systems. Communication protocols, routing, task delegation, shared state, and transaction recovery determine whether collaboration is useful or chaotic.

Evaluation needs to move beyond static answer quality. Context-engineered systems need component diagnostics, trajectory evaluation, memory persistence tests, tool-call success metrics, orchestration evaluation, robustness, and safety assessment.

## RAG section

The RAG section is mostly a survey of the now-standard arc:

* naive RAG,
* modular RAG,
* agentic RAG,
* graph-enhanced RAG,
* real-time and streaming RAG.

The useful point is that RAG becomes less like a single retrieval step and more like a context pipeline. Retrieval may involve query rewriting, routing, decomposition, graph traversal, reranking, compression, and iterative correction.

For builders, the practical takeaway is simple: RAG is not "vector search plus prompt stuffing." It is one implementation of context assembly, and it should be evaluated as a pipeline.

## Memory systems section

The memory section is one of the more relevant parts for agents. The paper frames memory systems as what let LLMs move beyond stateless interactions.

It covers:

* short-term vs long-term memory,
* parametric vs activation vs plaintext memory,
* episodic and semantic memory,
* memory streams,
* graph-based memories,
* forgetting mechanisms,
* reflective memory management,
* personalization,
* and memory benchmarks.

The useful design lesson is that memory has a write path and a read path. It is not enough to retrieve semantically similar snippets. A serious memory system has to decide what to admit, how to consolidate, when to forget, how to resolve conflicts, and how to prove that retrieved memories actually helped the current task.

This connects cleanly to recent Pocket Reads notes on ABBEL and agent memory: context engineering gives the broad umbrella; those papers dig deeper into specific memory mechanisms.

## Tool-integrated reasoning section

The tool-use section treats function calling and tool-integrated reasoning as context engineering because tool definitions, tool results, and environment state become part of the model's information payload.

It surveys:

* Toolformer,
* ReAct,
* Gorilla,
* ToolLLM,
* PAL,
* ToRA,
* Chameleon,
* API-Bank,
* BFCL,
* GTA,
* MCP-RADAR,
* and related tool benchmarks.

The best point here is that evaluation must cover whole trajectories, not just final answers. Tool systems can fail through wrong tool selection, bad arguments, malformed results, missing recovery, or over-use of tools. Those are context failures as much as reasoning failures.

## Multi-agent systems section

The multi-agent section covers older communication-language work like KQML and FIPA ACL, then modern protocol and orchestration ideas such as MCP, A2A, ACP, ANP, AutoGen, MetaGPT, CAMEL, CrewAI, and Swarm-style systems.

The taxonomy is useful because it separates:

* communication protocols,
* orchestration mechanisms,
* and coordination strategies.

The paper is less useful when it treats protocol names as if listing them is analysis. The stronger claim is architectural: multi-agent systems are mostly about moving context across boundaries safely and efficiently. The hard parts are state sharing, delegation, transactionality, failure recovery, and preventing context leakage or drift.

## Evaluation section

The evaluation section is a good reminder that static benchmarks are too small for context-engineered systems.

The paper highlights several evaluation layers:

* Component-level tests for retrieval, prompt robustness, long-context retention, self-refinement, and structured data reasoning.
* System-level tests for RAG quality, memory persistence, tool trajectories, and multi-agent coordination.
* Benchmarks such as LongMemEval, BFCL, T-Eval, ToolHop, WebArena, Mind2Web, VideoWebArena, Deep Research Bench, and GAIA.
* Safety/robustness tests for adversarial input, cascading failures, alignment drift, and unknown failure modes.

The best line of thought is that future evaluation should measure not just task success, but process quality: whether the right information entered context, whether the system used it, whether it recovered from bad context, and whether it kept behavior stable over long interaction horizons.

## The big asymmetry claim

The paper repeatedly argues that current systems are better at understanding complex context than generating equally sophisticated long-form outputs.

This is a useful diagnosis. We can stuff or retrieve giant context payloads, but the model may still struggle to produce a coherent, faithful, well-planned output over thousands of tokens. That matters for agents because gathering context is only half the problem. The system must also transform that context into durable action, code, plans, or reports.

In Pocket Reads terms: "read everything" is not the same as "write the right thing."

## Strengths

The paper gives a clear umbrella term for the LLM runtime-information layer.

The component/implementation split is useful. It helps distinguish mechanisms like compression or retrieval from full systems like RAG agents or memory-enabled assistants.

The formal framing of context as structured dynamic assembly is simple but strong.

The bibliography is huge and useful for navigation.

The paper explicitly connects context engineering to agent systems, tool use, memory, protocols, evaluation, and safety rather than keeping the topic inside prompt tricks.

The companion GitHub repo is a useful living bibliography. Its README has also expanded into a 2026 "agent era" framing that acknowledges context engineering is now part of a broader agent-runtime stack.

## Weaknesses and caveats

The survey is too broad to be sharp everywhere. At times it reads like a catalog of paper names and reported claims rather than a critical synthesis.

Because it covers more than 1400 works, many individual claims are necessarily shallow. Use the paper to find primary sources, not to settle technical debates.

The taxonomy risks rebranding most of agent systems as context engineering. That may be useful politically, but it blurs boundaries between retrieval, planning, memory, execution, observability, and governance.

The paper's reported performance snippets come from many different sources and benchmarks, so they should not be compared as if they live in one controlled experiment.

The companion repo has evolved after the arXiv paper, including 2026 agent-era material. Useful, but it means the repo is no longer a static artifact matching the paper exactly.

## Why It Matters

This matters because real LLM systems fail at the context layer constantly.

They fail when they retrieve the wrong evidence, stuff too much into context, forget a constraint, preserve a stale memory, expose an irrelevant tool, route to the wrong subagent, summarize away a critical fact, or evaluate only the final answer instead of the process.

The paper gives those failures a shared frame. For OpenClaw/Codex-style systems, context engineering is basically the runtime substrate: scoped instructions, workspace state, memory files, tool schemas, browser observations, shell output, live verification, and Slack/social context all need to be selected and assembled with taste.

## Steal-worthy ideas

Treat context as a structured object, not a string.

Separate context components by role: instructions, knowledge, tools, memory, state, query.

Evaluate context functions independently. Retrieval, summarization, memory admission, tool selection, and orchestration each need their own tests.

Think of RAG, memory, tool use, and multi-agent systems as different implementations of context assembly.

Do not equate long context with good context. Selection, compression, order, provenance, and recovery still matter.

Use trajectory-level evaluation for agents because bad context often shows up before the final answer.

## Final Decision

Keep as a field map. This is not the note I would cite for a precise claim about memory admission, tool-use training, graph RAG, or multi-agent protocols. For those, chase the primary papers.

But it is useful for naming the stack: context engineering is the discipline of deciding what information an LLM system sees, when it sees it, how it is structured, and how we know it worked. That frame is useful enough to preserve.
