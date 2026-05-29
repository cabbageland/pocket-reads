# Towards Agentic Video Analytics with Vision Language Models

## Basic info

* Title: Towards Agentic Video Analytics with Vision Language Models
* Authors: Yuxuan Yan, Shiqi Jiang, Ting Cao, Yifan Yang, Qianqian Yang, Yuanchao Shu, Yuqing Yang, Lili Qiu
* Year: 2026
* Venue / source: NSDI 2026 / arXiv preprint
* Link: https://arxiv.org/abs/2505.00254
* PDF: https://arxiv.org/pdf/2505.00254.pdf
* Code: https://github.com/I-ESC/Project-Ava
* Dataset: https://huggingface.co/datasets/iesc/Ava-100
* Date read: 2026-04-08
* Date surfaced: 2026-04-08
* Surfaced via: Tracy in #pocket-reads via GitHub repo link
* Why selected in one sentence: The repo looked like yet another “agentic long-video” project page, but the actual paper is more interesting because it is really a retrieval/indexing systems paper for ultra-long video rather than vague agent branding.

## Quick verdict

* Relevant, with caveats

This paper has a real systems idea inside it, but it is not as magical as the framing sometimes sounds. The useful contribution is a structured long-video pipeline: build an event-centric index over long video, retrieve from it through multiple views, then let an LLM do bounded search over that index before answering. That is more concrete than a lot of “agentic” video papers. The catch is that the strongest part is the indexing/retrieval structure, while the expensive search/generation stage is also clearly the runtime bottleneck. So the paper is worth keeping as a design reference for long-video analytics pipelines, but not as proof that “agentic VLMs” have solved open-ended video understanding.

## One-paragraph overview

AVA is a long-video analytics system built around two main ideas. First, it converts ultra-long video into an **Event Knowledge Graph (EKG)**: semantically chunked events, linked entities, event-event temporal relations, entity-entity semantic relations, and event-entity participation edges. Second, instead of answering queries from raw frames or one-shot retrieval alone, it performs **tri-view retrieval** over events, entities, and frame embeddings, then runs an **agentic tree search** over the graph using a small action space: forward, backward, re-query, and summary-and-answer. Candidate answers are then filtered by a **thought-consistency** scoring scheme, with an optional frame-checking refinement step. On LVBench, VideoMME-Long, and the paper’s new AVA-100 benchmark, the system outperforms uniform sampling, vector retrieval, and several video-RAG baselines, especially on very long videos and reasoning-heavy queries.

## Model definition

### Inputs
- an ultra-long or long video stream
- a user query in natural language
- semantically chunked event descriptions extracted from the video
- linked entity descriptions and frame embeddings associated with those events

### Outputs
- an answer to the query, typically multiple-choice in benchmark evaluation, but the system is intended for open-ended analytics-style responses
- intermediate retrieval results and search trajectories over the event graph

### Training objective (loss)
This is **not** a model-training paper in the main sense. The contribution is a systems pipeline for inference-time indexing, retrieval, and answer generation over long video. The paper uses existing VLMs/LLMs/embedding models rather than introducing a new end-to-end learned objective.

### Architecture / parameterization
The architecture is a staged pipeline:

1. **Near-real-time index construction**
   - uniform buffering into short chunks
   - small VLM generates chunk descriptions
   - **semantic chunking** merges adjacent chunks by BERTScore similarity into event-level segments
   - entity extraction and cross-event entity linking via embedding clustering
   - final storage as an **Event Knowledge Graph (EKG)** plus linked frame embeddings

2. **Tri-view retrieval**
   - event-level retrieval
   - entity-level retrieval
   - raw-frame embedding retrieval
   - weighted **Borda counting** merges rankings across views

3. **Agentic searching on graph**
   - action space: **Forward (F), Backward (B), Re-query (RQ), Summary and Answer (SA)**
   - tree search over retrieved events and their graph neighbors
   - bounded event-list length to control explosion/noise

4. **Consistency-enhanced generation**
   - repeated CoT-style answer generation at SA nodes
   - score combines answer agreement with reasoning-trace similarity
   - optional **Check Frames and Answer (CA)** refinement using linked raw frames

The key architectural point is that the “agentic” part sits on top of a retrieval graph; it is not agentic in the sense of a general autonomous planner acting on the open world.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
The paper is trying to solve a real limitation of current VLM-based video understanding: **most strong multimodal models still choke on ultra-long video**.

