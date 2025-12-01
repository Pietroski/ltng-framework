// Helper to convert style object to string
function styleToString(styleObj) {
	return Object.entries(styleObj || {}).map(([key, value]) => {
		const kebabKey = key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
		return `${kebabKey}: ${value}`
	}).join('; ')
}

export const FlexStyleOpts = {
	FD: {
		Row: { flexDirection: 'row' },
		Column: { flexDirection: 'column' },
		RowReverse: { flexDirection: 'row-reverse' },
		ColumnReverse: { flexDirection: 'column-reverse' },
	},
	JC: {
		Center: { justifyContent: 'center' },
		FlexStart: { justifyContent: 'flex-start' },
		FlexEnd: { justifyContent: 'flex-end' },
		SpaceAround: { justifyContent: 'space-around' },
		SpaceBetween: { justifyContent: 'space-between' },
		SpaceEvenly: { justifyContent: 'space-evenly' },
	},
	AC: {
		Center: { alignContent: 'center' },
		FlexStart: { alignContent: 'flex-start' },
		FlexEnd: { alignContent: 'flex-end' },
		Stretch: { alignContent: 'stretch' },
		SpaceAround: { alignContent: 'space-around' },
		SpaceBetween: { alignContent: 'space-between' },
	},
	AI: {
		Center: { alignItems: 'center' },
		FlexStart: { alignItems: 'flex-start' },
		FlexEnd: { alignItems: 'flex-end' },
		Stretch: { alignItems: 'stretch' },
	},
}

// Load styles
window.loadCSS('/pkg/styles/theme.css')
window.loadCSS('/pkg/components/containers.css')

// Alias global Div to avoid recursion if we named it Div
const GlobalDiv = window.Div

export const Div = (props, ...children) => {
	const { className = '', style, ...rest } = props || {}

    const classes = ['ltng-container']
    if (className) classes.push(className)

	return GlobalDiv({
		...rest,
		class: classes.join(' '),
        style: typeof style === 'object' ? styleToString(style) : style
	}, ...children)
}

Div.Flex = (props, ...children) => {
	const { className = '', style, ...rest } = props || {}

    const classes = ['ltng-container', 'ltng-container--flex']
    if (className) classes.push(className)

	return GlobalDiv({
		...rest,
		class: classes.join(' '),
        style: typeof style === 'object' ? styleToString(style) : style
	}, ...children)
}

Div.Grid = (props, ...children) => {
	const { className = '', style, ...rest } = props || {}

    const classes = ['ltng-container', 'ltng-container--grid']
    if (className) classes.push(className)

	return GlobalDiv({
		...rest,
		class: classes.join(' '),
        style: typeof style === 'object' ? styleToString(style) : style
	}, ...children)
}
