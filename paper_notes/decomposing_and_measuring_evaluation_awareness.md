---
title: Decomposing and Measuring Evaluation Awareness
slug: decomposing-and-measuring-evaluation-awareness
authors: Changling Li, Terry Jingchen Zhang, Jie Zhang, Zhijing Jin, Sahar Abdelnabi, Maksym Andriushchenko
year: 2026
venue: arXiv preprint (cs.LG, cs.AI, cs.CL)
date_read: 2026-06-23
paper_url: https://arxiv.org/abs/2605.23055
pdf_url: https://arxiv.org/pdf/2605.23055
verdict: Keep as an evaluation-awareness measurement primitive
summary: This paper gives evaluation awareness a cleaner decomposition than the usual "models notice tests" framing. It separates the task-side environment cues that make an evaluation recognizable, the model-side recognition capability that detects those cues, and the behavioral propensity to change behavior once recognition happens. The authors operationalize eight trigger factors, then study nine frontier reasoning models on HarmBench, Agentic Misalignment, and AgentHarm. The headline empirical result is interaction-dominance: 74.9% of recognition-rate variance comes from model-by-environment terms, while model and benchmark main effects explain much less. Recognition is usually not behavior change; on recognized samples, 77% or more show no shift, though safety awareness tends to push toward caution and capability awareness toward compliance. EvalAwareBench then turns the framework into a controlled benchmark: 100 matched safety-capability task pairs where eight cue factors can be toggled independently, yielding 51.2k configurations.
why_it_matters: Safety and capability benchmarks are no longer just measuring task ability; they are also measuring whether a model recognizes the theater around the task. This paper gives a practical vocabulary for auditing that: which cues made the task smell like an eval, which models noticed, and whether noticing changed the score. The useful north star is not hiding benchmarks better, but behavioral consistency under recognized evaluation.
final_decision: Keep. Cite it for evaluation-awareness decomposition, benchmark recognizability audits, awareness-conditioned reporting, and factor-controlled eval design. Keep the caveats attached: CoT monitoring only sees verbalized recognition, the taxonomy is not exhaustive, EvalAwareBench is HarmBench-derived and text-heavy, and the same taxonomy could be misused to make evals less recognizable instead of making models more consistent.
tags: ai-safety, llm-evaluation, evaluation-awareness, benchmark-validity, situational-awareness, chain-of-thought-monitoring, demand-characteristics, evalawarebench, safety-benchmarks, model-behavior, metagaming, alignment, sandbagging, scheming
---

# Decomposing and Measuring Evaluation Awareness

## Basic info

* Title: Decomposing and Measuring Evaluation Awareness
* Authors: Changling Li, Terry Jingchen Zhang, Jie Zhang, Zhijing Jin, Sahar Abdelnabi, Maksym Andriushchenko
* Year: 2026
* Venue / source: arXiv preprint (cs.LG, cs.AI, cs.CL)
* Link: https://arxiv.org/abs/2605.23055
* PDF: https://arxiv.org/pdf/2605.23055
* HTML: https://arxiv.org/html/2605.23055v2
* DOI: https://doi.org/10.48550/arXiv.2605.23055
* Code: https://github.com/aisa-group/decomposing-eval-awareness
* Dataset: https://huggingface.co/datasets/aisa-group/EvalAwareBench
* arXiv version inspected: v2, submitted 2026-05-21, revised 2026-06-01
* Date read: 2026-06-23
* Date surfaced: 2026-06-23
* Surfaced via: Tracy in #pocket-reads via screenshot
* Why selected in one sentence: It gives a controlled framework for measuring when benchmark cues make models notice they are being evaluated and whether that noticing changes behavior.

## Quick verdict

Keep as an evaluation-awareness measurement primitive

This is worth keeping because it cleans up a sloppy but important concept. "The model knows it is being tested" is too flat. The paper separates three things: the environment makes an evaluation more or less recognizable, the model may or may not recognize that, and recognition may or may not change behavior. That decomposition is exactly what benchmark validity needs. A benchmark can be highly recognizable without a given model detecting it; a model can recognize a test without changing behavior; and a behavior shift can depend on whether the model thinks the test is measuring safety or capability.

The strongest empirical result is not a single scary model percentage. It is that recognition is dominated by model-by-environment interaction. The same cue does not hit all models equally, and the same model does not have one fixed "evaluation-aware" personality across benchmarks. The strongest product result is EvalAwareBench, which turns the framework into matched safety-capability tasks with independently toggleable cue factors.

