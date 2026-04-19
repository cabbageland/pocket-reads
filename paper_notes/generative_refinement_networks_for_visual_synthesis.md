# Generative Refinement Networks for Visual Synthesis

## Basic info

* Title: Generative Refinement Networks for Visual Synthesis
* Authors: Jian Han, Jinlai Liu, Jiahuan Wang, Bingyue Peng, Zehuan Yuan
* Year: 2026
* Venue / source: arXiv
* Link: https://arxiv.org/abs/2604.13030
* Code: https://github.com/MGenAI/GRN
* Date read: 2026-04-19
* Why selected in one sentence: It is a serious attempt to break the diffusion default in visual generation by combining near-lossless discrete tokenization with an autoregressive refinement loop that can revise its own earlier mistakes.

## Quick verdict

* Highly relevant

This is one of the more interesting visual-generation papers in a while because it is not just another "our diffusion model is bigger" story. The paper attacks two different weaknesses in autoregressive visual generation at once: the representation bottleneck from lossy discrete tokenizers and the generation bottleneck from irreversible left-to-right prediction. Their answer is a paired design: Hierarchical Binary Quantization (HBQ) to make discrete tokens much less lossy, and Generative Refinement Networks (GRN) to replace one-pass causal decoding with a global iterative refinement process that can both fill in and erase tokens as more context arrives. I buy the core idea more than the full hype, but the package is coherent and the ImageNet numbers are strong enough that this feels like a real alternative design direction, not just a quirky side branch.

## One-paragraph overview

GRN reframes autoregressive visual synthesis as repeated whole-token-map editing rather than a one-way token stream. The model starts from random tokens, predicts a global token map, randomly keeps only part of that prediction, and then repeats the process so later steps can preserve good regions, overwrite bad ones, and gradually converge toward a coherent sample. That refinement loop would be much less compelling if the underlying discrete latent space were too lossy, so the paper also proposes HBQ, a coarse-to-fine binary quantization scheme whose reconstruction error shrinks exponentially with the number of quantization rounds. Together, these pieces let the authors claim something fairly bold: discrete autoregressive generation can recover reconstruction quality close to continuous tokenizers while also becoming more adaptive and error-correcting than standard AR decoding. On ImageNet class-conditional generation, that recipe reaches 1.81 FID, and the paper then scales the same paradigm to text-to-image and text-to-video at a 2B-parameter scale.

## Model definition

### Inputs
For generation, the model takes a token map composed of a mixture of retained predicted tokens and random tokens, plus conditioning information such as ImageNet class labels or text prompts. For tokenizer training, the input is an image or video passed through a causal VAE encoder before hierarchical binary quantization.

### Outputs
The tokenizer outputs discrete latent tokens derived from hierarchical binary quantization. The GRN transformer outputs a refined full token-map prediction at each step, which is decoded back into an image or video after the refinement schedule completes.

### Training objective (loss)
The tokenizer is trained with a weighted combination of reconstruction loss, LPIPS perceptual loss, and GAN loss. The GRN generator itself is trained with straightforward cross-entropy over target tokens given partially observed token maps and conditioning.

### Architecture / parameterization
The representation side uses a 3D causal VAE-style tokenizer plus Hierarchical Binary Quantization. The generation side uses a transformer that predicts the next refined token map from the current partially kept map. The paper studies two variants: GRN_ind, which predicts quantized indices, and GRN_bit, which predicts bits directly. For ImageNet class-to-image, they train models from 130M up to 2B parameters; the larger 2B setup is also used for text-to-image and text-to-video experiments.

## What problem is the paper trying to solve?

The paper is targeting a real gap between the two dominant stories in visual generation. Diffusion and flow models produce strong samples, but they spend a fixed amount of compute on every sample and do not naturally expose adaptive step counts tied to sample difficulty. Autoregressive models do have likelihoods and a more natural notion of complexity-aware generation, but in vision they are usually handicapped by bad discrete tokenizers and by error accumulation from strictly causal generation. GRN is trying to build an autoregressive alternative that keeps the adaptive-compute upside without inheriting the usual tokenization and exposure-bias pain.

