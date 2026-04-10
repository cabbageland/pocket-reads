# Graph-based Agent Memory: Taxonomy, Techniques, and Applications

## Basic info

* Title: Graph-based Agent Memory: Taxonomy, Techniques, and Applications
* Authors: Chang Yang, Chuang Zhou, Yilin Xiao, Su Dong, Luyao Zhuang, Yujing Zhang, Zhu Wang, Zijin Hong, Zheng Yuan, Zhishang Xiang, Shengyuan Chen, Huachi Zhou, Qinggang Zhang, Ninghao Liu, Jinsong Su, Xinrun Wang, Yi Chang, Xiao Huang
* Year: 2026
* Venue / source: arXiv preprint (cs.AI)
* Link: https://arxiv.org/abs/2602.05665v1
* PDF: https://arxiv.org/pdf/2602.05665v1
* DOI: https://doi.org/10.48550/arXiv.2602.05665
* Date read: 2026-04-09
* Date surfaced: 2026-04-09
* Surfaced via: Tracy in #pocket-reads
* Why selected in one sentence: It is a timely survey trying to organize the exploding graph-memory-for-agents literature into something less chaotic.

## Quick verdict

* Useful survey, mostly for landscape and taxonomy

This is a broad survey of graph-based agent memory, and it is useful precisely because the area has become messy enough to need one. The paper’s main value is organizational: it proposes a taxonomy of agent memory, especially around short-term vs. long-term, knowledge vs. experience, non-structural vs. structural memory, and then walks through the memory lifecycle of **extraction, storage, retrieval, and evolution**. The survey is strongest when it frames graph memory as a way of making relations, hierarchy, and temporal structure first-class. It is weaker whenever it starts to sound like “graph = unified answer to everything,” because some of the most effective real systems are still much simpler than that.

## One-paragraph overview

The paper surveys **graph-based memory for LLM agents** from a lifecycle perspective. It argues that memory is central for long-horizon agent behavior because agents need personalization, persistence beyond the context window, iterative self-improvement, and grounding against hallucination. The authors organize the field along several axes: temporal scope (short-term vs. long-term), cognitive or functional structure (semantic, procedural, associative, working, episodic, sentiment), source/role (knowledge vs. experience memory), and representation (non-structural vs. structural memory). They then use a lifecycle view — **memory extraction, storage, retrieval, and evolution** — to synthesize the technical design space, summarize available libraries and benchmarks, and outline applications and future challenges. The survey’s core claim is that graph-structured memory is a natural fit for agent settings because it supports explicit relation modeling, hierarchy, temporal dependencies, and structured retrieval.

## Model definition

### Inputs
Prior literature on LLM agents, agent memory systems, graph-based memory representations, supporting libraries, benchmarks, and applications.

### Outputs
A survey taxonomy and synthesis of the graph-based agent memory landscape.

### Training objective (loss)
Not applicable; this is a survey paper.

### Architecture / parameterization
The conceptual architecture of the survey centers on four stages in the **memory lifecycle**:
- extraction,
- storage,
- retrieval,
- evolution.

It also repeatedly distinguishes:
- **knowledge memory** vs. **experience memory**,
- **short-term** vs. **long-term** memory,
- **non-structural** vs. **structural** memory.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
The paper is trying to solve fragmentation in the graph-memory-for-agents literature. The area has grown quickly, with papers proposing knowledge graphs, temporal graphs, hierarchical graphs, hypergraphs, retrieval structures, and self-evolving memories, but without much shared framing.

### 2. What is the method?
The method is a **survey and taxonomy**. The paper organizes prior work by memory type, memory lifecycle stage, and application setting.

### 3. What is the method motivation?
The motivation is that LLM agents fail at long-horizon tasks partly because they are bad at accumulating and organizing experience. A survey focused specifically on **graph-structured memory** is useful because that design family promises explicit relation handling, hierarchy, and time-sensitive reasoning.

### 4. What data does it use?
It uses prior literature, open-source libraries, and benchmarks, rather than a new experimental dataset.

### 5. How is it evaluated?
As a survey, it is evaluated by clarity, breadth, usefulness of taxonomy, and whether it helps readers navigate the field.

### 6. What are the main results?
The main result is the taxonomy itself. The paper argues that graph-based memory is especially promising because it can unify or generalize many simpler memory forms while making relationships explicit.

Its most useful practical structure is the lifecycle view:
- **Extraction**: turning raw observations into memory units,
- **Storage**: organizing them in graph-compatible structures,
- **Retrieval**: traversing/querying for relevant subgraphs or memory fragments,
- **Evolution**: updating, consolidating, or refining memory over time.

### 7. What is actually novel?
The novelty is modest but real: the paper gives a coherent graph-memory-specific taxonomy and lifecycle framing at a moment when the literature is rapidly expanding.

### 8. What are the strengths?
- Timely topic choice.
- Good lifecycle framing.
- Useful distinction between knowledge memory and experience memory.
- Helpful discussion of graph structure as explicit relation modeling rather than just a storage gimmick.
- Includes practical ecosystem discussion around libraries, benchmarks, and applications.

### 9. What are the weaknesses, limitations, or red flags?
- Surveys in fast-moving areas go stale quickly.
- The paper sometimes overstates how unified graph memory really is; some strong systems are not graph-heavy at all.
- “Graph” can become a catch-all umbrella that blurs major implementation differences.
- The survey is better at taxonomy than at sharply separating genuinely strong methods from fashionable ones.

### 10. What challenges or open problems remain?
The biggest ones are still evaluation, memory correctness, memory evolution under noise, scalability, and deciding when graph structure is actually worth its overhead.

### 11. What future work naturally follows?
- Better benchmarks for agent memory quality and evolution.
- Stronger methods for contradiction handling and memory revision.
- Better comparisons between graph memory and simpler baselines.
- More task-aware designs that justify structural overhead.

### 12. Why does this matter?
Because agent memory is becoming a major design axis, and graph-based approaches are proliferating faster than people can track them. A survey helps separate the conceptual building blocks from the marketing fog.

## Why It Matters

The paper matters as a map. It does not settle whether graph memory is the answer, but it helps clarify what questions are even being asked.

## What ideas are steal-worthy?
- Use the **memory lifecycle** as a design lens.
- Separate **knowledge memory** from **experience memory**.
- Treat graph memory as a structural option for explicit relations, hierarchy, and time.
- Ask whether memory systems should evolve, not just retrieve.

## Final decision
Keep.

Useful survey reference for the graph-based agent-memory space, especially when trying to orient newer papers against a broader landscape.
