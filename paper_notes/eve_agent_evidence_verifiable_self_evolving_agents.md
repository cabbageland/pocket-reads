# EVE-Agent: Evidence-Verifiable Self-Evolving Agents

## Basic info

* Title: EVE-Agent: Evidence-Verifiable Self-Evolving Agents
* Authors: Yamato Arai, Yuma Ichikawa
* Year: 2026
* Venue / source: arXiv preprint (cs.AI, cs.CL)
* Link: https://arxiv.org/abs/2605.22905
* PDF: https://arxiv.org/pdf/2605.22905
* DOI: https://doi.org/10.48550/arXiv.2605.22905
* Date read: 2026-06-02
* Date surfaced: 2026-06-02
* Surfaced via: Tracy in #pocket-reads
* Why selected in one sentence: It turns evidence grounding from a post-hoc nicety into a reward signal for self-evolving search agents, which is exactly the kind of constraint agentic training loops need before they start eating their own generated curricula.

## Quick verdict

Strong, clean agent-training paper with a useful safety instinct

EVE-Agent is not a flashy new architecture. That is part of why it is good. The paper takes an existing self-evolving search-agent setup, keeps the backbone, retriever, search tool, and policy-optimization machinery fixed, and changes the reward so generated training examples must carry evidence that actually helps answer the generated question. The empirical gains are large on the metric that matters most here: not answer accuracy alone, and not evidence-looking text alone, but answers that are both correct and supported by a judged evidence span. The main caveat is that the verifier is still a model-mediated proxy rather than a true semantic proof of support, and the evaluation is concentrated in open-domain QA with GPT-4.1 judging evidence quality. Still, as a design pattern for self-improving agents, this is a keeper.

## One-paragraph overview

The paper studies data-free self-evolving search agents: systems that generate their own questions, answer them, and train on the resulting feedback without human-labeled QA examples. Prior systems reward a proposer for generating questions that are neither too easy nor impossible for the current solver, but that difficulty reward does not check whether the generated answer is grounded in any source text. EVE-Agent modifies this loop by requiring the proposer to emit a question, answer, and verbatim evidence span copied from the corpus or retrieved snippets. It then scores that span by a simple causal test: how much does giving the span to the current solver increase the probability of producing the target answer compared with asking the same question without the span? The selected evidence is then reused as supervision when training the solver to output both answers and evidence. On seven open-domain QA benchmarks, under matched backbone/retriever/search/compute conditions, EVE-Agent improves average answer exact match from Dr. Zero's 0.115 to 0.221, judged evidence quality from 0.195 to 0.313, and strict joint answer-plus-evidence correctness from 0.044 to 0.167.

## Model definition

### Inputs
For proposer training, a source document from the corpus, a prescribed hop count, and access to the same search tool used by the baseline self-evolving search agent. For solver training and evaluation, open-domain questions with search access, plus generated target answers and evidence spans during training.

### Outputs
The proposer outputs a generated question, target answer, and verbatim evidence span. The solver outputs an answer and a supporting evidence span.

### Training objective (loss)
The proposer is trained with HRPO using a reward that combines format validity, the inherited difficulty reward from the prior self-evolving search-agent framework, an evidence-verifier term, and a brevity bonus. The evidence-verifier term estimates the marginal gain in answer accuracy from conditioning the current solver on the proposer-provided evidence span. The solver is trained with GRPO using answer exact match plus a token-level F1 reward for recovering the proposer-provided evidence span.

### Architecture / parameterization
No new backbone architecture. The experiments use Qwen2.5-3B-Instruct for the proposer, solver, and auxiliary scorer; E5-base-v2 embeddings and FAISS-IVF over a FlashRAG Wikipedia-2018 retrieval corpus; top-3 passages per search call; and at most five assistant turns per multi-turn rollout. The central contribution is the reward and data-flow change, not model capacity.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
Self-evolving search agents can generate their own training curricula, but prior loops mainly reward question difficulty. That leaves a nasty gap: the generated question-answer pair can be useful for stretching the solver while still being unsupported, ambiguous, memorization-driven, or paired with an evidence block that looks syntactically valid but does not actually justify the answer. If those examples become training data, the agent is improving on opaque or unreliable signals.

### 2. What is the method?
EVE-Agent adds evidence verifiability to the proposer-solver loop.

The proposer now emits a triple: question, answer, evidence. The evidence span must be copied verbatim from the source document or retrieved snippets. For each valid triple, the system samples the current solver under two search-disabled single-turn conditions: with the evidence and without the evidence. If the evidence condition makes the target answer more likely, the span receives a positive verifier score. That score is combined with the usual difficulty reward, simple format reward, and a brevity term. After proposer training, the generated triples become solver-training data, and the solver is rewarded for both exact answer correctness and recovering the evidence span.

### 3. What is the method motivation?
The motivation is that search-agent self-improvement needs a verifier, but open-domain QA does not have the clean external oracles that code or math sometimes have. The paper's move is to make evidence itself the verifiable object. A span is not treated as good because it looks explanation-shaped; it is treated as good if it causally improves the solver's ability to recover the answer.

### 4. What data does it use?
Training uses the FlashRAG Wikipedia-2018 snapshot with roughly 21 million passages, encoded with E5-base-v2 and searched through FAISS-IVF. Proposer prompts are drawn from a FlashRAG NQ-HotpotQA mixture, with hop counts sampled in a 4:3:2:1 ratio for one-, two-, three-, and four-hop questions. Evaluation uses seven open-domain QA benchmarks: Natural Questions, TriviaQA, PopQA, HotpotQA, 2WikiMultiHopQA, MuSiQue, and Bamboogle.

