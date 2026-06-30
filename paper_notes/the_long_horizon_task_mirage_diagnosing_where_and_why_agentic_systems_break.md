---
title: The Long-Horizon Task Mirage? Diagnosing Where and Why Agentic Systems Break
slug: the-long-horizon-task-mirage-diagnosing-where-and-why-agentic-systems-break
authors: Xinyu Jessica Wang, Haoyue Bai, Yiyou Sun, Haorui Wang, Shuibai Zhang, Wenjie Hu, Mya Schroder, Bilge Mutlu, Dawn Song, Robert D. Nowak
year: 2026
venue: arXiv preprint (cs.AI)
date_read: 2026-06-29
paper_url: https://arxiv.org/abs/2604.11978
pdf_url: https://arxiv.org/pdf/2604.11978
verdict: Useful diagnostic, early benchmark
summary: HORIZON is a cross-domain diagnostic benchmark for long-horizon LLM-agent failure. Instead of treating horizon as raw interaction length, the paper defines agent-independent task structure through intrinsic horizon and compositional depth, then constructs controlled task families across Web, OS, Database, and Embodied domains. It evaluates frontier model families over 3100+ trajectories and uses a seven-category failure taxonomy, grounded in FMEA, to label where breakdowns occur. The strongest contribution is not a new agent method; it is a measurement frame: long-horizon failure is a structural shift in failure composition, with planning errors, memory limitations, catastrophic forgetting, environment disturbance, and history error accumulation becoming more visible as task horizon grows.
why_it_matters: This is exactly the kind of benchmark paper agent builders need if they want to stop laundering long-horizon weakness into a single success-rate number. It separates the intrinsic task horizon from the agent's inefficient wandering, and it asks why a trajectory failed, not merely whether the terminal answer was wrong. The OpenClaw mapping section is also useful because it connects the taxonomy to real agent incidents instead of staying inside toy benchmarks.
final_decision: Keep, with caveats. Cite it for HORIZON's horizon-aware task construction, the seven-category failure taxonomy, and the claim that long-horizon agent collapse is a shift in failure modes, not just a lower accuracy curve. Do not treat the current empirical numbers as settled leaderboard truth: the benchmark is explicitly initial, the paper has some internal model-label/count inconsistencies, and LLM-as-a-judge failure attribution still needs continued human audit.
tags: llm-agents, long-horizon, agent-evaluation, horizon, benchmark, failure-analysis, openclaw, web-agents, os-agents, database-agents, embodied-agents, llm-as-a-judge, memory, planning, agent-reliability
---

# The Long-Horizon Task Mirage? Diagnosing Where and Why Agentic Systems Break

## Basic info

* Title: The Long-Horizon Task Mirage? Diagnosing Where and Why Agentic Systems Break
* Authors: Xinyu Jessica Wang, Haoyue Bai, Yiyou Sun, Haorui Wang, Shuibai Zhang, Wenjie Hu, Mya Schroder, Bilge Mutlu, Dawn Song, Robert D. Nowak
* Year: 2026
* Venue / source: arXiv preprint (cs.AI)
* Link: https://arxiv.org/abs/2604.11978
* PDF: https://arxiv.org/pdf/2604.11978
* HTML: https://arxiv.org/html/2604.11978v1
* Project page: https://xwang2775.github.io/horizon-leaderboard/
* Dataset: https://huggingface.co/datasets/xwang2775/horizon-tasks
* arXiv version inspected: v1, submitted 2026-04-13
* Date read: 2026-06-29
* Date surfaced: 2026-06-29 (via Tracy)
* Why selected in one sentence: It is a benchmark/diagnostic paper about exactly the failure regime real agents keep falling into: extended, dependent workflows where success-rate-only evals hide the actual pathology.

## Quick verdict

Useful diagnostic, early benchmark

This is a keep. HORIZON is useful because it tries to make long-horizon agent failure measurable instead of vibes-based. The paper's best move is separating intrinsic task horizon from the number of bumbling steps an agent happens to take. If an agent loops 50 times on a short task, that is not a long-horizon success or failure; it is a short-horizon task with bad execution. The taxonomy is also practical. It gives names to failures that show up constantly in real agents: environment disturbance, instruction misunderstanding, false assumptions, planning error, catastrophic forgetting, history error accumulation, and memory limitation. The caveat: this is an initial benchmark, and the paper has a few internal reporting inconsistencies, so the framework matters more than any single leaderboard number.

