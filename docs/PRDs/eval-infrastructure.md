# PRD: End-to-End Evaluation Infrastructure

**Document Status:** Draft
**Author:** Product Manager
**Target:** ZakatFlow AI / UI Integration

## 1. Problem Statement
With the introduction of the MCP (Model Context Protocol) server and OpenAI ChatGPT apps SDK integration, ZakatFlow operates in two distinct modes:
1. **Conversational "Dignified Guide"**: Answering complex Fiqh (Islamic Jurisprudence) questions.
2. **UI Orchestrator**: Extracting parameters from vague user intents and routing them to localized UI widgets (e.g., an inline Zakat Calculator).

Currently, we lack an automated evaluation pipeline to catch regressions. If the prompt drifts, the LLM might hallucinate Fiqh answers, or worse, try to calculate complex math in text instead of correctly invoking our strictly-typed UI components.

## 2. Target Audience
This infrastructure is designed for the **ZakatFlow Engineering Team** (AI Engineer, UI Engineer, QA Engineer) to ensure that code changes, methodology updates, or underlying model deprecations do not break the core user experience.

## 3. High-Level Architecture & Tenets

Based on the [OpenAI UX Principles](https://developers.openai.com/apps-sdk/concepts/ux-principles), we must evaluate the ecosystem structurally:

### Tenet 1: Text Queries require Semantic Evals (Promptfoo)
For questions like "What is the Hanafi ruling on 401ks?", exact string matching is impossible. We must use an LLM-as-a-Judge framework (e.g., Promptfoo) to test standard inputs against a golden rubric.
* **Metric:** 100% adherence to the "Dignified Guide" persona tone. 0% hallucination score against `packages/core` rulebooks.

### Tenet 2: UI Queries require Deterministic Evals (Vitest + Playwright)
For commands like "Calculate my zakat on 50k gold", the model must *not* attempt to answer conversationally. It must invoke a UI Tool.
* **Metric 1 (Routing):** 100% of mathematical intents successfully map to an `invoke_tool` call.
* **Metric 2 (Payload):** The extracted payload strictly passes the Zod schemas defined in `apps/mcp-server/src/tools/`.
* **Metric 3 (Rendering):** Playwright E2E tests verify that the JSON payload successfully renders the `<ZakatCalculatorWidget>` inline without crashing.

## 4. End-to-End Automated Pipeline

### Phase A: The MCP Sandbox Test (Fast Feedback)
Run locally or in CI on every push to `main` or an MCP tool edit.
- **Tool**: Vitest natively mocking the LLM request.
- **Workflow**:
  1. Pass 50 synthetic user prompts ("fuzzy math inputs") into the tool router.
  2. Assert that the `action` returned is exactly matching the `<ToolName>`.
  3. Assert the arguments object against the Zod schema. 
- *Failure here prevents deployment of `apps/mcp-server`.*

### Phase B: The Conversational Eval Suite (Nightly/Pre-Release)
Run on a cron schedule or before major version bumps to prevent expensive API churn.
- **Tool**: Promptfoo (or equivalent LLM-Eval framework).
- **Workflow**:
  1. Feed 100 edge-case religious queries into the system prompt.
  2. Use a distinct evaluator model (e.g., GPT-4o-Eval) to score the output on Tone, Conciseness, and Fiqh accuracy.
- *Failure here blocks the release and alerts the `/product-counsel`.*

### Phase C: Visual Integration (Playwright CI)
Run during the standard Next.js / React build process.
- **Tool**: Playwright + Storybook/Mocking.
- **Workflow**:
  1. Feed a mocked valid JSON payload from the MCP tool directly into the `apps/web` UI component.
  2. Assert that the UI renders without accessibility violations (WCAG 2.1 AA) and that specific `data-testid` values match the payload.
- *Failure here blocks deployment of `apps/web`.*

## 5. MVP Implementation Plan (Next Steps)

For the Engineering teams to execute this, we will break the MVP down into these immediate actionable tickets:
1. **[Backend/AI] Setup Vitest Tool Assertions**: Write 20 golden prompt assertions for the Zod tool schemas in `apps/mcp-server`.
2. **[UI/QA] Scaffold Playwright MCP Mocks**: Create a Playwright fixture that mocks the ChatGPT iframe/inline wrapper and feeds tool stubs to existing React components.
3. **[Tech Lead] Integrate Promptfoo**: Scaffold a basic `promptfooconfig.yaml` testing 10 baseline Fiqh questions against our system prompt.
