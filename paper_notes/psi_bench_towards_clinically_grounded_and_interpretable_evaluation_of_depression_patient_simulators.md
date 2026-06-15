# PSI-Bench: Towards Clinically Grounded and Interpretable Evaluation of Depression Patient Simulators

## Basic info

* Title: PSI-Bench: Towards Clinically Grounded and Interpretable Evaluation of Depression Patient Simulators
* Authors: Nguyen Khoi Hoang, Shuhaib Mehri, Tse-An Hsu, Yi-Jyun Sun, Quynh Xuan Nguyen Truong, Khoa D Doan, Dilek Hakkani-Tur
* Year: 2026
* Venue / source: arXiv preprint (cs.CL / cs.AI)
* Link: https://arxiv.org/abs/2604.25840
* PDF: https://arxiv.org/pdf/2604.25840
* Date read: 2026-06-15
* Date surfaced: 2026-06-15
* Surfaced via: Tracy in #pocket-reads via arXiv link
* Why selected in one sentence: Patient simulation for mental-health training is exactly where "LLM sounds plausible" is not enough; this paper asks whether simulated depressed patients actually match real patient communication patterns.

## Quick verdict

* Strong diagnostic framing, with some real caveats

This is a useful paper because it attacks the weak point in LLM patient simulators: evaluation has mostly meant asking another LLM whether the roleplay felt realistic. PSI-Bench instead compares simulated and real depression-related conversations along interpretable behavioral dimensions: narrative-emotion progression, emotion expression, lexical diversity, response length, and depression-related linguistic markers. The main finding is blunt and believable: current simulators are too articulate, too long-winded, too emotionally legible, too uniformly "therapeutic," and they resolve distress too fast. The best part of the paper is not the leaderboard; it is the vocabulary it gives for diagnosing synthetic-patient fakeness. The caution is that the "real patient" baseline is still a constructed benchmark from public dialogue datasets and Eeyore-derived profiles, and several labels are produced by an LLM, even if later expert-validated. Keep it, but do not mistake it for clinical ground truth.

## One-paragraph overview

PSI-Bench is an automatic benchmark for evaluating depression patient simulators against real patient-style conversations. It builds on the Eeyore dataset, which pairs depression-related conversations and patient profiles, then generates synthetic conversations by conditioning two simulator frameworks, PATIENT-Psi and Roleplay-doh, on the same profiles. The benchmark scores real and simulated conversations independently across five dimensions: narrative-emotion process markers, emotion categories, lexical diversity via MTLD, response length, and linguistic markers of depression such as absolutist terms, depressive words, and non-fluencies. It then compares the population-level and dialogue-level statistics with measures like Jensen-Shannon divergence, Wasserstein distance, log-ratio similarity, and marker-rate differences. Across seven LLMs and two simulation frameworks, the paper finds that simulated patients are more verbose, more lexically diverse, less variable across profiles, too quick to move from problem to transition/change, and too likely to follow a clean negative-to-positive emotional arc. A 20-expert human study largely agrees with the benchmark rankings, especially on pairwise realism judgments.

## Model definition

This is not a new patient simulator. It is an evaluation framework for patient simulators.

### Inputs

- real depression-related patient conversations and patient profiles from Eeyore
- simulated conversations generated from the same profiles
- simulator framework choice: PATIENT-Psi or Roleplay-doh
- LLM choice for the simulated patient
- a shared therapist model, gpt-oss-20b, used across settings
- patient messages from both real and simulated conversations

### Outputs

- dimension-level similarity scores from 0 to 100
- an aggregate alignment score for each simulator setting
- interpretable diagnostics showing where simulated patients diverge from real patient communication
- expert-validation results comparing PSI-Bench judgments with mental-health expert preferences

### Evaluation objective

The objective is alignment with real patient communication statistics, not downstream counselor training performance.

For each simulator configuration, PSI-Bench computes the same statistics on real and simulated conversations, then turns distance from the real distribution into similarity scores. Higher score means closer to the real benchmark on that dimension. The final leaderboard averages across the dimensions, but the paper correctly treats the per-dimension diagnostics as more informative than the single overall rank.

### Architecture / pipeline

The pipeline is:

