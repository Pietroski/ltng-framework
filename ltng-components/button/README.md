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
