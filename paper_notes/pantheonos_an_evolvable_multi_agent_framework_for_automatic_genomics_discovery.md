# PantheonOS: An Evolvable Multi-Agent Framework for Automatic Genomics Discovery

## Basic info

* Title: PantheonOS: An Evolvable Multi-Agent Framework for Automatic Genomics Discovery
* Authors: Weize Xu, Erwin Poussi, Quan Zhong, Zehua Zeng, Christopher Zou, Xuehai Wang, Yifan Lu, Miao Cui, Daiji Okamura, Cinlong Huang, Jiayuan Ding, Zhe Zhao, Yuheng Yang, Xinhai Pan, Varshini Vijay, Naoki Konno, Nianping Liu, Lei Li, X. Rosa Ma, Stephanie D. Conley, Colin Kern, William R. Goodyer, Bogdan Bintu, Quan Zhu, Neil C. Chi, Jiang He, Lorenz Rognoni, Xiuwei Zhang, Jun Wu, David Ellison, Marlene Rabinovitch, Jesse M. Engreitz, Xiaojie Qiu
* Year: 2026
* Venue / source: bioRxiv
* Link: https://www.biorxiv.org/content/10.64898/2026.02.26.707870v1
* PDF: https://www.biorxiv.org/content/biorxiv/early/2026/02/27/2026.02.26.707870.full.pdf
* DOI: 10.64898/2026.02.26.707870
* Project page: https://pantheonos.stanford.edu/paper
* Repo surfaced by Tracy: https://github.com/aristoteleo/PantheonOS
* Date read: 2026-04-11
* Date surfaced: 2026-04-11
* Surfaced via: Tracy in #pocket-reads
* Why selected in one sentence: This is a high-ambition genomics-agent paper that tries to fuse multi-agent orchestration, privacy-aware distributed systems, code evolution, and actual biological discovery into one “agent OS” story.

## Quick verdict

* Worth keeping, with caution

This is a big-swing paper. At its best, it is one of the more serious attempts to turn “AI agents for biology” from a demo-y assistant into an end-to-end research operating system with actual domain workflows, distributed/privacy-aware deployment, community extensibility, and even algorithmic self-improvement. At its worst, it overbundles a lot of things—framework architecture, UI/system design, agent benchmarking, code evolution, and biological discovery—into one extremely broad claim set, with some rhetoric drifting toward manifesto mode. Still, unlike thinner agent papers, this one at least attaches the rhetoric to real platform engineering and nontrivial genomics case studies.

## One-paragraph overview

The paper introduces **PantheonOS**, an evolvable distributed multi-agent framework for genomics and broader scientific data analysis. The platform is organized as a four-layer pyramid spanning LLM infrastructure, agent runtime, interfaces, and domain applications. It supports multiple interfaces (CLI, GUI, Jupyter, Slack), distributed communication via NATS, domain-specialized agents and skills, and a privacy-aware design meant to decouple agents from sensitive data environments. The central technical claim is **Pantheon-Evolve**, a mechanism for agentic code evolution that iteratively improves algorithms instead of merely calling fixed tools. The paper argues that this lets PantheonOS push beyond routine analysis, claiming improvements over existing biological agent systems, super-human evolution of batch-correction methods like Harmony / Scanorama / BBKNN, and meaningful scientific discoveries in mouse embryo 3D spatial transcriptomics, fetal heart multi-omics integration, and virtual-cell model routing.

## Model definition

### Inputs
Natural-language user instructions, genomics datasets (including single-cell, spatial transcriptomics, multi-omics, and FASTQ-level inputs), software tools and scripts, and domain skill/tool definitions.

### Outputs
Analysis artifacts, code, evolved algorithms, integrated biological results, and domain-specific discoveries such as reconstructed spatial maps, integrated omics analyses, and model-selection outputs.

