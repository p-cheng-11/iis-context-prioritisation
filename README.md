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

## Current Status

The current version is an interactive browser-based prototype. The features: whole-message importance marking, context selection, inclusion indicators, context preview, undo changes and overflow warnings are implemented. This prototype uses a prepared, scripted conversation and a word-count instead of token-count budget, and it does not connect to a real LLM. The left-hand scenario panel provides demonstration guidance and is not part of the proposed product.

The features: free-text conversation, long-term storage and passage-level highlighting for important marking are not implemented. Passage-level highlighting and live LLM integration are possible future development directions outside of this current prototype scope.

## Tech stack

The prototype will use HTML, CSS and vanilla JavaScript to create an interactive interface where the proposed interactions locally in a browser. Context selection will use a simulated word budget, and all responses will be scripted with no backend, database or LLM API. This is because the first prototype is intended to be just an interactive interface, and LLM APIs are over my budget. Node.js’s built-in test runner will check the context-selection logic. No technology choices remain undecided for this simulation apart from the model or API for a future live version, which I have not selected. ChatGPT was used as a development tool. It generated the prototype code as well as the code for design refinement, and provided advice on documentation and testing guidance.

## Run and inspect

Download and extract the repository, then open:
`prototype/index.html`
in a web browser. Keep the accompanying CSS and JavaScript files in their existing locations.

No server, build step, API key or database is required, the conversation and replies are scripted examples.

Use the three scenario buttons on the leftmost panel to inspect:

1. Marking an older message as important and checking the context.
2. Unmarking a flagged message and restoring a previous selection with Undo button.
3. Exceeding the priority budget and manually resolving the warning.

Check that the message indicators, selected-message list and response availability update after each action.

## Automated tests

Node.js is required to run the tests, but not to use the prototype.
The tests use Node.js's built-in test runner and requires no additional packages.

From the repository root, run:

```
node --test prototype/tests/selection.test.cjs
```

The file contains 11 tests of word count and context-selection rules. A successful run should report 11 passed and 0 failed. These tests checks the selection logic, interface interactions must be inspected manually using the scenarios.

This has been checked and ran locally, a working screenshot of the test results on the terminal is provided in prototype/tests/testing-evidence.png

## Development record of changes

**V1 sketch design: contained two screens.**

- The first screen contained the chatbot interface, where the user can exchange messages with the chatbot, mark messages as important, and see which messages were included in the context for the next response. Flags indicates being marked as important, while ticks indicates that the message is currently being used in generating the next response.
- In this prototype, marking a message as important tells the system to prioritise it when selecting what to include in context for the next simulated response. “Included” means the message is currently selected within the available context budget. The system first includes messages marked as important, then fills the remaining space with unmarked messages, starting with the most recent ones. Older messages may be excluded when the context budget is low, but the user can mark them as important to prioritise them when needed. If the important messages exceed the budget, the prototype displays a warning and pauses the response generation until the user adjusts which messages are selected as important or increases the budget.
- The second screen provided a detailed view of context selection. It shows the current context budget, a slider for adjusting it, and a list of currently included messages. It also showed counts of each type of messages, separated into assistant and user messages. My intention was to separate the conversation interface from the context information and statistics, giving each function its own screen.

**V2 sketch design: combining the two screens.**

- I had a discussion about v1 with ChatGPT, it pointed out the unused space and whether users actually needs these separate counts for assistant and user messages. I considered this a useful observation because the main purpose of the interface was to help users understand and control which messages would inform the next response.
- Therefore in V2, I combined the two screens into one. The conversation on the left, a sidebar on the right displays the context budget, summary counts, and the currently included messages. This allows the user to view the conversation and its selected context together without having to switch screens. The intension is to make the overall functionality flow easier to follow.
- kept the definition of important, included and excluded.
- kept the overall functionality of the prototype.

**Prototype idea c1 (change 1)**

Decision: simulate LLM responses.

- I chose scripted responses to avoid LLM API costs and keep the prototype on presenting a simulated context-selection interaction. This allows me to demonstrate the user controlled process and resolving budget conflicts. This simulation will show the interface behaviour, but will not provide evidence of how a real LLM would use the selected context.

**V3 sketch design: adding scenario guide.**