## One-paragraph overview

The paper introduces HORIZON, a diagnostic benchmark for studying where and why LLM agents break as task horizons increase. It defines horizon through task structure rather than raw interaction count, using intrinsic horizon and compositional depth, then constructs controlled task extensions across four domains: Web, OS, Database, and Embodied. The authors evaluate frontier model families on 3100+ trajectories, then classify failed trajectories with a seven-category taxonomy grounded in Failure Mode and Effects Analysis. They also propose a trajectory-grounded LLM-as-a-judge pipeline for scalable failure attribution, reporting inter-annotator kappa = 0.61 and human-judge kappa = 0.84 on a 40-trajectory validation set. The headline conclusion is that long-horizon degradation is not just a lower success rate; the mix of failures changes as horizons grow, with planning and memory-related failures becoming central.

## What problem is the paper trying to solve?

Agent benchmarks usually report terminal success. That is too blunt for long-horizon systems.

If an agent fails a 60-step workflow, success rate alone does not say whether the agent:

* misunderstood the instruction,
* picked a bad subplan,
* acted on a stale webpage,
* forgot an early constraint,
* carried forward a bad intermediate result,
* ran out of useful context,
* or made a false assumption and never checked it.

Those failures need different fixes. HORIZON tries to make the failure type visible and to compare failures across domains without pretending that "number of tool calls" is a universal horizon measure.

## How does HORIZON define long horizon?

The paper distinguishes task horizon from agent inefficiency.

Intrinsic horizon, H*, is the minimum number of effective actions required by an optimal policy to complete the task. This is defined from task structure, expert demonstrations, oracle solvers, or formal specs.

Compositional depth measures nested subgoals or conditional branches. A purely sequential task has low depth; a task with conditional plans and merged subgoals has higher depth.

The benchmark then grows tasks with two extension methods:

* Depth extension inserts non-skippable intermediate steps, useful for OS and Database tasks.
* Breadth extension combines independent baseline tasks into one composite workflow, useful for Web and Embodied tasks where multiple goals must be maintained.

This is the right instinct. A task is not long-horizon because an agent flails. It is long-horizon because a correct solution genuinely needs extended dependent execution.

## What domains do they test?

The paper uses four domains:

* Web Navigation, based on WebArena.
* Operating Systems, based on AgentBench shell tasks.
* Database, based on MAC-SQL with Selector, Decomposer, and Refiner components.
* Embodied, a bimanual IsaacSim 5.0 environment with two Franka Panda arms, Tesollo grippers, three cubes, and four action primitives.

The project page presents this as a leaderboard and task-contribution setup, with the dataset on Hugging Face.

## What is the failure taxonomy?

The seven categories are:

* Environment Error: external state changes, page load issues, schema drift, stochasticity, or missed environment changes.
* Instruction Error: ambiguous, underspecified, or partially understood instructions.
* False Assumption: hallucinated facts, unverified priors, or incorrect beliefs about state.
* Planning Error: wrong subplan, missing prerequisite, bad action order, or incorrect low-level action.
* Catastrophic Forgetting: earlier constraints or learned information stop influencing later behavior.
* History Error Accumulation: small earlier mistakes become treated as true and compound downstream.
* Memory Limitation: relevant state falls out of context, retrieval, or summaries.

The paper frames these as not strictly mutually exclusive. That is good. Real failures are usually layered. A planning error may be downstream of forgetting; a false assumption may be downstream of an environment observation miss.

## What are the main performance results?

The main plot shows success rate versus extension level across Web, OS, Database, and Embodied tasks. The reported pattern is consistent:

* performance does not decline smoothly;
* it often stays tolerable for short/mid horizons, then collapses sharply;
* collapse happens at different extension levels in different domains;
* after the breaking region, model differences narrow because everyone is failing.

The appendix reports 3,132 trajectories total: 1,137 successes and 1,995 failures, for an overall success rate of 36.3%.

Domain success rates reported there:

* Web: 24.1% (185/767).
* OS: 40.3% (864/2,146).
* Database: 36.9% (31/84).
* Embodied: 42.2% (57/135).

The authors describe these as an initial empirical study, not a final universal benchmark.

## What failure modes dominate?

The appendix failure distribution is the most useful empirical part.

By domain:

