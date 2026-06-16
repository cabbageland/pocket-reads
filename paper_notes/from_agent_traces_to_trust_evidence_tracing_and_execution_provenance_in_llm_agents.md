---
title: From Agent Traces to Trust: A Survey of Evidence Tracing and Execution Provenance in LLM Agents
slug: from-agent-traces-to-trust-evidence-tracing-and-execution-provenance-in-llm-agents
authors: Yiqi Wang, Jiaqi Zhang, Taotao Cai, Zirui Liu, Qingqiang Sun, Zequn Sun, Zhangkai Wu, Manqing Dong, Mingkai Zheng, Xuefei Yin, Tianyu Shi, Yanming Zhu
year: 2026
venue: arXiv preprint (cs.CR, cs.AI)
date_read: 2026-06-15
paper_url: https://arxiv.org/abs/2606.04990
pdf_url: https://arxiv.org/pdf/2606.04990
verdict: Strong map of the agent-provenance problem, light on solved mechanics
summary: This survey argues that trustworthy LLM agents need process-level provenance, not just final-answer evaluation. It defines execution provenance as a typed graph of an agent run, covering evidence, tool calls, memory items, observations, actions, inter-agent messages, and state changes, while evidence tracing is the evidence-support slice of that graph. The paper's main value is its taxonomy of trace sources, evidence and execution units, provenance relations, granularity, timing, representation forms, trust functions, benchmarks, and open problems.
why_it_matters: Agents are becoming systems that retrieve, remember, call tools, change state, and delegate work. If their actions cannot be traced back to evidence, tool outputs, memory lineage, and trust boundaries, "the final answer was right" is a dangerously thin standard.
final_decision: Keep. It is more organizing map than technical breakthrough, but it names the right infrastructure layer for agent trust: provenance as a first-class object for verification, audit, safety, debugging, and recovery.
tags: llm-agents, provenance, evidence-tracing, tool-use-safety, memory-provenance, agent-observability, runtime-guardrails, trustworthy-ai
---

# From Agent Traces to Trust: A Survey of Evidence Tracing and Execution Provenance in LLM Agents

## Basic info

* Title: From Agent Traces to Trust: A Survey of Evidence Tracing and Execution Provenance in LLM Agents
* Authors: Yiqi Wang, Jiaqi Zhang, Taotao Cai, Zirui Liu, Qingqiang Sun, Zequn Sun, Zhangkai Wu, Manqing Dong, Mingkai Zheng, Xuefei Yin, Tianyu Shi, Yanming Zhu
* Year: 2026
* Venue / source: arXiv preprint (cs.CR, cs.AI)
* Link: https://arxiv.org/abs/2606.04990
* PDF: https://arxiv.org/pdf/2606.04990
* DOI: https://doi.org/10.48550/arXiv.2606.04990
* Date read: 2026-06-15
* Date surfaced: 2026-06-15
* Surfaced via: Tracy in #pocket-reads via arXiv PDF link
* Version inspected: arXiv v2, last revised 2026-06-14
* Metadata note: the arXiv abstract page currently lists Mingkai Zhang and omits Tianyu Shi; the v2 PDF title page lists Mingkai Zheng and Tianyu Shi. This note follows the v2 PDF title page.
* Why selected in one sentence: It is a directly relevant survey for the missing infrastructure layer in agent systems: how to trace evidence, tool calls, memory, observations, actions, and failures across the whole execution, not just grade the final answer.

## Quick verdict

Strong map of the agent-provenance problem, light on solved mechanics

This is a useful survey because it says the quiet part of agent evaluation out loud: final-answer correctness is not enough once agents retrieve, call tools, update memory, interact with environments, and coordinate with other agents. The paper's best contribution is its framing. It defines execution provenance as the full typed graph of an agent run and evidence tracing as the projection of that graph onto evidence-support relations. That lets the authors connect RAG grounding, claim support, tool-use safety, prompt-injection defense, information-flow tracking, memory lineage, observability, debugging, audit, and recovery under one vocabulary. The main caveat is that the paper is much stronger as a taxonomy than as a hard technical synthesis. It names the right relations and benchmark gaps, but many proposed metrics and schemas are desiderata rather than operationalized systems.

## One-paragraph overview