That happens for a few obvious reasons:
- context windows are limited,
- raw frame ingestion scales badly,
- uniform chunking often slices events at the wrong boundaries,
- and one-shot retrieval is often too brittle for complex questions that need temporal context, multi-hop linking, or event summarization.

The paper frames this as the gap between today’s narrower video systems and a more open-ended **L4 video analytics** setting where users can ask broader questions about long, messy, real-world streams.

That framing is a bit branding-heavy, but the underlying problem is legitimate: how do you answer complex questions over 20-minute to 10-hour videos without either brute-force stuffing frames into context or reducing everything to dumb nearest-neighbor retrieval?

### 2. What is the method?
The method is a retrieval-and-search pipeline over a long-video index.

The core sequence is:
- use a small VLM to describe short video chunks,
- merge them into semantically coherent event segments,
- build an **event knowledge graph** rather than a flat clip bank,
- retrieve relevant events through three views,
- then let an LLM explore the graph with a fixed action set before producing an answer.

The retrieval/search actions are the conceptual center:
- **Forward**: move to later events
- **Backward**: move to earlier events
- **Re-query**: generate new query keywords and retrieve again
- **Summary and Answer**: generate an answer from the currently gathered event set

This is then wrapped with a consistency filter over multiple sampled candidate answers, and optionally checked against linked raw frames.

### 3. What is the method motivation?
The method motivation is actually decent.

The authors argue that long-video questions often do **not** depend on every frame equally. Some questions need:
- a specific event summary,
- a causal chain across separated moments,
- background on entities that reappear,
- or a way to pivot from one clue to another during search.

So instead of treating long-video understanding as either:
- raw-context scaling, or
- one-pass retrieval from a vector store,

they propose a middle structure: **event-centric indexing plus controlled graph exploration**.

That is sensible because video is naturally eventful and temporal, and because event relations are exactly the kind of thing flat retrieval usually throws away.

### 4. What data does it use?
The paper evaluates on three benchmarks:

- **LVBench**: 103 long videos, 1549 questions, average length around 4100 seconds
- **VideoMME-Long**: 300 videos, 900 questions, subset of VideoMME focused on videos over 20 minutes
- **AVA-100**: the authors’ new benchmark with **8 videos**, each **over 10 hours**, and **120 human-annotated questions**

AVA-100 spans four scenario types:
- human daily activities
- city walking
- wildlife monitoring
- traffic monitoring

The daily-activity videos are stitched from Ego4D, city/wildlife use public YouTube footage, and traffic uses Bellevue Traffic Video Dataset clips.

### 5. How is it evaluated?
They compare AVA against:
- mainstream VLMs with **uniform sampling**,
- the same or similar VLMs with **vectorized retrieval**,
- and several **Video-RAG / long-video QA systems** such as VideoTree, VideoAgent, DrVideo, and VCA.

The main metric shown in the paper is benchmark **accuracy**, since the tasks are evaluated as multiple-choice QA. They also include:
- category breakdowns on LVBench,
- latency and GPU-memory measurements for generation stages,
- ablations for EKG vs KG indexing,
- and ablations over tree-search depth and consistency settings.

That evaluation mix is good because this is a systems paper; raw accuracy alone would hide whether the method is simply expensive theater.

### 6. What are the main results?
The headline results are strong enough to take seriously:
- **62.3%** on LVBench
- **64.1%** on VideoMME-Long
- **75.8%** on AVA-100

The paper reports that AVA outperforms:
- prior video-RAG methods on LVBench and VideoMME-Long,
- vectorized retrieval baselines,
- and uniform sampling baselines, especially on very long videos.

The category analysis on LVBench is arguably more interesting than the single headline number. AVA gains especially on:
- temporal grounding,
- summarization,
- reasoning,
- entity recognition,
- event understanding,
- and key information retrieval,

with the biggest standout being **reasoning-heavy queries**, which is exactly where the event-graph structure should help if the method is real.

The ablation story is also useful:
- EKG indexing beats text-only KG-style alternatives like LightRAG/MiniRAG in both accuracy and construction overhead.
- Tree-search depth helps up to about **depth 3**, then gets worse, suggesting that more “agentic exploration” quickly turns into noise.

That second point matters: the paper’s own results imply that the search mechanism is useful only when kept on a leash.

### 7. What is actually novel?
The novel part is not just “use agents for video.” That description would be too sloppy.

