---
title: Decomposing Elements of Problem Solving: What "Math" Does RL Teach?
slug: decomposing-elements-of-problem-solving-what-math-does-rl-teach
authors: Tian Qin, Core Francisco Park, Mujin Kwun, Aaron Walsman, Eran Malach, Nikhil Anand, Hidenori Tanaka, David Alvarez-Melis
year: 2025
venue: arXiv preprint (cs.AI, cs.CL, cs.LG)
date_read: 2026-06-20
paper_url: https://arxiv.org/abs/2505.22756
pdf_url: https://arxiv.org/pdf/2505.22756
verdict: Highly relevant
summary: This paper tries to answer what reinforcement learning with verifiable rewards, specifically GRPO on math, is actually teaching LLMs. The authors argue that aggregate Pass@1 hides the answer, so they decompose problem solving into Plan, Execute, and Verify. Across Qwen2.5-Instruct models trained on MATH and evaluated on MATH-500, GRPO mostly produces temperature distillation: correct solution patterns become more reliable across sampling temperatures. But best-of-64 coverage barely moves, and matched per-problem analysis shows that gains concentrate on problems the model already sometimes solves. Their plan/execution annotation suggests high-school MATH failures are often execution failures rather than missing high-level plans. GRPO reduces basic arithmetic/logical mistakes and sensitivity to spurious phrasing, but it does not meaningfully teach new math or expand the set of solvable problems. A synthetic graph-navigation task reproduces the effect and shows coverage can improve when the model can explore useful actions and generalize them to structurally similar problems.
why_it_matters: This is a useful antidote to the lazy claim that RL simply "teaches reasoning." The sharper version is that RLVR may sharpen and stabilize behaviors already latent in the model, while doing little for coverage unless the data and exploration regime expose reusable new solution paths. That distinction matters for evaluating reasoning agents, choosing metrics, and interpreting RL gains in math, code, and tool-use settings.
final_decision: Keep. Cite it when arguing that reasoning evaluation needs more than Pass@1 and that RL gains should be separated into robustness, coverage, planning, execution, and verification. Do not overread it as a universal law for frontier-scale RL, since the main empirical setup uses smaller Qwen2.5-Instruct models and high-school-level math benchmarks.
tags: reinforcement-learning, RLVR, GRPO, mathematical-reasoning, reasoning-evaluation, coverage-wall, temperature-distillation, pass-at-k, planning, execution, verification, Qwen, MATH
---

# Decomposing Elements of Problem Solving: What "Math" Does RL Teach?

## Basic info

* Title: Decomposing Elements of Problem Solving: What "Math" Does RL Teach?
* Authors: Tian Qin, Core Francisco Park, Mujin Kwun, Aaron Walsman, Eran Malach, Nikhil Anand, Hidenori Tanaka, David Alvarez-Melis
* Year: 2025
* Venue / source: arXiv preprint (cs.AI, cs.CL, cs.LG)
* Link: https://arxiv.org/abs/2505.22756
* PDF: https://arxiv.org/pdf/2505.22756
* HTML: https://arxiv.org/html/2505.22756v1
* DOI: https://doi.org/10.48550/arXiv.2505.22756
* arXiv version inspected: v1, submitted 2025-05-28
* Date read: 2026-06-20
* Date surfaced: 2026-06-20
* Surfaced via: Tracy in #pocket-reads via arXiv link
* Code: https://github.com/cfpark00/RL-Wall
* Why selected in one sentence: It attacks a live confusion in reasoning work: whether RL on verifiable math rewards teaches new reasoning or mostly makes existing solution behaviors more reliable.

## Quick verdict

Highly relevant

