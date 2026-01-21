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
