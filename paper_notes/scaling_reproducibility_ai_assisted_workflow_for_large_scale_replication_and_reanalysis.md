# Scaling Reproducibility: An AI-Assisted Workflow for Large-Scale Replication and Reanalysis

## Basic info

* Title: Scaling Reproducibility: An AI-Assisted Workflow for Large-Scale Replication and Reanalysis
* Authors: Yiqing Xu, Leo Yang Yang
* Year: 2026
* Venue / source: arXiv preprint (econ.EM / stat.ME)
* Link: https://arxiv.org/abs/2602.16733
* PDF: https://arxiv.org/pdf/2602.16733.pdf
* Date read: 2026-04-28
* Date surfaced: 2026-04-28
* Surfaced via: Tracy in #pocket-reads
* Why selected in one sentence: This is one of the clearest concrete papers so far on turning LLMs from vague “research assistant” branding into an audited execution layer for large-scale scientific reproducibility work.

## Quick verdict

* Strong, with caveats

This paper is not about frontier modeling performance. It is about using an LLM-centered orchestration stack to do large-scale computational reproducibility and design-specific reanalysis across real published social-science papers. That makes it easy to underestimate if you only scan the title. But the paper is actually valuable because it is unusually explicit about where the model is allowed to act, where it is *not* allowed to act, and how to keep the numerical core deterministic. The strongest result is not “AI did science autonomously.” It is that, given accessible replication materials, a carefully constrained workflow can recover a very high rate of full-paper reproducibility and can standardize downstream diagnostics at a scale that would otherwise be very labor-intensive.

## One-paragraph overview

The paper presents an AI-assisted workflow for full-paper replication and reanalysis of empirical research, focused on top political-science journals from 2010 to 2025. The pipeline separates adaptive orchestration from deterministic computation: an LLM routes tasks, interprets failures, and chooses among predefined recovery strategies, while all numerical work, file operations, and statistical diagnostics are handled by version-controlled code. The authors use this stack first to measure stated data availability across 3,464 empirical papers, then to run full-paper replication on a stratified sample of 384 studies covering 3,382 empirical models, and finally to run standardized IV diagnostics on 92 studies with 215 specifications. Their main finding is institutional rather than purely technical: reproducibility rises sharply after transparency and verification requirements, and most remaining failures appear to come from inaccessible or restricted data rather than broken code. Conceptually, the paper argues that once scientific targets are specified, a large fraction of replication work is procedural enough to automate, provided the automation is strongly bounded and auditable.

## Model definition

### Inputs
- paper PDFs
- replication-package links and archives from public repositories like Dataverse, GitHub, and OSF
- code artifacts in Stata, R, and Python
- researcher-specified empirical targets and diagnostic templates
- published regression tables used for paper-to-code verification

### Outputs
- downloaded and versioned local replication packages
- cleaned execution-ready code and metadata
- structured logs of regression outputs, coefficients, standard errors, sample sizes, and clustering
- reproducibility verdicts for papers or specifications
- standardized diagnostic reports for supported research designs, especially IV and difference-in-differences

### Training objective (loss)
There is no learned task-specific model contribution in the usual sense. The core design is a constrained orchestration system: the LLM does routing and failure interpretation, while deterministic scripts do the actual numerical work.

### Architecture / parameterization
The system is a three-layer architecture:
- **Layer 1:** an LLM orchestrator, described in the paper as Claude, which dispatches tasks, parses failures, and selects bounded recovery steps
- **Layer 2:** structured skill descriptions and accumulated failure-pattern knowledge, which define interfaces and reusable resolution rules
- **Layer 3:** deterministic execution agents and statistical scripts that perform downloading, code preparation, execution, matching, and diagnostics

Execution is broken into three phases:
1. **Phase A:** acquire replication materials, prepare environments, execute code, and capture structured outputs
2. **Phase B:** extract paper coefficients and match them against code outputs using precision-aware rounding and optimal assignment
3. **Phase C:** for reproduced specifications, classify the design and run standardized diagnostics such as first-stage F statistics, bootstrap intervals, and jackknife sensitivity for IV settings

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
The paper is trying to solve the operational bottleneck in scientific reproducibility. Lots of fields now have stronger norms around sharing code and data, but actually *running* heterogeneous replication packages at scale is still expensive, brittle, and annoying. Different languages, weird directory layouts, missing dependencies, legacy scripts, and inconsistent documentation make verification costly even when authors have technically shared materials. The authors want a workflow that can standardize that messy execution layer well enough to measure reproducibility at scale and enable large cross-paper reanalysis.

