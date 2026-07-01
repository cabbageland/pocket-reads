---
title: Uncertainty Quantification in LLM Agents: Foundations, Emerging Challenges, and Opportunities
slug: uncertainty-quantification-in-llm-agents-foundations-emerging-challenges-and-opportunities
authors: Changdae Oh, Seongheon Park, To Eun Kim, Jiatong Li, Wendi Li, Samuel Yeh, Xuefeng Du, Hamed Hassani, Paul Bogdan, Dawn Song, Sharon Li
year: 2026
venue: ACL 2026 Main Conference / arXiv preprint (cs.AI)
date_read: 2026-06-30
paper_url: https://arxiv.org/abs/2602.05073
pdf_url: https://arxiv.org/pdf/2602.05073
verdict: Important framing paper, not a solved method
summary: This paper argues that uncertainty quantification for LLMs has to move from single-answer confidence toward uncertainty over an agent's whole interactive trajectory. It formalizes an agent run as a stochastic sequence of actions, observations, and environment states, then defines turn-level and trajectory-level uncertainty. The useful contribution is the problem framing: agent UQ must account for information-seeking actions that reduce uncertainty, irreversible or state-changing actions that raise commitment risk, uncertainty from users/tools/environment observations, and the lack of fine-grained benchmarks. The τ²-bench experiments are preliminary but instructive: common NLL, entropy, and verbalized-confidence estimators are weak and often near-random at predicting agent task failure.
why_it_matters: This is directly relevant to building real agents. It says the right question is not merely "how confident is the model's next answer?" but "how much unresolved uncertainty remains in this workflow, where did it come from, and should the agent ask, inspect, branch, roll back, or commit?" That is the shape of reliability work for coding agents, healthcare agents, robots, and personal assistants with tools.
final_decision: Keep. Cite it for the formal agent-UQ setup, the four challenge taxonomy, the τ²-bench evidence that current estimators are weak in agent settings, and the conditional uncertainty-reduction idea. Do not cite it as a finished production recipe; the proposed gating model is a prototype, the experiments are small, and calibration remains largely unsolved.
tags: llm-agents, uncertainty-quantification, agent-reliability, calibration, confidence, tau2-bench, tool-use, agent-evaluation, turn-level-evaluation, trajectory-level-evaluation, interactive-agents, risk-aware-agents, software-agents, healthcare-ai, robotics
---

# Uncertainty Quantification in LLM Agents: Foundations, Emerging Challenges, and Opportunities

## Basic info

* Title: Uncertainty Quantification in LLM Agents: Foundations, Emerging Challenges, and Opportunities
* Authors: Changdae Oh, Seongheon Park, To Eun Kim, Jiatong Li, Wendi Li, Samuel Yeh, Xuefeng Du, Hamed Hassani, Paul Bogdan, Dawn Song, Sharon Li
* Year: 2026
* Venue / source: ACL 2026 Main Conference / arXiv preprint (cs.AI)
* Link: https://arxiv.org/abs/2602.05073
* PDF: https://arxiv.org/pdf/2602.05073
* Project page: https://agentuq.github.io/
* Artifacts: https://huggingface.co/datasets/changdae/tau2-uq-artifacts
* arXiv version inspected: v3, last revised 2026-04-20
* Date read: 2026-06-30
* Date surfaced: 2026-06-30 (via Tracy)
* Why selected in one sentence: It turns uncertainty for agents into a trajectory-level reliability problem instead of another "ask the model for a confidence score" trick.

## Quick verdict

Important framing paper, not a solved method

This is worth keeping because it names the actual problem. LLM uncertainty quantification has mostly lived in single-turn QA or static chain-of-thought settings. Agents are different: they talk to users, call tools, observe changing environments, gather missing information, and sometimes perform irreversible actions. A confidence score on the next utterance is too small a unit. The paper's best move is to model uncertainty over the whole action-observation-state trajectory and to distinguish actions that reduce uncertainty from actions that merely move risk forward.

The caveat is equally important: the paper is mostly a foundation/agenda paper. Its τ²-bench experiments show that obvious estimators are weak, not that the authors have solved agent UQ. The conditional uncertainty-reduction model is a useful sketch, but it still depends on hard subproblems: action classification, observation uncertainty, mutual information estimation, calibration, and fine-grained trajectory labels.

## One-paragraph overview

