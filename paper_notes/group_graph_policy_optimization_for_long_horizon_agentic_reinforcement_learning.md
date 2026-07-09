---
title: Group-Graph Policy Optimization for Long-Horizon Agentic Reinforcement Learning
slug: group-graph-policy-optimization-for-long-horizon-agentic-reinforcement-learning
authors: Yunan Wang, Minghui Song, Zihan Zhang, Shaohan Huang, Haizhen Huang, Furu Wei, Weiwei Deng, Feng Sun, Qi Zhang
year: 2026
venue: arXiv preprint (cs.LG, cs.AI, cs.CL)
date_read: 2026-07-09
paper_url: https://arxiv.org/abs/2606.22995
pdf_url: https://arxiv.org/pdf/2606.22995
verdict: Keep. This is a useful agent-RL credit-assignment paper, especially if we care about step-level training beyond isolated trajectories.
summary: G2PO argues that long-horizon agent RL should treat rollout data as a state-transition graph, not as disconnected linear trajectories. The method groups identical environment observations across sampled trajectories into state nodes, estimates each state value by averaging discounted returns across all visits, and treats actions as directed edges between state groups. It then combines episode-level GRPO-style advantage, local node-centric advantage, and globally standardized edge-centric TD-error advantage. On WebShop, ALFWorld, and AppWorld with Qwen2.5 models, G2PO beats PPO, RLOO, GRPO, and GiGPO, with headline gains over GRPO of +22.2 ALFWorld overall and +14.4 WebShop success at 1.5B, plus only about 1 second of advantage-computation overhead per training step. The central idea is strong: if multiple rollouts revisit the same state, use that graph structure to assign credit to transitions rather than letting final trajectory luck smear reward across every action.
why_it_matters: Agent RL is full of sparse terminal rewards and delayed credit. A good action can be followed by later failure, and a mediocre action can ride a later recovery to success. G2PO gives a concrete way to use repeated states across parallel rollouts as a cheap, critic-free credit-assignment signal. This is relevant to browser agents, shopping agents, embodied text environments, and API agents where repeated observations are common. The caution is that exact observation grouping may be brittle in messier real environments, the implementation is shown only in verl-agent, and the graph estimator assumes enough repeated states to make aggregation meaningful.
final_decision: Keep and cite for graph-based credit assignment in long-horizon agent RL. The reusable design is not the particular benchmark recipe, but the representation shift: reconstruct rollouts into a state graph, estimate state value from all visits, and reward transitions by global value gain. Do not cite it as a universal solution to agent RL; the paper still depends on benchmark-friendly observation grouping, rule-based terminal rewards, and simulated environments.
tags: agent-rl, reinforcement-learning, long-horizon-agents, credit-assignment, grpo, g2po, step-level-rl, state-transition-graphs, temporal-difference, webshop, alfworld, appworld, qwen2.5, verl-agent, sparse-reward, llm-agents
---

# Group-Graph Policy Optimization for Long-Horizon Agentic Reinforcement Learning

## Basic info

* Title: Group-Graph Policy Optimization for Long-Horizon Agentic Reinforcement Learning
* Authors: Yunan Wang, Minghui Song, Zihan Zhang, Shaohan Huang, Haizhen Huang, Furu Wei, Weiwei Deng, Feng Sun, Qi Zhang
* Year: 2026
* Venue / source: arXiv preprint (cs.LG, cs.AI, cs.CL)
* Link: https://arxiv.org/abs/2606.22995
* PDF: https://arxiv.org/pdf/2606.22995
* DOI: https://doi.org/10.48550/arXiv.2606.22995
* arXiv version inspected: v1, submitted 2026-06-22
* Date read: 2026-07-09
* Date surfaced: 2026-07-08
* Surfaced via: Tracy in #pocket-reads
* Code / repo: https://github.com/Nala-YN/G2PO
* Why selected in one sentence: It reframes long-horizon agent rollouts as a graph and uses that graph to assign step-level credit without a learned critic.

## Quick verdict

Keep. This is a useful agent-RL credit-assignment paper, especially if we care about step-level training beyond isolated trajectories.

The paper is trying to fix a real problem in group-based agent RL. GRPO-style methods are attractive because they avoid a learned critic, but sparse terminal rewards are a bad signal for multi-turn agents. If the agent makes one brilliant move, then fumbles later, trajectory-level reward punishes the brilliant move. If it makes a sloppy move but gets rescued later, the sloppy move can still get positive credit.