This paper is worth keeping because it gives a better vocabulary for RLVR math gains than "reasoning got better." Its core result is narrow but important: in the authors' experiments, GRPO mostly sharpens execution on problems the model already has some chance of solving. It flattens temperature sensitivity, reduces low-level arithmetic and logic errors, and makes sampled solutions more consistent. It does not meaningfully increase best-of-64 coverage on held-out MATH-500 problems, and it does not make the model solve genuinely new problems in the matched per-problem analysis. The paper's decomposition into Plan, Execute, and Verify is more useful than the toy benchmark numbers themselves. The caveat: the main empirical claims come from Qwen2.5-Instruct 0.5B, 1.5B, and 7B on MATH/MATH-500, with GPT-4.1-mini annotations for plan and execution. Treat it as a strong mechanistic warning shot, not as final evidence about all frontier-scale RL.

## One-paragraph overview

The paper asks what GRPO-style reinforcement learning with verifiable rewards actually changes in LLM math reasoning. Instead of just reporting Pass@1, the authors sample 64 completions per problem across temperatures, analyze per-problem precision before and after GRPO, and split problem solving into planning, execution, and verification. The main finding is temperature distillation: after GRPO, the model's chance of producing a correct solution becomes less sensitive to temperature, so correct behaviors are reproduced more reliably. But coverage, measured as the number of problems solved by at least one sample at the model's optimal temperature, does not significantly improve. Per-problem gains concentrate in medium-precision regions, especially on problems the pre-RL model already sometimes solved. The plan/execution analysis says the bottleneck on high-school MATH is often execution, not high-level planning: small models can often identify the right approach but fail while carrying it out. GRPO reduces elementary math errors, basic logic mistakes, and spurious-context sensitivity, but it does not meaningfully reduce harder high-school-level factual errors. A synthetic graph-navigation task mirrors these findings and suggests RL can improve coverage only when exploration and data diversity expose actions that generalize to structurally similar problems.

## What problem is the paper trying to solve?

The paper is trying to stop one metric from doing too much work.

Pass@1 can tell you that a model is more likely to produce a correct final answer under one decoding setup. It cannot tell you why. A Pass@1 gain might mean:

- the model learned a new plan,
- the model got better at executing a plan it already knew,
- the model got better at self-correction or verification,
- the model became more robust to sampling noise,
- or the evaluation temperature just happened to favor the post-trained distribution.

The paper's question is: which of these is GRPO actually doing in math?

That is a useful question because RLVR is now treated as the default path to "reasoning" improvements. If the improvement is mostly reliability on already-covered regions, then benchmark gains can be real while still leaving the model brittle on genuinely new problems.

## Core framing

The authors decompose problem solving into three capabilities:

- Plan: map the question to a sequence of necessary solution steps.
- Execute: correctly carry out those steps.
- Verify: detect and repair wrong solution paths.

They mostly study Plan and Execute. Verification is named as part of the framework but is not the main empirical target.

The solution-tree metaphor is useful. A math problem is treated like a path through a tree of possible intermediate steps. Planning chooses the intended route. Execution follows it without arithmetic, algebraic, or logical derailments. Verification notices when the route has gone wrong.

## Empirical setup

The main experiments train Qwen2.5-Instruct models of sizes 0.5B, 1.5B, and 7B on MATH using GRPO through VERL, following a DeepSeek-R1-style reproduction pipeline. Evaluation is primarily on MATH-500.

The important measurement choices:

- sample 64 completions per problem,
- sweep decoding temperatures from 0 to 1.2,
- compute per-problem precision as the fraction of correct samples,
- define coverage as best-of-64 success at each model's optimal sampling temperature,
- run best-of-64 sampling across 5 random seeds,
- and compare pre-GRPO versus post-GRPO per problem, not just aggregate accuracy.

This is the right instinct. If RL changes the response distribution, fixed-temperature Pass@1 is too blunt.

## Result 1: GRPO distills temperature

Before GRPO, temperature matters a lot. Higher temperatures hurt easy problems but can help hard problems by increasing exploration.

After GRPO, the precision curves flatten. The model becomes less sensitive to temperature. The authors call this temperature distillation.

The interpretation is not "the model learned all the math." It is closer to:

- the model already had some correct trajectories,
- RL made those trajectories more likely,
- and sampling now reproduces them more consistently across temperatures.

This is a real improvement. But it is a different kind of improvement than expanding the frontier of what the model can solve.

## Result 2: GRPO does not unlock new held-out problems

The coverage analysis is the most important part of the paper.

The authors define coverage as the number of problems for which at least one of 64 sampled completions is correct, evaluated at the model's optimal temperature. This tries to ask: if we give the model multiple chances, what is inside its solvable set?

Their answer: GRPO does not significantly increase coverage.

The matched per-problem analysis sharpens this. Gains are concentrated on problems with medium pre-GRPO precision. On the training subset, problems around 40% pre-GRPO precision get the biggest improvement, about 45 absolute percentage points. On the test set, the peak shifts toward problems around 60% pre-GRPO precision, where majority voting could already often succeed, and the peak gain is smaller, around 35 points. On the training subset, GRPO unlocks only two new problems. On the test set, it unlocks none.

That is the "coverage wall": RL improves reliability inside the already-partly-solvable region, but does not expand the boundary much.

## Result 3: high-school math is often easy to plan but hard to execute

The plan/execution annotation is one of the paper's better moves.

For each generated MATH-500 solution, the authors first summarize the ground-truth solution into essential high-level steps. Then GPT-4.1-mini grades whether the model's trace contains those steps. If the plan is present, GPT-4.1-mini grades whether the model executes the steps without critical math or logic errors. The authors manually inspect random examples and say the annotations align with human judgment.

The striking pattern:

- plan grades are relatively high even for small models,
- execution grades scale much more strongly with model size,
- and GRPO improves execution more than planning.

The figure gives the rough picture:

- 0.5B plan grade improves from about 59% to 71%, while execution improves from about 19% to 31%.
- 1.5B plan grade improves from about 76% to 83%, while execution improves from about 37% to 53%.
- 7B plan grade is already high, about 91% to 92%, while execution improves from about 70% to 74%.

The authors' interpretation is that for MATH-500, many failures are not from missing the whole strategy. They are from making dumb mistakes while following it. That may not transfer to olympiad or research-level math, where planning may be the harder part.

## Result 4: spurious phrasing matters more than it should

The spurious-correlation section is the messiest but most revealing part.

The authors build a visualization tool that turns multiple sampled solution traces into a branching solution tree. Looking across 30 MATH-500 questions, they observe cases where semantically irrelevant wording changes in the chain-of-thought correlate with different success probabilities.

Their example: for a circular seating problem, whether the model uses a word like "unit" versus "block" can push the rollout toward different answer paths, even though the choice is not mathematically meaningful.

This supports a bleak but plausible view of some "reasoning" traces: the model is not always carrying a stable abstract algorithm. It is often navigating a probabilistic surface where small phrase choices steer it toward learned solution patterns.

GRPO partially repairs this. When the authors annotate execution failures, GRPO reduces elementary-level factual math mistakes and basic logic mistakes. It does not meaningfully reduce high-school-level factual errors. So the RL effect looks like consistency and low-level cleanup, not deep acquisition of new mathematical understanding.

## Synthetic task

The synthetic environment is a graph-navigation analogy for math problem solving.

The model receives a problem statement that indirectly encodes an action sequence. To solve the task, it must infer the action sequence and apply those actions to an initial state using a state-action transition table. The synthetic data also includes:

- biased pretraining data,
- spurious context tokens correlated with actions,
- irrelevant context that permits memorization,
- RL train and eval splits sampled from the same distribution,
- and an autoregressive transformer trained through pretraining and GRPO.

The synthetic task is designed to reproduce three phenomena:

- temperature distillation,
- limited coverage increase,
- and a train/eval generalization gap during RL.

It succeeds at reproducing the basic pattern: GRPO robustifies high-temperature precision but only modestly improves coverage.

## When can RL improve coverage?

The synthetic task lets the authors perturb the world in ways they cannot cleanly do with real math data.

