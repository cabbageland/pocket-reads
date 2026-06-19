---
title: LLM-Based Data Science Agents: A Survey of Capabilities, Challenges, and Future Directions
slug: llm-based-data-science-agents-a-survey-of-capabilities-challenges-and-future-directions
authors: Mizanur Rahman, Amran Bhuiyan, Mohammed Saidul Islam, Md Tahmid Rahman Laskar, Ridwan Mahbub, Ahmed Masry, Shafiq Joty, Enamul Hoque
year: 2025
venue: arXiv preprint (cs.AI, cs.CL)
date_read: 2026-06-19
paper_url: https://arxiv.org/abs/2510.04023
pdf_url: https://arxiv.org/pdf/2510.04023
verdict: Useful survey
summary: This survey maps 45 LLM-based data science agents onto a six-stage data-science lifecycle: business understanding and data acquisition, exploratory analysis and visualization, feature engineering, model building and selection, interpretation and explanation, and deployment and monitoring. It also annotates systems along five cross-cutting dimensions: reasoning/planning, modality integration, tool orchestration depth, learning/alignment method, and trust/safety mechanisms. The useful takeaway is not that data science agents are close to autonomous enterprise analysts. It is the opposite: current systems over-concentrate on EDA, charting, notebooks, and model-building demos, while the hard parts of enterprise DS work, ambiguous goal translation, messy data acquisition, continuous deployment, monitoring, auditability, privacy, compliance, and safety, are thin or missing.
why_it_matters: The paper is a handy map for separating agentic data-science hype from actual lifecycle coverage. It gives names and benchmark anchors for the gap Tracy keeps caring about: agents are decent at producing analysis artifacts, but still fragile at understanding the business question, preserving state, orchestrating real tools, proving process correctness, and operating safely after deployment.
final_decision: Keep as a reference survey and taxonomy, not as proof that any DS-agent stack is mature. The strongest value is the lifecycle framing, benchmark inventory, and repeated warning that process fidelity, governance, deployment, and monitoring are the weak zones. Use it when arguing that data-science agents need end-to-end workflow evaluation and first-class safety/governance rather than another notebook demo.
tags: data-science-agents, LLM-agents, agentic-ai, data-analysis, lifecycle-taxonomy, tool-use, evaluation, benchmarks, governance, trust-and-safety, MLOps
---

# LLM-Based Data Science Agents: A Survey of Capabilities, Challenges, and Future Directions

## Basic info

* Title: LLM-Based Data Science Agents: A Survey of Capabilities, Challenges, and Future Directions
* Authors: Mizanur Rahman, Amran Bhuiyan, Mohammed Saidul Islam, Md Tahmid Rahman Laskar, Ridwan Mahbub, Ahmed Masry, Shafiq Joty, Enamul Hoque
* Year: 2025
* Venue / source: arXiv preprint (cs.AI, cs.CL)
* Link: https://arxiv.org/abs/2510.04023
* PDF: https://arxiv.org/pdf/2510.04023
* arXiv version inspected: v1, submitted 2025-10-05
* Date read: 2026-06-19
* Date surfaced: 2026-06-19
* Surfaced via: Tracy in #pocket-reads
* Why selected in one sentence: It is a lifecycle-level map of the LLM data-science-agent field, useful for seeing which parts are real and which parts are mostly demo-shaped optimism.

## Quick verdict

* Useful survey

This is a solid map paper, not a breakthrough systems paper. Its best contribution is a clean lifecycle taxonomy for data science agents and a useful consolidation of where the field is currently overbuilt versus underbuilt. The survey's core claim matches the lived reality of agentic data tooling: agents are strongest around EDA, visualization, notebook execution, feature/model experimentation, and report generation; they are far weaker at the upstream and downstream parts that make data science matter in organizations, especially ambiguous business framing, acquisition from messy enterprise systems, production deployment, drift monitoring, auditability, privacy, and governance. The paper is also useful because it does not treat evaluation as "did the final answer look right?" It emphasizes process-centric evaluation, silent state corruption, tool-use fidelity, multimodal grounding, and safety. The caveat is that this is still a broad literature survey with many annotations and inherited benchmark claims, not a directly reproducible head-to-head benchmark of the 45 agents. Keep it as a field map and citation source, not as final empirical proof of any individual system's reliability.

