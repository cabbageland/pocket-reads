---
title: Turning Video Models into Generalist Robot Policies
slug: turning-video-models-into-generalist-robot-policies
authors: Sizhe Lester Li, Evan Kim, Xingjian Bai, Tong Zhao, Tao Pang, Max Simchowitz, Vincent Sitzmann
year: 2026
venue: arXiv preprint (cs.RO, cs.AI, cs.CV, cs.LG)
date_read: 2026-06-29
paper_url: https://arxiv.org/abs/2605.27817
pdf_url: https://arxiv.org/pdf/2605.27817
verdict: Strong decoupling idea, translation bottleneck remains
summary: VERA turns an action-free video model into a robot policy by separating future prediction from action recovery. A large video planner generates plausible future observation frames for the commanded task, while an embodiment-specific Jacobian Inverse Dynamics Model predicts an image-space Jacobian that maps robot action increments to optical flow. At test time, the system generates a short video plan, converts the visual transition into action chunks through a ridge-regularized pseudoinverse, executes, observes, and replans. The sim results are strong across Allegro, Panda, and PushT settings, and the paper reports real Panda and Allegro demonstrations. The key idea is attractive: use general video models for action-free planning, then learn a smaller embodiment-specific translator.
why_it_matters: VERA is a clean alternative to stuffing actions directly into a vision-language-action model. It treats video prediction and robot control as separable problems: dream the visual future with a large video model, then recover actions with an inverse dynamics layer tied to the robot. That could make robot learning more modular across embodiments, but the inverse translation layer is still the hard part.
final_decision: Keep. Cite it for action-free video planning plus Jacobian inverse dynamics, receding-horizon video-to-action control, and the argument that general video models can be useful robot planners without native action heads. Do not oversell it as zero-data robot control: VERA still needs robot-specific video for planner post-training and embodiment-specific inverse dynamics training.
tags: robotics, video-models, robot-policy, inverse-dynamics, jacobian, embodied-ai, robot-learning, video-planning, receding-horizon-control, action-free-video, vla-alternative, generalist-robots
---

# Turning Video Models into Generalist Robot Policies

## Basic info

* Title: Turning Video Models into Generalist Robot Policies
* Authors: Sizhe Lester Li, Evan Kim, Xingjian Bai, Tong Zhao, Tao Pang, Max Simchowitz, Vincent Sitzmann
* Year: 2026
* Venue / source: arXiv preprint (cs.RO, cs.AI, cs.CV, cs.LG)
* Link: https://arxiv.org/abs/2605.27817
* PDF: https://arxiv.org/pdf/2605.27817
* Project page: https://vera.csail.mit.edu/
* Code: https://github.com/sizhe-li/VERA
* arXiv version inspected: v1, submitted 2026-05-27
* Date read: 2026-06-29
* Date surfaced: 2026-06-29 (via Tracy)
* Why selected in one sentence: It is a clean attempt to turn general video prediction into robot control without forcing the video model itself to own the robot action space.

## Quick verdict

Strong decoupling idea, translation bottleneck remains

VERA is interesting because it does not try to make a video model directly output robot actions. Instead, it lets the video model do what video models are good at: generate plausible future observations. A separate inverse dynamics layer converts those visual transitions into actions for a particular embodiment. That modularity is the point. The caveat is also the point: the quality of the whole system depends on whether the visual transition contains enough controllable motion for the inverse dynamics model to recover the right action.

## One-paragraph overview

VERA is a robot policy architecture that combines an action-free video planner with an embodiment-specific Jacobian Inverse Dynamics Model. The video planner, adapted from the Large Video Planner line using a Wan-family video model, generates multi-view future frames conditioned on the current observation and task. The J-IDM predicts a dense image-space Jacobian field: for each pixel, how small changes in robot action should move the image. Given the generated future frames, VERA estimates optical flow, uses the learned Jacobian to solve a ridge-regularized least-squares inverse problem for robot actions, executes a short action chunk, and replans in closed loop. The paper evaluates in simulation across Allegro, Panda, and PushT domains and shows real-world Panda and Allegro demonstrations.

## What problem is the paper trying to solve?

Large video models learn a great deal about how the visual world changes, but they usually do not know robot action spaces. Robot policies, meanwhile, need embodiment-specific controls: joint positions, end-effector deltas, gripper commands, hand joints, and so on.

The common solution is to train a vision-language-action model with an action head. That works when there is enough action-labeled robot data for the relevant embodiment, but it ties the large model to robot action labels.

VERA asks whether we can keep the planner action-free and learn only a smaller embodiment-specific translator from visual transitions to actions.

## Core idea

The system has two pieces.

First, a video planner predicts what should happen visually if the task succeeds. It does not output actions.

Second, a Jacobian Inverse Dynamics Model maps desired visual motion to robot action increments. It predicts how action dimensions influence image-space optical flow, then inverts that relationship to recover the action that would produce the generated visual transition.

