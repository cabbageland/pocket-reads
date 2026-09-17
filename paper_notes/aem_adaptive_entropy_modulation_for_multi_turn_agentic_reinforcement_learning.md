---
title: AEM: Adaptive Entropy Modulation for Multi-Turn Agentic Reinforcement Learning
slug: aem-adaptive-entropy-modulation-for-multi-turn-agentic-reinforcement-learning
authors: Haotian Zhao, Songlin Zhou, Yuxin Zhang, Stephen S.-T. Yau, Wenyu Zhang, Lun Tian, Tianshu Zhu, Yifeng Huang, Yucheng Zeng, Jingnan Gu, Daxiang Dong, Jianmin Wu
year: 2026
venue: arXiv preprint (cs.AI)
date_read: 2026-09-16
paper_url: https://arxiv.org/abs/2605.00425
pdf_url: https://arxiv.org/pdf/2605.00425
verdict: Useful. AEM is a clean low-overhead entropy-aware advantage scaling trick for multi-turn agent RL, but it should be read as a training-dynamics method rather than a full semantic credit-assignment solution.
summary: AEM targets sparse terminal-reward training for LLM agents, where GRPO-style methods tend to smear one trajectory-level advantage across every response. The paper derives a response-level entropy-drift relation: under a natural-gradient view, the direction of entropy change depends on the product of response advantage and relative response surprisal. Since exact response entropy is intractable, AEM uses length-normalized token entropy over each environment-reactive response span, group-normalizes it, maps lower-entropy responses to larger coefficients, and multiplies the base response advantage by that coefficient. Early in training, when negative samples dominate, this tends to resist premature entropy collapse; later, as positive samples dominate, it pushes exploitation. Across ALFWorld, WebShop, and SWE-bench-Verified, AEM consistently improves GRPO/DAPO/GSPO/DeepSWE with little added overhead, though the method is still a heuristic uncertainty proxy and not a causal step-credit oracle.
why_it_matters: The reusable idea is simple and practical: align credit modulation with the unit that changes the environment, the complete agent response, and compute the modulation from entropy values already available during log-probability recomputation. That gives agent RL a cheap knob for exploration-to-exploitation dynamics without process reward models, extra rollouts, or tree search. The paper is most useful if you are comparing lightweight alternatives to PRMs, GiGPO/IGPO-style trajectory mining, or structured credit propagation.
final_decision: Keep as a useful agent-RL training trick and cite for response-level entropy-aware advantage modulation. Do not overstate it as solving credit assignment: it does not identify semantic causal turns, exact response entropy is approximated by a group-relative proxy, and the evidence is concentrated in familiar agent benchmarks plus one SWE-bench-Verified integration.
tags: agent-rl, reinforcement-learning, agentic-rl, credit-assignment, entropy, advantage-scaling, grpo, dapo, gspo, deepswe, alfworld, webshop, swe-bench, qwen, exploration-exploitation, sparse-rewards, llm-agents
---

# AEM: Adaptive Entropy Modulation for Multi-Turn Agentic Reinforcement Learning

## Basic info

* Title: AEM: Adaptive Entropy Modulation for Multi-Turn Agentic Reinforcement Learning
* Authors: Haotian Zhao, Songlin Zhou, Yuxin Zhang, Stephen S.-T. Yau, Wenyu Zhang, Lun Tian, Tianshu Zhu, Yifeng Huang, Yucheng Zeng, Jingnan Gu, Daxiang Dong, Jianmin Wu
* Year: 2026
* Venue / source: arXiv preprint (cs.AI)
* Link: https://arxiv.org/abs/2605.00425
* PDF: https://arxiv.org/pdf/2605.00425
* DOI: https://doi.org/10.48550/arXiv.2605.00425
* arXiv version inspected: v3, submitted 2026-05-01, revised 2026-05-08
* Date read: 2026-09-16
* Date surfaced: 2026-09-16
* Surfaced via: Tracy via Pocket Reads command
* Why selected in one sentence: It proposes a cheap response-level entropy modulation rule for sparse-reward multi-turn agent RL, which is exactly the lane where uniform trajectory credit keeps causing trouble.