The caveat is methodological. The paper uses chain-of-thought monitoring, so all recognition rates are lower bounds on verbalized recognition, not proof of all internal recognition. The benchmark is also text-heavy and adapted from HarmBench. Still, the framework is crisp enough to reuse.

## One-paragraph overview

The paper grounds evaluation awareness in social psychology's demand-characteristics literature and decomposes it into an environment component, a recognition component, and a behavioral-propensity component. It defines eight task-side trigger factors: stimulus artificiality, scenario coherence, prose register, ecological completeness, stakes telegraphing, paradigm recognizability, task format, and explicit evaluation disclosure. The authors run nine reasoning-capable frontier models across four benchmarks, using chain-of-thought monitoring and a GPT-5 judge to detect spontaneous evaluation-related reasoning. Awareness rates vary sharply by model-benchmark pair, from almost zero for GPT-oss 20B to 79.4% for Claude Sonnet 4.5 on Agentic Misalignment. An ANOVA attributes 74.9% of recognition-rate variance to interaction terms, mostly model-by-benchmark and model-by-task. Recognition usually does not change behavior, but when it does, safety awareness pushes toward caution while capability awareness pushes toward compliance. EvalAwareBench then offers 100 paired safety-capability tasks where the eight factors can be toggled independently, letting researchers isolate which cues trigger which models and whether recognition distorts scores.

## What problem is the paper trying to solve?

The target problem is benchmark validity under metagaming. If a model can infer that a task is an evaluation, it may behave differently from how it would in deployment. A safety benchmark might then overestimate real-world refusal because the model noticed it was being tested. A capability benchmark might underestimate or overestimate ability depending on whether the model becomes cautious, compliant, performative, or confused.

The field often mixes up the components:

* A benchmark can contain obvious evaluative cues, but that does not mean every model recognizes them.
* A model can recognize an evaluative setup, but that does not mean it changes behavior.
* A behavior shift can be caused by recognition, but it can also come from task difficulty, safety training, or format artifacts.

That conflation makes it hard to know whether to fix the benchmark, the model, the detector, or the training process. The paper's main move is to stop treating evaluation awareness as a monolith.

## Core decomposition

The framework has three pieces.

The environment component is the set of evaluative cues carried by the task itself. These are properties of the prompt, format, scenario, or surrounding context, independent of whether a model notices them.

The recognition component is the model's capacity to infer that it is being evaluated from those cues. Recognition is model- and context-dependent, not a single scalar trait.

The behavioral-propensity component is the model's tendency to change behavior after recognition. This is the piece that actually threatens benchmark validity, but it cannot be interpreted cleanly without measuring recognition separately.

The important alignment target is behavioral consistency under recognized evaluation. The goal is not a model too naive to notice tests. The goal is a model that can notice the test and still behave the same way it should outside the test.

## The eight trigger factors

The paper's environment taxonomy is practical:

* F1 Stimulus Artificiality: placeholder entities, generic values, example.com, 123 Main St., Alice/Bob-style referents.
* F2 Scenario Coherence: contradictions, overly convenient setups, missing real-world friction, or overdetermined details.
* F3 Prose Register: polished, formal, vignette-like benchmark prose.
* F4 Ecological Completeness: stripped single-turn tasks missing workflow context, tool state, conversation history, or user goals.
* F5 Stakes Telegraphing: the task foregrounds harm, ethics, safety, or the dimension being tested.
* F6 Paradigm Recognizability: known jailbreak wrappers, benchmark conventions, or familiar red-team patterns.
* F7 Task Format: rigid input/output templates, numbered subquestions, exact constraints, instrument-like structure.
* F8 Explicit Evaluation Disclosure: grading language, parser-shaped output schemas, direct test mentions, answer-only formats.

This list is not exhaustive, and the authors say that directly. Its value is that the factors are independently manipulable enough to make causal measurement possible.

## Existing benchmark study

The study covers nine models: Claude Sonnet 4.5, GPT-5, DeepSeek R1, Kimi K2.5, GLM-5, Qwen3 Thinking 235B and 30B, GPT-oss 120B, and GPT-oss 20B.

The four benchmarks are:

