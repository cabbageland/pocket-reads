# Functional vs Structural Cortical Deficit Pattern Biomarkers for Major Depressive Disorder

## Basic info

* Title: Functional vs Structural Cortical Deficit Pattern Biomarkers for Major Depressive Disorder
* Authors: Peter Kochunov, Bhim M Adhikari, David Keator, Daniel Amen, Si Gao, Nicole R Karcher, Demetrio Labate, Robert Azencott, Yewen Huang, Hussain Syed, Hongjie Ke, Paul M Thompson, Danny J. J. Wang, Braxton D. Mitchell, Jessica A. Turner
* Year: 2025
* Venue / source: JAMA Psychiatry
* Link: https://pmc.ncbi.nlm.nih.gov/articles/PMC11966481/
* DOI: 10.1001/jamapsychiatry.2025.0192
* Date read: 2026-05-05
* Date surfaced: 2026-05-05
* Surfaced via: Tracy in #pocket-brains
* Why selected in one sentence: It is a strong neuroimaging biomarker paper making a pretty direct claim that functional hypoperfusion-like signatures in depression are larger and more reproducible than structural cortical-thickness effects.

## Quick verdict

* Relevant

This is a solid large-sample neuroimaging biomarker paper, and the main claim is sharper than the title initially suggests. The authors are not just saying resting-state functional measures differ from structural ones. They argue that a specific regional homogeneity, or ReHo, deficit pattern in major depressive disorder tracks regional cerebral blood flow patterns much better than cortical thickness does, and that this can be compressed into an individual-level vulnerability score that is stronger than the structural version. I buy the broad directional result more than I buy it as a ready clinical biomarker. The sample sizes are good, the cross-dataset replication story is respectable, and the hypoperfusion interpretation is plausible, but the effect sizes are still not magical and the cohorts are heterogeneous in ways that make “biomarker” sound more clinically mature than the evidence really is.

## One-paragraph overview

The paper asks whether depression is better characterized by a reproducible functional cortical deficit pattern than by structural cortical thinning. Using four datasets spanning resting-state fMRI ReHo, cortical thickness, arterial spin labeling cerebral blood flow, and SPECT perfusion, the authors show that people with major depressive disorder have regionally patterned ReHo reductions, especially in cingulate, temporal, and frontal areas, and that those patterns correlate across cohorts and line up with regional cerebral blood flow deficits better than with structural thickness differences. They then build a regional vulnerability index, or RVI, from these effect-size templates and show that the ReHo-based and perfusion-based RVIs separate MDD from controls more strongly than a structural RVI and also track symptom severity better. The paper’s core pitch is that widely available resting-state fMRI may capture a reproducible hypoperfusion-like brain signature in depression that structural MRI largely misses.

## Model definition

### Inputs
Case-control neuroimaging measurements from four cohorts, including resting-state fMRI regional homogeneity values, cortical thickness measures, and regional cerebral blood flow estimates from ASL and SPECT.

### Outputs
Regional effect-size maps for MDD versus control comparisons, cross-modal and cross-cohort correlations of those maps, and individual-level regional vulnerability index scores derived from the group deficit patterns.

### Training objective (loss)
There is no learned predictive model in the modern ML sense. The paper computes regional case-control effect sizes and then uses correlation-based similarity to derive RVI biomarkers.

### Architecture / parameterization
The analysis pipeline is essentially: compute regional MDD effect sizes on ReHo, compare them to cortical-thickness and cerebral-blood-flow effect-size maps, then score each individual by how much their regional profile matches the MDD template. The cortical atlas is Desikan-Killiany and the ReHo computation is voxelwise Kendall coefficient concordance aggregated to cortical regions.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
The paper is trying to solve the old problem that depression neuroimaging findings are often weak, heterogeneous, and clinically disappointing. Structural MRI findings in MDD usually have tiny effect sizes, which makes them hard to reproduce and even harder to use as biomarkers. The authors think the more relevant pathology may be functional, especially perfusion-related, and that resting-state ReHo might provide a scalable proxy for that. So the central problem is whether there is a more reproducible, biologically grounded, individual-level imaging signature for MDD than structural cortical measures provide.

### 2. What is the method?
The method is a multi-cohort comparative imaging analysis rather than a new scanner sequence or end-to-end predictive model.

They use:
- UK Biobank for ReHo plus structural cortical thickness,
- ENIGMA for large-sample cortical-thickness MDD effect sizes,
- Amish Connectome Project for ReHo, structure, and ASL-based regional cerebral blood flow,
- Amen Clinics data for SPECT-based regional cerebral blood flow.

They compute regional effect sizes for MDD versus controls, compare the pattern of ReHo deficits to cortical thickness and perfusion maps, and then derive regional vulnerability index scores showing how much an individual’s brain resembles the disorder template.

### 3. What is the method motivation?
The motivation is that depression probably does not behave like a strong cortical atrophy disorder, so structural MRI may simply be the wrong primary signal if the goal is a sensitive biomarker. ReHo is already widely available from resting-state fMRI and has often been interpreted as reflecting local synchrony, but the authors argue that it may partly reflect regional blood flow. If ReHo patterns mirror perfusion deficits and do so more robustly than structure, then resting-state fMRI could provide a more useful and scalable window into MDD pathophysiology.

### 4. What data does it use?
Four cohorts, total N = 15,501:
- UK Biobank: 4,810 participants, including 2,220 with recurrent MDD and 2,590 controls.
- ENIGMA: 10,115 participants, including 2,148 with MDD and 7,957 controls.
- Amish Connectome Project: 204 participants, including 68 with lifetime MDD and 136 controls.
- Amen Clinics Inc: 372 participants, including 296 with recurrent MDD and 76 controls.

