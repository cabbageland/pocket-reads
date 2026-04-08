# SkillX: Automatically Constructing Skill Knowledge Bases for Agents

## Basic info

* Title: SkillX: Automatically Constructing Skill Knowledge Bases for Agents
* Authors: Chenxi Wang, Zhuoyun Yu, Xin Xie, Wuguannan Yao, Runnan Fang, Shuofei Qiao, Kexin Cao, Guozhou Zheng, Xiang Qi, Peng Zhang, Shumin Deng
* Year: 2026
* Venue / source: arXiv preprint (cs.CL, cs.AI, cs.IR, cs.LG, cs.MA)
* Link: https://arxiv.org/abs/2604.04804
* PDF: https://arxiv.org/pdf/2604.04804.pdf
* HTML: https://arxiv.org/html/2604.04804v1
* Date read: 2026-04-08
* Date surfaced: 2026-04-08
* Surfaced via: Tracy in #pocket-reads via GitHub repo link
* Why selected in one sentence: It is a concrete attempt to turn agent experience into a reusable hierarchical skill library that transfers from a stronger builder agent to weaker deployed agents, which is exactly the sort of systems-layer capability reuse claim worth checking against the actual paper instead of the repo pitch.

## Quick verdict

* Highly relevant

This is a good agent-systems paper because it is trying to solve a real bottleneck rather than doing decorative memory-talk. The central claim is that raw trajectories, reflections, and loosely written workflows are all mediocre containers for transferable agent experience. SkillX instead distills experience into a three-level skill knowledge base — planning skills, functional skills, and atomic skills — then iteratively cleans and expands that library so it can be plugged into weaker agents at inference time. The strongest part is not just the hierarchy itself, but the whole systems argument: use a stronger backbone agent to prebuild portable skill artifacts, retrieve them lightly, inject them once, and get measurable gains in both task success and execution efficiency on long-horizon tool-use benchmarks.

## One-paragraph overview

SkillX is a fully automated framework for constructing a plug-and-play skill knowledge base for LLM agents from execution experience. A strong backbone agent first solves training tasks and mines successful trajectories. Those trajectories are not stored as raw demonstrations; instead, the framework distills them into a hierarchy of planning skills for high-level task organization, functional skills for reusable multi-step tool subroutines, and atomic skills for tool-specific invocation constraints and usage patterns. The resulting library is then improved through iterative refinement steps that merge redundant skills, filter bad or hallucinated ones, and update entries based on execution feedback. Finally, SkillX performs exploratory skill expansion by targeting underused tools and failure-prone behaviors to synthesize and validate new skills beyond the seed training distribution. At deployment time, a weaker base agent retrieves relevant skills for a task and conditions on them directly, yielding roughly 10-point gains for weaker models like Qwen3-32B while also reducing unnecessary execution steps.

## Model definition

### Inputs
Task instances from interactive tool-use environments, successful and failed execution trajectories, and a skill retrieval query at inference time for the downstream base agent.

### Outputs
A reusable multi-level skill library plus skill-conditioned agent behavior at deployment time, including improved task completions and more efficient tool-use trajectories.

### Training objective (loss)
This is not a new end-to-end learned model with a novel differentiable loss. The “training” procedure is an automated systems pipeline: collect trajectories with a strong agent, extract structured skills, iteratively refine them, expand the library through guided exploration, then retrieve and inject the resulting skills at inference time.

### Architecture / parameterization
The representation is explicitly hierarchical:
- **Planning skills** capture high-level strategic decomposition and ordering.
- **Functional skills** capture reusable tool-composition subroutines for subtasks.
- **Atomic skills** capture tool-specific usage patterns, parameter conventions, constraints, and common failure modes.

The full SkillX pipeline has three major stages:
1. **Multi-Level Skills Design / Extraction** from trajectories.
2. **Iterative Skills Refinement** through merge, filter, and update operations.
3. **Exploratory Skills Expansion** that targets under-covered tools and failure-prone regions of behavior.

