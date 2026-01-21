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
