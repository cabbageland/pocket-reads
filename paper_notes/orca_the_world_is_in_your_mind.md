---
title: Orca: The World is in Your Mind
slug: orca-the-world-is-in-your-mind
authors: Orca Team, Beijing Academy of Artificial Intelligence
year: 2026
venue: arXiv preprint (cs.CV)
date_read: 2026-07-06
paper_url: https://arxiv.org/abs/2606.30534
pdf_url: https://arxiv.org/pdf/2606.30534
verdict: Keep as an ambitious world-latent pretraining paper, with heavy branding and real evaluation caveats
summary: Orca proposes a "world foundation model" built around next-state prediction rather than next-token, next-frame, or next-action prediction alone. Starting from Qwen3.5 VLM backbones at 0.8B and 4B scale, the model learns a latent world-state representation with three pretraining objectives: observation-only prediction of adjacent video-frame latents, event-conditioned prediction of language-described state transitions, and VQA response generation. The pretraining inventory is large, with 125K hours of video, 160M event annotations, and 11.5M VQA samples, though this version trains on about 12.5K video hours. After pretraining, the Orca backbone is frozen and separate readouts are trained for text generation, image prediction, and real-robot action generation. The reported results are strongest as transfer/probing evidence: Orca-4B improves over the Qwen3.5-4B backbone on the average text benchmark score, beats selected image-editing baselines on the paper's PRICE-V0.1 interaction-prediction benchmark, and performs competitively with pi0.5 on five short-horizon OOD robot tasks.
why_it_matters: This is useful because it gives a concrete recipe for treating "world model" as a shared latent plus multiple readout interfaces, rather than as a vague synonym for video generation or robotics policy. The best idea is the separation between learning a state-transition latent and later training modality-specific decoders against that latent. The caution is that nearly every impressive claim passes through a readout, a custom benchmark, or model-judge evaluation; the paper is evidence that the latent transfers, not proof that a general world foundation model has arrived.
final_decision: Keep. Cite it for next-state-prediction framing, unconscious/conscious state-transition pretraining, frozen-backbone readout evaluation, and the data/architecture recipe for a world-latent model. Do not cite it as solved general world modeling: the current system is mostly vision/language, supervised in frozen ViT space, evaluated on limited short-horizon tasks, and the public repo says checkpoints and inference code are still unreleased.
tags: world-models, world-foundation-models, next-state-prediction, state-transition-modeling, multimodal-learning, latent-representations, video-pretraining, event-annotations, embodied-ai, robotics, action-generation, image-prediction, vqa, qwen, stable-diffusion, frozen-backbone, readouts
---

# Orca: The World is in Your Mind

## Basic info

* Title: Orca: The World is in Your Mind
* Authors: Yihao Wang, Yuheng Ji, Mingyu Cao, Yanqing Shen, Runze Xiao, Huaihai Lyu, et al. (Orca Team, Beijing Academy of Artificial Intelligence)
* Year: 2026
* Venue / source: arXiv preprint (cs.CV)
* Link: https://arxiv.org/abs/2606.30534
* PDF: https://arxiv.org/pdf/2606.30534
* DOI: https://doi.org/10.48550/arXiv.2606.30534
* arXiv version inspected: v2, submitted 2026-06-29, revised 2026-06-30
* Date read: 2026-07-06
* Date surfaced: 2026-07-04
* Surfaced via: Tracy in #pocket-reads
* Project page: https://orca-wm.github.io/
* Code / repo: https://github.com/orca-wm/Orca
* Public release status at read time: technical report and project assets are public; repo lists model checkpoints, inference code, and downstream fine-tuning code as "coming soon."
* Why selected in one sentence: It is an unusually explicit attempt to turn "world model" into a pretraining objective, a latent-space design, and a frozen-backbone readout evaluation protocol.

## Quick verdict

Keep as an ambitious world-latent pretraining paper, with heavy branding and real evaluation caveats.

The paper is big-claim-y. It calls Orca an initial general world foundation model and uses language like observation, reasoning, cognition, and action. That framing should be handled with tongs. But underneath the branding is a useful engineering idea: pretrain a shared latent to predict state transitions, then freeze that latent and test what different readouts can extract from it.

The most valuable part is not "Orca is AGI, pack it up." It is the recipe:

* learn dense adjacent-frame dynamics from video,
* learn sparse semantic transitions from language-described events,
* keep a language interface alive with VQA,
* freeze the backbone,
* then ask whether text, image, and action readouts get better as the latent improves.

That is a clean way to evaluate whether a representation contains world-state information beyond ordinary VLM features.

The main caveat is that most of the evidence is readout-mediated. Orca is not directly doing everything itself. The vision readout uses a Stable Diffusion 3.5-based decoder with trainable adapter/LoRA parameters. The action readout uses a separately trained DiT action expert. The text readout uses the VLM language head. So the paper supports "the learned latent transfers into useful downstream interfaces," not "the model has a complete native world simulator."

