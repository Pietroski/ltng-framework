// export * from '../../ltng-framework.js'
// export * from '../../ltng-components/index.mjs'
// export * from '../../ltng-testingtools/index.mjs'
// export * from '../../ltng-tools/index.mjs'
// export * from '../../ltng-book/ltng-book.mjs'

import * as ltng_framework from '../../ltng-framework.js'
import * as ltng_testingtools from '../../ltng-testingtools/index.mjs'
import * as ltng_tools from '../../ltng-tools/index.mjs'
import * as ltng_book from '../../ltng-book/ltng-book.mjs'
import * as ltng_components from '../../ltng-components/index.mjs'

Object.assign(window, ltng_framework)
Object.assign(window, ltng_testingtools)
Object.assign(window, ltng_tools)
Object.assign(window, ltng_book)
Object.assign(window, ltng_components)

export {
    ltng_framework,
    ltng_testingtools,
    ltng_tools,
    ltng_components,
    ltng_book
}