This time, a left side bar is added specifically to act as a guide for showing three different scenarios in using this application prototype. This is not a part of the product, and will only be added to this interface as a guide on using it.

**Prototype v1.1: initial screen created.**

This prototype followed the rough layout of sketch-v3, and implements whole-message importance marking, context selection, inclusion indicators (flags and ticks), a context preview, undo button, and budget-overflow warnings. It uses a scripted conversation and three demonstration scenarios as descripted in scenarios.md.
Marking or unmarking a message recalculates the selected context and updates the UI. Once the flag icon is clicked, the message became flagged as important and is included, and appeared in the selected-message list on the right hand side.
Also on the right hand side, the undo button was also checked, clicking this button results in unmarking most recently changed the selection, restoring the previous flags and selected messages. A warning appears and the reply button became disabled upon checking this feeature. After unmarking a message so the context space is freed and the priorities fitted, the warning cleared and the button became available again.
If important messages exceed the budget, the interface shows a warning and disables the response generation until the conflict is resolved.
Context selection and interface controls are implemented in vanilla JS. The word budget and scripted replies simulate LLM interaction, but no real model is connected.

**Prototype v1.2: adjusted visual styling.**

Prototype v1.1 had an awkward formatting that made the page unable to mostly fit on the screen. After describing the issue to ChatGPT Astra, it helped me write the code to fix the styling, resizing the page and vertical spacing and applying internal scrolling for conversation history and selected message list, resulting in v1.2 (current version). These changes were intended to make the conversation and context controls easier to inspect and use for the user.Once those were applied, the scrolling was achieved and I was able to scroll through the messages while the surrounding controls stayed in place.
A walkthrough explanation of this interactive interface's UI is explained under prototype/Prototype-v1.2-explaining-ui.pdf.

## AI assistance

Model used: ChatGPT Astra

- ChatGPT suggested the repository structure, I took the gitignore base template given and changed the wording of the readme template.
- After drawing my initial sketch of what the prototype should look like, I sent it to ChatGPT for suggestions: it suggested that it currently has too much redundant information and was too much effort to navigate, and suggested that I should combine the two screens into one to make it easier to use.
- ChatGPT Astra generated storyboard 1, 2 and 3's image representation after I sent the flow of the panels as prompt.
- ChatGPT Astra generated the initial prototype (code in the prototype folder) after I sent it my sketch v3, I did not write this code.
- ChatGPT Astra generated the new css code added in styles.css after I described what issue I'm seeing with the page and told it what I want it to fix.
- ChatGPT Astra generated selection.test.cjs, which contained the automated checks for the context-selection logic.
- ChatGPT Astra explained how the test for selection (selection.test.cjs) works and runs, I took the explanation and wrote the section for automated tests.

## Other materials

- docs/scenarios.md: planned interaction examples.
- docs/sketch-designs: the versions of the prototype interface sketches.
- docs/storyboards/storyboard1.png, docs/storyboards/storyboard2.png, docs/storyboards/storyboard3.png: the three 6-panelled storyboards showing a fictional persona Sam interacting with the system.
- docs/storyboards/storyboards.md: markdown file explaining what each storyboard depicted.
- prototype/tests: the test code and screenshot evidence.
- prototype/prototype-architecture.pdf: design architecture diagram for the prototype.
- prototype/Prototype-v1.2-explaining-ui.pdf: labelled UI to explain the components on the screen in the final prototype.

## Initial Design

User problem - important earlier messages containing key information can be excluded due to truncation as the conversation length increase and the conversation must fit into a limited context budget.

User goal - influence which information remains available to the AI for future references.

User action - mark and unmark a message as important.

System response - recalculate which messages should be incluedd and excluded in the context for the upcoming generated response after assigning higher priority to the marked messages.

Visible feedback - show which messages are included and which are marked as important, e.g. marked as important can be with a small flag icon whilst marked as included could be with a ticked star icon, both in the actual conversation history; include a pop-up window the user should be able to open to see the included messages from the conversation history.

Limit case - if the marked messages cannot all fit (e.g. too many marked messages), alert the user and allow the user to adjust their choice. (design choice - currently we will mark the entire message as important instead of highlighting snippets, as this will make the initial prototype easier to develop. however, this is a feature I would like to follow up in future iterations of development.)
