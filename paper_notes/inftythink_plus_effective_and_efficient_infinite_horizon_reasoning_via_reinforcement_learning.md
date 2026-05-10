# InftyThink+: Effective and Efficient Infinite-Horizon Reasoning via Reinforcement Learning

## Basic info

* Title: InftyThink+: Effective and Efficient Infinite-Horizon Reasoning via Reinforcement Learning
* Authors: Yuchen Yan, Liang Jiang, Jin Jiang, Shuaicheng Li, Zujie Wen, Zhiqiang Zhang, Jun Zhou, Jian Shao, Yueting Zhuang, Yongliang Shen
* Year: 2026
* Venue / source: arXiv
* Link: https://arxiv.org/abs/2602.06960
* PDF: https://arxiv.org/pdf/2602.06960v2.pdf
* Project page: https://zju-real.github.io/InftyThink-Plus
* Code: https://github.com/ZJU-REAL/InftyThink-Plus
* Date read: 2026-05-09
* Why selected in one sentence: It pushes on a real bottleneck in long reasoning, namely how to escape context-window and quadratic-attention limits without giving up the benefits of reinforcement learning.

## Quick verdict

* Strong pick

This is one of the more useful reasoning papers in this lane because it goes after a real structural limitation, not just another benchmark-specific prompt trick. The combination of iterative summarization plus trajectory-level RL is conceptually clean, and the ablations do real work in showing that the model is learning a policy over compression and continuation rather than merely imitating a format. I am still cautious about how far the gains generalize beyond the benchmark mix here, but the framing feels durable.

## One-paragraph overview

InftyThink+ turns long reasoning into a sequence of bounded reasoning episodes connected by self-written summaries, then uses reinforcement learning to optimize that whole process end to end. Instead of pushing one flat chain of thought deeper into an ever more expensive context window, the model periodically compresses what matters, continues from the compressed state, and learns strategic decisions about when to summarize and when to stop. On the paper’s reported results, that structure gives RL a better substrate than vanilla long chain-of-thought, producing larger gains on hard reasoning benchmarks and a substantially better accuracy-efficiency tradeoff once an iteration penalty is added. The bigger idea is that long-horizon reasoning should be treated as learned state management, not just more tokens.

## TL;DR

This paper takes the earlier InftyThink iterative-reasoning format and adds the missing optimization layer: reinforcement learning over the whole multi-iteration reasoning trajectory rather than supervised imitation of a fixed summarization pattern. The central move is simple but important. Instead of making the model produce one giant chain of thought, the model reasons in rounds, periodically writes a summary of what matters, and continues from that compressed state. InftyThink+ then trains the model to decide when to summarize, what to preserve, and when to stop, using trajectory-level reward with an additional efficiency term that discourages gratuitous iterations. On their reported results, this works surprisingly well: on DeepSeek-R1-Distill-Qwen-1.5B, they claim +21.46 points on AIME24 over the cold-start InftyThink baseline under task-only RL, plus large latency reductions when the efficiency reward is turned on. The paper matters less as “yet another reasoning trick” and more as a clear argument that long-horizon reasoning should be treated like sequential decision-making over compressed state, not just longer and longer flat text generation.

## What problem are they solving?

Standard reasoning-model scaling mostly means letting the model emit longer chains of thought in one uninterrupted context. That works up to a point, but the paper argues it runs into three structural failures:

1. **Quadratic cost** from self-attention makes very long reasoning expensive.
2. **Context-length ceilings** mean some problems simply cannot fit.
3. **Lost-in-the-middle degradation** means early useful information becomes harder to use as the trace grows.

Iterative reasoning is the proposed escape hatch: break reasoning into rounds, summarize, then continue with only the query plus the latest summary. But previous iterative methods either used heuristics or supervised formatting. The authors argue that the real challenge is not formatting iterative reasoning, but learning strategy across the trajectory: when to summarize, what to keep, and how to resume productively.

## Main idea

The key idea is to turn iterative reasoning into a reinforcement-learning problem over a compressed recurrent state.

For a query, the model generates reasoning for one iteration, then emits a summary instead of dragging the entire history forward. The next round conditions on the original question plus that latest summary. This repeats until the model outputs a conclusion instead of another summary.

InftyThink+ keeps that basic InftyThink structure, then adds three training ingredients:

1. **Cold-start supervised fine-tuning** to teach the output format.
2. **Trajectory-level RL** so the model is rewarded based on the success of the whole iterative reasoning episode.
3. **An efficiency reward** so correct answers reached in fewer iterations are preferred.

The paper’s real conceptual claim is that iterative reasoning is not just a prompt format. It is a policy over when to compress and how to propagate state.

## What they actually do

### 1. The InftyThink reasoning format

In vanilla reasoning, the model emits one long chain of thought and then a final answer. In InftyThink, the model emits multiple reasoning rounds connected by summaries. At iteration `i`, the model sees the query and summary `s_(i-1)`, generates reasoning `r_i`, and either writes a new summary `s_i` or ends with the final conclusion.

That means each step sees bounded context, even if the overall reasoning process becomes long.

### 2. Cold start from transformed long-CoT data

Before RL, they synthesize training data in the iterative format by taking existing long reasoning traces, splitting them into segments, and generating intermediate summaries with another model. They add special tokens such as `<summary>` and `<history>`, then fine-tune the model to imitate this structure.

This stage teaches the model how to speak the format, but not how to use it strategically.

### 3. Trajectory-level rollout with bounded iterations

During RL, a single prompt can trigger several rounds of generation. They cap the maximum number of iterations with a hyperparameter `φ` for practicality. Rollout ends if the model outputs a final conclusion, breaks the format, or hits the max iteration cap.

