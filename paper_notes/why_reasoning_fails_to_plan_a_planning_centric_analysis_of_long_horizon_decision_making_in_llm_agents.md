---
title: Why Reasoning Fails to Plan: A Planning-Centric Analysis of Long-Horizon Decision Making in LLM Agents
slug: why-reasoning-fails-to-plan-a-planning-centric-analysis-of-long-horizon-decision-making-in-llm-agents
authors: Zehong Wang, Fang Wu, Hongru Wang, Xiangru Tang, Bolian Li, Zhenfei Yin, Yijun Ma, Yiyang Li, Weixiang Sun, Xiusi Chen, Yanfang Ye
year: 2026
venue: arXiv preprint (cs.AI, cs.CL, cs.LG)
date_read: 2026-06-29
paper_url: https://arxiv.org/abs/2601.22311
pdf_url: https://arxiv.org/pdf/2601.22311
verdict: Strong framing, controlled evidence
summary: This paper argues that chain-of-thought style LLM agents fail at long-horizon decision making because step-by-step reasoning behaves like a locally greedy policy, not like planning. The authors isolate the issue in deterministic, structured environments with explicit transitions and evaluation signals, mainly knowledge-graph question answering plus ALFWorld tool-use. Their diagnosis is that local step scores cause early myopic commitments; beam search widens the search but can still amplify those local scores and prune the globally good prefix. They introduce FLARE, an MCTS-like future-aware planner with explicit lookahead, trajectory-level value propagation, trajectory memory, action pruning, and receding-horizon commitment. Across CWQ, WebQSP, GrailQA, and ALFWorld, FLARE improves both task accuracy and mechanism-level metrics such as first-step trap selection, first-error position, and recovery after the first error.
why_it_matters: The paper is useful because it names a real agent-design confusion: better reasoning traces are not the same thing as planning. If an agent commits to actions using local plausibility, then more fluent rationales or wider beam search may still chase the wrong branch. The reusable lesson is architectural: long-horizon agents need explicit future evaluation, backward value propagation, and limited commitment.
final_decision: Keep. Cite it for the distinction between reasoning and planning, for the myopic-commitment failure mode, and for the mechanism-level evaluation of agent planning. Do not overclaim it as proof about all LLM agents in the wild: the main evidence uses controlled deterministic settings with explicit transitions and planning-time evaluators, and FLARE still depends on candidate simulation, evaluator quality, and extra test-time compute.
tags: llm-agents, planning, reasoning, chain-of-thought, long-horizon, mcts, flare, agent-evaluation, kgqa, alfworld, tool-use, decision-making, beam-search, receding-horizon-control
---

# Why Reasoning Fails to Plan: A Planning-Centric Analysis of Long-Horizon Decision Making in LLM Agents

## Basic info

* Title: Why Reasoning Fails to Plan: A Planning-Centric Analysis of Long-Horizon Decision Making in LLM Agents
* Authors: Zehong Wang, Fang Wu, Hongru Wang, Xiangru Tang, Bolian Li, Zhenfei Yin, Yijun Ma, Yiyang Li, Weixiang Sun, Xiusi Chen, Yanfang Ye
* Year: 2026
* Venue / source: arXiv preprint (cs.AI, cs.CL, cs.LG)
* Link: https://arxiv.org/abs/2601.22311
* PDF: https://arxiv.org/pdf/2601.22311
* DOI: https://doi.org/10.48550/arXiv.2601.22311
* arXiv version inspected: v1, submitted 2026-01-29
* Date read: 2026-06-29
* Date surfaced: 2026-06-29 (via Tracy)
* Why selected in one sentence: It gives a clean planning-theoretic account of why step-by-step LLM agents can sound reasonable while still making bad long-horizon decisions.

## Quick verdict

Strong framing, controlled evidence

This is worth keeping because the framing is sharp: reasoning is not planning. The paper formalizes a familiar agent failure mode as a locally greedy policy problem. If the agent chooses each next action by local plausibility, then the early action that sounds best may be exactly the action that destroys the long-term plan. The proposed FLARE mechanism is not algorithmically shocking, but it is the right minimal package: look ahead, evaluate trajectories, propagate values backward, and commit only to the next action. The caveat is equally important. The cleanest results are in explicit, deterministic, structured environments, so this is not proof that FLARE-style planning solves open-ended agent work.

## One-paragraph overview

The paper studies why LLM agents with strong step-by-step reasoning often fail in long-horizon tasks. The authors model ordinary reasoning-based policies as step-wise greedy decision rules: at each state, the agent selects the action with the best local score. In controlled settings with explicit states, known transitions, and planning-time evaluators, they show that this local policy makes early myopic commitments that become difficult to recover from. Beam search increases width but still ranks prefixes with local scores, so it can preserve the same failure mode. The authors introduce FLARE, Future-aware LookAhead with Reward Estimation, which uses MCTS-style lookahead, trajectory-level evaluation, backward value propagation, action pruning, trajectory memory, and receding-horizon execution. On KGQA benchmarks and ALFWorld tool-use tasks, FLARE improves accuracy and planning dynamics, especially by reducing first-step trap selection and increasing recovery after early errors.