## Main idea / method

There are really two linked contributions.

### 1. Hierarchical Binary Quantization (HBQ)

Instead of mapping each latent feature to a single discrete codebook entry, HBQ repeatedly quantizes each latent element into binary decisions over multiple rounds. After applying a `tanh` to bound latent features into `(-1, 1)`, each round asks whether a feature is above or below the current center, adds a signed contribution at scale `2^-j`, and then refines further. The important claim is that quantization error decays exponentially with the number of rounds, so a discrete latent can approach near-lossless reconstruction surprisingly quickly without inflating latent channel count.

That matters because most AR visual pipelines quietly depend on mediocre discrete tokenizers. If the latent itself is mushy, generation quality is capped before the transformer even starts. HBQ is the paper's way of removing that excuse.

### 2. Global autoregressive refinement instead of one-way decoding

The generation process starts from a random token map. At each step, the model predicts an entire token map, then a random binary selection mask decides which predicted tokens are kept and which locations revert to random tokens. On the next iteration, the transformer sees this mixed map and predicts again. Because the retained-token ratio increases over time, the sample gradually stabilizes. But unlike standard AR decoding, the model is allowed to revise earlier choices globally as more context appears.

This is the paper's most intuitive contribution. It is autoregressive in the sense that each step depends on the previous state, but it is not causally trapped in a left-to-right order. The authors explicitly frame it as closer to how a human might sketch and refine than how a typewriter emits irreversible symbols.

### 3. Complexity-aware sampling via entropy

The paper adds an entropy-guided schedule for how fast the keep-ratio should increase. Low-entropy predictions imply easier samples and allow fewer steps with more aggressive retention. High entropy implies more uncertainty, so the model takes more refinement steps. This is the mechanism behind the paper's claim that AR generation can be naturally adaptive in compute.

## Evidence and results

### Tokenizer quality

The HBQ tokenizer is probably the cleanest part of the empirical story.

On ImageNet 256x256 reconstruction, HBQ with four rounds reaches:

* **0.56 rFID**
* **0.13 LPIPS**
* **0.71 SSIM**

The notable comparison is not just to older discrete tokenizers like LlamaGen or Open-MAGVIT2. It also beats the continuous SD-VAE baseline in rFID while operating at a higher compression ratio. That is a big deal if it holds up under broader use, because discrete-token methods have often felt like they start the race already injured.

For the joint image-video tokenizer, the story is more nuanced but still interesting. Increasing HBQ rounds steadily improves reconstruction quality, and the 8-round setup nearly matches the continuous baseline without increasing latent dimensionality. The authors also show that expanding latent channels from 16 to 64 plus GAN-loss tuning improves perceptual quality substantially.

### Class-conditional ImageNet generation

This is the paper's headline benchmark and the strongest reason to take it seriously.

Their 2B-parameter GRN model reports:

* **1.81 FID** on ImageNet 256x256
* **299.0 IS**

That slightly beats JiT-G at 1.82 FID and outperforms strong autoregressive baselines like VAR-d30 at 1.92 and LlamaGen-XXL at 2.34. It is also competitive with, or better than, several major diffusion/flow baselines depending on which metric slice you care about.

I would not over-interpret a 0.01 edge over JiT as proof that the field is solved. But getting into that range with a discrete AR-style system is enough to make the design direction real.

### Text-to-image and text-to-video

The 2B T2I model reports **0.76 overall on GenEval**, which the paper positions as clearly stronger than similarly sized 2B baselines like SD3 Medium (0.62) and Infinity (0.71), while still behind much larger frontier models.

For text-to-video, the 2B model reports **82.99 overall on VBench**, beating several diffusion/video baselines of comparable or somewhat larger size and trailing only stronger large-scale systems like Wan 2.1 and InfinityStar.

