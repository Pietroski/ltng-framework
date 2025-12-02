# Components - Styling Refactor

We have come up with a new styling approach for the components library. We want to move away from the previous approach of using inline styles and instead use a more modern approach of using CSS modules.

We need to be able to use any of those approaches and be able to switch between them easily. 
We also need to be able to create CSS variables and global variables to minimise code repetition and to make it easier to maintain.

We need to be able to use css file approach and css-in-js approach. Css is prefered over css-in-js because ccs-in-js does not support very well pseudo selectors and media queries, for example, that's why we need css first approach, but also to keep and maintain the flexibility currently dispose to inject styles in the head of the document.

So... We are not removing the current style approach, we are just adding a new one, which is going to be better and based of CSS.

Also, All the current components need to be refactored to use the new styling approach, CSS.

This is going to be big, so let's break it down into smaller tasks and do it step by step. Ask me any time if necessary.
I'm going to use our ltng-book for validation of the components.

Let's start small and move carefully. I want to be able to review and validate every iteration carefully.