### 2. What is the method?
The method is an AI-assisted execution workflow in which an LLM orchestrates a set of structured agents and deterministic scripts. The LLM is not used as a freeform numerical reasoner. Instead, it handles coordination tasks such as extracting metadata, diagnosing execution failures, and selecting known repair strategies. Numerical outputs are generated only by version-controlled code. After execution, the system compares published regression-table coefficients against code-produced outputs, then optionally runs design-specific diagnostics on successfully reproduced specifications.

### 3. What is the method motivation?
The motivation is that a lot of replication work is procedural rather than intellectually open-ended. Once a researcher defines the target specifications and what counts as a successful match, much of the remaining work is downloading packages, fixing paths, resolving environment issues, executing scripts, collecting outputs, and aligning them with published tables. That is exactly the kind of brittle but structured workflow that current AI systems can sometimes help with, *if* you keep them constrained and auditable instead of letting them hallucinate statistical results.

### 4. What data does it use?
The paper uses a corpus of empirical and quantitative papers from three top political-science journals, APSR, AJPS, and JOP, spanning 2010 to 2025.

The dataset structure has three layers:
- a population-level corpus of **3,464 empirical papers** used to measure stated data availability
- a stratified sample of **384 studies** used for full-paper replication, covering **3,382 empirical models**
- an **IV-diagnostics corpus of 92 studies** with **215 specifications**, partly extending prior work by Lal et al. (2024)

The underlying computational artifacts are the replication packages associated with these papers, including code, data, and documentation from public repositories when available.

### 5. How is it evaluated?
The paper evaluates the workflow in two main ways.

First, it uses **full-paper replication** as an end-to-end benchmark. For each sampled paper, the workflow executes the full codebase and attempts to match point estimates reported in main-text regression tables, excluding figures, descriptive tables, and simulations. Matching uses precision-aware rounding plus optimal assignment between paper coefficients and code outputs.

Second, it uses **IV diagnostics** as a downstream reanalysis benchmark. For reproduced IV specifications, the workflow applies a fixed diagnostic template, including first-stage F statistics, Anderson-Rubin style robustness checks, bootstrap confidence intervals, jackknife sensitivity, and OLS comparisons.

The paper also provides a detailed case study, including Rueda (2017), to show how the system behaves on a single paper and where failures come from.

### 6. What are the main results?
The main results are pretty striking, but they need to be read carefully.

- In the full-paper replication sample, the estimated reproducibility rate rises from **29.6% before DA-RT adoption to 79.8% after**, using journal-specific implementation dates.
- Conditional on accessible replication materials, **94.4% of papers are fully reproducible (237/251)**, and **95.2% are fully or largely reproducible (239/251)**.
- The paper argues that most unreproduced cases are caused by **missing, restricted, corrupted, or otherwise inaccessible data**, not by irreparable code quality problems.
- In the IV corpus, the workflow achieves an **82% end-to-end autonomous success rate** on the original benchmark subset, with failures attributed to unavailable archives rather than execution errors.
- For accessible materials, the workflow reports exact reproduction of benchmark estimates and successful completion of all diagnostic tests.

The broader result is that verification requirements and archiving mandates appear strongly associated with better reproducibility in practice.

### 7. What is actually novel?
The novelty is not “LLM helps with coding,” which would be boring. The interesting novelty is the *systems framing* of reproducibility as a layered, auditable execution problem.

A few parts feel genuinely important:
- the explicit separation between **adaptive orchestration** and **deterministic computation**
- the use of **structured skill descriptions plus versioned failure-pattern memory** rather than pure prompt improvisation
- the idea of **full-paper replication as a standardized measurable pipeline outcome**, not just an artisanal one-off effort
- the move from replication to **cross-paper reanalysis**, where successful execution becomes infrastructure for methodological work rather than the endpoint