The more honest reading is: GRN scales beyond ImageNet and remains competitive, but the class-conditional ImageNet result is where the paper is most convincing. The T2I/T2V sections are best treated as evidence of breadth, not yet definitive category leadership.

## What seems genuinely important

### 1. The paper attacks the tokenizer and generator bottlenecks together

A lot of visual-generation papers improve one half of the pipeline while inheriting the other half's failure mode. GRN is stronger than average because the HBQ tokenizer and refinement generator clearly belong together. Better reconstruction alone would not fix AR error accumulation. Better refinement alone would still be limited by a lossy discrete latent. The joint design is the point.

### 2. It gives autoregressive vision a plausible error-correction story

The usual criticism of AR image generation is not just speed. It is that once the model makes a bad commitment, the rest of the sample has to live with it. GRN's refine-and-rewrite loop is a direct answer to that. Whether this becomes the long-term answer is open, but it is at least the right shape of answer.

### 3. Complexity-aware compute is more natural here than in diffusion

Because the model measures uncertainty through token prediction entropy, it has a legible mechanism for sample-dependent step counts. That is appealing both conceptually and practically. It suggests a way out of the "every image gets the same denoising budget" habit that diffusion inherits.

### 4. The paper is a useful push against diffusion inevitability

Even if diffusion remains dominant in products, this paper weakens the lazy assumption that all serious visual generation progress must stay inside the diffusion/flow family.

## Where I'm skeptical

### 1. The paper sometimes overstates "next-generation" status

The method is strong, but the title and framing are a bit grandiose. One strong ImageNet result and competitive T2I/T2V scaling are not yet enough to declare a new dominant paradigm.

### 2. Adaptive-step benefits are more argued than fully stress-tested

The entropy-based scheduling is sensible, but I would want more evidence that this adaptive mechanism gives robust wall-clock or quality-compute advantages across diverse tasks, not just that it is philosophically nicer than fixed-step diffusion.

### 3. Some of the scaling claims rely on proprietary data or tuning

The T2I model is fine-tuned on a proprietary high-quality dataset, and the T2V model is trained on a huge internally curated 40M-video corpus. That does not invalidate the method, but it does make parts of the scaling story less clean as an apples-to-apples research comparison.

### 4. ImageNet remains a narrow battleground

ImageNet class-conditional generation is still a useful benchmark, but it is also one where models can look unusually good while hiding weaknesses that show up in more open-ended prompt following, compositionality, or editing settings.

## Relation to other work / why it matters

GRN sits in a useful middle lane between diffusion/flow systems and pure causal visual AR models like VAR or LlamaGen. It keeps the discrete-token AR worldview, but rejects the assumption that generation order has to be irreversible and local. In that sense it also feels adjacent to masked or parallel decoding approaches like MaskGIT, except the refinement process here is wrapped in a more explicitly autoregressive state-transition loop.

The other comparison that matters is to recent work that tries to save discrete visual modeling by making tokenizers better. HBQ belongs in that conversation. If discrete visual generation is going to stay relevant, better representation quality is not optional.

## My take

This is a very good paper. Not because every benchmark line is unquestionably definitive, but because it identifies the right pair of problems and solves them in a way that actually fits together. HBQ is a solid representation idea on its own. The refinement network is a much better answer to AR error accumulation than just "train a bigger transformer." And the full package produces results strong enough that you cannot dismiss it as clever-but-niche.

If I had to compress the takeaway into one sentence, it would be: **GRN makes autoregressive visual generation feel editable instead of trapped.** That is a real conceptual upgrade.

## Bottom line

Keep.

This is one of the better arguments that discrete autoregressive visual generation still has headroom, especially if you stop forcing it to use bad tokenizers and irreversible decoding. I would remember it less as "the model that got 1.81 FID" and more as a coherent blueprint: high-fidelity discrete latents plus global iterative refinement is a design pattern worth watching.
