## Scenario 1

At the beginning of the conversation with the chatbot, the user mentions that the group is on very low budget or has ran out of budget and asks the chatbot to only suggest free tools. This is a very important message that holds information which the chatbot should keep in mind in all future interactions even as context space available becomes too low. The user would want the chatbot to remember this constraint so it does not suggest unuseable approaches to the problem.

Requirement from prototype: The user needs to be able to mark messages as important manually, regardless of how early the mssage was sent/generated.

## Scenario 2

There were more than one messages being marked as important and is therefore included in response generation, however the user would now like to remove one of these constraints as it is no longer a priority that must be considered. Both messages are currently marked as important and included, the user would like to remove one.

Requirement from prototype: The user needs to be able to unmark a message as important.

Note after consideration: However, this introduces an issue: if the user is able to remove a message from being important, this means they are also exposed to the possibility of accidentally removing something by misclicking, for example. Therefore the prototype needs to have an undo button that can undo accidental changes that the user might not have intended and therefore does not know how to revert.

## Scenario 3

Since the available space is not unlimited, the user cannot simply mark everything as important and included. This creates a conflict between the user’s priorities and the available capacity. Now, the system has reached the context budget, and therefore no new information can be marked as important to be included in context selection.

Requirement from prototype: This means that the user now needs to be immediately alerted that the context space has been filled or new information failed to be marked as important because it would exceed the budget. The reponse generation process and interaction will be paused until this issue is manually resolved by the user. Following this, the user needs to use the introduced method from scenario 2 to readjust which messages were marked as important.