Coverage improves more when:

- the spurious context is removed,
- the action space is smaller,
- or the RL training data is larger and more diverse.

The largest conceptual takeaway is that RL can break the coverage wall when the model has access to actionable patterns that generalize to structurally similar problems. If the model cannot explore the right actions or the data does not expose reusable new paths, RL mostly tightens what is already there.

That is the nuance worth preserving. The paper is not saying RL can never teach new reasoning. It is saying that in their math setup, ordinary GRPO mostly distills existing behavior, and coverage gains require the right exploration/data conditions.

## What is actually novel?

The novelty is not a new RL algorithm. It is the diagnostic decomposition.

Useful contributions:

- measuring precision curves across temperatures instead of relying on fixed-temperature Pass@1,
- defining coverage with best-of-K sampling at optimal temperature,
- doing matched per-problem pre/post analysis,
- separating planning from execution,
- using solution-tree visualizations to expose spurious-context sensitivity,
- and validating the pattern in a synthetic task with controllable data properties.

This is a paper about how to read RL gains, not how to get a new SOTA number.

## Strengths

The paper asks the right annoying question: did RL teach something new, or did it just make the model more likely to do what it already sometimes did?

The temperature-distillation framing is especially useful because it explains why Pass@1 can rise without much coverage movement. If RL concentrates probability mass on already-known solution modes, greedy or low-sample evaluation improves. Best-of-K coverage may not.

The plan/execution split is also helpful because it breaks the folk category "reasoning" into pieces that can fail separately. A model can know the right route and still make arithmetic or logical mistakes. Another model can execute well when given a route but fail to invent one. Those are different failure modes and should not be collapsed.

The synthetic task is modest but valuable. It gives the paper a way to say not just "we observed this" but "here are conditions under which the phenomenon changes."

## Weaknesses and caveats

The main empirical setting is limited. Qwen2.5-Instruct 0.5B, 1.5B, and 7B on MATH/MATH-500 are informative but not the whole story of frontier RL. The authors acknowledge they cannot rule out emergent behavior in larger models trained with more extensive data.

MATH-500 is high-school-level competition-style math. The paper itself says planning may be much harder for advanced competition or research-level problems. So the "easy to plan, hard to execute" result should not be generalized too broadly.

The plan/execution labels depend on GPT-4.1-mini. The prompt-based grading is sensible and manually spot-checked, but it is still model-mediated annotation, not a gold human benchmark.

Coverage is measured with K=64. That is reasonable for compute, and the appendix argues it is sufficient for their setup, but "coverage wall" remains partly operationalized by the sample budget.

The synthetic task is deliberately tiny compared with real language and math. It is good for mechanism hunting, not proof that the same interventions will scale cleanly to real reasoning domains.

## What to steal

For reasoning-agent evaluation, steal these distinctions:

- Pass@1 improvement is not the same as coverage improvement.
- Best-of-K coverage is closer to "what can this model solve at all?"
- Per-problem precision curves are more informative than one aggregate score.
- Temperature sweeps can reveal whether post-training changes robustness or exploration.
- Planning, execution, and verification should be scored separately.
- RL gains should be described as robustness, coverage, planning, execution, or verification gains, not as generic "reasoning" gains.

For agent work, the analogy is obvious. A tool agent can:

- choose the right plan but botch execution,
- execute steps well but choose the wrong plan,
- produce a correct result once but fail under slight sampling or prompt changes,
- or become more deterministic without becoming more capable.

Those are different bugs. Evaluate them separately.

## Final decision

Keep.

This is a strong conceptual reference for interpreting RLVR reasoning gains. The headline is not "RL does nothing." The headline is sharper: in this setting, GRPO mostly turns shaky partial competence into more reliable execution, while leaving the solvable-problem frontier mostly unchanged. That makes it useful evidence against vague RL triumphalism and useful support for richer evaluation: coverage, temperature behavior, per-problem precision, planning, execution, and verification all need separate accounting.
