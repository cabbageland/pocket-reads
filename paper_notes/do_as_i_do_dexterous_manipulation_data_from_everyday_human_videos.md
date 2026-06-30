---
title: Do as I Do: Dexterous Manipulation Data from Everyday Human Videos
slug: do-as-i-do-dexterous-manipulation-data-from-everyday-human-videos
authors: Bhawna Paliwal, Haritheja Etukuru, William Liang, Pieter Abbeel, Nur Muhammad Mahi Shafiullah, Jitendra Malik
year: 2026
venue: arXiv preprint (cs.RO, cs.CV)
date_read: 2026-06-29
paper_url: https://arxiv.org/abs/2606.19333
pdf_url: https://arxiv.org/pdf/2606.19333
verdict: Valuable pipeline, sobering data funnel
summary: Do as I Do builds a pipeline for turning everyday monocular RGB human videos into dexterous robot manipulation trajectories. It reconstructs hand-object interaction from video, tracks object pose with a diffusion-based pose tracker, aligns hand and object in near-metric 3D, and then retargets the motion to a robot hand with dynamics-aware sampling-based optimization in MuJoCo Warp. The strongest result is not a single robot demo; it is the end-to-end claim that internet and egocentric human videos can become usable dexterous robot data after heavy filtering, reconstruction, retargeting, and human verification. The catch is severe: in the paper's 100DOH filtering study, only about 4% of sampled clips survive the full quality process.
why_it_matters: Human video is the obvious huge reservoir for robot data, but dexterous contact makes the conversion brutally hard. This paper is useful because it shows both sides: a plausible reconstruction-to-retargeting route, and the true attrition rate of messy web video. The data funnel is the quiet headline.
final_decision: Keep. Cite it for human-video-to-dexterous-robot-data conversion, diffusion-guided object pose tracking, and dynamics-aware retargeting. Do not cite it as proof that ordinary internet video is now cheap robot data; the paper's own filtering numbers say the useful clips are rare and expensive to validate.
tags: robotics, dexterous-manipulation, human-video, retargeting, hand-object-reconstruction, robot-data, imitation-learning, monocular-video, pose-tracking, mujoco, internet-video, embodiment-transfer
---

# Do as I Do: Dexterous Manipulation Data from Everyday Human Videos

## Basic info

* Title: Do as I Do: Dexterous Manipulation Data from Everyday Human Videos
* Authors: Bhawna Paliwal, Haritheja Etukuru, William Liang, Pieter Abbeel, Nur Muhammad Mahi Shafiullah, Jitendra Malik
* Year: 2026
* Venue / source: arXiv preprint (cs.RO, cs.CV)
* Link: https://arxiv.org/abs/2606.19333
* PDF: https://arxiv.org/pdf/2606.19333
* Project page: https://do-as-i-do.com/
* arXiv version inspected: v1, submitted 2026-06-17
* Date read: 2026-06-29
* Date surfaced: 2026-06-29 (via Tracy)
* Why selected in one sentence: It is a full pipeline for turning ordinary human manipulation videos into robot-hand trajectories, with enough filtering detail to keep the hype honest.

## Quick verdict

Valuable pipeline, sobering data funnel

This is a keep. The paper attacks one of the right questions for dexterous robotics: can we extract robot-useful manipulation data from the vast supply of human videos? The answer is "yes, but not casually." The reconstruction and retargeting stack is clever, and the real robot rollouts are meaningful, but the filtering numbers are the thing to remember. From 2,000 sampled 100DOH clips, only 83 survive the full quality process. That is still useful, but it is not free internet-scale robot supervision.

## One-paragraph overview

Do as I Do converts monocular RGB human videos into dexterous robot manipulation trajectories. The first stage reconstructs hand-object interaction: HaWoR estimates the 3D hand, SAM 3D provides object mesh initialization, SAM3 segments the object, MoGe estimates depth and intrinsics, and a guided diffusion tracker estimates object pose through the video. The second stage retargets the reconstructed hand-object motion to a robot hand using a dynamics-aware optimizer in MuJoCo Warp. The retargeter includes warmup steps, random force perturbations, and a transition reward to produce physically plausible robot motions. The authors curate 500 high-quality human-verified trajectories from internet, egocentric, and generated videos, and roll out 10 representative motions on real hardware. The paper's practical message is that the pipeline works, but only after reconstruction, simulation, filtering, and verification do a lot of work.

## What problem is the paper trying to solve?

Dexterous robot learning is starved for data. Human hands perform a huge range of dexterous manipulation behaviors every day, and videos of those behaviors are everywhere. The problem is that videos do not come with robot actions, object poses, contact states, metric scale, clean segmentation, or robot-compatible kinematics.

For simple reaching or pick-and-place, rough visual imitation may be enough. For dexterous manipulation, small pose errors and contact mistakes compound quickly. A robot hand needs a physically plausible trajectory, not just a video that looks semantically similar.

The paper asks whether everyday human videos can be processed into robot-hand trajectories that survive simulation and real rollout.

## How does the reconstruction stage work?

The reconstruction stage estimates both the hand and manipulated object from monocular RGB video.

