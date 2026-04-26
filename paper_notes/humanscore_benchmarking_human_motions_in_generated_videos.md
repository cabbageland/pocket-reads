# HumanScore: Benchmarking Human Motions in Generated Videos

## Basic info

* Title: HumanScore: Benchmarking Human Motions in Generated Videos
* Authors: Yusu Fang, Tiange Xiang, Tian Tan, Narayan Schuetz, Scott Delp, Li Fei-Fei, Ehsan Adeli
* Year: 2026
* Venue / source: arXiv preprint (cs.CV)
* Link: https://arxiv.org/abs/2604.20157
* PDF: https://arxiv.org/pdf/2604.20157.pdf
* Project page: https://cs.stanford.edu/~xtiange/projects/humanscore/
* Date read: 2026-04-26
* Date surfaced: 2026-04-26
* Surfaced via: Tracy in #pocket-reads
* Why selected in one sentence: This is a sharp benchmark paper for a problem most video-gen leaderboards still blur away, whether generated humans move like actual bodies rather than just looking plausible frame by frame.

## Quick verdict

* Highly relevant

This is a strong and timely benchmark paper. The core contribution is not another vibes-based leaderboard for text-to-video, but a biomechanics-grounded evaluation stack that asks whether generated humans preserve anatomy, stay within plausible joint limits, avoid self-collision, and move with realistic temporal dynamics. That matters because video models are now good enough on surface realism that human motion has become one of the clearest remaining fault lines. The paper is especially useful because it makes that gap measurable, gives interpretable failure dimensions instead of a single beauty score, and shows that even top models still trail real videos by a meaningful margin on motion fidelity.

## One-paragraph overview

HumanScore is a benchmark for evaluating human motion quality in AI-generated videos using six interpretable metrics organized around a biomechanics hierarchy: anatomical correctness, kinematic correctness, and kinetic correctness. The authors curate 51 motion categories from Kinetics-700, split them across difficulty levels and intensities to produce 102 prompts, engineer prompts to stabilize framing and subject visibility, then evaluate outputs from 13 state-of-the-art video generators. Their metrics score extra limbs, bone-length consistency, joint-range violations, self-collision, velocity extremes, and motion smoothness. The main empirical result is that modern generators can look visually convincing while still producing motion-level failures such as stretching bones, implausible poses, jitter, and drift, with the best models still falling short of real-video references.

## Model definition

### Inputs
Generated videos of a single human performing prompted actions, together with reconstructed 2D/3D pose and mesh estimates extracted from those videos.

### Outputs
A multi-metric benchmark score over six motion-quality dimensions, plus aggregated anatomy, kinematic, kinetic, and overall HumanScore values.

### Training objective (loss)
This is not a generative model paper. The benchmark composes existing detectors, pose estimators, skeleton fitting, and mesh fitting systems into an evaluation pipeline rather than training a new end-to-end model.

### Architecture / parameterization
HumanScore combines a curated motion/prompt suite with a layered evaluation pipeline. It uses HADM for extra-limb detection, a biomechanics-aware monocular skeleton fitting pipeline for bone-length and joint-range analysis, PromptHMR plus SMPL-X mesh recovery for self-collision checks, and OpenSim-compatible kinematic reconstruction to compute velocity, acceleration, and jerk based metrics.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
Existing video-generation benchmarks mostly reward pixel realism, text alignment, and generic temporal consistency, but they do not tell you whether a generated person is moving like a physically plausible human. This paper tries to close that gap by building a benchmark focused explicitly on human biomechanical realism.

### 2. What is the method?
The method is a benchmark framework. It curates a diverse set of human actions, standardizes prompts to reduce confounds like camera motion and truncation, generates clips from 13 leading video models, reconstructs human structure and motion from those videos, and scores each clip with six biomechanics-informed metrics spanning anatomy, kinematics, and kinetics.

### 3. What is the method motivation?
The motivation is that human motion is now one of the clearest signals separating real and generated video, yet existing benchmarks mostly treat motion as a weak side dish. If you care about human-centric video generation for media, sports, education, telepresence, or embodied AI, you need metrics that diagnose body-level and dynamics-level failures rather than just visual polish.

### 4. What data does it use?
The benchmark starts from Kinetics-700 as a broad motion pool, then semi-automatically filters and balances categories down to 51 distinct motions. Each motion has two intensity settings, giving 102 prompts total. These prompts are used to generate videos from 13 video-generation models, and the paper also collects corresponding real-world videos as an upper-bound reference set.

