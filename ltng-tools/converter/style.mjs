// Helper to convert style object to string
const styleToString = (styleObj) => Object.entries(styleObj || {}).map(([key, value]) => {
    const kebabKey = key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
    return `${kebabKey}: ${value}`
}).join('; ')

const toStyles = (obj) =>
    Object.entries(obj || {}).reduce(
        (previousValue, [key, value]) => ({
            ...previousValue,
            [key.startsWith('moz') || key.startsWith('webkit') ? `-${key}` : key]: value,
        }),
        {},
    )

export {
    toStyles,
    styleToString
}
