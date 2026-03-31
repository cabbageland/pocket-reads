# XLeRobot: Practical Dual-Arm Mobile Home Robot

## Basic info

* Title: XLeRobot: Practical Dual-Arm Mobile Home Robot
* Authors: Gaotian Wang, Zhuoyi Lu, Yiyang Huang, Yihao Liu
* Year: 2025
* Venue / source: open-source robotics project / GitHub hardware release
* Link: https://github.com/Vector-Wangel/XLeRobot
* Date read: 2026-03-31
* Date surfaced: 2026-03-24 (via Zhiwen Fan)
* Surfaced via: https://x.com/vectorwang2/status/2036532851059908956?s=46
* Why selected in one sentence: Even if this surfaced as a tweet, the underlying artifact appears to be an open-source low-cost mobile manipulation platform worth judging on mechanism rather than hype.

## Quick verdict

* Useful

This is not a paper, but it is a materially better project note after reading the actual repository. XLeRobot is a concrete low-cost dual-arm mobile manipulation platform built on openly documented parts, assembly guides, simulation assets, and teleoperation/control interfaces. The useful part is not novelty theater. It is that the repo is specific enough to matter: the project claims a base cost around $660, supports keyboard/Xbox/Joycon/Quest 3 VR control, exposes simulation and RL environments, and is explicitly designed as a household manipulation platform rather than a one-off lab prop.

## One-paragraph overview

XLeRobot is an open-source dual-arm mobile household robot platform oriented around low entry cost and reproducibility. The GitHub repo and docs describe a bill of materials, 3D-printable components, assembly instructions, simulation support, and multiple control modes including keyboard, Xbox controller, Joycon, and Quest 3 VR teleoperation. The stated base configuration starts around $660 before printing, tools, shipping, and tax, with optional stereo, Raspberry Pi, and RealSense upgrades. The project also ships a citation entry titled "XLeRobot: A Practical Low-cost Household Dual-Arm Mobile Robot Design for General Manipulation," which is still a repo-level release rather than a peer-reviewed paper. The right way to keep this in Pocket Reads is as primary-source infrastructure reading: what exactly is documented, what capabilities are really exposed, and whether it looks reproducible enough to support embodied AI work.

## Model definition

### Inputs
Operator control signals from supported input devices, onboard camera observations, robot state, and whatever policy or remote-control software is connected through the stack.

### Outputs
Robot base and arm actions for mobile manipulation tasks.

### Training objective (loss)
There is no single learned-model contribution at the artifact level. The repo mentions RL sim-to-real deployment and VLA integration work, but XLeRobot itself is primarily a platform and control stack.

### Architecture / parameterization
This is a hardware-plus-software platform: wheeled mobile base, dual arms, configurable camera stack, simulation assets, and teleoperation / autonomy interfaces built on top of other open robotics projects such as LeRobot, SO-100/SO-101, Lekiwi, and Bambot.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
Affordable, reproducible mobile manipulation hardware is still scarce, which blocks data collection, teleoperation experiments, and embodied learning work in small labs and individual projects.

### 2. What is the method?
Publish a practical buildable robot platform with a documented bill of materials, assembly path, controller interfaces, simulation environment, and autonomy hooks instead of only showing a lab demo video.

### 3. What is the method motivation?
If a robot is cheap enough and documented enough, more people can actually run the experiments that current embodied AI papers quietly assume access to.

### 4. What data does it use?
Not applicable as a central project contribution, though the repo positions the platform as useful for future data collection and policy learning.

### 5. How is it evaluated?
Primarily through demonstrations, release documentation, and the breadth of supported control / simulation workflows rather than benchmark tables. This is a project-evaluation artifact, not a paper-evaluation artifact.

### 6. What are the main results?
The main result is that the repo appears specific enough to reproduce: costed configurations, input-device support, simulation assets, and documented setup steps are all public. That is a stronger result than the old note implied.

### 7. What is actually novel?
Mostly the integration and accessibility package: low-cost hardware choices, clear documentation, and a ready-made bridge between teleoperation, simulation, and embodied learning experiments.

### 8. What are the strengths?
Pragmatic scope, unusually concrete documentation for a hobby-to-research robot, and a price point that materially changes who can experiment with dual-arm mobile manipulation.

### 9. What are the weaknesses, limitations, or red flags?
No paper-grade validation, unknown durability, unclear maintenance burden, and all the usual low-cost hardware caveats around calibration, mechanical repeatability, and safety.

### 10. What challenges or open problems remain?
Reproducibility across builders, long-horizon reliability, calibration tooling, safety envelopes for home use, and evidence that the platform supports nontrivial autonomous manipulation rather than mostly teleop.

### 11. What future work naturally follows?
Use the platform for standardized dataset collection, household-task benchmarks, policy-learning baselines, and clearer comparisons against pricier mobile manipulators.

### 12. Why does this matter?
Because access to hardware is still one of the biggest hidden bottlenecks in embodied AI.

### 13. What ideas are steal-worthy?
Treat low-cost hardware platforms as research multipliers, not just side projects.

### 14. Final decision
Keep as a project reference, not as an algorithmic paper reference.
