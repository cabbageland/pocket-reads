---
title: World Action Verifier: Self-Improving World Models via Forward-Inverse Asymmetry
slug: world-action-verifier-self-improving-world-models-via-forward-inverse-asymmetry
authors: Yuejiang Liu, Fan Feng, Lingjing Kong, Weifeng Lu, Jinzhou Tang, Kun Zhang, Kevin Murphy, Chelsea Finn, Yilun Du
year: 2026
venue: arXiv preprint (cs.LG, cs.AI, cs.RO)
date_read: 2026-06-21
paper_url: https://arxiv.org/abs/2604.01985
pdf_url: https://arxiv.org/pdf/2604.01985
verdict: Strong idea, simulation-bound evidence
summary: World Action Verifier tackles a very specific bottleneck in world-model learning for robots: the model needs action-labeled interactions that expose its prediction errors, but the places where it is most wrong are also where its own uncertainty or disagreement signals are least trustworthy. WAV decomposes action-conditioned prediction into state plausibility and action reachability. A video-trained subgoal generator proposes plausible future states; a sparse inverse dynamics model infers what action could reach each subgoal from action-relevant features; the forward world model rolls those actions out; and the mismatch between proposed subgoal and forward rollout decides which real interaction to collect. The paper's theoretical hook is the forward-inverse asymmetry: recovering an action from a small agent-centric slice can be statistically easier than predicting a full high-dimensional future scene. In MiniGrid, RoboMimic, and ManiSkill, WAV beats random, uncertainty, learning-progress, and dense-IDM baselines, with reported 2x sample-efficiency gains and over 22% downstream policy-performance improvement.
why_it_matters: This is a clean way to think about self-improving world models without pretending that a world model can verify itself from the same blind spots that made it wrong. The reusable idea is not the exact MiniGrid/RoboMimic stack; it is the verifier architecture: use abundant action-free video for plausible futures, use a low-dimensional inverse model for reachability, and spend robot interactions where those two disagree with the forward model. That is a useful pattern for embodied agents, active learning, offline data curation, and maybe test-time search.
final_decision: Keep. Cite it for forward-inverse asymmetry, verifier-guided exploration, and the claim that action recovery can be easier than dense future prediction in high-dimensional stochastic settings. Do not treat it as proof of autonomous self-improvement in the wild: the evidence is simulated, the method still needs environment feedback, the robot implementation is compute-heavy, and the verifier assumptions fail when action-relevant features go out of support or become action-aliased.
tags: world-models, robotics, embodied-ai, active-learning, inverse-dynamics, self-improvement, verification, video-priors, robot-learning, model-based-rl, minigrid, robomimic, maniskill
---

# World Action Verifier: Self-Improving World Models via Forward-Inverse Asymmetry

## Basic info

* Title: World Action Verifier: Self-Improving World Models via Forward-Inverse Asymmetry
* Authors: Yuejiang Liu, Fan Feng, Lingjing Kong, Weifeng Lu, Jinzhou Tang, Kun Zhang, Kevin Murphy, Chelsea Finn, Yilun Du
* Year: 2026
* Venue / source: arXiv preprint (cs.LG, cs.AI, cs.RO)
* Link: https://arxiv.org/abs/2604.01985
* PDF: https://arxiv.org/pdf/2604.01985
* HTML: https://arxiv.org/html/2604.01985v2
* DOI: https://doi.org/10.48550/arXiv.2604.01985
* Project page: https://world-action-verifier.github.io/
* Code (MiniGrid): https://github.com/world-action-verifier/wav_minigrid
* Code (robot): https://github.com/world-action-verifier/wav_robot
* arXiv version inspected: v2, submitted 2026-04-02, revised 2026-05-29
* Date read: 2026-06-21
* Date surfaced: 2026-06-21
* Surfaced via: Tracy in #pocket-reads via project page
* Why selected in one sentence: It gives a concrete verifier loop for making world models collect the interactions that expose their own action-following failures.

## Quick verdict

Strong idea, simulation-bound evidence

