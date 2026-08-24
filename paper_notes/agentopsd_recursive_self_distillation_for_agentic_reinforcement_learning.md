---
title: AgentOPSD: Recursive Self-Distillation for Agentic Reinforcement Learning
slug: agentopsd-recursive-self-distillation-for-agentic-reinforcement-learning
authors: Zi-Han Wang, Zhengxi Lu, Zhiyuan Yao, Jinyang Wu, Jie Wu, Zhengzhou Cai, Yueqing Sun, Ziang Ye, Linji Hao, Qi Gu, Xunliang Cai, Yongliang Shen, Yujiu Yang
year: 2026
venue: arXiv preprint (cs.AI, cs.LG)
date_read: 2026-08-24
paper_url: https://arxiv.org/abs/2608.05987
pdf_url: https://arxiv.org/pdf/2608.05987
verdict: Keep. This is a strong agent-RL credit-assignment paper, especially as a self-distillation complement to graph/state-based methods.
summary: AgentOPSD attacks sparse terminal reward smearing in long-horizon language-agent RL. GRPO gives each token in a trajectory the same group-relative advantage, which cannot tell a pivotal turn from a routine or even harmful one. AgentOPSD uses a training-only skill-conditioned self-teacher to compute token-level teacher-student log-probability gaps, aggregates those gaps into turn-level evidence, recursively updates a Bayesian-inspired support state in log-odds space, and uses the marginal belief revision at each turn to reshape GRPO's advantage. The key design is bounded and sign-preserving: final outcome reward still determines update direction, while the self-distillation signal changes only the per-turn magnitude. Across ALFWorld, WebShop, and Search-QA with Qwen2.5-3B/7B, AgentOPSD beats GRPO and most self-distillation baselines, reaching 89.1% ALFWorld success with Qwen2.5-7B. The caveat is that the method depends on privileged training-only skills as a proxy for success-conditioned behavior, so the central assumption is only as good as that skill source.
why_it_matters: This is useful because it gives a concrete way to turn local self-distillation evidence into sequential credit without adding a learned critic or extra rollouts. The reusable idea is not "Bayesian words around RL"; it is the operational recipe: aggregate action-token gaps at environment turn boundaries, maintain a running success-support state, and amplify only the turns whose belief revisions align with the terminal verifier. It sits nicely next to G2PO/GiGPO-style graph credit assignment: those methods mine repeated environment states, while AgentOPSD mines privileged self-teacher evidence.
final_decision: Keep and cite for critic-free turn-level credit assignment in agentic RL, especially when comparing GRPO, StepOPSD, SDAR/RLSD, and graph-based credit methods. Do not cite it as a fully general solution to agent training: it is benchmarked on ALFWorld, WebShop, and Search-QA; it assumes training-only skills are available; and the Bayesian interpretation depends on the skill-conditioned branch behaving like a success-associated policy.
tags: agent-rl, reinforcement-learning, agentic-rl, grpo, opsd, self-distillation, credit-assignment, turn-level-credit, long-horizon-agents, bayesian-belief-update, qwen2.5, alfworld, webshop, search-qa, skill-conditioned-training, sparse-rewards, llm-agents, policy-optimization
---

# AgentOPSD: Recursive Self-Distillation for Agentic Reinforcement Learning

## Basic info

* Title: AgentOPSD: Recursive Self-Distillation for Agentic Reinforcement Learning
* Authors: Zi-Han Wang, Zhengxi Lu, Zhiyuan Yao, Jinyang Wu, Jie Wu, Zhengzhou Cai, Yueqing Sun, Ziang Ye, Linji Hao, Qi Gu, Xunliang Cai, Yongliang Shen, Yujiu Yang
* Year: 2026
* Venue / source: arXiv preprint (cs.AI, cs.LG)
* Link: https://arxiv.org/abs/2608.05987
* PDF: https://arxiv.org/pdf/2608.05987
* DOI: https://doi.org/10.48550/arXiv.2608.05987
* arXiv version inspected: v1, submitted 2026-08-06
* Date read: 2026-08-24
* Date surfaced: 2026-08-24
* Surfaced via: Tracy via Pocket Reads command
* Code / repo: https://github.com/ZethWang/AgentOPSD
* Study note / walkthrough: [AgentOPSD, worked through](../study_notes/agentopsd-explained.html)
* Why selected in one sentence: It tries to fix the exact failure mode where sparse terminal rewards smear credit across long agent trajectories.