### 5. How is it evaluated?
Evaluation happens on six metrics: extra limbs, bone-length consistency, joint range of motion, self-collision, kinematic extremes, and motion smoothness. These are aggregated into anatomy, kinematic, kinetic, and overall scores on a 0 to 100 scale. The authors also run human preference studies with about 1200 pairwise judgments and compare HumanScore rankings to human rankings using Spearman correlation.

### 6. What are the main results?
- Seedance 1.0 Pro Fast and HunyuanVideo 1.5 co-lead the overall leaderboard at 91.1.
- KlingAI 2.5 Turbo Pro is close behind at 90.8 and leads the kinematic and kinetic sub-scores.
- Real videos score 94.3 overall, still clearly above the generated models.
- CogVideoX-5B is the weakest model in the table at 74.8 overall, with especially poor anatomy and kinematic scores.
- HumanScore aligns strongly with human preference judgments, with near-1.0 Spearman correlations across evaluation dimensions.
- Correlation with existing VBench axes is strong for anatomy and kinematics but much weaker for kinetic realism, which supports the claim that common appearance-centric metrics miss important motion failures.

### 7. What is actually novel?
The novelty is the benchmark framing and metric design. The paper does not just add another generic temporal-consistency score. It explicitly structures evaluation around biomechanics, uses interpretable metrics tied to anatomy and motion physics, and turns “generated humans look slightly off” into a measurable, diagnosis-friendly leaderboard.

### 8. What are the strengths?
- The paper goes after a real blind spot in current video-generation evaluation.
- The metrics are interpretable instead of collapsing everything into an opaque aggregate.
- The benchmark design is thoughtful about prompt bias, framing, subject visibility, and difficulty balancing.
- It includes both proprietary and open-source models, plus real-video references.
- The strong correlation with human preference makes the benchmark more credible.
- The anatomy / kinematics / kinetics hierarchy is a clean conceptual scaffold that makes the benchmark easy to reason about.

### 9. What are the weaknesses, limitations, or red flags?
- The benchmark depends heavily on upstream pose and mesh recovery quality, which can inject noise into the scores.
- Real videos do not get perfect scores, which the authors acknowledge as a consequence of reconstruction ambiguity and estimator error.
- It is still a benchmark for single-person motion under fairly controlled prompting, so it does not yet cover messier real-world settings like multi-person interactions or cluttered scenes.
- Some of the metric thresholds and aggregation weights remain design choices even if the paper checks robustness.

### 10. What challenges or open problems remain?
Better pose and mesh recovery would improve the benchmark directly. There is also room to extend this style of evaluation to multi-person scenes, contact-rich interactions, broader camera conditions, and perhaps tighter links between motion realism metrics and model training objectives.

### 11. What future work naturally follows?
- Training video generators with HumanScore-like losses or constraints.
- Building benchmarks for multi-person or object-interaction-heavy motions.
- Improving monocular biomechanical reconstruction so evaluation noise drops.
- Studying whether optimizing for these metrics actually improves perceived realism and downstream usefulness.

### 12. Why does this matter?
Because human-centered video generation is reaching the point where simple visual realism metrics are not enough. If a model can make a person look photorealistic but the limbs jitter, stretch, self-intersect, or violate basic biomechanics, that is a real failure. HumanScore gives the field a more honest measuring stick for that failure mode.

## Why It Matters

For cabbageland, this paper is useful well beyond benchmark trivia. It offers a concrete language and metric set for reasoning about motion realism in generated humans, which matters for video-model evaluation, agentic video systems, human-scene understanding, and any future work where visual plausibility is not the same thing as physical plausibility. It is also a nice example of a benchmark that stops being dazzled by glossy demos and asks the harder structural question.

### 13. What ideas are steal-worthy?
- Evaluate generated humans with interpretable biomechanical dimensions instead of one mushy realism score.
- Treat anatomy, kinematics, and kinetics as a dependency hierarchy when designing motion benchmarks.
- Use prompt engineering not just to improve demo quality but to make evaluation cleaner and fairer.
- Compare against real-video references, not just model-versus-model rankings.

### 14. Final decision
Keep. This is a genuinely useful benchmark paper, especially if you care about the overlap of video generation, human motion, and physically grounded evaluation. It does not solve motion realism, but it makes the problem much harder to hand-wave away.