At deployment time, a retriever selects relevant skills and injects them into the base agent’s context as a lightweight plug-and-play skill library.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
The paper is trying to solve a pretty concrete problem in agent learning: current “learn from experience” approaches often do a lot of work and keep surprisingly little reusable knowledge. Agents repeatedly rediscover similar strategies, reflections are too vague, raw trajectories are too verbose and brittle, and workflow summaries are often too coarse to tell you how tools should actually be used under real constraints. So even when an agent has prior experience, that experience often transfers badly across tasks, environments, or model backbones.

SkillX targets that gap by asking what form of experience is compact enough to retrieve, concrete enough to execute, and portable enough to transfer from one agent setup to another.

### 2. What is the method?
The method is to build a **plug-and-play hierarchical skill knowledge base** from agent trajectories.

Concretely:
- run a strong backbone agent on training tasks,
- extract three kinds of skills from its trajectories,
- iteratively refine the resulting library by merging redundant items, filtering bad ones, and updating them from new feedback,
- then proactively expand the library by exploring underused tools and failure-heavy behaviors.

At test time, a weaker base agent retrieves relevant skills for the current task and conditions on them directly.

### 3. What is the method motivation?
The motivation is that **experience representation matters**. If experience is stored as giant raw traces, vague reflections, or monolithic workflows, it is hard to reuse efficiently and hard to transfer across agents. SkillX argues that reusable experience should be organized at multiple levels of abstraction: plans for task structure, functional routines for reusable tool sequences, and atomic tool notes for concrete usage constraints.

That hierarchy is meant to preserve enough specificity to be operationally useful without forcing the downstream agent to reread long demonstrations or rediscover low-level tool quirks from scratch.

### 4. What data does it use?
The paper builds and evaluates the skill library on long-horizon, user-interactive tool-use benchmarks:
- **AppWorld**
- **BFCL-v3**
- **τ²-Bench**

The builder backbone is **GLM-4.6**, and the transfer studies plug the resulting skills into weaker base agents such as **Qwen3-32B** and **Kimi-K2-Instruct-0905**.

### 5. How is it evaluated?
The evaluation is about both **task success** and **execution efficiency**. The paper compares SkillX against experience-learning baselines like A-Mem, AWM, ExpeL, and no-memory setups, then analyzes:
- overall benchmark performance across the three environments,
- different skill compositions,
- iterative refinement effects,
- skill expansion strategies,
- input-token tradeoffs,
- and execution-step efficiency.

The paper also includes case studies showing where hierarchical skills help with prerequisite sequences, cross-app coordination, and user-interactive topic shifts.

### 6. What are the main results?
The headline result is that the prebuilt skill library **helps weaker agents noticeably**. The paper reports that plugging SkillX into base agents like **Qwen3-32B** yields **around a 10% performance improvement** while also improving execution efficiency. The analysis section also says experience-based learning produces substantial **Pass@4 improvements** for weaker models like **Kimi-K2** and **Qwen3-32B**, while gains for the already-strong **GLM-4.6** are much smaller.

A few result patterns matter more than the exact leaderboard numbers:
- composing **all three skill levels** gives the best execution efficiency,
- **iterative refinement** improves performance over initial extraction,
- **experience-guided expansion** beats weaker expansion strategies,
- and skill-conditioned agents take **fewer execution steps**.

That is a decent empirical story: the hierarchy is not just a storage format, it changes downstream behavior in a direction that looks operationally useful.

### 7. What is actually novel?
The novelty is not merely “use skills.” A lot of agent papers say that. The stronger claim here is:
- represent experience as a **three-level skill hierarchy** instead of a single blob,
- build the library **fully automatically** from trajectories,
- keep improving it with **iterative refinement**,
- and grow it beyond seed data through **exploratory expansion**.

The other important novelty is the **strong-to-weak transfer framing**: a stronger builder agent constructs portable skill artifacts that weaker agents can directly use later without retraining.

