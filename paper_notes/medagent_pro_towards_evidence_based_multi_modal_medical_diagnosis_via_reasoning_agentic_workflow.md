---
title: MedAgent-Pro: Towards Evidence-based Multi-modal Medical Diagnosis via Reasoning Agentic Workflow
slug: medagent-pro-towards-evidence-based-multi-modal-medical-diagnosis-via-reasoning-agentic-workflow
authors: Ziyue Wang, Junde Wu, Linghan Cai, Chang Han Low, Xihong Yang, Qiaxuan Li, Yueming Jin
year: 2025
venue: arXiv preprint; OpenReview / ICLR 2026 submission
date_read: 2026-07-03
paper_url: https://openreview.net/forum?id=ZOuU0udyA4
pdf_url: https://arxiv.org/pdf/2503.18968
verdict: Keep as a concrete medical-agent workflow paper, but do not confuse its evidence chain with clinical-grade verification.
summary: MedAgent-Pro reframes multimodal medical diagnosis as a hierarchical agent workflow rather than one-shot medical VQA. At the disease level, a RAG agent retrieves MedlinePlus-style guideline material and asks a VLM to form a diagnostic plan. At the patient level, the system selects executable steps based on available inputs, invokes specialized visual and coding tools for quantitative indicators, checks whether each intermediate result should continue, terminate, or complete the reasoning path, and fuses final indicators with risk-weighted decision logic. The paper reports large gains over GPT-4o, general VLMs, and adapted medical-agent baselines across glaucoma, heart disease, chest X-ray, and NEJM diagnostic tasks, with ablations showing that planning, quantitative analysis, and evidence-based step checks each help.
why_it_matters: This is a useful antidote to lazy medical VQA: it says diagnosis should be a structured evidence workflow with guideline retrieval, tool-grounded measurements, data-availability-aware planning, and explicit intermediate checks. The caveat is equally important: the system's reliability still depends on tool coverage, segmentation quality, guideline retrieval quality, VLM qualitative judgments, and risk-fusion choices. That is better than one-shot guessing, but not yet clinical assurance.
final_decision: Keep. It is a good architecture note for agentic medical workflows and for any domain where evidence should be computed, not merely narrated. Treat the results as promising research evidence, not deployment evidence: the "verification" layer is still under-specified for safety-critical use, and the paper needs stronger external validation, calibration, uncertainty handling, and failure analysis before it deserves clinical trust.
tags: medical-ai, multimodal-agents, evidence-based-reasoning, medical-diagnosis, vision-language-models, rag, tool-use, clinical-workflows, quantitative-analysis, medical-vqa, segmentation, agentic-workflows, healthcare-ai, safety-critical-ai, openreview
---

# MedAgent-Pro: Towards Evidence-based Multi-modal Medical Diagnosis via Reasoning Agentic Workflow

## Basic info

* Title: MedAgent-Pro: Towards Evidence-based Multi-modal Medical Diagnosis via Reasoning Agentic Workflow
* Authors: Ziyue Wang, Junde Wu, Linghan Cai, Chang Han Low, Xihong Yang, Qiaxuan Li, Yueming Jin
* Year: 2025
* Venue / source: arXiv preprint; OpenReview / ICLR 2026 submission
* OpenReview: https://openreview.net/forum?id=ZOuU0udyA4
* PDF inspected: https://arxiv.org/pdf/2503.18968
* arXiv: https://arxiv.org/abs/2503.18968
* DOI: https://doi.org/10.48550/arXiv.2503.18968
* Code: https://github.com/jinlab-imvr/MedAgent-Pro
* Date read: 2026-07-03
* Date surfaced: 2026-07-02
* Surfaced via: Tracy in #pocket-reads via OpenReview PDF link
* Version inspected: arXiv v3, dated 2025-07-02. The OpenReview PDF route matched the same paper ID but required browser verification, so the full note is based on the arXiv PDF plus OpenReview/GitHub metadata.
* Why selected in one sentence: It is a concrete example of turning an agent from a chatty medical VQA wrapper into a structured evidence workflow with guideline retrieval, tool-grounded measurement, and step-level reliability checks.

## Quick verdict

Keep, with a safety-critical asterisk.

The good part is the workflow. MedAgent-Pro attacks the right failure mode: medical diagnosis is not a one-hop image question, and a VLM saying "looks normal" is a bad substitute for guideline-driven analysis, quantitative measurements, and structured indicator fusion. The paper's strongest contribution is its decomposition into disease-level planning and patient-level execution.

