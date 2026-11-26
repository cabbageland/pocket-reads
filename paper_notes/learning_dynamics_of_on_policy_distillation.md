---
title: Learning Dynamics of On-Policy Distillation
slug: learning-dynamics-of-on-policy-distillation
authors: Guan Zhe Hong, Sumeet R. Motwani, Liang Chen, Yangchen Pan, Junchi Yu, Jialin Yu, Philip H.S. Torr, Yi Ren
year: 2026
venue: arXiv preprint (cs.LG, cs.CL)
date_read: 2026-11-26
paper_url: https://arxiv.org/abs/2611.08016
pdf_url: https://arxiv.org/pdf/2611.08016v1
verdict: Keep. A falling distillation loss can accompany a failing reasoner.
summary: OPD updates change both the student and the reasoning prefixes it will train on next. This paper separates conversion of teacher requests into parameter motion from broadcast of those updates across prefixes, showing why stronger teachers can transfer less and why local teacher matching can route an unprepared student into reasoning it cannot complete. Offline preparation can improve later learnability while barely changing immediate accuracy.
why_it_matters: Evaluate preparation by the learning it enables, not just the score it immediately buys. In a controlled Qwen 1.5B dose study, one versus four offline passes changes starting strict MATH accuracy only from 45.9% to 47.1%, but the subsequent 100-step OPD endpoint rises from 45.9% to 56.2%.
final_decision: Keep as a mechanistic debugging and training-evaluation reference, not a universal OPD recipe. The strongest lessons concern supervision compatibility, continuation readiness, and separating distribution shift from fitting; the evidence is mathematical reasoning with single-seed training runs.
tags: on-policy-distillation, knowledge-distillation, learning-dynamics, reasoning, neural-tangent-kernel, gradient-coherence, offline-preparation, continuation-values, distribution-shift, post-training, AIME, MATH
---

# Learning Dynamics of On-Policy Distillation

## Basic info

* Title: Learning Dynamics of On-Policy Distillation
* Authors: Guan Zhe Hong, Sumeet R. Motwani, Liang Chen, Yangchen Pan, Junchi Yu, Jialin Yu, Philip H.S. Torr, Yi Ren
* Institutions: University of Oxford, EPFL, City University of Hong Kong
* Year: 2026
* Venue / source: arXiv preprint, cs.LG and cs.CL; not treated here as a peer-reviewed acceptance
* Link: https://arxiv.org/abs/2611.08016
* PDF: https://arxiv.org/pdf/2611.08016v1
* DOI: https://doi.org/10.48550/arXiv.2611.08016
* Version inspected: v1, submitted November 5, 2026; 54-page PDF including references and appendices
* Date read: 2026-11-26
* Date surfaced: 2026-11-26
* Surfaced via: Tracy's Pocket Reads request, direct arXiv PDF
* Reading basis: downloaded paper; main text, methodological clarifications, response-law assumptions, and experimental protocols/results in appendices A, C, D, E, and F. No experiments were rerun.
* Code availability: no code-release link identified in the inspected paper; this is not an implementation audit.
* Why selected in one sentence: It explains why learning to imitate a teacher locally can make a student worse globally, and why apparently unproductive offline training can prepare a much better subsequent learner.

## Quick verdict

Keep. A falling distillation loss can accompany a failing reasoner.

The paper's useful move is to stop treating on-policy distillation as ordinary supervised learning with a better data source. The learner is also changing the source. Its current update determines which reasoning histories it generates next, which determines what the fixed teacher will say next, which determines the next update. Good local supervision is not automatically a good closed-loop curriculum.

There are two distinct ways this goes wrong. A teacher can ask for changes that the student's current parameter geometry cannot efficiently express, or whose gradients cancel across prefixes. Alternatively, the student can change a lot, but in the wrong way: suppressing early answers and extending reasoning that it cannot execute, then learning to match a teacher conditioned on those increasingly confused histories.

The most interesting intervention is deliberately unglamorous: offline distillation before OPD. Warm-up is not new. What is worth preserving is the argument and evidence that preparation can improve **continuation readiness** without much immediate benchmark improvement. The student becomes better prepared for the states that later online updates will expose.

This is a strong explanatory paper, not a general convergence guarantee or a new SOTA training algorithm. Its equations provide a useful accounting language; its experiments make several mechanisms observable. They do not establish a seed-robust, domain-general predictor of OPD success.

