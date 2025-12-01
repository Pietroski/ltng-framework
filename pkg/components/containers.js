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

const DefaultContainerStyling = {
	width: '100%',
	height: '100%',
	boxSizing: 'border-box',
}

const FlexContainerStyling = {
	display: 'flex',
}

const GridContainerStyling = {
	display: 'grid',
}

// Alias global Div to avoid recursion if we named it Div
const GlobalDiv = window.Div

export const Div = (props, ...children) => {
	const { style, ...rest } = props || {}

	const componentStyles = {
		...DefaultContainerStyling,
		...(style || {})
	}

	return GlobalDiv({
		...rest,
		style: styleToString(componentStyles)
	}, ...children)
}

Div.Flex = (props, ...children) => {
	const { style, ...rest } = props || {}

	// Allow passing FlexStyleOpts directly in style or via a helper
	// For now, we assume style is a plain object

	const componentStyles = {
		...DefaultContainerStyling,
		...FlexContainerStyling,
		...(style || {})
	}

	return GlobalDiv({
		...rest,
		style: styleToString(componentStyles)
	}, ...children)
}

Div.Grid = (props, ...children) => {
	const { style, ...rest } = props || {}

	const componentStyles = {
		...DefaultContainerStyling,
		...GridContainerStyling,
		...(style || {})
	}

	return GlobalDiv({
		...rest,
		style: styleToString(componentStyles)
	}, ...children)
}
