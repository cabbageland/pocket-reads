# A Simple Baseline for Streaming Video Understanding

## Basic info

* Title: A Simple Baseline for Streaming Video Understanding
* Authors: Yujiao Shen, Shulin Tian, Jingkang Yang, Ziwei Liu
* Year: 2026
* Venue / source: arXiv preprint
* Link: https://arxiv.org/abs/2604.02317
* Project page: https://simple-stream.github.io/
* HTML: https://arxiv.org/html/2604.02317v1
* Date read: 2026-04-06
* Date surfaced: 2026-04-06
* Surfaced via: Lulin Liu in #pocket-reads
* Why selected in one sentence: It directly challenges the whole “just keep adding streaming memory machinery” trend by showing a recency-only baseline can beat a lot of more complicated systems.

## Quick verdict

* Highly relevant

This is a good, slightly savage baseline paper. The central claim is that a lot of streaming-video work has been treating memory complexity as progress, when in practice a very simple sliding-window setup using only the last few frames already beats many published systems. The paper is strongest when it reframes the problem as a **perception-memory trade-off** instead of “more memory is always better.” It does not solve long-horizon video understanding, but it does something almost as useful: it makes a bunch of overcomplicated methods look suspicious unless they can clearly beat a strong recent-context baseline under matched conditions.

## One-paragraph overview

SimpleStream is an intentionally minimal baseline for streaming video understanding. Given a query at time t, it feeds an off-the-shelf VLM only the most recent N frames from the causal prefix, with no extra memory bank, retrieval module, compression mechanism, or special training. The authors evaluate this setup on OVO-Bench and StreamingBench against a mix of offline and streaming video LLM baselines, including methods built around external memory, retrieval, latent memory, and compression. Surprisingly, the simple recency-only baseline consistently matches or outperforms many of them. The paper then runs a set of ablations showing that increasing historical context is not uniformly helpful: accuracy is non-monotonic in window size, benefits depend on the backbone family and scale, and explicit retrieval can improve some memory-style tracks while degrading present-scene perception. The broader message is that streaming evaluation should stop assuming memory complexity is intrinsically good and should instead measure whether it beats a hell of a strong recency baseline.

## Model definition

### Inputs
- a streaming video observed under causal constraints
- a text query at time t
- the last N recent frames from the observed prefix
- an off-the-shelf VLM backbone such as Qwen2.5-VL or Qwen3-VL

### Outputs
- the answer to the current streaming video question

### Training objective (loss)
This paper is mostly a **strong-baseline evaluation paper**, not a new training-method paper.

SimpleStream itself introduces:
- no extra training
- no new architecture
- no memory module
- no retrieval or compression training pipeline

The backbone VLMs are used off the shelf. So the “method” is really an inference-time context policy: only keep the last N frames.

### Architecture / parameterization
The architecture is almost hilariously simple:
- sample the visible stream at 1 fps
- keep only the most recent N frames, where N is typically 2, 4, or 8
- feed those frames plus the query directly into a base VLM

That is it. The point is exactly that there is no extra streaming gadgetry.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
The paper is asking a very specific but important question:

**Do we actually need complex memory mechanisms for strong streaming video understanding, or are we overpaying for history when recent perception already does most of the work?**

A lot of recent streaming-video papers add:
- external memory banks
- retrieval over history
- compression of visual tokens or KV states
- latent recurrent memory

The field often treats these as natural progress. This paper challenges that assumption.

### 2. What is the method?
The method is a recency-only baseline called **SimpleStream**.

At query time t:
- take only the last N observed frames
- pair them with the text query
- run an off-the-shelf VLM

Formally, it is basically:
- `answer_t = VLM(last_N_frames, query_t)`

No long-range memory store, no retrieval over past chunks, no special streaming architecture.

### 3. What is the method motivation?
The motivation is half scientific and half disciplinary slap.

Scientific motivation:
- if strong backbones already extract a lot from recent context, maybe the right baseline is much stronger than people admit
- if added history hurts current-scene perception, then memory modules may be paying for recall with degraded real-time understanding

Disciplinary motivation:
- the field should not let “more complicated streaming system” stand in for actual empirical progress
- extra modules should have to beat a strong simple baseline under matched evaluation

This is the right instinct. Baseline papers like this save people from cargo-cult architecture inflation.

### 4. What data does it use?
Main benchmarks:
- **OVO-Bench**
- **StreamingBench**

The paper says:
- OVO-Bench has **1,640 questions** over 12 tasks
- StreamingBench real-time visual understanding subset has **2,500 questions** across 10 task types

The authors focus on the causal streaming setup and especially analyze the tension between:
- **Real-Time Visual Perception** tracks
- **Backward Tracing / memory-style** tracks

### 5. How is it evaluated?
They compare SimpleStream against:
- multiple **offline video LLMs**
- multiple **online / streaming video LLMs**

Reported baselines include things like:
- VideoLLM-online
- Flash-VStream
- Dispider
- TimeChat-Online
- StreamForest
- Streamo
- HERMES

