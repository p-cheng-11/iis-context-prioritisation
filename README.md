# iis-context-prioritisation

IIS A2 prototype: exploring user-controlled context prioritisation in LLM conversations.

# User-Controlled Context Prioritisation

README prose word count: [TBD]

## Overview

An IIS coursework prototype exploring how users can prioritise information within a single ongoing LLM conversation when the available context budget is limited, focusing on user control in context preservation over system chosen summaries.

Initial planned behaviour:

- Mark conversation messages as important.
- Select messages within a context budget.
- Preview included and excluded messages.
- Warn when marked messages exceed the available budget.

## Tech stack

TBD

## Run/Inspection

TBD

## Development record

- record significant changes, reasons, and checks.
- link relevant commits where useful.

## AI assistance

- ChatGPT suggested the repository structure, I took the gitignore base template given and changed the wording of the readme template.

## Other materials

- docs/scenarios.md: planned interaction examples.

## Initial Design

User problem - important earlier messages containing key information can be excluded due to truncation as the conversation length increase and the conversation must fit into a limited context budget.

User goal - influence which information remains available to the AI for future references.

User action - mark and unmark a message as important.

System response - recalculate which messages should be incluedd and excluded in the context for the upcoming generated response after assigning higher priority to the marked messages.

Visible feedback - show which messages are included and which are marked as important, e.g. marked as important can be with a small flag icon whilst marked as included could be with a ticked star icon, both in the actual conversation history; include a pop-up window the user should be able to open to see the included messages from the conversation history.

Limit case - if the marked messages cannot all fit (e.g. too many marked messages), alert the user and allow the user to adjust their choice. (design choice - currently we will mark the entire message as important instead of highlighting snippets, as this will make the initial prototype easier to develop. however, this is a feature I would like to follow up in future iterations of development.)