This is more like an early design pattern for trustworthy research agents than a flashy demo.

### 8. What are the strengths?
- The paper is unusually clear about where the LLM is allowed to operate and where it is intentionally excluded.
- It uses a meaningful real-world corpus rather than toy notebooks.
- The evaluation target is operationally concrete: reproduce actual published regression-table results.
- The paper connects technical workflow design to institutional policy effects, which makes the results socially meaningful rather than just tooling trivia.
- The reported failure analysis is useful. It pushes against the lazy story that most reproducibility failures are about incompetent code; here, inaccessible data looks like the dominant bottleneck once verification norms are in place.
- The architecture is legible and stealable. Even if you do not care about political science, the workflow blueprint is relevant for any domain with messy public code artifacts.

### 9. What are the weaknesses, limitations, or red flags?
- The scope is narrower than the paper’s ambition might first suggest. It works in a field with relatively strong replication norms and a lot of regression-table-based empirical work.
- The success metrics depend heavily on **existing author packages** being available. The system does not magically recover studies whose materials are missing or fundamentally broken.
- The notion of reproducibility here is intentionally narrow: rerunning existing code and matching reported point estimates. That is important, but it is not the same as testing scientific validity.
- The design-specific diagnostics are currently limited to a small set of supported empirical designs, mainly IV and DiD.
- There is some risk that the orchestration layer’s role is underspecified when it comes to difficult semantic reconstruction cases. The paper acknowledges “deep semantic” failures where automation stops short.
- Because the workflow evolves through accumulated failure rules, portability to very different domains may be less automatic than the general framing suggests.

### 10. What challenges or open problems remain?
A lot.

- Extending this workflow beyond social-science regressions to domains with more complex computational artifacts, such as deep learning pipelines, simulation-heavy work, or multimodal benchmark systems
- Handling restricted or licensed data in a principled semi-automated way
- Verifying outputs beyond coefficient matching, including figures, preprocessing pipelines, and post-estimation transformations
- Supporting richer semantic reconstruction when code and paper tables diverge in messy ways
- Distinguishing “the code reruns” from “the scientific claim is trustworthy,” which is a much harder problem
- Preventing silent overreach by LLM orchestrators when a case looks familiar but actually is not

### 11. What future work naturally follows?
- Expand the design library beyond IV and DiD to RD, event studies, synthetic control, ML evaluation pipelines, and structural estimation.
- Build stronger tooling for restricted-data workflows, maybe with secure enclaves or permissioned handoff layers.
- Add figure and table regeneration checks instead of focusing mostly on regression coefficients.
- Port the architecture into other fields with stronger code artifacts, including economics, computational biology, and parts of ML benchmarking.
- Study how much of the success comes from the LLM itself versus the skill interface and accumulated repair rules.

### 12. Why does this matter?
Because scientific reproducibility is still bottlenecked less by ideals than by boring execution pain. If this kind of workflow is robust, then a lot more published research can be verified, audited, and reanalyzed without burning huge amounts of bespoke human labor. That matters for research credibility, but it also matters for method development: once many papers are executable in a standardized way, they become reusable substrates for new empirical diagnostics and cross-paper analysis.

## Why It Matters

This paper matters less as a one-off political-science result and more as a prototype for a serious research-agent pattern: bounded LLM coordination wrapped around deterministic toolchains, with explicit auditability and a strong norm against letting the model fabricate numerical reasoning. That is a much healthier direction than “let the chatbot do statistics.” If you care about trustworthy agentic systems, this is one of the more concrete infrastructure papers in the space.

### 13. What ideas are steal-worthy?
- Keep the LLM in the **coordination loop**, not the **numerical loop**.
- Treat failure handling as an accumulating **version-controlled rule library**, not just ad hoc prompting.
- Separate **execution success** from **result verification** as two different gates.
- Use standardized outputs so successful runs become reusable assets for later diagnostics.
- Frame research automation as infrastructure that lowers the cost of *future* methodological work, not just a one-shot task completer.

### 14. Final decision
Keep. This is not a paper for everyone, but it is a substantively strong pocket read if the bar is “does this teach me something real about how agentic AI can be used in research without dissolving into hype?” It does.