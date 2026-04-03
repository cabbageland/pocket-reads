# The Language of Motion: Unifying Verbal and Non-verbal Language of 3D Human Motion

## Basic info

* Title: The Language of Motion: Unifying Verbal and Non-verbal Language of 3D Human Motion
* Authors: Changan Chen, Juze Zhang, Shrinidhi K. Lakshmikanth, Yusu Fang, Ruizhi Shao, Gordon Wetzstein, Li Fei-Fei, Ehsan Adeli
* Year: 2024
* Venue / source: arXiv preprint
* Link: https://arxiv.org/abs/2412.10523
* Code: https://github.com/Juzezhang/language_of_motion
* Date read: 2026-04-02
* Why selected in one sentence: It is a serious attempt to turn motion generation and motion understanding into one multimodal language-model problem instead of keeping speech-to-motion, text-to-motion, and motion-understanding as isolated systems.

## Quick verdict

**Worth keeping.**

This is one of the cleaner recent attempts to treat human motion as a genuinely multimodal language problem rather than just “predict joints from condition X.” The core move is straightforward but strong: discretize motion by body region, fold those motion tokens together with text and audio tokens into one vocabulary, then use a pretrained encoder-decoder LM plus generative pretraining tasks that align modalities before downstream instruction tuning. The paper is strongest on the argument that shared multimodal priors help co-speech gesture generation and data efficiency. It is weaker on text-to-motion evaluation depth and on whether discrete tokenization is the right long-term substrate for expressive motion.

## One-paragraph overview

The paper introduces **Language of Motion (LoM)**, a multimodal encoder-decoder language model that maps between text, speech, and 3D human motion using a shared token space. Motion is represented compositionally by training separate VQ-VAEs for **face, hands, upper body, and lower body**, while speech is discretized with **HuBERT** and text is tokenized with **SentencePiece / T5 wordpieces**. The training recipe has two stages before downstream use: first, **generative multimodal pretraining** aligns modalities through audio-to-text and motion-part translation tasks, including both spatial body-part prediction and temporal masked-motion reconstruction; second, **instruction-following post-training** compiles tasks like audio-to-motion, text-to-motion, and emotion-from-motion into natural-language prompts. On the BEATv2 co-speech benchmark the method reports the best overall numbers in the paper’s comparison table, and the broader pitch is that this same setup can also support editable generation from mixed audio+text prompts and even motion-to-emotion prediction.

## Model definition

### Inputs
- speech audio, tokenized with HuBERT discrete units
- text prompts, tokenized with the T5 SentencePiece vocabulary
- 3D human motion represented with SMPL-X + FLAME parameters and then discretized into region-specific motion tokens
- instruction prompts describing the requested cross-modal task

### Outputs
- full-body motion tokens that are decoded back into 3D motion
- text outputs for some translation-style tasks
- emotion labels phrased as text when doing motion understanding

### Training objective (loss)
The language model itself is trained with standard **autoregressive next-token prediction** over the unified multimodal token stream. Motion tokenizers are trained separately as VQ-VAEs with reconstruction, velocity, acceleration, mesh reconstruction, mesh-velocity/acceleration, and commitment losses. The paper fine-tunes the full LM weights rather than doing LoRA.

### Architecture / parameterization
- base LM: **Flan-T5-Base (220M)** encoder-decoder transformer
- maximum input length: **512 tokens**
- motion tokenization: four separate VQ-VAEs for **face / hands / upper / lower**
- audio tokenization: **HuBERT** units from 16 kHz audio, downsampled to 50 Hz token rate
- motion representation: SMPL-X with FLAME face parameters; body split into compositional subspaces instead of collapsing everything into HumanML3D-style skeletal features

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
Most prior motion systems are narrow. Speech-driven gesture models take audio. Text-to-motion models take captions. Motion-understanding models are separate again. That fragmentation wastes data and leaves each task learning its own small local prior.

This paper is trying to build a single modeling frame where **verbal language** and **non-verbal body language** are handled together. The practical claim is that human motion should not be treated as an isolated regression target; it should be treated as another tokenized modality that can be translated to and from speech and text.

### 2. What is the method?
The method has three main pieces.

**1. Compositional motion tokenization.**  
The body is split into **face (106 dims)**, **hands (180)**, **upper body (78)**, and **lower body (54)** using 6D rotations plus facial expression parameters. Each region gets its own VQ-VAE, so the model predicts region-specific discrete motion codes rather than one monolithic motion token stream.

