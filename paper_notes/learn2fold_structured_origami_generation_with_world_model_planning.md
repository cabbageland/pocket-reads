# Learn2Fold: Structured Origami Generation with World Model Planning

## Basic info

* Title: Learn2Fold: Structured Origami Generation with World Model Planning
* Authors: Yunuo Chen, Ying Jiang, Jinru Han, Zhengzhong Tu, Yin Yang, Chenfanfu Jiang
* Year: 2026
* Venue / source: arXiv preprint
* Link: https://arxiv.org/abs/2603.29585
* HTML: https://arxiv.org/html/2603.29585v1
* Date read: 2026-04-06
* Date surfaced: 2026-04-06
* Surfaced via: Tracy in #pocket-reads
* Why selected in one sentence: It is a weirdly good testbed for long-horizon physical reasoning because origami has almost zero tolerance for local mistakes, so the paper’s proposer-plus-world-model setup is worth examining.

## Quick verdict

* Highly relevant

This is a strong paper, mostly because it picks a domain where handwavy “agentic” planning excuses die fast. Origami is not forgiving like cloth. One bad fold can make the rest of the sequence mathematically impossible. Learn2Fold’s core move is to split the job into semantic proposal and physical verification: let a language model propose structured folding actions, then use a graph world model plus a symbolic verifier to look ahead and reject bad branches before execution. That division of labor is clean, the task is legitimately hard, and the results suggest the system is doing real constraint-aware planning rather than just parroting tutorials.

## One-paragraph overview

Learn2Fold formulates origami generation as conditional program induction over a crease-pattern graph. The system takes a high-level semantic goal and predicts a sequence of structured fold actions, but does not trust raw language-model decoding to stay physically valid. Instead, it canonicalizes the origami state as a graph with dynamic fold-state variables, trains a language-model policy to propose tokenized folding actions, trains a graph-structured world model to predict residual state transitions and soft constraint violations, and then runs both inside an MPC-style inference loop. At test time, the language model proposes candidate fold programs, a deterministic symbolic simulator filters out invalid folds, and the world model scores the surviving candidates by imagined future feasibility and goal progress. The result is a neuro-symbolic planner for origami that is explicitly built around long-horizon geometric validity instead of visual plausibility.

## Model definition

### Inputs
- a high-level semantic goal describing the target origami
- a crease pattern represented as a planar graph of vertices and edges
- the current dynamic folding state, including fold angles, progress ratios, crease labels, frame angle, flip flag, and step counter

### Outputs
- a sequence of structured folding actions / folding program tokens
- predicted next-state rollouts over origami graph states
- feasibility / violation estimates used to rank candidate actions

### Training objective (loss)
The system has at least two core learned pieces.

**Policy model:** supervised maximum-likelihood training on expert folding demonstrations, treated as conditional program induction over structured action tokens.

**World model:** supervised state-transition prediction over graph states, learning residual updates plus soft constraint-violation predictions from simulator-generated folding transitions.

The important thing is not one unified end-to-end loss. The important thing is that proposal and verification are trained as separate components and fused during planning.

### Architecture / parameterization
- a **canonicalized crease-pattern graph** representation for origami state
- a **language-model proposal policy** that outputs structured folding actions in a unified token space
- a **graph-based world model** that predicts sparse residual state updates and soft violation masks
- a **Level-0 symbolic simulator** for exact constraint checking
- an **MPC-style inference loop** that samples candidate actions, filters invalid ones, rolls out future states, and ranks actions by proposal likelihood, goal progress, and feasibility

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
Generate physically valid origami folding sequences from sparse semantic descriptions like text.

That sounds niche, but it is actually a clean version of a broader problem: how do you generate long-horizon executable procedures when the domain has **hard geometric constraints** and very little tolerance for local error?

Origami is a brutal setting for this because:
- folds change topology and geometry over time
- mistakes compound irreversibly
- “looks plausible” is not good enough
- one invalid step can destroy the rest of the plan

So the deeper problem is not just origami. It is constraint-aware sequential generation under hard physical rules.

### 2. What is the method?
The method is a three-part neuro-symbolic planning system.

**Part 1: canonical graph state.**  
Represent the origami instance as a crease-pattern graph plus dynamic state variables such as fold angles, crease progress, and fold labels.

**Part 2: language-model proposer.**  
Train an autoregressive policy that generates structured folding actions as token sequences, conditioned on the semantic goal and current canonicalized state.

**Part 3: graph world model + hard verifier.**  
Use a learned graph world model to simulate short-horizon consequences of proposed actions, then combine that with a symbolic Level-0 simulator that rejects physically invalid actions exactly.

At inference time:
1. sample candidate actions from the proposal model
2. hard-filter them with the symbolic simulator
3. score the valid ones with world-model rollouts plus proposal likelihood and goal progress
4. choose the best action under an MPC-style objective

So it is not “LLM does origami.” It is “LLM proposes, world model looks ahead, symbolic kernel enforces reality.”

### 3. What is the method motivation?
Because neither of the obvious families is enough by itself.

- **LLMs / generative models** are good at semantic structure and high-level planning, but bad at exact physical validity
- **optimization / computational origami solvers** can satisfy geometry, but usually require very precise inputs and do not flex well from sparse semantic prompts

The paper’s core claim is that proposal and verification should be decoupled.
That is the right instinct. Let the language model contribute semantic planning priors, but do not let it pretend to be a physics engine.

### 4. What data does it use?
The paper builds a simulator-driven dataset called **OrigamiCode**.

Reported scale in the paper:
- about **5,760 origami process sequences**
- about **75,000 trajectories** total in the dataset
- about **76,000 transitions** for world-model training from expert demonstrations plus perturbations
- about **10^4 expert folding steps** for language-model training, augmented with simulator-verified perturbations

