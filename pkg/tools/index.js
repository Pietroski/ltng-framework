const converter = require('./converter/toStyles')
const objects = require('./objects/objects')
const strings = require('./strings/strings')

module.exports = {
	...converter,
	...objects,
	...strings
}