This is already a notable departure from ordinary reasoning RL, because optimization is over a whole sequence of generation rounds, not one flat output.

### 4. Reward design

They use two reward components:

* **Task reward**: 1 if the final answer is correct, 0 otherwise.
* **Efficiency reward**: a quadratic penalty based on the number of iterations, so fewer iterations get more reward.

The final reward is multiplicative: incorrect trajectories get zero regardless of brevity, while correct trajectories are ranked by efficiency.

That is a reasonable design choice. It avoids rewarding premature stopping that happens to be cheap but wrong.

### 5. Shared-advantage policy gradient

They use GRPO-style optimization, but with a twist that matters for this setup: all tokens across all iterations in the same trajectory share the same trajectory-level advantage. So an early summary gets credit if it helps later reasoning succeed.

That is probably the right abstraction. In iterative reasoning, the causal contribution of an early summary is indirect but real.

## Evidence and results

The paper’s headline empirical story is that RL works better when reasoning is structured iteratively than when it is just long flat CoT.

On **DeepSeek-R1-Distill-Qwen-1.5B**:

* Under task-only RL, **InftyThink+** improves AIME24 accuracy from **29.48 to 50.94**, a gain of **+21.46**.
* The corresponding vanilla long-CoT RL gain is smaller, **26.67 to 38.75**, or **+12.08**.
* With task + efficiency reward, InftyThink+ trades off some accuracy for much lower latency and fewer generated tokens.
* The paper reports average latency dropping from **77.57s to 48.37s** relative to the cold-start InftyThink baseline when the efficiency reward is added.

On **Qwen3-4B-Base**, the same pattern reportedly holds: iterative RL improves accuracy while also offering a better effectiveness-efficiency tradeoff than vanilla reasoning RL.

They also include several ablations that are more interesting than the raw table:

1. **Adaptive summarization timing beats fixed or random interruption.**
2. **RL-trained internal summaries beat externally generated summaries**, whereas the SFT-only model benefits from external replacements.
3. **Vanilla continuation from InftyThink summaries underperforms full InftyThink+ continuation**, suggesting the policy is learning not just summaries in isolation but how to continue from them.

Those ablations support the paper’s actual thesis better than the headline benchmark numbers do.

## What seems genuinely important

### 1. It reframes long reasoning as state compression plus policy learning

This is the main thing worth stealing. Once reasoning exceeds a comfortable context window, the problem stops looking like plain next-token generation and starts looking like recurrent state management.

### 2. It gives RL a more meaningful action space than “just think longer”

A lot of reasoning RL work risks collapsing into reward for verbosity or persistence. Here, the model has more structured decisions to make: summarize now or continue, preserve which facts, stop when ready.

### 3. It attacks both quality and efficiency together

The efficiency-aware reward is not especially sophisticated, but it matters. The paper does not only ask for higher benchmark accuracy. It asks for a controllable reasoning policy that can avoid useless extra iterations.

### 4. The ablations suggest the summaries are becoming policy-coupled latent state

The “replace internal summaries with external ones” experiment is especially telling. If RL makes internal summaries better than externally written summaries, the model is not just learning to summarize well in a generic sense. It is learning summaries that are specifically useful for its own continuation dynamics.

## Where I’m skeptical

### 1. The experiments are still fairly narrow

The central reported benchmark set is math-heavy plus GPQA. That is not nothing, but it leaves open whether the gains hold for broader agentic settings, tool use, long document reasoning, or messy real-world tasks.

### 2. The gains may partly reflect scaffold advantage, not just better reasoning

Any structured recurrent scaffold can help by forcing periodic abstraction. The paper argues RL is the key ingredient, but some of the win may come from the scaffold itself making search easier.

### 3. The summaries are explicit text, which is both a strength and a weakness

Explicit textual summaries are interpretable and easy to train with, but they may be a lossy and awkward bottleneck compared to stronger latent-state or memory architectures. The paper is likely a useful stepping stone, not the final form.

### 4. Training and evaluation details are pretty stack-specific

The recipe depends on transformed supervision, bounded rollout iterations, verification scripts, and a fairly specific RL setup. I would want to know how brittle the method is under different model families and verifier regimes.

### 5. The paper’s “infinite-horizon” branding is aspirational

It is directionally fair, because the model is no longer fundamentally tied to a single flat context window. But in practice it is still bounded by summary quality, rollout cap, and accumulated policy error. This is not infinite reasoning in any strong sense.

## Relation to broader themes

This lands in an increasingly important cluster of ideas around *reasoning with memory*. Instead of asking the transformer to carry everything forward in one ever-growing tape, you periodically condense the state and continue. That has clear parallels to agent memory, recurrent world models, hierarchical planning, and externalized scratchpad control.

For cabbageland specifically, this paper is interesting because it sits near the border between reasoning-model training and agent design. If you care about agentic systems that need long-horizon coherence under finite context, this is a much more relevant direction than yet another paper whose only lesson is “larger model, more tokens.”

## My take

I think this is a good paper, and more importantly a useful paper.

It does not solve long-horizon reasoning in a grand sense. But it makes a clean case that the right abstraction is not “one giant chain of thought with more room.” It is “a sequence of reasoning episodes connected by compressed state, trained as a policy.” That is a healthier frame.

I’m also glad the paper explicitly chases efficiency rather than pretending unlimited reasoning tokens are free. If long-horizon reasoning methods are going to matter in practice, they need to negotiate the tradeoff between correctness and compute, not just dominate small benchmark tables at absurd latency.

## Bottom line

A strong Pocket Reads pick.

The paper’s biggest contribution is not merely that it adds RL to iterative reasoning. It is that it treats long reasoning as a learned control problem over summaries. That framing feels durable, and it seems more likely to matter for future agentic systems than another round of flat long-CoT scaling.