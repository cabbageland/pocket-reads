---
title: FADEL: Uncertainty-aware Fake Audio Detection with Evidential Deep Learning
slug: fadel-uncertainty-aware-fake-audio-detection-with-evidential-deep-learning
authors: Ju Yeon Kang, Ji Won Yoon, Semin Kim, Min Hyun Han, Nam Soo Kim
year: 2025
venue: ICASSP 2025 / arXiv preprint
date_read: 2026-06-15
paper_url: https://arxiv.org/abs/2504.15663
pdf_url: https://arxiv.org/pdf/2504.15663
verdict: Compact, practical uncertainty fix for audio deepfake detection
summary: FADEL is a fake-audio detection training framework that replaces ordinary softmax probabilities with probabilities derived from a Dirichlet distribution, so the classifier can express uncertainty when facing unseen spoofing attacks. Applied to Res-TSSDNet and AASIST on ASVspoof2019 LA, and to AASIST in ASVspoof2021 LA cross-dataset testing, it improves EER and min t-DCF while reducing the hard 0/1 overconfidence pattern of standard softmax classifiers.
why_it_matters: Audio deepfake detectors are mostly useful when the next attack is not exactly like the attacks seen in training. FADEL matters because it attacks the reliability problem directly: not just "is the score right," but "does the model know when its evidence is weak?"
final_decision: Keep. This is a short ICASSP paper, but the method is clean, easy to graft onto existing backbones, and relevant anywhere spoofing detectors need calibrated behavior under distribution shift.
tags: fake-audio-detection, audio-deepfake, anti-spoofing, uncertainty, evidential-deep-learning, ASVspoof, OOD-generalization
---

# FADEL: Uncertainty-aware Fake Audio Detection with Evidential Deep Learning

## Basic info

* Title: FADEL: Uncertainty-aware Fake Audio Detection with Evidential Deep Learning
* Authors: Ju Yeon Kang, Ji Won Yoon, Semin Kim, Min Hyun Han, Nam Soo Kim
* Year: 2025
* Venue / source: ICASSP 2025 / arXiv preprint
* Link: https://arxiv.org/abs/2504.15663
* PDF: https://arxiv.org/pdf/2504.15663
* DOI: https://doi.org/10.1109/ICASSP49660.2025.10888053
* Date read: 2026-06-15
* Date surfaced: 2026-06-15
* Surfaced via: Tracy in #pocket-reads via arXiv PDF link
* Why selected in one sentence: Fake-audio detection lives or dies on unseen attacks, and this paper asks the right reliability question: can the detector stop being confidently wrong when the spoofing method is out of distribution?

## Quick verdict

Compact, practical uncertainty fix for audio deepfake detection

FADEL is a short, focused paper with a clean idea: replace the usual softmax-plus-cross-entropy fake-audio classifier head with an evidential deep learning formulation, so class probabilities come from a Dirichlet distribution and the model has an explicit uncertainty signal. The empirical story is not huge, but it is useful. On ASVspoof2019 LA, FADEL improves both Res-TSSDNet and AASIST, and in ASVspoof2021 LA cross-dataset evaluation it beats both plain AASIST and an ASAM baseline. The best part is the diagnostic analysis: standard AASIST makes extremely confident 0/1-style predictions, while AASIST-FADEL spreads probability mass more cautiously and its average uncertainty tends to track per-attack EER. The caveat is that this is a narrow, 5-page ICASSP paper: two backbones, one main benchmark family, no large stress test across modern foundation-model speech generators, and calibration is argued mostly through histograms and uncertainty/EER correlation rather than a full calibration suite.

## One-paragraph overview

