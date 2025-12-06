# ltng-book

`ltng-book` is a tool for documenting and developing components in isolation, similar to Storybook.

## Overview

The `ltng-book` allows you to create "stories" for your components. Each story represents a specific state or variant of a component.

## Usage

### directory structure
Currently, the `ltng-book` logic is demonstrated in the `internal/ltng-book` directory. It uses a registry pattern to define stories.

### Creating Stories

Stories are defined using `registerStory`.

```javascript
import { registerStory } from './registry.mjs'; // Path to your registry
import { MyComponent } from './my-component.mjs';

registerStory('My Component', 'Description of the component', () => {
    return MyComponent({ someProp: 'value' });
});
```

### Running the Book

The book is typically an application (like `internal/ltng-book/app.mjs`) that:
1. Imports all stories.
2. Renders a sidebar with the list of stories.
3. Renders the selected story in a preview area.

See `internal/ltng-book` for a complete reference implementation.

## Example

Check `internal/ltng-book/stories` for example stories of standard components like Button, Card, Input, etc.