1. Start with Eeyore real conversations and patient profiles.
2. Generate synthetic conversations from the same profiles with different simulator-framework and LLM combinations.
3. Label patient turns for narrative-emotion process and emotion expression, using gpt-oss-120b with explicit category definitions.
4. Compute surface and psycholinguistic metrics: MTLD lexical diversity, words per message/sentence, and depression-marker prevalence/rates.
5. Compare real and simulated distributions over turns, dialogues, and populations.
6. Validate the benchmark with expert annotators on message classification and pairwise realism preferences.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?

LLM patient simulators are being used for mental-health training, but their evaluation is thin. Prior work often asks an LLM judge to score whether a response fits a profile, usually with a vague Likert prompt. That misses the real question: does the simulator behave like the population of patients it is meant to emulate?

The stakes are higher than normal roleplay. If a simulated depressed patient is too coherent, too cooperative, too self-aware, or too fast to improve, trainees may learn the wrong model of patient behavior.

### 2. What is PSI-Bench?

PSI-Bench is a benchmark for comparing synthetic depressed-patient conversations to real depression-related patient conversations across five dimensions:

- narrative-emotion process markers: Problem, Transition, Change, and Filler
- emotion expression: Plutchik-style emotions plus neutral
- lexical diversity: MTLD per conversation and corpus-level MTLD
- response length: words per message and words per sentence
- linguistic markers of depression: absolutist words, depressive words, and non-fluencies

The good design choice is that the benchmark is not just asking "is this realistic?" It asks where the simulator differs: timing, affect, verbosity, lexical distribution, and marker density.

### 3. What data does it use?

The benchmark uses Eeyore, which is built from public depression-related dialogue datasets and pairs conversations with patient profiles. The paper says the selected underlying datasets are:

- AnnoMI: 167 motivational interviewing transcripts
- HOPE: 308 counseling conversation transcripts
- ESC: 923 help-seeker/supporter chats

They exclude RED because it contains multi-party Reddit discussions with unverified responders rather than dyadic supporter/therapist-patient interactions. After merging consecutive messages by the same speaker, the human side contains 1,398 conversations.

Important caveat: "real" here means real or human-authored depression-related dialogue sources processed into the Eeyore setup, not necessarily clean clinical records from diagnosed depressed patients in controlled therapy sessions. That is still much better than abstract-only evaluation, but it matters.

### 4. What simulator settings are benchmarked?

The paper evaluates two simulation frameworks:

- PATIENT-Psi: a CBT-oriented patient-simulation framework built around structured cognitive models of thoughts, beliefs, emotions, and behaviors.
- Roleplay-doh: a framework where expert qualitative feedback is converted into natural-language principles governing the roleplay, with self-refinement for principle adherence.

Each is paired with seven LLMs:

- Llama-3.1-8B-Instruct
- Llama-3.3-70B-Instruct
- Qwen3-30B-A3B-Instruct-2507
- Qwen2.5-72B-Instruct
- GPT-4.1 mini
- gpt-oss-20b
- gpt-oss-120b

That produces 14 framework-model configurations. The therapist model is held constant as gpt-oss-20b, and generation is capped at 16 turns or the length of the corresponding real conversation.

### 5. What exactly are the metrics?

For narrative-emotion and emotion progression, PSI-Bench compares turn-by-turn label distributions between real and simulated populations using average Jensen-Shannon divergence across the first 16 turns.

For lexical diversity, it computes per-conversation MTLD and compares real versus synthetic distributions using Wasserstein distance. It also compares per-conversation MTLD with corpus-level MTLD to see whether a population shares vocabulary patterns across individuals.

For response length, it compares average words per message and words per sentence using a log-ratio similarity, which makes the penalty proportional rather than raw.

For depression markers, it looks at both:

- marker rate: occurrences per 1,000 tokens
- marker prevalence: percentage of messages containing at least one marker

That distinction turns out to be important because LLMs spread markers thinly across very long replies.

### 6. What are the main results?

The main result is that current simulators do not just differ from real patients in one obvious way. They are systematically shaped like polished therapeutic stories.

Key findings:

