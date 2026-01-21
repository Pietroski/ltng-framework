# ltng-components

A rich set of functional UI components built for the `ltng-framework`.

## Installation

This package is part of the `ltng-framework` monorepo.

```javascript
import { 
    Button, 
    Card, 
    Div, FlexStyleOpts,
    Input, 
    Form, createFormStore,
    Modal, 
    Toast, toastStore,
    Typography,
    Footer
} from './path/to/ltng-components/index.mjs';
```

## Core Concepts

### 1. State Management
Components in `ltng-components` are generally **stateless**. The philosophy is that the parent (or developer) is responsible for:
- Creating the initial state using `createStore` or `createFormStore`
- Passing the state (or a store) to the component
- Handling updates via callbacks

### 2. Styling
Components accept a `style` prop which is a JavaScript object mapping CSS properties to values (camelCase keys).
```javascript
Button({ style: { marginTop: '10px', backgroundColor: 'red' } }, "Click Me")
```

---

## Table of Contents

1. [Button](#button-component)
2. [Container](#container-components)
3. [Card](#card-component)
4. [Input](#input-component)
5. [Form](#form-component)
6. [Modal](#modal-component)
7. [Toast](#toast-component)
8. [Typography](#typography-component)
9. [Footer](#footer-component)

---


# Button Component

A customizable button component with multiple variants for the ltng-framework.

## Import

```javascript
import { Button } from '../ltng-components/index.mjs'
// Or directly:
import { Button } from '../ltng-components/button/button.mjs'
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'primary' \| 'secondary'` | `'default'` | Visual style variant |
| `disabled` | `boolean` | `false` | Disables the button |
| `className` | `string` | `''` | Additional CSS classes |
| `style` | `object \| string` | — | Inline styles (JS object or CSS string) |
| `onClick` | `function` | — | Click event handler |
| `...rest` | — | — | Any valid `<button>` attributes |

---

## Basic Usage

```javascript
// Default button
Button({ onClick: () => console.log('Clicked') }, 'Click Me')

// Primary button (recommended for main actions)
Button.Primary({ onClick: handleSubmit }, 'Save Changes')

// Secondary button (for alternative actions)
Button.Secondary({ onClick: handleCancel }, 'Cancel')
```

---

## Variants

### Default
Standard button with minimal styling:
```javascript
Button({}, 'Default Button')
```

### Primary
For main call-to-action buttons:
```javascript
Button.Primary({ onClick: () => save() }, 'Submit')
// Equivalent to:
Button({ variant: 'primary', onClick: () => save() }, 'Submit')
```

### Secondary
For secondary actions with outlined style:
```javascript
Button.Secondary({ onClick: () => cancel() }, 'Cancel')
// Equivalent to:
Button({ variant: 'secondary', onClick: () => cancel() }, 'Cancel')
```

---

## Disabled State

```javascript
Button.Primary({ disabled: true }, 'Cannot Click')

// Dynamically disabled
const isProcessing = true
Button.Primary({ 
    disabled: isProcessing,
    onClick: handleSubmit 
}, isProcessing ? 'Processing...' : 'Submit')
```

---

## Custom Styling

### Inline Styles (JavaScript Object)
```javascript
Button.Primary({
    style: { 
        marginTop: '20px', 
        width: '100%',
        fontSize: '18px'
    },
    onClick: handleClick
}, 'Full Width Button')
```

### Additional CSS Classes
```javascript
Button.Primary({
    className: 'my-custom-class large-button',
    onClick: handleClick
}, 'Custom Styled')
```

---

## State Integration

Use with `createStore` for reactive button states:

### Reactive Disabled State
```javascript
import { createStore } from '../ltng-framework.js'
import { Button } from '../ltng-components/index.mjs'

const store = createStore({ isLoading: false })

// Subscribe to re-render on state change
const renderButton = () => {
    const { isLoading } = store.getState()
    
    return Button.Primary({
        disabled: isLoading,
        onClick: async () => {
            store.setState({ isLoading: true })
            await performAction()
            store.setState({ isLoading: false })
        }
    }, isLoading ? 'Loading...' : 'Submit')
}

// Re-render when isLoading changes
store.subscribe(() => {
    const container = document.getElementById('button-container')
    container.innerHTML = ''
    container.appendChild(renderButton())
}, ['isLoading'])
```

### Counter Example
```javascript
const counterStore = createStore({ count: 0 })

const CounterButton = () => Button.Primary({
    onClick: () => {
        const { count } = counterStore.getState()
        counterStore.setState({ count: count + 1 })
    }
}, `Clicked: ${counterStore.getState().count} times`)
```

---

## Accessibility

The Button component renders a semantic `<button>` element, providing:

- **Keyboard navigation**: Focusable and activatable with Enter/Space
- **Screen readers**: Properly announced as a button
- **Disabled state**: Uses native `disabled` attribute (not just styling)
- **Focus states**: Built-in focus outline via browser defaults

### Best Practices
```javascript
// ✅ Good: Clear, action-oriented text
Button.Primary({ onClick: save }, 'Save Document')

// ❌ Avoid: Generic text
Button.Primary({ onClick: save }, 'Click Here')
```

---

## Best Practices

| Scenario | Recommended Variant |
|----------|---------------------|
| Submit form / Primary action | `Button.Primary` |
| Cancel / Secondary action | `Button.Secondary` |
| Destructive action | `Button` with custom red styling |
| Tertiary / Less important | `Button` (default) |

### Loading Pattern
```javascript
Button.Primary({
    disabled: isLoading,
    onClick: handleSubmit
}, isLoading ? 'Saving...' : 'Save')
```

### Button with Icon (Pattern)
```javascript
Button.Primary({ onClick: handleAdd },
    span({ style: { marginRight: '8px' } }, '+'),
    'Add Item'
)
```

---

## CSS Variables

The Button component uses these theme variables from `theme.css`:

| Variable | Purpose |
|----------|---------|
| `--ltng-color-primary` | Primary button background |
| `--ltng-color-primary-hover` | Primary button hover state |
| `--ltng-color-disabled` | Disabled button background |
| `--ltng-color-white` | Button text color (primary/disabled) |
| `--ltng-border-radius` | Button corner radius |
| `--ltng-font-size-md` | Button font size |

Override these in your CSS to customize all buttons globally.


---

# Container Components

Layout container components for building flexible page structures in the ltng-framework.

## Import

```javascript
import { Div, FlexStyleOpts } from '../ltng-components/index.mjs'
// Or directly:
import { Div, FlexStyleOpts } from '../ltng-components/container/containers.mjs'
```

## Components

| Component | Description |
|-----------|-------------|
| `Div` | Basic block container (`display: block`) |
| `Div.Flex` | Flex container (`display: flex`) |
| `Div.Grid` | Grid container (`display: grid`) |

---

## Props Reference

All container components share these props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `''` | Additional CSS classes |
| `style` | `object \| string` | — | Inline styles (JS object or CSS string) |
| `...rest` | — | — | Any valid `<div>` attributes |

---

## Basic Usage

### Div (Block Container)
```javascript
Div({ style: { padding: '20px' } },
    p({}, 'Content inside a block container')
)
```

### Div.Flex (Flexbox Container)
```javascript
Div.Flex({ 
    style: { justifyContent: 'space-between', alignItems: 'center' } 
},
    span({}, 'Left'),
    span({}, 'Right')
)
```

### Div.Grid (Grid Container)
```javascript
Div.Grid({ 
    style: { 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '16px' 
    } 
},
    Div({}, 'Cell 1'),
    Div({}, 'Cell 2'),
    Div({}, 'Cell 3')
)
```

---

## FlexStyleOpts Helper

The `FlexStyleOpts` object provides pre-defined style objects for common flexbox properties. Use these to avoid typos and improve readability.

### Available Options

#### `FlexStyleOpts.FD` (Flex Direction)
| Option | Value |
|--------|-------|
| `FD.Row` | `{ flexDirection: 'row' }` |
| `FD.Column` | `{ flexDirection: 'column' }` |
| `FD.RowReverse` | `{ flexDirection: 'row-reverse' }` |
| `FD.ColumnReverse` | `{ flexDirection: 'column-reverse' }` |

#### `FlexStyleOpts.JC` (Justify Content)
| Option | Value |
|--------|-------|
| `JC.Center` | `{ justifyContent: 'center' }` |
| `JC.FlexStart` | `{ justifyContent: 'flex-start' }` |
| `JC.FlexEnd` | `{ justifyContent: 'flex-end' }` |
| `JC.SpaceAround` | `{ justifyContent: 'space-around' }` |
| `JC.SpaceBetween` | `{ justifyContent: 'space-between' }` |
| `JC.SpaceEvenly` | `{ justifyContent: 'space-evenly' }` |

#### `FlexStyleOpts.AC` (Align Content)
| Option | Value |
|--------|-------|
| `AC.Center` | `{ alignContent: 'center' }` |
| `AC.FlexStart` | `{ alignContent: 'flex-start' }` |
| `AC.FlexEnd` | `{ alignContent: 'flex-end' }` |
| `AC.Stretch` | `{ alignContent: 'stretch' }` |
| `AC.SpaceAround` | `{ alignContent: 'space-around' }` |
| `AC.SpaceBetween` | `{ alignContent: 'space-between' }` |

#### `FlexStyleOpts.AI` (Align Items)
| Option | Value |
|--------|-------|
| `AI.Center` | `{ alignItems: 'center' }` |
| `AI.FlexStart` | `{ alignItems: 'flex-start' }` |
| `AI.FlexEnd` | `{ alignItems: 'flex-end' }` |
| `AI.Stretch` | `{ alignItems: 'stretch' }` |

### Using FlexStyleOpts

Spread the options into your style object:

```javascript
const { FD, JC, AI } = FlexStyleOpts

// Centered column layout
Div.Flex({
    style: {
        ...FD.Column,
        ...JC.Center,
        ...AI.Center,
        height: '100vh'
    }
},
    h1({}, 'Centered Content')
)

// Horizontal navbar with space-between
Div.Flex({
    style: {
        ...FD.Row,
        ...JC.SpaceBetween,
        ...AI.Center,
        padding: '16px'
    }
},
    span({}, 'Logo'),
    nav({}, 'Menu Items')
)
```

---

## Layout Patterns

### Centered Content
```javascript
const { JC, AI } = FlexStyleOpts

Div.Flex({
    style: {
        ...JC.Center,
        ...AI.Center,
        minHeight: '100vh'
    }
},
    Card({}, 'Centered card content')
)
```

### Sidebar Layout
```javascript
Div.Flex({ style: { height: '100vh' } },
    Div({ style: { width: '250px', background: '#f0f0f0' } },
        'Sidebar'
    ),
    Div({ style: { flex: 1 } },
        'Main content'
    )
)
```

### Responsive Grid
```javascript
Div.Grid({
    style: {
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        padding: '24px'
    }
},
    Card({}, 'Card 1'),
    Card({}, 'Card 2'),
    Card({}, 'Card 3'),
    Card({}, 'Card 4')
)
```

### Header-Content-Footer
```javascript
const { FD, JC } = FlexStyleOpts

Div.Flex({
    style: {
        ...FD.Column,
        minHeight: '100vh'
    }
},
    header({ style: { padding: '16px' } }, 'Header'),
    Div({ style: { flex: 1 } }, 'Content'),
    footer({ style: { padding: '16px' } }, 'Footer')
)
```

---

## State Integration

### Toggle Layout Direction
```javascript
import { createStore } from '../ltng-framework.js'
import { Div, FlexStyleOpts } from '../ltng-components/index.mjs'

const { FD } = FlexStyleOpts
const store = createStore({ isVertical: false })

const renderLayout = () => {
    const { isVertical } = store.getState()
    
    return Div.Flex({
        style: isVertical ? FD.Column : FD.Row
    },
        Button({ onClick: () => store.setState({ isVertical: !isVertical }) },
            'Toggle Layout'
        ),
        Div({}, 'Content A'),
        Div({}, 'Content B')
    )
}

store.subscribe(() => {
    document.getElementById('app').replaceChildren(renderLayout())
}, ['isVertical'])
```

---

## Best Practices

| Scenario | Recommended |
|----------|-------------|
| Basic wrapper | `Div` |
| Row/column layouts | `Div.Flex` with `FlexStyleOpts` |
| Card grids, galleries | `Div.Grid` |
| Complex alignment | `Div.Flex` + multiple `FlexStyleOpts` |

### Tips
- Use `FlexStyleOpts` for consistency and to avoid typos
- Combine multiple options with spread: `{ ...FD.Row, ...JC.Center }`
- All containers default to `width: 100%` and `height: 100%`
- Add `box-sizing: border-box` is already applied

---

## CSS Classes

| Class | Applied By | Effect |
|-------|------------|--------|
| `ltng-container` | All | `width: 100%`, `height: 100%`, `box-sizing: border-box` |
| `ltng-container--flex` | `Div.Flex` | `display: flex` |
| `ltng-container--grid` | `Div.Grid` | `display: grid` |


---

# Card Component

A container component with visual styling for grouping related content, with optional close functionality and theme support.

## Import

```javascript
import { Card } from '../ltng-components/index.mjs'
// Or directly:
import { Card } from '../ltng-components/card/card.mjs'
```

## Components

| Component | Description |
|-----------|-------------|
| `Card` | Basic styled card container |
| `Card.Closable` | Card with close button (controlled by parent) |
| `Card.SelfClosable` | Card that removes itself when closed |

---

## Props Reference

### Card
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `darkMode` | `boolean` | `true` | Enable dark theme styling |
| `className` | `string` | `''` | Additional CSS classes |
| `style` | `object \| string` | — | Inline styles (JS object or CSS string) |
| `...rest` | — | — | Any valid `<div>` attributes |

### Card.Closable
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onCloseClick` | `function` | — | Handler called when close button is clicked |
| `closeBtnStyle` | `object \| string` | — | Custom styles for the close button |
| All `Card` props | — | — | Inherits all Card props |

### Card.SelfClosable
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onCloseClick` | `function` | — | Optional callback after card removes itself |
| All `Card` props | — | — | Inherits all Card props |

---

## Basic Usage

### Simple Card
```javascript
Card({},
    Typography.H3({}, 'Card Title'),
    Typography.Paragraph({}, 'Card content goes here.')
)
```

### Light Mode Card
```javascript
Card({ darkMode: false },
    Typography.H3({}, 'Light Card'),
    Typography.Paragraph({}, 'Using light theme.')
)
```

### Custom Sized Card
```javascript
Card({
    style: {
        width: '400px',
        height: '250px'
    }
},
    Typography.H3({}, 'Large Card'),
    Typography.Paragraph({}, 'Custom dimensions.')
)
```

---

## Closable Cards

### Card.Closable (Controlled)
Use when the parent component controls visibility:

```javascript
import { createStore } from '../ltng-framework.js'
import { Card, Button } from '../ltng-components/index.mjs'

const store = createStore({ showCard: true })

const App = () => {
    const { showCard } = store.getState()
    
    return Div({},
        showCard 
            ? Card.Closable({
                onCloseClick: () => store.setState({ showCard: false })
              },
                Typography.H3({}, 'Dismissable Card'),
                Typography.Paragraph({}, 'Click X to close')
              )
            : null,
        
        !showCard 
            ? Button({ onClick: () => store.setState({ showCard: true }) }, 
                'Show Card'
              ) 
            : null
    )
}
```

### Card.SelfClosable (Self-Managed)
Use when the card should remove itself from the DOM:

```javascript
Card.SelfClosable({
    onCloseClick: () => console.log('Card was closed')
},
    Typography.H3({}, 'Self-Closing Card'),
    Typography.Paragraph({}, 'Removes itself when closed')
)
```

---

## Theme Modes

### Dark Mode (Default)
```javascript
Card({ darkMode: true },  // or just Card({})
    Typography.H3({}, 'Dark Card')
)
```
- Background: `#333`
- Text: `white`

### Light Mode
```javascript
Card({ darkMode: false },
    Typography.H3({}, 'Light Card')
)
```
- Background: `whitesmoke`
- Text: `black`

---

## Custom Styling

### Override Dimensions
```javascript
Card({
    style: {
        width: '100%',
        maxWidth: '500px',
        height: 'auto',
        padding: '24px'
    }
},
    // Content
)
```

### Custom Close Button Style
```javascript
Card.Closable({
    closeBtnStyle: {
        backgroundColor: 'red',
        color: 'white'
    },
    onCloseClick: handleClose
},
    'Content'
)
```

### Additional Classes
```javascript
Card({ className: 'my-custom-card elevated' },
    'Content'
)
```

---

## Layout Patterns

### Card Grid
```javascript
Div.Grid({
    style: {
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px'
    }
},
    Card({}, Typography.H3({}, 'Card 1')),
    Card({}, Typography.H3({}, 'Card 2')),
    Card({}, Typography.H3({}, 'Card 3'))
)
```

### Feature Cards
```javascript
Card({
    style: {
        width: '300px',
        height: 'auto',
        padding: '20px',
        textAlign: 'center'
    }
},
    span({ style: { fontSize: '48px' } }, '🚀'),
    Typography.H3({}, 'Feature Title'),
    Typography.Paragraph({}, 'Feature description text goes here.'),
    Button.Primary({}, 'Learn More')
)
```

### Notification Card
```javascript
Card.SelfClosable({
    darkMode: false,
    style: {
        position: 'fixed',
        top: '16px',
        right: '16px',
        width: '300px',
        height: 'auto',
        padding: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }
},
    Typography.H4({}, 'New Message'),
    Typography.Paragraph({}, 'You have a new notification.')
)
```

---

## State Integration

### Toggle Card Visibility
```javascript
import { createStore } from '../ltng-framework.js'

const store = createStore({ isVisible: true })

const renderCard = () => {
    const { isVisible } = store.getState()
    if (!isVisible) return null
    
    return Card.Closable({
        onCloseClick: () => store.setState({ isVisible: false })
    },
        Typography.H3({}, 'Reactive Card'),
        Typography.Paragraph({}, 'Uses createStore for visibility')
    )
}

store.subscribe(() => {
    const container = document.getElementById('card-container')
    container.innerHTML = ''
    const card = renderCard()
    if (card) container.appendChild(card)
}, ['isVisible'])
```

### Dynamic Theme Toggle
```javascript
const store = createStore({ isDark: true })

const renderThemedCard = () => {
    const { isDark } = store.getState()
    
    return Card({ darkMode: isDark },
        Typography.H3({}, 'Themed Card'),
        Button({ onClick: () => store.setState({ isDark: !isDark }) },
            'Toggle Theme'
        )
    )
}
```

---

## Best Practices

| Scenario | Recommended |
|----------|-------------|
| Permanent content card | `Card` |
| Modal-like dismissable | `Card.Closable` with state |
| Temporary notification | `Card.SelfClosable` |
| Dark UI / dashboard | `darkMode: true` (default) |
| Light UI / forms | `darkMode: false` |

### Tips
- Default size is `250px × 150px` — override with `style` for different sizes
- Cards use `display: flex` with `flex-direction: column` — content is centered by default
- For full-width cards, use `style: { width: '100%' }`
- Use `Card.SelfClosable` only for truly ephemeral content (it removes from DOM)

---

## CSS Classes

| Class | Applied By | Effect |
|-------|------------|--------|
| `ltng-card` | All | Base card styles, flex layout, border |
| `ltng-card--dark` | `darkMode: true` | Dark background, white text |
| `ltng-card--light` | `darkMode: false` | Light background, black text |
| `ltng-card-close-btn` | Closable variants | Close button positioning |

---

## CSS Variables Used

| Variable | Purpose |
|----------|---------|
| `--ltng-color-primary` | Border color |


---

# Input Component

Text input field with floating label, dark/light theme support, and password visibility toggle for the ltng-framework.

## Import

```javascript
import { Input } from '../ltng-components/index.mjs'
// Or directly:
import { Input } from '../ltng-components/input/input.mjs'
```

## Components

| Component | Description |
|-----------|-------------|
| `Input` | Standard text input with floating label |
| `Input.Secret` | Password input with show/hide toggle |

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | auto-generated | Input element ID |
| `placeholder` | `string` | `''` | Floating label text |
| `type` | `string` | `'text'` | Input type (text, email, number, etc.) |
| `isSecret` | `boolean` | `false` | Enable password mode with toggle |
| `darkMode` | `boolean` | `true` | Enable dark theme styling |
| `value` | `string` | `''` | Controlled input value |
| `onChange` | `function` | — | Called on input change (receives event) |
| `onFocus` | `function` | — | Called when input gains focus |
| `onBlur` | `function` | — | Called when input loses focus |
| `className` | `string` | `''` | Additional CSS classes for wrapper |
| `style` | `object \| string` | — | Inline styles for wrapper |
| `...rest` | — | — | Any valid `<input>` attributes |

---

## Basic Usage

### Simple Input
```javascript
Input({
    placeholder: 'Enter your name',
    onChange: (e) => console.log(e.target.value)
})
```

### Password Input
```javascript
Input.Secret({
    placeholder: 'Password',
    onChange: (e) => console.log(e.target.value)
})
// Equivalent to:
Input({
    placeholder: 'Password',
    isSecret: true,
    onChange: (e) => console.log(e.target.value)
})
```

### Light Mode
```javascript
Input({
    placeholder: 'Email address',
    type: 'email',
    darkMode: false
})
```

---

## State Management

> **Important**: Managing input values with `createStore` is crucial for building reactive forms in ltng-framework.

### Basic Controlled Input

```javascript
import { createStore } from '../ltng-framework.js'
import { Input, Button } from '../ltng-components/index.mjs'

// 1. Create store with form state
const store = createStore({
    username: ''
})

// 2. Render input bound to store
const renderInput = () => {
    return Input({
        placeholder: 'Username',
        value: store.getState().username,
        onChange: (e) => store.setState({ username: e.target.value })
    })
}

// 3. Subscribe to re-render on change
store.subscribe(() => {
    const container = document.getElementById('input-container')
    container.innerHTML = ''
    container.appendChild(renderInput())
}, ['username'])
```

### Multiple Inputs with Single Store

```javascript
const formStore = createStore({
    firstName: '',
    lastName: '',
    email: ''
})

const renderForm = () => {
    const state = formStore.getState()
    
    return Div.Flex({ style: { flexDirection: 'column', gap: '16px' } },
        Input({
            placeholder: 'First Name',
            value: state.firstName,
            onChange: (e) => formStore.setState({ firstName: e.target.value })
        }),
        Input({
            placeholder: 'Last Name',
            value: state.lastName,
            onChange: (e) => formStore.setState({ lastName: e.target.value })
        }),
        Input({
            placeholder: 'Email',
            type: 'email',
            value: state.email,
            onChange: (e) => formStore.setState({ email: e.target.value })
        })
    )
}

// Subscribe to all form fields
formStore.subscribe(() => {
    document.getElementById('form').replaceChildren(renderForm())
}, ['firstName', 'lastName', 'email'])
```

### Login Form with Validation

```javascript
const loginStore = createStore({
    email: '',
    password: '',
    errors: {}
})

// Validate on field change
loginStore.subscribe(({ email, password }) => {
    const errors = {}
    if (email && !email.includes('@')) {
        errors.email = 'Invalid email address'
    }
    if (password && password.length < 8) {
        errors.password = 'Password must be at least 8 characters'
    }
    loginStore.setState({ errors })
}, ['email', 'password'])

const renderLoginForm = () => {
    const { email, password, errors } = loginStore.getState()
    
    return Div.Flex({ style: { flexDirection: 'column', gap: '16px', maxWidth: '400px' } },
        // Email Input
        Div({},
            Input({
                placeholder: 'Email',
                type: 'email',
                value: email,
                onChange: (e) => loginStore.setState({ email: e.target.value })
            }),
            errors.email 
                ? Typography.Paragraph({ style: { color: 'red', marginTop: '4px' } }, errors.email)
                : null
        ),
        
        // Password Input
        Div({},
            Input.Secret({
                placeholder: 'Password',
                value: password,
                onChange: (e) => loginStore.setState({ password: e.target.value })
            }),
            errors.password
                ? Typography.Paragraph({ style: { color: 'red', marginTop: '4px' } }, errors.password)
                : null
        ),
        
        // Submit Button
        Button.Primary({
            disabled: Object.keys(errors).length > 0 || !email || !password,
            onClick: () => handleLogin(email, password)
        }, 'Sign In')
    )
}

// Re-render on any change
loginStore.subscribe(() => {
    document.getElementById('login-form').replaceChildren(renderLoginForm())
})
```

### Persisted Form State

```javascript
// Persist form data across page reloads
const formStore = createStore(
    { searchQuery: '', filter: 'all' },
    { persist: 'searchFormState' }  // Saves to localStorage
)

const renderSearchInput = () => {
    return Input({
        placeholder: 'Search...',
        value: formStore.getState().searchQuery,
        onChange: (e) => formStore.setState({ searchQuery: e.target.value })
    })
}

// Value survives page refresh!
```

### Debounced Search Input

```javascript
const searchStore = createStore({ query: '', results: [] })

let debounceTimer = null

const handleSearch = (value) => {
    searchStore.setState({ query: value })
    
    // Debounce API calls
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(async () => {
        const results = await fetchSearchResults(value)
        searchStore.setState({ results })
    }, 300)
}

const renderSearchInput = () => {
    return Input({
        placeholder: 'Search products...',
        value: searchStore.getState().query,
        onChange: (e) => handleSearch(e.target.value)
    })
}
```

---

## Focus and Blur Events

```javascript
const store = createStore({ isFocused: false })

Input({
    placeholder: 'Focus me',
    onFocus: () => store.setState({ isFocused: true }),
    onBlur: () => store.setState({ isFocused: false })
})

// React to focus state
store.subscribe(({ isFocused }) => {
    const hint = document.getElementById('hint')
    hint.style.display = isFocused ? 'block' : 'none'
}, ['isFocused'])
```

---

## Reactive Helpers with Inputs

### Using `reactive()` for Display

```javascript
import { reactive, createStore } from '../ltng-framework.js'

const store = createStore({ name: '' })

Div({},
    Input({
        placeholder: 'Your name',
        onChange: (e) => store.setState({ name: e.target.value })
    }),
    p({}, 'Hello, ', reactive(store, 'name'), '!')  // Auto-updates
)
```

### Using `reactiveElement()` for Complex Updates

```javascript
const store = createStore({ items: [] })

Div({},
    Input({
        placeholder: 'Add item and press Enter',
        onKeyDown: (e) => {
            if (e.key === 'Enter' && e.target.value) {
                const items = [...store.getState().items, e.target.value]
                store.setState({ items })
                e.target.value = ''
            }
        }
    }),
    reactiveElement(store, 'items', (items) =>
        ul({}, ...items.map(item => li({}, item)))
    )
)
```

---

## Theme Modes

### Dark Mode (Default)
```javascript
Input({ placeholder: 'Dark input', darkMode: true })
```
- Wrapper/Field background: `#333`
- Text: `white`

### Light Mode
```javascript
Input({ placeholder: 'Light input', darkMode: false })
```
- Wrapper/Field background: `whitesmoke`
- Text: `black`

---

## Input Types

```javascript
// Text (default)
Input({ placeholder: 'Name', type: 'text' })

// Email
Input({ placeholder: 'Email', type: 'email' })

// Number
Input({ placeholder: 'Age', type: 'number', min: 0, max: 120 })

// Password (use Input.Secret for toggle)
Input.Secret({ placeholder: 'Password' })

// Other HTML5 types work too
Input({ placeholder: 'Search', type: 'search' })
Input({ placeholder: 'Phone', type: 'tel' })
Input({ placeholder: 'Website', type: 'url' })
```

---

## Best Practices

### Do's ✅

| Practice | Example |
|----------|---------|
| Always use `createStore` for form state | `const store = createStore({ field: '' })` |
| Bind `value` to store state | `value: store.getState().field` |
| Update store in `onChange` | `onChange: (e) => store.setState({ field: e.target.value })` |
| Subscribe with specific keys | `store.subscribe(fn, ['field1', 'field2'])` |
| Use `persist` for important forms | `createStore({}, { persist: 'formKey' })` |

### Don'ts ❌

| Avoid | Why |
|-------|-----|
| Uncontrolled inputs | State becomes hard to track and share |
| Global mutable variables | Use `createStore` instead |
| Subscribing without keys | Causes unnecessary re-renders |
| Modifying DOM directly | Breaks reactivity model |

### Form Pattern Summary

```javascript
// 1. Create store
const store = createStore({ fieldName: '' })

// 2. Render with binding
const render = () => Input({
    placeholder: 'Label',
    value: store.getState().fieldName,
    onChange: (e) => store.setState({ fieldName: e.target.value })
})

// 3. Subscribe for re-render
store.subscribe(render, ['fieldName'])
```

---

## CSS Classes

| Class | Applied To | Effect |
|-------|------------|--------|
| `ltng-input-wrapper` | Container div | Border, padding, layout |
| `ltng-input-wrapper--dark/light` | Container | Theme colors |
| `ltng-input-label` | Floating label | Positioned above input |
| `ltng-input-label--dark/light` | Label | Theme colors |
| `ltng-input-field` | Input element | Styling, sizing |
| `ltng-input-field--dark/light` | Input | Theme colors |
| `ltng-input-field--secret` | Password input | Narrower for toggle button |
| `ltng-input-secret-toggle` | Show/Hide button | Positioned inside input |

---

## CSS Variables Used

| Variable | Purpose |
|----------|---------|
| `--ltng-color-primary` | Border color |

---

## Accessibility

- **Labels**: Floating label is associated via `for` attribute
- **Keyboard**: Standard input keyboard navigation works
- **Password toggle**: Clickable show/hide without losing focus
- **IDs**: Auto-generated unique IDs prevent conflicts

### Tip: Add aria-label for screen readers
```javascript
Input({
    placeholder: 'Email',
    'aria-label': 'Email address',
    'aria-required': 'true'
})
```


---

# Form Component

A complete form system with dedicated store management, field validation, auto-disabling submit button, and reset functionality for the ltng-framework.

## Import

```javascript
import { Form, createFormStore } from '../ltng-components/index.mjs'
// Or directly:
import { Form, createFormStore } from '../ltng-components/form/form.mjs'
```

## Components

| Component | Description |
|-----------|-------------|
| `createFormStore` | Creates a dedicated form state store |
| `Form` | Form container that handles submission |
| `Form.Field` | Input field bound to form store |
| `Form.FieldSecret` | Password field bound to form store |
| `Form.PrimaryButton` | Submit button with auto-disable on invalid |
| `Form.SecondaryButton` | Reset button that clears form state |

---

## Core Concept: Form Store

> **The form store is the central concept**. All form components receive the same `store` prop and automatically stay in sync.

```javascript
// 1. Create the store
const store = createFormStore({
    // Define your fields
    username: { id: 'username', value: '', required: true },
    email: { id: 'email', value: '', required: true },
    password: { id: 'password', value: '', required: true }
}, {
    darkMode: false  // Optional config passed to all fields
})

// 2. Pass store to all form components
Form({ store, onSubmit: handleSubmit },
    Form.Field({ store, fieldKey: 'username', label: 'Username' }),
    Form.Field({ store, fieldKey: 'email', label: 'Email' }),
    Form.FieldSecret({ store, fieldKey: 'password', label: 'Password' }),
    Form.PrimaryButton({ store }, 'Submit')
)
```

---

## createFormStore API

### Syntax
```javascript
const store = createFormStore(initialState, config)
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `initialState` | `object` | Initial field states (see Field State Format below) |
| `config` | `object` | Optional configuration (e.g., `{ darkMode: false }`) |

### Field State Format

Each field in `initialState` should follow this structure:

```javascript
{
    id: 'fieldKey',      // Must match the key name
    value: '',           // Current value (string)
    required: true,      // Whether field is required
    errValue: null       // Error object or null
}
```

### Store Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `getState()` | `object` | Get entire form state |
| `setState(partial)` | `void` | Update state (partial merge) |
| `subscribe(listener)` | `unsubscribe fn` | Listen to state changes |
| `GetFormState()` | `object` | Alias for getState() |
| `GetFormItemStateByKey(key)` | `object` | Get single field state |
| `SetFormItemState(item)` | `void` | Update single field |
| `ResetFormState()` | `void` | Reset to initial state |
| `config` | `object` | Access config options |

### Store Methods Examples

```javascript
const store = createFormStore({
    email: { id: 'email', value: '', required: true }
})

// Get all form data
const formData = store.GetFormState()
// { email: { id: 'email', value: '', required: true, errValue: null } }

// Get single field
const emailField = store.GetFormItemStateByKey('email')
// { id: 'email', value: '', required: true, errValue: null }

// Update a field
store.SetFormItemState({
    id: 'email',
    value: 'user@example.com',
    errValue: null
})

// Reset form
store.ResetFormState()

// Subscribe to changes
const unsubscribe = store.subscribe((state) => {
    console.log('Form changed:', state)
})
```

---

## Props Reference

### Form
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `store` | `FormStore` | Yes | Form store created by `createFormStore` |
| `onSubmit` | `function` | No | Handler called on submit (receives `{ formObject, ...event }`) |
| `className` | `string` | No | Additional CSS classes |
| `style` | `object \| string` | No | Inline styles |

### Form.Field / Form.FieldSecret
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `store` | `FormStore` | Yes | Form store reference |
| `fieldKey` | `string` | Yes | Key matching `initialState` |
| `label` | `string` | No | Floating label text |
| `validation` | `function` | No | Validation fn: `({ value }) => Error | null` |
| `isRequired` | `boolean` | No | Mark field as required |
| `darkMode` | `boolean` | No | Override store's darkMode config |
| `style` | `object \| string` | No | Inline styles |

### Form.PrimaryButton
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `store` | `FormStore` | Yes | Auto-disables when form invalid |
| `disabled` | `boolean` | No | Force disabled state |
| All Button.Primary props | — | — | Passed through |

### Form.SecondaryButton
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `store` | `FormStore` | Yes | Calls `ResetFormState()` on click |
| `onClick` | `function` | No | Additional click handler |
| All Button.Secondary props | — | — | Passed through |

---

## Complete Examples

### Basic Login Form

```javascript
import { Form, createFormStore, Div } from '../ltng-components/index.mjs'

// 1. Create store with field definitions
const loginStore = createFormStore({
    email: { id: 'email', value: '', required: true },
    password: { id: 'password', value: '', required: true }
}, { darkMode: false })

// 2. Handle form submission
const handleLogin = (e) => {
    const { formObject } = e
    console.log('Submitting:', {
        email: formObject.email.value,
        password: formObject.password.value
    })
    // Call your API here
}

// 3. Render form
const LoginForm = () => Form({
    store: loginStore,
    style: { maxWidth: '400px', padding: '20px' },
    onSubmit: handleLogin
},
    Form.Field({
        store: loginStore,
        fieldKey: 'email',
        label: 'Email Address',
        isRequired: true
    }),
    Form.FieldSecret({
        store: loginStore,
        fieldKey: 'password',
        label: 'Password',
        isRequired: true
    }),
    Div.Flex({ style: { justifyContent: 'space-between', marginTop: '16px' } },
        Form.SecondaryButton({ store: loginStore }, 'Clear'),
        Form.PrimaryButton({ store: loginStore }, 'Sign In')
    )
)
```

### Form with Custom Validation

```javascript
const registrationStore = createFormStore({
    username: { id: 'username', value: '', required: true },
    email: { id: 'email', value: '', required: true },
    password: { id: 'password', value: '', required: true },
    confirmPassword: { id: 'confirmPassword', value: '', required: true }
})

const RegistrationForm = () => Form({
    store: registrationStore,
    onSubmit: (e) => console.log('Registration:', e.formObject)
},
    // Username: min 3 characters
    Form.Field({
        store: registrationStore,
        fieldKey: 'username',
        label: 'Username',
        isRequired: true,
        validation: ({ value }) => {
            if (value.length < 3) {
                return new Error('Username must be at least 3 characters')
            }
            return null
        }
    }),
    
    // Email: must contain @
    Form.Field({
        store: registrationStore,
        fieldKey: 'email',
        label: 'Email',
        isRequired: true,
        validation: ({ value }) => {
            if (!value.includes('@')) {
                return new Error('Please enter a valid email')
            }
            return null
        }
    }),
    
    // Password: min 8 characters
    Form.FieldSecret({
        store: registrationStore,
        fieldKey: 'password',
        label: 'Password',
        isRequired: true,
        validation: ({ value }) => {
            if (value.length < 8) {
                return new Error('Password must be at least 8 characters')
            }
            return null
        }
    }),
    
    // Confirm Password: must match
    Form.FieldSecret({
        store: registrationStore,
        fieldKey: 'confirmPassword',
        label: 'Confirm Password',
        isRequired: true,
        validation: ({ value }) => {
            const password = registrationStore.GetFormItemStateByKey('password')?.value
            if (value !== password) {
                return new Error('Passwords do not match')
            }
            return null
        }
    }),
    
    Form.PrimaryButton({ store: registrationStore }, 'Create Account')
)
```

### Dark Mode Form

```javascript
const darkStore = createFormStore({
    search: { id: 'search', value: '' }
}, { darkMode: true })  // Config applies to all fields

const DarkForm = () => Form({ store: darkStore },
    Form.Field({
        store: darkStore,
        fieldKey: 'search',
        label: 'Search'
        // darkMode inherited from store.config
    }),
    Form.PrimaryButton({ store: darkStore }, 'Search')
)
```

### Override Dark Mode Per Field

```javascript
const mixedStore = createFormStore({
    field1: { id: 'field1', value: '' },
    field2: { id: 'field2', value: '' }
}, { darkMode: true })

Form({ store: mixedStore },
    // Uses store's darkMode (true)
    Form.Field({ store: mixedStore, fieldKey: 'field1', label: 'Dark Field' }),
    
    // Override to light mode
    Form.Field({ store: mixedStore, fieldKey: 'field2', label: 'Light Field', darkMode: false })
)
```

---

## How Auto-Features Work

### Auto-Disable Submit Button

`Form.PrimaryButton` automatically subscribes to the store and disables itself when:
- Any required field is empty
- Any field has a validation error (`errValue` is not null)

```javascript
// Button disabled when:
// 1. Required field has no value
// 2. Any field has errValue (validation error)
Form.PrimaryButton({ store }, 'Submit')
```

### Auto-Reset with SecondaryButton

`Form.SecondaryButton` calls `store.ResetFormState()` when clicked:

```javascript
// Resets all fields to initial values
Form.SecondaryButton({ store }, 'Clear Form')

// With additional handler
Form.SecondaryButton({
    store,
    onClick: () => console.log('Form was reset')
}, 'Reset')
```

### Auto-Error Display

`Form.Field` automatically shows validation errors below the input:

```javascript
Form.Field({
    store,
    fieldKey: 'email',
    label: 'Email',
    validation: ({ value }) => {
        if (!value.includes('@')) {
            return new Error('Invalid email')  // Message shown below input
        }
        return null  // No error
    }
})
```

---

## Subscribing to Form State

### Watch All Changes
```javascript
const store = createFormStore({ ... })

store.subscribe((state) => {
    console.log('Form state changed:', state)
})
```

### Get Clean Form Data
```javascript
const handleSubmit = (e) => {
    const { formObject } = e
    
    // Extract just the values
    const cleanData = {}
    Object.entries(formObject).forEach(([key, field]) => {
        if (field && typeof field === 'object' && 'value' in field) {
            cleanData[key] = field.value
        }
    })
    
    console.log('Clean data:', cleanData)
    // { email: 'user@example.com', password: 'secret123' }
}
```

### Check Form Validity
```javascript
const isFormValid = (store) => {
    const state = store.GetFormState()
    
    for (const [key, field] of Object.entries(state)) {
        if (!field || typeof field !== 'object') continue
        
        // Required but empty
        if (field.required && !field.value) return false
        
        // Has error
        if (field.errValue) return false
    }
    
    return true
}
```

---

## Validation Patterns

### Required Field
```javascript
Form.Field({
    store,
    fieldKey: 'name',
    label: 'Name',
    isRequired: true  // Built-in "Required field" error
})
```

### Custom Validation Function
```javascript
// Validation receives { value } and returns Error or null
const validateEmail = ({ value }) => {
    if (!value) return null  // Let isRequired handle empty
    if (!value.includes('@')) return new Error('Invalid email format')
    if (value.length > 100) return new Error('Email too long')
    return null
}

Form.Field({
    store,
    fieldKey: 'email',
    label: 'Email',
    validation: validateEmail
})
```

### Cross-Field Validation
```javascript
// Access other fields via store
const validateConfirmPassword = ({ value }) => {
    const password = store.GetFormItemStateByKey('password')?.value
    if (value !== password) {
        return new Error('Passwords do not match')
    }
    return null
}
```

---

## Best Practices

### Do's ✅

| Practice | Why |
|----------|-----|
| Create store outside component | Prevents recreation on re-render |
| Pass same store to all form components | Keeps everything in sync |
| Use `isRequired` for required fields | Built-in validation handling |
| Return `null` from validation when valid | Required by validation protocol |
| Use `formObject` in onSubmit | Contains full form state |

### Don'ts ❌

| Avoid | Why |
|-------|-----|
| Creating store inside render function | Resets state on every render |
| Mixing Form.Field with raw Input | Raw inputs won't sync with form store |
| Forgetting to pass `store` prop | Components won't function |
| Returning truthy values from validation | Must return `Error` or `null` |

### Form Store Pattern Summary

```javascript
// 1. Create store once (outside component)
const formStore = createFormStore({
    field1: { id: 'field1', value: '', required: true },
    field2: { id: 'field2', value: '' }
}, { darkMode: false })

// 2. Build form with store prop on everything
const MyForm = () => Form({ store: formStore, onSubmit: handleSubmit },
    Form.Field({ store: formStore, fieldKey: 'field1', label: 'Field 1', isRequired: true }),
    Form.Field({ store: formStore, fieldKey: 'field2', label: 'Field 2' }),
    Form.PrimaryButton({ store: formStore }, 'Submit'),
    Form.SecondaryButton({ store: formStore }, 'Reset')
)

// 3. Handle submission
const handleSubmit = (e) => {
    const data = e.formObject
    // Process data...
}
```

---

## CSS Classes

| Class | Applied To | Purpose |
|-------|------------|---------|
| `ltng-form` | Form element | Flex column layout, gap |
| `ltng-form-field-container` | Field wrapper | Contains input + error |
| `ltng-form-error-msg` | Error text | Red, small text |

---

## Comparison: Form.Field vs Raw Input

| Feature | Form.Field | Raw Input |
|---------|------------|-----------|
| Store sync | ✅ Automatic | ❌ Manual |
| Validation | ✅ Built-in | ❌ Manual |
| Error display | ✅ Automatic | ❌ Manual |
| Reset support | ✅ Via store | ❌ Manual |
| Submit integration | ✅ Via form store | ❌ Manual |

**Use `Form.Field`** when building forms with `createFormStore`.  
**Use raw `Input`** for standalone inputs not part of a form store.


---

# Modal Component

A modal dialog with overlay, built-in close triggers, and dark/light theme for the ltng-framework.

## Import

```javascript
import { Modal } from '../ltng-components/index.mjs'
// Or directly:
import { Modal } from '../ltng-components/modal/modal.mjs'
```

---

## Core Concept: Closing the Modal

The Modal supports **two ways to close**:

### 1. Self-Closing (Built-in Triggers)
The modal can close itself via:
- **Overlay click**: Clicking the dark background (when `closeFromOutside: true`)
- **Close button (X)**: Built-in button from `Card.Closable`

Both triggers call the `onClose` callback you provide.

### 2. External Closing
The parent can close the modal by:
- Setting `isOpen: false` via state update
- Calling a close function from anywhere (buttons, timers, API responses)

### How It Works

```javascript
const store = createStore({ isOpen: false })

// Open externally
const open = () => store.setState({ isOpen: true })

// Close externally OR from modal's built-in triggers
const close = () => store.setState({ isOpen: false })

Modal({
    isOpen: store.getState().isOpen,
    onClose: close  // Called by overlay click AND close button
},
    Typography.H3({}, 'Modal Title'),
    Button({ onClick: close }, 'Close')  // Can also close via button
)
```

> **Note**: `isOpen` controls visibility. When `isOpen` is `false`, Modal returns `null` (not rendered).

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | — | **Required**. Controls visibility (`false` = not rendered) |
| `onClose` | `function` | — | Called by overlay click and close button (X) |
| `darkMode` | `boolean` | `true` | Dark or light theme |
| `closeFromOutside` | `boolean` | `true` | Enable/disable overlay click closing |
| `className` | `string` | `''` | Additional CSS classes |
| `style` | `object \| string` | — | Inline styles for content area |
| `...rest` | — | — | Passed to inner Card component |

---

## State Management Patterns

### Basic Open/Close with createStore

```javascript
import { createStore } from '../ltng-framework.js'
import { Modal, Button, Typography, Div } from '../ltng-components/index.mjs'

// 1. Create store for modal state
const modalStore = createStore({
    isOpen: false
})

// 2. Open modal function
const openModal = () => modalStore.setState({ isOpen: true })

// 3. Close modal function
const closeModal = () => modalStore.setState({ isOpen: false })

// 4. Render app with modal
const renderApp = () => {
    const { isOpen } = modalStore.getState()
    
    return Div({},
        // Trigger button
        Button.Primary({ onClick: openModal }, 'Open Modal'),
        
        // Modal (renders null when isOpen is false)
        Modal({
            isOpen: isOpen,
            onClose: closeModal
        },
            Typography.H3({}, 'Hello!'),
            Typography.Paragraph({}, 'This is a modal dialog.'),
            Button.Primary({ onClick: closeModal }, 'Close')
        )
    )
}

// 5. Subscribe for re-renders
modalStore.subscribe(() => {
    document.getElementById('app').replaceChildren(renderApp())
}, ['isOpen'])
```

### Multiple Modals

```javascript
const modalStore = createStore({
    confirmModal: false,
    settingsModal: false,
    helpModal: false
})

// Open specific modal
const openConfirm = () => modalStore.setState({ confirmModal: true })
const openSettings = () => modalStore.setState({ settingsModal: true })
const openHelp = () => modalStore.setState({ helpModal: true })

// Close all modals (or specific one)
const closeModals = () => modalStore.setState({
    confirmModal: false,
    settingsModal: false,
    helpModal: false
})

const renderApp = () => {
    const state = modalStore.getState()
    
    return Div({},
        // Trigger buttons
        Button({ onClick: openConfirm }, 'Confirm Action'),
        Button({ onClick: openSettings }, 'Settings'),
        Button({ onClick: openHelp }, 'Help'),
        
        // Confirm Modal
        Modal({ isOpen: state.confirmModal, onClose: closeModals },
            Typography.H3({}, 'Confirm'),
            Typography.Paragraph({}, 'Are you sure?'),
            Div.Flex({ style: { gap: '8px' } },
                Button.Secondary({ onClick: closeModals }, 'Cancel'),
                Button.Primary({ onClick: handleConfirm }, 'Yes')
            )
        ),
        
        // Settings Modal
        Modal({ isOpen: state.settingsModal, onClose: closeModals, darkMode: false },
            Typography.H3({}, 'Settings'),
            // Settings form here
        ),
        
        // Help Modal
        Modal({ isOpen: state.helpModal, onClose: closeModals },
            Typography.H3({}, 'Help'),
            Typography.Paragraph({}, 'Documentation here...')
        )
    )
}
```

### Modal with Form Submission

```javascript
import { createStore, createFormStore } from '../ltng-framework.js'
import { Modal, Form, Button, Div } from '../ltng-components/index.mjs'

// Modal visibility state
const modalStore = createStore({ isOpen: false })

// Form state (separate from modal state)
const formStore = createFormStore({
    name: { id: 'name', value: '', required: true },
    email: { id: 'email', value: '', required: true }
})

const openModal = () => modalStore.setState({ isOpen: true })

const closeModal = () => {
    modalStore.setState({ isOpen: false })
    formStore.ResetFormState()  // Clear form on close
}

const handleSubmit = (e) => {
    const { formObject } = e
    console.log('Submitted:', {
        name: formObject.name.value,
        email: formObject.email.value
    })
    closeModal()  // Close after successful submit
}

const renderApp = () => {
    const { isOpen } = modalStore.getState()
    
    return Div({},
        Button.Primary({ onClick: openModal }, 'Add Contact'),
        
        Modal({
            isOpen: isOpen,
            onClose: closeModal,
            closeFromOutside: false  // Prevent accidental close
        },
            Form({ store: formStore, onSubmit: handleSubmit },
                Typography.H3({}, 'Add New Contact'),
                Form.Field({ store: formStore, fieldKey: 'name', label: 'Name', isRequired: true }),
                Form.Field({ store: formStore, fieldKey: 'email', label: 'Email', isRequired: true }),
                Div.Flex({ style: { gap: '8px', marginTop: '16px' } },
                    Button.Secondary({ onClick: closeModal, type: 'button' }, 'Cancel'),
                    Form.PrimaryButton({ store: formStore }, 'Add Contact')
                )
            )
        )
    )
}

// Re-render on modal state change
modalStore.subscribe(() => {
    document.getElementById('app').replaceChildren(renderApp())
}, ['isOpen'])
```

### Confirmation Dialog Pattern

```javascript
const confirmStore = createStore({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
})

// Generic confirm function
const showConfirm = (title, message, onConfirm) => {
    confirmStore.setState({
        isOpen: true,
        title,
        message,
        onConfirm
    })
}

const closeConfirm = () => {
    confirmStore.setState({ isOpen: false, onConfirm: null })
}

const handleConfirmClick = () => {
    const { onConfirm } = confirmStore.getState()
    if (onConfirm) onConfirm()
    closeConfirm()
}

// Reusable confirmation modal
const ConfirmDialog = () => {
    const { isOpen, title, message } = confirmStore.getState()
    
    return Modal({
        isOpen: isOpen,
        onClose: closeConfirm,
        closeFromOutside: false
    },
        Typography.H3({}, title),
        Typography.Paragraph({}, message),
        Div.Flex({ style: { gap: '8px', marginTop: '16px' } },
            Button.Secondary({ onClick: closeConfirm }, 'Cancel'),
            Button.Primary({ onClick: handleConfirmClick }, 'Confirm')
        )
    )
}

// Usage anywhere in your app:
Button({ 
    onClick: () => showConfirm(
        'Delete Item?',
        'This action cannot be undone.',
        () => deleteItem(itemId)
    )
}, 'Delete')
```

### Async Operations in Modal

```javascript
const modalStore = createStore({
    isOpen: false,
    isLoading: false,
    error: null
})

const closeModal = () => {
    if (modalStore.getState().isLoading) return  // Prevent close while loading
    modalStore.setState({ isOpen: false, error: null })
}

const handleSubmit = async (data) => {
    modalStore.setState({ isLoading: true, error: null })
    
    try {
        await saveData(data)
        modalStore.setState({ isOpen: false, isLoading: false })
    } catch (err) {
        modalStore.setState({ error: err.message, isLoading: false })
    }
}

const renderModal = () => {
    const { isOpen, isLoading, error } = modalStore.getState()
    
    return Modal({
        isOpen: isOpen,
        onClose: closeModal,
        closeFromOutside: !isLoading  // Disable overlay click while loading
    },
        Typography.H3({}, 'Save Data'),
        
        error 
            ? Typography.Paragraph({ style: { color: 'red' } }, error)
            : null,
        
        Button.Primary({
            disabled: isLoading,
            onClick: () => handleSubmit({ example: 'data' })
        }, isLoading ? 'Saving...' : 'Save')
    )
}
```

---

## Modal Close Behaviors

### Self-Closing Triggers

#### 1. Overlay Click (Default: Enabled)
```javascript
Modal({
    isOpen: true,
    onClose: handleClose,
    closeFromOutside: true  // Default - clicking overlay calls onClose
}, 'Content')
```

#### 2. Close Button (X)
Always present. Modal uses `Card.Closable` internally, which includes a close button that triggers `onClose`.

#### 3. Disable Overlay Close
```javascript
Modal({
    isOpen: true,
    onClose: handleClose,
    closeFromOutside: false  // Only close button (X) or content buttons work
}, 'Must use close button or Cancel button')
```

### External Closing

Close the modal from outside by updating the state:

```javascript
// From a timer
setTimeout(() => store.setState({ isOpen: false }), 5000)

// From an API response
fetch('/api/save').then(() => store.setState({ isOpen: false }))

// From a keyboard event
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') store.setState({ isOpen: false })
})
```

---

## Theme Modes

### Dark Mode (Default)
```javascript
Modal({ isOpen: true, onClose: close, darkMode: true },
    Typography.H3({}, 'Dark Modal')
)
```
- Content background: `#444`
- Text: `white`
- Overlay: Dark translucent

### Light Mode
```javascript
Modal({ isOpen: true, onClose: close, darkMode: false },
    Typography.H3({}, 'Light Modal')
)
```
- Content background: `whitesmoke`
- Text: `black`

---

## Custom Styling

### Custom Content Size
```javascript
Modal({
    isOpen: true,
    onClose: close,
    style: {
        maxWidth: '800px',
        minHeight: '500px'
    }
}, 'Larger modal')
```

### Additional CSS Classes
```javascript
Modal({
    isOpen: true,
    onClose: close,
    className: 'my-custom-modal'
}, 'Custom styled')
```

---

## Best Practices

### Do's ✅

| Practice | Why |
|----------|-----|
| Use `createStore` for modal state | Enables proper reactivity |
| Reset form state on close | Prevents stale data |
| Set `closeFromOutside: false` for forms | Prevents accidental data loss |
| Disable close during async operations | Prevents inconsistent state |
| Provide Cancel/Close button in content | Better UX and accessibility |

### Don'ts ❌

| Avoid | Why |
|-------|-----|
| Managing modal state without store | Breaks reactivity |
| Opening modal without close handler | User gets stuck |
| Closing during async operation | Can cause errors |
| Nesting modals | Poor UX, complex state |

### Modal State Pattern Summary

```javascript
// 1. Create store for modal visibility
const modalStore = createStore({ isOpen: false })

// 2. Open/close functions
const open = () => modalStore.setState({ isOpen: true })
const close = () => modalStore.setState({ isOpen: false })

// 3. Render with controlled props
const render = () => Modal({
    isOpen: modalStore.getState().isOpen,
    onClose: close
}, /* content */)

// 4. Subscribe for re-renders
modalStore.subscribe(render, ['isOpen'])
```

---

## Modal with Actions Pattern

```javascript
// Common modal with header, body, and footer actions
const ActionModal = ({ isOpen, onClose, title, onSubmit, submitLabel = 'Submit' }, ...bodyContent) => {
    return Modal({ isOpen, onClose, closeFromOutside: false },
        // Header
        Typography.H3({}, title),
        
        // Body
        Div({ style: { margin: '16px 0', width: '100%' } },
            ...bodyContent
        ),
        
        // Footer actions
        Div.Flex({ 
            style: { 
                justifyContent: 'flex-end', 
                gap: '8px', 
                width: '100%',
                marginTop: '16px'
            } 
        },
            Button.Secondary({ onClick: onClose }, 'Cancel'),
            Button.Primary({ onClick: onSubmit }, submitLabel)
        )
    )
}

// Usage
ActionModal({
    isOpen: state.isOpen,
    onClose: close,
    title: 'Edit Profile',
    onSubmit: handleSave,
    submitLabel: 'Save Changes'
},
    Input({ placeholder: 'Name', value: name, onChange: handleChange }),
    Input({ placeholder: 'Email', value: email, onChange: handleChange })
)
```

---

## Accessibility

- **Focus trap**: Not built-in; consider adding for production
- **Escape key**: Not built-in; add via `onKeyDown` on container
- **Overlay click**: Respects `closeFromOutside` prop
- **Close button**: Provided by inner `Card.Closable`

### Adding Escape Key Close
```javascript
// Add to your app initialization
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modalStore.setState({ isOpen: false })
    }
})
```

---

## CSS Classes

| Class | Applied To | Purpose |
|-------|------------|---------|
| `ltng-modal-container` | Outer wrapper | Full viewport overlay positioning |
| `ltng-modal-overlay` | Background | Semi-transparent backdrop |
| `ltng-modal-content` | Content card | Centered content area |
| `ltng-modal-content--dark/light` | Content card | Theme colors |

---

## Component Structure

```
Modal
├── ltng-modal-container (fixed, full viewport)
│   ├── ltng-modal-overlay (click to close)
│   └── Card.Closable (ltng-modal-content)
│       ├── Close button (X)
│       └── ...children
```


---

# Toast Component

A notification system with built-in store, auto-dismiss, multiple types, and stacking support for the ltng-framework.

## Import

```javascript
import { Toast, toastStore } from '../ltng-components/index.mjs'
// Or directly:
import { Toast, toastStore } from '../ltng-components/toast/toast.mjs'
```

## Components & Methods

| Export | Type | Description |
|--------|------|-------------|
| `Toast.Container` | Component | Renders toast notifications (add to your app once) |
| `Toast.show` | Function | Show a default toast |
| `Toast.success` | Function | Show a success toast (blue) |
| `Toast.warning` | Function | Show a warning toast (light with blue border) |
| `Toast.failure` | Function | Show a failure toast (dark red) |
| `toastStore` | Store | Internal store for manual control |

---

## Quick Start

### 1. Add Toast Container (Once)

Add `Toast.Container` to your app root — it renders all toasts:

```javascript
import { Toast, Div } from '../ltng-components/index.mjs'

const App = () => Div({},
    // Your app content
    h1({}, 'My App'),
    
    // Toast container (renders notifications)
    Toast.Container({})
)

document.body.appendChild(App())
```

### 2. Trigger Toasts from Anywhere

```javascript
// Show toasts from any code
Toast.success('File saved successfully!')
Toast.warning('Your session will expire soon')
Toast.failure('Failed to connect to server')
Toast.show('This is a default notification')
```

---

## Toast Methods

### Toast.show(message, options?)
Show a default-styled toast.

```javascript
Toast.show('Hello World')
Toast.show('Custom duration', { duration: 3000 })
```

### Toast.success(message, options?)
Show a success toast (blue background).

```javascript
Toast.success('Profile updated!')
Toast.success('Saved', { duration: 2000 })
```

### Toast.warning(message, options?)
Show a warning toast (light background with blue border).

```javascript
Toast.warning('Unsaved changes')
Toast.warning('Low storage space', { duration: 10000 })
```

### Toast.failure(message, options?)
Show a failure toast (dark red background).

```javascript
Toast.failure('Network error')
Toast.failure('Invalid credentials', { duration: 0 })  // Persistent
```

---

## Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `duration` | `number` | `5000` | Auto-dismiss after ms (`0` = persistent) |
| `type` | `string` | — | `'success'`, `'warning'`, `'failure'` (set by helpers) |

### Examples

```javascript
// Default 5 second duration
Toast.success('Saved')

// Custom 10 second duration
Toast.success('Saved', { duration: 10000 })

// Persistent (must be manually dismissed)
Toast.failure('Critical error!', { duration: 0 })

// Short notification
Toast.show('Done', { duration: 2000 })
```

---

## Toast.Container Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `store` | `ToastStore` | `toastStore` | Custom store (optional) |
| `darkMode` | `boolean` | `true` | Theme for default toasts |

### Light Mode Container

```javascript
Toast.Container({ darkMode: false })

// Now Toast.show() will use light theme
Toast.show('Light themed notification')
```

---

## Toast Store (Advanced)

For advanced control, use `toastStore` directly:

### Store Methods

| Method | Description |
|--------|-------------|
| `toastStore.add(toast)` | Add a toast manually, returns ID |
| `toastStore.remove(id)` | Remove a specific toast |
| `toastStore.getToasts()` | Get all current toasts |
| `toastStore.subscribe(listener)` | Subscribe to toast changes |

### Manual Store Usage

```javascript
import { toastStore } from '../ltng-components/index.mjs'

// Add toast and get ID
const id = toastStore.add({
    message: 'Custom toast',
    type: 'success',
    duration: 0  // Persistent
})

// Remove later
toastStore.remove(id)

// Get all toasts
console.log(toastStore.getToasts())

// Subscribe to changes
toastStore.subscribe((toasts) => {
    console.log('Current toasts:', toasts)
})
```

### Custom Toast with Manual Dismiss

```javascript
// Show persistent toast
const toastId = Toast.failure('Connection lost', { duration: 0 })

// Later, when connection restores
toastStore.remove(toastId)
Toast.success('Reconnected!')
```

---

## State Management Patterns

### Toast After Async Operation

```javascript
const saveData = async () => {
    try {
        await api.save(data)
        Toast.success('Changes saved successfully!')
    } catch (error) {
        Toast.failure(`Failed to save: ${error.message}`)
    }
}
```

### Toast with Form Submission

```javascript
const handleSubmit = async (e) => {
    const { formObject } = e
    
    try {
        await api.submit(formObject)
        Toast.success('Form submitted!')
        closeModal()
    } catch (error) {
        Toast.failure('Submission failed. Please try again.')
    }
}
```

### Loading Toast Pattern

```javascript
const processData = async () => {
    // Show loading toast (persistent)
    const loadingId = Toast.show('Processing...', { duration: 0 })
    
    try {
        await heavyComputation()
        toastStore.remove(loadingId)  // Remove loading toast
        Toast.success('Processing complete!')
    } catch (error) {
        toastStore.remove(loadingId)
        Toast.failure('Processing failed')
    }
}
```

### Toast from Modal Actions

```javascript
const modalStore = createStore({ isOpen: false })

const handleConfirm = () => {
    deleteItem(itemId)
    modalStore.setState({ isOpen: false })
    Toast.success('Item deleted')
}

const handleCancel = () => {
    modalStore.setState({ isOpen: false })
    Toast.show('Action cancelled')
}
```

---

## Toast Types Visual Reference

| Type | Method | Background | Text |
|------|--------|------------|------|
| Default (dark) | `Toast.show()` | `#333` | White |
| Default (light) | `Toast.show()` | `whitesmoke` | Black |
| Success | `Toast.success()` | Blue (`--ltng-color-primary`) | White |
| Warning | `Toast.warning()` | `whitesmoke` | Blue |
| Failure | `Toast.failure()` | Dark red (`#8b0000`) | White |

---

## Stacking Behavior

Multiple toasts stack vertically from the top-right:

```javascript
Toast.success('First')   // Top
Toast.warning('Second')  // Below first
Toast.failure('Third')   // Below second
```

Each toast is positioned 110px below the previous one with a higher z-index.

---

## Best Practices

### Do's ✅

| Practice | Example |
|----------|---------|
| Add Container once at app root | `Toast.Container({})` in App |
| Use appropriate type for context | `Toast.success()` for saves |
| Keep messages concise | `'Saved'` not `'Your changes have been successfully saved to the server'` |
| Use persistent for critical errors | `{ duration: 0 }` |
| Remove loading toasts when done | `toastStore.remove(loadingId)` |

### Don'ts ❌

| Avoid | Why |
|-------|-----|
| Multiple Toast.Container | Causes duplicate notifications |
| Very long durations | User may miss them or forget |
| Too many toasts at once | Overwhelming, consider queuing |
| Toasts for every action | Reserve for important feedback |

---

## CSS Classes

| Class | Applied To | Purpose |
|-------|------------|---------|
| `ltng-toast-container` | Container | Fixed positioning at top |
| `ltng-toast-card` | Each toast | Base toast styling |
| `ltng-toast-card--success` | Success | Blue background |
| `ltng-toast-card--warning` | Warning | Light with blue border |
| `ltng-toast-card--failure` | Failure | Dark red background |
| `ltng-toast-card--default-dark` | Default dark | Dark background |
| `ltng-toast-card--default-light` | Default light | Light background |

---

## Custom Styling

### Override Toast Position

```css
.ltng-toast-container {
    top: auto;
    bottom: 0;  /* Move to bottom */
}

.ltng-toast-card {
    top: auto;
    bottom: 20px;
    right: 20px;
}
```

### Custom Toast Width

```css
.ltng-toast-card {
    width: 300px;  /* Narrower */
}
```


---

# Typography Component

Semantic text components with consistent styling, dark/light theme support, and system font stack for the ltng-framework.

## Import

```javascript
import { Typography } from '../ltng-components/index.mjs'

// ✅ Best Practice: Destructure for cleaner code
const { H1, H2, H3, H4, H5, Paragraph, Span } = Typography
```

Now you can use `H1`, `Paragraph`, etc. directly without the `Typography.` prefix.

## Components

| Component | HTML Element | Font Size |
|-----------|--------------|-----------|
| `Typography` / Destructured | `<div>` | Inherited |
| `H1` | `<h1>` | 2.5rem |
| `H2` | `<h2>` | 2rem |
| `H3` | `<h3>` | 1.75rem |
| `H4` | `<h4>` | 1.5rem |
| `H5` | `<h5>` | 1.25rem |
| `Paragraph` | `<p>` | 16px (--ltng-font-size-md) |
| `Span` | `<span>` | Inherited |

---

## Props Reference

All Typography components share these props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `darkMode` | `boolean` | `true` | Dark (white text) or light (dark text) theme |
| `className` | `string` | `''` | Additional CSS classes |
| `style` | `object \| string` | — | Inline styles (JS object or CSS string) |
| `...rest` | — | — | Any valid HTML attributes for the element |

---

## Basic Usage

```javascript
// Destructure first (do this once at the top of your file)
const { H1, H2, H3, H4, H5, Paragraph, Span } = Typography
```

### Headings

```javascript
H1({}, 'Main Title')
H2({}, 'Section Title')
H3({}, 'Subsection')
H4({}, 'Group Heading')
H5({}, 'Minor Heading')
```

### Paragraph

```javascript
Paragraph({}, 
    'This is a paragraph of text. It uses the standard body font size.'
)
```

### Span (Inline Text)

```javascript
Paragraph({},
    'This is ',
    Span({ style: { fontWeight: 'bold' } }, 'bold'),
    ' and this is ',
    Span({ style: { fontStyle: 'italic' } }, 'italic'),
    '.'
)
```

### Generic Container

```javascript
Typography({}, 
    H3({}, 'Title'),
    Paragraph({}, 'Description text')
)
```

---

## Theme Modes

### Dark Mode (Default)
White text for dark backgrounds:

```javascript
H1({ darkMode: true }, 'White Text')
Paragraph({}, 'Default is dark mode')  // darkMode: true
```

### Light Mode
Dark text for light backgrounds:

```javascript
H1({ darkMode: false }, 'Dark Text')
Paragraph({ darkMode: false }, 'For light backgrounds')
```

---

## Custom Styling

### Inline Styles (JS Object)

```javascript
H1({
    style: {
        color: 'red',
        textAlign: 'center',
        marginBottom: '20px'
    }
}, 'Styled Heading')
```

### Additional CSS Classes

```javascript
Paragraph({
    className: 'intro-text highlight'
}, 'Styled with custom classes')
```

### Override Font Size

```javascript
H3({
    style: { fontSize: '2rem' }
}, 'Larger H3')
```

---

## Common Patterns

### Page Header

```javascript
Div({ style: { marginBottom: '32px' } },
    H1({}, 'Dashboard'),
    Paragraph({ style: { color: '#888' } }, 
        'Welcome back, User'
    )
)
```

### Article Layout

```javascript
Div.Flex({ style: { flexDirection: 'column', gap: '16px' } },
    H1({}, 'Article Title'),
    Paragraph({ style: { color: '#666', fontSize: '14px' } },
        'Published on January 20, 2026'
    ),
    Paragraph({},
        'Article content goes here. This is the main body text...'
    )
)
```

### Card Content

```javascript
Card({ darkMode: false },
    H3({ darkMode: false }, 'Card Title'),
    Paragraph({ darkMode: false }, 
        'Card description with light theme text.'
    )
)
```

### Form Labels

```javascript
Div({},
    Span({ 
        darkMode: false,
        style: { fontWeight: '600', marginBottom: '4px', display: 'block' }
    }, 'Email Address'),
    Input({ placeholder: 'Enter email', darkMode: false })
)
```

---

## State Integration

### Reactive Text with createStore

```javascript
import { createStore, reactive } from '../ltng-framework.js'
import { Typography } from '../ltng-components/index.mjs'

const { H1 } = Typography
const store = createStore({ userName: 'Guest' })

// Using reactive() for auto-updating text
H1({}, 'Hello, ', reactive(store, 'userName'), '!')

// Update triggers re-render
store.setState({ userName: 'John' })
```

### Dynamic Content

```javascript
const store = createStore({ 
    title: 'Loading...',
    description: ''
})

const renderContent = () => {
    const { title, description } = store.getState()
    
    return Div({},
        H2({}, title),
        Paragraph({}, description)
    )
}

// Fetch and update
fetch('/api/content')
    .then(res => res.json())
    .then(data => store.setState({ 
        title: data.title, 
        description: data.description 
    }))
```

---

## Accessibility

Typography components use semantic HTML elements:

| Component | Semantic Meaning |
|-----------|------------------|
| `H1` | Main page heading (one per page) |
| `H2` | Section headings |
| `H3-H5` | Subsection headings |
| `Paragraph` | Body text |
| `Span` | Inline text (styling only) |

### Best Practices

```javascript
// ✅ Good: Proper heading hierarchy
H1({}, 'Page Title')
H2({}, 'Section')
H3({}, 'Subsection')

// ❌ Avoid: Skipping heading levels
H1({}, 'Page Title')
H4({}, 'Subsection')  // Skipped H2, H3
```

---

## Font Stack

Typography uses the system font stack defined in `theme.css`:

```css
--ltng-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", 
                    Roboto, Helvetica, Arial, sans-serif;
```

This provides native-looking fonts on each platform:
- **macOS/iOS**: San Francisco
- **Windows**: Segoe UI
- **Android**: Roboto
- **Fallback**: Helvetica, Arial

---

## CSS Classes

| Class | Applied To | Purpose |
|-------|------------|---------|
| `ltng-typography` | All | Base font-family, margin reset |
| `ltng-typography--dark` | darkMode: true | White text color |
| `ltng-typography--light` | darkMode: false | Dark text color |
| `ltng-typography-h1` | H1 | 2.5rem, bold |
| `ltng-typography-h2` | H2 | 2rem, bold |
| `ltng-typography-h3` | H3 | 1.75rem, bold |
| `ltng-typography-h4` | H4 | 1.5rem, bold |
| `ltng-typography-h5` | H5 | 1.25rem, bold |
| `ltng-typography-p` | Paragraph | Standard body size |
| `ltng-typography-span` | Span | Inherits size |

---

## CSS Variables Used

| Variable | Purpose |
|----------|---------|
| `--ltng-font-family` | Font stack |
| `--ltng-font-size-md` | Paragraph font size (16px) |
| `--ltng-color-text` | Light mode text color (#333) |
| `--ltng-color-white` | Dark mode text color (#fff) |

---

## Size Reference

| Component | rem | px (approx) |
|-----------|-----|-------------|
| H1 | 2.5rem | 40px |
| H2 | 2rem | 32px |
| H3 | 1.75rem | 28px |
| H4 | 1.5rem | 24px |
| H5 | 1.25rem | 20px |
| Paragraph | 1rem | 16px |
| Span | inherit | — |


---

# Footer Component

A semantic footer element with primary-colored background and centered flex layout for the ltng-framework.

## Import

```javascript
import { Footer } from '../ltng-components/index.mjs'
// Or directly:
import { Footer } from '../ltng-components/footer/footer.mjs'
```

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `''` | Additional CSS classes |
| `style` | `object \| string` | — | Inline styles (JS object or CSS string) |
| `...rest` | — | — | Any valid `<footer>` attributes |

---

## Basic Usage

```javascript
Footer({},
    Paragraph({ darkMode: true }, '© 2026 My Company. All rights reserved.')
)
```

---

## Common Patterns

### Simple Copyright Footer

```javascript
Footer({},
    Paragraph({}, '© 2026 Your Company')
)
```

### Footer with Links

```javascript
const { Paragraph, Span } = Typography

Footer({ style: { gap: '16px' } },
    Div.Flex({ style: { gap: '24px' } },
        a({ href: '/about', style: { color: 'white' } }, 'About'),
        a({ href: '/privacy', style: { color: 'white' } }, 'Privacy'),
        a({ href: '/terms', style: { color: 'white' } }, 'Terms'),
        a({ href: '/contact', style: { color: 'white' } }, 'Contact')
    ),
    Paragraph({}, '© 2026 Company Name')
)
```

### Multi-Column Footer

```javascript
Footer({ 
    style: { 
        flexDirection: 'row', 
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        padding: '40px'
    } 
},
    // Column 1
    Div({},
        H4({}, 'Company'),
        a({ href: '/about' }, 'About Us'),
        a({ href: '/careers' }, 'Careers'),
        a({ href: '/press' }, 'Press')
    ),
    
    // Column 2
    Div({},
        H4({}, 'Resources'),
        a({ href: '/docs' }, 'Documentation'),
        a({ href: '/blog' }, 'Blog'),
        a({ href: '/support' }, 'Support')
    ),
    
    // Column 3
    Div({},
        H4({}, 'Legal'),
        a({ href: '/privacy' }, 'Privacy Policy'),
        a({ href: '/terms' }, 'Terms of Service')
    )
)
```

### Footer with Social Icons

```javascript
Footer({ style: { gap: '20px' } },
    // Social links
    Div.Flex({ style: { gap: '16px' } },
        a({ href: 'https://twitter.com/company' }, '🐦'),
        a({ href: 'https://github.com/company' }, '💻'),
        a({ href: 'https://linkedin.com/company' }, '💼')
    ),
    
    // Copyright
    Paragraph({ style: { fontSize: '14px' } }, 
        '© 2026 Company. All rights reserved.'
    )
)
```

---

## Sticky Footer Pattern

Keep footer at the bottom of the page:

```javascript
// App layout with sticky footer
Div.Flex({
    style: {
        flexDirection: 'column',
        minHeight: '100vh'
    }
},
    // Header
    header({}, 'Header'),
    
    // Main content (grows to fill space)
    Div({ style: { flex: 1 } },
        'Page content here'
    ),
    
    // Footer stays at bottom
    Footer({},
        Paragraph({}, '© 2026 Company')
    )
)
```

---

## Custom Styling

### Override Background Color

```javascript
Footer({
    style: {
        backgroundColor: '#333'
    }
},
    Paragraph({}, 'Dark gray footer')
)
```

### Custom Height

```javascript
Footer({
    style: {
        minHeight: '100px'
    }
},
    Paragraph({}, 'Shorter footer')
)
```

### Custom Padding

```javascript
Footer({
    style: {
        padding: '40px 20px'
    }
},
    // Content
)
```

### Additional CSS Classes

```javascript
Footer({
    className: 'my-custom-footer dark-theme'
},
    // Content
)
```

---

## State Integration

### Dynamic Copyright Year

```javascript
const currentYear = new Date().getFullYear()

Footer({},
    Paragraph({}, `© ${currentYear} Company Name`)
)
```

### Footer with Dynamic Content

```javascript
import { createStore } from '../ltng-framework.js'

const store = createStore({
    companyName: 'My Company',
    year: new Date().getFullYear()
})

const renderFooter = () => {
    const { companyName, year } = store.getState()
    
    return Footer({},
        Paragraph({}, `© ${year} ${companyName}. All rights reserved.`)
    )
}
```

---

## Default Styling

The Footer component comes with these default styles:

| Property | Value |
|----------|-------|
| `background-color` | `var(--ltng-color-primary)` (blue) |
| `min-height` | `250px` |
| `width` | `100%` |
| `display` | `flex` |
| `flex-direction` | `column` |
| `justify-content` | `center` |
| `align-items` | `center` |
| `color` | `white` |

---

## CSS Classes

| Class | Applied To | Purpose |
|-------|------------|---------|
| `ltng-footer` | Footer element | Base styling |

---

## CSS Variables Used

| Variable | Purpose |
|----------|---------|
| `--ltng-color-primary` | Background color (#1976d2) |

---

## Accessibility

The Footer component uses the semantic `<footer>` HTML element, which:
- Provides landmark navigation for screen readers
- Signals the end of page content
- Contains supplementary information (copyright, links, etc.)

### Best Practices

```javascript
// ✅ Good: One footer per page, at the end
Div({},
    main({}, 'Page content'),
    Footer({}, '© 2026')
)

// ✅ Good: Include important links
Footer({},
    nav({}, 
        a({ href: '/privacy' }, 'Privacy'),
        a({ href: '/terms' }, 'Terms')
    ),
    Paragraph({}, '© 2026')
)
```