## One-paragraph overview

Orca starts from Qwen3.5 VLM backbones at 0.8B and 4B scale and trains them to learn a latent world-state representation. Its core objective is next-state prediction: given multimodal world signals, abstract a state, then predict another state under either natural dynamics or explicit conditions. The system has three pretraining losses. Observation-only state transition predicts the frozen vision-encoder latent of an adjacent video frame. Event-conditioned state transition uses language-described events to predict a corresponding target-frame latent. VQA response generation preserves the language interface and semantic grounding. The data inventory contains 125K hours of video, 160M event annotations, and 11.5M VQA samples, although the reported version trains on about one-tenth of the video inventory, roughly 12.5K hours. After pretraining, Orca freezes the backbone and trains readouts for text generation, image prediction, and real-robot action generation. The headline results show that loss improves with scale, downstream readouts improve with stronger pretraining checkpoints, and Orca-4B beats several same-size or larger baselines on the paper's chosen averages.

## What problem is the paper trying to solve?

"World model" is used too loosely. Sometimes it means video prediction. Sometimes it means a robot dynamics model. Sometimes it means an LLM with enough commonsense to answer physical questions. Orca tries to define a more general target: a model should learn a latent representation of world states and transitions, then expose that representation through different interfaces.

The authors argue that next-token, next-frame, and next-action prediction are each tied too tightly to one output form. A system trained only for next-token prediction may know how to talk about the world without representing how it changes. A system trained only for next-frame prediction may imitate pixels without understanding task-level events. A system trained only for next-action prediction may memorize demonstrations without modeling the consequences.

So the proposed abstraction is:

* observations come from multimodal world signals,
* reasoning is modeled as state transition,
* cognition lives in a shared world latent,
* text, images, and actions are readouts from that latent.

That is a nice conceptual split. The hard part, of course, is whether the training and evaluations actually substantiate it.

## Method

Orca has two learning modes, borrowing the paper's own language: unconscious learning and conscious learning.

### Unconscious learning: dense video transitions

The unconscious objective uses continuous video. Given a current frame and a query, Orca predicts the latent of an adjacent future frame. The target is not raw pixels; it is the latent produced by a frozen vision encoder.

This is meant to teach dense natural dynamics: object motion, occlusion, contact, scene changes, and short-horizon temporal continuity.

This part is close in spirit to self-supervised video representation learning, but Orca's pitch is that the learned state should later support many readouts instead of only visual prediction.

### Conscious learning: language-conditioned event transitions

The conscious objective uses event annotations. Given a current frame and a language description of a future or past event, the model predicts the latent of the frame associated with that event.

This is the more interesting piece. The language event acts as a semantic condition on the state transition. Instead of merely asking "what frame comes next?", it asks "what state should result from this described event?"

That matters because many useful world changes are sparse and meaningful rather than frame-adjacent. "Close the microwave door" or "place the sponge down" is a better supervisory unit than raw frame drift.

### VQA response generation

The VQA loss keeps the model grounded in language. Without it, a latent might become useful for visual transitions while losing the ability to answer questions or express semantic distinctions.

The ablation supports this: VQA-only has decent text performance but weak action transfer, event+observation without VQA fails to provide text readout, and all three losses together give the most balanced average.

### Frozen-backbone readouts

After pretraining, the Orca backbone is frozen. This is important. The paper is trying to test whether the latent is useful, not whether each downstream task can fine-tune the whole model.

The readouts are:

* text readout: reuse the language modeling head,
* vision readout: map Orca latents into a Stable Diffusion 3.5 decoder through an MLP adapter and LoRA,
* action readout: train a DiT-based action expert with flow matching, conditioned on Orca latents and robot proprioception.

The action readout is trained from scratch on real-robot data: five tasks, 200 trajectories per task. The paper emphasizes that action labels are not used in Orca pretraining, but the downstream action readout absolutely does use action data.

## Data

The data story is one of the paper's bigger swings.

The inventory contains:

* 125K hours of video,
* 160M event annotations,
* 11.5M general VQA samples.

The videos cover egocentric interaction, exocentric manipulation, action-free robot execution, and natural dynamics. The event data is derived from videos through multi-level segmentation and language annotation, with coarse and fine events. VQA data is built from language signals and video data.

But the reported training run uses about 12.5K video hours, not the full 125K-hour inventory. The limitation section explicitly says this is roughly one-tenth of the available video data and blames model capacity/resource constraints.

Training details are nontrivial: both Orca-4B and Orca-0.8B are trained for 10,844 steps on 32 nodes / 256 GPUs, with frozen ViT, trainable LLM, 256 queries, and latent matching loss of 0.1 MSE + 0.9 cosine.