For the hand, the pipeline uses HaWoR. For the object, it combines SAM 3D mesh estimation, SAM3 segmentation, and MoGe depth/intrinsics. Because object tracking from monocular hand-object video is unstable, the authors use a guided diffusion tracker. It fixes the object shape from an anchor frame, tracks pose frame to frame, uses adaptive pose guidance from point tracks, samples candidate poses, and clusters the samples.

The system also aligns the reconstructed hand and object in near-metric space and uses GeoCalib to align gravity. This matters because retargeting depends on plausible 3D contact, not just 2D overlap.

## How does retargeting work?

The second stage maps human hand-object motion to robot-hand motion.

The paper uses dynamics-aware retargeting in MuJoCo Warp with MPPI-style sampling-based optimization. The optimizer searches for robot actions that preserve the intended interaction while satisfying robot kinematics and physics. Three additions matter in the ablations:

* warmup steps, which stabilize the initial contact configuration,
* random force perturbations, which make the retargeted motion more robust,
* and a transition reward, which encourages smoother physically plausible transitions.

This is the right instinct: for dexterity, kinematic retargeting alone is not enough. The retargeted trajectory must be executable under dynamics.

## What are the main reconstruction results?

The paper evaluates object tracking against FoundationPose and Any6D on DexYCB and HOI4D, and also runs a human preference study on 150 in-the-wild videos.

On in-the-wild clips, human raters prefer the paper's tracker 67% of the time, FoundationPose 18% of the time, with 15% ties. Among non-ties, that is a 79% win rate. The reported Fleiss kappa is 0.65, which suggests decent rater agreement.

On benchmark metrics, the results are less one-sided. On DexYCB, the paper reports stronger Chamfer distance than FoundationPose and Any6D, with similar F-score. On HOI4D, it is roughly tied with FoundationPose. So the method looks most valuable in the hard in-the-wild regime where off-the-shelf pose trackers struggle.

## What are the retargeting results?

The retargeting ablation is clear.

On reconstructed in-the-wild data, baseline annealed sampling has 0.25 success. Adding warmup raises success to 0.66, perturbation to 0.67, and the transition reward to 0.71.

On cleaner OakInk2 data, the same progression goes from 0.72 to 0.81.

The big jump from warmup is telling. Much of dexterous retargeting is lost at the contact initialization stage. If the robot starts in a bad physical configuration, later optimization has to fight the simulator.

## What real data do they produce?

The authors curate 500 high-quality, human-verified dexterous trajectories:

* 53% from internet videos,
* 31% from egocentric videos,
* 16% from generated videos.

They also roll out 10 motions on real hardware, including tasks such as whisking, pouring, dusting, squeezing, tamping, erasing, stirring, hammering, spreading, and picking.

These demos are useful evidence that the pipeline can leave the screen. They are not evidence of broad autonomous deployment. The paper is more convincing as a data-generation pipeline than as a final robot policy paper.

## What is the most important caveat?

The filtering funnel is brutal.

In the 100DOH study, the authors sample 2,000 clips. Only 187 clips, about 9%, contain meaningful hand-object interaction relevant to the pipeline. After boundary checks, activity filters, camera filters, reconstruction failure, and quality validation, only 83 clips survive, about 4%.

The paper notes a best-case relevant count around 107 clips, about 5%. That means naive web-video scraping pays roughly a 20x penalty before usable data appears.

This is not a reason to dismiss the work. It is the most useful operational number in the paper.

## Strengths

The pipeline is end-to-end and grounded. It does not stop at pretty hand reconstructions; it pushes through simulation retargeting and real robot execution.

The diffusion tracker is a sensible answer to the object-tracking problem in hand-object videos, where occlusion and contact make ordinary pose pipelines brittle.

The retargeting stage takes dynamics seriously. That is necessary for dexterous manipulation and easy to underplay.

The paper is unusually useful about filtering and failure rates. That makes it more credible, not less.

## Weaknesses and limitations

The method assumes rigid objects and semi-accurate monocular metric depth. Many everyday dexterous tasks involve deformable objects, fluids, cloth, or articulated tools.

Contact and occlusion remain ambiguous from monocular video. The pipeline can infer plausible motion, but it does not directly observe forces or true contact patches.

The reconstruction covers hand and object, not the full scene. Environment constraints can matter a lot for real manipulation.

Simulation dynamics are approximate, and retargeting success in simulation does not automatically imply robust real-world policy learning.

The human verification burden is real. The pipeline still depends on filtering and quality control.

## Why It Matters

Robot data is the bottleneck, and human videos are the obvious tempting reservoir. This paper shows a plausible path from everyday video to robot-useful dexterous trajectories, but it also gives the anti-delusion numbers: raw video is mostly unusable without heavy filtering.

The best future systems will probably combine this kind of reconstruction-retargeting pipeline with better discovery, active filtering, and tactile or force-grounded validation. The video is the starting ore, not the finished dataset.

## Final Decision

Keep as a strong reference for human-video-to-robot-data conversion. Cite it for diffusion-guided hand-object tracking, dynamics-aware dexterous retargeting, and the real attrition rate of web video. The caveat is essential: this makes human video usable, not cheap.