## One-paragraph overview

On-policy distillation trains a student to match a fixed teacher's next-token distribution on student-generated trajectories. The paper decomposes the resulting feedback loop into conversion and broadcast. Conversion asks whether a teacher-induced logit-space request is accessible through the student's Jacobian and whether per-prefix parameter gradients reinforce each other. Broadcast asks how the shared-parameter update changes predictions and visitation probabilities at other prefixes, including the quality of future training data. A routing/drift decomposition separates changing which prefixes are visited from changing predictions on the same prefixes, while a continuation-advantage identity connects delivered policy changes to final answer correctness. Experiments contrast healthy and stalled teacher pairings, diagnose a weak student's degeneration despite loss reduction, and compare offline continuation with OPD after matched preparation. Across three student/teacher pairs, prepared OPD improves sampled AIME coverage and average success; a preparation-dose study shows substantial differences in later OPD performance despite similar initial accuracy.

## What problem is the paper actually solving?

Three puzzles motivate the work:

1. **Why can a stronger teacher transfer less?** A larger model may score better itself and disagree strongly with a student, yet produce little improvement when used for OPD.
2. **Why can matching the teacher make reasoning worse?** Loss measures local distributional agreement, not whether the student can successfully complete the reasoning that its new token choices initiate.
3. **Why can extra offline training look useless until online learning starts?** Immediate answer accuracy may not reveal whether the student is prepared to learn from the trajectory distribution that OPD creates.

The common mistake is to collapse three different objects: what the teacher requests, what the student's parameters can deliver, and what the student can achieve after taking the delivered actions.

## The mechanism: supervision is inside a feedback loop

