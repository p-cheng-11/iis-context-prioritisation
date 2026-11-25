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

The prototype will use HTML, CSS and vanilla JavaScript to create an interactive interface where the proposed interactions locally in a browser. Context selection will use a simulated word budget, and all responses will be scripted with no backend, database or LLM API. This is because the first prototype is intended to be just an interactive interface, and LLM APIs are over my budget. Node.js’s built-in test runner will check the context-selection logic. No technology choices remain undecided for this simulation apart from the model or API for a future live version, which I have not selected.

## Run/Inspection

- open the index.html file

## Development record of changes

V1 sketch design: contained two screens.

- The first screen contained the chatbot interface, where the user can exchange messages with the chatbot, mark messages as important, and see which messages were included in the context for the next response. Flags indicates being marked as important, while ticks indicates that the message is currently being used in generating the next response.
- In this prototype, marking a message as important tells the system to prioritise it when selecting what to include in context for the next simulated response. “Included” means the message is currently selected within the available context budget. The system first includes messages marked as important, then fills the remaining space with unmarked messages, starting with the most recent ones. Older messages may be excluded when the context budget is low, but the user can mark them as important to prioritise them when needed. If the important messages exceed the budget, the prototype displays a warning and pauses the response generation until the user adjusts which messages are selected as important or increases the budget.
- The second screen provided a detailed view of context selection. It shows the current context budget, a slider for adjusting it, and a list of currently included messages. It also showed counts of each type of messages, separated into assistant and user messages. My intention was to separate the conversation interface from the context information and statistics, giving each function its own screen.

V2 sketch design: combining the two screens.

- I had a discussion about v1 with ChatGPT, it pointed out the unused space and whether users actually needs these separate counts for assistant and user messages. I considered this a useful observation because the main purpose of the interface was to help users understand and control which messages would inform the next response.
- Therefore in V2, I combined the two screens into one. The conversation on the left, a sidebar on the right displays the context budget, summary counts, and the currently included messages. This allows the user to view the conversation and its selected context together without having to switch screens. The intension is to make the overall functionality flow easier to follow.
- kept the definition of important, included and excluded.
- kept the overall functionality of the prototype.

Prototype idea c1 (change 1)

Decision: simulate LLM responses.

- I chose scripted responses to avoid LLM API costs and keep the prototype on presenting a simulated context-selection interaction. This allows me to demonstrate the user controlled process and resolving budget conflicts. This simulation will show the interface behaviour, but will not provide evidence of how a real LLM would use the selected context.

V3 sketch design: combining the two screens.

This time, a left side bar is added specifically to act as a guide for showing three different scenarios in using this application prototype. This is not a part of the product, and will only be added to this interface as a guide on using it.

Prototype v1: initial screen created.

## AI assistance

Model used: ChatGPT Astra

- ChatGPT suggested the repository structure, I took the gitignore base template given and changed the wording of the readme template.
- After drawing my initial sketch of what the prototype should look like, I sent it to ChatGPT for suggestions: it suggested that it currently has too much redundant information and was too much effort to navigate, and suggested that I should combine the two screens into one to make it easier to use.
- ChatGPT Astra generated storyboard 1's image representation after I sent the flow of the panels as prompt.
- ChatGPT Astra generated storyboard 2's image representation after I sent the flow of the panels as prompt.
- ChatGPT Astra generated storyboard 3's image representation after I sent the flow of the panels as prompt.
- CHatGPT Astra generated the initial prototype (code in the prototype folder) after I sent it my sketch v3, I did not write this code.

## Other materials

- docs/scenarios.md: planned interaction examples.
- docs/sketch-designs: the versions of the prototype interface sketches.

## Initial Design

User problem - important earlier messages containing key information can be excluded due to truncation as the conversation length increase and the conversation must fit into a limited context budget.

User goal - influence which information remains available to the AI for future references.

User action - mark and unmark a message as important.

System response - recalculate which messages should be incluedd and excluded in the context for the upcoming generated response after assigning higher priority to the marked messages.

Visible feedback - show which messages are included and which are marked as important, e.g. marked as important can be with a small flag icon whilst marked as included could be with a ticked star icon, both in the actual conversation history; include a pop-up window the user should be able to open to see the included messages from the conversation history.

Limit case - if the marked messages cannot all fit (e.g. too many marked messages), alert the user and allow the user to adjust their choice. (design choice - currently we will mark the entire message as important instead of highlighting snippets, as this will make the initial prototype easier to develop. however, this is a feature I would like to follow up in future iterations of development.)