**2. Generative multimodal pretraining.**  
Before downstream fine-tuning, the model learns modality alignment through translation-style tasks:
- **audio to text**
- **body-part to body-part** translation for spatial alignment
- **masked motion to unmasked motion** for temporal alignment

This is the part I find most important. The paper is not merely throwing modalities into one model; it is explicitly trying to force the LM to learn cross-modal correspondences and motion priors before the final task.

**3. Instruction-following post-training.**  
Downstream tasks are formatted as natural-language instructions. The paper says it uses dozens of templates per task and over a thousand instruction variants overall, so audio-to-motion, text-to-motion, and related tasks are all cast as instruction-conditioned generation.

### 3. Why does the compositional tokenization matter?
Because expressive motion is not well captured by a flattened skeletal format alone. The authors explicitly reject the common HumanML3D-style representation for this use case, arguing that it overemphasizes gross skeletal movement and underrepresents twisting rotations and expressive body language. Splitting the body into face, hands, upper body, and lower body is meant to preserve compositional structure and let the model learn cross-part coordination.

That design seems reasonable. If you care about gesture semantics and emotional expression, face and hands should not be reduced to afterthoughts.

### 4. What data does it use?
For the main gesture-generation story, the paper uses:
- **BEATv2** for co-speech gesture generation
- **LibriSpeech** for audio-text pretraining
- **AMASS** to broaden motion priors, especially for joint text+audio motion capability
- **HumanML3D text annotations** during text-to-motion post-training

The paper states that pretraining uses about **1,000 hours of audio-to-text data** plus about **60 hours of motion data** from BEATv2 and LibriSpeech, while deliberately avoiding paired audio-to-motion exposure during pretraining.

### 5. How is it trained?
There are effectively three stages:

**Stage 1: motion tokenizers.**  
Train separate VQ-VAEs for body regions, plus a global translation predictor.

**Stage 2: LM pretraining.**  
Use the tokenized modalities and train Flan-T5-Base on multimodal translation tasks. In the paper, this is the part that aligns audio with text and motion with itself compositionally.

**Stage 3: instruction tuning / post-training.**  
Fine-tune on downstream tasks such as audio-to-motion and text-to-motion, expressed as instructions.

The paper fine-tunes all model weights instead of adapter-only tuning.

### 6. What are the main results?
The clearest quantitative result is on **BEATv2 co-speech gesture generation**.

In Table 1, the full model reports:
- **FGD = 5.301** (lower is better)
- **BC = 7.780**
- **Diversity = 15.167**

That beats the listed baselines, including **EMAGE** and **SynTalker**, on all three reported metrics in the table.

The pretraining ablations are also important:
- removing **language pretraining** hurts a lot
- removing **multimodal pretraining** hurts
- removing **audio-to-text alignment** hurts
- removing **spatial** or **temporal** motion pretraining hurts

The data-scarcity figure is arguably more interesting than the headline benchmark win. The model keeps a clear advantage even when post-training gets only small fractions of paired data, which supports the paper’s actual thesis better than a single benchmark table does.

### 7. What novel capabilities does the paper claim beyond standard gesture generation?
Two stand out.

**Editable generation from joint audio + text prompts.**  
The model can combine spoken content with textual constraints on movement, for example generating speech-conditioned upper-body gestures while a text prompt specifies lower-body behavior like sitting or walking. This is presented qualitatively rather than with a strong benchmark, but it is a plausible benefit of the formulation.

**Emotion prediction from motion.**  
The model is also prompted to infer emotion labels from motion alone. In Table 3 it strongly outperforms MotionGPT on text-similarity metrics for this task. This is not the paper’s main contribution, but it does show the upside of treating motion as something readable as well as generatable.

### 8. What is actually novel here?
The novelty is not “use T5 on tokenized data.” That part is now familiar.

The more specific novelty is the combination of:
- **compositional body-part tokenization**
- a **shared multimodal vocabulary** spanning text, audio, and motion
- **generative pretraining tasks for modality alignment**, especially spatial and temporal motion alignment
- instruction tuning that unifies generation and understanding tasks in one LM framing

That package is more interesting than any one component by itself.

