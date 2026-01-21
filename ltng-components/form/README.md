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