The paper proposes FADEL, fake audio detection with evidential learning, for audio anti-spoofing systems that must detect unseen spoofing attacks. Standard countermeasure models usually end in a softmax classifier trained with weighted cross-entropy; that setup can produce overconfident predictions, especially when test attacks differ from the six spoofing algorithms seen during ASVspoof2019 LA training. FADEL keeps the backbone models intact but changes the classifier interpretation and loss: model outputs become non-negative evidence, evidence plus one becomes the Dirichlet concentration parameter alpha, class probabilities are the Dirichlet mean, and uncertainty is inversely related to total evidence. The method is applied to Res-TSSDNet and AASIST using their original architectures and hyperparameters. On ASVspoof2019 LA evaluation, Res-TSSDNet-FADEL improves average EER from 3.53 to 2.92 and average min t-DCF from 0.1093 to 0.0878; AASIST-FADEL improves average EER from 1.47 to 1.21 and average min t-DCF from 0.0464 to 0.0340. In ASVspoof2021 LA cross-dataset testing, AASIST-FADEL improves average EER from 8.08 to 5.60 and average min t-DCF from 0.4037 to 0.3334, also beating ASAM under the paper's setup.

## Model definition

This is not a new waveform or spectrogram backbone. It is a training and output-interpretation framework for fake-audio detection backbones.

### Inputs

- an input utterance
- a binary target label: bonafide or spoofed
- a backbone fake-audio detector such as Res-TSSDNet or AASIST
- ASVspoof2019 LA train/development data during training
- ASVspoof2019 LA evaluation or ASVspoof2021 LA evaluation data during testing

### Outputs

- class probabilities for bonafide and spoofed speech
- an uncertainty score derived from the total Dirichlet evidence
- a detection score evaluated through EER and min t-DCF

### Training objective

The ordinary setup computes logits, pushes them through softmax, and trains with weighted cross-entropy. FADEL instead treats the model output as evidence. A non-negative activation, such as softplus, ReLU, or exponential, converts the final layer outputs into evidence values. Each evidence value is shifted by one to produce a Dirichlet alpha parameter. Class probability is then the expected class probability under that Dirichlet distribution, alpha_k divided by the sum of all alpha values.

The evidential loss is the expected weighted cross-entropy under the Dirichlet distribution. In closed form, the per-sample loss becomes a weighted target-label sum of digamma terms: psi(total evidence) minus psi(class alpha). Intuitively, the model is rewarded for placing evidence on the correct class without being forced through softmax's exponential certainty machine.

### Architecture / parameterization

FADEL is attached to existing Res-TSSDNet and AASIST implementations while preserving their original architecture and hyperparameter configurations. The paper experiments with three evidence activations: ReLU, exponential, and softplus. In the main AASIST-FADEL result, the reported numbers match the softplus setting, which gives the best min t-DCF in the activation ablation, while exponential gives the best average EER.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?

Fake-audio detection is not just a binary classification problem under clean i.i.d. assumptions. A detector trained on known spoofing algorithms has to work against new synthesis and voice-conversion methods that were not present in the training set. That is exactly the ASVspoof setup: ASVspoof2019 LA training and development contain attacks A01-A06, while the evaluation split introduces unseen attacks A07-A19.

The paper's diagnosis is that softmax classifiers are a bad fit for this setting because they are structurally overconfident. Softmax exponentiates small logit differences into sharp probabilities, and maximum-likelihood cross-entropy training focuses on making the target class probable rather than representing uncertainty. In an OOD spoofing attack, this can make a detector look certain even when it is wrong.

### 2. What is FADEL?

FADEL stands for fake audio detection with evidential learning. It is an evidential deep learning wrapper for fake-audio countermeasure systems.

The basic move is:

- the backbone produces final outputs
- a non-negative activation turns those outputs into evidence
- evidence plus one gives the Dirichlet alpha parameters
- class probabilities are computed from the Dirichlet mean
- uncertainty is computed as number of classes divided by total alpha
- training uses an evidential loss instead of ordinary softmax weighted cross-entropy

For binary bonafide/spoofed classification, if the model has little evidence, total alpha is low and uncertainty is high. If it has a lot of evidence for a class, total alpha is high and uncertainty is low. This gives the classifier a pressure valve that softmax does not naturally have.

### 3. Why is evidential learning a plausible fit here?

The task is naturally full of distribution shift. The next spoofing attack may be produced by a different TTS or voice-conversion pipeline from anything in the training set. A detector should be able to say, in effect, "this looks unlike what I know," instead of converting every input into a confident bonafide/spoofed probability.

Evidential learning does not solve OOD detection by itself, but it gives the classifier an uncertainty-aware probability model. That is a better conceptual match than treating every score as if it came from a well-covered class-conditional distribution.