- Simulators leave the Problem stage too quickly, often by around turn 3, while more than 40 percent of real patient conversations remain in Problem through the first 16 turns.
- Simulators follow a uniform negative-to-positive emotional trajectory: early fear/sadness, then quick movement toward trust, joy, or anticipation.
- Real patient conversations contain more neutral and filler content, while simulator messages are almost always emotionally explicit and task-focused.
- Simulated patients have higher and tighter MTLD lexical-diversity scores, meaning they are more uniformly linguistically varied and less individually variable than humans.
- Real patients average about 18 words per message and 9 words per sentence; simulated patients average roughly 64 to 319 words per message and 15 to 28 words per sentence.
- Simulators show higher marker prevalence but lower marker density: depression cues appear in more messages, but diluted across long, polished responses.

This is the paper's best empirical point: LLM simulators do not merely "overdo depression." They distribute depression signals in an LLM-shaped way.

### 7. Which simulator performed best?

The top overall configuration is PATIENT-Psi with Llama-3.1-8B-Instruct, scoring 62.54 overall. The next two are PATIENT-Psi with Qwen3-30B-A3B-Instruct at 61.47 and PATIENT-Psi with Qwen2.5-72B-Instruct at 59.42. The lowest is Roleplay-doh with gpt-oss-120b at 33.98.

Do not overread the exact numeric gaps. The more useful result is structural:

- PATIENT-Psi usually beats Roleplay-doh under the same LLM.
- Framework choice matters more than raw model size.
- Larger models do not reliably produce more realistic patients.
- Smaller or less polished models can look more human because they are shorter, less coherent, and less excessively self-reflective.

That last point is deliciously important. More capable language behavior can be worse patient simulation behavior.

### 8. How is the benchmark validated?

The paper runs a Prolific expert study with 20 mental-health experts, split into four groups of five. Participants do two tasks:

- message-level classification of patient turns by dominant emotion and narrative-emotion process
- pairwise comparison of two synthetic conversation snippets, choosing which better reflects realistic patient communication

Human-model agreement is high:

- Pairwise preference: 91.67 percent agreement, Cohen's kappa 0.8210
- NEP classification: 80.06 percent agreement, Cohen's kappa 0.6958
- Emotion classification: 86.83 percent agreement, Cohen's kappa 0.7520

Human-human agreement is only moderate, with Fleiss' kappa between 0.43 and 0.57. That actually makes the validation more believable: this is a subjective task, and the benchmark agrees strongly with majority expert judgments even though experts do not perfectly agree with each other.

### 9. What qualitative expert feedback matters?

Experts preferred shorter, less certain, more fragmented, simpler, slightly disjointed conversations with hesitation and self-correction. They disliked conversations that were overly structured, polished, cognitively organized, self-reflective, or solution-oriented too early.

That is the practical heart of the paper. In this domain, realism often looks like less narrative closure, less explanation, and less verbal competence.

### 10. What is actually novel?

The novelty is not the individual metrics. Lexical diversity, emotion labels, response length, and marker lexicons are all familiar tools.

The useful novelty is the combination:

- evaluate patient simulators against real-patient population distributions, not profile-alignment vibes
- measure progression over dialogue turns, not just isolated response quality
- separate prevalence from density for depression markers
- validate automatic diagnostics against mental-health expert preference
- show that higher model capability can reduce patient-simulation fidelity

It gives the field a better failure taxonomy.

### 11. What are the strengths?

- The benchmark is interpretable. You can tell whether a simulator failed by verbosity, emotional trajectory, marker usage, or lack of population diversity.
- It addresses behavioral diversity, which average LLM-judge ratings usually flatten.
- The findings line up with what makes LLM roleplay often feel fake: too fluent, too coherent, too eager to progress.
- The expert study is small but meaningful, and the pairwise agreement result is strong.
- It highlights framework design as more important than simply swapping in a bigger model.
- It is immediately useful for anyone building synthetic personas, not just mental-health patient simulators.

### 12. What are the weaknesses, limitations, or red flags?

The first limitation is the real-data baseline. Eeyore is a serious source for this task, but it is not the same as a broad, clinically representative corpus of depressed patients in therapy. It mixes public datasets, counseling/support settings, and generated or extracted profile structure. That weakens any claim that PSI-Bench measures fidelity to "real depressed patients" in the full clinical sense.

