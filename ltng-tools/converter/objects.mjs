import { lowerCamelCaseToLowerCaseLowerKebabCase } from './strings.mjs'

const objStrDasher = (obj) =>
	Object.entries(obj || {}).reduce(
		(previousValue, [key, value]) => ({
			...previousValue,
			[lowerCamelCaseToLowerCaseLowerKebabCase(key)]: value,
		}), {},
	)

export {
	objStrDasher
}