## Quick verdict

* Useful

AEM is a clean, practical training-dynamics trick for multi-turn agent RL. The most useful part is not the branding around entropy, but the operational recipe: aggregate uncertainty over the complete response span, normalize it within the rollout group, and use it to rescale response-level advantages without adding supervision, rollouts, or forward passes. I would keep it in the toolkit, but not treat it as a full solution to credit assignment; it shapes entropy pressure, not semantic causal attribution.

## One-paragraph overview

AEM targets sparse terminal-reward training for LLM agents, where GRPO-style methods tend to smear one trajectory-level advantage across every response. The paper derives a response-level entropy-drift relation: under a natural-gradient view, the direction of entropy change depends on the product of response advantage and relative response surprisal. Since exact response entropy is intractable, AEM uses length-normalized token entropy over each environment-reactive response span, group-normalizes it, maps lower-entropy responses to larger coefficients, and multiplies the base response advantage by that coefficient. Early in training, when negative samples dominate, this tends to resist premature entropy collapse; later, as positive samples dominate, it pushes exploitation. Across ALFWorld, WebShop, and SWE-bench-Verified, AEM consistently improves GRPO/DAPO/GSPO/DeepSWE with little added overhead, though the method is still a heuristic uncertainty proxy and not a causal step-credit oracle.

## Model definition

### Inputs

The learned system is an LLM agent policy interacting with a multi-turn environment. At each step it sees an environment state such as a language observation, tool output, webpage snapshot, or task history, then emits a full textual response/action before the environment transitions.

AEM itself takes training-time quantities:

* sampled rollouts grouped by prompt;
* completed agent response spans, aligned to environment transitions;
* base response-level advantages from a method such as GRPO, DAPO, GSPO, or DeepSWE's GRPO++ recipe;
* per-token entropy values for each response span, available during old-policy log-probability recomputation;
* a temperature `lambda`, set to 1 in the experiments.

### Outputs

The policy outputs ordinary agent responses/actions. AEM outputs a scalar coefficient `alpha_i,t` for each response span and a modulated response advantage:

* `A_i,t^AEM = alpha_i,t * A_i,t^base`

This modulated advantage is then broadcast over the response tokens for the underlying policy optimization update.

### Training objective (loss)

AEM does not add a separate learned loss, critic, process reward model, or auxiliary self-supervised target. It modifies the base RL objective by replacing the base response advantage with an entropy-modulated response advantage.

For ALFWorld and WebShop, the paper uses rule-based outcome rewards: successful trajectories receive 10, failed trajectories receive 0, and invalid actions get an additional -0.1 penalty. For SWE-bench-Verified, the reward is binary success/failure. Across group-based methods, the rollout group size is fixed at 8.

### Architecture / parameterization

AEM is model-agnostic advantage modulation, not a new architecture. Experiments use Qwen2.5-1.5B-Instruct and Qwen2.5-7B-Instruct for ALFWorld/WebShop, and Qwen3-32B inside DeepSWE/rLLM for SWE-bench-Verified. The method plugs into group-based agent RL backbones including GRPO, DAPO, GSPO, and DeepSWE's GRPO++-style training recipe.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?

The paper attacks credit assignment under sparse outcome rewards in multi-turn LLM-agent training.

In environments like ALFWorld, WebShop, and SWE-bench, the model may take many actions before receiving a final success signal. A vanilla group-based method can normalize that terminal reward across a rollout group, but it still has weak information about which specific response in a long trajectory should be reinforced or discouraged.

Existing fixes often add cost or assumptions:

* process reward models require dense supervision or a separate reward model;
* tree-structured optimization can propagate credit more finely, but needs more branching and compute;
* self-supervised or trajectory-structure methods can avoid extra labels, but may depend on repeated states, graph structure, or fragile grouping assumptions.

AEM asks whether the policy's own response-level uncertainty can provide a cheap intrinsic signal for modulating credit.

### 2. What is the method?

