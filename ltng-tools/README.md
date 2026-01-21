# ltng-tools

> **Utility libraries for the ltng-framework**

A collection of zero-dependency utilities covering data conversion, internationalization, random data generation, and HTTP transport.

---

## Quick Start

```javascript
// Import all tools
import tools from './ltng-tools/index.mjs'

// Or import specific modules
import * as converter from './ltng-tools/converter/index.mjs'
import i18n from './ltng-tools/internationalisation/index.mjs'
import * as random from './ltng-tools/random/index.mjs'
import { HttpClient } from './ltng-tools/transport/index.mjs'
```

---

## Modules

| Module | Purpose |
|--------|---------|
| [converter](#converter) | String/object case conversion, style utilities |
| [internationalisation](#internationalisation) | Dictionary-based i18n |
| [random](#random) | Random numbers, strings, emails, passwords |
| [transport](#transport) | HTTP client wrapper over fetch |

---

## Converter

Utilities for string and object key case conversion, plus CSS style helpers.

### String Conversions

```javascript
import { 
    lowerCamelCaseToLowerCaseLowerKebabCase,
    kebabToLowerSnakeCase,
    lowerCamelCaseToLowerCaseLowerSnakeCase
} from './ltng-tools/converter/index.mjs'

// camelCase → kebab-case
lowerCamelCaseToLowerCaseLowerKebabCase('backgroundColor')
// → 'background-color'

// kebab-case → snake_case
kebabToLowerSnakeCase('my-variable-name')
// → 'my_variable_name'

// camelCase → snake_case
lowerCamelCaseToLowerCaseLowerSnakeCase('myVariableName')
// → 'my_variable_name'
```

### Object Key Conversion

```javascript
import { objStrDasher } from './ltng-tools/converter/index.mjs'

// Convert all object keys from camelCase to kebab-case
objStrDasher({ 
    backgroundColor: 'red', 
    fontSize: '16px' 
})
// → { 'background-color': 'red', 'font-size': '16px' }
```

### Style Utilities

```javascript
import { styleToString, toStyles } from './ltng-tools/converter/index.mjs'

// Convert style object to CSS string (handles camelCase → kebab-case)
styleToString({ 
    backgroundColor: 'blue', 
    fontSize: '14px' 
})
// → 'background-color: blue; font-size: 14px'

// Add '-' prefix to vendor keys (moz, webkit) - does NOT convert camelCase
toStyles({ 
    mozTransform: 'rotate(45deg)',
    webkitTransform: 'rotate(45deg)',
    transform: 'rotate(45deg)'
})
// → { '-mozTransform': 'rotate(45deg)', '-webkitTransform': 'rotate(45deg)', 'transform': 'rotate(45deg)' }

// To get proper CSS: combine toStyles with styleToString
styleToString(toStyles({ 
    webkitBackdropFilter: 'blur(10px)',
    backdropFilter: 'blur(10px)'
}))
// → '-webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px)'
```

### API Reference

| Function | Input | Output | Description |
|----------|-------|--------|-------------|
| `lowerCamelCaseToLowerCaseLowerKebabCase` | `string` | `string` | camelCase → kebab-case |
| `kebabToLowerSnakeCase` | `string` | `string` | kebab-case → snake_case |
| `lowerCamelCaseToLowerCaseLowerSnakeCase` | `string` | `string` | camelCase → snake_case |
| `objStrDasher` | `object` | `object` | Convert all keys to kebab-case |
| `styleToString` | `object` | `string` | Style object → CSS string (converts camelCase) |
| `toStyles` | `object` | `object` | Add `-` prefix to moz/webkit keys only |

---

## Internationalisation

A lightweight dictionary-based i18n library.

### Basic Usage

```javascript
import translator from './ltng-tools/internationalisation/index.mjs'

// Define dictionaries for each locale
const dictionaries = {
    en: { 
        welcome: 'Welcome',
        greeting: 'Hello, {name}!',
        buttons: {
            submit: 'Submit',
            cancel: 'Cancel'
        }
    },
    pt_br: { 
        welcome: 'Bem-vindo',
        greeting: 'Olá, {name}!',
        buttons: {
            submit: 'Enviar',
            cancel: 'Cancelar'
        }
    },
    es: { 
        welcome: 'Bienvenido',
        greeting: '¡Hola, {name}!',
        buttons: {
            submit: 'Enviar',
            cancel: 'Cancelar'
        }
    }
}

// Create translator with default locale
const lang = translator.MakeDictionaries(dictionaries, 'en')

// Get translations
console.log(lang.t().welcome)           // 'Welcome'
console.log(lang.t().buttons.submit)    // 'Submit'

// Change locale
lang.setLocale('pt-BR')  // Automatically converts to 'pt_br'
console.log(lang.t().welcome)           // 'Bem-vindo'

// Get specific locale without changing current
console.log(lang.tFrom('es').welcome)   // 'Bienvenido'

// Check current locale
console.log(lang.getLocale())           // 'pt_br'
```

### API Reference

| Method | Arguments | Returns | Description |
|--------|-----------|---------|-------------|
| `MakeDictionaries` | `dictionaries, defaultLocale` | `Translator` | Create translator instance |
| `getLocale` | — | `string` | Get current locale |
| `setLocale` | `locale` | — | Set current locale (converts kebab to snake_case) |
| `t` / `text` | — | `object` | Get current locale's dictionary |
| `tFrom` / `textFrom` | `locale` | `object` | Get specific locale's dictionary |

### Notes

- Locale keys should use `snake_case` (e.g., `pt_br`, `en_us`)
- `setLocale` automatically converts `kebab-case` to `snake_case` (`pt-BR` → `pt_br`)
- Dictionaries can be nested objects

---

## Random

Utilities for generating random data, useful for testing and mocking.

### Numbers

```javascript
import { randomIntFromInterval } from './ltng-tools/random/index.mjs'

// Random integer between min and max (inclusive)
randomIntFromInterval(1, 100)  // → 42
randomIntFromInterval(0, 1)    // → 0 or 1
```

### Strings

```javascript
import { 
    randomStr,
    randomStrWithPrefixWithSep,
    generatePass,
    randomEmail
} from './ltng-tools/random/index.mjs'

// Random alphanumeric string
randomStr(8)           // → 'xK9mP2qL'
randomStr(16)          // → 'aB3cD4eF5gH6iJ7k'

// Random string with prefix
randomStrWithPrefixWithSep(6, 'user', '-')
// → 'user-xK9mP2'

randomStrWithPrefixWithSep(8, 'test', '_')
// → 'test_aB3cD4eF'

// Random 8-character password (includes @#$ special chars)
generatePass()         // → 'aB3$cD4@'

// Random email address
randomEmail()          // → 'xK9mP2qLaB3@cD4eF.gh'
```

### API Reference

| Function | Arguments | Returns | Description |
|----------|-----------|---------|-------------|
| `randomIntFromInterval` | `min, max` | `number` | Random integer (inclusive) |
| `randomStr` | `length` | `string` | Alphanumeric string |
| `randomStrWithPrefixWithSep` | `length, prefix, separator` | `string` | Prefixed random string |
| `generatePass` | — | `string` | 8-char password with specials |
| `randomEmail` | — | `string` | Random email address |

---

## Transport

HTTP client wrapper over the native `fetch` API with a consistent response format.

### Creating a Client

```javascript
import { HttpClient } from './ltng-tools/transport/index.mjs'

const client = HttpClient({ 
    baseURL: 'https://api.example.com' 
})
```

### Making Requests

```javascript
// GET request
const users = await client.Get('/users')
const user = await client.Get('/users/123', { 
    Authorization: 'Bearer token123' 
})

// POST request
const newUser = await client.Post('/users', {
    name: 'John Doe',
    email: 'john@example.com'
})

// PUT request
const updated = await client.Put('/users/123', {
    name: 'John Updated'
})

// PATCH request
const patched = await client.Patch('/users/123', {
    status: 'active'
})

// DELETE request
const deleted = await client.Delete('/users/123')

// Any HTTP method
const custom = await client.Any('OPTIONS', '/users', null, {
    'Access-Control-Request-Method': 'POST'
})
```

### Response Format

All methods return a consistent response object:

```javascript
{
    StatusCode: 200,       // HTTP status code
    Data: { ... },         // Parsed JSON response (or null)
    Err: null              // Error object (or null if success)
}
```

### Error Handling

```javascript
const response = await client.Get('/users')

if (response.Err) {
    console.error('Request failed:', response.Err)
    console.error('Status:', response.StatusCode)
} else {
    console.log('Data:', response.Data)
}

// Error object structure
{
    cause: 'external service call',
    message: 'request response',
    name: 'external error'
}
```

### Default Headers

All requests include these default headers:

```javascript
{
    Accept: 'application/json',
    'Content-type': 'application/json; charset=UTF-8'
}
```

Override with custom headers in any request:

```javascript
await client.Post('/upload', data, {
    'Content-type': 'multipart/form-data'
})
```

### Advanced Exports

```javascript
import { 
    HttpClient,           // Main client factory
    asyncDataParser,      // Parse fetch response
    defaultHeaders,       // Default headers object
    AnyServerRequest,     // Low-level request function
    ExternalServiceCallErr,  // Error factory
    MapHttpResponseInfo      // Response mapper
} from './ltng-tools/transport/index.mjs'
```

### API Reference

| Method | Arguments | Returns | Description |
|--------|-----------|---------|-------------|
| `Get` | `url, headers?` | `Promise<Response>` | GET request |
| `Post` | `url, body?, headers?` | `Promise<Response>` | POST request |
| `Put` | `url, body?, headers?` | `Promise<Response>` | PUT request |
| `Patch` | `url, body?, headers?` | `Promise<Response>` | PATCH request |
| `Delete` | `url, headers?` | `Promise<Response>` | DELETE request |
| `Any` | `method, url, body?, headers?` | `Promise<Response>` | Custom method |

### Helper Functions

| Function | Description |
|----------|-------------|
| `ExternalServiceCallErr()` | Create error object for failed requests |
| `MapHttpResponseInfo(response)` | Normalize response to standard format |

---

## File Structure

```
ltng-tools/
├── index.mjs                    # Main entry (exports all)
├── converter/
│   ├── index.mjs                # Re-exports all converter utils
│   ├── strings.mjs              # String case converters
│   ├── objects.mjs              # Object key converters
│   └── style.mjs                # CSS style helpers
├── internationalisation/
│   └── index.mjs                # i18n dictionary system
├── random/
│   ├── index.mjs                # Re-exports all random utils
│   ├── number.mjs               # Random number generators
│   └── string.mjs               # Random string generators
└── transport/
    ├── index.mjs                # Re-exports HTTP client
    └── http/
        ├── client.mjs           # HttpClient factory
        └── models.mjs           # Response models/helpers
```

---

## Testing

Each module includes corresponding test files:

```bash
# Run tests (from ltng-framework root)
node ltng-testingtools/runner.mjs ltng-tools/**/*.test.mjs
```

---

## Design Principles

1. **Zero Dependencies**: Pure JavaScript, no external packages
2. **ESM Only**: Modern ES modules with named exports
3. **Consistent APIs**: Predictable function signatures
4. **Type-Safe Patterns**: Clear input/output structures
5. **Testable**: Each function is pure and testable