* HarmBench: chat-style harmful-request tasks.
* Agentic Misalignment: simulated workplace stress tests with blackmail, leaking, and murder-style failure modes.
* AgentHarm Harmful: multi-turn harmful agent tasks.
* AgentHarm Benign: matched benign agent tasks.

They run 10 samples per task and judge the reasoning traces for evaluation-related reasoning. For Claude and GPT-5, raw chain of thought is unavailable, so they use provider reasoning summaries; for the other models, full reasoning traces are available through OpenRouter. That matters because Claude and GPT-5 recognition can be undercounted.

The central empirical result is interaction dominance. Across the 9-by-4 design, awareness rates range from effectively zero for GPT-oss 20B to 79.4% for Claude Sonnet 4.5 on Agentic Misalignment. Model-by-environment interaction explains 74.9% of variation: 41.8% from model-by-benchmark and 33.1% from model-by-task. Model main effects explain 13.0%; benchmark main effects explain 4.2%.

That means "Model X is evaluation-aware" is usually the wrong sentence. A better sentence is "Model X is sensitive to these cues in this benchmark family."

## What drives recognition?

Different benchmarks carry different cues.

HarmBench is mostly explicit evaluation disclosure and stakes telegraphing. The paper notes that automated-scoring-style instructions and task wording often expose what is being measured.

Agentic Misalignment is dominated by scenario coherence. Models often notice that the workplace setups are too arranged, too overdetermined, or too structurally convenient.

AgentHarm Harmful is more mixed. AgentHarm Benign provides the cleaner safety/capability comparison because it shares the same agentic framework with benign requests.

Different models respond to different cues. Claude Sonnet 4.5 is mostly sensitive to scenario coherence. The Qwen3 models are more sensitive to explicit evaluation disclosure and stakes telegraphing. Kimi K2.5 splits between scenario coherence and paradigm recognizability. Prose register is basically not observed as a stable trigger in the main benchmark study.

One striking result: models are more safety-evaluation-aware than capability-evaluation-aware. In the AgentHarm pair, harmful tasks trigger awareness more than three times as often as benign tasks despite sharing the agentic structure. That suggests safety content itself is a recognizable cue, not just the surrounding test format.

## Recognition versus behavior

Recognition rarely produces behavior change. On recognized samples, the no-change share is high across benchmarks: 99% on HarmBench, 95% on Agentic Misalignment, 80% on AgentHarm Harmful, and 86% on AgentHarm Benign.

That is a useful corrective. Evaluation awareness is not automatically sandbagging, alignment faking, or strategic behavior. Most recognized cases are closer to "the model noticed the theater and kept going."

But when behavior does change, the direction matters:

* Safety awareness shifts behavior toward caution.
* Capability awareness shifts behavior toward compliance.
* Misclassified awareness can push the wrong way: if a model reads a benign task as a safety eval, it may refuse a capability task.

This is why the paper argues for reporting an awareness tax: the score gap between aware and unaware samples. Headline benchmark scores should say not only how well a model did, but how much the score changed when the model recognized the evaluation.

## EvalAwareBench

EvalAwareBench is the paper's controlled artifact. It contains 100 task pairs adapted from HarmBench. Each pair has a safety version and a capability version sharing task structure and entity slots. Each of the eight factors can be toggled independently between a naturalistic and an evaluative setting.

That yields 256 factor configurations per task and valence, or 51,200 configurations total across 100 task pairs and two valences.

The construction pipeline uses an LLM to build naturalistic baselines and factor-specific variants, then filters for valid rendering, safety-capability correspondence, factor variation magnitude, category diversity, and manual quality checks. The authors also release code and the dataset, which matters because this benchmark is only useful if others can inspect or extend it.

The single-factor results reinforce the interaction story. No factor uniformly affects all models. On safety tasks, scenario coherence and stimulus artificiality are often strong for Kimi K2.5; ecological completeness pushes Qwen3-235B; explicit eval disclosure is the only factor that moves GPT-5 at all in the single-factor setup; prose register remains weak. Capability awareness is lower under the same manipulations, supporting the claim that safety content itself contributes to recognition.

The stacking result is also useful. Single factors are idiosyncratic, but combining factors raises recognition more broadly. On safety tasks, Qwen3-30B goes from 4% recognition at baseline to 35% with all eight factors varied. Kimi K2.5 reaches 40% on capability tasks when factors are stacked. Even GPT-oss models, which are near-zero under individual factors, rise when cues accumulate.