## What problem is the paper trying to solve?

The target problem is long-horizon decision making by LLM agents.

Many agent methods ask the model to reason one step at a time: inspect state, think, choose an action, observe, repeat. That can work when the right next action is locally obvious. It breaks when a locally attractive action creates delayed failure, such as entering a dead-end, losing access to an answer path, or committing to an unhelpful subgoal.

The paper argues that this is not just a weakness of a particular prompt or model. It is a decision-mechanism problem. If the policy is locally greedy, improving the fluency of the local reasoning trace does not make it a planner.

## How do they formalize reasoning?

They model an environment as a deterministic state-transition system with:

* states,
* actions,
* a transition function,
* and an evaluative signal available at planning time.

A reasoning-based policy chooses the action that maximizes a local one-step score. That is the formal bridge: ordinary step-by-step reasoning becomes a greedy policy over local action scores.

Beam search is treated as width-extended reasoning. It keeps multiple prefixes, but if those prefixes are still ranked by accumulated local scores, the core criterion remains local.

Planning differs because it evaluates future trajectories and lets downstream outcomes alter earlier action preferences.

## What failure mode do they identify?

The paper's main failure mode is early myopic commitment.

At the first few decisions, an action may look locally good but route the agent into a worse long-term region. Once the agent enters that region, later reasoning may have no way to recover. This is especially painful because the first error happens before the task looks hard.

In the paper's KGQA sandbox, the authors explicitly construct myopic traps: first-step actions that rank high under local scoring but have worse long-term prospects than alternatives. Single-step and beam-based strategies select these traps often. Lookahead and FLARE select them much less often.

## What is FLARE?

FLARE stands for Future-aware LookAhead with Reward Estimation.

It is an MCTS-like online planner for LLM agents. At each decision point, it:

* proposes a bounded set of candidate actions,
* simulates future trajectories,
* evaluates complete trajectories rather than individual steps,
* reuses similar trajectory evaluations through a bounded trajectory memory,
* propagates trajectory returns backward to earlier state-action pairs,
* selects the best root action,
* executes only that next action,
* and replans after observing the new state.

The receding-horizon commitment is important. FLARE is not committing to a full imagined script. It keeps the plan revisable.

## What does FLARE add beyond shallow lookahead?

Shallow lookahead asks: if I try this action and roll out a few steps, what happens?

FLARE adds value propagation and memory. The outcome of a simulated trajectory is not just used at the leaf; it updates the estimated value of the early actions that led there. This is the planning ingredient that lets future outcomes reshape current choices.

The paper also uses action pruning and trajectory memory for efficiency. In the implementation details, FLARE uses a default top-k action proposal with k = 8, rollout depth H = 3, simulation budget S = 16, similarity threshold 0.9, memory size 200, and UCB-style tree selection.

## What are the theoretical claims?

The paper proves three simple but useful propositions.

First, step-wise greedy policies can be arbitrarily suboptimal. If the local score prefers an action that leads to zero return, while a locally lower-scored action leads to high delayed return, the greedy policy fails no matter how high the delayed reward is.

Second, finite-width beam search does not remove the structural problem. If enough decoy prefixes have better local scores, beam search can prune the globally optimal prefix at depth one.

Third, even one-step lookahead can strictly improve the class of solvable environments. The point is not that one-step lookahead is enough in general; the appendix also shows truncated lookahead can fail when rewards are delayed beyond the horizon. The point is that planning capability comes from explicitly evaluating consequences, not from local reasoning alone.

## What are the main KGQA results?

The main controlled experiments use ComplexWebQuestions, WebQSP, and GrailQA. They treat KGQA as graph traversal over explicit state/action spaces and use oracle-structured subgraphs so a valid solution path exists.

Average Hits@1 in Table 1:

* CWQ: single step 59.8, beam search 63.3, lookahead 66.5, FLARE 71.8.
* WebQSP: single step 78.2, beam search 81.8, lookahead 84.7, FLARE 89.9.
* GrailQA: single step 76.5, beam search 79.0, lookahead 81.6, FLARE 87.8.

The gains hold across Think-on-Graph and Plan-on-Graph backbones and across LLaMA-3.1-8B, LLaMA-3.1-70B, GPT-4o-mini, and GPT-4o. That supports the paper's claim that the planning mechanism matters beyond raw model scale.

## How does FLARE compare with prior methods?

On the KGQA comparison table, FLARE is competitive with or above specialized MCTS and KGQA methods.

Reported Table 2 numbers:

