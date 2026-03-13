---
stage: inbox
agent: planner
provider: alibaba
tags:
  - settings
  - provider
  - onboarding
  - security
contexts:
  - ai-guide
skills: []
---

# Design secure provider key onboarding for open source users

## Goal

Design a secure API key onboarding flow for Kanban2Code so open source users can configure providers, especially Alibaba, from inside the extension UI without hand-editing `.env`, while still preserving `.env` fallback for contributors and local development.

## Definition of Done

- [ ] A detailed architecture recommendation exists for secure provider/API key storage in this VS Code extension
- [ ] The proposal explains how VS Code `SecretStorage` should coexist with `.env` fallback support
- [ ] The proposal clearly separates secret data, non-secret settings, runtime state, and provider metadata
- [ ] The UX flow covers first-run setup, editing/removing keys, status visibility, and invalid/missing key handling
- [ ] The output includes a concrete implementation plan for this repo, not generic advice
- [ ] The output includes testing strategy, migration guidance, and a Kanban2Code-friendly task breakdown

## Refined Prompt

Use `.kanban2code/_context/ai-guide.md` as the primary reference for terminology, architecture alignment, and workflow expectations in this project.

I need a detailed design and implementation plan for adding secure API key onboarding to this open source VS Code extension.

### Project context

- This is Kanban2Code, a VS Code extension with an extension host and sidebar webview.
- The extension currently supports Alibaba-backed chat through the host.
- The current local/dev setup can read API keys from `.env`.
- I want to make this open-source-friendly, so end users should not be required to hand-edit `.env` just to get started.
- At the same time, I want to preserve `.env` support for contributors, local smoke tests, and developer workflows.
- This should align with the project's distinction between `agent` and `provider` from `ai-guide.md`:
  - `agent` controls behavior/instructions
  - `provider` controls runtime/model configuration
- Secrets must never be stored in repo-tracked files.
- The design should support Alibaba first, but be extensible to other providers later.

### What I want

Design a secure provider/API-key setup flow for Kanban2Code that:

1. Lets users enter provider API keys from inside the extension UI
2. Stores secrets securely using the correct VS Code mechanism
3. Keeps non-secret provider settings separate from secrets
4. Continues to support `.env`-based local development fallback
5. Works cleanly with the current extension-host + webview architecture
6. Can scale later to multiple providers, not just Alibaba

### Please cover all of the following in detail

#### 1. Architecture recommendation

- Recommend the best storage approach for secrets in a VS Code extension
- Explain whether VS Code `SecretStorage` should be the primary solution
- Explain how secrets should flow from UI -> host -> runtime use
- Explain how this should coexist with `.env` fallback support
- Explain what should happen if both SecretStorage and `.env` are present

#### 2. Separation of concerns

Clearly define what belongs in:

- VS Code SecretStorage
- `.kanban2code/settings.json`
- provider configuration objects
- runtime memory only
- optional workspace-level config vs user-level config

#### 3. UX / product flow

Design the user experience for:

- first-run onboarding when no provider key exists
- adding an Alibaba API key
- editing or replacing a key
- removing a key
- showing whether a provider is configured without revealing the secret
- handling invalid, expired, or missing keys
- provider setup from the sidebar or settings screen
- how to explain `.env` fallback for developers without confusing normal users

#### 4. Security considerations

Include guidance for:

- preventing keys from being written to tracked files
- avoiding accidental leakage in logs/errors
- avoiding exposing secrets to the webview
- minimizing secret surface area in the extension host
- safe error messages
- what not to do

#### 5. Implementation plan

Give a concrete implementation plan for this repo, including:

- likely files/services/components to add or modify
- host-side service responsibilities
- UI responsibilities
- message passing between webview and host
- how provider resolution should work at runtime
- how Alibaba should be handled first
- how the design can later generalize to other providers

#### 6. Suggested data model

Propose a practical data model for:

- provider metadata
- secret references/status
- provider setup state
- runtime provider resolution precedence
- validation status / smoke-test status

#### 7. Runtime precedence rules

Define a clear precedence order for provider credentials, for example:

- SecretStorage
- environment variables
- `.env`
- anything else if applicable

Explain why that precedence makes sense.

#### 8. Testing strategy

Recommend tests for:

- SecretStorage integration
- fallback to `.env`
- missing secret behavior
- invalid key behavior
- UI setup flow
- host/webview message handling
- provider resolution logic
- regression coverage for existing Alibaba chat flow

#### 9. Migration path

Describe how to evolve from the current `.env`-only-ish developer workflow to a proper open source onboarding flow without breaking current contributors.

#### 10. Task breakdown

At the end, provide a Kanban2Code-friendly task breakdown with:

- task title
- goal
- definition of done
- likely stage (`plan`, `code`, etc.)
- suggested order of implementation

### Output format

1. High-level recommendation
2. Detailed architecture
3. UX flow
4. Implementation plan
5. Risks and tradeoffs
6. Task breakdown

Please make the answer specific to this codebase and avoid generic advice.
