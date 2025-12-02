const { randomIntFromInterval } = require('./number')

function randomStr(length) {
	let result = ''
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	const charactersLength = characters.length
	let counter = 0
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength))
		counter += 1
	}
	return result
}

/* Function to generate combination of password */
function generatePass() {
	let pass = ''
	let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
		'abcdefghijklmnopqrstuvwxyz0123456789@#$'

	for (let i = 1; i <= 8; i++) {
		let char = Math.floor(Math.random()
			* str.length + 1)

		pass += str.charAt(char)
	}

	return pass
}

function randomStrWithPrefixWithSep(length, prefix, separator) {
	return `${prefix}${separator}${randomStr(length)}`
}

function randomEmail() {
	const prefix = randomStr(randomIntFromInterval(5, 22))
	const domain = `${randomStr(randomIntFromInterval(5, 7))}.${randomStr(randomIntFromInterval(2, 3))}`
	return `${prefix}@${domain}`
}

module.exports = {
	randomStr,
	generatePass,
	randomStrWithPrefixWithSep,
	randomEmail
}