### Training objective (loss)
This is not a single predictive model paper. PantheonOS is a systems/framework paper with multiple learned and agentic components, including LLM-based agents and an evolution loop for algorithmic improvement. The main “objective” is task completion, algorithmic improvement, and scientific utility rather than one unified loss.

### Architecture / parameterization
The system uses a **four-layer pyramid**:
- **LLM layer**: unified interface over 100+ LLMs with retry/fallback and distributed communication.
- **Agent layer**: agent loop, structured inter-agent transfer, Modal Task Protocol (MTP), Agentic Context Engineering (ACE), specialized agents, tools, and team patterns.
- **Interface layer**: CLI, GUI, Jupyter integration, Slack support.
- **Application layer**: domain instantiations for genomics and other scientific workflows.

The key extension is **Pantheon-Evolve**, which tries to recursively improve algorithms/packages/skills rather than only execute them.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
The paper is trying to solve a real gap in “AI for biology” systems: current biological agents are often either too narrow to be broadly useful or too general to be genuinely expert. They also tend to be static tool orchestrators rather than systems that can improve the algorithms they rely on. On top of that, practical concerns like privacy-sensitive deployment, integration with actual scientist workflows, and community extensibility are often underdeveloped. PantheonOS aims to become a general scientific operating system that is still deeply competent in genomics.

### 2. What is the method?
The method is a full-stack agent framework. PantheonOS combines:
- a distributed multi-agent runtime,
- structured task protocols (MTP),
- context management (ACE),
- domain-specialized agents and skills,
- multiple user interfaces,
- and Pantheon-Evolve for iterative code/algorithm evolution.

In practice, it applies this stack to several genomics tasks, from preprocessing and integration to spatial reconstruction and single-cell foundation model routing.

### 3. What is the method motivation?
The motivation is that hard biological discovery needs more than “chat with a tool-using agent.” It needs systems that can coordinate multiple specialists, operate within real lab/software environments, protect sensitive data, and improve methods when existing ones are not enough. The strongest part of the motivation is probably the code-evolution angle: if agents can only call today’s tools, they remain bottlenecked by human-designed methods.

### 4. What data does it use?
The paper spans multiple biological datasets and domains, including:
- single-cell and spatial genomics datasets,
- an OpenST-based 3D spatial transcriptomics dataset of early mouse embryogenesis at E6.0,
- human fetal heart single-cell multi-omics integrated with whole-heart 3D MERFISH+ data at post-conception week 12,
- and benchmark settings for batch correction and virtual-cell/foundation-model routing.

### 5. How is it evaluated?
The paper evaluates PantheonOS at several levels:
- system/agent benchmarking against prior agent systems like Biomni,
- ablations on its operational components such as MTP,
- algorithm-evolution performance on methods like Harmony, Scanorama, and BBKNN,
- and biological case studies where the platform is used to produce nontrivial scientific analyses and claims.

This breadth is both a strength and a weakness: it shows real ambition, but it also makes the whole paper harder to evaluate cleanly as one thing.

### 6. What are the main results?
The headline claims are:
- Pantheon agent outperforms Biomni on multiple evaluation metrics.
- MTP ablations show the structured task protocol improves performance.
- Pantheon-Evolve improves or “evolves” batch-correction methods such as **Harmony, Scanorama, and BBKNN**, with the paper characterizing the results as surpassing human-designed baselines and reaching “super-human” performance.
- The system supports end-to-end genomics workflows including RL-augmented gene panel design, raw FASTQ processing, multimodal integration, and 3D spatial genomics reconstruction.
- In early mouse embryogenesis, PantheonOS helps reveal spatially segregated **Cer1** and **Nodal** domains and argues for active paracrine Cer1–Nodal inhibition in proximal-distal axis formation.
- In human fetal heart development, it integrates single-cell multi-omics with 3D MERFISH+ maps to uncover spatial programs relevant to cardiac disease ontogeny.
- It also introduces an intelligent **virtual cell / foundation model router** for adaptive model selection across heterogeneous tasks.

