# Memory Intelligence Agent

## Basic info

* Title: Memory Intelligence Agent
* Authors: Jingyang Qiao, Weicheng Meng, Yu Cheng, Zhihang Lin, Zhizhong Zhang, Xin Tan, Jingyu Gong, Kun Shao, Yuan Xie
* Year: 2026
* Venue / source: arXiv preprint (cs.AI, cs.MA)
* Link: https://arxiv.org/abs/2604.04503v2
* PDF: https://arxiv.org/pdf/2604.04503
* DOI: https://doi.org/10.48550/arXiv.2604.04503
* Date read: 2026-04-09
* Date surfaced: 2026-04-09
* Surfaced via: Tracy in #pocket-reads
* Why selected in one sentence: It is a serious attempt to make agent memory do more than retrieval garnish by coupling external memory, a trainable planner, and online self-updating behavior in a deep-research setting.

## Quick verdict

* Relevant, with some inflation

This is an ambitious memory-for-agents paper that is much better than the usual “we added a memory buffer and the benchmark number went up a bit” genre. The central move is to split memory into **non-parametric memory** managed by a memory store and **parametric memory** embodied in a trainable planner, then make those two evolve together during training and test-time learning. That is the right direction. The paper is strongest when it argues that deep research agents need to remember **how** past searches worked, not just **what** facts were seen, and when it turns that into an explicit Manager–Planner–Executor architecture with reflection, routing, and memory compression. The weak spots are also familiar: lots of moving parts, heavy systems complexity, some “brain-inspired” rhetoric that does not add much, a large amount of bespoke training machinery, and results that are impressive but make it harder to isolate which component is doing the real work.

## One-paragraph overview

The paper proposes **Memory Intelligence Agent (MIA)**, a deep-research-agent framework built around three roles: a **Memory Manager** that stores compressed historical trajectories as non-parametric memory, a **Planner** that internalizes planning strategies as parametric memory, and an **Executor** that carries out search-and-reason loops under the planner’s guidance. Unlike standard memory systems that mostly retrieve similar past traces into context, MIA tries to make memory actually evolve. It does this through two-stage alternating reinforcement learning, a reflection-and-replan loop, online test-time learning for the planner, and a bidirectional flow between explicit stored memory and internalized parametric skill. The paper’s core claim is that deep research needs process memory — plans, trajectories, failure patterns, workflow summaries — more than just factual long context, and that combining explicit memory storage with continual planner updating improves both performance and efficiency across text and multimodal research benchmarks.

## Model definition

### Inputs
Open-ended deep-research tasks, including text and multimodal questions; retrieved memory context from prior trajectories; external tool results; and execution feedback from the environment.

### Outputs
Search plans, tool-using execution traces, revised plans after reflection, final answers, compressed workflow memories, and updated planner parameters.

### Training objective (loss)
This is not a pretraining paper. The main optimization is a **two-stage alternating RL setup**:
- stage 1 trains the **Executor** to follow plans and use tools effectively,
- stage 2 trains the **Planner** to absorb memory, generate better plans, and reflect/replan well.

The planner is then further updated during **test-time learning**, while the executor remains frozen for stability.

### Architecture / parameterization
The architecture has three major components:
- **Memory Manager**: stores compressed workflow summaries, captions, rewards, and usage metadata; retrieves memories using similarity + value + frequency signals.
- **Planner**: the parametric memory core that generates plans, reflects on execution, and is updated both during RL and test-time learning.
- **Executor**: follows the plan in a ReAct-style loop with tools and returns execution outcomes.

A useful framing in the paper is that the system tries to unify:
- **non-parametric memory** as explicit historical workflow storage,
- **parametric memory** as internalized planning competence,
- and a loop that converts between them instead of treating memory retrieval as a dead-end append-to-context trick.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
The paper is trying to solve a real weakness in deep research agents: they often act like amnesic search loops. Even when they have “memory,” it is usually just long-context retrieval of similar traces or documents. That approach gets expensive, noisy, and semantically bloated, and it often stores the wrong thing. For deep research, the important question is not only *what information was found before*, but *what search pattern worked, what failed, and how to decompose a similar problem next time*. The paper wants a memory system that supports **experience accumulation, planning reuse, compression, and continual improvement** rather than just bigger retrieval.

### 2. What is the method?
The method is a three-part deep research architecture:
- a **Manager** that stores compressed trajectories,
- a **Planner** that converts memory into a search plan,
- and an **Executor** that carries out the plan with tools.

The main technical pieces are:
- **hybrid memory retrieval** using semantic similarity, success value, and frequency reward,
- **positive and negative trajectory storage** so memory includes both useful paradigms and pitfalls,
- **two-stage alternating RL** to separately train executor-following and planner-generation,
- **reflection + replan** after executor feedback,
- **test-time learning** that keeps updating the planner online,
- and an **unsupervised judging setup** with reviewer-style evaluators when gold answers are unavailable.

### 3. What is the method motivation?
The motivation is pretty good: long-context memory is a clumsy fit for deep research agents. It scales badly, injects irrelevant text, and tends to preserve factual scraps more than reusable problem-solving structure. The authors argue that what matters for research agents is **process-oriented memory** — how previous searches were organized, which strategies worked, which detours failed, and when to replan. That is a stronger and more agent-native notion of memory than just dumping transcripts back into context.

### 4. What data does it use?
The paper evaluates across **eleven benchmarks**, spanning text and multimodal deep-research settings. In the extracted text, the paper explicitly highlights **LiveVQA** and **HotpotQA**, and also reports broader seven-dataset comparisons for some settings. The training setup uses Qwen-family models for planner, executor, memory manager, and judge roles, with local search/indexing tools.

