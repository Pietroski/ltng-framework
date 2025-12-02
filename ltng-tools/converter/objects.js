const { lowerCamelCaseToLowerCaseLowerKebabCase } = require('./strings')

const objStrDasher = (obj) =>
	Object.entries(obj || {}).reduce(
		(previousValue, [key, value]) => ({
			...previousValue,
			[lowerCamelCaseToLowerCaseLowerKebabCase(key)]: value,
		}), {},
	)

module.exports = {
	objStrDasher
}
