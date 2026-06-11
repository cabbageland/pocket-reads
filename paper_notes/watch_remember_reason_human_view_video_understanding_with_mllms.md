# Watch, Remember, Reason: Human-View Video Understanding with MLLMs

## Basic info

* Title: Watch, Remember, Reason: Human-View Video Understanding with MLLMs
* Authors: Jiahao Meng, Yue Tan, Qi Xu, Kuan Gao, Weisong Liu, Yanwei Li, Jason Li, Lingdong Kong, Haochen Wang, Qianyu Zhou, Jiangning Zhang, Guangliang Cheng, Yunhai Tong, Lu Qi, Minghsuan Yang
* Year: 2026
* Venue / source: arXiv preprint
* Link: https://arxiv.org/abs/2606.07433
* PDF: https://arxiv.org/pdf/2606.07433
* HTML: https://arxiv.org/html/2606.07433v1
* Related works: https://github.com/marinero4972/Awesome-HumanView-VideoUnderstanding
* Date read: 2026-06-10
* Date surfaced: 2026-06-09
* Surfaced via: Tracy in #pocket-reads via alphaXiv link
* Why selected in one sentence: It gives a clean organizing map for long-video MLLMs around evidence acquisition, memory, and grounded reasoning, which is directly useful for comparing the current flood of video-agent and streaming-memory papers.

## Quick verdict

* Highly relevant as a map, not as a result paper

This is a survey paper, so the useful question is not "does the method work?" but "does the taxonomy sharpen the field?" Mostly, yes. The watch-remember-reason frame is simple, but it catches the real pressure point in long-video MLLMs: the system must decide what evidence to inspect, what to keep, and how to produce an answer that is actually grounded in the video rather than just narrated confidently. The paper is strongest as a map of methods and datasets. It is weaker as critique, because it catalogs far more than it discriminates. Still worth keeping because it gives good vocabulary for separating efficient perception, structured memory, streaming state, and evidence-grounded reasoning instead of throwing all of that into one vague "long video agent" bucket.

## One-paragraph overview

This survey argues that modern video MLLMs should be understood through three functional abilities: **watching**, **remembering**, and **reasoning**. Watching covers how a model extracts task-relevant evidence from video, audio, subtitles, captions, frames, regions, and timestamps. Remembering covers how it preserves useful information across long or streaming inputs, including offline memory banks, event graphs, hierarchical summaries, KV-cache compression, and streaming memory. Reasoning covers how it combines perceived and remembered evidence into answers, either through text-only reasoning traces or through "thinking with videos" systems that revisit frames, timestamps, or spatial regions during inference. The paper formalizes this as a pipeline from perceptual representations to memory states to reasoning traces to final predictions, then surveys representative methods, application subfields, training datasets, benchmarks, and future directions. Its central value is not novelty in a model, but a reasonably coherent map of a messy, fast-moving area.

## Framework definition

### Inputs
- video frames `V`
- audio `A`
- optional aligned text `T`, such as subtitles, ASR, or captions
- a query `q`

### Outputs
- a textual answer, temporal segment, spatial region, grounded explanation, or some combination of those

### Core decomposition
The survey decomposes video understanding into:
- **watching**: extract query-relevant multimodal evidence `Z`
- **remembering**: maintain memory states `M` over time
- **reasoning**: generate a reasoning trace `R` from evidence and memory
- **output**: produce the final answer from `Z`, `M`, `R`, and `q`

That abstraction is broad enough to cover plain video QA, temporal grounding, region grounding, captioning, long-video retrieval, streaming assistants, and tool-using video agents.

### Training objective
There is no new training objective because this is a survey. The paper reviews common training and post-training paradigms:
- supervised fine-tuning for video-language instruction following
- CoT-style supervised data for video reasoning
- GRPO and related RL-style post-training for verifiable temporal or spatial rewards
- preference optimization / verifier-guided filtering for grounded reasoning quality

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
The paper is trying to solve an intellectual organization problem in long-video MLLMs.

The field has too many overlapping names for related things:
- long-video understanding
- streaming video understanding
- video memory
- video agents
- video RAG
- temporal grounding
- thinking with videos
- video reasoning
- omni-modal video interaction

The authors argue that these are not isolated tasks. They are different slices of a single functional problem:

**How does a model acquire evidence, keep the right parts of it, and reason from it faithfully?**

That is a useful reframing. Long videos are full of redundant frames, sparse decisive evidence, asynchronous audio/visual/text signals, distant dependencies, and compute limits. "Just sample more frames" does not solve that. Neither does "add memory" if the memory loses the rare clue or retrieves the wrong episode.

### 2. What is the method?
There is no method in the normal model-paper sense. The "method" is a taxonomy and survey structure.

