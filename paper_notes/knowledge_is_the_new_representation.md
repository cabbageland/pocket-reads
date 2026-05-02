# Knowledge is the new representation.

## Basic info

* Title: Knowledge is the new representation.
* Authors: Hanwen Jiang
* Year: 2026
* Venue / source: personal essay / blog post
* Link: https://hwjiang1510.github.io/blogs/knowledge-is-the-new-representation/index.html
* Date read: 2026-05-02
* Date surfaced: 2026-05-02
* Surfaced via: Tracy in #pocket-reads via direct blog link
* Why selected in one sentence: This is not a paper, but it is a thoughtful research essay about how modern multimodal models break the old “representation learning” frame, so it is worth keeping as a concept note rather than pretending it is a standard technical paper.

## Quick verdict

* Keep, with caveats

This is an essay, not a research paper, and it should be read that way. There is no formal method, dataset, or experimental section to verify. But as a conceptual piece, it is pretty good. The author is trying to name a real shift: older computer vision treated representation as a feature that scores well on narrow tasks, while modern generative and multimodal models look more like compressed world knowledge that can surface through many interfaces. I do not buy every claim at full strength, and the essay occasionally overgeneralizes from GPT Image 2 to a broader theory, but the core distinction between **task-friendly feature readout** and **cross-interface world knowledge** is genuinely useful.

## One-paragraph overview

Hanwen Jiang’s essay argues that modern multimodal and generative models force a redefinition of “representation” in computer vision. The old notion of representation was tied to narrow supervised or self-supervised tasks and evaluated by readout interfaces like linear probes, classifiers, or decoders. The new notion, the author argues, is closer to **knowledge**: compressed internal structure that supports generation, transfer, reasoning, composition, and coherent behavior across many interfaces that were never separately optimized. The essay uses GPT Image 2 as the motivating example, then builds a larger argument that classical vision benchmarks often became “fake tasks” mistaken for intelligence itself. Its replacement proposal is conceptual rather than algorithmic: treat pretraining as compression of world structure into weights, judge models by cross-interface consistency on real tasks, and view unified multimodal omni-models as the natural endpoint of representation learning.

## Model definition

### Inputs
Because this is an essay rather than a technical model paper, the real “inputs” are conceptual examples:
- observed capabilities of GPT Image 2
- the historical computer vision framing of representation learning
- familiar benchmark tasks like ImageNet classification, COCO detection, and novel-view synthesis
- philosophical and art-theory analogies about form and spirit

### Outputs
- a conceptual reframing of representation as knowledge
- a critique of narrow readout-based evaluation
- an argument for multimodal pretraining as the scalable path toward richer representations

### Training objective (loss)
There is no explicit training objective because this is not a method paper. But the essay’s implicit claim is that the best learning objectives are:
- broad, minimally biased, self-supervised objectives
- objectives that compress more of the world’s structure from data
- objectives that preserve coherence across many interfaces rather than optimizing for one narrow benchmark head

### Architecture / parameterization
Again, this is not an architecture paper. The “architecture” is really an argument structure:

1. **Motivating observation**
   - GPT Image 2 appears to display not just visual pattern recall but richer physical and cultural understanding.

2. **Critique of old representation learning**
   - narrow readout interfaces reward task-friendly features rather than general knowledge.

3. **Two traps**
   - the **readout trap**: judging quality by probe-friendliness
   - the **fake task trap**: mistaking benchmark proxies for intelligence itself

4. **Reconstruction**
   - knowledge necessarily lives in representation
   - weights are compressed knowledge, hidden states are unfolded knowledge

5. **Learning-paradigm claim**
   - pretraining is compression of data into weights
   - unified multimodal models are the natural scalable endpoint

## Key questions this summary must address

### 1. What problem is the essay trying to solve?
The essay is trying to resolve a conceptual mismatch in how computer vision people talk about representation.

For older vision pipelines, it made sense to talk about representation as a learned feature space that supports specific downstream tasks. But the author argues that this definition breaks once models become generative, multimodal, and capable across multiple interfaces. A model like GPT Image 2 may not be best understood as having a task-tuned feature representation. It looks more like it contains compressed world knowledge that can show up in rendering, physical plausibility, layout, and semantic composition all at once.

So the problem is not “how do we improve a benchmark,” but “what do we even mean by representation now?”

### 2. What is the method?
There is no technical method in the paper sense. The essay’s method is conceptual decomposition.

It distinguishes:
- **old representation**: task-specific, readout-friendly, distilled from restricted distributions
- **new representation**: broader internal world understanding learned from open-ended pretraining and usable across many interfaces

Then it explains why the old evaluation regime gets stuck via two failure modes:
- the **readout trap**, where we reward what is easiest to extract with a designated head
- the **fake task trap**, where we confuse measurable proxy tasks with intelligence itself

Finally it proposes a replacement framing: **knowledge as representation** and pretraining as compression of world structure into weights.

### 3. What is the method motivation?
The motivation is GPT Image 2, or more generally, the experience of seeing a generative multimodal model do things that narrow benchmark vocabulary does not describe very well.

The author’s examples are actually decent:
- generating a plausible “best CVPR 2027 paper first page” in a way that seems to encode community priors and formatting knowledge
- generating a physically coherent glass sphere / checkerboard / environment-map setup with multi-view consistency