G2PO's move is to stop treating rollouts as independent strings. In interactive environments, different trajectories often revisit the same observation: the same page, room state, API state, or shopping result. Those repeated observations naturally form graph nodes, and actions are transitions between them. Once you have that graph, you can estimate state values from all visits and reward transitions that create real value jumps.

## One-paragraph overview

G2PO argues that long-horizon agent RL should treat rollout data as a state-transition graph, not as disconnected linear trajectories. The method groups identical environment observations across sampled trajectories into state nodes, estimates each state value by averaging discounted returns across all visits, and treats actions as directed edges between state groups. It then combines episode-level GRPO-style advantage, local node-centric advantage, and globally standardized edge-centric TD-error advantage. On WebShop, ALFWorld, and AppWorld with Qwen2.5 models, G2PO beats PPO, RLOO, GRPO, and GiGPO, with headline gains over GRPO of +22.2 ALFWorld overall and +14.4 WebShop success at 1.5B, plus only about 1 second of advantage-computation overhead per training step. The central idea is strong: if multiple rollouts revisit the same state, use that graph structure to assign credit to transitions rather than letting final trajectory luck smear reward across every action.

## What problem is the paper trying to solve?

Long-horizon agent RL has nasty delayed credit assignment.

In benchmarks like WebShop, ALFWorld, and AppWorld, the model does not get a clean reward after every action. It interacts with an environment for many turns, then receives a final reward when the task succeeds or fails. That creates two common errors:

* good early actions get punished because later actions fail;
* mediocre actions get rewarded because later actions recover.

Trajectory-level methods make this worse because every step in a rollout inherits too much of the final outcome. Step-level methods improve the training granularity, but the paper argues that existing approaches still treat each rollout as an isolated linear path.

That is the wrong shape. Multi-turn environments have repeated states. Different rollouts can reach the same observation and then diverge. A shopping agent may land on the same product page through different searches. An embodied agent may revisit the same room state. An API agent may see the same database result. Those repeated states should be evidence about the environment, not duplicated noise.

## Core idea

Turn the sampled trajectories into a graph.

For a task, sample multiple complete trajectories from the old policy. Then:

* group identical observations into state groups;
* treat state groups as graph nodes;
* treat actions as directed edges from one state group to the next;
* estimate each state group's value by averaging the discounted returns of all visits to that group;
* compute step advantages from both local alternatives and global value jumps.

This makes credit assignment less dependent on one lucky or unlucky future rollout. A state value becomes "how often this state leads to success across visits," not "what happened in this one trajectory."

## Method details

### 1. State group graph construction

Given sampled trajectories, G2PO collects all intermediate observations and partitions them by observation identity. In the main formalism, a state group is:

* all observations that exactly match a representative observation.

Those groups become nodes. If an action moves the agent from observation group `Gs` to observation group `Gt`, the graph gets an edge `(Gs, action, Gt)`.

This is the representation shift that everything else depends on. Once the rollouts become a graph, the method can compare actions and states across rollout boundaries.

### 2. Group-aggregation state-value estimation

For each visit to a state group, the paper computes a discounted return from the final trajectory reward:

* `v_j^i = gamma^(T-j+1) R_i`

Then it averages those values over all visits to the same state group:

* `V(G_k) = mean(v_j^i for visits in G_k)`

The intuition is simple: if multiple trajectories pass through the same state but end differently, the average is a better estimate of that state's intrinsic promise than any single sampled outcome.

The appendix gives the usual variance reduction argument: if the visits are independent and the group has size greater than one, averaging reduces value-estimation variance roughly linearly with group size.

### 3. Node-centric advantage

Node-centric advantage asks a local question:

* from this same state node, which outgoing action leads to a better next-state value than the other outgoing actions?

This is close to the GiGPO-style local comparison idea. It captures local action preferences, but the paper argues it is not enough because it cannot distinguish a tiny local improvement in a trivial state from a major global breakthrough.

### 4. Edge-centric advantage

Edge-centric advantage is the more novel part.

For an action that transitions from state group `G_k` to `G_k'`, compute the value jump:

* `delta = V(G_k') - V(G_k)`

This is structurally a 1-step TD error in sparse-reward settings. Then, instead of normalizing this delta only among actions from the same state, G2PO standardizes it against all transition deltas across the entire graph.