AEM rescales the base advantage for each completed response according to a group-normalized response-entropy proxy.

The method has four steps:

1. Parse rollouts into environment-reactive response spans.
2. For each response span, compute a length-normalized mean token entropy `H_bar_i,t`.
3. Normalize `H_bar_i,t` within the prompt's rollout group using min-max scaling.
4. Convert the normalized value into a self-calibrated coefficient:

`alpha_i,t = exp(-lambda * H_tilde_i,t) / group_mean(exp(-lambda * H_tilde))`

If the entropy range within the group is smaller than 0.1, AEM sets `alpha = 1` to avoid acting on noise.

Low-entropy responses get `alpha > 1`; high-entropy responses get `alpha < 1`. The coefficient is applied uniformly to the whole response span:

`A_i,t^AEM = alpha_i,t * A_i,t^base`

That is all. No extra rollouts, no extra model forward pass, no learned reward model.

### 3. What is the method motivation?

The theoretical motivation is response-level entropy drift.

The paper first argues that in agentic RL, the environment responds to a complete model response, not an individual token. So uncertainty should be considered at the response level. It then shows that response entropy is the expectation of token-entropy sums, and policy entropy is the expected sum of response-level entropies across the trajectory.

The key theorem says that under a Fisher-Rao/natural-gradient view, the directional derivative of response entropy induced by a sampled response is:

`A(a, s) * (S(a | s) - H_resp(s))`

So entropy drift depends jointly on:

* the response advantage;
* whether the sampled response is more or less surprising than the response-level entropy baseline.

The exact `H_resp(s)` is not computable for open-ended LLM response spaces, so AEM uses a practical relative proxy from the sampled rollout group. The method's intuition is: use relative response uncertainty to decide how much of the base advantage each response should receive.

### 4. What data does it use?

The experiments use:

* ALFWorld for text-based household decision-making;
* WebShop for simulated web shopping and product selection;
* SWE-bench-Verified for software-engineering issue resolution.

For ALFWorld and WebShop, training uses `verl-agent`, Qwen2.5 models, 16 rollout groups per rollout, group size 8, and 150 training steps. For SWE-bench-Verified, training uses rLLM on Qwen3-32B with R2E data, batch size 64, rejection sampling with 2x oversampling, 250 steps, and 64 H200 GPUs.

### 5. How is it evaluated?

The paper plugs AEM into several RL baselines:

* GRPO;
* DAPO;
* GSPO;
* DeepSWE / GRPO++ for SWE-bench-Verified.

It reports:

* ALFWorld task-category success and overall success;
* WebShop score and success rate;
* SWE-bench-Verified resolved rate;
* entropy-dynamics analysis;
* computational overhead;
* ablations over coefficient direction, shuffling, and normalization scope.

All reported main results are averaged over 3 random seeds.

### 6. What are the main results?

The main empirical story is consistent improvement, especially on weaker backbones and smaller models.

For Qwen2.5-1.5B:

* GRPO on ALFWorld improves from 68.0 to 76.8 overall success.
* GRPO on WebShop improves from 83.6 to 86.4 score and from 65.0% to 70.6% success.
* DAPO on ALFWorld improves from 88.5 to 94.5.
* GSPO on ALFWorld improves from 66.7 to 71.9.

For Qwen2.5-7B:

* GRPO on ALFWorld improves from 78.7 to 84.4.
* GRPO on WebShop improves from 84.1 to 86.9 score and from 75.9% to 80.5% success.
* DAPO is already strong, but AEM still nudges ALFWorld from 96.1 to 96.6 and WebShop success from 86.7% to 88.9%.

For SWE-bench-Verified:

* DeepSWE reproduction: 42.3% resolved.
* DeepSWE+AEM: 43.7% resolved.

The analysis sections support the mechanism:

* `alpha - 1` correlates with Monte Carlo relative surprisal at `r = 0.63`, with sign agreement in 55/64 states.
* Masking responses by the sign of `A(alpha - 1)` produces diverging entropy trends in the expected direction.
* AEM maintains higher entropy early and then reduces it later, unlike baseline GRPO's abrupt early collapse.
* AEM-specific computation is reported as 1.1% of per-step training time, because it reuses entropy/log-probability computation already present in training.

