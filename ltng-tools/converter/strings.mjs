const lowerCamelCaseToLowerCaseLowerKebabCase = (camel) =>
	camel.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())

// kebabToLowerSnakeCase transform a string from kebab to lower snake case
const kebabToLowerSnakeCase = (kebab) =>
	kebab.replaceAll('-', '_').toLowerCase()

// lowerCamelCaseToLowerCaseLowerSnakeCase transform a string from lower camel case to lower snake case
const lowerCamelCaseToLowerCaseLowerSnakeCase = (camel) =>
	camel.replace(/[A-Z]/g, (m) => '_' + m.toLowerCase())

export {
	lowerCamelCaseToLowerCaseLowerKebabCase,
	kebabToLowerSnakeCase,
	lowerCamelCaseToLowerCaseLowerSnakeCase
}