* FLARE on Think-on-Graph: 73.6 CWQ, 90.4 WebQSP, 86.7 GrailQA.
* FLARE on Plan-on-Graph: 78.8 CWQ, 93.9 WebQSP, 92.0 GrailQA.
* For comparison, PoG reports 75.0, 87.3, 84.7; ToG reports 67.6, 82.6, 81.4.

This is a solid result, though not a clean apples-to-apples proof that FLARE dominates every specialized method. Some baselines use different assumptions, task-specific engineering, or training recipes.

## What do the mechanism metrics show?

This is the best part of the paper.

Table 3 reports aggregate planning dynamics:

* Constructed Trap@1: single step 55.6%, beam search 71.9%, lookahead 23.6%, FLARE 17.8%.
* First-error step: single step 1.6, beam search 2.0, lookahead 2.8, FLARE 3.2.
* Recovery after first error: single step 5.4%, beam search 11.4%, lookahead 22.4%, FLARE 29.7%.

Beam search selecting even more traps than single-step greedy is the spicy result. It suggests that widening the search can amplify local relevance signals if the scoring rule is still myopic.

FLARE does not just improve final accuracy; it changes the error profile. Failures shift away from early irreversible myopic decisions and toward later exploration or termination problems.

## What about cost?

FLARE spends more test-time compute, but the paper argues that the compute is better directed.

The efficiency ablation reports:

* full FLARE: 74.9 average Hits@1 with about 21k tokens,
* without pruning: 69.5 at about 15k tokens,
* without pruning but accuracy-aligned: 75.4 at about 61k tokens,
* without memory: 74.6 at about 34k tokens,
* without memory under matched budget: 72.7 at about 22k tokens.

The read: action pruning helps allocate search to useful branches, while trajectory memory reduces redundant evaluation. Neither is the conceptual core, but both matter for making the planner usable.

## What about ALFWorld?

The ALFWorld section checks whether the behavior carries beyond graph QA into text-based tool-use tasks.

The figure reports success and first-error position over ReAct and Reflexion-style agents. Approximate reported success rates:

* ReAct stack: single step 61%, beam 67%, lookahead 72%, FLARE 78%.
* Reflexion stack: single step 64%, beam 71%, lookahead 76%, FLARE 82%.

Table 5 also reports:

* ReAct: 61.3%,
* ReAct + Beam: 66.7%,
* Reflexion: 64.2%,
* RL Policy (Greedy): 69.4%,
* RL Policy (Think): 77.4%,
* ReAct + MCTS: 73.5%,
* ReAct + FLARE: 77.8%.

This is useful cross-domain evidence, but still not the same as unconstrained web or software agents.

## Strengths

The paper makes a crisp conceptual distinction. Reasoning traces can be locally coherent and still produce bad plans.

The mechanism metrics are excellent. Trap selection, first-error position, and recovery after first error say more about planning behavior than final task accuracy alone.

The theoretical examples are simple but clarifying. They make it hard to hide behind "just scale the reasoning model" as the only answer.

The receding-horizon framing is practical. Online replanning is exactly the thing many LLM-agent loops need but do not explicitly value.

The paper is also careful to separate decision-mechanism failures from environment-side uncertainty by using explicit transition settings.

## Weaknesses and caveats

The controlled setting is both a strength and a limitation. KGQA with oracle-structured subgraphs isolates planning behavior, but it is not the same as messy open-world agent deployment.

FLARE assumes candidate futures can be simulated and evaluated at planning time. In many real environments, the transition model is unknown, partial, stochastic, expensive, or unsafe to query.

The evaluative signal matters a lot. If the evaluator is noisy or reward-hackable, future-aware planning can optimize the wrong thing more systematically than local reasoning.

The method uses more test-time compute and depends on action proposal quality. Bad pruning can hide the right branch before planning begins.

The phrase "reasoning fails to plan" is catchy but can be overread. The paper is really about step-wise local-score reasoning policies. Some systems people call "reasoning" already include search, verification, world models, or value propagation.

## Why It Matters

This paper is a good corrective to agent hype. A model writing a plausible chain of thought after every observation is not necessarily planning. If the action-selection loop is local, the agent is still liable to drift into early commitments that no amount of later eloquence can undo.

For real agent design, the lesson is simple and durable: put planning machinery in the loop. Evaluate futures, propagate consequences backward, and avoid committing to long scripts when the world can correct you after each step.

## Final Decision

Keep. Cite it for the reasoning-versus-planning distinction, the myopic-trap diagnosis, and the mechanism-level evaluation of long-horizon agents. The strongest reusable idea is not FLARE as a branded algorithm; it is the three-part requirement: explicit lookahead, backward value propagation, and limited commitment. Keep the caveat attached: the empirical evidence is controlled and assumes explicit transitions/evaluators, so this is a planning lens, not a universal agent solution.