## One-paragraph overview

The paper surveys 45 LLM-based data science agents selected from a 2023-2025 literature review and maps them onto six stages of the data-science lifecycle: business understanding and data acquisition (S1), exploratory data analysis and visualization (S2), feature engineering (S3), model building and selection (S4), interpretation and explanation (S5), and deployment and monitoring (S6). It then annotates those systems across five design dimensions: reasoning and planning style, modality integration, tool orchestration depth, learning and alignment methods, and trust/safety mechanisms. The picture is lopsided. S2 and S4 are crowded: many systems can write Python, inspect tables, generate charts, train models, or produce narrative reports. S1 and S6 are much thinner: goal disambiguation, real data acquisition, compliance checks, deployment, drift monitoring, rollback, and production governance remain early or mostly manual. The survey also reviews benchmarks such as InsightBench, Spider 2.0, Spider2-V, ELT-Bench, DSEval, BLADE, DSBench, MatPlotBench, and others, arguing that data-science-agent evaluation must score intermediate process integrity, not just final output accuracy. The strongest practical lesson is that data science agents need fewer celebratory notebook demos and more lifecycle-spanning tests that catch wrong assumptions, state mutations, unsafe tool use, privacy leaks, brittle charts, and unmonitored production behavior.

## Survey definition

### Inputs

The survey starts from a literature search over peer-reviewed papers, preprints, major AI venues, and Google Scholar for work published between 2023 and 2025, with search terms around data science agents, LLM agents, multimodal agents, tool-using agents, trustworthy AI systems, and data science automation.

The inclusion criteria require a system to:

- use an LLM as the primary reasoning component,
- support at least one stage of the data-science lifecycle,
- operate on structured data or code,
- and show multi-step planning/tool orchestration or structured prompting that generates and executes analyses, queries, or visualizations.

The authors exclude non-LLM systems, unrelated domains such as robotics or gaming, static text-generation systems without data/code reasoning, and purely conceptual prototypes without a working implementation.

### Outputs

The main output is a taxonomy and synthesis:

- 45 data science agents mapped to lifecycle stages S1-S6,
- five cross-cutting design attributes for comparing how agents work,
- a stage-by-stage analysis of capabilities and gaps,
- a benchmark inventory,
- and an open-challenges list around ambiguity, context, security, trust, robustness, evaluation, scalability, ethics, and multimodal reasoning.

### Method

The authors say the initial search produced 587 candidate papers after deduplication. Title and abstract screening reduced this to roughly 200 papers. Full-text review produced 45 distinct data science agents. They use PRISMA-style screening language, then extract lifecycle coverage, capabilities, challenges, reasoning strategies, tool-use patterns, trust mechanisms, and evaluation methods.

This is a survey method, not a new benchmark run. That matters: the paper is best read as an organized map of reported capabilities, not as a controlled reproduction of every agent.

## What problem is the paper trying to solve?

The paper is trying to make the LLM data-science-agent space legible. "Data science agent" is currently an overloaded label: it can mean a chart generator, a notebook assistant, an AutoML wrapper, a multi-agent Kaggle workflow, a SQL agent, a dashboard helper, or a production-monitoring system. Those are not the same thing.

The paper's organizing move is to ask: which parts of the actual data-science lifecycle do these agents cover?

That matters because data science is not just "run pandas and make a plot." A real workflow starts with ambiguous business intent and messy data acquisition, then moves through EDA, feature engineering, modeling, interpretation, deployment, monitoring, governance, and maintenance. The survey argues that the field is building heavily in the middle while neglecting both ends.

## What is the taxonomy?

The six lifecycle stages are:

1. **Business Understanding and Data Acquisition (S1):** translating vague goals into analytical tasks, sourcing data, cleaning/integration, quality checks, and compliance-aware early decisions.
2. **Exploratory Data Analysis and Visualization (S2):** summarization, anomaly detection, pattern discovery, chart generation, dashboards, and narrative exploration.
3. **Feature Engineering (S3):** constructing, transforming, selecting, and explaining variables before modeling.
4. **Model Building and Selection (S4):** algorithm choice, training, hyperparameter tuning, model comparison, and performance evaluation.
5. **Interpretation and Explanation (S5):** explaining predictions, model choices, features, and analytical outputs through attribution, counterfactuals, narratives, and dashboards.
6. **Deployment and Monitoring (S6):** packaging models, deploying endpoints, monitoring drift/performance, triggering retraining/rollback, logging, and governance.