* Web failures are mostly Planning Error (74.9%), with Environment (11.3%) and Memory Limitation (6.2%) also visible.
* OS failures are more mixed: Planning Error (36.7%), Instruction (25.9%), Environment (17.3%), and Memory Limitation (15.1%).
* Database failures are dominated by Planning Error (79.3%), with False Assumption a secondary issue.
* Embodied failures are almost entirely Planning Error (94.9%).

By model, the appendix text reports GPT-5-mini at 33.4% success and Claude-4-Sonnet at 39.9% success, but one figure caption names GPT-4o-mini and Claude 3.5 Sonnet instead. Treat that as a paper consistency issue. The qualitative point remains: the models show different failure profiles. The text says GPT failures are more dominated by Planning Error and Memory Limitation, while Claude failures show more Environment and Instruction issues.

## What about the LLM-as-a-judge pipeline?

The paper uses trajectory-grounded LLM judging to scale failure annotation.

The pipeline:

* collects traces and context,
* builds the taxonomy,
* calibrates the judge against human annotation,
* labels failures at scale.

They validate on 40 trajectories, reporting:

* inter-annotator agreement: kappa = 0.61,
* human-judge agreement: kappa = 0.84.

That is encouraging, especially for a diagnostic workflow. It is not enough to eliminate human audit. Failure labels are interpretive, multi-causal, and sensitive to what trace information is shown to the judge.

## Why is the OpenClaw section interesting?

The paper has a "Real-World Mapping: OpenClaw" section that maps reported OpenClaw-style incidents onto the taxonomy.

Examples include:

* concurrent file modification as environment disturbance,
* "share" versus "forward" sensitive email behavior as instruction error,
* two agents relaying messages indefinitely as planning error,
* a long-running agent eventually violating an early external-domain constraint as catastrophic forgetting,
* spoofed identity as false assumption,
* emotional pressure gradually shifting a refusal boundary as history error accumulation,
* attachment accumulation causing storage exhaustion as memory limitation.

This section matters because it keeps the benchmark from becoming purely synthetic. The examples are conceptual and preliminary, but they make the taxonomy feel relevant to actual agent operations.

## Strengths

The horizon definition is much better than raw step count. It avoids confusing task difficulty with agent thrashing.

The failure taxonomy is pragmatic. It maps onto interventions: better environment revalidation, instruction clarification, plan verification, memory systems, constraint tracking, and rollback/recovery.

The paper emphasizes performance curves and failure transitions rather than one terminal success number.

The OpenClaw mapping is unusually relevant for real agent deployment and for this workspace.

The project page and dataset make the benchmark more inspectable than a closed set of claims.

## Weaknesses and caveats

This is explicitly an initial benchmark. Coverage across domains is uneven: the appendix reports far more OS trajectories than Database or Embodied trajectories.

The paper has internal reporting inconsistencies. The main text says GPT-5-mini and Claude-4-Sonnet, while an appendix figure caption says GPT-4o-mini and Claude 3.5 Sonnet. Another process/design risk percentage appears inconsistent between a figure label and caption. These do not destroy the conceptual contribution, but they do mean the exact empirical numbers should be handled carefully.

The LLM-as-a-judge approach is useful but not self-certifying. Multi-causal failures can be hard to label, and the taxonomy is not mutually exclusive.

HORIZON measures constructed task families. That is good for control, but real deployments have messier user intents, hidden side effects, changing environments, and social attacks.

The paper diagnoses more than it prescribes. It says planning and memory failures dominate, but it does not provide a full agent architecture that fixes them.

## Why It Matters

This paper is a welcome antidote to agent benchmark slop. Long-horizon reliability is not one scalar. It is a curve over increasing task structure plus a distribution over failure causes. Without both, a benchmark can tell you that an agent failed while hiding the reason the system is actually unsafe or brittle.

For builders, the takeaway is concrete: add environment revalidation, explicit constraint tracking, hierarchical subplanning, execution-time plan verification, rollback/repair, and memory mechanisms that resurface old constraints at the moment they matter.

## Final Decision

Keep. Cite HORIZON for horizon-aware agent evaluation, the seven-category failure taxonomy, and the claim that long-horizon collapse is a structural shift in failure composition. The OpenClaw mapping makes it especially relevant. Keep the caveat attached: this is an early diagnostic benchmark with some paper-internal inconsistencies, so it is a strong lens and task-construction recipe, not settled truth about model rankings.