This is worth keeping because it identifies a real trap in world-model exploration. If a model is wrong in under-explored regions, then asking that same model for uncertainty or progress can be unreliable exactly where the exploration signal matters most. WAV gets around this by splitting verification into two easier questions: is the future state plausible, and is it reachable by some action from the current state? The subgoal generator handles plausibility using action-free video. The sparse inverse dynamics model handles reachability using a small action-relevant slice of state. Then the forward model is judged by whether it can realize the inferred action/subgoal pair. The catch is that all of the strong evidence is in simulation, and the method inherits sharp assumptions: action imprints must remain visible in the sparse verifier subset, inverse actions must be identifiable, and the OOD world must not feed back into the verifier in a way that breaks those assumptions.

## One-paragraph overview

World Action Verifier is a self-improving data-acquisition loop for action-conditioned world models. It starts from a small action-labeled robot dataset and a larger action-free video dataset. A video prior samples plausible subgoals from the current state. A sparse inverse dynamics model infers the action that would reach each subgoal, using only action-relevant features rather than the full scene. The forward world model then predicts the result of each inferred action. WAV scores candidate interactions by the discrepancy between the proposed subgoal and the forward rollout, executes the highest-disagreement action, adds the resulting transition to the action-labeled dataset, and updates both the world model and inverse model. The paper argues theoretically that sparse inverse verification can be easier than dense forward prediction when the state is high-dimensional, stochastic, and sparsely labeled. Empirically, it tests this on custom MiniGrid tasks plus RoboMimic and ManiSkill manipulation tasks. WAV improves prediction error, action-following behavior, OOD adaptation, and downstream imagination-based policy refinement relative to random, uncertainty, learning-progress, and vanilla inverse-dynamics baselines.

## What problem is the paper trying to solve?

The target problem is not generic world modeling. It is action-following under scarce robot interaction data.

A robot world model needs to predict what happens under many possible actions, not just the optimal demonstrations a policy usually takes. That is harder than imitation learning because the world model must cover bad actions, exploratory actions, rare contact events, and suboptimal behaviors. Collecting all of that action-labeled data is expensive and sometimes unsafe.

So the practical question is: which interaction should the robot collect next?

The obvious answer is "collect the interaction where the world model is most wrong." But before executing the action, the true next state is unknown. Existing proxies like uncertainty, ensemble disagreement, or learning progress can work in familiar regions, but they often inherit the world model's blind spots. Under-explored regions are exactly where a verifier is most needed and least trustworthy.

WAV tries to build a verifier that does not rely only on the forward model's own internal confidence.

## Core idea

The paper decomposes action-conditioned prediction into two factors:

- State plausibility: is the candidate future a plausible future state?
- Action reachability: could the transition from current state to that future be caused by the specified action?

This factorization matters because each side has a different data advantage.

State plausibility can use action-free video. Internet-scale or offline video has many plausible transitions even when it lacks robot action labels.

Action reachability can be lower-dimensional. To infer what action happened, a model may only need a compact slice of state: end-effector motion, gripper state, object contact, agent-centric grid cells, or other action-relevant features. It does not need to generate every pixel or every object in the scene.

That is the forward-inverse asymmetry:

- forward world model: predict the full next state from state plus action,
- sparse inverse model: recover the action from a small transition signature.

The paper's claim is that the inverse problem can remain stable when the forward problem becomes high-dimensional, noisy, or data-starved.

## Algorithm

WAV's exploration loop is goal-oriented rather than action-oriented.

An action-oriented loop would sample actions first, roll out the weak forward world model, and then ask an inverse model whether the result made sense. The authors argue that this is brittle because the first step depends on the component that is least reliable in low-data regions.

WAV reverses the order:

- sample plausible subgoals from a video-trained transition prior,
- infer actions that could reach those subgoals with a sparse inverse model,
- roll those actions forward through the world model,
- score disagreement between the proposed subgoal and the world-model rollout,
- execute the action with the largest disagreement,
- add the real transition to the action-labeled dataset,
- update the world model and inverse model.