### 4. What data and metrics are used?

The main dataset is ASVspoof2019 Logical Access. The model trains on the train and development sets and is evaluated on the evaluation set, where spoofing algorithms A07-A19 are unseen during training. For cross-dataset evaluation, models train on ASVspoof2019 LA train and development data, then test on ASVspoof2021 LA evaluation data.

The metrics are:

- EER, equal error rate
- min t-DCF, minimum normalized tandem detection cost function

EER is the standard detection tradeoff metric. min t-DCF matters because anti-spoofing countermeasures sit in front of speaker verification systems; a detector can harm or help the full tandem ASV pipeline.

### 5. What baselines are compared?

For ASVspoof2019 LA, the paper compares against prior systems including LFCC+PC-DARTS, CQT+2D-Res-TSSDNet, RawNet2, RawGAT-ST, Res-TSSDNet, and AASIST. The key controlled comparisons are Res-TSSDNet versus Res-TSSDNet-FADEL, and AASIST versus AASIST-FADEL, where the architecture is preserved and the training/classifier formulation changes.

For ASVspoof2021 LA cross-dataset evaluation, the comparison is AASIST, AASIST with ASAM, and AASIST-FADEL. ASAM is included as a strong generalization baseline and is trained only on ASVspoof2019 LA in this setup.

### 6. What are the main results?

On ASVspoof2019 LA evaluation:

- Res-TSSDNet: 3.53 average EER, 3.01 best EER, 0.1093 average min t-DCF, 0.0932 best min t-DCF.
- Res-TSSDNet plus FADEL: 2.92 average EER, 2.79 best EER, 0.0878 average min t-DCF, 0.0875 best min t-DCF.
- AASIST: 1.47 average EER, 1.35 best EER, 0.0464 average min t-DCF, 0.0375 best min t-DCF.
- AASIST plus FADEL: 1.21 average EER, 1.18 best EER, 0.0340 average min t-DCF, 0.0276 best min t-DCF.

The authors summarize those as a 17 percent EER and 20 percent min t-DCF reduction for Res-TSSDNet, and an 18 percent EER and 27 percent min t-DCF improvement for AASIST.

On ASVspoof2021 LA cross-dataset evaluation:

- AASIST: 8.08 average EER, 7.36 best EER, 0.4037 average min t-DCF, 0.3764 best min t-DCF.
- AASIST plus ASAM: 6.10 average EER, 5.16 best EER, 0.3448 average min t-DCF, 0.3244 best min t-DCF.
- AASIST plus FADEL: 5.60 average EER, 4.91 best EER, 0.3334 average min t-DCF, 0.3108 best min t-DCF.

That cross-dataset result is the most important one, because it directly tests the paper's OOD motivation.

### 7. What does the overconfidence analysis show?

The paper plots histograms of predicted bonafide probabilities for AASIST and AASIST-FADEL. Plain AASIST clusters heavily at the edges, near 0 and 1. That is classic softmax overconfidence: the model makes almost binary-looking probability assignments.

AASIST-FADEL produces a less edge-concentrated distribution. Spoof samples that receive relatively high bonafide probability are still generally lower than actual bonafide samples, but the model no longer treats every case as if it has maximal evidence. This is exactly the behavior one wants from a detector facing realistic-looking spoofed speech: still discriminative, but less delusionally certain.

### 8. Does the uncertainty signal mean anything?

The paper gives a useful but limited validation. It plots average uncertainty against EER for spoofing algorithms A07-A19 in ASVspoof2019 LA. The reported pattern is a strong correlation between higher uncertainty and higher error rate, except for A07, A16, and A17, which are marked as lower-correlation exceptions.

This is a good sanity check: uncertainty is not just a decorative scalar if it tracks which spoofing algorithms are harder. But it is not a complete calibration study. The paper does not deeply analyze expected calibration error, selective prediction, abstention curves, or thresholding policies that would turn uncertainty into operational decisions.

### 9. What does the activation ablation show?

FADEL needs a non-negative activation to turn model outputs into evidence. The paper tests ReLU, exponential, and softplus on AASIST-FADEL:

- ReLU: 1.18 average EER, 1.13 best EER, 0.0388 average min t-DCF, 0.0362 best min t-DCF.
- Exponential: 1.16 average EER, 1.13 best EER, 0.0359 average min t-DCF, 0.0347 best min t-DCF.
- Softplus: 1.21 average EER, 1.18 best EER, 0.0340 average min t-DCF, 0.0276 best min t-DCF.

Exponential gives the best average EER, while softplus gives the best min t-DCF. Since t-DCF is particularly relevant to speaker-verification deployment, the softplus result is not a throwaway detail.

### 10. What is actually novel?

The novelty is applying evidential deep learning to fake-audio detection countermeasures and showing that the uncertainty-aware formulation improves established anti-spoofing backbones under unseen-attack evaluation. The mathematical pieces are not new: Dirichlet evidence, subjective-logic-style uncertainty, and evidential loss are inherited from prior EDL work. The useful contribution is putting them into the audio anti-spoofing context, where OOD attacks are the normal operating condition rather than a corner case.

### 11. What are the strengths?

- The method is simple and modular. It can be grafted onto existing backbones.
- The controlled backbone comparisons make the gain easy to interpret.
- The paper tests both in-domain unseen attacks on ASVspoof2019 LA and cross-dataset generalization to ASVspoof2021 LA.
- The overconfidence histogram directly supports the motivation.
- The uncertainty/EER plot is a useful sanity check that the uncertainty scalar tracks hard spoofing algorithms.
- The results improve both EER and min t-DCF, so the gain is not just one metric behaving nicely.

### 12. What are the weaknesses, limitations, or red flags?

The first limitation is scope. This is a 5-page ICASSP paper with two backbones and the ASVspoof LA ecosystem. That is a reasonable first result, but it is not broad evidence that FADEL will hold up against every modern deepfake-audio distribution.

The second limitation is calibration depth. The paper talks about overconfidence, and the histogram evidence is persuasive, but it does not provide a full calibration evaluation. I would want expected calibration error, reliability diagrams, selective risk/coverage curves, and uncertainty-threshold deployment analysis before treating this as a complete reliability solution.

The third limitation is that the uncertainty validation is algorithm-level, not necessarily instance-level. Average uncertainty tracking average EER across attack algorithms is useful. It does not prove the uncertainty score is well calibrated on individual utterances.

The fourth limitation is operational. The paper does not show how to use uncertainty in a real ASV pipeline: abstain, send to secondary review, adjust thresholds, route to a stronger detector, or update attack-family monitoring.

The fifth limitation is comparison breadth. ASAM is included for cross-dataset evaluation, but the paper does not compare against a wide set of modern calibration, energy, OOD, ensemble, or Bayesian-ish baselines.

### 13. What challenges or open problems remain?

The core open problem is turning uncertainty from a better training signal into a deployment policy. A useful fake-audio detector should not only output "spoofed" or "bonafide"; it should know when to abstain, escalate, or trigger more expensive analysis. FADEL gives a plausible uncertainty score, but the paper stops short of building the operational layer around it.

Other open problems:

- test against newer, more diverse speech generators and voice-conversion systems
- measure instance-level calibration, not just algorithm-level uncertainty trends
- compare against post-hoc calibration, ensembles, energy-based OOD scores, and conformal-style methods
- study threshold stability across datasets and recording conditions
- evaluate whether uncertainty helps active learning or attack-family discovery
- combine FADEL with data augmentation and multi-dataset training rather than treating them as separate knobs

## Why It Matters

Audio deepfake detection is an adversarial generalization problem wearing a binary-classification costume. A detector that is confidently wrong on a new spoofing method is worse than a detector that admits uncertainty, because confident wrong scores can pass through an ASV system as if nothing is strange. FADEL is worth keeping because it pushes the classifier away from fake certainty without requiring a new backbone or a giant retraining setup.

## Final Decision

Keep. This is not a grand theory paper, but it is a clean engineering move with the right instinct. For Pocket Reads, the takeaway is simple: when a domain is defined by unseen attacks, a detector's uncertainty behavior is part of the model, not just a nice-to-have diagnostic after the fact.