The caution is that the paper uses "evidence-based" in a way that sounds stronger than the actual assurance machinery. The system retrieves guidelines, invokes tools, checks intermediate outputs, and fuses indicators, which is all valuable. But the reliability check is still implemented by a VLM assessing plausibility and input quality; the final risk weights are generated from guidelines; and the workflow depends heavily on the availability and correctness of specialized visual tools. That is more disciplined than one-shot VQA, not clinical-grade verification.

## One-paragraph overview

MedAgent-Pro proposes a hierarchical multimodal medical-diagnosis agent. At the disease level, it uses a RAG agent over a medical knowledge base built from MedlinePlus material to retrieve disease-specific guidance, summarize clinical indicators, and produce a JSON-like diagnostic plan that maps available patient data to tools and expected result fields. At the patient level, the system filters the plan to steps executable with the patient's available inputs, calls specialized tools such as segmentation models, grounding models, and coding modules to compute quantitative indicators, then asks the VLM to judge whether each intermediate result is reliable enough to continue, should terminate the path, or completes an indicator. The final diagnosis is made by fusing completed indicators with risk-based weights and thresholds derived from the guideline. Experiments cover REFUGE2 glaucoma, MITEA heart disease, 442 MIMIC chest X-ray cases, and 992 NEJM diagnostic cases; MedAgent-Pro beats GPT-4o, several general VLMs, adapted medical-agent baselines, and selected task-specific models. Ablations suggest that planning, quantitative analysis, and evidence-based step checking all contribute.

## What problem is it trying to solve?

The paper argues that medical VQA is the wrong abstraction for diagnosis.

Clinical diagnosis usually requires a disease-specific workflow: identify relevant indicators, inspect patient-specific data, measure quantities where possible, integrate image and text evidence, and decide under clinical guidelines. VLMs and many medical-agent systems collapse that into a direct answer. They may be fluent, but they often lack fine-grained visual perception, quantitative measurement, explicit evidence trails, and consistency with diagnostic criteria.

The problem is especially visible in the paper's motivating examples. For glaucoma, the relevant indicators include optic cup/disc segmentation, vertical cup-to-disc ratio, neuroretinal rim pattern, disc hemorrhage, and peripapillary atrophy. For heart disease, the relevant indicators include measurements such as LVEF, LVEDD, LVMI, and patient-specific context such as BMI. A general VLM can describe an image, but it usually will not compute the clinical indicators reliably without tool support.

## Architecture

MedAgent-Pro has two levels.

### Disease-level planning

For a target disease, the system retrieves relevant medical guidance from a domain knowledge base. The knowledge base is built from MedlinePlus and includes over 1,000 diseases and conditions plus more than 4,000 expert-reviewed articles.

The retrieval process has two stages:

* split and summarize documents;
* filter via keyword search over summaries, then run vector retrieval over candidate chunks and select the top five.

The VLM uses those retrieved chunks to produce a disease-specific guideline, extract clinical indicators, and generate a diagnostic plan. Each plan step specifies:

* expected input data property;
* tool/function to call;
* expected output property.

In practice, this is stored as a JSON file. The plan is meant to encode a standardized diagnostic workflow rather than letting the agent improvise from scratch for every patient.

### Patient-level reasoning

For an individual patient, the system inspects what data is available and selects executable plan steps. If a glaucoma plan includes OCT or visual-field inputs but the patient only has a fundus image, the orchestration step skips unavailable inputs and executes the fundus-image path.

The toolset can include:

* segmentation tools such as Medical SAM Adapter, MedSAM, and Cellpose;
* grounding models such as Maira-2;
* coding tools for computing measurements from visual-model outputs;
* VLM qualitative observations.

This is the paper's most useful move. A clinical indicator is not merely guessed by the VLM; it can be computed from a tool output. For glaucoma, the paper's example segments optic cup and disc, then computes cup-to-disc ratio. For cardiac diagnosis, the example uses segmentation-derived measurements such as ejection fraction and ventricular dimensions.

## Evidence-based reasoning step

Each executed step produces a result. The VLM then classifies the step status as:

* Continue: the output is reliable enough to feed into later steps;
* Terminate: the output is unreliable and could damage subsequent reasoning;
* Complete: the output corresponds to a final clinical indicator.

The authors describe the status function as a VLM-based assessment of result reliability, based on input quality and output plausibility. Completed indicators are collected, assigned risk-based weights, and fused into a final risk score compared with a threshold.