The survey studies evidence tracing and execution provenance for LLM agents. Its premise is that modern agents are no longer plain text generators: they plan, retrieve documents, call tools, read and write memory, observe environments, update external state, and communicate with other agents. In that setting, a final output is only the endpoint of a heterogeneous execution. The paper distinguishes traces, which record what happened, from provenance, which explains how artifacts are connected. It proposes a provenance taxonomy covering trace sources, evidence units, execution units, typed relations, granularity, timing, representation forms, and trust functions. The central relation set includes support, derive, depend-on, contradict, invalidate, trigger, update, use, and generate. The survey then reviews representation forms such as structured logs, execution graphs, evidence graphs, static schemas, and runtime provenance; applies the lens to tool-using agents and memory systems; maps benchmark families across evidence, tool use, memory, multi-agent settings, safety attacks, provenance relations, and recovery; and ends with open problems around unified trace schemas, semantic provenance, memory lineage, provenance-aware safety, realistic trace benchmarks, privacy, and governance.

## Model definition

This is not a model paper. It is a survey and conceptual framework for provenance-aware LLM agents.

### Inputs

- existing agent traces: prompts, model outputs, reasoning steps, retrieval calls, tool calls, tool outputs, memory operations, environment observations, inter-agent messages, actions, and final responses
- evidence-bearing objects: documents, snippets, citations, tables, observations, policies, user instructions, tool outputs, memory items, and generated claims
- execution records: tool invocations, parameters, state changes, failures, retries, and message passing
- benchmark families from RAG, tool use, safety, memory, multi-agent evaluation, observability, and trace debugging

### Outputs

- a taxonomy of agent provenance dimensions
- a set of typed provenance relations
- mappings from representative systems and benchmarks into the taxonomy
- design tensions and open problems for provenance-aware agent infrastructure

### Objective

The objective is conceptual consolidation. The paper tries to move agent trust from output-only evaluation toward process-level accountability: can we reconstruct how an answer or action was produced, which evidence supported it, what influenced it, where failures entered, and how unsafe or stale information should be blocked, invalidated, or recovered from?

## Key questions this summary must address

### 1. What problem is the paper trying to solve?

LLM agents are becoming execution systems. They search, call APIs, manipulate files, browse websites, update memory, interact with GUIs, and coordinate with other agents. In that world, "did the final answer look correct?" is too shallow.

The paper calls this the process-level accountability gap. A correct answer can still come from unsafe tool use, stale memory, irrelevant evidence, hidden prompt injection, or an unauthorized state change. An incorrect answer can come from one bad retrieval, one contaminated tool output, one poisoned memory, one malformed parameter, or one bad inter-agent message. Without provenance, the system can neither explain nor repair those failures.

### 2. What are the paper's key definitions?

The paper distinguishes three ideas:

- Agent trace: the recorded artifacts generated or consumed during an agent run.
- Execution provenance: the complete typed representation of an agent run, including evidence units, execution units, and their causal, procedural, dependency, update, contradiction, and invalidation relations.
- Evidence tracing: the evidence-support and influence slice of execution provenance.

That distinction is good. A raw trace says "this happened, then that happened." A provenance graph says "this claim depended on this retrieved passage, this tool output contradicted this memory, this observation invalidated this plan, and this invalidation triggered a recovery step."

### 3. What taxonomy does the paper propose?

The taxonomy has five main dimensions:

- trace sources: reasoning, retrieval, tool use, memory, environment interaction, and multi-agent communication
- evidence and execution units: documents, snippets, observations, tool outputs, memory items, claims, policies, tool calls, parameters, actions, and messages
- provenance relations: support, derive, depend-on, contradict, invalidate, trigger, update, use, and generate
- tracing granularity and timing: run-level, step-level, tool-call-level, parameter-level, claim-level, token/span-level; pre-execution, runtime, post-hoc, and continuous tracing
- trust functions: verification, attribution, debugging, safety enforcement, audit, failure attribution, and recovery

The useful move is putting semantic evidence relations and procedural execution relations in the same frame. Claim support alone is too narrow; tool logs alone are too procedural. Agents need both.

### 4. How does it relate to existing provenance standards?

The paper anchors its vocabulary in W3C PROV-DM, where provenance is represented through entities, activities, agents, and relations such as used, wasGeneratedBy, and wasDerivedFrom. It also uses OpenTelemetry as an analogy for distributed execution traces.

But it argues that LLM agents need extra semantic relations. W3C PROV can say that an artifact was used or generated. It does not naturally say that a passage supports a claim, that a memory contradicts a tool output, or that an observation invalidates a plan. The agent-specific layer adds support, contradict, invalidate, and trust labels on top of classical provenance bookkeeping.

