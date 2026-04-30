# Can LLMs Clean Up Your Mess? A Survey of Application-Ready Data Preparation with LLMs

## Basic info

* Title: Can LLMs Clean Up Your Mess? A Survey of Application-Ready Data Preparation with LLMs
* Authors: Wei Zhou, Jun Zhou, Haoyu Wang, Zhenghao Li, Qikang He, Shaokun Han, Guoliang Li, Xuanhe Zhou, Yeye He, Chunwei Liu, Zirui Tang, Bin Wang, Shen Tang, Kai Zuo, Yuyu Luo, Zhenzhe Zheng, Conghui He, Jingren Zhou, Fan Wu
* Year: 2026
* Venue / source: arXiv preprint (cs.DB)
* Link: https://arxiv.org/abs/2601.17058v1
* PDF: https://arxiv.org/pdf/2601.17058v1
* DOI: https://doi.org/10.48550/arXiv.2601.17058
* Date read: 2026-04-30
* Date surfaced: 2026-04-30
* Surfaced via: Tracy in #pocket-reads
* Why selected in one sentence: It is a broad survey of where LLMs are actually being used in data prep, which matters because this is one of the few places agentic systems hit messy enterprise reality instead of toy benchmarks.

## Quick verdict

* Useful landscape paper, better as a map than as evidence that the field is mature

This survey is worth keeping because it cleanly organizes the LLM-for-data-prep space into *cleaning*, *integration*, and *enrichment*, then gets specific about subtasks like standardization, error processing, imputation, entity matching, schema matching, annotation, and profiling. The main contribution is not a new method, it is a taxonomy plus a decent accounting of how the field is shifting from brittle rule pipelines toward prompt-based, retrieval-augmented, and sometimes agentic workflows. The catch is that the paper still describes a field with serious unresolved problems: cost, hallucinations, limited practical agent deployments, and evaluation that often lags behind the claims. So this is a useful orientation paper, not a victory lap.

## One-paragraph overview

The paper surveys recent work on **LLM-enhanced data preparation** and frames the area around three core tasks needed to turn raw data into something usable for downstream analytics or decision-making: **data cleaning**, **data integration**, and **data enrichment**. It argues that traditional data-prep systems are too manual, too rule-bound, and too semantically weak for heterogeneous modern data, and that LLMs enable a shift toward instruction-driven automation, richer semantic matching, and knowledge-augmented workflows. The authors then review representative methods for each subtask, summarize the benchmark landscape and evaluation metrics, and close with open problems around scaling cost, hallucination control, constraint satisfaction, and realistic evaluation for open-ended outputs.

## Model definition

### Inputs
Prior literature on LLM-based data preparation, including work on cleaning, matching, imputation, annotation, profiling, retrieval augmentation, and agent-based orchestration.

### Outputs
A survey taxonomy and synthesis of the LLM-for-data-preparation landscape.

### Training objective (loss)
Not applicable. This is a survey paper.

### Architecture / parameterization
The paper’s organizing structure is task-centric rather than model-centric:
- **Data cleaning**
  - standardization
  - error processing
  - imputation
- **Data integration**
  - entity matching
  - schema matching
- **Data enrichment**
  - annotation
  - profiling

Across these, it highlights recurring method patterns:
- direct prompt-based execution
- reasoning-enhanced prompting
- retrieval-augmented prompting
- fine-tuned task-adaptive models
- multi-model collaboration
- agent-guided orchestration
- hybrid systems where LLMs generate logic/programs that cheaper models or downstream systems execute

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
The paper is trying to make sense of a fast-growing but scattered literature on using LLMs for real data-preparation work. Data prep is still a huge chunk of applied data work, but traditional systems depend heavily on hand-built rules, domain expertise, labeled data, and brittle matching logic. The survey asks what changes when LLMs are inserted into this pipeline, and whether that produces genuinely more application-ready data.

### 2. What is the method?
The method is a **systematic survey and taxonomy**. The authors review hundreds of recent papers and group them by core data-prep task and subtask, then discuss common method families and evaluation practices.

### 3. What is the method motivation?
The motivation is simple and fairly convincing: classic data prep does not scale well to heterogeneous messy data, and it is particularly weak when semantic understanding matters. LLMs are attractive because they can interpret instructions, use contextual reasoning, and sometimes integrate external knowledge without requiring a custom model for every tiny task.

### 4. What data does it use?
It uses prior literature and benchmark datasets from the surveyed field, not a newly introduced experimental dataset. The paper summarizes representative datasets across record-level, schema-level, and object-level tasks.