### 5. How is it evaluated?
The evaluation is broad and layered:
- frontier-model enhancement tests, where MIA is used to improve already-strong models like GPT-5.4,
- smaller-model enhancement tests, where MIA with a lightweight executor is compared against much larger baselines,
- comparisons against prior memory frameworks,
- training analysis for planner/executor co-adaptation,
- tool-interaction analysis,
- and unsupervised self-evolution experiments.

That breadth is useful, though it also means attribution gets messy. With this many components, it is easy to prove “the whole contraption helps” while remaining less clear on which parts are indispensable.

### 6. What are the main results?
The headline claim is that **MIA substantially improves deep-research performance**, including on top of already strong base models.

The paper specifically reports:
- up to **+9% on LiveVQA** and **+6% on HotpotQA** when enhancing GPT-5.4,
- average gains around **31%** across several datasets with a small Qwen2.5-VL-7B executor,
- performance surpassing a much larger Qwen2.5-VL-32B baseline in some settings,
- average gains over prior memory baselines,
- and continued gains under **unsupervised** self-evolution.

The most interesting result is not just the benchmark lift. It is the argument that **memory tuned for workflow structure and planner updating** beats long-context memory methods that mainly stuff prior traces into prompts. The tool-analysis claim — that prior long-context memory methods struggle in multi-turn tool interaction while MIA handles it better — is especially relevant if true.

### 7. What is actually novel?
The paper’s novelty is not memory in general. It is the attempt to make agent memory:
- **process-centric** instead of fact-centric,
- **dual-form** (explicit + internalized),
- **evolutionary** rather than static retrieval,
- and tightly integrated with planning instead of bolted on as context.

The most novel moves are probably:
- separating **non-parametric** and **parametric** memory as complementary pieces,
- using a planner as the trainable internal memory substrate,
- maintaining a conversion loop between stored trajectories and planner updates,
- and extending this into **online test-time learning** rather than stopping at offline training.

### 8. What are the strengths?
- It targets a real failure mode in agent memory rather than inventing a fake problem.
- It distinguishes **remembering facts** from **remembering how to solve things**, which is the right axis for research agents.
- The planner/executor split makes the memory story more operational than generic “memory module” papers.
- It tries to control storage growth through compression and selective retention instead of celebrating ever-growing context.
- It takes unsupervised self-improvement seriously enough to build an explicit judgment framework rather than handwaving it.
- It is one of the more concrete attempts to treat memory as an active part of agent learning, not just retrieval decoration.

### 9. What are the weaknesses, limitations, or red flags?
- The system is **very** complicated. Manager, planner, executor, memory buffer, router, judge, reviewer-like evaluators, alternating RL, reflection, TTL — this is a lot.
- Because there are so many pieces, clean causal attribution is hard. You can believe the system works overall while remaining unsure what actually matters most.
- The paper leans on “brain-inspired” language like hippocampus-style memory, but the useful content is the systems design, not the neuro analogy.
- Test-time learning is appealing, but online adaptation can create stability, reproducibility, and safety headaches in real deployments.
- The unsupervised judging setup is clever, but still depends on model-based evaluators that may smuggle in their own biases or failure modes.
- The whole thing may be expensive and brittle outside the well-curated benchmark/tool environment.

### 10. What challenges or open problems remain?
A major open problem is whether this style of memory system can stay robust in genuinely messy open-world agent deployments, not just benchmark-heavy research setups. Another is deciding what the right memory unit is: full trajectories, workflow summaries, plans, failures, tool observations, or some structured hybrid. There is also the question of how much online adaptation you actually want in a production agent before you start trading away auditability and predictability.

### 11. What future work naturally follows?
- Stronger ablations that isolate which memory-evolution components matter most.
- Simpler structured memory formats that preserve workflow information without requiring so much machinery.
- Better safety and observability for test-time learning and online planner updates.
- Cross-domain tests beyond QA/research benchmarks, especially coding, browsing, and scientific-assistant settings.
- More serious work on failure-memory use: not just what worked, but how agents should selectively remember mistakes without overfitting to them.

### 12. Why does this matter?
Because a lot of “memory for agents” work is still basically fancy prompt stuffing. This paper matters because it tries to make memory do something more consequential: store and internalize search behavior. If deep research agents are going to become genuinely cumulative systems rather than one-shot solvers with retrieval garnish, this is the right class of problem to work on.

## Why It Matters

The steal-worthy idea here is simple even if the implementation is elaborate: **memory for agents should mostly be about reusable process, not just recoverable facts**. That means remembering plans, workflow patterns, failed branches, and decision structure — and then gradually internalizing those patterns so the system does not need to retrieve everything forever. That is a much healthier direction than treating “longer context” as a substitute for learning.

## What ideas are steal-worthy?
- Split agent memory into **explicit stored workflows** and **internalized planning competence**.
- Compress trajectories into structured memory instead of hoarding raw transcripts.
- Retrieve both **positive paradigms** and **negative constraints**.
- Use memory to improve planning, not just answer generation.
- Treat test-time learning as a planner-level adaptation problem while freezing execution for stability.
- Design memory retrieval around more than similarity alone; usefulness and underused long-tail memories matter too.

## Final decision
Keep.

This is a strong systems paper in an area that is usually either handwavey or bloated with generic “memory” branding. It is not clean or minimal, and I do not buy every grandiose part of the framing, but the core instinct is right: agent memory should help systems accumulate **search strategy**, not just accumulate text. That makes it worth keeping around.
