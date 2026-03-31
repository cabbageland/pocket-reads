# Map-Agnostic And Interactive Safety-Critical Scenario Generation via Multi-Objective Tree Search

## Basic info

* Title: Map-Agnostic And Interactive Safety-Critical Scenario Generation via Multi-Objective Tree Search
* Authors: Wenyun Li, Zejian Deng, Chen Sun
* Year: 2026
* Venue / source: arXiv
* Link: https://arxiv.org/abs/2603.03978
* Date read: 2026-03-31
* Date surfaced: 2026-03-06 (via Zhiwen Fan)
* Why selected in one sentence: It treats safety-critical driving scenario generation as a search problem with explicit realism constraints instead of a pure generative-model sample-fest.

## Quick verdict

* Useful

This is a good stress-testing paper because it refuses the false tradeoff between realism and collision finding. The key move is to make both part of the search objective. Access was abstract-level plus paper-index summaries, which is enough to judge the method shape.

## One-paragraph overview

The paper formulates safety-critical traffic scenario generation as a multi-objective Monte Carlo tree search problem. Instead of only maximizing collision probability, it jointly scores trajectory feasibility, naturalistic behavior, and risk, then uses a hybrid UCB/LCB search strategy to balance exploration with risk-sensitive discovery. Because each vehicle is driven by microscopic SUMO traffic models and maps can be imported from OpenStreetMap, the framework is both interactive and map-agnostic rather than tied to one handcrafted scenario set.

## Model definition

### Inputs
Road topology imported from OpenStreetMap, traffic participant models from SUMO, and the search state defining evolving traffic scenarios.

### Outputs
Generated safety-critical traffic scenarios and trajectories, especially collision events that remain realistic and diverse.

### Training objective (loss)
There is no learned model in the core contribution. The optimization is search-based through a multi-objective evaluation function inside MCTS.

### Architecture / parameterization
A multi-objective MCTS framework with a hybrid upper-confidence / lower-confidence search strategy and SUMO-driven vehicle behavior.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
Generate safety-critical driving scenarios that are both realistic and diverse enough to stress-test autonomous vehicles.

### 2. What is the method?
Run multi-objective tree search over interactive traffic scenarios while scoring risk, feasibility, and naturalism jointly.

### 3. What is the method motivation?
Pure collision maximization produces unrealistic garbage; pure realism avoids the edge cases you need.

### 4. What data does it use?
The system operates on map data from OpenStreetMap and simulated traffic behaviors via SUMO, validated in high-risk zones in Hong Kong.

### 5. How is it evaluated?
On collision failure rate, trajectory feasibility, comfort, and scenario complexity across four accident-prone urban zones.

### 6. What are the main results?
The paper reports an 85% collision failure rate while preserving better feasibility and comfort than baselines.

### 7. What is actually novel?
Reframing scenario generation as explicit multi-objective search rather than a single-goal sampler.

### 8. What are the strengths?
Realistic objective design, interactive agent behavior, and strong relevance to AV validation.

### 9. What are the weaknesses, limitations, or red flags?
Search cost could be high, and simulator realism still limits what the scenarios prove.

### 10. What challenges or open problems remain?
Scaling to richer agents, stronger behavior models, and tighter connection to real-world crash distributions.

### 11. What future work naturally follows?
Hybridize search with learned proposal models or richer driver models.

### 12. Why does this matter?
Because AV validation still depends on finding rare failures without degenerating into unrealistic nonsense.

### 13. What ideas are steal-worthy?
Turn realism into an optimization objective rather than a vague qualitative desideratum.

### 14. Final decision
Keep. Good reference for scenario generation as constrained search.