They also test multiple backbones and window sizes for SimpleStream, mainly:
- Qwen2.5-VL-7B with 2 / 4 / 8 frames
- Qwen3-VL-8B with 2 / 4 / 8 frames

Metrics include:
- OVO-Bench averages over Real-Time and Backward categories
- StreamingBench accuracy
- efficiency measures like **TTFT** and **peak GPU memory**

They also run several analysis sections:
- window-size ablation
- model-scale ablation
- Visual-RAG ablation
- perception-memory trade-off analysis

### 6. What are the main results?
The headline result is that the simple baseline wins a lot.

Best reported SimpleStream result:
- **Qwen3-VL + 4 frames**
- **67.7%** on OVO-Bench average
- **80.59%** on StreamingBench

The paper says this beats the strongest published streaming baseline they compare against, **HERMES**, by:
- **+8.5 points** on OVO-Bench average (67.7 vs 59.2)
- also edges it on StreamingBench (80.59 vs 79.44)

A few especially important findings:
- performance is **non-monotonic** in window size; 4 frames is often better than 8 or 16
- more history can help memory-style behavior, but often hurts present-scene perception
- retrieval-based augmentation can improve some backward-memory tracks while reducing overall accuracy
- SimpleStream is also efficient: low peak GPU memory, competitive latency

The core empirical vibe is: a lot of fancy streaming memory work is not clearing the simplest competent bar.

### 7. What is actually novel?
The novelty is not a new architecture. It is a **reframing plus a strong controlled baseline**.

Concretely, the contribution is:
- define a very strong recency-only baseline for streaming video understanding
- show that many published streaming systems fail to beat it
- formalize the **perception-memory trade-off** more explicitly
- argue that benchmark reporting should separate recent-scene perception from long-range memory instead of collapsing them into one flattering average

That sounds modest, but hell, sometimes this kind of paper is more useful than another baroque module stack.

### 8. What are the strengths?
- The paper asks a sharp question instead of worshipping complexity.
- The baseline is simple enough that the comparison is easy to understand.
- The empirical takeaway is actually actionable for future papers.
- The window-size and retrieval ablations are important; they show “more context” is not free.
- The efficiency analysis matters because streaming systems often quietly become expensive while claiming conceptual elegance.
- The benchmark critique is thoughtful: current aggregate reporting may overweight perception-heavy tracks and blur what “memory improvement” really means.

### 9. What are the weaknesses, limitations, or red flags?
A few.

**First:** this is backbone-dependent.  
The result leans heavily on strong modern Qwen-VL backbones. If your underlying VLM is worse, the recency-only baseline may not be as dominant.

**Second:** it is a baseline paper, not a real solution to long-horizon streaming memory.  
The paper is valuable because it reveals inflated claims elsewhere, but it does not itself crack robust long-term memory under streaming constraints.

**Third:** benchmark structure may partly favor the baseline.  
The authors acknowledge this. If evaluation overweights present-scene perception, then preserving clear recent frames gets rewarded twice: once because the backbone likes it, and again because the benchmark likes it.

**Fourth:** beating current methods does not prove history is unimportant.  
It proves current memory mechanisms are often not worth their complexity under these protocols.

### 10. What challenges or open problems remain?
- how to use historical context **without degrading present-scene perception**
- how to design memory modules that beat recency baselines under matched compute and backbone conditions
- how to build benchmarks that distinguish:
  - current-scene perception
  - episodic memory
  - hallucination robustness
- how to generalize beyond the Qwen-family backbone story
- when retrieval or compression helps reliably rather than selectively

### 11. What future work naturally follows?
- build **recent-first, history-on-demand** streaming systems
- benchmark memory modules against strong recency baselines by default
- report disaggregated metrics instead of only aggregate scores
- develop streaming architectures that selectively access history only when recent evidence is insufficient
- study backbone-dependent context scaling more carefully instead of assuming longer windows should always help

### 12. Why does this matter?
Because this is exactly the kind of paper that keeps a field honest.

If a method adds memory banks, retrieval stacks, latent states, and compression layers, it should not get points for looking sophisticated. It should have to beat a dumb-but-strong baseline first.

SimpleStream says: maybe today’s VLMs are already strong enough on recent context that a lot of “streaming memory innovation” is just paying extra complexity tax for muddy gains. That is a useful corrective.

### 13. What ideas are steal-worthy?
- Always compare fancy streaming systems to a **strong recency-only baseline**.
- Treat streaming as a **context management** problem, not automatically a memory-maximization problem.
- Separate **perception** and **memory** metrics in evaluation.
- Use **recent-first, history-on-demand** as a systems principle.
- Be skeptical of any paper where added history is assumed to help without careful matched ablations.

### 14. Final decision
Keep.

This is not the paper you cite because it invented a dazzling new streaming architecture. It is the paper you cite when someone tries to sell you a memory-heavy streaming stack without proving it beats a four-frame baseline. And honestly, hell yes, the field needs more papers like that.