The paper introduces a formal setup for uncertainty quantification in LLM agents. It models an agent trajectory as a stochastic process over actions, observations, and environment states, then defines both turn-level uncertainty and trajectory-level uncertainty. From that setup, it argues that agent UQ has four technical bottlenecks: choosing an estimator when APIs often lack logprobs and repeated sampling is expensive; estimating uncertainty over heterogeneous observations from users, tools, and environments; modeling uncertainty dynamics in interactive systems where information-seeking can reduce uncertainty; and building fine-grained benchmarks that label more than final task success. The authors ground the discussion with small τ²-bench experiments on GPT-4.1 and Kimi-K2.5, showing that NLL, entropy, and verbalized confidence only weakly predict task success/failure. They then sketch a conditional uncertainty-reduction process that gates uncertainty updates by whether each action is interactive and evidential.

## What problem is the paper trying to solve?

Most LLM UQ asks: given a prompt and an answer, how uncertain is the answer?

That is too narrow for agents. An agent may:

* ask the user for missing information,
* call a read-only tool to inspect state,
* reason internally,
* call a write tool that changes the world,
* summarize a result,
* or stop early with unresolved ambiguity.

Those action types do not have the same relationship to uncertainty. Asking a clarifying question can reduce uncertainty. A state-changing tool call commits to a branch of the world and may increase downstream risk. A final answer can sound confident while hiding unresolved earlier ambiguity. The paper argues that a useful agent-UQ framework must track uncertainty across this process, not just attach a scalar confidence to a final text response.

## The formal setup

The paper defines a stochastic agent system with three main variables per turn:

* Environment state, E_i: a mix of accessible interaction memory and a hidden or partially observable system/database state.
* Observation, O_i: the user message, tool result, or environment feedback the agent receives.
* Action, A_i: the agent's response, thought/update, tool call, clarification request, or final answer.

At each turn, the action is sampled from the agent policy and tool setup conditioned on the previous state and observation. The observation is sampled from the environment conditioned on the action and current state. The environment state updates from the old state, previous observation, and current action.

The resulting trajectory is F_<=T = {(A_t, E_t, O_t)} over turns. Agent UQ then asks for:

* turn-level uncertainty U(F_t | F_t-1),
* and trajectory-level uncertainty U(F_<=T).

For uncertainty measures such as negative log probability or entropy, the paper writes total trajectory uncertainty as an additive expansion: initial task/query uncertainty plus per-turn action uncertainty plus per-turn observation uncertainty.

That abstraction is intentionally broad. Single-step LLM UQ becomes the special case where the only action is one response. Chain-of-thought or process reward modeling becomes the special case where uncertainty/reward is assigned over intermediate reasoning steps. Agent UQ adds observations, tools, changing state, and interaction.

## The four technical challenges

### 1. Estimator choice gets worse in agent settings

The paper compares three broad families:

* Probability-based uncertainty, such as NLL or entropy.
* Consistency-based uncertainty, from repeated generations or sampled trajectories.
* Verbalized confidence, where the model reports its own probability of correctness.

The tradeoff is ugly. Probability-based methods have theoretical grounding and low overhead, but many frontier agent APIs do not expose useful logprobs, and long free-form trajectories make token aggregation noisy. Consistency methods are accessible but can become prohibitively expensive across long multi-turn trajectories. Verbalized confidence is cheap and accessible but weakly grounded, and long noisy context can inflate or distort it.

The paper's τ²-bench results are appropriately humbling. On retail and telecom tasks, NLL, entropy, and verbalized confidence only weakly predict success or failure. Reported AUROCs include:

* GPT-4.1 retail: NLL 0.597, entropy 0.580, verbalized confidence 0.575.
* GPT-4.1 telecom: NLL 0.624, entropy 0.611, verbalized confidence 0.685.
* Kimi-K2.5 retail: NLL 0.469, entropy 0.468, verbalized confidence 0.523.
* Kimi-K2.5 telecom: NLL 0.645, entropy 0.664, verbalized confidence 0.580.

That is not a reliability layer. It is a warning label.

### 2. Observations are not generated by the agent

Agent uncertainty is not just uncertainty over the agent's next action. The agent also receives observations from users, tools, databases, UI state, robots, or other external systems.