### 8. What are the strengths?
- It asks the right question: what kind of experience artifact actually transfers?
- The hierarchy is sensible; plans, functional routines, and atomic tool constraints really are different things.
- It focuses on long-horizon interactive environments where tool misuse and sequencing errors actually matter.
- The paper cares about **efficiency**, not just success rate.
- The strong-to-weak transfer setup is practical and more interesting than “same model reflects on itself forever.”
- The retrieval/injection story is lightweight enough to plausibly matter in real systems.

### 9. What are the weaknesses, limitations, or red flags?
- The paper is still pretty benchmark-centric, so it is not obvious how robust the library remains under messier real-world environments or tool schemas.
- A lot depends on the quality of extraction prompts, refinement heuristics, and retrieval behavior; those systems details can be brittle even if the overall framing is good.
- The comparison to “Claude Skills” in Figure 1 is rhetorically useful but a bit glib; the paper is really contrasting one particular long-context skill format with its own itemized hierarchy, not proving a universal theorem about all alternative skill systems.
- Strong-to-weak transfer is appealing, but it also means the quality ceiling depends heavily on the builder agent and the training-task distribution.
- The paper says the code will be released, but as of this read it still looks like a work-in-progress release rather than a mature, heavily audited artifact.

### 10. What challenges or open problems remain?
A major open problem is **skill portability across genuinely different environments**, not just across benchmark families with structured tool interfaces. Another is whether hierarchical skill libraries can stay compact and non-redundant as they grow over time. There is also a retrieval problem lurking here: once the library is large, choosing the right skills and not overloading the context becomes just as important as building the library in the first place.

More broadly, the paper leaves open how these libraries should interact with richer forms of state, memory, or executable scaffold logic. A skill KB is useful, but it is not the whole story of an agent system.

### 11. What future work naturally follows?
- Better retrieval and compression for large evolving skill libraries.
- Cross-environment transfer studies where tool APIs differ more radically.
- Hybrid representations mixing natural-language skills with more typed or executable schema.
- Online continual maintenance of a skill KB in deployed systems.
- Stronger analysis of when planning, functional, or atomic levels matter most.

### 12. Why does this matter?
Because agents keep wasting compute rediscovering the same behavior. If a stronger agent can build reusable, inspectable skill artifacts that weaker agents can immediately use, that is a more plausible path to practical capability accumulation than endlessly stuffing bigger traces into context windows. The paper matters because it treats **experience as a structured systems asset**, not just as prompt compost.

## Why It Matters

What I like here is the refusal to pretend all “memory” is equally useful. It usually is not. If you want an agent to actually get better from prior work, you need a representation that is compact, retrieval-friendly, and specific enough to affect tool use. SkillX is one of the cleaner recent attempts to make that concrete. I do not think it solves agent memory in general, but it does make a solid case that hierarchical reusable skills are a better unit of transfer than raw traces or pious reflections.

### 13. What ideas are steal-worthy?
- Use a **strong builder / weak deployer** split instead of demanding that every agent learn only from its own limited experience.
- Separate reusable knowledge into **plan-level**, **functional**, and **atomic** layers.
- Treat **tool-specific failure notes and constraints** as first-class reusable knowledge.
- Iteratively **merge, filter, and update** learned experience artifacts instead of assuming first-pass extraction is clean.
- Expand the library by targeting **underused tools and failure-heavy areas**, not just replaying successful examples.

### 14. Final decision
Keep.

This is a strong fit for Pocket Reads because it has a real systems idea inside it: agent experience should be distilled into reusable hierarchical skill artifacts that can be transferred across models and environments. The empirical story is not magical, but it is good enough to take seriously, and the framing is sharper than most generic “agent memory” papers. If I were borrowing one idea from it, it would be the strong-builder / weak-deployer pattern plus the insistence that tool constraints belong in the learned artifact, not just in the base tool docs.