### 5. What representation forms does the survey review?

The paper distinguishes:

- structured logs: typed chronological records of requests, retrievals, tool calls, memory operations, observations, messages, and outputs
- execution graphs: dependency structures connecting instructions, evidence, tools, memory, claims, and actions
- evidence graphs: claim-support structures linking evidence units to generated claims and identifying support, contradiction, and omission
- static schemas: predefined object and relation types for trace representation
- runtime provenance: concrete source-to-sink dependencies produced during execution

The synthesis is sensible: logs are good for observability, evidence graphs are good for claim verification, execution graphs are good for debugging and dependency analysis, and runtime provenance is good for enforcement and recovery. No one representation does everything.

### 6. What does it say about tool-using agents?

Tool use is where provenance stops being a documentation nicety and becomes safety infrastructure. A tool call can send an email, alter a database, execute code, retrieve private data, or change external state.

The paper argues that safe tool use requires tracing:

- which tool was selected
- which arguments were passed
- where argument values came from
- whether those sources were trusted
- what output the tool returned
- how the output influenced later claims, memory, actions, or state changes

The important point is parameter-level provenance. A tool can be legitimate while its arguments are unsafe. An email tool is not inherently bad; it becomes dangerous if the recipient, subject, or body is derived from an untrusted webpage or injected tool output.

### 7. How does the paper handle prompt injection and unsafe influence?

The paper frames indirect prompt injection as an information-flow problem. External content is safe to read in one context and unsafe to let control high-impact actions in another. The question is not merely "did the agent see malicious content?" but "did that content influence a tool argument, memory update, external action, or final claim?"

That connects prompt-injection benchmarks and defenses such as InjecAgent, AgentDojo, ToolEmu, OpenAgentSafety, MCP-SafetyBench, CaMeL, FIDES, NeuroTaint, Agent-Sentry, AgentSpec, and AgentBound. The common theme is moving from output filtering to influence tracking: where did this value come from, how did it transform, and is it allowed to cross this trust boundary?

### 8. What does it say about memory?

The paper treats memory as provenance-bearing evidence rather than just a retrieval convenience. That is one of the better sections.

A memory item can later support a claim, shape a plan, personalize a response, influence a tool call, or contaminate future behavior. Therefore it should carry lineage: source, timestamp, authoring agent, supporting evidence, transformation operation, confidence, update history, retrieval context, downstream uses, conflicts, and invalidation status.

The survey points out that memory systems often optimize for recall, continuity, and personalization, while under-tracking source validity, temporal validity, conflict, privacy exposure, poisoning, and downstream influence. That is exactly the failure mode of long-term agent memory: it can quietly become an opaque authority.

### 9. What benchmark landscape does it map?

The survey groups benchmarks into families:

- RAG and attribution benchmarks: ALCE, RAGAS, ARES, RAGChecker, RAGTruth, FActScore, SourceCheckup, FEVER
- agent execution and tool-use benchmarks: AgentBench, WebArena, ToolBench/ToolLLM, tau-bench
- tool-use safety benchmarks: ToolEmu, InjecAgent, AgentDojo, OpenAgentSafety, MCP-SafetyBench
- trace debugging and multi-agent failure benchmarks: AgentTrace, TRAIL, MAST, AgenTracer, Aegis
- memory benchmarks: MemoryBank, MemGPT-style evaluations, A-MEM, Mem0, LOCOMO, MemoryArena
- provenance/security mechanisms: Agent-Sentry, NeuroTaint/TaintBench, FIDES, AgentSpec, AgentBound

The paper's benchmark heatmap is blunt: existing benchmarks cover isolated slices. RAG benchmarks have evidence labels but usually no tools or memory. Tool-use benchmarks have tool calls but weak claim-level evidence labels. Memory benchmarks test recall but rarely lineage, conflict, contamination, or downstream influence. Multi-agent benchmarks test coordination and failure, but not full provenance.

### 10. What metrics does it propose or collect?

The paper organizes metrics into four categories:

- evidence attribution: evidence recall, citation precision, source supportiveness, faithfulness, claim support accuracy
- execution provenance: trace completeness, provenance accuracy, dependency coverage, temporal consistency
- safety and robustness: unsafe influence detection, attack success rate, policy violation rate, intervention precision
- debugging and recovery: failure localization accuracy, diagnosis correctness, auditability, recovery success