### 5. How is it evaluated?
The paper compares four systems under matched protocols: the initial Qwen2.5-3B-Instruct backbone without search, the initial backbone with search, a faithful Dr. Zero-style prior self-evolving search-agent implementation, and EVE-Agent. Metrics are answer exact match, GPT-4.1 judged evidence support, and a strict joint metric that counts an instance only when the answer is exact-match correct and the emitted span is judged supporting. The search tool is enabled for Dr. Zero and EVE-Agent during evaluation.

### 6. What are the main results?
The strongest result is on the strict joint metric:
- Average answer exact match improves from 0.115 for Dr. Zero to 0.221 for EVE-Agent.
- Average judged evidence score improves from 0.195 to 0.313.
- Average joint answer-and-evidence correctness improves from 0.044 to 0.167.
- EVE-Agent is strongest on answer EM for five of seven benchmarks: Natural Questions, TriviaQA, PopQA, HotpotQA, and 2WikiMultiHopQA.
- It is strongest on the joint answer-and-evidence metric for six of seven benchmarks.
- The diagnostic table is useful: the prior system emits evidence spans in roughly 90-99% of cases, so the problem is not missing evidence fields. The problem is that those spans often fail to support the answer.

The exceptions matter too. Dr. Zero slightly beats EVE-Agent on MuSiQue answer EM, 2WikiMultiHopQA evidence score is mixed, and the tiny Bamboogle split favors the untrained no-search backbone on some metrics. This is not universal dominance, but the average pattern is still pretty clear.

### 7. What is actually novel?
The novelty is not "use citations." It is using the marginal effect of a copied evidence span on solver answer probability as a data-free proposer reward, then reusing that same span as solver supervision. That turns evidence from post-hoc decoration into a training-time object with a measurable utility signal.

### 8. What are the strengths?
- The method is local and controlled: same backbone, retriever, search tool, and optimization framework as the baseline.
- The paper measures the right failure mode: evidence presence is not enough; support quality matters.
- The strict joint metric is a good fit for the claim because it refuses to credit unsupported correct answers or supported wrong answers.
- The method has a nice auditability story: generated curriculum items carry inspectable source spans.
- The reward design is conceptually simple and likely portable to other search-agent training loops.
- The paper is refreshingly allergic to the idea that self-generated training data should be trusted just because it improves a headline answer metric.

### 9. What are the weaknesses, limitations, or red flags?
- The verifier is still a proxy. "This span makes the solver more likely to output the target answer" is not identical to "this span truly entails the answer."
- Evidence support is judged by GPT-4.1, so the evaluation depends on an external LLM judge rather than a fully deterministic evidence oracle.
- The system can still favor spans that leak an answer or are locally useful without being the best or most complete evidence.
- The proposer-generated target answer can be wrong during self-evolution; the verifier measures usefulness for that target answer, not oracle truth.
- The experiments are in open-domain QA with a 3B backbone, not long-horizon tool use, messy browsing, code agents, or real-world agent workflows.
- The optional corpus selector is described, but its isolated empirical contribution is not tested in the main experiments.
- Exact match is a brittle answer metric, especially for open-domain QA where aliases and compositional answers can be messy.

### 10. What challenges or open problems remain?
The big open problem is moving from evidence that helps a model answer to evidence that robustly establishes truth. Another is extending the same idea beyond short QA spans into multi-document synthesis, live web browsing, codebase tasks, scientific claims, and agent workflows where "supporting evidence" may be a chain of artifacts rather than one contiguous span. There is also an adversarial version of the problem: a proposer might learn spans that exploit the solver's biases instead of genuinely grounding the answer.

### 11. What future work naturally follows?
- Replace or supplement the LLM evidence judge with stronger entailment, retrieval, or human-audited checks.
- Test the reward on live web/search agents where the retrieval environment changes over time.
- Generalize from one evidence span to evidence graphs or multi-hop support chains.
- Add ablations for verifier coefficient, brevity bonus, corpus selector, and auxiliary-scorer variants.
- Study adversarial or degenerate evidence selection, especially answer-leak spans and misleading but model-persuasive snippets.
- Apply the same "training data must justify itself" principle to code agents, research agents, and self-improving tool users.

### 12. Why does this matter?
Because self-evolving agents are going to be dangerous in a boring way before they are dangerous in a cinematic way: they will train themselves on junk that appears useful. EVE-Agent gives a practical answer to that problem for search QA. If an agent writes its own curriculum, each example should carry the evidence that made it worth learning from.

## Why It Matters

The paper matters because it points at a standard that should become normal for self-improving agents: generated training data should be auditable. The clever part is that the audit signal does not require human labels or a new oracle; it asks whether a copied source span changes the solver's ability to answer. That is not a complete truth guarantee, but it is a real constraint, and a much better one than trusting a difficulty reward that never checks support.

### 13. What ideas are steal-worthy?
- Treat evidence as a training-time object, not a UI flourish.
- Score proposed evidence by marginal utility: answer with the span versus answer without it.
- Keep the verifier local to the reward when possible so gains are not confounded with bigger models or stronger retrieval.
- Use strict joint metrics for agent outputs that are supposed to be both correct and auditable.
- Make self-generated curricula inspectable instance by instance.

## Final Decision
Keep and revisit. This is a compact, useful paper for the self-evolving-agents thread. The mechanism is not enough to solve truthfulness, but it is the right kind of pressure: if an agent wants to teach itself from a generated example, the example should arrive with evidence that survives an actual support check.