That makes the score global. A transition gets high advantage if it creates a large absolute jump toward success compared with all other transitions, even if the eventual trajectory later fails.

This is the paper's best idea. It says: do not only ask "was this action better than its sibling actions from the same node?" Also ask "was this transition one of the moves that actually changed the task state in a meaningful way?"

### 5. Episode-level advantage

G2PO still keeps the original episode-level GRPO-style advantage from final trajectory rewards. This prevents the step-level signal from wandering away from the terminal task objective.

The final advantage combines three pieces:

* episode-level advantage;
* node-centric step advantage;
* edge-centric step advantage.

A static weight `w` controls how much the step-level terms matter.

## Why this is not just GRPO with extra bookkeeping

GRPO normalizes final rewards across sampled outputs. That works better than a critic in many LLM post-training settings, but it still gives one coarse reward to a whole rollout.

G2PO changes the unit of evidence. It uses the fact that rollouts share intermediate states. The model is no longer only learning "this whole trajectory won" or "this whole trajectory lost." It can learn:

* this state tends to lead to success across visits;
* this transition reliably improves the state value;
* this action is locally good from this node;
* this episode still succeeded or failed overall.

That is a much better fit for long-horizon agents.

## Experiments

The paper evaluates on:

* WebShop: shopping/search/navigation in a simulated e-commerce environment.
* ALFWorld: text-based embodied household tasks derived from ALFRED/TextWorld.
* AppWorld: API/tool-use tasks over simulated apps and persistent state.

Base models:

* Qwen2.5-1.5B-Instruct and Qwen2.5-7B-Instruct for WebShop and ALFWorld.
* Qwen2.5-14B-Instruct for AppWorld.

Baselines:

* off-the-shelf prompting with larger models;
* Qwen2.5 direct prompting;
* ReAct;
* Reflexion;
* PPO with critic;
* RLOO;
* GRPO;
* GiGPO.

All RL methods use shared prompts and hyperparameters. Group-based methods use 16 groups of 8 rollouts, for 128 environments total.

## Main results

On Qwen2.5-1.5B:

* ALFWorld overall: GRPO 72.8, GiGPO 86.7, G2PO 95.0.
* WebShop score: GRPO 75.8, GiGPO 83.5, G2PO 85.1.
* WebShop success: GRPO 56.8, GiGPO 67.4, G2PO 71.2.

The paper reports G2PO gains over GRPO of:

* +22.2 on ALFWorld overall;
* +9.3 on WebShop score;
* +14.4 on WebShop success.

On Qwen2.5-7B:

* ALFWorld overall: GRPO 77.6, GiGPO 90.8, G2PO 96.9.
* WebShop score: GRPO 79.3, GiGPO 86.2, G2PO 89.8.
* WebShop success: GRPO 66.1, GiGPO 75.2, G2PO 78.3.

The reported gains over GRPO are:

* +19.3 on ALFWorld overall;
* +10.5 on WebShop score;
* +12.2 on WebShop success.

On AppWorld with Qwen2.5-14B:

* ReAct: 10.5 success, 8.0 score.
* PPO: 19.1 success, 14.7 score.
* RLOO: 24.8 success, 19.5 score.
* GiGPO: 25.7 success, 19.2 score.
* GRPO: 24.8 success, 20.7 score.
* G2PO: 27.6 success, 21.7 score.

The AppWorld gains are smaller but directionally consistent. That matters because AppWorld observations are API returns rather than cleaner household or webshop states.

## Ablations

The ablation builds from episode-level advantage, then adds:

* node-centric advantage;
* group-aggregation state-value estimation;
* edge-centric advantage.

The paper reports that group aggregation gives substantial gains, especially by reducing value-estimation variance over repeated states. Adding edge-centric advantage beats node-centric-only training, supporting the claim that global transition value is doing work beyond local action comparison.

The hyperparameter analysis is also useful. If the step-level weight `w` is too low, the method degenerates toward GRPO and loses fine-grained credit assignment. If `w` is too high, the method becomes too short-sighted and can drift away from the final task objective. The best WebShop setting in the paper is around `w = 0.8`, while the appendix says they use `w = 1` in the main benchmark settings.

## Efficiency

The overhead story is attractive.