The more precise novelty is the combination of:
- **event-centric graph indexing** for long video,
- **semantic chunking** rather than fixed chunking alone,
- **tri-view retrieval** across events, entities, and frames,
- and a **bounded graph-search procedure** for gathering evidence before answering.

The Event Knowledge Graph is probably the most reusable contribution. It encodes the intuition that videos are not just bags of frames or bags of text snippets; they have events, entities, and temporal transitions that should stay queryable.

### 8. What are the strengths?
- It addresses a real long-video bottleneck rather than pretending bigger context windows alone will fix everything.
- The **event knowledge graph** is a concrete and reusable representation.
- The method is more structured than many vague “agentic multimedia” papers.
- The paper includes nontrivial ablations and latency analysis.
- It performs especially well where event linkage and temporal reasoning should matter.
- The new **AVA-100** benchmark is useful even if the method itself eventually gets replaced.

### 9. What are the weaknesses, limitations, or red flags?
The biggest limitation is cost.

The paper’s own latency table makes it clear that the **agentic search stage is the dominant bottleneck**. Retrieval is cheap; search is not. On an A100, the agentic search stage takes on the order of **100–174 seconds per query** depending on model size, and the later generation/refinement stage is also nontrivial.

So despite the “near-real-time” language for index construction, the full question-answering pipeline is not close to live-interactive at the hardest stage.

Other caveats:
- The action space is hand-designed and relatively simple, which is good for control but also means “agentic” is doing less work than the branding suggests.
- The evaluation is mostly multiple-choice benchmark QA, which is easier to score than truly open-ended analytics use.
- AVA-100 is useful, but it is still small in video count even if the videos are extremely long.
- The consistency mechanism depends on repeated sampled reasoning, which adds overhead and may be brittle.
- A lot of the final quality may come from good indexing and retrieval structure rather than from the search layer per se.

### 10. What challenges or open problems remain?
A few obvious ones remain:
- making graph search much cheaper,
- reducing the amount of repeated answer sampling,
- stress-testing the system on genuinely open-ended user queries rather than mostly benchmark multiple choice,
- and figuring out whether the EKG representation scales to even messier domains with stronger ambiguity and more subtle events.

There is also a more conceptual question: should long-video systems use explicit graph search like this, or should the graph become a latent memory substrate for stronger learned retrieval policies? This paper does not settle that.

### 11. What future work naturally follows?
- learned or adaptive search policies instead of fixed Monte-Carlo-style tree search
- stronger graph construction with richer event schemas and uncertainty tracking
- interactive systems that trade answer speed against evidence depth
- benchmarks with more truly open-ended analytics prompts
- better edge deployment story, since the paper sells this partly as practical video analytics rather than pure benchmark gaming

### 12. Why does this matter?
Because long-video understanding is one of the places where current multimodal systems still get exposed. Throwing more raw frames at a model is expensive, but naive retrieval often loses the event structure that makes long videos understandable in the first place.

This paper matters because it takes the representation problem seriously. It says, in effect: if long videos are eventful, temporal, and relational, then your index should look eventful, temporal, and relational too. That is the right instinct. Even if AVA itself is not the final architecture, the **event-graph view of long-video analytics** is a useful design direction.

## Why It Matters

The paper is worth keeping less because of the “agentic” label and more because it offers a practical middle path between brute-force long-context VLM inference and shallow retrieval. The best idea here is that ultra-long video should be converted into a queryable event structure before you ask difficult questions of it. That idea is likely to survive even if the particular tree-search and consistency machinery gets replaced.

### 13. What ideas are steal-worthy?
- Build **event-centric indices** for long video instead of flat clip banks.
- Use **semantic chunking** to avoid slicing events at arbitrary fixed boundaries.
- Retrieve from multiple views, then merge rankings rather than trusting a single embedding space.
- Keep graph search **bounded**; depth helps until it starts injecting noise.
- Treat long-video answering as evidence gathering over an explicit structure, not just prompt stuffing.

### 14. Final decision
Keep.

This is a solid systems paper with one genuinely reusable idea: represent long video as an event graph and answer hard queries by retrieving and traversing that structure. The “agentic” framing is a bit inflated, and the search stage is expensive enough that I would not oversell it as a deployable general solution yet. But as a reference for long-video indexing and retrieval design, it is absolutely worth having in Pocket Reads.
