# GaussianGPT: Towards Autoregressive 3D Gaussian Scene Generation

## Basic info

* Title: GaussianGPT: Towards Autoregressive 3D Gaussian Scene Generation
* Authors: Nicolas von Luetzow, Barbara Roessle, Katharina Schmid, Matthias Niessner
* Year: 2026
* Venue / source: arXiv / project page
* Link: https://nicolasvonluetzow.github.io/GaussianGPT/
* Date read: 2026-03-31
* Date surfaced: 2026-03-30 (via Zhiwen Fan)
* Why selected in one sentence: It tests whether 3D Gaussian scene generation really benefits from an autoregressive formulation instead of the current diffusion default.

## Quick verdict

* Useful

This is a clean counterargument to the assumption that 3D scene generation must be diffusion-first. The core idea is simple and concrete: quantize Gaussian primitives, serialize them, and let a causal transformer grow the scene token by token. I only had project-page and abstract-level access, so I trust the method sketch more than any fine-grained empirical claim.

## One-paragraph overview

GaussianGPT turns explicit 3D Gaussian scenes into discrete tokens and models them autoregressively. A sparse 3D convolutional VQ autoencoder compresses Gaussian primitives into a latent grid, those tokens are serialized, and a causal transformer with 3D rotary positional embeddings predicts the next tokens. The point is not just novelty-by-architecture. Autoregression gives natural support for incremental completion, outpainting, and controllable sampling without the full-scene iterative denoising loop used by diffusion and flow-matching methods.

## Model definition

### Inputs
The learned system takes discrete tokens derived from a quantized latent grid of 3D Gaussian primitives, plus spatial position information and any optional conditioning context for partial scene completion.

### Outputs
It outputs the next latent tokens in the serialized Gaussian sequence, which are then decoded back into a full 3D Gaussian scene representation.

### Training objective (loss)
From the accessible material, the main objective is standard autoregressive next-token prediction over the serialized latent tokens. I did not verify the exact auxiliary reconstruction or codebook losses used inside the VQ autoencoder.

### Architecture / parameterization
A sparse 3D convolutional autoencoder with vector quantization produces discrete latent tokens. A causal transformer with 3D rotary positional embeddings models those tokens autoregressively.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
Most 3D Gaussian generative work uses diffusion-style whole-scene refinement. This paper asks whether explicit 3D scene generation can instead be done token by token in a way that is simpler to control.

### 2. What is the method?
Compress 3D Gaussian primitives into a discrete latent grid, serialize the tokens, train a causal transformer to predict them autoregressively, then decode back to Gaussians.

### 3. What is the method motivation?
Autoregression gives explicit ordering, incremental generation, and direct control knobs like temperature and horizon length. Those are awkward in holistic denoising pipelines.

### 4. What data does it use?
The project page and abstract did not expose the full dataset inventory in the material I inspected. I only know it trains on 3D Gaussian scene data appropriate for generative scene modeling.

### 5. How is it evaluated?
The accessible sources indicate scene generation plus downstream capabilities like completion and outpainting. I did not inspect the full benchmark tables.

### 6. What are the main results?
The claim is that autoregressive generation is competitive enough to be a serious alternative while enabling controllable completion-style behavior. I am not asserting exact numbers because I did not verify them.

### 7. What is actually novel?
Not 3D Gaussians by themselves, and not autoregression by itself. The novelty is the concrete tokenization of explicit Gaussian scene structure into a causal transformer-friendly representation.

### 8. What are the strengths?
The mechanism is legible. The generation process matches the representation. The control affordances are clearer than in diffusion-heavy 3D pipelines.

### 9. What are the weaknesses, limitations, or red flags?
Autoregressive ordering can become brittle if the tokenization is poor. Long sequences may make generation slow. Partial-access only means I cannot judge whether the empirical gap to diffusion is small or large.

### 10. What challenges or open problems remain?
Scaling autoregressive 3D generation to larger scenes, better tokenizations for geometry and appearance, and stronger conditioning interfaces all remain open.

### 11. What future work naturally follows?
Hybrid AR-diffusion models, better hierarchical token orders, and direct editing interfaces over Gaussian token sequences.

### 12. Why does this matter?
Because 3D generation is drifting toward giant diffusion stacks by default. This paper is a useful reminder that representation and generation order still matter.

### 13. What ideas are steal-worthy?
Discrete tokenization of explicit Gaussian structure, 3D rotary embeddings for scene order, and using AR generation to make completion/outpainting first-class behaviors.

### 14. Final decision
Keep as a useful design reference. Even if diffusion still wins raw quality, this is a good paper to remember when controllability and explicit structure matter more than benchmark theater.
