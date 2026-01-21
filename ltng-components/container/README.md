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
