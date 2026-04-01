# SimRecon: SimReady Compositional Scene Reconstruction from Real Videos

## Basic info

* Title: SimRecon: SimReady Compositional Scene Reconstruction from Real Videos
* Authors: Chong Xia, Kai Zhu, Zizhuo Wang, Fangfu Liu, Zhizheng Zhang, Yueqi Duan
* Year: 2026
* Venue / source: CVPR 2026 / arXiv preprint
* Link: https://arxiv.org/abs/2603.02133
* Date read: 2026-03-31
* Date surfaced: 2026-03-16 (via Zhiwen Fan)
* Why selected in one sentence: It tries to reconstruct scenes in the object-centric form simulation actually wants rather than stopping at photogenic view synthesis.

## Quick verdict

* Useful

This is a stronger note now because the contribution is no longer just "pipeline plus bridges." The paper is explicitly about where compositional reconstruction pipelines break when they meet reality: bad object crops go into generation, then physically incoherent object placements come out of generation. SimRecon's value is that it treats those handoff failures as first-class modules instead of pretending a scene-level reconstructor is already sim-ready.

## One-paragraph overview

SimRecon reconstructs cluttered real scenes into object-centric, simulator-usable assets through a three-stage Perception-Generation-Simulation pipeline. First it performs scene-level semantic reconstruction from video, then it generates individual objects, then it assembles them into a simulator scene. The paper's central claim is that naive stage composition fails twice: the perception stage often gives poor views for object completion, and the generation stage does not provide the relational structure needed for physically plausible assembly. To fix this, SimRecon adds Active Viewpoint Optimization (AVO), which searches 3D space for better projected object views before single-object completion, and a Scene Graph Synthesizer (SGS), which builds an instance-level scene graph to guide constructive assembly in the simulator. On ScanNet, the paper reports that this pipeline beats both single-view and scene-level baselines in geometric fidelity and novel-view rendering while staying far more practical than the slowest alternatives.

## Model definition

### Inputs
Cluttered real-world video of a scene, plus the sparse reconstruction / semantic perception needed to localize objects and project candidate views.

### Outputs
Object-centric reconstructed assets and a simulator-ready scene assembled with physically plausible object relations.

### Training objective (loss)
The system is a hybrid of learned and procedural stages rather than one monolithic model. The paper's main novelty is in the two bridging modules, not in a single new end-to-end loss.

### Architecture / parameterization
A staged pipeline: scene-level semantic reconstruction, single-object generation, and simulator-side assembly. AVO improves the perception-to-generation handoff by searching for informative object projections. SGS improves the generation-to-simulation handoff by constructing a scene graph that encodes how objects should be arranged before simulator insertion.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
Many 3D reconstruction systems are good at holistic visual appearance but bad at producing object-centric assets that can actually be used for simulation, interaction, or embodied learning.

### 2. What is the method?
Decompose the job into perception, object generation, and simulator assembly, then add explicit bridge modules where those stages usually fail: AVO for selecting better conditioning views and SGS for physically coherent assembly.

### 3. What is the method motivation?
Simulation needs explicit objects with plausible geometry and placement, not just a scene that looks right from a camera. The hard part is not only the individual modules. It is the interfaces between them.

### 4. What data does it use?
The main evaluation is on ScanNet. The public project materials and reviews frame the method as a cluttered indoor-scene reconstruction system rather than a synthetic-only benchmark toy.

### 5. How is it evaluated?
Against both single-view baselines such as Gen3DSR and SceneGen and scene-level baselines such as DPRecon and InstaScene, using geometric fidelity, novel-view rendering quality, and runtime. The paper also isolates the contribution of AVO and SGS in module-level studies.

### 6. What are the main results?
The paper reports that SimRecon substantially outperforms the listed baselines on ScanNet. In the quantitative comparison surfaced in the paper review, SimRecon reaches Chamfer Distance 4.34, F-Score 62.65, PSNR 24.43, SSIM 0.924, LPIPS 0.153, and MUSIQ 73.56, while the best competing Chamfer Distance cited there is 6.90 from InstaScene. Runtime is reported around 21 minutes, which is much faster than DPRecon's multi-hour regime and still competitive with faster but weaker alternatives. The practical claim is that SimRecon improves both geometry and visual quality without becoming unusably slow.

### 7. What is actually novel?
Not the slogan "Perception-Generation-Simulation." The real novelty is recognizing that compositional reconstruction quality is bottlenecked by inter-stage interfaces and then adding explicit mechanisms for those interfaces.

### 8. What are the strengths?
The target representation matches simulation needs. AVO is a sensible fix for occluded or bad object observations. SGS is the right kind of structural glue for simulator assembly. The method is also honest about compositional reconstruction being more than a single-object generation problem.

### 9. What are the weaknesses, limitations, or red flags?
This is still a pipeline, so error accumulation is unavoidable. The public materials do not yet make clear how well it handles severe semantic mistakes, missing objects, or dynamic scenes. The simulator-side plausibility is also only as good as the inferred scene graph and available object assets.

### 10. What challenges or open problems remain?
Unknown or heavily deformable objects, dynamic scenes, semantic mistakes in early perception, and getting from physically plausible assembly to task-usable simulation semantics.

### 11. What future work naturally follows?
Joint refinement across stages, stronger object generators, better relation inference for SGS, and tighter coupling to downstream simulation tasks such as policy learning or interactive scene editing.

### 12. Why does this matter?
Because a huge fraction of "scene reconstruction for robotics" work still stops right before the reconstructed scene becomes useful.

### 13. What ideas are steal-worthy?
Audit pipeline handoffs explicitly. Use active viewpoint search before object completion. Treat simulator assembly as a structured graph-construction problem instead of dumping generated meshes into a physics engine and hoping for the best.

### 14. Final decision
Keep. Good reference for sim-ready reconstruction rather than camera-ready reconstruction.