In control form:

* generate future frames,
* estimate the desired visual displacement,
* use the learned image-action Jacobian to solve for an action chunk,
* execute a short prefix,
* observe the new state,
* replan.

That closed-loop receding horizon is important because video plans drift.

## What is the J-IDM?

The J-IDM predicts a dense Jacobian field over image pixels. Each local Jacobian says how changing the robot action should move that pixel in the image.

Training uses adjacent robot video frames and action labels. Optical flow supplies the visual displacement target. The model is initialized from visual geometry features, including VGGT for real-world scale in the main setup and DINOv2 in smaller ablations.

At test time, VERA compares the current frame to a generated future frame, obtains a desired flow, and solves a ridge-regularized pseudoinverse problem to recover actions. This is more structured than a direct inverse dynamics regressor because it grounds the action recovery in visual motion.

## Why might this be better than direct inverse dynamics?

Direct inverse dynamics predicts actions from a pair of frames. That can work, but it can also learn brittle correlations or fail when the desired transition differs from training distribution.

The Jacobian formulation asks a more local question: how does each action dimension move the image? That gives a smoother way to invert desired visual change into actions and makes the action recovery more tied to controllable image features.

It is still not magic. If the generated transition has little observable motion, heavy occlusion, or requires force without visible displacement, the J-IDM has weak evidence.

## What are the simulation results?

The headline simulation table compares UniPi-style inverse dynamics against J-IDM.

Reported success/progress:

* Allegro-Sim: UniPi* 0 / 0, J-IDM 70.0 +/- 14.5 / 70.0 +/- 14.5.
* Panda-Sim MimicGen: UniPi* 0 / 0, J-IDM 94.0 +/- 3.4 / 94.0 +/- 3.4.
* PushT-Sim: UniPi* 74.4 +/- 3.4 / 84.8 +/- 2.8, J-IDM 92.5 +/- 2.1 / 95.5 +/- 1.6.

The main takeaway is that the visual Jacobian translator is much better than a plain inverse dynamics layer in these settings, especially for higher-dimensional robot control.

## What about action reconstruction?

The action reconstruction table is more mixed, which is useful.

J-IDM is best on Allegro, PushT, and the 5-joint finger setting. On Panda Sim, a D-IDM plus flow baseline has lower reconstruction error than J-IDM. The policy-level results still favor J-IDM, suggesting that action reconstruction error alone is not the full story; the closed-loop visual control behavior matters.

This is a good warning against reading a single inverse-dynamics metric as the policy metric.

## What are the real-world claims?

The paper reports real-world experiments with DROID-trained checkpoints and an in-house Panda suite. On basic tasks, the reported comparison is DreamZero 90%, VERA 60%, and pi0.5 30%. On harder prompts involving occlusion, location changes, and semantic object selection, the text emphasizes that DreamZero and pi0.5 often act on the wrong object while VERA can use visual planning to select and manipulate the intended target.

The paper also shows real Allegro hand control for 16-DoF cube reorientation.

The important read is not "VERA wins every real task." It is that the same action-free video planner plus embodiment-specific J-IDM idea can be made to run on different robot embodiments.

## Strengths

The decomposition is elegant. A general video model can remain action-free, while a smaller robot-specific model handles the translation into controls.

The J-IDM is more structured than a black-box inverse dynamics head. Predicting an image-action Jacobian is a useful bridge between visual planning and control.

The receding-horizon loop is practical. It acknowledges that generated videos are plans, not scripts.

The multi-embodiment angle is real: Panda arm, PushT-style planar control, and Allegro hand settings stress different action spaces.

## Weaknesses and caveats

VERA is not pure zero-data robot control. The video planner is post-trained on robot video, and the J-IDM needs embodiment-specific action-labeled robot data.

The inverse translator is the bottleneck. If the video plan contains visual changes that are not achievable, not visible, or not captured by the learned Jacobian, action recovery can fail.

RGB-only planning does not reason directly about force. That limits contact-rich manipulation where the right action depends on pressure, friction, or hidden contact state.

The approach depends on off-the-shelf optical-flow and visual geometry tools for supervision and features. Their failures can become control failures.

The real-world section is promising but still relatively narrow compared with the size of the claim in the title.

## Why It Matters

VERA is a good conceptual counterweight to monolithic VLA thinking. It says: maybe the large model should not have to know every robot's action vocabulary. Let it predict futures in the common language of video, then learn a robot-specific inverse map from desired visual change to action.

That is an attractive architecture for multi-embodiment robotics because embodiments differ in action space more than they differ in visual task outcome. But the price is a hard translation problem at the boundary between dream and act.

## Final Decision

Keep as a strong video-model-to-robot-policy reference. Cite it for action-free video planning, Jacobian inverse dynamics, and closed-loop video-to-action control. Keep the caveat attached: the method still needs robot-specific data and fails where visual motion is an insufficient proxy for controllable physical interaction.
