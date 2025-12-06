# LTNG-Framework

## Documentation Index
- **[Component Library](ltng-components/README.md)**: UI components (Buttons, Forms, Modals).
- **[Testing Tools](ltng-testingtools/README.md)**: Go-style and Gherkin-style testing.
- **[Tooling & Utils](ltng-tools/README.md)**: Helpers for i18n, transport, random data.
- **[Component Book](ltng-book/README.md)**: Component development environment.
- **[Server & CLI](scripts/server/README.md)**: `ltng-server` usage (CSR, SSR, SSG).

A lightweight, vanilla JavaScript framework for modern web development. It focuses on simplicity, modularity, and understanding the core of web technologies without heavy abstractions.

## Core Features

The core framework (`ltng-framework.js`) provides essential utilities for building reactive applications:

- **Reactive Rendering**: Efficient DOM updates with `render()` and auto-hydration.
- **State Management**: Built-in global state store via `createStore(initialState, options)`.
- **Component System**: Function-based components with props and children.
- **DOM Utilities**:
    - `createElement(tag, props, ...children)`
    - `div`, `span`, `button`, etc. - Global aliases for common HTML tags.
    - `Body` alias for `document.body`.
    - `loadCSS(href)` helper.
    - `generateUUIDv7()` generator.
- **Built-in UI**: Simple `overlayModal` implementation.

## Ecosystem

The framework is composed of several modular sub-projects:

### [ltng-components](ltng-components/README.md)
A rich set of functional UI components (Buttons, Cards, Forms, etc.) ready to use.

### [ltng-tools](ltng-tools/README.md)
Utility libraries for:
- **Converter**: String/Object case conversion.
- **Internationalisation**: Simple dictionary-based i18n.
- **Random**: Random data generation.
- **Transport**: HTTP client wrapper.

### [ltng-testingtools](ltng-testingtools/README.md)
Dual-mode testing library supporting:
- **Go-style**: `gotest.Test("Name", t => ...)`
- **Gherkin-style**: `Feature`, `Scenario`, `Given/When/Then`.

### [ltng-book](ltng-book/README.md)
A component documentation and development tool (similar to Storybook).

### [ltng-server](scripts/server/README.md)
CLI tool for distribution and serving:
- **CSR**: Client-Side Rendering
- **SSR**: Server-Side Rendering
- **SSG**: Static Site Generation

## Quick Start

1. **Install dependencies** (if any, primarily pure JS).
2. **Run the Playground**:
   ```bash
   make playground-csr
   ```
   Or using the server script directly:
   ```bash
   node scripts/ltng-server.js --src=playground/001 --mode=csr --port=3000
   ```

## Development

### Project Structure
- `ltng-framework.js`: Core framework logic.
- `ltng-*/`: Sub-packages.
- `scripts/`: Build and server scripts.
- `playground/`: Example applications.
- `docs/`: Requirements and documentation.

---

## Meta / Prompting Strategy

For an efficient Artificial Inteligence Driven Project (AIDP) a good prompt is a must have.

I ususally come with the approach where I would write a very detailed (or at least as much as possible) .md file document with all the requirements, details and specifications for the project, and then, I'll elaborate a prompt to be used as a pre-prompt for the AI to understand the project and the requirements.

The current pre-prompts I have been using are the following:

```prompt
As a software engineer, I need help implement the new project requirements that are under docs/requirements/yy-mm-dd_xxx-requirements.md file. Let me know if you have any questions or if you would prefere to draw a proposal up first (for proposals docs/proposals/xxx-<proposal-title>.md).
```

```prompt
As a software enginner, I need help into developing the next feature for this project. The specifications, description and requirements are under docs/requirements/25-12-02_005-requirements.md file. Let me know if you have any questions or if you would prefere to draw a proposal up first (for proposals docs/proposals/xxx-<proposal-title>.md). 
```