This is not a tiny academic toy. It is also not a frontier-scale world model.

## Results

### 1. Scaling behavior

The first result is unsurprising but necessary: pretraining loss decreases as video-data scale increases, and the 4B model achieves lower objective loss than the 0.8B model.

More importantly, downstream readouts improve as pretraining progresses. The paper probes checkpoints and shows better average performance across text generation, image prediction, and action generation when the world latent is trained longer and at larger scale.

This is the core evidence for the paradigm. If the frozen latent did not improve downstream readouts, the whole "world latent" framing would collapse.

### 2. Text generation

Text generation is evaluated on MVBench, TemporalBench, 3DSRBench, and SWITCH. Orca is compared against world-model-ish baselines such as V-JEPA 2.1, Emu3, and Emu3.5, plus VLMs such as Qwen3.5, Gemma 4, DeepSeek-VL2, MiniCPM-V-4.6, and SmolVLM2.

Orca-4B reports:

* MVBench: 65.3,
* TemporalBench: 34.2,
* 3DSRBench: 52.1,
* SWITCH: 55.6,
* average: 51.8.

For comparison, Qwen3.5-4B reports 46.7 average, with a higher MVBench score but lower scores on the other three benchmarks. Orca-0.8B reports 40.8 average, above Qwen3.5-0.8B's 33.1.

The capability breakdown against Qwen3.5-4B is also useful:

* state transition: 64.13 vs 51.86,
* commonsense reasoning: 62.95 vs 57.76,
* spatial relations: 55.25 vs 54.68,
* dynamic motion: 65.55 vs 57.03.

The strongest text story is temporal/dynamic and state-transition reasoning. The weakest relative improvement is spatial relations, where the gain is tiny.

### 3. Image prediction

The paper introduces PRICE-V0.1, a benchmark for instruction-conditioned image prediction in real-world interactions. Given an initial image and an instruction, the model must generate the target state after the action.

The evaluation uses model judges: Gemini 3.1 Pro, GPT 5.4, Doubao-Seed-2.0-Pro-260215, and Gemma 4-31B. Each judge scores generated images from 1 to 5 based on instruction following, scene consistency, and physical plausibility.

On PRICE-V0.1, Orca-4B with a 2B image readout reports 59.8 +/- 10.9 average. The strongest baseline listed is FLUX.2 [klein] at 56.1 +/- 18.1. Orca-0.8B with the same 2B readout is much weaker at 34.5 +/- 15.3.

This result is interesting but easy to overread. PRICE is custom, the judging is largely model-based, and the vision readout is a serious generative system rather than a trivial probe. Still, the comparison is pointed: generic image-editing models can hallucinate irrelevant objects or preserve the scene while failing the causal interaction; Orca's latent seems to give the image readout better information about the intended state transition.

### 4. Action generation

The real-robot evaluation uses a dual-arm wheeled robot and five manipulation tasks:

* Take Book,
* Stacked Bowls,
* Pull Out Tissue,
* Stamp,
* Scoop Sugar.

There are two OOD settings:

* environment OOD: same objects/instructions, unseen tablecloth/background/workspace appearance,
* object OOD: semantically related but unseen objects or containers.

The action readout is compared against V-JEPA 2.1 with the same action expert, Qwen3.5 with the same action expert, and pi0.5 as a strong pretrained VLA baseline.

Overall rule-based scores:

* V-JEPA 2.1: 17.0,
* Qwen3.5: 10.5,
* pi0.5: 29.4,
* Orca: 32.4.

Orca also reports the best overall M25, success rate, MaxP-F, and DRR. pi0.5 is slightly better on FNS and SQS. The absolute success rates are low: Orca's overall SR is 6%, pi0.5's is 5%, and V-JEPA/Qwen are 0%.

This is not "robotics solved." It is better interpreted as: Orca's frozen latent provides more useful conditioning to a downstream action expert than the compared frozen visual/VLM latents in this short-horizon setup.

That is still worth noticing. The strongest embodied claim is not high success, but better progress and recovery under OOD conditions.

### 5. Ablation

The ablation is one of the most useful tables in the paper.

The full objective gets:

* text: 51.8,
* image: 59.8,
* action: 32.4,
* average: 48.0.

Dropping pieces hurts different readouts:

* VQA-only gets text 48.4 but action only 10.2 and no image result.
* observation + event without VQA gets image 58.2 and action 30.9 but no text result.
* observation + VQA gets text 50.5 and action 32.6 but no image result.
* event + VQA gets text 50.1, image 54.7, and action 23.0.

The interpretation is clean:

* observation-only transition is especially important for action,
* event-conditioned transition is especially important for image prediction,
* VQA preserves the language interface,
* all three are needed for balanced readouts.

## What is actually novel?

