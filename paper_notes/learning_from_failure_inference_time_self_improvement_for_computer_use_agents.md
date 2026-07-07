# Learning from Failure: Inference-Time Self-Improvement for Computer-Use Agents

## Basic info

* Title: Learning from Failure: Inference-Time Self-Improvement for Computer-Use Agents
* Authors: Xueqiao Sun, Xiaohan Wang, Ludwig Schmidt, Serena Yeung-Levy, Yuhui Zhang
* Year: 2026
* Venue / source: ECCV 2026 / arXiv preprint (cs.CV)
* Link: https://arxiv.org/abs/2606.31270
* PDF: https://arxiv.org/pdf/2606.31270
* Code: https://github.com/snow10072740/Learning_from_Failure
* Date read: 2026-07-07
* Date surfaced: 2026-07-06
* Surfaced via: Tracy in #pocket-reads
* Why selected in one sentence: This is a useful agent-engineering paper because it treats failed computer-use trajectories as a structured source of test-time patches instead of dead data.

## Quick verdict

* Highly relevant

This paper is basically saying: stop throwing away the failed rollouts. For computer-use agents, especially GUI agents evaluated in verifiable environments like OSWorld, failed trajectories contain fairly crisp evidence about where the agent is brittle: grounding errors, dumb action loops, missing procedural knowledge, or refusing to use a better interface such as the terminal. The paper proposes a failure-case loop where an LLM judge diagnoses those failed trajectories, proposes targeted inference-time fixes, and turns them into lightly human-verified code or prompt-level patches. On OpenCUA-72B, this raises OSWorld success from 42.3% to 48.9% without additional model training. The idea is not mysterious, but it is very steal-worthy: failures are not just negative examples for later SFT; they are product telemetry for improving the agent runtime itself.

## One-paragraph overview

The paper introduces a failure-driven self-improvement loop for computer-use agents. Standard self-improvement pipelines run agents in verifiable environments, keep successful trajectories, and fine-tune on those successes while discarding failures. Sun et al. argue that this wastes the most diagnostic part of the experience. Their loop collects failed OSWorld trajectories from a base GUI agent, asks a strong LLM meta-controller to analyze the task instruction, action history, reasoning trace, and failure outcome, then converts recurring failure modes into inference-time improvements. Across four rounds, the loop identifies grounding errors, competency gaps, knowledge deficiencies, and redundant loops, and maps them to visual search, terminal execution, knowledge support, and repetition warnings. The resulting patched OpenCUA-72B agent improves from 42.3% to 48.9% success on OSWorld, with about 8% runtime overhead and roughly 15% fewer interaction steps. The broader claim is that failed trajectories are a reusable supervision source for agent runtime design, complementary to success-only fine-tuning.

## Model definition

### Inputs
Failed computer-use trajectories from a verifiable environment: task instruction, screenshots or UI state, agent thought/action history, environment feedback, and final failure signal. During execution, the improved agent also receives additional local visual crops, warning signals, terminal affordance prompts, search/manual results, and normal GUI observations.

### Outputs
The meta-controller outputs failure diagnoses, proposed inference-time strategies, and code or prompt patches. The patched agent outputs ordinary computer-use actions: clicks, drags, keypresses, terminal commands, and other OSWorld-compatible actions.

### Training objective (loss)
There is no new weight training in the main method. The improvement signal is generated at inference time from failed rollouts and converted into runtime patches. The paper positions this as complementary to success-based SFT loops rather than a replacement for them.

### Architecture / parameterization
The base agent is OpenCUA-72B for the main experiments, with OpenCUA-32B and GUI-Owl-32B used for cross-model tests. Claude 4.5 Sonnet serves as the main meta-controller for diagnosing failures and proposing patches, after comparison with GPT-5.2, Gemini 3 Flash, and Qwen3-VL-32B-Instruct. The final runtime adds four main modules: visual search for click verification, terminal execution support, knowledge support through search/manual retrieval, and repetition warnings based on recent thought/action/screen-state traces.

## Key questions this summary must address

### 1. What problem is the paper trying to solve?
Computer-use agents generate lots of trajectories in verifiable environments, but current self-improvement pipelines mostly preserve successful trajectories and throw away failed ones. That is wasteful because failures are expensive to generate and often contain sharper information than successes: where the agent mis-grounded a click, got stuck in a loop, lacked a procedural trick, or picked a fragile GUI path instead of a direct command-line path.

### 2. What is the method?
The method is a failure-case loop. First, run the current agent in a verifiable environment and collect failed trajectories. Second, feed the instruction, action history, and thought process to an LLM judge. Third, have the LLM diagnose recurring failure modes and propose inference-time improvements. Fourth, convert those proposals into code or prompt patches, with lightweight human verification, and re-run the agent. The loop repeats, so later rounds diagnose the failures that remain after earlier fixes.

### 3. What is the method motivation?
The motivation is very practical: success-only loops teach from what worked, but they do not explain what systematically breaks. In GUI agents, many failures are not opaque model-capability failures; they are runtime-design failures. If the agent clicks the wrong tiny control, keeps copying and pasting in a loop, refuses to use a terminal, or does not know an application hotkey, the fix may be an inference-time tool, warning, retrieval hook, or coordinate verification step rather than a costly new model checkpoint.

### 4. What data does it use?
The paper uses failed trajectories from OSWorld as the main diagnostic source. Each trajectory includes task instructions, GUI observations, action history, reasoning traces, and environment-verifier outcomes. For cross-benchmark tests, the failure-derived patches mined from OSWorld are transferred to OmniACT, AndroidControl, ScreenSpotPro, and WebVoyager. The method also uses external procedural knowledge through a search-style support channel and a curated software-manual reference for some application tasks.

