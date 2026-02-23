# PRD: End-to-End Evaluation Infrastructure

**Document Status:** Approved MVP
**Author:** Product Manager
**Target:** ZakatFlow AI / UI Integration (MCP Server + apps SDK)

## 1. Problem Statement
With the introduction of the MCP (Model Context Protocol) server and OpenAI ChatGPT apps SDK integration, ZakatFlow operates in two distinct modes:
1. **Conversational "Dignified Guide"**: Answering complex Fiqh (Islamic Jurisprudence) questions.
2. **UI Orchestrator**: Extracting parameters from vague user intents and routing them to localized UI widgets (e.g., an inline Zakat Calculator).

Because ZakatFlow will operate as an agent that can either converse natively or render custom interactive React interfaces, we are no longer just evaluating *what* the model says, but **how** it chooses to present it. Our evals must ensure absolute mathematical/theological accuracy while strictly adhering to OpenAI’s Apps SDK UX guidelines—specifically the rule of **"Complementary, not redundant"** (i.e., if the UI shows the math, the text shouldn't).

## 2. Target Audience
This infrastructure is designed for the **ZakatFlow Engineering Team** (AI Engineer, UI Engineer, QA Engineer, Senior Tech Lead) to ensure that code changes, methodology updates, or underlying model deprecations do not break the core user experience.

## 3. High-Level Architecture & Tenets

Our evaluation framework shifts from traditional LLM testing to a modality-aware matrix:

### 3.1. The Core Distinction: Modality Routing (Intent Evals)
Before evaluating the content, the first layer of evals must test **Routing Logic**. When the LLM receives a prompt, it must decide whether to output plain text or trigger an App SDK UI component.
* **Text-only intents:** Simple FAQs, Fiqh rulings, single-variable lookups.
* **UI intents:** Multi-variable calculations, portfolio building, data visualization.
* **Metric:** Deterministic assertion that UI tools (`render_calculator_ui`) are invoked *only* for UI intents, preventing UI triggers for simple conversational Q&A.

### 3.2. Evaluating Text-Only Queries
For interactions where no UI is rendered, evals focus on factual grounding, theological safety, and mathematical accuracy.
1. **Strict Grounding (Zero Hallucination):** Deterministic checks to ensure final output contains exact values from MCP tool (e.g., checking Nisab values).
2. **Theological Tone & Boundaries (LLM-as-a-Judge):** Rubric-based evaluation to ensure the model states rulings objectively based *only* on retrieved context and includes necessary caveats (e.g., Hawl requirement).
3. **No Markdown "Leakage":** Assertions (`assert("|" not in response.text)`) to prevent hallucinated markdown tables when responses should be purely conversational.

### 3.3. Evaluating UI Queries (Apps SDK Specifics)
When rendering a UI, the LLM generates a JSON payload. Evals shift to testing structured data, API contracts, and UX conciseness.
1. **Prop Extraction & Schema Validation (Deterministic):** Strict JSON Schema validation on the intercepted tool call arguments to ensure natural language maps correctly to the web component's required props.
2. **The "No Redundancy" Rule:** Strict character limits for text responses when a UI tool is called (e.g., `assert(len(text_response) < 150 chars)`). The text must yield to the UI and not repeat the math.
3. **Decoupled Tool Flow (Chaining):** Execution trace checks to ensure data tools are called *before* UI render tools (data tools calculate the result, UI tool renders the trusted data).

### 3.4. Evaluating Multi-Turn & Context Hydration
To test state synchronization via `ui/update-model-context`:
* **Simulated Multi-Turn Evals:** Inject mock payloads simulating user interactions *inside* the widget, followed by natural language follow-ups, and assert the model correctly reads the updated context to re-render.

## 4. End-to-End Automated Pipeline

### Phase A: The MCP Sandbox Test (Fast Feedback)
Run locally or in CI on every push to `main` or an MCP tool edit.
- **Tool**: Vitest natively mocking the LLM request.
- **Focus**: Routing Intent, Schema Validation, Prop Extraction.

### Phase B: The Conversational Eval Suite (Nightly/Pre-Release)
Run on a cron schedule or before major version bumps.
- **Tool**: Promptfoo (or Braintrust / LangSmith).
- **Focus**: Theological safety, tone, hallucination rates, strict grounding.

### Phase C: Visual Integration (Playwright CI)
Run during the standard Next.js / React build process.
- **Tool**: Playwright + Storybook/Mocking.
- **Focus**: Ensuring the generated UI payloads render without accessibility violations (WCAG 2.1 AA) and that `data-testid` values match the payload.

## 5. MVP Implementation Plan (Next Steps)

For the Engineering teams to execute this, we break the MVP down into these immediate actionable Epics/Issues:

1. **[AI/Backend Track] Define & Implement the Eval Matrix (Promptfoo + Vitest) for Intent & Text Routing**
   - Create golden dataset of Text vs UI intents.
   - Implement `tool_not_called` assertions for text queries.
   - Implement LLM-as-a-judge rubrics for Theological Safety.
2. **[AI/Backend Track] Implement UI Query Evaluation (Strict Payload & "No Redundancy")**
   - Add strict JSON schema validators in Vitest for `render_calculator_ui` tool arguments.
   - Implement string length assertions (`< 150 chars`) for responses accompanying UI renders.
3. **[Tech Lead] Build Multi-Turn Context Hydration Evals**
   - Create a test harness to simulate `ui/update-model-context` events between turns.
4. **[UI/QA Track] Scaffold Playwright MCP Mocks for Visual Integration**
   - Create Playwright fixtures to consume mock MCP tool payloads and assert rendering.
