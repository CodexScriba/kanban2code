# Kanban2Code Roadmap Notes

- Product entry points in sidebar icon:
  - Chat -> chat workflow
  - OpenClaw -> one-time connection/setup plus remote control/workflow bridge
  - Sidebar -> manual orchestration, similar to old Kanban2Code
- OpenClaw should be a one-time connection, not the primary workspace every time.
- Logs and orchestration data should remain viewable at any point after connection.
- Chat should be the conversational interface with focused options/actions.
- Sidebar should preserve the old Kanban2Code-style manual orchestration workflow.
- Landing view should be configurable in settings or simply remember the last selected option.
- There should be an orchestrator brain/agent that lives inside Kanban2Code in its own `orchestrator/` folder.
- The orchestrator should keep context and maintain its own memory.
- OpenClaw integration idea: connect OpenClaw so the OpenClaw agent can learn how to prompt against or use the orchestration files.
- This may happen through a skill or through deeper native integration with the orchestrator layer.
