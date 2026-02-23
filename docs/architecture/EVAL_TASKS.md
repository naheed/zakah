# Eval Infrastructure: Tasks & Roadmap

Since remote GitHub issue creation is currently blocked, this document serves as the source of truth for the execution of the Eval Infrastructure project.

## 1. Intent Routing & Text Query Eval Matrix
**Objective:** Assert that the MCP Router correctly identifies when to output text vs when to invoke a UI tool, and evaluate the quality/safety of text responses.
- [ ] Create a golden dataset in Promptfoo/Vitest testing 20 distinct intents (10 UI tasks, 10 simple conversational tasks).
- [ ] Implement a deterministic `tool_not_called` assertion for text-only Fiqh queries to ensure no UI is rendered.
- [ ] Implement an LLM-as-a-judge rubric evaluating theological safety and tone for conversational queries (must include necessary caveats like Hawl).
- [ ] Implement an assertion ensuring no hallucinated markdown leakages (e.g., `assert("|" not in response.text)`).

## 2. UI Query "No Redundancy" & Schema Evals
**Objective:** Ensure the LLM generates correct tool arguments and stops redundantly explaining the math.
- [ ] Add strict JSON schema validators in Vitest testing the `render_calculator_ui` tool.
- [ ] Assert the model maps natural language inputs precisely to the required web component props.
- [ ] Implement a string length assertion (`< 150 chars`) for text responses that accompany UI rendering to enforce the "Complementary, not redundant" UX rule.
- [ ] Add execution trace checks asserting that the Data tool is called and returns correctly *before* the UI Render tool is invoked.

## 3. Multi-Turn Context Hydration Test Harness
**Objective:** Test state synchronization via `ui/update-model-context`.
- [ ] Create an eval workflow testing at least 3 turns (User query -> UI update mock -> Follow-up).
- [ ] Simulate injecting mock UI payloads into the conversation history to assert state changes are registered.
- [ ] Verify the model successfully hydrates the updated context and re-renders the tool accurately on subsequent turns.

## 4. Playwright MCP Mocks for Visual Integration
**Objective:** Ensure JSON payloads render properly in `apps/web` components.
- [ ] Create Playwright fixtures wrapping existing React components with a mocked ChatGPT iframe/inline environment.
- [ ] Write integration evaluations that consume valid `render_calculator_ui` (and other) JSON payloads.
- [ ] Assert that the UI renders without accessibility violations (WCAG 2.1 AA level).
- [ ] Assert `data-testid` values match the inserted payload fields.