The paper stresses that these observations come from heterogeneous entities with distributions different from the agent model. Using the agent's own probability distribution to estimate uncertainty over a user's reply or a tool result is not principled. In τ²-bench, the authors compare observation uncertainty estimated from the ground-truth user simulator versus the agent LLM and find substantial distributional deviation. They suggest auxiliary LLM/world-model approximations as one possible route, but this is still early.

This is a sharp point for tool agents. A database row, a flaky webpage, a human correction, and a simulator observation are not the same kind of random variable.

### 3. Interactive uncertainty can go down, not only up

A lot of multi-step UQ treats uncertainty as something that accumulates through a trajectory. That misses the point of acting in the world. Agents can reduce uncertainty by reading, asking, searching, re-sensing, confirming, or otherwise gathering evidence.

The paper argues for action-conditional uncertainty dynamics. The uncertainty update should depend on what type of action happened. A read-only information-gathering action should be allowed to reduce uncertainty if the observation is useful and grounded. A state-changing write action should not get the same treatment just because the model was confident while doing it.

This matters because naive averaging over action uncertainty failed to meaningfully separate successful and failed trajectories in the paper's τ²-bench plots. In some cases, failure trajectories looked increasingly "certain" late in the task, which is exactly the scary failure mode: confidently marching toward the wrong committed state.

### 4. Fine-grained benchmarks are scarce

The paper surveys 44 modern agent benchmarks released from 2023 to early 2026 and finds only 4 with turn-level annotation. Most benchmarks judge only final trajectory success, with some milestone-level evaluation in between.

This is a bottleneck. If we only know whether the final task succeeded, we cannot train or evaluate an uncertainty signal that should have fired at turn 3, after the tool read, before the write call, or at the moment a user clarification contradicted the current plan.

## What did they test on τ²-bench?

The empirical section uses τ²-bench, a tool-agent-user interaction benchmark with airline, retail, and telecom domains. The authors follow a frontier-evaluation setup and run retail and telecom tasks with GPT-4.1 and Kimi-K2.5. They use Kimi-K2.5 as the user simulator for all tasks, set temperature to 0, and run one trial per task due to resource limits.

They measure trajectory-level uncertainty against final task success/failure because τ²-bench does not provide turn-level uncertainty labels. For action uncertainty, they aggregate token-level NLL and entropy over the agent's actions. For verbalized confidence, they ask the model to output a probability that its current response/action is correct, then average that per turn across the trajectory.

Average reward/success rates in their setup:

* GPT-4.1 retail: 0.509.
* GPT-4.1 telecom: 0.517.
* Kimi-K2.5 retail: 0.447.
* Kimi-K2.5 telecom: 0.965.

The point is not the model ranking. The point is that the uncertainty signals are not robust enough to drive high-stakes behavior. Some correlations are statistically significant, especially GPT-4.1 telecom verbalized confidence, but the overall pattern is fragile.

## Conditional uncertainty reduction

The paper's proposed direction is a conditional uncertainty-reduction process.

The core idea: classify each action by whether it is interactive and evidential. If an action is a valid uncertainty-reduction action, the update should reflect information gained from the resulting observation. Otherwise, uncertainty should propagate or increase.

Their action categories include:

* Information gathering: interactive. Example: read a reservation, search flights, retrieve order status, read messages.
* Asking clarification or confirmation: interactive. Example: ask the user to choose a flight or confirm cancellation.
* Thinking: non-interactive. Example: internal planning.
* State-changing tool call: non-interactive. Example: update a booking, return/cancel items, turn on Wi-Fi.
* Providing final information: non-interactive. Example: summarize the result of the action.

The implementation sketch has three hard pieces:

* an action classifier for interactivity and evidentiality,
* uncertainty estimators for initial query uncertainty, action uncertainty, and observation uncertainty,
* and a mutual-information estimate for how much the observation reduced uncertainty about the original task.

This is not ready-made engineering glue. But as a design principle, it is strong: uncertainty should decrease only when the agent actually learned relevant grounded information, not when it merely produced a more confident-sounding continuation.

## Practical implications

For frontier LLMs, the paper connects agent UQ to adaptive reasoning: stop early, think longer, ask for information, or invoke interaction based on an uncertainty budget.

For healthcare agents, uncertainty should act as a gatekeeper for human-in-the-loop escalation. A clinical agent should not only produce a diagnosis; it should know when accumulated uncertainty requires human review or more evidence.

