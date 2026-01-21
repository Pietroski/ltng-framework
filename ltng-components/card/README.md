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