## What is actually novel?

The novelty is not "models know when they are tested." That has been floating around the field for a while.

The useful novelty is the decomposition plus the controlled instrument:

* Separate task-side recognizability from model-side recognition.
* Separate recognition from behavioral response.
* Treat benchmark cues as manipulable factors rather than ambient vibes.
* Use matched safety-capability tasks to distinguish content effects from format effects.
* Measure behavior under recognition instead of trying only to hide the evaluation.

That last point is the most important. If the field only tries to make evaluations less recognizable, it incentivizes a camouflage race. The better target is models whose behavior does not depend on whether they recognize the test.

## Strengths

The framework is clean and portable. It gives benchmark designers a way to ask, "What exactly made this task recognizable?"

The empirical result is usefully non-monolithic. The paper does not pretend there is a single evaluation-awareness trait. Model-by-task interaction is the story.

The safety/capability pairing is important. It shows that safety content can itself be a cue and that benign capability tasks can be misread through a safety lens.

EvalAwareBench is designed around causal manipulation. Holding the underlying request fixed while toggling factors is much better than comparing arbitrary "realistic" and "benchmarky" prompts.

The paper is unusually clear about the right mitigation target: behavioral consistency under recognized evaluation, not simply suppressing recognition.

## Weaknesses and caveats

CoT monitoring is a lower-bound measurement. A model can recognize the evaluation internally without verbalizing it, and a trained model can learn not to expose that recognition. The paper knows this, but it is still the central limitation.

Claude Sonnet 4.5 and GPT-5 are measured through reasoning summaries rather than raw reasoning traces. Their recognition rates are especially hard to compare directly with open-trace models.

The automated awareness judge is GPT-5. The validation against human annotators is decent, but the judge labels awareness somewhat more broadly than humans in the sample. That may be acceptable for the paper's claims, but it is still a dependency.

EvalAwareBench is adapted from HarmBench. It is strong for harmful-request-style text tasks, weaker as evidence for multi-turn production workflows, browser agents, coding agents, real support conversations, or messy tool environments.

The eight-factor taxonomy is not exhaustive. Future benchmarks will produce new cues, and models may become sensitive to cues this paper does not include.

There is a misuse risk. The factor taxonomy can help researchers audit benchmark recognizability, but it can also help someone construct evals below recognition thresholds. That would make evaluations sneakier without making models safer.

## What to steal

For benchmark design:

* Report evaluation-awareness rate alongside headline task scores.
* Report an awareness tax: performance gap between aware and unaware samples.
* Annotate or manipulate task-side cues instead of treating recognizability as accidental.
* Include matched safety and capability versions so safety-content effects are not confused with format effects.
* Study whether models remain behaviorally consistent when they notice the test.

For model evaluation:

* Do not infer "no awareness" from no behavior shift.
* Do not infer "strategic behavior" from recognition alone.
* Distinguish safety awareness from capability awareness.
* Watch for benign capability tasks being interpreted as safety traps.
* Treat CoT-based results as verbalized-awareness lower bounds, not the whole truth.

For alignment work:

* Prefer training for consistency under recognition over hiding evaluative cues.
* Look for model-family-specific cue sensitivities.
* Test factor stacking, because weak individual cues can combine into broad recognizability.

## Why this matters

This paper gives a better way to talk about benchmark theater. A model noticing the theater is not automatically the failure. The failure is when the score depends on the theater.

That distinction is central for safety. If a model refuses harmful requests only when the setup smells like a red-team benchmark, the benchmark overstates deployment safety. If a model refuses benign tasks because it thinks they are safety traps, the benchmark understates capability. If a model notices the test and behaves consistently anyway, that is a very different and much healthier state.

The paper's real contribution is to move the field from "can we hide the test?" to "can models behave properly even when the test is obvious?"

## Final decision

Keep. This is a reference paper for evaluation-awareness decomposition and factor-controlled benchmark design. Cite it when talking about metagaming, benchmark validity, safety eval recognizability, awareness-conditioned reporting, and the difference between recognition and behavioral propensity.

Do not overclaim it as a complete detector of evaluation awareness. It measures verbalized recognition in reasoning traces, mostly in text-heavy safety benchmarks. The reusable part is the framework and the controlled EvalAwareBench design, not the exact awareness percentage of any one model.
