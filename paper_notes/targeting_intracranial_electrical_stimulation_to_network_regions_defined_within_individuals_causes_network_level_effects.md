# Targeting intracranial electrical stimulation to Network Regions Defined Within Individuals Causes Network-Level Effects

## Basic info

* Title: Targeting intracranial electrical stimulation to network regions defined within individuals causes network-level effects
* Authors: Christopher Cyr, Ania M. Holubecki, Lingxiao Shi, Maya Lakshman, Joseph J. Salvo, Nathan L. Anderson, James E. Kragel, Sarah M. Lurie, Joel Voss, Vasileios Kokkinos, Joshua Rosenow, Stephan U. Schuele, Elizabeth L. Johnson, Christina Zelano, Rodrigo M. Braga
* Year: 2025
* Venue / source: bioRxiv preprint
* Link: https://pmc.ncbi.nlm.nih.gov/articles/PMC12324475/
* DOI: 10.1101/2025.07.31.667730
* PDF: https://pmc.ncbi.nlm.nih.gov/articles/PMC12324475/pdf/nihpp-2025.07.31.667730v2.pdf
* Date read: 2026-05-05
* Date surfaced: 2026-05-05
* Surfaced via: Tracy in #pocket-brains
* Why selected in one sentence: It is a sharp network-neuroscience paper showing that individualized resting-state functional maps can make intracranial stimulation more predictably network-specific.

## Quick verdict

* Highly relevant

This is a very good paper. The core idea is simple, concrete, and surprisingly actionable: if you define large-scale networks within each patient using enough resting-state fMRI, then electrical stimulation becomes more predictable at the network level. The authors do not merely show a vague correlation between functional connectivity and stimulation spread. They identify a specific functional-anatomical sweet spot for stimulation, namely low-current stimulation in or near white matter, immediately adjacent to a dominant targeted network region defined within that individual. That is a strong and useful result. The biggest caveat is that the study is still modest in participant count and partly exploratory at the low-current regime where the most selective effects seem to live.

## One-paragraph overview

The paper studies whether precision functional mapping, or PFM, can be used to target intracranial electrical stimulation toward specific large-scale brain networks in individual epilepsy patients. The authors collect unusually deep resting-state fMRI from each patient before surgery, define individualized network maps, and then analyze how stimulation location, depth into white matter, distance to a target network, network dominance around the stimulation site, and current intensity shape the effects of both single-pulse stimulation and high-frequency stimulation. They find that stimulation near a mapped network is more likely to produce within-network responses and network-relevant behavioral effects, that white-matter-adjacent stimulation is especially effective, that lower current makes selective network modulation more plausible, and that individualized maps outperform group atlases when predicting behaviorally relevant stimulation sites.

## Model definition

### Inputs
Individualized resting-state fMRI-derived network maps, intracranial electrode locations, anatomical estimates of gray-white matter boundaries, and stimulation events with associated current intensity, frequency, and observed electrophysiological or behavioral outcomes.

### Outputs
Predictions and analyses of whether stimulation evokes distal within-network responses, broader multi-network propagation, or network-relevant behavioral effects.

### Training objective (loss)
There is no trained machine learning model here. The work is mainly descriptive and statistical, relating stimulation effects to individualized network geometry and anatomical context.

### Architecture / parameterization
The conceptual model is a stimulation-targeting framework built from four factors:
- current intensity,
- depth into white matter,
- distance to the targeted network,
- dominance of the targeted network around the stimulation site.

PFM provides the individualized network map, and then the paper tests how these factors jointly govern SPES and HFES outcomes.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
The paper is trying to solve a real practical problem in human neuroscience and neuromodulation: electrical stimulation clearly perturbs brain function, but we are still bad at making those perturbations selective and predictable at the large-scale network level. Group-average atlases wash out individual topography, and ordinary stimulation-site descriptions like “temporal cortex” or “white matter versus gray matter” are too crude if the real causal unit is a distributed network. The authors want to know whether individualized functional maps can tell us where stimulation should go if we want to preferentially affect a specific network or behavior.

### 2. What is the method?
The method combines precision functional mapping with intracranial stimulation analysis.

The pipeline is:
1. Collect a lot of resting-state fMRI from each epilepsy patient before implantation.
2. Use those data to define individualized large-scale cortical networks.
3. Localize intracranial electrodes and characterize each bipolar stimulation site by:
   - distance to gray-white matter boundary,
   - distance to each nearby network,
   - network dominance around the site.
4. Analyze single-pulse electrical stimulation, or SPES, to see where distant evoked responses appear.
5. Analyze high-frequency electrical stimulation, or HFES, to see where network-relevant behavioral effects appear.
6. Compare individualized maps to a group-level atlas.

The paper then asks which stimulation sites produce network-specific or network-relevant effects and what parameters make that more likely.

### 3. What is the method motivation?
The motivation is that group-average network maps blur away individual differences exactly where stimulation targeting needs precision. If one patient’s language network, salience network, or default-network parcel sits slightly differently than the group average, then atlas-based targeting can miss the relevant tissue. Precision functional mapping should give a truer picture of the functional terrain. Once you have that terrain, you can ask a much more specific question than “what lobe are we in?” You can ask how close the site is to a network, whether one network dominates the surrounding cortex, and whether placing stimulation in the adjacent white matter gives better leverage over that network.

### 4. What data does it use?
The participants are 11 neurosurgical epilepsy patients, ages 23 to 61, who underwent extensive presurgical resting-state fMRI and then intracranial stimulation as part of clinical care and research follow-up.

Important data details:
- Up to four MRI sessions per patient.
- Roughly 35 to 189 minutes of resting-state fMRI per participant retained after QC.
- 102 SPES stimulation sites across nine patients for the final SPES analyses.
- 221 conclusive HFES sites across 11 patients.