The five cross-cutting attributes are:

- reasoning and planning style,
- modality integration,
- tool orchestration depth,
- learning and alignment paradigm,
- trustworthiness and safety mechanisms.

This two-axis structure is the paper's best reusable artifact. It lets you say, for example, "this agent has deep Python and notebook orchestration for S2-S4, but no S1 goal disambiguation, no S6 monitoring, and no meaningful trust/safety layer."

## What does the survey find?

The most important finding is stage imbalance.

EDA and visualization are the best-covered area. Many agents can generate descriptive statistics, produce plots, create dashboards, run Python, and write narrative reports. The paper discusses systems such as Chat2VIS, LIDA, PlotGen, DatawiseAgent, WaitGPT, Data Formulator, and Jupybara as examples of the field's progress.

Model building and selection are also common, especially in systems that wrap AutoML, Kaggle-style workflows, or notebook pipelines. AutoKaggle, DS-Agent, AutoML-GPT, and AgentTuning appear in this part of the story.

Business understanding and data acquisition are much weaker. The paper points to InsightBench and AgentPoirot as early attempts: AgentPoirot reportedly recovers about 60% of predefined insights under well-specified goals but only about 40% when objectives are vague or open-ended. Enterprise-style acquisition is worse. The paper cites a drop from about 86% on older single-query Spider 1.0 text-to-SQL tasks to roughly 10% for GPT-4o on Spider 2.0-style multi-relational enterprise queries, and below 14% success on Spider2-V mixed-interface workflows.

Deployment and monitoring are the thinnest stage. Only a limited number of systems touch deployment, and most still depend on manual or semi-automated steps. The paper names AutoML-Agent and DS-Agent as partial examples, but the broader conclusion is that continuous monitoring, drift detection, rollback, policy-as-code, audit logging, and compliance checkpoints are not yet deeply integrated into agent workflows.

Trust and safety are also underdeveloped. The abstract and security section say over 90% of surveyed systems lack explicit mechanisms for security, privacy, and compliance. The paper repeatedly argues that fairness audits, drift checks, provenance logging, hallucination detection, privacy controls, and human oversight are mostly incomplete or bolted on.

## Evaluation and benchmark takeaways

The paper's evaluation section is more useful than a generic benchmark list because it makes a process-centric argument.

A data science agent can produce a correct-looking final answer while corrupting intermediate state, using the wrong control variables, mutating a dataframe in place, relying on a wrong schema assumption, or generating a chart that is syntactically valid but analytically irrelevant. So final answer correctness is not enough.

The paper groups evaluation around:

- task effectiveness,
- trustworthiness,
- explainability,
- efficiency,
- and user satisfaction.

It also distinguishes functional evaluation from process-centric evaluation. This is exactly the right distinction. Functional evaluation asks whether the final output is correct. Process-centric evaluation asks whether the workflow, tool usage, state changes, error recovery, and intermediate reasoning were valid.

Some anchor examples:

- **DSEval:** up to 27% of failures are silent state integrity violations, such as in-place dataframe mutations, even when final outputs may appear acceptable.
- **BLADE:** highlights statistical reasoning errors, such as misidentified control variables or invalid transformations, that syntax checks miss.
- **ELT-Bench:** reports a sharp stage gap, with 57% success for data loading versus only 3.9% for transformation.
- **Spider 2.0 / Spider2-V:** expose fragility around large schemas and interface-driven workflows.
- **InsightBench / MatPlotBench / DSBench / DataSciBench / DA-Code:** cover different slices of insight generation, plotting, analysis, and code execution, but the paper argues that the field still lacks lifecycle-spanning, enterprise-realistic benchmarks.

The practical steal: evaluate agents like workflows, not like chat answers.

## Multimodal and visualization findings

The visualization section is a useful antidote to "the chart rendered, ship it."

The paper identifies three persistent visualization failures:

- semantic grounding errors, such as choosing the wrong chart type or scale for the analytical question,
- visual fidelity issues, such as clipped labels, overlapping annotations, or missing legends,
- and intent misalignment, where a chart is syntactically valid but answers the wrong question.