## Quick verdict

Keep. This is a strong agent-RL credit-assignment paper, especially as a self-distillation complement to graph/state-based methods.

The core move is worth preserving: a teacher-student log-probability gap is not automatically credit. It becomes more useful only after it is aggregated at the same boundary where the environment responds, accumulated through the interaction history, and interpreted by how much it revises a belief in eventual success.

That is the paper's contribution. AgentOPSD does not train a critic, generate extra continuations, or bolt on a separate distillation loss. It keeps the GRPO terminal advantage as the sign of the update, then uses recursive belief revisions to decide which turns get more or less of that update.

The caution: the "Bayesian evidence" is only as good as the privileged self-teacher. Here the teacher is skill-conditioned during training, using retrieved SkillBank guidance. That makes the result plausible and useful, but not free. You still need a source of training-time guidance that correlates with successful behavior.

## One-paragraph overview

AgentOPSD attacks sparse terminal reward smearing in long-horizon language-agent RL. GRPO gives each token in a trajectory the same group-relative advantage, which cannot tell a pivotal turn from a routine or even harmful one. AgentOPSD uses a training-only skill-conditioned self-teacher to compute token-level teacher-student log-probability gaps, aggregates those gaps into turn-level evidence, recursively updates a Bayesian-inspired support state in log-odds space, and uses the marginal belief revision at each turn to reshape GRPO's advantage. The key design is bounded and sign-preserving: final outcome reward still determines update direction, while the self-distillation signal changes only the per-turn magnitude. Across ALFWorld, WebShop, and Search-QA with Qwen2.5-3B/7B, AgentOPSD beats GRPO and most self-distillation baselines, reaching 89.1% ALFWorld success with Qwen2.5-7B. The caveat is that the method depends on privileged training-only skills as a proxy for success-conditioned behavior, so the central assumption is only as good as that skill source.

## What problem is the paper trying to solve?

Long-horizon agents often get sparse, delayed rewards. In ALFWorld, WebShop, and search-based QA, an agent may take many actions, then receive a final success/failure signal. A trajectory can contain:

* a decisive early action followed by routine steps,
* a useful failed-trajectory action that later gets buried by a bad continuation,
* a spurious successful-trajectory action that gets undeserved praise,
* or a late correction that changes the outcome after many irrelevant turns.

GRPO is attractive because it is critic-free: sample a group of trajectories for a task, normalize the terminal rewards within the group, and optimize a clipped policy objective. But in its vanilla form, every response token in a trajectory inherits the same sequence-level advantage. That is the wrong granularity for agents. The environment responds to actions at turn boundaries, not to each token in isolation, and the meaning of a turn depends on what the agent has already observed and done.

The paper's diagnosis is good: token-level self-distillation gives local density, but local density is not sequential credit. You need a way to decide whether a local signal is new, pivotal, redundant, or inconsistent with the final outcome.

## Core idea

AgentOPSD turns a self-distillation gap into a recursive support update.

At each turn, the policy generates an action. The same model is then scored in two contexts:

* the normal student context, with the visible interaction history;
* a privileged teacher context, with a retrieved training-only skill added.

The teacher and student share parameters. The teacher branch is not a separate model; it is the same policy conditioned on extra training information. The log-probability difference between the skill-conditioned branch and the normal branch gives a token-level gap.

AgentOPSD sums those token gaps within a turn to get a turn-level evidence score. Then it maintains a running belief state about trajectory success. A turn receives high credit if its evidence causes a large marginal revision in that belief state, after accounting for the evidence already accumulated from previous turns.

That history dependence is the point. A local gap by itself cannot say whether the action mattered. A belief revision can at least ask: did this action change the current support for eventual success?

## Method details

### 1. Start from GRPO's group advantage

For each task, the old policy samples a group of `G` trajectories. Each trajectory receives a binary terminal reward. GRPO computes a sequence-level advantage:

* `A_seq = (R - group_mean) / (group_std + epsilon)`

Standard GRPO broadcasts that scalar advantage to every token in the trajectory. AgentOPSD keeps the same sequence-level signal, but reshapes it per turn.

This matters because AgentOPSD is not replacing the verifier. The final outcome still determines the global update direction. The recursive self-distillation signal redistributes magnitude within the trajectory.