### 5. How is it evaluated?
The main evaluation is OSWorld with OpenCUA-72B over a 100-step budget, using success rate as the metric. The paper also reports ablations on an OSWorld small set with a 30-step limit to isolate visual search, terminal execution, knowledge support, repetition warnings, and the full combined method. Generalization is tested across model families and sizes, including OpenCUA-32B and GUI-Owl-32B, and across GUI benchmarks with Qwen3-VL-32B-Instruct as the backbone.

### 6. What are the main results?
The main OSWorld result is OpenCUA-72B moving from 42.3% +/- 2.6 success to 48.9% +/- 1.2, a 6.6-point absolute gain and 15.6% relative gain. The paper reports no additional training cost, about 8% runtime overhead, and roughly 15% fewer interaction steps.

On the OSWorld small set, individual modules all help: visual search improves 41.67 to 47.22, repetition detection to 44.40, terminal execution to 47.19, knowledge support to 44.44, and the combined method to 52.74.

Cross-model results are smaller but consistent: GUI-Owl-32B improves 19.0 to 21.3, and OpenCUA-32B improves 34.5 to 38.2. Cross-benchmark transfer also improves: OmniACT 4.77 to 6.90, AndroidControl 28.37 to 36.23, ScreenSpotPro 27.50 to 30.74, and WebVoyager 23.80 to 27.90.

### 7. What is actually novel?
The novelty is not "LLM analyzes errors" in the abstract. The useful novelty is turning failed environment rollouts into concrete runtime changes for a GUI agent: visual post-action verification, loop detection, terminal affordance prompting, and procedural knowledge support. The paper also frames this as a complementary loop to success-based self-training, which is a cleaner mental model than treating failures as discarded negative residue.

### 8. What are the strengths?
- The paper attacks a real inefficiency in agent pipelines: failed rollouts are currently underused.
- The method produces concrete runtime mechanisms rather than vague reflections.
- The failure taxonomy is plausible and maps cleanly to actionable interventions.
- The ablation table is useful because each patch class is tested separately.
- The main result is on OSWorld, which is closer to real computer use than toy web forms.
- The cross-benchmark transfer result suggests the patches are not purely OSWorld trivia.
- The human role is quantified: the paper claims over 97% of refinements were accepted without modification and less than 3% of modified lines needed human adjustment.

### 9. What are the weaknesses, limitations, or red flags?
- The method is closer to agent runtime engineering than autonomous self-improvement. Humans still select candidate solutions and lightly verify patches.
- The strongest reported gain comes from a set of fairly intuitive patches. That is good engineering, but it weakens any grand claim that the framework discovered surprising new agent science.
- Search/manual support and terminal execution may change the practical capability envelope even if the paper says the action space and environment configuration are retained.
- OSWorld-derived patches might encode benchmark-shaped priors. Cross-benchmark transfer helps, but the gains on some benchmarks remain small in absolute terms.
- The paper does not fully answer how patch accumulation stays clean over many more rounds. A few modules compose nicely; dozens of patches could become brittle.
- The meta-controller is a very strong proprietary model, so the process may be less accessible than the base-agent framing suggests.

### 10. What challenges or open problems remain?
The hard next problem is patch governance. Once failed trajectories generate runtime modifications continuously, the system needs regression testing, patch ranking, rollback, safety constraints, and a way to avoid overfitting to benchmark quirks. Another open question is whether the loop can discover genuinely new strategies beyond a familiar set of tools like search, terminal use, loop warnings, and visual verification. Finally, the method still needs a cleaner story for how to scale failure diagnosis without human candidate selection.

### 11. What future work naturally follows?
- Add automatic regression tests before accepting runtime patches.
- Use learned reward models or environment verifiers to identify suboptimal trajectories without human labeling.
- Track patch provenance so each behavior change is tied to the failures that motivated it.
- Study long-run patch accumulation, patch conflicts, and rollback.
- Combine the failure-case loop with success-case SFT so runtime fixes can later become training data.
- Test whether the same failure-mining process works for browser agents, coding agents, mobile agents, and robotics policies.

### 12. Why does this matter?
Because agent improvement is moving from "make the base model smarter" to "make the whole agent system learn from its own operational traces." This paper is a clean example of that shift. The important object is not just the model weights; it is the loop around the model: telemetry, diagnosis, patching, verification, and redeployment.

## Why It Matters

This is directly relevant to building durable agents because it treats failed executions as first-class engineering material. The paper's best lesson is simple and strong: when an agent fails, do not merely log it, retry it, or discard it. Diagnose it into a reusable runtime affordance. A failed click can become visual verification. A stuck copy-paste loop can become repetition detection. A brittle GUI workflow can become terminal execution. A missing procedural trick can become a knowledge hook. That is the shape of practical self-improvement before the sci-fi version arrives.

### 13. What ideas are steal-worthy?
- Keep failed trajectories as structured telemetry, not junk.
- Turn repeated failure classes into small runtime affordances.
- Use an LLM judge as a patch suggester, but put verification around it.
- Treat GUI-agent loops as diagnosable state-machine failures, not just "model bad."
- Let agents use high-leverage interfaces such as terminals when GUI manipulation is needlessly fragile.
- Track whether failures shift from low-level operational bottlenecks toward higher-level reasoning failures after each patch round.

### 14. Final decision
Keep and revisit. The paper is not magic self-improvement, but it is very good practical agent engineering. The durable lesson is that failure traces are a rich design surface for runtime improvements, and any serious computer-use agent stack should probably have a version of this loop.
