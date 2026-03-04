# Coding Plan Providers (Alibaba)

## OpenAI-compatible endpoint
- Base URL: `https://coding-intl.dashscope.aliyuncs.com/v1`

## Anthropic-compatible endpoint
- Base URL: `https://coding-intl.dashscope.aliyuncs.com/apps/anthropic`

## Available models
- qwen3.5-plus
- qwen3-max-2026-01-23
- qwen3-coder-next
- qwen3-coder-plus
- glm-5
- glm-4.7
- kimi-k2.5
- MiniMax-M2.5

## Suggested routing (Kanban2Code orchestration)
- Planning: `kimi-k2.5` (fallback `glm-5`)
- Coding: `qwen3-coder-next` (fallback `qwen3-coder-plus`)
- Audit: `glm-5` (fallback `MiniMax-M2.5`)