### 2. Compute token-level teacher-student gaps

For token `y_{k,t}` in turn `k`, AgentOPSD compares:

* log probability under the privileged skill-conditioned context;
* log probability under the normal context.

The gap is:

* `delta_{k,t} = log pi(y_{k,t} | s_k, c+, prefix) - log pi(y_{k,t} | s_k, prefix)`

Positive gap means the retrieved skill made the generated token more likely. The paper interprets this as a tractable approximation to success-associated behavior.

The most important caveat lives here. The skill-conditioned branch has to be a reasonable proxy for a success-conditional policy. If the skill is bad, too generic, or misaligned with the environment, the gap becomes noisy.

### 3. Aggregate token gaps into turn evidence

The token gaps in turn `k` are summed:

* `e_k = sum_t delta_{k,t}`

That gives action-level evidence:

* `e_k = log pi(a_k | s_k, c+) / pi(a_k | s_k)`

This is a better unit for agentic environments than a token gap, because the environment only transitions after the full action.

The ablation supports this. Replacing turn-level accumulation with per-token accumulation drops ALFWorld Qwen2.5-7B success from 89.1 to 85.9. That is not catastrophic, but it confirms the alignment point: the action, not the token, is the relevant environment-facing decision.

### 4. Recursively update a support state

AgentOPSD initializes a belief prior from the group success rate:

* `B0 = clip(group_success_rate, epsilon, 1 - epsilon)`

Then it accumulates evidence in log-odds space:

* `c_k = gamma * c_{k-1} + e_k`
* `l_k = logit(B0) + c_k`
* `B_k = sigmoid(l_k)`

The turn credit is the marginal belief revision:

* `Delta B_k = B_k - B_{k-1}`

This is the best part of the method. A turn with a strong local gap is not automatically pivotal. If the belief is already saturated, the same gap changes little. If the trajectory is uncertain, the same gap can matter much more. With `gamma < 1`, old evidence decays, so stale support does not pin the belief state forever.

The paper is careful that `B_k` is not a calibrated success probability. It is a relative support state driven by a self-teacher gap. That honesty makes the method easier to trust.

### 5. Align the revision with the final outcome

The marginal revision gets multiplied by the sign of the sequence-level advantage:

* `q_k = sign(A_seq) * Delta B_k`

This is subtle and important.

For a successful trajectory, a turn that increases success support is outcome-consistent and should be amplified. For a failed trajectory, that same upward revision is inconsistent with the terminal result and should not get the same praise. The final verifier decides whether a belief revision was helpful or misleading.

The ablation is strong: using only the magnitude `|Delta B_k|` and dropping the signed direction lowers ALFWorld success from 89.1 to 80.5. That says the method is not just finding "interesting" turns. It needs to know whether the turn's evidence agrees with the outcome.

### 6. Apply bounded advantage reshaping

AgentOPSD standardizes the signed turn credits within a trajectory, converts them into a bounded multiplier, and reshapes the GRPO advantage:

* normalize `q_k` into `z_k`;
* compute `w_k = clip(1 + b z_k, 1 - b, 1 + b)`;
* set `A_tilde_k = A_seq * [(1 - lambda) + lambda w_k]`.

The multiplier is strictly positive, so the sign of `A_tilde_k` is the same as `A_seq`. That makes the method sign-preserving: it can amplify or attenuate turns, but it cannot reverse the terminal reward's update direction.

The default setting is:

* learning rate `1e-6`;
* group size `G = 8`;
* PPO clip `0.2 / 0.24`;
* KL coefficient `0.01`;
* reshaping weight `lambda = 0.5`;
* multiplier band `b = 0.2`;
* evidence decay `gamma = 0.95`;
* skill retrieval by keyword matching.

The algorithmic overhead is one extra teacher forward pass per trajectory, plus elementwise belief reshaping. No critic, no learned value model, and no extra rollouts.

## Experimental setup

The paper evaluates on three environments:

* ALFWorld: text-based embodied household tasks across six task categories.
* WebShop: interactive shopping with search, product inspection, attribute selection, and purchase.
* Search-QA: Search-R1-style search-augmented QA over NQ, TriviaQA, PopQA, HotpotQA, 2Wiki, MuSiQue, and Bamboogle, using E5 retrieval.

Models:

* Qwen2.5-3B-Instruct
* Qwen2.5-7B-Instruct