### 7. What is actually novel?

The novelty is not "entropy matters." That is old.

The useful novelty is the response-level framing and the very cheap implementation:

* analyze entropy drift at the completed-response granularity;
* derive a sign relation involving response advantage and relative response surprisal;
* approximate the intractable relative response surprisal with group-normalized length-averaged token entropy;
* use that proxy only to rescale base response advantages;
* preserve compatibility with existing group-based RL algorithms.

It is a small intervention, but it is pointed at the right unit of interaction for agents.

### 8. What are the strengths?

The strongest parts:

* It respects environment granularity. The response/action, not the token, is the unit that changes the environment.
* It is cheap. No PRM, no extra rollout tree, no additional policy/reference forward pass.
* It is easy to plug in. AEM only changes response-level advantages.
* The ablations are useful. Reversing the coefficient direction hurts, shuffling coefficients weakens gains, and group normalization is better than trajectory or batch normalization.
* The method gives a plausible account of exploration-to-exploitation dynamics rather than just reporting benchmark wins.

### 9. What are the weaknesses, limitations, or red flags?

The biggest limitation is that AEM is not causal credit assignment. It does not know which response semantically caused success. It uses entropy as a training-dynamics proxy.

Other caveats:

* Exact response entropy is intractable, so the method depends on a sampled group-relative proxy.
* The proxy depends on rollout group quality and diversity.
* The results are mostly from familiar agent benchmarks where training infrastructure and reward design matter a lot.
* SWE-bench-Verified gain is real but modest: 42.3% to 43.7%.
* It is unclear how stable the method is under different sampling temperatures, rollout group sizes, or more heterogeneous tasks.
* The paper's theory uses frozen occupancy / local-update assumptions. That is fine as motivation, but not a guarantee for full nonstationary LLM-agent training.

### 10. What challenges or open problems remain?

Open problems:

* estimating response-level relative surprisal more accurately;
* separating useful uncertainty from messy token-level artifacts;
* combining entropy modulation with semantic state/action credit assignment;
* testing beyond ALFWorld/WebShop/SWE-bench-style setups;
* understanding when entropy preservation becomes harmful noise rather than exploration;
* measuring whether AEM helps real tool-use robustness, not just benchmark success.

### 11. What future work naturally follows?

Natural next steps:

* combine AEM with trajectory-structure methods such as GiGPO/IGPO rather than treating them as competitors;
* learn or estimate better response-level entropy baselines;
* test whether AEM helps on GUI agents, browser agents, and multi-tool coding agents;
* study interaction with rejection sampling, difficulty filtering, and task-mix bias;
* use entropy modulation as a diagnostic for premature RL collapse.

### 12. Why does this matter?

This matters because a lot of agent RL is stuck between two bad options: smear terminal reward uniformly over the whole trajectory, or build expensive dense supervision. AEM is a middle path: use uncertainty already available inside the policy to reshape response-level learning pressure.

That is not enough to solve credit assignment, but it is enough to be useful. It gives you a cheap entropy-control lever that is aligned to the agent's actual action boundary.

### 13. What ideas are steal-worthy?

Steal these:

* Treat completed agent responses as the credit unit.
* Use length-normalized response entropy, not raw token entropy, when the environment reacts after a full response.
* Self-normalize modulation coefficients to keep average scale stable.
* Turn off modulation when within-group entropy range is too small.
* Preserve the base advantage sign; rescale magnitude only.
* Use entropy dynamics as an early warning for collapse in agent RL runs.

### 14. Final decision

Keep as a useful agent-RL training trick and cite for response-level entropy-aware advantage modulation.

Do not oversell it. AEM is not a PRM replacement in the strong sense, and it is not a semantic turn-credit oracle. It is a neat, cheap, empirically supported way to bias sparse-reward agent RL away from early entropy collapse and toward a more controlled exploration-to-exploitation transition.