This is conceptually right but technically fragile. The idea of terminating a reasoning path when evidence is unreliable is exactly what medical agents need. But the paper does not provide a deep verification mechanism for that judgment. It mostly delegates reliability assessment back to the VLM. In safety-critical settings, that is a weak link unless paired with calibrated tool confidence, uncertainty propagation, provenance, expert review, and hard constraints.

## Experiments

The evaluation spans four settings:

* REFUGE2 for glaucoma diagnosis;
* MITEA for heart disease diagnosis;
* MIMIC chest X-ray, sampled as 442 cases from 100 patients with up to 12 thoracic findings;
* NEJM, compiled as 992 real-world diagnostic cases over more than 10 anatomical regions, 10 imaging modalities, and 50 diseases.

Metrics:

* balanced accuracy and F1 for REFUGE2, MITEA, and MIMIC;
* accuracy for NEJM multiple-choice cases.

Implementation:

* GPT-4o is the base VLM for MedAgent-Pro;
* LangChain is used for the RAG agent;
* medical-agent baselines are also run with GPT-4o as the underlying model.

## Main results

Against general VLMs and medical-agent baselines, MedAgent-Pro reports large gains.

On REFUGE2 glaucoma:

* GPT-4o: 56.4 balanced accuracy, 21.1 F1;
* MDAgent: 56.8 balanced accuracy, 22.2 F1;
* MedAgent-Pro: 90.4 balanced accuracy, 76.4 F1.

On MITEA heart disease:

* GPT-4o: 56.8 balanced accuracy, 28.1 F1;
* MDAgent: 57.2 balanced accuracy, 30.3 F1;
* MedAgent-Pro: 77.8 balanced accuracy, 72.3 F1.

On NEJM:

* GPT-4o: 70.9 accuracy;
* MMedAgent: 71.7;
* MDAgent: 73.8;
* MedAgent-Pro: 81.7.

On MIMIC chest X-ray:

* GPT-4o average balanced accuracy: 58.3;
* MedAgent-Pro: 72.0.

The paper also compares against selected task-specific models. It reports MedAgent-Pro at 95.1 AUC on REFUGE2 glaucoma, above the listed REFUGE2 winners, and 72.0 balanced accuracy on chest X-ray, above Maira-2 and CheXagent in the reported setup.

## Ablations

The ablation is one of the stronger parts because it decomposes the workflow rather than only comparing final systems.

For glaucoma:

* GPT-4o baseline: 56.4 balanced accuracy, 21.1 F1;
* planning only: 75.9 balanced accuracy, 36.5 F1;
* planning plus quantitative analysis: 88.5 balanced accuracy, 71.0 F1;
* planning plus quantitative analysis plus evidence reasoning: 90.4 balanced accuracy, 76.4 F1.

For heart disease:

* GPT-4o baseline: 56.8 balanced accuracy, 28.1 F1;
* planning only: 63.3 balanced accuracy, 45.9 F1;
* planning plus quantitative analysis: 73.4 balanced accuracy, 66.6 F1;
* full system: 77.8 balanced accuracy, 72.3 F1.

The lesson is clear: planning helps, but the large jump comes when the agent computes domain indicators with tools. The "evidence reasoning" check gives additional improvement, but the quantitative-analysis module is the main engine.

The paper also finds that replacing GPT-4o's qualitative analysis with an ophthalmology-specific VLM gives only marginal improvement, while degrading segmentation quality consistently harms diagnosis. That supports the claim that tool-grounded quantitative indicators matter more than VLM-style qualitative medical prose.

## Human evaluation

The paper includes clinical expert evaluation in two forms.

First, it compares MedAgent-Pro's number of diagnostic steps across 12 chest X-ray subtasks with thoracic clinicians' ratings of task difficulty and time demand. The authors report that step count generally correlates with physician-rated complexity.

Second, clinicians rate diagnostic outputs for glaucoma and chest X-ray cases across relevance, comprehensiveness, clinical reliability, reasoning coherence, and language clarity. MedAgent-Pro outperforms VLM baselines across those dimensions.

This helps, but it is still not clinical validation. It is output-quality assessment, not prospective patient-safety evaluation, not calibration under distribution shift, and not an FDA-style evidence package.

## What is genuinely useful?

The central workflow is useful:

* retrieve guideline material before planning;
* turn disease knowledge into an executable diagnostic plan;
* filter steps by available patient data;
* use specialized tools to compute indicators;
* check intermediate result reliability before carrying evidence forward;
* fuse clinical indicators explicitly rather than asking the VLM to free-form decide.