The point is not that these outputs are perfect. It is that they do not look like simple probe-friendly features anymore. They look like many kinds of knowledge being activated together.

### 4. What data does it use?
There is no formal dataset. The essay draws on:
- GPT Image 2 example prompts and outputs
- standard CV benchmarks as conceptual targets of critique
- general observations about pretraining in vision, language, and multimodal models
- analogies from classical Chinese calligraphy and philosophy

### 5. How is it evaluated?
It is not evaluated experimentally, which is the biggest reason to keep the note labeled honestly as an essay note, not a paper note in the strict scientific sense.

The evaluation is rhetorical and conceptual:
- does the old representation framing fail to explain modern multimodal capability?
- do probe-based and benchmark-based evaluations undercount broader capabilities?
- does “knowledge” better explain what these systems appear to contain?

That can still be useful, but it is not evidence in the same category as a method paper.

### 6. What are the main results?
The main “results” are claims rather than experiments:

- classical representation learning often overfit to narrow readout interfaces
- many benchmark tasks became mistaken for intelligence itself
- modern generative / multimodal models are better described as carriers of compressed knowledge
- model weights can be interpreted as compressed knowledge and hidden states as knowledge unfolded by input
- unified multimodal training is the natural scalable endpoint because each modality provides another projection of the same world

The sharpest single line is the essay’s formula:

**representation ≠ knowledge = representation**

It is a bit slogan-like, but it captures the intended split between the old and new meanings of representation.

### 7. What is actually novel?
For a blog essay, the novelty is mostly in the framing.

The most useful ideas are:
- separating the **readout trap** from the deeper **fake task trap**
- arguing that representation should be judged by **cross-interface invariance**, not just by performance through one human-chosen head
- treating pretraining as **compression of knowledge from data into weights**

None of these are fully formalized, but they are sharp enough to be memorable.

### 8. What are the strengths?
- It names a real intuition many people have had around generative and multimodal systems.
- The distinction between task-friendly features and broader internal knowledge is helpful.
- The essay is unusually clear for a conceptual piece and does not hide behind too much jargon.
- The idea of **cross-interface invariance** is genuinely useful as a way to think about richer representations.
- I also like that it tries to connect benchmark critique, pretraining, and multimodal scaling into one coherent story.

### 9. What are the weaknesses, limitations, or red flags?
There are several.

First, this is an essay, so the evidentiary bar is low. It sometimes moves too quickly from striking examples to broad claims about what models “know.”

Second, the GPT Image 2 examples are evocative but not decisive. A model can look coherent in an output without us having a clean theory of what internal structure produced that coherence.

Third, the essay occasionally bundles together several separate claims:
- that benchmark tasks are narrow,
- that multimodal models are broader,
- that broader capability should be called knowledge,
- and that unified multimodal omni-models are therefore inevitable.

Some of those links are plausible, but not all are equally supported.

Fourth, “knowledge” is still a fuzzy term here. The essay says that is intentional, which is fair for a blog post, but it also means the central concept is philosophically suggestive more than operationally precise.

### 10. What challenges or open problems remain?
If someone wanted to turn this essay into a research program, the big open problems would be:

- how to operationalize **cross-interface invariance** as an evaluation criterion
- how to distinguish genuine world knowledge from broad but brittle pattern synthesis
- how to compare models fairly when one is optimized for a narrow task and another for open-ended generation
- how to formalize the relationship between weights, hidden states, and “knowledge” without hand-wavy metaphor

### 11. What future work naturally follows?
Natural follow-ons would be:
- benchmarks that test the same underlying structure across multiple interfaces
- evaluation suites that combine generation, recognition, rendering, reasoning, and retrieval rather than isolating one task
- studies of when narrow readout performance correlates with broader capability and when it does not
- theoretical work on representation as multi-interface latent structure rather than just feature quality

### 12. Why does this matter?
It matters because a lot of older ML language still smuggles in assumptions from narrower model eras.

If modern multimodal systems really are broader than their benchmark ancestry, then we need better language and better evaluation for what they contain. This essay does not solve that problem, but it points at it cleanly. The best part is the warning that once a proxy task becomes easy to measure, a community can quietly start treating it as the thing itself. That is a real research-culture failure mode, not just a vision-specific one.

## Why It Matters

I would keep this mostly as a **research taste note**. It is useful not because it proves anything, but because it gives a better vocabulary for thinking about why older “representation learning” discourse often feels too small for multimodal generative models. The phrase I’d keep from it is not “knowledge is the new representation” by itself, but the more operational follow-up: **judge representations by whether the same internal structure stays coherent across many interfaces, not just by whether one probe can read it out cleanly**.

### 13. What ideas are steal-worthy?
- The distinction between the **readout trap** and the **fake task trap**.
- The phrase **cross-interface invariance** as a north star for richer representation evaluation.
- The framing of pretraining as **compression of world structure from data into weights**.
- The warning that benchmark proxies often mutate into mistaken definitions of intelligence.
- The broader taste claim that multimodal models should be evaluated more holistically than old single-head task pipelines.

### 14. Final decision
Keep, but label honestly.

This is not a paper and should not be oversold as one. It is a strong conceptual essay with one genuinely useful insight: the old feature-centric notion of representation is too cramped for models whose competence shows up across many interfaces. I would keep it in Pocket Reads as a thoughtful concept note, not as empirical evidence.