Training:

* Qwen2.5 models trained on 8 H800 GPUs.
* Skills are retrieved from SkillRL's SkillBank by keyword matching.
* Skills are used only during training for AgentOPSD; inference uses no external skills.
* Main experiments use 150 training steps.
* Max interaction turns: 50 for ALFWorld, 15 for WebShop, 4 for Search-QA.

Baselines:

* Vanilla
* Skill-Prompt*
* OPSD
* GRPO
* Skill-GRPO / Skill-GRPO*
* GRPO+OPSD
* Skill-SD
* RLSD
* SDAR
* StepOPSD

The controlled comparison is good because many baselines also see the same training-time skill signal. The question is not merely "does privileged context help?" but "how should the skill-induced teacher-student gap enter RL?"

## Main results

AgentOPSD is strongest where the paper says it should be strongest: long-horizon agentic tasks where uniform terminal credit is most damaging.

For Qwen2.5-3B:

* ALFWorld average success: AgentOPSD 84.4 vs GRPO 75.0.
* Search-QA average accuracy: AgentOPSD 46.7 vs GRPO 36.4.
* WebShop score / exact success: AgentOPSD 90.4 / 69.5 vs GRPO 79.8 / 63.3.
* SDAR ties AgentOPSD on ALFWorld average at 84.4, but AgentOPSD is ahead on Search-QA and WebShop score.

For Qwen2.5-7B:

* ALFWorld average success: AgentOPSD 89.1 vs GRPO 81.2.
* Search-QA average accuracy: AgentOPSD 49.2 vs GRPO 42.0.
* WebShop score / exact success: AgentOPSD 90.2 / 79.7 vs GRPO 80.9 / 72.6.
* SDAR beats AgentOPSD on WebShop exact success, 82.8 vs 79.7, so this is not a clean sweep across every metric.

That last caveat matters. The headline is not "AgentOPSD dominates everything everywhere." The better reading is: AgentOPSD consistently improves over GRPO and most self-distillation combinations, and it is especially persuasive on ALFWorld and WebShop score, but exact WebShop success remains noisy enough that SDAR can win a submetric.

## Horizon robustness

The paper's Figure 1(b) is useful because it measures performance decay against interaction length on ALFWorld with Qwen2.5-7B.

Reported success points lost per additional turn:

* AgentOPSD: -0.54
* GRPO: -2.91
* RLSD: -3.59

This is a nice sanity check. If the method is really about long-horizon credit, it should lose less as the number of required turns grows. The reported slope supports that story.

## Mechanism ablation

The ablation table is the most convincing part of the paper. On ALFWorld with Qwen2.5-7B:

* Full AgentOPSD: 89.1
* Per-token accumulation instead of turn-level accumulation: 85.9
* Raw local gap `e_k` instead of recursive revision `Delta B_k`: 82.8
* Magnitude only, dropping outcome-aligned signed direction: 80.5
* Dropping the group-success prior `B0`: 78.9

Interpretation:

* Turn boundaries help because environment feedback is action-level.
* Recursion helps because the same local evidence can be pivotal or redundant depending on history.
* Signed direction matters because a belief revision must be judged against the final verifier outcome.
* The group-success prior anchors the belief state to task difficulty and keeps early revisions scaled sensibly.

The prior result is the most interesting. Removing `B0` is worse than replacing recursion with the raw local gap. That says the method needs an outcome-grounded reference point, not just a moving accumulator.

## Hyperparameter sensitivity

The paper sweeps:

* reshaping weight `lambda`;
* evidence decay `gamma`;
* high policy clip `epsilon_high`.

The main story:

* `lambda = 0.5` is clearly better than smaller weights, which makes sense because smaller values collapse toward GRPO.
* `gamma` is less sensitive; `0.95` is used as a mild decay.
* `epsilon_high` barely changes much, suggesting the reshaped objective inherits GRPO's trust-region stability.
* The hyperparameters matter less on Search-QA, where max interaction length is only four turns. That fits the claim that AgentOPSD is mainly useful when there is real history to assign credit across.

## What is actually novel?

The novelty is not any single ingredient:

* GRPO already gives critic-free group-relative updates.
* OPSD/self-distillation already uses a privileged teacher branch.
* StepOPSD already aggregates self-distillation signals around action steps.
* Bayesian belief updates are old.

The useful composition is:

1. turn-level aggregation of teacher-student gaps;
2. recursive support tracking over the trajectory history;
3. outcome-aligned signed belief revision;
4. bounded, sign-preserving reshaping of GRPO advantages.

That combination gives a per-turn credit signal while keeping the RL update anchored to the terminal verifier.

## Relation to nearby agent-RL credit papers

This belongs next to G2PO/GiGPO and StepOPSD, but it is doing something different.

G2PO/GiGPO-style methods use environment structure. They compare repeated or grouped states across rollouts and estimate which transitions improve expected return.

AgentOPSD uses self-distillation structure. It asks whether a training-only skill-conditioned branch makes the generated action look more success-like, then turns that into a recursive belief revision.

StepOPSD is the closest self-distillation comparison. It applies the teacher-student signal at the turn/step level, but still treats each step locally. AgentOPSD's claim is that local turn gaps are not enough; the same gap means different things depending on the accumulated support state.

The practical synthesis would be interesting: graph/state transition credit from environment revisitation plus self-teacher belief-revision credit from privileged training signals. They are complementary, not mutually exclusive.

## Strengths

The mechanism is crisp. The method says exactly how a token-level self-distillation gap becomes a turn-level advantage multiplier, and the bounded/sign-preserving design avoids a lot of obvious reward-hacking weirdness.

The ablations are useful. Dropping signed direction and prior anchoring hurts hard, which tells us the paper is not getting all its gains from generic "more dense signal" effects.

The benchmark choice is appropriate. ALFWorld, WebShop, and Search-QA are not perfect real-world agents, but they cover embodied text actions, web navigation, and search-based tool use with different horizon lengths.

The inference story is attractive. Skills are used during training but not at evaluation, so the method is trying to internalize guidance rather than smuggling a better prompt into test time.

The overhead is modest compared with critic/rollout-heavy alternatives: one teacher forward pass, no learned value network, no extra continuations.

## Weaknesses and caveats

The success-conditioned policy assumption is doing real work. The paper's theoretical story depends on the skill-conditioned branch approximating success-associated behavior. That may hold for SkillBank-guided benchmark tasks, but it is not automatic in messier environments.

Training still needs privileged skills. Inference does not, but the training pipeline assumes there is a skill retriever and a useful bank of task-relevant skills. That is cheaper than human process labels, but it is still infrastructure.

The environments are still benchmark-shaped. ALFWorld, WebShop, and Search-QA have verifiable outcomes and structured interaction loops. Real browser/API agents can have partial rewards, non-binary outcomes, hidden side effects, and harder observation equivalence.

WebShop exact success is not a clean win. AgentOPSD has the best 7B WebShop score in the table, but SDAR has higher exact success. That is not fatal, but it argues against an overblown "dominates all baselines" reading.

The Bayesian language should be treated as an interpretation, not proof that the model has calibrated beliefs. The authors are mostly honest about this: `B_k` is relative support, not a calibrated success probability.

## What I would steal

Use terminal reward for direction and auxiliary signals for magnitude. That is a nice conservative design pattern. It lets a training-time signal reshape credit without letting it contradict the verifier.

Aggregate at the environment feedback boundary. For agents, the turn/action is usually the right unit. Token-level densification can fragment one decision into many misleading micro-signals.

Make local evidence history-aware. A local "good-looking" action is not necessarily pivotal. Ask how much it revises the current support state.

Anchor the state in group outcome statistics. `B0 = group success rate` is a small but important trick: the belief state starts from observed task difficulty, not arbitrary uncertainty.

Bound the multiplier. The method's advantage multiplier cannot flip signs and is clipped within a narrow band. That is boring in the best way.

## Final decision

Keep and cite for critic-free turn-level credit assignment in agentic RL, especially when comparing GRPO, StepOPSD, SDAR/RLSD, and graph-based credit methods.

The paper's durable contribution is the conversion pipeline: token-level privileged self-distillation gaps become turn-level evidence; turn evidence becomes recursive belief revision; belief revision becomes a bounded per-turn multiplier on GRPO advantage. That is a real mechanism, not just an agentic RL sticker.

Do not cite it as a fully general solution to agent training. It is benchmarked on ALFWorld, WebShop, and Search-QA; it assumes training-only skills are available; and the Bayesian interpretation depends on the skill-conditioned branch behaving like a success-associated policy.
