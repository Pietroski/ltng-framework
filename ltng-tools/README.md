# ltng-tools

A collection of utility libraries for the `ltng-framework`, covering data conversion, internationalization, random data generation, and HTTP transport.

## Installation

This package is part of the `ltng-framework` monorepo.

```javascript
import tools from './path/to/ltng-tools/index.mjs';
// OR import specific sub-modules
import * as converter from './path/to/ltng-tools/converter/index.mjs';
import i18n from './path/to/ltng-tools/internationalisation/index.mjs';
import * as random from './path/to/ltng-tools/random/index.mjs';
import * as transport from './path/to/ltng-tools/transport/index.mjs';
```

## Modules

### Converter (`converter/`)
Utilities for string and object key case conversion.

- **`lowerCamelCaseToLowerCaseLowerKebabCase(camelStr)`**: Converts `camelCase` to `kebab-case`.
- **`kebabToLowerSnakeCase(kebabStr)`**: Converts `kebab-case` to `snake_case`.
- **`lowerCamelCaseToLowerCaseLowerSnakeCase(camelStr)`**: Converts `camelCase` to `snake_case`.
- **`objStrDasher(obj)`**: returns a new object where all keys are converted to `kebab-case`.
- **`camelToKebabCase(camelStr)`**: (From `style.mjs`) Converts camel to kebab case.
- **`styleObjToCssResult(styleObj)`**: (From `style.mjs`) Converts a style object to a CSS string.

### Internationalisation (`internationalisation/`)
A simple dictionary-based i18n library.

#### Usage
```javascript
import translator from './path/to/ltng-tools/internationalisation/index.mjs';

const dictionaries = {
    en: { welcome: "Welcome" },
    pt: { welcome: "Bem-vindo" }
};

const lang = translator.MakeDictionaries(dictionaries, "en");

console.log(lang.t().welcome); // "Welcome"
lang.setLocale("pt");
console.log(lang.t().welcome); // "Bem-vindo"
```

#### API
- **`MakeDictionaries(dictionaries, defaultLocale)`**: Creates a translator instance.
    - `getLocale()`: Returns current locale.
    - `setLocale(locale)`: Sets the current locale.
    - `t()` / `text()`: Returns the current dictionary object.
    - `tFrom(locale)` / `textFrom(locale)`: Returns a specific locale's dictionary.

### Random (`random/`)
Utilities for generating random data.

- **`randomIntFromInterval(min, max)`**: Returns a random integer between min and max (inclusive).
- **`randomStr(length)`**: Returns a random alphanumeric string.
- **`generatePass()`**: Generates a random 8-character password with special characters.
- **`randomStrWithPrefixWithSep(length, prefix, separator)`**: Returns a random string with a prefix.
- **`randomEmail()`**: Generates a random email address.

### Transport (`transport/`)
HTTP client wrapper over `fetch`.

#### Usage
```javascript
import { HttpClient } from './path/to/ltng-tools/transport/index.mjs';

const client = HttpClient({ baseURL: "https://api.example.com" });

const response = await client.Get("/users");
if (response.Err) {
    console.error("Error:", response.Err);
} else {
    console.log("Data:", response.Data);
}
```

#### API
- **`HttpClient(config)`**: Factory to create a client instance.
    - `config.baseURL`: Base URL for requests.
    - Methods: `Get`, `Post`, `Put`, `Patch`, `Delete`, `Any`.
    - Each method returns `{ StatusCode, Data, Err }`.