The paper splits the landscape into:

**Watching**
- fine-grained watching: timestamp grounding, spatial grounding, video referring, boxes/masks
- comprehensive watching: whole-video, dense, and region-level captioning
- audio-visual watching: omni-modal models that align vision, audio, speech, and language
- efficient watching: frame selection, token compression, KV-cache sparsification, long-context attention

**Remembering**
- offline memory: memory banks, summaries, hierarchical memory, event memory, graph memory
- agentic memory: LLM/VLM systems that call retrieval or memory tools over multiple turns
- non-agentic memory: deterministic compression/retrieval pipelines
- streaming memory: rolling state, bounded KV caches, hierarchical stream memory, constant-memory streaming

**Reasoning**
- text-only reasoning: CoT-style intermediate traces without explicit visual reinspection
- thinking with videos: tool-use or structured-output systems that ground reasoning in frames, timestamps, crops, boxes, or segments
- agentic reasoning: iterative search, retrieval, verification, re-querying, and tool calling
- non-agentic reasoning: SFT/RL-trained models with grounded reasoning outputs

### 3. What is the method motivation?
The motivation is solid: video understanding is an evidence-management problem.

For short clips, a model can often get away with uniform sampling and one-pass answer generation. For long, streaming, or knowledge-intensive videos, that falls apart. The model needs to:
- notice brief but decisive evidence,
- preserve relevant facts across time,
- avoid drowning in redundant visual tokens,
- recover old evidence when needed,
- align speech, sound, text, and visual events,
- and show evidence for its answer.

The human analogy is not deep cognitive science, but it is a good engineering mnemonic. Humans do not inspect every frame uniformly either. We watch selectively, remember salient events, and reason by revisiting or linking evidence.

### 4. What data does it cover?
The paper has a large dataset and benchmark survey.

Training data categories include:
- **Video QA**: VideoChat2-IT, LLaVA-Video-178K, VideoCoT, VideoEspresso, Video-R1, VideoRFT, LongVideo-Reason, STGR, ReWatch-CoT, VideoZoomer, VideoSIAH, Conan, Seeker-173K, LongVideo-R1
- **Video captioning**: Panda-70M, ShareGPT4Video, Video ReCap, Vript, MiraData, FineVideo, Tarsier2-Recap-585K, UltraVideo, HMD-270K, TimeChatCap-42K
- **Video temporal grounding**: TimeIT, VTimeLLM data, VTG-IT-120K, E.T. Instruct, TimePro, Moment-10M, Vid-Morp, VideoITG, TimeLens-100K, MTVR
- **Long-video memory**: VideoMarathon, M3-Agent

This is one of the more practically useful parts of the paper because it helps distinguish ordinary video-instruction data from data that actually supervises temporal grounding, rewatching, tool use, or memory.

### 5. How is it evaluated?
The survey itself is not experimentally evaluated.

Instead, it organizes benchmark families:
- general video understanding, such as Video-MME and MMBench-Video
- temporal and spatial understanding, such as MVBench, TempCompass, TOMATO, E.T. Bench, TUNA, TimeLens, OMTG, MotionBench, DSI-Bench, STI-Bench
- complex reasoning, such as V-STaR, MINERVA, VideoTT, MMR-V, SEED-Bench-R1, VideoReasonBench, VideoZeroBench
- long-context and streaming understanding, such as MLVU, LongVideoBench, LVBench, and related long-video benchmarks

The implicit evaluation claim is that current benchmarks are fragmenting around capability dimensions, and that future benchmarks need to test not only answer correctness but evidence quality, temporal/spatial grounding, memory retention, and streaming behavior.

### 6. What are the main results?
There are no headline accuracy numbers because this is a survey. The main "result" is a field map.

The important synthesis points are:
- video MLLMs are moving from uniform sampling toward adaptive, query-aware observation
- timestamp and spatial grounding are becoming native generation behaviors, not just external detection heads
- memory systems are shifting from dense token retention to hierarchical, event-based, graph-based, or streaming memory
- "reasoning" is splitting into weaker text-only CoT and stronger evidence-grounded reinspection
- RL is showing up where rewards can be made verifiable, especially temporal IoU, bounding boxes, and grounded evidence quality
- long-video systems increasingly look like retrieval and state-management systems, not just bigger context windows

### 7. What is actually novel?
The novelty is not any individual technique. It is the integrated taxonomy.

The most useful move is separating:
- **watching** from **remembering**: selecting/compressing evidence is not the same as storing and retrieving it
- **remembering** from **reasoning**: a good memory store does not guarantee good inference
- **text-only reasoning** from **thinking with videos**: a chain of text is not automatically grounded in visual evidence
- **offline memory** from **streaming memory**: processing an uploaded long video is not the same problem as maintaining state in a live stream

