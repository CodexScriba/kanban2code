---
stage: plan
title: Implement Add Follow-up in Inbox from board
tags:
  - mvp
  - ui
  - board
  - inbox
created: 2025-12-07T00:00:00Z
---

# Implement "Add Follow-up in Inbox" from Board

## Goal
Let the user create follow-up/dependency tasks in Inbox directly from a card.

## Scope
- On card `[…]` menu, add `Add Follow-up in Inbox`.
- Show mini modal:
  - Parent task title (read-only).
  - Fields: Title, Tags (prefilled if appropriate), Stage (locked to `inbox`), Agent (optional).
- On submit:
  - Create a new inbox task with `parent` reference in frontmatter.
- Display a small indicator on the original card (e.g. "↗ 1 follow-up").

## Notes
This directly supports your "I see I need backend schema → capture it without losing flow" use case.