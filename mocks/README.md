# Mock DOM

> **Lightweight DOM implementation for Server-Side Rendering (SSR) and Static Site Generation (SSG)**

This module provides a minimal, dependency-free DOM API that runs in Node.js, enabling the ltng-framework to render components on the server.

---

## Purpose

Node.js doesn't have `document` or `window` objects. This mock provides just enough DOM functionality to:

1. **Create elements** (`createElement`, `createTextNode`)
2. **Build a tree** (`appendChild`, `childNodes`)
3. **Set attributes and styles** (`setAttribute`, `getAttribute`, `style`)
4. **Serialize to HTML** (`toString()`)

---

## Quick Start

```javascript
const { createWindow } = require('./mocks/mock-dom.js')

// Create isolated window (IMPORTANT: new instance per request!)
const { window, document } = createWindow()

// Create elements
const div = document.createElement('div')
div.setAttribute('id', 'app')
div.setAttribute('class', 'container')

const text = document.createTextNode('Hello World')
div.appendChild(text)

document.body.appendChild(div)

// Serialize to HTML
console.log(document.body.toString())
// → <body><div id="app" class="container">Hello World</div></body>
```

---

## Why `createWindow()` Factory?

**Critical for SSR**: Each HTTP request must get a **fresh DOM instance**.

```javascript
// ❌ WRONG: Reusing global document causes state pollution
const globalDoc = new Document()
app.get('/', (req, res) => {
    globalDoc.body.appendChild(...)  // User A's content leaks to User B!
})

// ✅ CORRECT: Fresh window per request
app.get('/', (req, res) => {
    const { document } = createWindow()  // Isolated!
    document.body.appendChild(...)
})
```

---

## Classes

### Node (Base Class)

The foundation for all DOM nodes.

```javascript
const node = new Node()
node.childNodes      // [] — Array of children
node.parentNode      // null — Parent reference

node.appendChild(child)  // Add child, returns child
node.remove()            // Remove from parent
```

### TextNode

Represents text content.

```javascript
const text = new TextNode('Hello')
text.textContent     // 'Hello'
text.toString()      // 'Hello'
```

### HTMLElement

Represents any HTML element.

```javascript
const el = new HTMLElement('div')

// Properties
el.tagName           // 'div' (lowercase)
el.attributes        // {} — Attribute map
el.style             // {} — Style object
el.classList.add('a', 'b')  // Add CSS classes

// Methods
el.setAttribute('id', 'main')
el.getAttribute('id')        // 'main'
el.addEventListener(...)     // No-op (server-side)
el.closest(...)              // Returns null (stub)

// Serialize
el.toString()  // '<div id="main"></div>'
```

### HTMLBodyElement

Special element for `<body>`.

```javascript
const body = new HTMLBodyElement()
body.tagName  // 'body'
```

### HTMLHeadElement

Special element for `<head>`.

```javascript
const head = new HTMLHeadElement()
head.tagName  // 'head'
```

### HTMLLinkElement

Special element for `<link>` with property accessors.

```javascript
const link = new HTMLLinkElement()
link.href = '/styles.css'
link.rel = 'stylesheet'
link.toString()  // '<link href="/styles.css" rel="stylesheet" />'
```

### HTMLUnknownElement

For custom/unknown elements (extends HTMLElement).

```javascript
const custom = new HTMLUnknownElement('my-component')
custom.tagName  // 'my-component'
```

---

## Document

The root document object.

```javascript
const doc = new Document()

doc.head                    // HTMLHeadElement
doc.body                    // HTMLBodyElement

doc.createElement('div')    // HTMLElement
doc.createElement('link')   // HTMLLinkElement
doc.createTextNode('text')  // TextNode

doc.getElementById('app')   // Find by ID (recursive search)
doc.querySelector(selector) // Basic selector support (link[href="..."])
```

---

## Window

The global context containing document and browser APIs.

```javascript
const win = new Window()

win.document              // Document instance
win.console               // Node.js console

// Class references (for prototype extension)
win.HTMLElement
win.HTMLBodyElement
win.HTMLUnknownElement
win.Node
win.TextNode

// Stubs
win.localStorage          // { getItem, setItem, removeItem, clear } — all no-op
win.crypto.getRandomValues(arr)  // Pseudo-random fill
```

---

## HTML Serialization

### Regular Elements

```javascript
const div = document.createElement('div')
div.setAttribute('class', 'box')
div.style.backgroundColor = 'red'
div.appendChild(document.createTextNode('Content'))

div.toString()
// → '<div class="box" style="background-color:red">Content</div>'
```

### Self-Closing Elements

These tags render as self-closing:

```javascript
// img, input, br, hr, meta, link
document.createElement('img').toString()
// → '<img />'

document.createElement('br').toString()
// → '<br />'
```

### Nested Elements

```javascript
const ul = document.createElement('ul')
const li1 = document.createElement('li')
li1.appendChild(document.createTextNode('Item 1'))
const li2 = document.createElement('li')
li2.appendChild(document.createTextNode('Item 2'))
ul.appendChild(li1)
ul.appendChild(li2)

ul.toString()
// → '<ul><li>Item 1</li><li>Item 2</li></ul>'
```

---

## Style Handling

Styles are converted from camelCase to kebab-case during serialization:

```javascript
const div = document.createElement('div')
div.style.backgroundColor = 'blue'
div.style.fontSize = '16px'
div.style.marginTop = '10px'

div.toString()
// → '<div style="background-color:blue;font-size:16px;margin-top:10px"></div>'
```

---

## Limitations

| Feature | Status | Notes |
|---------|--------|-------|
| `addEventListener` | No-op | Events handled client-side after hydration |
| `querySelector` | Partial | Only `link[href="..."]` selector |
| `querySelectorAll` | ❌ | Not implemented |
| `classList.remove` | ❌ | Not implemented |
| `closest` | Stub | Always returns `null` |
| `localStorage` | Stub | All methods are no-ops |

---

## Integration with SSR

The mock DOM is used by `ltng-server.js` for SSR:

```javascript
// In ltng-server.js (simplified)
const { createWindow } = require('./mocks/mock-dom.js')
const vm = require('vm')

function renderPage(htmlContent) {
    // Create fresh DOM for this request
    const mockWindow = createWindow()
    
    // Create sandbox with mock globals
    const sandbox = {
        window: mockWindow,
        document: mockWindow.document,
        HTMLElement: mockWindow.HTMLElement,
        HTMLBodyElement: mockWindow.HTMLBodyElement,
        HTMLUnknownElement: mockWindow.HTMLUnknownElement,
        console: console,
        // ... other globals
    }
    
    // Run framework and app code in sandbox
    vm.runInNewContext(frameworkCode, sandbox)
    vm.runInNewContext(appCode, sandbox)
    
    // Get rendered HTML
    const bodyHtml = sandbox.document.body.toString()
    return bodyHtml
}
```

---

## Exports

```javascript
const {
    createWindow,       // Factory: () → Window
    HTMLElement,        // Class
    HTMLBodyElement,    // Class
    HTMLUnknownElement, // Class
    HTMLLinkElement,    // Class
    Node,               // Class
    TextNode            // Class
} = require('./mocks/mock-dom.js')
```

---

## Design Decisions

1. **Minimal API**: Only what's needed for rendering, nothing more
2. **No Dependencies**: Pure JavaScript for portability
3. **Factory Pattern**: `createWindow()` prevents request pollution
4. **CJS Module**: CommonJS for Node.js compatibility
5. **toString() Serialization**: Each node knows how to render itself
