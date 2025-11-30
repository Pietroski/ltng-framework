const lowerCamelCaseToLowerCaseLowerKebabCase = (camel) =>
  camel.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())

// kebabToLowerSnakeCase transform a string from kebab to lower snake case
const kebabToLowerSnakeCase = (kebab) =>
  kebab.replaceAll('-', '_').toLowerCase()

module.exports = {
  lowerCamelCaseToLowerCaseLowerKebabCase,
  kebabToLowerSnakeCase
}