### 5. How is it evaluated?
As a survey, it is evaluated by how well it organizes the field. Internally, the paper also catalogs the empirical evaluation landscape, grouping datasets and metrics used by prior work. It notes that current evaluation is uneven, especially for open-ended enrichment tasks where simple precision-style metrics are often too weak.

### 6. What are the main results?
The main result is the taxonomy plus the paper’s broader framing of a **paradigm shift**:
- from rule-based and model-specific pipelines
- to prompt-driven, context-aware, and sometimes agentic workflows.

The useful takeaways are:
- the field naturally clusters into cleaning, integration, and enrichment,
- each cluster has a small number of recurring technical patterns,
- LLMs help most when semantic ambiguity or heterogeneous context makes rigid rules break,
- the field is still held back by inference cost, hallucinations, immature agent deployments, and weak evaluation.

### 7. What is actually novel?
The novelty is organizational. The paper is not inventing a new algorithm, but it gives a fairly crisp task-centric map of the area and is more practical than a generic “LLMs for data engineering” overview. The useful distinction is that it focuses specifically on **application-ready data preparation**, not just isolated data cleaning or table-understanding subproblems.

### 8. What are the strengths?
- Clear task decomposition: cleaning, integration, enrichment.
- Good subtask-level breakdown instead of staying vague.
- Honest enough about cost and hallucination issues.
- Useful coverage of hybrid methods, not just “throw GPT at it.”
- Helpful evaluation section that separates datasets and metrics rather than pretending one benchmark tells the whole story.
- Sensible emphasis on the gap between flashy agent framing and the small number of robust real deployments.

### 9. What are the weaknesses, limitations, or red flags?
- It is still a survey of a young and somewhat hype-prone area, so many cited methods are likely fragile.
- “Agentic” gets a lot of airtime relative to how few systems seem deeply validated in production-like settings.
- The paper is better at categorizing methods than at sharply distinguishing what is actually robust versus what is clever prompting with nice examples.
- Evaluation remains a mess, especially for enrichment outputs that are open-ended text or metadata.
- The survey risks making the field look more unified than it really is. Cleaning, integration, and enrichment share some patterns, but the operational constraints are pretty different.

### 10. What challenges or open problems remain?
The paper’s most important open problems are real ones:
- **cost and scalability** for large tables and long workflows,
- **hallucination and reliability**, especially when the model edits or imputes data,
- **constraint satisfaction**, especially in integration tasks with global or business-rule requirements,
- **limited practical agent implementations**, despite all the orchestration talk,
- **evaluation mismatch**, where benchmark metrics fail to capture usefulness or failure severity.

One especially good point is that integration often needs global validity constraints that prompt-only systems do not naturally enforce.

### 11. What future work naturally follows?
- Hybrid systems that route routine work to smaller local models and reserve strong LLMs for hard cases.
- Constraint-aware integration systems that pair LLMs with solvers, graph inference, or explicit verification modules.
- Better enrichment benchmarks that capture usefulness, not just label overlap.
- Stronger apples-to-apples comparisons between prompt-based, fine-tuned, and agentic methods under real cost budgets.
- More production-oriented studies on how to deploy these systems safely on sensitive enterprise data.

### 12. Why does this matter?
Because data prep is one of the least glamorous but most economically real parts of applied AI. If LLMs are going to matter outside demos, they need to survive messy schemas, bad records, missing values, weak metadata, and domain-specific ambiguity. This paper does not prove they can, but it shows where they are already being aimed and where the bottlenecks still are.

## Why It Matters

This is a useful survey if you care about LLMs as *infrastructure workers* instead of just chatbots. The interesting part is not that LLMs can classify or summarize, it is that they may become a layer that helps translate unstructured intent into concrete data-prep operations across ugly heterogeneous systems. That is much closer to real enterprise value, and also much closer to painful failure modes.

## What ideas are steal-worthy?
- Treat data prep as three buckets: **cleaning, integration, enrichment**.
- Separate **semantic help** from **execution cost** when evaluating LLM utility.
- Use **hybrid architectures** where LLMs generate plans, rules, or code, but cheaper components execute routine work.
- For integration, pair LLM reasoning with **explicit constraint enforcement** rather than trusting text generation alone.
- For enrichment, stop pretending closed-form metrics are enough.

## Final decision
Keep.

Good landscape paper if you want a grounded map of where LLMs are being used in data preparation and where the field is still obviously shaky.