# Proposal: Resolving Component Name Clashes

## Problem
Currently, `ltng-framework` exposes global element wrappers on the `window` object with Capitalized names (e.g., `window.Button`, `window.Footer`, `window.Div`).
Simultaneously, the component library (`pkg/components`) exports styled components with identical names (e.g., `Button`, `Footer`).

This creates a naming collision that:
1.  Confuses developers about which component is being used.
2.  Can lead to variable shadowing issues.
3.  Complicates imports and usage in the same file.

## Alternatives

### Option 1: Lowercase Framework Base Components (Recommended)
Change the global framework wrappers to use lowercase names, matching standard HTML tags.
*   `window.Button` -> `window.button`
*   `window.Div` -> `window.div`
*   `window.Footer` -> `window.footer`

**Pros:**
*   **Clear Distinction:** Lowercase for HTML primitives, Uppercase for Custom Components (matches React/JSX convention).
*   **Intuitive:** `div({})` feels like writing `<div>`.
*   **User Preference:** Aligns with the alternative suggested by the user.

**Cons:**
*   **Potential Variable Conflicts:** Local variables named `button` or `div` might shadow the globals (though `window.div` is always safe).

### Option 2: Namespace Framework Components
Move all framework wrappers under a specific namespace on `window`.
*   `window.Button` -> `window.UI.Button` or `window.Html.Button`

**Pros:**
*   **Clean Global Namespace:** Reduces pollution of the global scope.
*   **No Conflicts:** Unlikely to clash with local variables.

**Cons:**
*   **Verbosity:** Requires typing `UI.Div({})` or destructuring `const { Div } = UI`.

### Option 3: Prefix Library Components
Rename the components in `pkg/components` to have a prefix.
*   `Button` -> `LTNGButton`
*   `Footer` -> `LTNGFooter`

**Pros:**
*   **Explicit Origin:** Clear that the component comes from the LTNG library.

**Cons:**
*   **Verbosity:** usage becomes `LTNGButton({})`.
*   **Refactoring:** Requires renaming all existing library components and updating imports.

## Recommendation
We recommend **Option 1 (Lowercase Framework Base Components)**. This provides the best balance of developer experience and clarity, distinguishing clearly between "raw HTML wrappers" (lowercase) and "styled UI components" (uppercase).