![The paper's Figure 1: teacher requests pass through the student's tangent kernel, alter predictions and prefix visitation, and thereby reshape future supervision.](https://raw.githubusercontent.com/cabbageland/i-read-something/main/assets/method_figures/learning_dynamics_opd_loop.png)

*Source: Figure 1, PDF page 2, cropped from the original paper. The two failure paths are limited response to requests and substantial but harmful motion into unreliable continuations.*

### 1. A teacher request is not a parameter update

Let `s` be a prefix: the prompt plus an unfinished response. The student distribution is `p_theta(a | s)` and the fixed teacher is `q(a | s)`. The reference per-prefix objective is reverse KL:

```text
c(s) = KL(p_theta(. | s) || q(. | s))
ell(s,a) = log p_theta(a | s) - log q(a | s)
B(s,a) = -d c(s) / d z(s,a)
       = p_theta(a | s) [E_p ell(s,.) - ell(s,a)]
```

`B` is the teacher-induced request in logit space. It is not simply the raw log-probability gap: the student's probability weighting and softmax coupling matter.

If `Phi(s) = d z(s) / d theta` is the logit Jacobian, the request becomes the parameter-space direction `g(s) = Phi(s)^T B(s)`. Averaging over the current training-prefix distribution `mu` gives `u = E_mu g(s)`.

There are already two bottlenecks. A request may lie in directions the student's current Jacobian expresses weakly. Even if requests are individually expressible, their parameter gradients can cancel when aggregated.

### 2. Conversion separates pressure, accessibility, and coherence

On a fixed prefix population, the paper defines:

```text
P  = E ||B(s)||^2                          request pressure
A  = E ||g(s)||^2 / P                      accessibility
C  = ||E g(s)||^2 / E ||g(s)||^2           coherence
Xi = ||u||^2 / P = A * C                  collective conversion gain

||u||^2 = P * A * C
```

These answer different questions:

* **Pressure:** how much numerical correction is being requested?
* **Accessibility:** how much parameter motion can an individual request produce through this student's tangent map?
* **Coherence:** how well do those parameter directions add up across prefixes?
* **Conversion gain:** how much collective response is delivered per unit request energy?

This makes a diagnostic trap explicit. Two runs can have comparable gradient norms, while one has much higher pressure compensating for worse coherence. A large gradient does not prove a useful or efficient teacher/student match.

These quantities depend on the parameterization, sampled prefixes, token coordinates, and request definition. They are comparative diagnostics within a controlled setting, not universal scores for ranking arbitrary models.

### 3. Broadcast changes prefixes that were never supervised

The same parameters control many prefixes. Define the cross-prefix tangent kernel:

```text
K(x,s) = Phi(x) Phi(s)^T
```

Under raw gradient flow, the logit velocity at any receiver prefix `x` is:

```text
v(x) = d z(x) / dt = sum_s K(x,s) mu(s) B(s)
```

The kernel is a coupling induced by shared parameters, not a new attention module. Updating on one prefix can alter a different prefix even when the latter was absent from the training batch.

This matters twice. The update changes what the student predicts **at** a reasoning state, and it changes the ancestor token decisions that determine whether the student will **reach** that state. The teacher remains fixed, but the questions implicitly posed to the teacher are changing.

For a fixed-support temperature sampler, token log-probability velocity is `zeta(x,a) = (e_a - pi(. | x))^T v(x) / temperature`. Summing that velocity over a prefix's ancestors gives its log reach-probability velocity. Autoregression turns local changes into a reweighting of future training histories.

### 4. Routing and drift distinguish changing the data from fitting it

For a local measurement `Y_t(x)`, such as loss or entropy, let `J(t) = E_{x~nu_t} Y_t(x)`. Its derivative separates into:

```text
dJ/dt = sum_x [d nu_t(x)/dt] Y_t(x) + E_nu [d Y_t(x)/dt]
      = routing                            + drift
```

* **Routing:** the model visits a different mixture of prefixes.
* **Drift:** its predictions change on the same prefixes.

The empirical implementation uses a four-cell cross-scoring experiment. Save rollout banks from checkpoints `a` and `b`; score each bank with each checkpoint. If `M_ij` means bank `i` evaluated by model `j`, then:

```text
R_hat = [(M_ba - M_aa) + (M_bb - M_ab)] / 2
D_hat = [(M_ab - M_aa) + (M_bb - M_ba)] / 2
R_hat + D_hat = M_bb - M_aa
```

The sum is an exact finite-endpoint identity. The individual terms are a symmetric allocation of the endpoint change, not an exact recovery of the continuous training path. The paper uses roughly 20-update windows because scoring every step is expensive; Appendix C.7 gives the path-limit distinction.

This is one of the most reusable methods in the paper: do not infer learning dynamics from a loss curve whose evaluation data changes with the learner.

### 5. Correctness depends on the student's continuation advantage

Final answer correctness is not a prefix-local measurement. Let `Q(x,a)` be the student's expected terminal score after taking token `a` at `x`, and `V(x)` its current expected score from `x`. Then the outcome derivative weights policy motion by the student's continuation advantage:

```text
d E[terminal score]/dt
  = sum_x reach(x) * E_{a~pi}[zeta(x,a) * (Q(x,a) - V(x))]
```

The important word is **student's**. A teacher may sensibly prefer a token under its own strong continuation policy, while the student cannot execute what follows. Making that token more likely does not import the teacher's downstream competence.

The paper does not directly measure this full expression at every token; that would require prohibitively expensive continuation estimates. It triangulates it using selected decision-boundary probes and fixed-reference continuation experiments. The identity is exact under its assumptions; the empirical attribution is narrower.

## Study 1: stronger teachers can induce weaker transfer

### Pairings and controls

For each student scale, the starting student and OPD recipe are held fixed while the teacher changes:

| Student | Healthy pairing's teacher | Stalled pairing's larger teacher |
| --- | --- | --- |
| DeepSeek-R1-Distill-Qwen-1.5B | JustRL-1.5B | DeepSeek-R1-Distill-Qwen-7B |
| DeepSeek-R1-Distill-Qwen-7B | AceReason-Nemotron-7B | DeepSeek-R1-Distill-Qwen-14B |

The comparison evaluates AIME 2024's 30 problems at temperature 0.6, with 16 responses/problem for 1.5B and four for 7B. This is separate from the pooled AIME-2024/2025 preparation study below.

### What the teachers ask for differs

On fixed initial-student rollouts, the RL-sibling teachers' largest requests concentrate more on sentence openings and reasoning-control moves: initiating checks, flagging doubt, reframing, or opening plans. The larger distilled teachers put relatively more weight on technical interiors, including derivation, recall, and digit-bearing positions.

That is a descriptive difference, not proof that technical supervision is intrinsically bad. The semantic categories were assigned with an LLM judge; no direct intervention selectively swapping control and technical request fields establishes their causal superiority.

### The 7B bottleneck is chiefly coherence

In sampled CONTROL and TECHNICAL strata, healthy 7B has **2.75–3.24 times greater coherence** and **2.27–2.62 times greater conversion gain** than the stalled pairing. Accessibility is somewhat lower, not universally higher. The stalled run's higher request pressure hides its poorer conversion behind a comparable or larger gradient norm.

Each class/teacher conversion estimate uses 80 positions. Local kernel measurements backpropagate through all student parameters, but only at sampled positions from eleven initial rollouts. This is not a full-corpus geometry census.

### At 1.5B, responsiveness also evolves

The authors freeze initial requests, prefixes, and token coordinates, then reapply those requests at later checkpoints. That prevents changing disagreement from masquerading as changing student geometry.

Healthy 1.5B first reorients its leading kernel subspace: by step 50, leading strength is nearly unchanged while overlap with the initial leading-three subspace falls to about 0.77. By step 200, leading strength is 2.31 times baseline and median sensitivity along the fixed requests is 2.08 times baseline. The stalled run contracts to about 0.67 times leading strength and 0.83 times median sensitivity.

Healthy 7B looks different: mostly amplification of existing directions, with leading strength 1.25 times baseline and subspace overlap about 0.96. There is no single universal geometric story even across these two scales.

**What this supports:** teacher utility depends on compatibility with the student's current and evolving response geometry, not just teacher accuracy, model size, disagreement magnitude, or gradient norm.

## Study 2: a student can fit its way into worse reasoning

The broadcast analysis uses the same JustRL-1.5B teacher with three learners: a reasoning-distilled DeepSeek 1.5B, unprepared Qwen2.5-1.5B-Instruct, and that Qwen model after four offline preparation passes. The Qwen runs use 256 rollouts/update, temperature 1, an 8,192-token generation cap, and 200 updates; DeepSeek has a 4,096-token cap.

### Phase one: the weak student is routed into unfamiliar long reasoning

The teacher discourages premature answer commitment. The unprepared student begins longer continuations, but it cannot keep those histories coherent. The deeper prefixes are highly uncertain for the student and also elicit less concentrated teacher predictions.

From initialization to update 20, local loss rises by about 0.268 nats: routing contributes `+0.455`, overwhelming drift of `-0.187`. The early loss rise is mostly a change in what the student encounters, not simply failure to fit a fixed set of prefixes.

### Phase two: loss falls by fitting those unreliable histories

Appendix Table 6 reports these cumulative measurements through batch 161:

| Learner | Local loss, initial → final | Loss routing | Loss drift | Entropy, initial → final |
| --- | --- | --- | --- | --- |
| DeepSeek reasoning student | 0.263 → 0.015 | -0.033 | -0.214 | 0.664 → 0.707 |
| Unprepared Qwen | 0.579 → 0.073 | +0.474 | -0.980 | 0.650 → 3.988 |
| Prepared Qwen | 0.707 → 0.362 | +0.108 | -0.453 | 2.171 → 0.842 |

Values are rounded independently. Both good and bad runs can have substantial drift-driven loss reduction; what matters is the population on which fitting occurs and its relation to successful continuations.

The especially revealing control fixes batch-41 prefixes. On this identical text, unprepared Qwen's loss falls from **0.789 to 0.057**, and its entropy falls from **4.987 to 3.989 nats**. Teacher entropy is **2.859 nats**.

So the diagnosis is not “every update uniformly makes the student more random.” At fixed prefixes it is sharpening and fitting. Aggregate uncertainty has risen mainly because it is generating and revisiting different, worse histories.

### Answer-boundary probes reveal the missing downstream skill

The authors take 86 answer-boundary prefixes from initial-student rollouts on 50 held-out MATH problems. They force either the answer token or the model's most probable non-answer token, or allow an unconstrained continuation, using six samples per condition.

| Evaluator | Forced-answer correctness | Forced-continue correctness | Natural correctness |
| --- | --- | --- | --- |
| Initial student | 30% | 22% | 27% |
| Update 20 | 30% | 29% | 29% |
| Update 100 | 34% | 3% | 6% |
| Update 200 | 39% | 13% | 17% |
| Teacher | 42% | 58% | 60% |

At update 100, the model favors continuing even though that branch almost never leads to a correct answer. The main text's **8%** figure is the rate of producing **any answer** from the continue branch, not 8% correct; correct answers are only **3%**. That distinction matters.

The teacher can complete such continuations successfully. The student's problem is not merely choosing an objectively impossible branch; it has failed to acquire or preserve the skill required to execute it. By update 200 there is partial recovery, so the entire training trajectory should not be described as monotonic collapse.

These are selected-prefix probes, not whole-benchmark rates. The forced non-answer token can differ between checkpoints, and natural sampling is not exactly the mixture of the two forced branches. The paper explicitly keeps those quantities separate.

### A fixed continuer separates worse histories from worse execution

A complementary experiment generates prefixes from trained checkpoints, cuts at 256, 512, or 1,024 tokens, and lets the **initial student** finish them. Holding the continuer fixed makes its success a reference-relative measure of the new prefixes' difficulty.

At update 50, the 256-token prefixes are still slightly easier for the initial student than its own: `+2.1` percentage points. At depth 1,024, they are already `-8.1` points worse. By update 200, deficits appear at all three depths: `-5.9`, `-6.1`, and `-8.5` points. The initial policy's own-rollout baseline in this experiment is 48.4%.

There are therefore two losses: the policy generates harder-to-rescue histories, and its own downstream continuation policy also becomes worse. The 48.4% baseline belongs to this separate 250-problem, fixed-budget experiment; it should not be mixed with the 86-prefix probe above.

### Healthy learning is conditional, not simply more “wait”

The stronger DeepSeek student learns to suppress WAIT-family initiation where it initially overuses it and increase it where it underuses it relative to the teacher. Binary teacher disagreement declines on fixed and held-out prefix banks.

Prepared Qwen is less tidy: early entropy and checking overshoots are followed by recovery, and calibration remains imperfect in some overuse groups. Preparation does not eliminate distribution movement or produce uniformly perfect teacher matching. It makes those excursions more recoverable.

## Study 3: preparation buys learnability, not just a higher starting score

### The protocol is more specific than “do some SFT first”

There are three student/teacher pairs:

* Qwen2.5-1.5B-Instruct / JustRL-1.5B.
* Qwen2.5-7B-Instruct / AceReason-Nemotron-7B.
* Llama-3.1-8B-Instruct / Llama-3.1-Nemotron-Nano-8B-v1.

Within each pair, tokenizers share a vocabulary. Preparation trains on **teacher-generated** OpenMathInstruct-2 solutions using forward KL on the teacher's recorded top-16 next-token support. Each corpus contains 32,768 solutions; 512 steps of 256 sequences makes four passes, or 131,072 sequence presentations. The reported offline optimizer is AdamW at learning rate `1e-6`, betas `(0.9, 0.95)`, no weight decay, clipping at 1.0.

From the same prepared checkpoint, the student then either continues offline distillation or switches to OPD on matched DAPO-Math-17k prompt blocks. OPD samples four responses for each of 64 prompts per update. The continuation budgets are 200 updates at 1.5B, 100 at 7B, and 200 for Llama, with 256 sequence presentations/update in both arms.

The controls match **prompt blocks, optimizer steps, and sequence presentations**. They do not establish equal FLOPs, equal generated-token counts, or identical sequence-length budgets. The offline and online arms also use different implemented objectives and trajectory sources; this is a comparison of recipes, not an isolated intervention on visitation alone.

### Prepared OPD improves AIME success and sampled coverage

Evaluation pools 60 AIME 2024/2025 problems and draws 32 responses/problem at temperature 0.6, top-p 0.95, with a 16,384-token cap. Answer extraction is lenient: boxed answers or explicit answer markers can count. Table 12 reports:

| Student | Prepared checkpoint pass@1 | Continued offline pass@1 | Prepared + OPD pass@1 | Offline pass@32 | OPD pass@32 |
| --- | --- | --- | --- | --- | --- |
| Qwen 1.5B | 0.99% | 0.78% | 2.81% | 8.33% | 18.33% |
| Qwen 7B | 13.02% | 19.06% | 26.93% | 43.33% | 60.00% |
| Llama 8B | 3.85% | 3.49% | 6.93% | 23.33% | 35.00% |

The absolute 1.5B results remain weak; a large relative gain should not hide that. The strongest absolute comparison here is Qwen 7B: OPD adds **7.87 percentage points pass@1** and **16.67 points pass@32** over continued offline training.

Coverage counts rise from 5 to 11, 26 to 36, and 14 to 21 problems for Qwen 1.5B, Qwen 7B, and Llama respectively. The 7B count of problems solved in at least half of the samples rises from 10 to 15, and problems solved in all 32 samples rise from one to five.

The paper thus finds more than extra lucky hits: observed per-problem reliability also shifts. But 32 successes are not proof of a true success probability of one, and zero successes do not prove a problem is outside the model's support. These are finite-sample coverage and reliability measurements.

Year-separated paired intervals are not uniformly positive. Qwen 1.5B's AIME-2025 gain includes zero, as does Llama's AIME-2025 pass@1 gain. Qwen 7B has positive pass@1 intervals in both years. All uncertainty is conditional on the trained checkpoints and sampled outcomes, not across independent training seeds.

### The preparation-dose study is the conceptual highlight

This is a separate evaluation: strict pass@1 on the **first 250 MATH-500 problems**, using four responses/problem. It should not be reported as a full-500-problem test or conflated with lenient AIME scoring.

| Student | Offline passes | After preparation | After subsequent OPD |
| --- | --- | --- | --- |
| Qwen 1.5B | 1 | 45.9% | 45.9% |
| Qwen 1.5B | 2 | 45.7% | 53.0% |
| Qwen 1.5B | 4 | 47.1% | 56.2% |
| Qwen 7B | 1 | 68.3% | 82.3% |
| Qwen 7B | 2 | 69.3% | 82.8% |
| Qwen 7B | 4 | 71.1% | 85.3% |

The 1.5B endpoints all use OPD update 100. Its four-pass endpoint has a problem-bootstrap 95% interval of 51.0–61.4%; the one-pass endpoint is 40.9–50.9%.

For 7B, the endpoints are **best evaluated checkpoints** within 100 steps, specifically steps 30, 50, and 90. Those intervals do not correct for checkpoint selection. It is not a uniform step-100 comparison across both scales.

The clean interpretation is not that offline learning did nothing. It did little to the measured starting answer accuracy, but changed something valuable for subsequent online learning. “Continuation readiness” is the mechanistic interpretation supported by the earlier probes, not a directly validated scalar measurement or a complete isolation of all possible preparation effects.

## What is genuinely new, and what is not?

**Not new:** knowledge distillation, learning on student states, reverse-KL OPD, offline warm-up, tangent-kernel response laws, or policy-gradient advantage weighting individually.

**The contribution:** a connected account of how teacher requests are converted into parameter motion, broadcast across prefixes, and fed back into the future supervision distribution. The paper links previously separate tools to explain two distinct failure modes and motivates diagnostics and an intervention.

The empirical contribution is strongest where comparisons distinguish explanations: fixed initial requests separate geometry from changing disagreement; crossed rollout banks separate data movement from fitting; forced continuations separate local branch preference from execution skill; preparation-dose comparisons separate immediate performance from later trainability.

## Limits and things not to overclaim

1. **Single training seed per run.** The authors report about 4,000 GH200 GPU-hours and acknowledge that they have not quantified run-to-run training variation. Problem/prefix bootstrap intervals do not fix that omission.
2. **Mathematical reasoning only.** There is no demonstrated transfer of these diagnostics to code, agents, dialogue, vision, safety behavior, or long-horizon real-world control.
3. **Small and selected diagnostic banks.** Eleven initial rollouts, sampled kernel positions, and 86 selected answer boundaries are informative probes, not exhaustive measurements.
4. **Theory versus actual optimization.** The simple `K * request` expression assumes raw gradient flow; finite-step behavior has a Taylor remainder. Momentum, preconditioning, clipping, and weight decay require the realized parameter update rather than blindly substituting the raw gradient.
5. **Full-distribution KL versus implemented/audit fields.** The exact reverse-KL request formula is a full-vocabulary identity. Appendix C warns that top-support losses and detached surrogates require their own complete numerical logit derivatives. Do not assume every recorded diagnostic request is an exact full-vocabulary reverse-KL gradient.
6. **Sampling-support assumptions.** Smooth reach-probability identities assume fixed allowed token sets. Support switches, such as changing truncation, require extra accounting; finite endpoint cross-scoring is less restrictive but remains an attribution convention.
7. **Local accounting is not an independent causal intervention.** Routing and drift are two views of the same shared-parameter update. Their exact sum does not prove that selectively removing one component would preserve everything else.
8. **Teacher uncertainty is not the whole failure story.** The important evidence includes the shifting source and the student's continuation values. High entropy alone is not a sufficient diagnosis; prepared Qwen can recover from an early entropy spike.
9. **Budget and checkpoint caveats matter.** Matched update/sequence counts are not matched compute. The 7B preparation-dose results select checkpoints. These details limit recipe-level comparisons.
10. **No universal early-stop rule is established.** Accessibility/coherence are promising diagnostic axes, not a calibrated threshold that is shown prospectively to predict arbitrary future failures.

## What I would steal for a training workflow

These are practical extrapolations from the paper, not additional reported results.

### Keep an evaluation bank whose data does not follow the learner

Log loss and entropy on both fresh rollouts and fixed prefix banks. If they diverge, cross-score checkpoint/bank pairs before concluding that an update is increasing uncertainty or improving behavior.

### Select teachers by delivered learning, not their own leaderboard score

Use short matched pilot runs. Inspect whether teacher requests have usable gradient coherence and whether responsiveness to a frozen request field improves or decays. The full Jacobian audit is expensive; simpler conversion estimates can still be more informative than raw gradient norms.

### Treat “continue thinking” as an action with an execution cost

At representative stopping boundaries, compare answer-now and continue branches under the **student's** continuation policy. More tokens, more checking language, and better teacher agreement are not sufficient evidence of more successful reasoning.

### Evaluate warm-up by an adaptation curve

For multiple preparation doses, retain both the starting score and performance after a fixed later OPD budget. If only the former is measured, preparation that builds future learnability can look wasteful. Also report total tokens/compute and multi-seed variation before turning this into a production recipe.

### Separate a stalled learner from a degenerating one

If requests barely convert into motion, investigate accessibility and coherence. If there is strong motion but outcomes worsen, inspect visitation shift, stopping decisions, and downstream continuation competence. Those are different problems and should not automatically receive the same fix.

## Questions worth following up

* Can a cheap, prospectively measured continuation-readiness score predict later OPD benefit better than current accuracy, loss, or response length?
* Do the conversion diagnostics predict teacher utility across independent seeds and new domains, rather than explain selected healthy/stalled runs retrospectively?
* Under truly matched token/FLOP budgets, how much of the offline-preparation benefit survives?
* Could teacher interventions condition on the student's achievable continuation value, rather than only the teacher's preferred next-token distribution?
* Would a mixture of teacher-state and student-state training prevent destructive routing without first requiring four full offline passes? This paper motivates that experiment; it does not settle it.

## Final decision

Keep as a reference for debugging post-training feedback loops and evaluating preparation. The paper's best insight is not “offline good, online dangerous.” It is that **making a continuation likely, fitting a teacher on it, and being able to complete it successfully are different achievements**. OPD works when the loop turns those achievements into each other; it fails when local imitation outruns the student's ability to carry the reasoning through.

The preparation result adds a second durable lesson: a checkpoint can be only slightly better at today's benchmark and substantially better at learning tomorrow. Immediate accuracy is not a complete measure of what training bought.

## Source map

* Sections 2–3.1, PDF pp. 3–4: OPD setup, request field, response law, feedback loop.
* Section 3.2 and Appendix D, PDF pp. 5–7 and 35–42: teacher pairing, semantic requests, pressure/accessibility/coherence, evolving kernel geometry.
* Section 3.3 and Appendix E, PDF pp. 7–11 and 43–51: routing/drift, weak-student degeneration, WAIT behavior, answer-boundary probes, fixed-reference continuations.
* Section 3.4 and Appendix F, PDF pp. 11–12 and 51–54: offline preparation, matched comparison arms, pooled AIME results, dose-study protocols and tables.
* Appendix A, PDF pp. 18–19: novelty, single-seed limitation, mechanism clarifications.
* Appendix C.1–C.2, C.6–C.8, PDF pp. 23–25 and 29–33: exact versus implemented request fields, optimizer scope, support changes, finite-endpoint versus path accounting, continuation-value identity.