That pattern generalizes beyond medicine. It is relevant to any domain where expert work is procedural, measurements matter, and outputs need evidence provenance.

The plan-as-JSON detail is also practical. It makes the disease-level workflow inspectable and executable. That is better than asking an agent to reason from loose prose every time.

## Weaknesses and red flags

The biggest weakness is that "evidence-based reasoning" is under-verified. The system checks whether a result is plausible, but that check is VLM-mediated. A VLM deciding whether a VLM/tool result is reliable is not enough for safety-critical assurance.

The second weakness is tool dependence. The system works best where specialized visual tools exist and are compatible with the input modality. The authors acknowledge this. In under-tooled domains, the workflow falls back toward VLM qualitative analysis.

The third weakness is segmentation/tool error propagation. The paper simulates noisy segmentation masks, but a real deployment would need robust calibration, input-quality detection, tool uncertainty, and fallback behavior.

The fourth weakness is plan quality. The disease-level plan comes from retrieved guideline chunks plus VLM synthesis. Bad retrieval, stale guideline text, missing local clinical protocols, or a poorly formed plan could propagate through every patient case.

The fifth weakness is clinical evaluation scope. REFUGE2, MITEA, MIMIC, and NEJM are useful benchmarks, but they do not prove safety in real clinical workflow. The note to keep is: benchmark superiority is not clinical readiness.

The sixth weakness is baseline adaptation. The paper adapts some medical-agent systems into a VQA setting because they were originally text-focused. That is reasonable, but it means comparisons against those systems are not necessarily definitive.

## Safety-critical questions still open

Before trusting a system like this clinically, the missing pieces are:

* calibrated uncertainty for each tool and each indicator;
* provenance from raw input to segmentation to measurement to decision;
* guideline versioning and local-protocol compatibility;
* hard constraints for impossible or unsafe conclusions;
* expert override and audit workflow;
* distribution-shift testing across devices, hospitals, demographics, and imaging protocols;
* failure-mode analysis for missing data, bad images, corrupted segmentations, and contradictory indicators;
* prospective validation against clinician workflows;
* patient-level risk communication rather than only class labels.

The paper points in the right direction, but these are the parts that decide whether the system is a research demo or a medical device.

## Relation to agentic workflow design

This is a good companion to provenance and tool-use safety notes.

The paper's core claim is basically: medical agents need execution structure. A diagnosis is not just text generation; it is a pipeline of evidence retrieval, measurement, intermediate checks, and decision fusion. That maps directly onto broader agent design: if the domain has procedures and measurements, the agent should not improvise a conclusion from latent vibes.

The best stealable abstraction is hierarchical planning:

* disease-level plan: what should be checked?
* patient-level orchestration: what can be checked with the data we have?
* tool-level measurement: what can be computed?
* evidence-level validation: what should be trusted or discarded?
* decision-level fusion: how should validated indicators combine?

## Ideas worth stealing

* Generate reusable disease/task plans before patient-specific execution.
* Store plans in an executable schema, not just prose.
* Make data availability a first-class routing condition.
* Prefer computed clinical indicators over VLM descriptions when possible.
* Give intermediate steps explicit Continue / Terminate / Complete status.
* Treat tool output quality as part of reasoning, not a side note.
* Use structured indicator fusion instead of feeding all raw observations back to the VLM for a final guess.
* Evaluate workflow components separately; in this paper, the biggest jump comes from quantitative tool use.

## Why It Matters

MedAgent-Pro matters because it moves medical-agent design away from "ask a big model what the image means" and toward "build a diagnostic workflow that computes evidence." That is the correct direction for serious agents. The work is especially useful as a template for evidence-rich domains: retrieve standards, plan procedures, invoke tools, validate intermediate artifacts, and fuse measured indicators.

The caveat is the whole story. In medicine, a better workflow is not automatically a safe workflow. This paper is worth keeping because it shows a sharper agent architecture, and also because it exposes the next hard layer: real verification, uncertainty, provenance, and clinical governance.

## Final Decision

Keep. This is a strong Pocket Reads note for agentic medical workflows, tool-grounded reasoning, and evidence-structured diagnosis.

Use it as an architecture pattern, not as a clinical-readiness claim. The right takeaway is not "agents can diagnose now." The right takeaway is "diagnostic agents should be structured around guideline-aware plans, quantitative tools, evidence checks, and explicit indicator fusion, and then subjected to much harsher safety validation than this paper provides."