The second limitation is that PSI-Bench still uses an LLM, gpt-oss-120b, for key classifications. The authors validate those labels against experts, which helps a lot, but it is not a fully model-independent benchmark. If the LLM's categories or biases drift, the benchmark inherits some of that.

The third limitation is metric weighting. Averaging five dimension scores into one overall alignment score is convenient, but clinical realism may not weight verbosity, emotion progression, and marker density equally. A simulator could be useful for one training scenario and bad for another.

The fourth limitation is that this is intrinsic evaluation. It does not show whether training with higher PSI-Bench simulators actually improves counselor behavior, safety, or learning outcomes.

The fifth limitation is cultural and linguistic narrowness. Depression expression is not universal across languages, cultures, therapy settings, or social contexts. Marker lexicons and emotion-label distributions can become brittle fast.

### 13. What challenges or open problems remain?

The hardest open problem is building simulators that are both clinically safe and behaviorally faithful. LLM safety training pushes models away from some depressive speech patterns; training realism pushes toward messy, stuck, distressing, sometimes unsafe expression. That tension is not solved by a benchmark.

Other open problems:

- better real-world clinical baselines
- stronger non-LLM or hybrid labeling for sensitive psychological dimensions
- downstream validation with actual trainee learning outcomes
- personalization without overfitting to profiles
- modeling hesitation, neutrality, resistance, repetition, and non-progress without making the system useless or unsafe
- distinguishing "realistic patient" from "harmful or retraumatizing simulation"

### 14. What future work naturally follows?

- Use PSI-Bench-style diagnostics as training objectives or reward signals for patient simulators.
- Add explicit anti-polish constraints: shorter replies, more uncertainty, more neutral/filler turns, less premature insight.
- Build scenario-specific weights for different training goals, instead of one universal overall score.
- Validate on more clinical datasets and expert populations.
- Extend beyond depression to anxiety, psychosis, trauma, addiction, and mixed presentations, while being careful not to flatten diagnosis into surface style.
- Test whether high-scoring simulators actually improve novice clinician training compared with low-scoring simulators.

## Why It Matters

This matters because it punctures a common LLM fantasy: that better language ability automatically means better human simulation. For depressed-patient simulation, the paper shows almost the opposite. The more polished the model sounds, the less it may resemble the messy, hesitant, repetitive, low-agency, non-linear communication patterns that real patients can exhibit.

The bigger lesson generalizes beyond therapy. Synthetic personas should not be judged by theatrical plausibility alone. They need distributional, temporal, and behavioral checks against the population they are supposed to stand in for.

## My actual read

I like this paper. It is not perfect, but it is aiming at the right enemy.

The key move is moving from "does this simulated patient satisfy the prompt?" to "does this simulator reproduce the population-level behavior of patients over time?" That is a much better question. It also catches failures that ordinary LLM-as-judge evaluation is almost built to miss: excess coherence, narrative tidiness, uniform affect, and too much helpful self-interpretation.

The paper is also quietly useful for prompt design. If a patient simulator sounds like a therapy-aware essay about its own depression, that is probably a failure. More realistic simulation may require shorter messages, incompleteness, resistance, repetition, bland turns, and slower emotional movement. That feels right.

The main place I would stay skeptical is the clinical grounding claim. PSI-Bench is clinically inspired and expert-validated; that is different from clinically definitive. The real-data substrate is not broad enough to carry all the weight that phrase might invite. Still, as a research benchmark and diagnostic lens, this is a keeper.

## Final Decision

Keep. PSI-Bench is a strong benchmark paper for the current synthetic-patient wave because it exposes the specific ways LLM simulators are fake: too verbose, too self-aware, too lexically fancy, too emotionally clean, and too quick to heal. I would cite it for the diagnostic frame and the "bigger model is not necessarily more faithful" result, not as proof that any benchmark has solved clinical realism.

Best framing:

- useful benchmark for depression patient simulator fidelity
- strongest contribution is interpretable failure diagnosis
- expert validation is encouraging
- real-data and LLM-labeling caveats matter
- valuable beyond mental health as a warning against polished synthetic persona slop