The novelty is the system-level framing more than any one component.

None of these pieces alone is shocking:

* video latent prediction,
* language-conditioned transitions,
* VQA,
* frozen backbones,
* diffusion readouts,
* robot action experts.

What is new and useful is the way the paper ties them into one evaluation loop:

1. Learn a shared world latent through next-state prediction.
2. Freeze the latent model.
3. Train separate readouts.
4. Measure whether stronger pretraining improves all readouts.

That gives the vague phrase "world foundation model" a concrete experimental handle.

It also shifts the question from "can this model produce impressive pixels/actions/text?" to "does this latent contain state-transition information that multiple downstream interfaces can exploit?"

That is a better question.

## Strengths

The paper has a coherent conceptual target. It does not merely call itself a world model; it defines state abstraction, state transition, and readout interfaces.

The frozen-backbone evaluation is the right instinct. If downstream performance improves while the backbone is frozen, that is better evidence for a useful learned representation than full fine-tuning everything.

The conscious/unconscious split is cheesy as terminology but useful as a data-design distinction. Dense video gives local dynamics; language-described events give sparse semantic transitions.

The ablation is informative and matches the method's story. Different pretraining losses support different readouts, and the full objective is best balanced.

The robot evaluation is modest in absolute success but valuable as a transfer test. The fact that action labels are absent from pretraining but Orca latents still help a separately trained action expert is the most interesting embodied result.

The limitation section is unusually complete. The authors openly list missing modalities, ViT-space supervision, insufficient model scale, limited benchmark diversity, short-horizon transitions, limited readouts, loss-function limitations, and easy/short embodied tasks.

## Weaknesses and caveats

The rhetoric outruns the evidence. "The World is in Your Mind" is a fun title, but the actual system is mostly vision/language, short-horizon, and readout-mediated.

The visual state target is a frozen vision-encoder latent. That simplifies training, but it means Orca is partly learning inside an existing semantic/ViT space rather than discovering a native world-state space from first principles.

The data inventory is much larger than the data used in reported training. The paper has 125K hours of video available, but this version trains on roughly 12.5K hours.

The public repo does not yet release checkpoints, inference code, or downstream fine-tuning code. Until those exist, reproduction is limited to reading the report and project materials.

The image benchmark is custom and judged mostly by closed model evaluators. That does not invalidate it, but it makes the result less sturdy than a mature public benchmark.

The action tasks are short-horizon and low-success. Orca's progress metrics are good relative to the baselines, but the binary success rates are still tiny.

The readouts are not equally lightweight in the everyday sense. The vision readout has hundreds of millions of trainable adapter parameters plus LoRA on SD3.5. The action readout is a nontrivial DiT policy trained on robot trajectories. These are legitimate probes, but not tiny linear classifiers.

The baseline comparisons are uneven. Some baselines are native world models, some are VLMs, some are image editing systems, and one is a robotics policy. The comparisons are useful, but they do not isolate one clean variable across all tasks.

## How I would use this paper

Use it as a reference for world-latent architecture and evaluation design.

Steal:

* next-state prediction as the unifying pretraining frame,
* separate dense video transitions from sparse language-described event transitions,
* freeze-backbone readout evaluation,
* multi-interface probing through language, vision, and action,
* ablations that map pretraining losses to readout utility.

Do not steal the branding wholesale. "General world foundation model" is still a research aspiration here, not an established capability.

For our purposes, the most useful move is the readout discipline. If someone claims a latent represents the world, make them freeze it and show that multiple downstream interfaces get better as the latent improves.

## Why it matters

This paper matters because it tries to make "world model" operational. The field badly needs that. Otherwise the term becomes an aesthetic: video model with vibes, robotics model with vibes, LLM with physical commonsense vibes.

Orca's framing says: a world model should learn states and transitions, and those states should be useful through multiple readouts.

That is not the whole story, but it is a productive pressure test. It asks whether a model's internal representation can support understanding, prediction, and intervention without retraining the whole backbone for each interface.

The limitation section also matters. It quietly points at the real next problems: native world-state supervision, more modalities like audio/tactile/force/proprioception, longer-horizon transitions, larger model capacity, richer embodied tasks, and a simpler objective that is actually consistent with next-state prediction.

## Final decision

Keep.

This belongs in the world-models pile as an ambitious early recipe: shared world latent, next-state-prediction objectives, frozen-backbone readouts, and multimodal transfer tests.

Citation posture:

* strong for next-state-prediction framing and readout-based world-latent evaluation,
* useful for data-design ideas around event-conditioned transitions,
* interesting but not conclusive for embodied transfer,
* weak for any claim that general world foundation models are solved.

The sentence to remember: Orca is less a finished world model than a useful test harness for asking whether a latent has learned state transitions that text, image, and action systems can all read.
