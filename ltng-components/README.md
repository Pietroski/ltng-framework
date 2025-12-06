# ltng-components

A rich set of functional UI components built for the `ltng-framework`.

## Installation

This package is part of the `ltng-framework` monorepo.

```javascript
import { Button, Card, Input, Form, Modal, Typography } from './path/to/ltng-components/index.mjs';
```

## Core Concepts

### 1. State Management
Components in `ltng-components` are generally **stateless**. The philosophy is that the parent (or developer) is responsible for:
- Creating the initial state.
- Passing the state (or a store) to the component.
- Handling updates via callbacks.

### 2. Styling
Components accept a `style` prop which is a JavaScript object mapping CSS properties to values (camelCase keys).
```javascript
Button({ style: { marginTop: '10px', backgroundColor: 'red' } }, "Click Me")
```

---

## Component Reference

### [Form]

Forms rely on a dedicated store to manage field values and validation.

#### Usage Pattern
1. Create a store using `createFormStore`.
2. Pass the store to the `Form` and all input fields.
3. Handle `onSubmit` to access the valid form data.

#### Example
```javascript
import { Form, createFormStore, Div } from './ltng-components/index.mjs';

// 1. Create State (Store)
const store = createFormStore({
    username: { id: 'username', value: '', required: true },
    password: { id: 'password', value: '', required: true }
}, { darkMode: false });

// 2. Render Component
const MyForm = () => {
    return Form({
        store: store,
        style: { padding: '20px' },
        onSubmit: (e) => {
            // e.formObject contains the clean data
            console.log("Form Submitted:", e.formObject);
        }
    },
        // Pass store to children so they can bind to specific keys
        Form.Field({
            store: store,
            fieldKey: 'username',
            label: 'Username',
            validation: ({ value }) => value.length < 3 ? new Error('Too short') : null
        }),
        Form.FieldSecret({
            store: store,
            fieldKey: 'password',
            label: 'Password'
        }),
        Form.PrimaryButton({ store: store }, 'Login')
    );
};
```

### [Modal]

Modals are "controlled" components. They do not manage their own open/closed state.

#### Usage Pattern
1. Parent maintains `isOpen` state.
2. Parent conditionally renders the `Modal`.
3. Parent handles `onClose` to update state and remove/hide the modal.

#### Example
```javascript
import { Modal, Button, Typography, Div } from './ltng-components/index.mjs';

let isOpen = false;

const renderApp = () => {
    const container = Div({});

    // Trigger Button
    container.appendChild(Button.Primary({
        onClick: () => {
            isOpen = true;
            renderModal(); // Re-render or append modal
        }
    }, "Open Modal"));

    // Modal Logic
    const renderModal = () => {
        if (!isOpen) return;
        
        const modal = Modal({
            isOpen: true,
            darkMode: false, // Styling prop
            onClose: () => {
                isOpen = false;
                modal.remove(); // Remove from DOM
            }
        },
            Typography.H3({}, "My Modal"),
            Typography.Paragraph({}, "This is controlled by the parent."),
            Button.Secondary({ onClick: () => modal.remove() }, "Close")
        );
        
        document.body.appendChild(modal);
    };

    return container;
};
```

### [Button]
Standard button component with variants.
- `Button(props, ...children)`
- `Button.Primary(props, ...children)`
- `Button.Secondary(props, ...children)`

```javascript
Button.Primary({ onClick: () => alert('Clicked') }, "Save Changes")
```

### [Card]
Container component for grouping related content.
- `Card(props, ...children)`

```javascript
Card({ style: { maxWidth: '300px' } },
    Typography.H3({}, "Card Title"),
    Typography.Paragraph({}, "Card content goes here.")
)
```

### [Input]
Input fields.
- `Input(props)`
- `TextField(props)` (Textarea)

```javascript
Input({ 
    placeholder: 'Enter text...',
    onChange: (e) => console.log(e.target.value)
})
```

### [Container]
Layout containers.
- `Container(props, ...children)`: Centered container with max-width.
- `Row(props, ...children)`: Flex row.
- `Column(props, ...children)`: Flex column.

### [Toast]
Notification messages.
- `Toast(props, message)`

```javascript
// Shows a toast directly
Toast({ type: 'success', duration: 3000 }, "Operation Successful");
```
