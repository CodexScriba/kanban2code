# How Kanban2Code Works

Welcome to your new Kanban board!

## Folder Structure
- **inbox/**: New tasks start here.
- **projects/**: Organize tasks by project.
- **_archive/**: Completed tasks go here.

## Workflow
1. Create a task in the sidebar.
2. Drag it to 'Plan' or 'Code' on the board.
3. Mark it as 'Completed' to archive it.

## Alibaba Chat Setup

- Put your Coding Plan API key in `/home/cynicus/code/kanban2code/.env` as `ALIBABA_API_KEY=sk-sp-...`
- The sidebar reads Alibaba endpoint and model overrides from `.kanban2code/settings.json` at `providersAndModels.providers.alibaba`
- The default OpenAI-compatible base URL is `https://coding-intl.dashscope.aliyuncs.com/v1`
- The extension now treats `alibaba` as the only configured chat provider in the UI
- The current default Coding Plan models are `glm-5`, `qwen3-coder-plus`, and `qwen3-max-2026-01-23`
- The first model in `providersAndModels.providers.alibaba.models` is the one the sidebar chat uses by default
- Use the Alibaba Coding Plan only for interactive IDE or CLI requests, not automated backend or batch API usage
