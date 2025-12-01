const toStyles = (obj) =>
	Object.entries(obj || {}).reduce(
		(previousValue, [key, value]) => ({
			...previousValue,
			[key.startsWith('moz') || key.startsWith('webkit') ? `-${key}` : key]: value,
		}),
		{},
	)

module.exports = {
	toStyles
}