Multimodal DS agents face similar problems across tables, charts, documents, code, and dashboards. The paper highlights label/header mismatches, OCR errors, scale/legend misreadings, token-cost blowups from large tables and high-resolution dashboards, and benchmark overfitting. The phrase worth keeping is that multimodal outputs can be "visually polished yet analytically misleading" if grounding and safety checks are weak.

## What is actually novel?

The novelty is the consolidation and framing, not a new algorithm.

Useful contributions:

- A lifecycle-based taxonomy for comparing data science agents.
- A design-attribute layer that separates what an agent covers from how it operates.
- A fairly broad map of 45 systems and their claimed lifecycle coverage.
- A benchmark inventory for DS-agent evaluation.
- A repeated emphasis on neglected areas: business understanding, deployment, monitoring, governance, trust, and process fidelity.

The strongest conceptual contribution is treating data science agents as lifecycle systems rather than notebook assistants.

## Strengths

The paper is good at resisting the flattening effect of the term "agent." A SQL agent, a chart generator, a notebook copilot, and a deployment monitor are not the same artifact. The S1-S6 taxonomy makes that visible.

The paper also correctly centers evaluation. Its process-centric framing is important because data science failures often hide in the steps: a bad join, leaked target variable, wrong date window, mutated state, unjustified transformation, or missing compliance check can make a polished result worthless.

The survey is also useful as a citation map. It gives a dense index of systems and benchmarks across EDA, visualization, feature engineering, model building, interpretability, deployment, and safety.

## Weaknesses, limitations, and red flags

The paper is broad and sometimes feels more like a taxonomy compendium than a sharp empirical study. It does not reproduce the 45 systems under one controlled setup, so cross-system comparisons inherit the unevenness of the original papers.

The annotation table is helpful but necessarily subjective. Some included systems are general agent systems or non-lifecycle support tools rather than cleanly data-science-native agents, and the boundary between DS agent, general tool agent, AutoML system, and visualization assistant can get fuzzy.

The paper's own formatting has draft-like artifacts: ACM-style placeholder DOI text, generic publication metadata, and some reference/date oddities. That does not invalidate the survey, but it reinforces that this should be treated as an under-review preprint rather than a polished archival reference.

The "over 90% lack explicit trust/safety mechanisms" claim is directionally plausible and useful, but the note should not overread it as a precise audited statistic unless the underlying annotation dataset is inspected.

## What challenges remain?

The challenges list is basically the checklist for making data-science agents real:

- ambiguous task instructions need clarification loops before execution,
- long workflows need durable memory and state tracking,
- sensitive data requires privacy, compliance, secure execution, and audit logs,
- tool use needs sandboxing and provenance,
- multimodal reasoning needs better cross-modal grounding,
- evaluation needs process traces, not just final answers,
- deployment needs monitoring, rollback, and governance,
- and alignment needs workflow-level preferences, not just polite completions.

The paper explicitly calls out DPO, GRPO, RLHF, agent tuning, and preference-based alignment as underexplored for data-science workflows. That is plausible, but the real hard part is reward design: "insight quality," "good feature," "valid chart," and "safe business recommendation" are not simple scalar rewards.

## Ideas worth stealing

Use the lifecycle map as a diagnostic for any claimed DS agent:

- What stages does it actually cover?
- Does it ask clarifying questions before acting on ambiguous business goals?
- Can it acquire and validate real data, or only operate on a clean uploaded CSV?
- Does it preserve state and provenance across steps?
- Does it evaluate process correctness, not just final output?
- Does it have deployment, monitoring, rollback, and governance hooks?
- Does it include privacy, fairness, security, and human approval checkpoints?

The other steal-worthy idea is process-based evaluation. A data-science agent should emit enough trace to check:

- what data it used,
- what transformations it applied,
- what code executed,
- what artifacts changed,
- what assumptions it made,
- what validations passed,
- what failures were recovered,
- and what human approvals were required.

Without that, the agent is just an eloquent notebook macro with risk cosplay.

## Final decision

Keep. This is a useful reference survey for LLM-based data science agents, especially for taxonomy, benchmark names, and the argument that real data-science agents must cover the whole lifecycle rather than only EDA/modeling demos. Cite it for the stage imbalance, process-centric evaluation framing, and trust/safety gap. Do not cite it as evidence that current systems are production-ready; if anything, the paper argues the opposite.
