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