G2PO does its graph construction and advantage estimation on CPU. In the reported ALFWorld timing with Qwen2.5-1.5B, the rollout step takes about 189 seconds, policy update about 56 seconds, old/ref probability computation about 10-11 seconds each, and G2PO advantage computation adds about 1 second.

The paper frames that as about 0.4% of total RL training time. If accurate, that is a good trade: better credit assignment without adding a learned critic, process reward model, or heavy verifier.

The trained models also finish tasks in fewer environment turns than GRPO and usually fewer than GiGPO, which means the training method can reduce inference-time environment/API cost too.

## Strengths

* The representation shift is strong: long-horizon rollouts really do have graph structure.
* The method attacks sparse terminal reward without requiring process labels or a learned critic.
* Grouping repeated observations is a cheap source of extra signal.
* Edge-centric advantage captures globally important transitions, not only local alternatives.
* The experiments cover three different interactive benchmark styles: web shopping, embodied text environments, and API/app worlds.
* The gains over GRPO and GiGPO are large on WebShop and ALFWorld.
* The compute overhead is tiny relative to rollout and policy update time.
* The method is easy to explain and probably easy to bolt onto existing step-level RL pipelines.

## Weaknesses and caveats

The state grouping assumption is doing a lot of work. The method groups identical observations in the formal construction. That is plausible in benchmark environments, but real browser, desktop, coding, and API agents often see noisy observations with timestamps, irrelevant diffs, personalized content, or large text blobs. Exact matching may under-group; aggressive fuzzy grouping may merge states that are not actually equivalent.

The method is evaluated only inside the `verl-agent` framework. The limitations section says more agentic RL frameworks are needed. That is a real limitation because rollout format and observation normalization can strongly affect graph construction.

The benchmarks are still simulated or controlled. WebShop, ALFWorld, and AppWorld are much better than static QA, but they are not open-ended production agents.

The reward setup is rule-based and sparse. That is appropriate for the paper, but it avoids messy human preference signals, partial-credit rubrics, or ambiguous task completion.

The AppWorld gain is modest. G2PO is best there, but the margin over GiGPO/GRPO is small compared with the WebShop and ALFWorld jumps. That hints that graph grouping is harder or less informative when observations are complex API returns.

The theoretical variance argument rests on simplifying assumptions: independent samples, group sizes above one, and positive covariance between source and target group values. It is useful intuition, not a full guarantee in messy agent rollouts.

The paper does not deeply test tree sampling or asynchronous rollout settings, and it explicitly lists those as future work.

## What I would steal

The design pattern is very reusable:

1. Do not throw away cross-rollout repeated states.
2. Canonicalize observations into state IDs.
3. Build a transition graph from sampled rollouts.
4. Estimate state values from all visits.
5. Score actions by value change across graph edges.
6. Normalize some credit signal globally, not only within local sibling actions.
7. Keep a terminal objective term so step-level optimization does not become myopic.

For coding agents, this suggests an obvious variant:

* group states by normalized test failures, git diff summaries, command outputs, or issue state;
* treat edits/commands as transitions;
* identify transitions that move from failing-state clusters to passing-state clusters;
* avoid punishing a good patch just because a later patch broke something.

That would be more principled than treating each whole coding attempt as a monolithic win/loss trajectory.

## Open questions

The biggest question is state canonicalization. The paper's results depend on repeated observations being recognizable. In richer environments, the hard part will be deciding when two observations are the same state for credit-assignment purposes.

Other open questions:

* How does G2PO behave when state groups are sparse and most nodes have size one?
* Can learned or embedding-based grouping help without merging semantically different states?
* Does graph-based credit assignment still help with noisy learned reward models?
* Can this be combined with process reward models instead of replacing them?
* How well does it work for tree-search rollouts, asynchronous sampling, or self-correction loops?
* Can graph credit assignment expose failure modes, not just improve training?

## Final take

G2PO is worth keeping because it gets the shape of the data right. Long-horizon agent exploration is not a bag of isolated strings. It is a partially observed graph of states and transitions sampled by a policy. Once that graph is visible, a lot of credit-assignment machinery becomes cleaner.

The paper is not a universal agent-RL answer. Its state grouping is benchmark-friendly, its rewards are rule-based, and its implementation scope is narrow. But the core idea is exactly the kind of practical RL scaffolding likely to matter for agents: reuse repeated states, score transitions by actual progress, and stop letting final trajectory luck smear credit across every action.
