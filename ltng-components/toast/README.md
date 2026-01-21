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
