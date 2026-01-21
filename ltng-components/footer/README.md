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