The study excludes some medial temporal and subcortical sites from the main network-distance analyses because the cortical surface and gray-white boundary estimates are less reliable there.

### 5. How is it evaluated?
The paper evaluates several linked questions:
- whether SPES activates more networks as current rises,
- whether white-matter-adjacent stimulation increases spread and efficacy,
- whether stimulation closer to a targeted individualized network more often evokes responses in that network,
- whether HFES closer to a targeted network more often elicits corresponding behavioral effects,
- whether high network dominance helps produce clearer, more specific effects,
- whether individualized maps outperform a group atlas.

These are tested with correlations, generalized linear models, permutation tests, pairwise comparisons, and distance-binned outcome analyses.

### 6. What are the main results?
There are several strong results.

First, higher current spreads more broadly. SPES at higher current activates more networks, and the number of activated networks plateaus after about 4 mA. That is important because selectivity seems to degrade as current rises.

Second, white matter matters a lot. SPES sites deeper into or nearer white matter activated more networks, and HFES sites eliciting behavioral effects were also significantly more often in or near white matter than sites with no effects.

Third, proximity to the target network predicts network-level effects. For SPES, stimulation sites within about 10 mm of a targeted network were significantly more likely than chance to evoke distant activity in that same network. For HFES, sites within about 5 mm of a targeted network were significantly more likely to cause network-relevant behavioral effects.

Fourth, local dominance matters. If one network dominated the area around the stimulation site, network-specific activation and clearer behavioral effects became more likely.

Fifth, individualized maps beat group maps. Sites causing network-related behavioral effects were overall closer to the individualized PFM-defined networks than to their group-atlas analogs.

The resulting recipe is pretty crisp: low current, just below the gray-white interface, close to the target network, where that network dominates locally.

### 7. What is actually novel?
The novelty is not simply “we used individualized fMRI.” The more interesting contribution is the joint targeting framework.

The paper identifies a functional-anatomical sweet spot defined by:
- individualized network proximity,
- white-matter adjacency,
- local network dominance,
- low current intensity.

That is a more operational account of how to achieve network-level stimulation than older studies that mostly correlated stimulation responses with generic functional connectivity.

It is also notable that the authors analyze both electrophysiological SPES responses and behaviorally meaningful HFES effects in the same framework.

### 8. What are the strengths?
- The question is genuinely useful, not just academically decorative.
- The individualized mapping is deep enough to be credible, not thin resting-state data pretending to be precision mapping.
- The paper studies both physiological spread and behavioral consequences.
- The results cohere into a practical targeting rule rather than a pile of disconnected associations.
- The individualized versus group-atlas comparison is important and well motivated.
- The discussion does a good job separating strong findings from exploratory low-current claims.

### 9. What are the weaknesses, limitations, or red flags?
- The sample is still small by modern standards, especially once you slice by current intensity and effect category.
- The strongest selectivity story depends partly on exploratory analyses of 1 mA stimulation with relatively few cases.
- The work is focused on cortical network regions with reasonably clean surface mapping, so the conclusions do not automatically transfer to medial temporal or subcortical stimulation.
- Behavioral effects during HFES depend on what tasks clinicians happened to test, so some “no effect” sites may really be “untested relevant effect” sites.
- The dominance metric depends on assumptions about the listening zone and Gaussian weighting volume.

None of those kill the paper, but they matter.

### 10. What challenges or open problems remain?
A big open problem is whether this framework can be turned into a forward model that prospectively chooses stimulation sites and parameters, rather than retrospectively explaining outcomes. Another is how well the sweet-spot idea generalizes to subcortex, medial temporal lobe, and therapeutic neuromodulation settings rather than mainly mapping and causal-probing contexts. There is also a broader practical question: PFM is data-hungry. How much of the benefit can be approximated with less scanning, or with better individualized priors?

### 11. What future work naturally follows?
- Prospective trials where stimulation targeting is explicitly chosen using individualized network maps.
- More low-current stimulation experiments to confirm the selectivity regime.
- Extending the framework to memory, mood, and subcortical targets.
- Better electric-field models layered on top of individualized network geometry.
- Work on how much resting-state data is truly needed before PFM stops paying extra dividends.

### 12. Why does this matter?
It matters because it tightens the loop between functional neuroanatomy and causal intervention. A lot of neuroscience can tell you which areas correlate with a function. This paper gets closer to telling you where and how to stimulate if you want to actually perturb a specific network in a specific person. That is useful for cognitive neuroscience, epilepsy mapping, and potentially future therapeutic neuromodulation.

## Why It Matters

This paper is valuable because it gives a more disciplined picture of brain stimulation than the usual “hit a site and see what happens” approach. The brain is not just a map of local functions, it is a set of overlapping large-scale networks. If individualized network maps let you find the right patch of adjacent white matter and keep the current low enough to avoid splash damage, then stimulation can become meaningfully more selective. That is a real advance in control, not just interpretation.

### 13. What ideas are steal-worthy?
- Treat individualized functional topography as the real targeting substrate for causal intervention.
- Use distance-to-network and local network dominance as explicit stimulation-design variables.
- Think of white matter just beneath functionally relevant cortex as a controllable access route rather than a nuisance.
- Keep current low when selectivity matters, because high current buys spread and often loses specificity.
- Compare individualized and group maps directly on the downstream intervention outcome, not just map similarity.

### 14. Final decision
Keep.

This is one of the better recent papers on network-aware human stimulation. The core result is practical, mechanistically sensible, and more actionable than a generic connectivity-stimulation correlation. I would definitely keep it in pocket brains.