The nice thing about this ordering is that the video prior keeps candidates on the plausible-state manifold before the forward model is asked to predict anything. The inverse model then gives candidate actions tied to plausible futures. The forward world model is the thing being tested, not the thing that defines the whole search space.

## Theory

The main paper gives a stylized linear-Gaussian argument.

A dense forward model must estimate dynamics from full state plus action. A sparse inverse model only sees the action-relevant slice of the current and next state. When both are trained with limited labeled transitions, the expected forward error versus inverse-induced error depends on three factors:

- dimensionality: full state/action dimension versus sparse verifier dimension,
- stochasticity: environment noise in full future prediction versus ambiguity in action recovery,
- sample size: finite-sample instability when labeled data is only modestly larger than the full forward input dimension.

The intuitive result is simple: WAV helps most when the full scene is large and noisy, the action imprint is compact, and action-labeled data is scarce.

The appendix adds a more structural statement. WAV works when there is a "generation-verification gap": the full state-action pair can be out of support, but the restricted action-relevant subset stays on support. For example, a robot might encounter a novel tool-object contact while its own arm and gripper motion remain familiar enough for inverse action recovery.

That is also where the failure modes come from. WAV degrades when different actions produce indistinguishable verifier-subset transitions. It fails when OOD scene variables feed back into the verifier subset, such as compliant contact changing the robot's proprioceptive dynamics in a way the inverse model has not seen.

## Experiments

The experiments are organized around five questions:

- Is inverse dynamics easier to learn than forward prediction?
- Does a sparse inverse model generalize better than a dense inverse model?
- Does the forward-inverse verifier improve world-model learning?
- Do world-model gains improve downstream policy learning?
- Does the method help adaptation to OOD robot settings with limited target data?

The baselines are:

- Random sampling,
- Uncertainty, using predictive uncertainty,
- Progress, using disagreement between consecutive world models,
- Vanilla IDM, using an inverse dynamics model without the sparsity mask,
- Oracle, using privileged ground-truth prediction loss.

## MiniGrid results

The MiniGrid setup is deliberately controlled. The authors create Key Delivery, Ball Delivery, Object Matching, and random-play EmptyEnv variants with objects, colors, noisy floor tiles, and compositional action-object splits.

The paper reports three useful robustness checks:

- sample efficiency: inverse dynamics beats forward world modeling most clearly when labeled data is scarce,
- state complexity: increasing object count hurts the world model much more than the sparse inverse model,
- stochasticity: noisy floor tiles hurt forward prediction while leaving the action-relevant inverse signal relatively stable.

The sparse inverse model also generalizes better than a vanilla inverse model on interaction-centric actions like toggle and swap. That is important because these are exactly the kinds of rare actions random sampling under-collects.

For active world-model learning, WAV and the oracle achieve the best MiniGrid prediction error, and WAV has the strongest Action Following Score. That score measures whether predicted futures remain distinguishable under different actions. The point is not just that WAV makes rollouts prettier; it better preserves the consequences of the action.

## Robot simulation results

The robot experiments use RoboMimic tasks Lift, Can, and Square, plus ManiSkill tasks PullCube, PokeCube, and LiftPeg.

The world model is Dreamer-V3-style latent dynamics. The sparse inverse model builds on CLAM-like latent inverse dynamics, with sparsity imposed on the latent action space. Training data comes from diverse diffusion-policy checkpoints, so the exploration pool includes expert-like, medium-quality, and suboptimal trajectories.

Across data budgets from 200 to 1000 trajectories, WAV gets lower 32-frame prediction error than the baselines. At the 200-sample budget, the appendix table shows WAV as the best non-oracle method on all six tasks.

For downstream policy learning, the authors refine a base diffusion policy using imagination-based search in the learned world model, following the SAILOR protocol. Policies refined with WAV-based world models generally get higher rewards than policies refined with baseline world models, especially on contact-rich tasks such as Can, Square, and PokeCube.

For OOD adaptation, the paper starts from a world model trained on RoboMimic Can and adapts with 200 target-domain trajectories. It tests:

- visual shifts: nuisance appearance changes such as background and embodiment color,
- object and interaction shifts: multiple objects and mixed-optimality demonstrations.

WAV improves normalized prediction error and downstream reward in both cases, with larger gains under object/interaction shifts. The paper reports approximately 22% downstream improvement on novel environments with new objects and interactions.

## What is actually novel?

The novelty is not "use an inverse model" in isolation. The useful package is:

- use action-free video to propose plausible futures,
- use sparse inverse dynamics to infer reachability,
- put the weak forward world model last in the verification cycle,
- choose data by forward-inverse mismatch,
- and formalize when the sparse inverse verifier should be easier than dense forward prediction.

This makes WAV closer to a verifier-guided active-learning strategy than a new world-model architecture.

## Strengths

The framing is sharp. World models need hard interactions, but their own uncertainty can be unreliable in the hard regions. WAV gives a better source of pressure: not "where am I uncertain?" but "where does a plausible, reachable future disagree with my forward rollout?"

The decomposition is reusable. State plausibility and action reachability are genuinely different questions, and the paper exploits the different data regimes available for each.

The sparse inverse story is convincing at the systems level. A robot's action imprint often lives in a much smaller space than the full generated scene. Asking a model to recover that imprint is a more modest job than asking it to hallucinate every future pixel and object state.

The experiments are better than a single benchmark win. The MiniGrid controls isolate sample size, state complexity, and stochasticity. The robot experiments then show the same direction in richer continuous-control settings.

The failure analysis in the appendix is unusually useful. The paper explicitly says when WAV helps, degrades, and fails rather than hiding everything under "future work."

## Weaknesses and caveats

This is still simulated evidence. MiniGrid, RoboMimic, and ManiSkill are useful, but they are not the same as running a real robot through messy long-horizon deployment.

The method still needs real environment feedback. Despite the "self-improving" language, WAV is not improving purely from synthetic rollouts. It chooses informative interactions, executes them, and trains on the resulting transitions.

The verifier assumptions are strong. If the action-relevant subset is no longer on support, if contact dynamics feed back into proprioception in unfamiliar ways, or if different actions produce similar subset transitions, pseudo-action recovery becomes ambiguous.

The method is more expensive than simpler acquisition strategies. The appendix says the current implementation requires three inference passes and reports roughly 40 GPU hours per robotic environment versus about 36 for baselines under comparable settings.

The robot code release is described as minimal, with broader datasets and models still listed as future updates. That does not invalidate the paper, but it does mean reproduction depth may vary by experiment.

The method's strongest gains appear where action-conditioned dynamics and rare interactions matter. On simpler tasks, the downstream policy gap is smaller. That is expected, but it limits the headline if someone tries to apply WAV where the world model is not the bottleneck.

## What to steal

For embodied-agent evaluation:

- Do not evaluate world models only by visual plausibility; score action following separately.
- Track whether different actions produce distinguishable predicted futures.
- Treat rare interaction actions as the real test, not just movement-heavy rollouts.
- Use held-out OOD compositions, not only in-distribution demonstrations.

For data acquisition:

- Sample plausible subgoals before asking the weak forward model to predict.
- Prefer verifier signals that rely on a different inductive bias than the model being tested.
- Use inverse reachability as a filter for whether a generated future is actionable.
- Spend environment interaction on high mismatch between plausible reachable future and forward rollout.

For broader self-improvement work:

- Self-improvement needs a verifier whose blind spots are not identical to the generator's blind spots.
- The useful abstraction is asymmetric verification: find a smaller or better-conditioned problem that can audit a larger harder generator.
- Be explicit about when the verifier subset remains on support and when it does not.

## Final decision

Keep.

This is a strong conceptual paper for world-model self-improvement and verifier-guided exploration. The headline should not be "robots now self-improve from vibes." The better version is: when action-free video can propose plausible futures and a sparse inverse model can reliably recover action reachability, the mismatch with a forward world model becomes a useful signal for collecting the next interaction. That is a clean, reusable idea. The evidence is still bounded by simulation, compute cost, and verifier-support assumptions, but the direction is absolutely worth tracking.