### 9. What are the strengths?
- The paper has a coherent thesis rather than a pile of tricks.
- The pretraining design is motivated and the ablations actually test it.
- The compositional body representation makes more sense for expressive motion than a coarse skeleton-only abstraction.
- The data-efficiency story is credible and practically important.
- Treating motion understanding and generation under one framework is strategically right.

### 10. What are the weaknesses, limitations, or red flags?
- The strongest quantitative evidence is still concentrated in **co-speech gesture generation**. The broader “unified verbal and non-verbal language” claim is ahead of the evidence.
- Editable generation is mostly qualitative in this paper.
- The authors themselves note that **discrete motion tokenization** can lead to incoherent motion, which is a meaningful limitation.
- The text-to-motion side is not evaluated as deeply here as specialized text-to-motion papers would demand.
- Using a 220M T5 backbone is a sensible engineering choice, but it also means some of the “language model magic” claim may just be a compact and well-structured conditional model rather than a truly broad multimodal reasoner.

### 11. What does the code repository concretely implement?
The repo is substantive enough to treat as a real release, not just a landing page.

Concrete things present in the local clone:
- `train.py` built around **PyTorch Lightning**
- `demo.py` for inference and rendering
- `lom/` package with architecture, data, model, metric, rendering, optimizer, and utility modules
- `configs/` covering tokenizer training, LM pretraining, instruction tuning, demos, evaluators, and rendering
- `scripts/` for speech token extraction and compositional motion-code generation
- `preprocess/` with AMASS and LibriSpeech preparation code plus a dataset guide

Some concrete config details match the paper closely:
- `configs/config_mixed_stage2.yaml` sets **STAGE: lm_pretrain**, **BATCH_SIZE: 16**, **AdamW lr 2e-4**, **bf16**, and uses `lom.data.MixedDataset.MixedDataModule`
- that same config wires separate tokenizers for **face / hand / upper / lower / global**, mostly with **code_num 256** and **codebook_size 256**
- `configs/config_mixed_stage3_a2m.yaml` sets **STAGE: lm_instruct**, trains on **BEAT2 speaker 2**, uses **CoSpeechMetrics**, and points to pretrained checkpoints like `lom_a2m/Instruct_Mixed_A2M_LM.ckpt`
- `demo_text2motion.yaml` points to a text-to-motion checkpoint and keeps the same compositional tokenizer structure

The demo path is concrete:
- `python demo.py --cfg configs/demo_text2motion.yaml --text examples/text2motion.txt --task text2motion --render`
- `python demo.py --cfg configs/demo_cospeech.yaml --audio examples/2_scott_0_111_111.wav --task cospeech --render`

The implementation also reveals some practical dependencies that matter:
- PyTorch 2.4 / CUDA 12.1
- `fairseq` for HuBERT-related components
- external SMPL-X / FLAME resources fetched via `build_resources.sh`
- Blender + TEMOS-based rendering via `setup_blender.sh`

### 12. How mature does the repo look?
Moderately mature, not polished-production mature.

Reasons to take it seriously:
- it is clearly more than a toy release
- training, inference, preprocessing, tokenizer, and rendering code are all present
- there are named configs for stage-1 tokenizer training, stage-2 LM pretraining, and stage-3 instruction tuning
- the README exposes concrete commands, checkpoints, and resource layout expectations

Reasons not to oversell it:
- the README still has typos, rough edges, and a few incomplete explanations
- pretrained models are described as **“gradually uploading”**
- one TODO item remains unchecked for text-to-motion in rotation format
- setup is dependency-heavy and not close to one-command reproducibility
- I did not find signs of a strong testing / CI discipline from the top-level repo structure alone

So: this is a meaningful research-code release, but still normal academic code, not hardened infrastructure.

### 13. What ideas are steal-worthy?
- Motion as a **tokenized modality inside a language-model interface**
- **body-part compositionality** as the default representation for expressive motion
- using **audio-to-text alignment** to improve speech-to-motion semantics
- instruction-tuned multimodal motion models instead of task-specific heads
- framing motion understanding tasks like emotion inference as just another translation problem

### 14. Final decision
**Keep.**

The paper is not a definitive solution to “multimodal motion intelligence,” but it is a strong piece of work with a real architectural idea behind it. The most convincing part is not just the benchmark win; it is the full argument that multimodal generative pretraining plus compositional motion tokenization buys you better priors and materially better behavior under limited paired data. That is a useful pattern and likely a better direction than continuing to train isolated task-specific motion models.