The functional measures are resting-state fMRI ReHo, ASL cerebral blood flow, and SPECT cerebral blood flow. Structural measures are cortical thickness.

### 5. How is it evaluated?
The paper evaluates three things:
- whether regional ReHo effect-size patterns replicate across cohorts,
- whether those patterns correlate with regional cerebral blood flow deficits more than with cortical thickness deficits,
- whether RVI scores built from ReHo outperform structural RVI in separating MDD from controls and tracking symptom severity.

The core statistics are regional Cohen’s d maps, correlations among maps, and case-control effect sizes for the resulting RVI scores.

### 6. What are the main results?
The main result is that the functional story is substantially stronger than the structural one.

Key results:
- In UKBB, average ReHo effect size for MDD was about Cohen d = -0.28, versus essentially 0 for cortical thickness.
- The strongest ReHo deficits were in cingulate and superior/transverse temporal regions, with some individual regional effects around d = -0.38 to -0.39.
- ReHo effect-size maps correlated with perfusion effect-size maps across independent datasets, roughly r = 0.46 to 0.52, and ReHo and ASL perfusion in ACP correlated around r = 0.57.
- Functional RVIs were stronger than structural RVIs. ReHo-RVI and perfusion-RVI case-control effects ranged about d = 0.33 to 0.90, while structural RVI sat around d = 0.09 to 0.20.
- Functional RVI was associated with depression symptom severity across samples, while structural RVI was not.

So the punchline is not that ReHo perfectly diagnoses depression, but that its disorder pattern is larger, more reproducible, and more perfusion-like than the structural alternative.

### 7. What is actually novel?
The novelty is mainly in the cross-modal interpretation and the biomarker framing.

More specifically:
- it argues that MDD-related ReHo deficits reflect a regional hypoperfusion pattern rather than vague local-connectivity impairment,
- it extends the regional vulnerability index idea from structural imaging into functional ReHo and perfusion domains,
- it tests the claim across several distinct cohorts and two perfusion modalities.

That is more interesting than just another case-control ReHo paper.

### 8. What are the strengths?
- Large aggregate sample size.
- Clear contrast between functional and structural effect sizes.
- Cross-cohort replication rather than a one-dataset story.
- Nice triangulation across ReHo, ASL, and SPECT.
- The RVI framing is practical because it converts regional maps into an individual-level score.
- The paper makes a more mechanistic claim than many psychiatric imaging papers, namely hypoperfusion-like physiology rather than handwavy “abnormal connectivity.”

### 9. What are the weaknesses, limitations, or red flags?
- “Biomarker” is probably still aspirational. Even d = 0.33 is not clinic-ready, and the strongest d = 0.90 comes from a specialty treatment-seeking sample that is likely quite enriched.
- The cohorts are heterogeneous in age, recruitment setting, and measurement modality, which cuts both ways: good for robustness, but hard for strict comparability.
- The ReHo-to-perfusion interpretation is plausible, not fully definitive. Correlation is not identity.
- The atlas is coarse, and the authors admit more fine-grained atlases might improve or alter the results.
- The UKBB-derived template comes from an older, largely White sample, which may limit generalization.
- Diagnostic specificity is not addressed. A reproducible functional deficit pattern is not automatically specific to MDD versus other psychiatric conditions.

### 10. What challenges or open problems remain?
The biggest open problem is specificity. Even if this is a real functional depression signature, how much does it overlap with anxiety, bipolar depression, schizophrenia, chronic stress, medication effects, or nonspecific illness burden? Another open question is whether these RVI scores are trait markers, state markers, treatment-response markers, or some mixture. The field also still needs better protocol harmonization if ReHo-based biomarkers are going to travel across scanners and sites.

### 11. What future work naturally follows?
- Head-to-head disease-specificity studies across psychiatric diagnoses.
- Longitudinal studies testing whether ReHo-RVI changes with treatment or relapse.
- More diverse and younger derivation cohorts.
- Better regional atlases and potentially subcortical extensions.
- Direct multimodal studies where the same individuals have high-quality ReHo and perfusion measures, rather than cross-cohort triangulation.

### 12. Why does this matter?
It matters because structural MRI has mostly failed to give psychiatry strong biomarkers, and this paper is a decent argument that resting-state functional measures may carry more of the real disorder signal, at least for depression. It also tries to rescue ReHo from years of fuzzy interpretation by tying it to perfusion. If that story holds up, there is a practical upside: resting-state fMRI is more widely available than dedicated perfusion imaging in many research settings.

## Why It Matters

The important thing here is not “ReHo wins” in some generic benchmarking sense. It is that the paper points toward a more grounded picture of depression as a regionally patterned functional perfusion problem rather than a structural cortical-thinning problem. That is a more plausible biological story, and it gives people a sharper target for future interventional and stratification work.

### 13. What ideas are steal-worthy?
- Use disorder-template similarity scores rather than isolated regional statistics when effects are distributed and individually weak.
- Reinterpret some functional MRI measures through a physiological lens instead of defaulting to generic connectivity language.
- Compare modalities via regional effect-size patterns, not just participant-level classification.
- Treat replication across acquisition methods as part of the argument for mechanism.

### 14. Final decision
Keep.

This is a worthwhile paper for pocket brains because it is not just another “brain imaging differences in depression” result. It sharpens the claim to a reproducible functional hypoperfusion-like pattern, gives some evidence that the pattern is more robust than structural alternatives, and proposes a usable summary metric. I would keep the conclusion slightly conservative, but the paper is definitely worth having in the pile.