### 7. What is actually novel?
The novelty is the bundle:
- a biology-focused multi-agent operating system rather than a single-agent analysis assistant,
- privacy-aware/distributed deployment as a first-class design feature,
- explicit community extensibility via a “store” model,
- and most importantly, **agentic code evolution** as part of the platform’s normal operating logic.

The strongest distinctive idea is not “LLMs help biology” but “an agent platform should be able to evolve the computational methods it uses.”

### 8. What are the strengths?
- It is much more operationally serious than a lot of agent papers.
- The framework actually acknowledges privacy, distributed deployment, and workflow integration.
- The paper gives a concrete answer to the generality-vs-domain-specificity tradeoff instead of handwaving it away.
- Pantheon-Evolve is a genuinely interesting idea if it works as advertised.
- The biological applications are not toy tasks; they are the kind of analyses people actually care about.
- The system supports CLI/Jupyter/Slack/GUI, which sounds boring until you remember how often agent papers ignore the real environments scientists work in.

### 9. What are the weaknesses, limitations, or red flags?
- The paper is **very broad**, which makes it hard to tell which pieces are deeply validated versus only plausibly assembled.
- “Super-human performance” language is aggressive and should be read skeptically unless the exact benchmarks and baselines are airtight.
- The manuscript mixes systems claims, benchmark claims, and biological discovery claims, which can make failures in one area less visible because the narrative is so large.
- The discussion leans hard into “scientific singularity” rhetoric, which is not my favorite genre.
- As a bioRxiv preprint, this still needs external scrutiny, especially for the strongest biological interpretation claims.
- It is not always clear how much of the impressive scientific output comes from the platform abstraction itself versus strong human curation plus tool integration plus selective case-study framing.

### 10. What challenges or open problems remain?
- More rigorous and modular benchmarking of each subsystem.
- Stronger evidence that code evolution reliably improves methods rather than occasionally overfitting a benchmark.
- Better isolation of what exactly MTP, ACE, team structure, and evolution each contribute.
- More reproducible reporting around the boundary between agent autonomy and human guidance.
- Real-world adoption studies: does this genuinely improve scientist throughput and quality, or mostly produce flashy demos?

### 11. What future work naturally follows?
- Independent replication and benchmarking of Pantheon-Evolve.
- Applying the same framework beyond genomics into other scientific domains.
- More formal safety/privacy studies for distributed biomedical agent systems.
- Better interfaces for human oversight during long-horizon scientific workflows.
- More careful comparisons against both narrow expert systems and newer general scientific agents.

### 12. Why does this matter?
Because biology increasingly looks like a systems-integration problem as much as a modeling problem: huge data, many modalities, complex workflows, brittle tools, and genuine privacy constraints. A credible agent OS for science would be a bigger deal than yet another single-task copilot. PantheonOS is not obviously that final answer, but it is closer to the right scale of question than most papers in this space.

## Why It Matters

The important idea here is not just “agents can analyze genomics data.” It is that scientific AI systems may need to become **operating environments**: distributed, extensible, oversight-friendly, method-improving, and deeply integrated with real workflows. PantheonOS is one of the clearest papers trying to articulate that jump.

### 13. What ideas are steal-worthy?
- Treat privacy-aware distributed deployment as first-class architecture, not an afterthought.
- Give scientific agents a real systems shell: CLI, notebook, team chat, GUI, artifacts, protocols.
- Encode domain expertise in reusable skills/templates rather than only hidden prompting.
- Let agents improve methods, not just invoke them.
- Evaluate scientific-agent systems with real domain case studies, but keep subsystem benchmarks sharp so the story does not become un-auditable.

### 14. Final decision
Keep, but read with both curiosity and skepticism. This is a meaningful paper in the scientific-agent systems lane because it tries to solve the actual hard part—operationalizing domain-aware, evolvable, end-to-end research systems—not merely producing another biology chatbot. But the scope is so broad, and the rhetoric so confident, that every flashy claim deserves independent verification.