The benchmark covers **25 origami categories** across simple, intermediate, and complex difficulty tiers.

One thing I like here: they are not pretending internet tutorials alone solve the supervision problem. The real training signal comes from a symbolic simulator plus perturbation-generated transitions.

### 5. How is it evaluated?
The paper evaluates at both the **step level** and the **trajectory level**.

**Step-level metrics:**
- Precision
- Recall
- F1

These measure structured action prediction quality under a unified action schema.

**Trajectory-level metrics:**
- **Category Success Rate (Cat-SR)**
- **Edge-IoU** between predicted affected creases and simulator-derived ground truth

They compare against:
- an adapted **BrickGPT** rollback-style baseline
- **GPT-5.1** and **GPT-5.2** used as strong general-purpose structured-program baselines
- ablations of their own system:
  - LLM only
  - LLM + world model
  - LLM + world model + Level0Sim

This is a pretty healthy evaluation design for the problem. It checks not only “did the text sound right” but “did the sequence remain executable and affect the right structure.”

### 6. What are the main results?
The headline quantitative result is that Learn2Fold beats the baselines by a lot.

Main comparison numbers reported in the paper:
- **Precision / Recall / F1 = 0.766 / 0.711 / 0.739**
- strongest reported baseline F1 is **0.266**
- **Edge-IoU = 0.582**
- **Cat-SR = 0.891**

The paper also says:
- LLM baselines often have poor precision despite sometimes reasonable recall, meaning they propose semantically related but structurally sloppy actions
- BrickGPT does better than raw LLMs early on but still struggles on long-horizon consistency
- the full system does best on long sequences and OOD crease patterns because it combines global planning pressure with hard feasibility checks

The ablation story is also telling:
- adding the world model helps long-horizon goal progress
- adding the symbolic Level0Sim then improves robustness and recovers step-level validity

That is pretty much what you would hope to see if the system decomposition is real.

### 7. What is actually novel?
The novelty is not “use an LLM for a structured task.” That part is ordinary now.

The more specific novelty is this package:
- treating origami as **constraint-aware program induction** over a crease-pattern graph
- using an **LM proposer** over structured fold tokens
- using a **graph world model** as a differentiable surrogate simulator for lookahead
- combining that with a **hard symbolic verifier** inside MPC-style inference
- building a simulator-driven origami dataset with perturbation-generated transitions

The important conceptual contribution is the proposer / verifier split under long-horizon physical constraints.

### 8. What are the strengths?
- The task is unforgiving enough that fake reasoning shows up fast.
- The proposer / verifier decomposition is clean and believable.
- The graph-state representation matches the problem better than pixel-level world modeling would.
- The evaluation checks actual execution structure, not just descriptive plausibility.
- The ablation story supports the claim that the pieces are complementary.
- It is a nice example of where neuro-symbolic design actually feels justified instead of decorative.

### 9. What are the weaknesses, limitations, or red flags?
A few.

**First:** this is still a somewhat curated domain.  
Origami is a great reasoning benchmark, but it is also cleaner than many real-world manipulation settings. Strong performance here does not automatically mean the same recipe transfers cleanly to messier embodied tasks.

**Second:** the policy side may be less important than the paper’s marketing vibe suggests.  
The symbolic simulator and the state/world-model structure are doing a lot of the heavy lifting. That is fine, but it means the “LLM” ingredient should not be oversold.

**Third:** custom benchmarks always need some caution.  
The dataset and task are sensible, but because this is not a saturated standardized benchmark, independent follow-up would matter.

**Fourth:** the paper’s writing is a bit rough in places.  
Not fatal, but it reads more like a promising research system than a fully polished finished story.

### 10. What challenges or open problems remain?
- scaling the same approach to richer material deformation beyond origami
- handling noisier, less canonical inputs than structured crease patterns
- learning stronger long-horizon value / search signals rather than relying on short-horizon MPC alone
- testing whether the same proposer-plus-verifier design works for broader constraint-heavy constructive tasks
- understanding when the learned world model adds something beyond the symbolic verifier versus mostly helping search efficiency

### 11. What future work naturally follows?
- extend the framework to other constructive physical domains with hard constraints
- swap the origami graph state for richer structured state spaces in robotics or CAD-like generation
- improve value-guided search beyond local candidate scoring
- test multimodal conditioning beyond text, such as image-to-origami or sketch-to-fold pipelines
- use the origami setting as a benchmark for grounded program induction research more broadly

### 12. Why does this matter?
Because this paper is a good counterexample to the lazy story that generative models only need bigger priors and more decoding tricks.

Sometimes the real problem is that the task has **hard state constraints**, and the model needs an explicit mechanism for proposal, imagination, and rejection.

Origami makes that painfully obvious. If a system works here, it is at least evidence that it can coordinate semantic planning with exact structural validity. That makes the paper useful well beyond paper cranes.

### 13. What ideas are steal-worthy?
- Separate **semantic proposal** from **physical verification**.
- Use a **learned world model for lookahead** even when a hard symbolic verifier exists.
- Represent constrained constructive processes as **program induction over structured state**, not just free-form sequence generation.
- Build synthetic perturbation-heavy datasets around a deterministic engine when real supervision is sparse.
- Judge long-horizon generation by whether the process remains executable, not just whether the end artifact sounds plausible.

### 14. Final decision
Keep.

This is one of the better recent examples of neuro-symbolic planning that actually earns the hybrid design. The main lesson is not “origami is solved.” It is that for long-horizon physically constrained generation, **proposal + learned lookahead + hard verification** is a hell of a lot healthier than trusting an unconstrained generator to improvise its way through exact geometry.