That sounds basic, but the field badly needs this separation. Too many papers call themselves "memory" or "agentic" while actually solving only frame selection, retrieval, caption indexing, or answer generation.

### 8. What are the strengths?
- The taxonomy is simple enough to remember and broad enough to cover most current video-MLLM work.
- The paper does a good job separating efficient perception, memory construction, streaming state, and grounded reasoning.
- The tables are useful as a paper-finding map.
- The survey includes newer directions like verifiable RL, thinking-with-videos, multi-segment grounding, and streaming egocentric assistants.
- The future directions are aligned with real bottlenecks: spatial reasoning, multi-video grounding, hour-scale memory, efficient/verifiable reasoning, and streaming egocentric state.
- It connects well to other Pocket Reads notes: SimpleStream is basically a warning inside the "efficient watching / streaming memory" story, while AVA-style event-graph systems live in the "remember + reason" intersection.

### 9. What are the weaknesses, limitations, or red flags?
The biggest weakness is that the survey is more catalog than critique.

It tells you where methods fit, but it rarely says which claims are inflated, which comparisons are unfair, which benchmarks are overfit, or which design patterns are mostly branding. For a fast-moving area full of "agentic" and "o3-like" names, that is a missed opportunity.

Other caveats:
- The "human-view" framing is useful but also rhetorically soft; it does not constrain system design very much.
- The taxonomy can hide interactions. In real systems, watching, memory, and reasoning are often tightly coupled, not clean pipeline stages.
- The paper covers many methods at shallow depth. It is better as an index than as a deep technical guide.
- There is little quantitative synthesis across methods, compute budgets, benchmarks, or backbone choices.
- The future-work section is sensible but somewhat obvious if you already follow long-video MLLMs.

### 10. What challenges or open problems remain?
The open problems that matter most:

- **spatial reasoning**: models still struggle with fine-grained object location, tracking, physical layout, and geometry across frames
- **multi-video / multi-segment grounding**: real use cases involve compilations, repeated events, edits, replays, and multiple timelines
- **hour-scale memory**: systems need to keep rare decisive moments without summary drift or retrieval brittleness
- **budgeted evidence search**: models should inspect only enough video to answer faithfully, then provide compact evidence
- **streaming egocentric state**: assistants need online memory, task state, timing, and safe intervention rather than static QA

The meta-problem is evaluation. A system should not get full credit for a correct answer if it cannot identify the evidence that supports it.

### 11. What future work naturally follows?
- Build video systems around **evidence pointers**: timestamps, boxes, crops, frames, subtitles, event IDs, and memory records.
- Evaluate memory modules against strong recency-only and retrieval-only baselines.
- Train grounded reasoning with rewards that combine answer correctness, evidence alignment, and evidence compactness.
- Use multi-level memory: recent fine-grained buffer, event memory, and entity/relation memory.
- Treat streaming video assistants as stateful systems with goals and timing, not as repeated independent QA calls.
- Develop benchmarks where hallucinated reasoning traces are penalized even when the final answer is lucky.

### 12. Why does this matter?
Because long-video MLLMs are where a lot of sloppy vocabulary goes to multiply.

One paper says "memory" and means KV-cache pruning. Another says "memory" and means a vector store of captions. Another says "agent" and means a prompted loop over frame retrieval. Another says "reasoning" and means a long text trace that may or may not look at the video again.

This survey gives a cleaner set of drawers:
- watching is evidence acquisition,
- remembering is state and storage,
- reasoning is inference over evidence,
- faithful video intelligence needs all three.

That makes it a useful reference when deciding whether a new video paper is actually advancing the stack or just renaming a piece of it.

## Why It Matters

This matters because the long-video MLLM stack is becoming a systems problem, not just a bigger-model problem. A useful video assistant needs evidence selection, state, retrieval, and grounded reasoning to cooperate under a budget. This survey gives a clean vocabulary for checking which part of that stack a paper actually improves.

### 13. What ideas are steal-worthy?
- Use watch/remember/reason as a quick checklist for evaluating any long-video system.
- Ask what the system stores as evidence: frames, tokens, captions, events, entities, graphs, KV states, or tool traces.
- Separate recent-scene perception from long-term memory in evaluation.
- Require grounded outputs for video reasoning: timestamps, bounding boxes, key frames, or event IDs.
- Think of long-video understanding as budgeted evidence search rather than context-window worship.
- For practical systems, design memory around event records with pointers back to raw evidence.

## Final Decision

Keep. This is not a paper to cite for a breakthrough model, but it is a good field map and a useful vocabulary reset. Use it when comparing video-agent, streaming-memory, and long-video reasoning papers, especially when the marketing is fuzzier than the actual mechanism.