For software engineering agents, the paper's most practical framing is "controllable exploration and commitment." An agent should inspect more files, branch, roll back, or ask the user when uncertainty rises after an edit. This maps cleanly to real coding workflows: tests, diffs, local checkpoints, and revertible branches are not just engineering hygiene; they are uncertainty-control machinery.

For embodied agents, uncertainty includes sensing, dynamics, and human intent. A robot can re-sense, ask, or gather more evidence before a fragile grasp or irreversible physical action. That makes embodiment a natural case for conditional uncertainty reduction.

## Open problems

The paper names several unsolved problems:

* Intrinsic solution multiplicity: high uncertainty might mean the agent is lost, or it might mean there are many valid next actions.
* Evaluation beyond final task failure: final success/failure collapses a rich process into one bit.
* Multi-agent uncertainty: uncertainty dynamics can interact across agents and shared environment state.
* Self-improving agents: uncertainty changes across episodes when memory, tools, and model behavior evolve.
* Calibration: modern LLMs are not well calibrated, so raw uncertainty estimates are not reliable performance indicators.
* Multimodal agents: GUI and embodied settings add many-to-many correspondences between modalities.

These are not side quests. They are the core reasons "just ask the model how confident it is" keeps being flimsy.

## What I would steal for agent design

Treat read actions and write actions differently. A read/search/ask/inspect step can reduce uncertainty; a write/send/delete/commit step should require lower uncertainty or stronger evidence.

Track uncertainty at the workflow level. A final answer may be confident even if an early assumption was never checked.

Use uncertainty as a routing signal, not just a dashboard number. High or rising uncertainty should trigger ask-user, gather-evidence, branch, test, rollback, or escalate behavior.

Separate action uncertainty from observation uncertainty. The model may be uncertain about what to do, while the environment may be uncertain, stale, adversarial, or merely underspecified.

Demand turn-level evidence. If a benchmark cannot tell where uncertainty should have been resolved, it is not enough for training reliable agents.

## Strengths

The paper cleanly distinguishes agent UQ from ordinary LLM UQ. That alone is valuable.

The action-observation-state formalization is simple enough to cover real tool agents without drowning in notation.

The four challenges are the right four challenges. Estimator access/cost, external observations, interactive dynamics, and missing fine-grained labels are exactly where naive confidence schemes break.

The τ²-bench experiments are useful because they show current estimators are weak in realistic multi-turn settings. Negative results matter here.

The conditional uncertainty-reduction idea has good engineering taste: grounded information-seeking should reduce uncertainty; confident internal continuation should not automatically get credit.

## Weaknesses and caveats

The method is more of a roadmap than a working system. The paper identifies the right ingredients but does not deliver a production-ready uncertainty module.

The empirical work is small. It uses retail and telecom domains, two models, one trial per task, and trajectory-level labels because turn-level labels are unavailable.

The verbalized-confidence setup is intentionally simple, so one should not overgeneralize from those numbers to all possible self-reporting or trained confidence methods.

Observation uncertainty remains underdeveloped. The auxiliary-world-model idea is plausible, but it introduces its own calibration and distribution-shift problems.

The mutual-information/gating approach sounds elegant, but estimating mutual information over natural-language trajectories and tool observations is still hard.

The paper does not settle calibration. It explicitly says modern post-trained LLMs are poorly calibrated and that future work needs joint improvement of problem-solving and calibration.

## Why It Matters

This paper is useful because it refuses to collapse agent reliability into a next-token confidence score. Agents fail as processes. They accumulate stale assumptions, get new evidence, commit irreversible writes, and sometimes become more confident while becoming more wrong.

The right unit of uncertainty is the trajectory, and the right policy response is action-dependent. When uncertain, inspect or ask. When confidence is earned through grounded evidence, proceed. When uncertainty rises after an action, branch or roll back. That framing is more important than any one number in the paper.

## Final Decision

Keep. This is a strong conceptual anchor for agent reliability work and a useful citation for why standard LLM uncertainty methods do not transfer cleanly to agents. Use it when arguing for trajectory-level uncertainty, turn-level labels, read/write action distinctions, confirmation before irreversible steps, and uncertainty-triggered branching or rollback.

Do not oversell it. It is not a finished recipe for calibrated agent confidence. Its value is that it draws the map and shows that the easy estimators are not good enough.
