# LTNG Framework: State Management Guide

> **For LLMs and Developers**: This document explains how to manage state within and across HTML pages using the ltng-framework's `createStore` API.

---

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [Creating a Store](#creating-a-store)
3. [Selective Subscriptions](#selective-subscriptions)
4. [Persistence Across Pages](#persistence-across-pages)
5. [Reactive Helpers](#reactive-helpers)
6. [Common Patterns](#common-patterns)
7. [API Reference](#api-reference)

---

## Core Concepts

The ltng-framework uses a **pub/sub pattern** for state management:

- **Store**: A container holding state as a plain JavaScript object
- **Subscribers**: Functions that react to state changes
- **Selective Subscriptions**: Subscribers can watch specific keys, not the entire state
- **Persistence**: State can be saved to `localStorage` and restored across page loads

---

## Creating a Store

### Basic Store

```javascript
const store = createStore({ count: 0, name: "Default" })

// Read state
console.log(store.getState())  // { count: 0, name: "Default" }

// Update state (partial updates only)
store.setState({ count: 5 })
console.log(store.getState())  // { count: 5, name: "Default" }
```

### Persisted Store

Pass a `persist` key to save state to `localStorage`:

```javascript
const store = createStore(
    { count: 0, name: "Default" },
    { persist: 'myAppState' }  // Key used in localStorage
)
```

When the page reloads, the store automatically loads saved state:
- Saved values **override** initial values
- New keys in `initialState` are preserved (forward compatibility)

---

## Selective Subscriptions

Subscribers can watch **specific keys** to avoid unnecessary re-renders.

### Watch All Changes (Default)

```javascript
store.subscribe((state) => {
    console.log("Any change:", state)
})
```

### Watch Specific Keys

```javascript
// Only triggers when 'count' changes
store.subscribe(({ count }) => {
    console.log("Count changed:", count)
    document.getElementById("counter").textContent = count
}, ['count'])

// Only triggers when 'user' changes
store.subscribe(({ user }) => {
    console.log("User changed:", user)
}, ['user'])

// Watch multiple keys
store.subscribe(({ count, total }) => {
    console.log("Count or total changed")
}, ['count', 'total'])
```

### How It Works

When `setState` is called:
1. The store compares old and new values for each key
2. Only keys that **actually changed** are considered "changed"
3. Subscribers are notified only if their watched keys intersect with changed keys

```javascript
store.setState({ count: 5, name: "Same" })
// If name was already "Same", only 'count' subscribers trigger
```

### Unsubscribing

`subscribe` returns an unsubscribe function:

```javascript
const unsubscribe = store.subscribe((state) => {
    console.log(state)
}, ['count'])

// Later: stop listening
unsubscribe()
```

---

## Persistence Across Pages

### Page 1: Create and Modify State

```html
<!-- index.html -->
<script src="ltng-framework.js"></script>
<script>
    // Create store with persistence
    const store = createStore(
        { count: 0, theme: "light" },
        { persist: 'appState' }
    )
    
    // Modify state
    store.setState({ count: 10 })
    
    // Navigate to another page
    window.location.href = "page2.html"
</script>
```

### Page 2: Restore State

```html
<!-- page2.html -->
<script src="ltng-framework.js"></script>
<script>
    // Use the SAME persist key
    const store = createStore(
        { count: 0, theme: "light" },  // Initial values (will be overridden)
        { persist: 'appState' }
    )
    
    console.log(store.getState())  // { count: 10, theme: "light" }
    // count is 10 because it was loaded from localStorage!
</script>
```

### Important Notes

1. **Same persist key**: Both pages must use the same `persist` key
2. **Initial state as fallback**: Initial values are used only if no saved state exists
3. **Saved values win**: `{ ...initialState, ...savedState }` — saved values override
4. **Forward compatibility**: New keys in `initialState` are preserved

---

## Reactive Helpers

The framework provides helpers for automatic DOM updates.

### `reactive(store, key)` — Text Nodes

Creates a text node that auto-updates when the key changes.

```javascript
// Auto-updating counter display
p({ id: "counter" }, "Count: ", reactive(store, 'count'))

// Auto-updating name
span({}, "Hello, ", reactive(store, 'name'))
```

**Limitation**: Only works with text values (strings, numbers).

### `reactiveElement(store, key, renderFn)` — Full Elements

Re-renders an entire element when the key changes.

```javascript
// Reactive list
reactiveElement(store, 'items', (items) =>
    ul({}, ...items.map(item => li({}, item.name)))
)

// Reactive user card
reactiveElement(store, 'user', (user) =>
    div({ class: 'card' },
        h2({}, user.name),
        p({}, user.email)
    )
)
```

**Use for**: Arrays, objects, or complex values needing full re-render.

### `reactiveAttr(element, attr, store, key)` — Attributes

Makes an element's attribute reactive.

```javascript
// Reactive CSS class
reactiveAttr(div({}, "Content"), 'class', store, 'themeClass')

// Reactive disabled state
reactiveAttr(button({}, "Submit"), 'disabled', store, 'isSubmitting')

// Reactive href
reactiveAttr(a({}, "Link"), 'href', store, 'currentUrl')
```

### `reactiveStyle(element, prop, store, key)` — Inline Styles

Makes an element's style property reactive.

```javascript
// Reactive background color
reactiveStyle(div({}, "Box"), 'backgroundColor', store, 'bgColor')

// Reactive width (e.g., progress bar)
reactiveStyle(div({}, ""), 'width', store, 'progressWidth')

// Reactive visibility
reactiveStyle(div({}, "Modal"), 'display', store, 'modalDisplay')
```

---

## Common Patterns

### Pattern 1: Global Store

```javascript
// Create once, use everywhere
window.globalStore = createStore(
    { user: null, theme: "dark", notifications: [] },
    { persist: 'globalState' }
)
```

### Pattern 2: Counter with Selective Updates

```javascript
const store = createStore({ count: 0, lastUpdated: null })

const app = div({},
    p({}, "Count: ", reactive(store, 'count')),
    p({}, "Last updated: ", reactive(store, 'lastUpdated')),
    button({
        onClick: () => store.setState({
            count: store.getState().count + 1,
            lastUpdated: new Date().toISOString()
        })
    }, "Increment")
)

// These run independently
store.subscribe(({ count }) => {
    console.log("Count is now:", count)
}, ['count'])

store.subscribe(({ lastUpdated }) => {
    console.log("Updated at:", lastUpdated)
}, ['lastUpdated'])
```

### Pattern 3: Theme Switcher Across Pages

```javascript
// On any page
const store = createStore({ theme: "light" }, { persist: 'theme' })

// Apply theme immediately
document.body.className = store.getState().theme

// React to changes
store.subscribe(({ theme }) => {
    document.body.className = theme
}, ['theme'])

// Toggle button
button({
    onClick: () => {
        const current = store.getState().theme
        store.setState({ theme: current === "light" ? "dark" : "light" })
    }
}, "Toggle Theme")
```

### Pattern 4: Form State with Validation

```javascript
const formStore = createStore({
    email: "",
    password: "",
    errors: {}
})

// Only re-validate when fields change
formStore.subscribe(({ email, password }) => {
    const errors = {}
    if (!email.includes("@")) errors.email = "Invalid email"
    if (password.length < 8) errors.password = "Too short"
    formStore.setState({ errors })
}, ['email', 'password'])

// Only update error display when errors change
formStore.subscribe(({ errors }) => {
    document.getElementById("errors").textContent = JSON.stringify(errors)
}, ['errors'])
```

---

## API Reference

### `createStore(initialState, options)`

Creates a new store.

| Parameter | Type | Description |
|-----------|------|-------------|
| `initialState` | `Object` | Initial state object |
| `options.persist` | `string` | localStorage key for persistence (optional) |

**Returns**: `{ getState, setState, subscribe }`

---

### `store.getState()`

Returns the current state object.

```javascript
const state = store.getState()
```

---

### `store.setState(partialState)`

Merges `partialState` into current state and notifies subscribers.

| Parameter | Type | Description |
|-----------|------|-------------|
| `partialState` | `Object` | Keys to update |

```javascript
store.setState({ count: 5 })  // Only updates 'count'
```

---

### `store.subscribe(listener, keys?)`

Subscribes to state changes.

| Parameter | Type | Description |
|-----------|------|-------------|
| `listener` | `Function` | Callback receiving full state |
| `keys` | `string[]` | Optional: only trigger on these keys |

**Returns**: `Function` — unsubscribe function

```javascript
const unsubscribe = store.subscribe((state) => {
    console.log(state)
}, ['count', 'name'])

// Later
unsubscribe()
```

---

### `reactive(store, key)`

Creates auto-updating text node.

```javascript
p({}, reactive(store, 'count'))
```

---

### `reactiveElement(store, key, renderFn)`

Creates auto-replacing element.

```javascript
reactiveElement(store, 'items', (items) => ul({}, ...items.map(...)))
```

---

### `reactiveAttr(element, attr, store, key)`

Makes attribute reactive. Returns element for chaining.

```javascript
reactiveAttr(button({}), 'disabled', store, 'loading')
```

---

### `reactiveStyle(element, prop, store, key)`

Makes style property reactive. Returns element for chaining.

```javascript
reactiveStyle(div({}), 'opacity', store, 'fadeLevel')
```

---

## Implementation Details

### Why Map Instead of Set for Listeners?

The store uses a `Map` with `Symbol` keys instead of a `Set` to store subscribers:

```javascript
const listeners = new Map()

const subscribe = (listener, keys = null) => {
    const id = Symbol()  // Unique identifier
    listeners.set(id, { callback: listener, keys })
    listener(state)
    return () => listeners.delete(id)
}
```

**Reasons**:
1. Each subscriber needs associated metadata (`keys` array)
2. `Symbol()` guarantees unique keys without collision
3. Unsubscribe works by deleting the specific Symbol key
4. The closure captures the Symbol for later deletion

### Selective Notification Logic

```javascript
const setState = (partialState) => {
    const prevState = state
    state = { ...state, ...partialState }
    
    // Find keys that actually changed
    const changedKeys = Object.keys(partialState).filter(
        key => prevState[key] !== state[key]
    )
    
    // Notify only if watched keys intersect
    listeners.forEach(({ callback, keys }) => {
        if (!keys || keys.length === 0 || keys.some(k => changedKeys.includes(k))) {
            callback(state)
        }
    })
}
```

---

## Summary

| Feature | Purpose |
|---------|---------|
| `createStore()` | Create state container |
| `persist` option | Save/restore from localStorage |
| Selective subscriptions | Watch specific keys only |
| `reactive()` | Auto-updating text |
| `reactiveElement()` | Auto-replacing elements |
| `reactiveAttr()` | Auto-updating attributes |
| `reactiveStyle()` | Auto-updating styles |

The design prioritizes **simplicity** and **explicitness** over magic, making it easy to debug and understand data flow across your application.