The paper is careful to mark some of these as proposed rather than mature. That matters. Evidence attribution and safety metrics exist in current benchmarks; trace completeness, provenance accuracy, dependency coverage, and recovery success are still under-defined.

### 11. What is actually novel?

The paper does not invent provenance, trace logging, RAG attribution, taint tracking, or tool-safety guardrails. The novelty is in the unifying lens:

- execution provenance as the typed graph of an agent run
- evidence tracing as the evidence-support projection of that graph
- one taxonomy spanning retrieval, tools, memory, environment interaction, multi-agent messages, safety, observability, and recovery
- explicit relation types that combine semantic and procedural accountability
- a benchmark mapping that shows why current evaluations do not cover full agent provenance

For a survey, that is enough. The value is not one new algorithm; it is a schema for where the field should put its machinery.

### 12. What are the strengths?

- The core definitions are clean and useful.
- It correctly treats provenance as more than logging.
- It connects RAG claim support, tool safety, memory lineage, and observability without collapsing their differences.
- The tool-use section properly focuses on argument provenance and trust boundaries.
- The memory section is unusually important: persistent memory is an evidence source, an attack surface, and a privacy risk.
- The paper distinguishes mature metrics from proposed ones rather than pretending the evaluation problem is solved.
- It is directly relevant to real agent systems, especially MCP-style tool ecosystems and long-running agents.

### 13. What are the weaknesses, limitations, or red flags?

The first limitation is survey sprawl. The paper touches many literatures, but because the scope is broad, some areas are summarized at a high level rather than critically compared.

The second limitation is that the relation taxonomy is plausible but not battle-tested. Support, contradict, invalidate, depend-on, trigger, update, use, and generate are good primitives, but real traces will need schemas for uncertainty, partial support, authority, trust level, privacy class, temporal scope, and user approval.

The third limitation is evaluation. The paper proposes metrics like provenance accuracy and dependency coverage, but those are not yet operationalized in a standard way. The survey names the gap more than it solves it.

The fourth limitation is the hard part of semantic influence. It is easy to track copied strings through tool arguments. It is much harder to track influence after paraphrase, summarization, abstraction, memory consolidation, or another agent's judgment.

The fifth limitation is privacy. The paper notices privacy and governance, but provenance infrastructure itself can become a surveillance and secret-retention layer. Trace minimization is not just an implementation detail; it is central.

### 14. What challenges or open problems remain?

The big open problems are:

- unified, interoperable trace schemas for LLM agents
- semantic provenance beyond string matching
- claim-level support that survives transformations through tools, memory, and other agents
- parameter-level provenance for high-impact tool calls
- memory lineage, staleness, conflict, contamination, and invalidation
- multi-agent responsibility attribution
- provenance-aware runtime guardrails that can recover, not just block
- realistic benchmarks with complete execution traces and annotated provenance relations
- privacy-preserving audit infrastructure

The recovery point is especially important. Provenance should not only answer "what went wrong?" It should help decide what to do next: roll back, retry, quarantine evidence, invalidate memory, ask for approval, or resume from a safe checkpoint.

## Why It Matters

This paper matters because agent trust is going to be won or lost in the execution layer, not the final answer box. A capable agent can produce the right-looking output while relying on a contaminated webpage, stale memory, unsafe tool argument, or misattributed inter-agent claim. Provenance is how those hidden dependencies become inspectable and governable.

For cabbageland, the paper is also a vocabulary upgrade. It gives names to things we already care about in practice: source lineage, tool argument trust, memory validity, recoverable traces, and audit without turning every agent run into a privacy disaster.

### 15. What ideas are steal-worthy?

- Treat traces as raw material and provenance as typed dependency structure.
- Separate evidence tracing from full execution provenance, but keep them connected.
- Track tool arguments at the value/source level, not only the tool-call level.
- Treat memory items as evidence objects with lineage, timestamps, validity, conflicts, and downstream uses.
- Add invalidation as a first-class relation, not just contradiction.
- Evaluate agents by recoverability: can the trace support repair after a failure?
- Design trace schemas with privacy minimization from the beginning.

## Final Decision

Keep and revisit. This is not the paper that solves agent provenance, but it is a good map of the territory and a useful checklist for building serious agents. The phrase to keep is: final-answer accuracy is not process-level accountability.
