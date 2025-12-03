import { styleToString } from '../../ltng-tools/converter/index.mjs'

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
window.loadCSS(new URL('../styles/theme.css', import.meta.url).href)
window.loadCSS(new URL('./containers.css', import.meta.url).href)

export const Div = (props, ...children) => {
	const { className = '', style, ...rest } = props || {}

    const classes = ['ltng-container']
    if (className) classes.push(className)

    const containerProps = {
		...rest,
		class: classes.join(' ')
	}
    if (style) containerProps.style = typeof style === 'object' ? styleToString(style) : style

	return div(containerProps, ...children)
}

Div.Flex = (props, ...children) => {
	const { className = '', style, ...rest } = props || {}

    const classes = ['ltng-container', 'ltng-container--flex']
    if (className) classes.push(className)

    const containerProps = {
		...rest,
		class: classes.join(' ')
	}
    if (style) containerProps.style = typeof style === 'object' ? styleToString(style) : style

	return div(containerProps, ...children)
}

Div.Grid = (props, ...children) => {
	const { className = '', style, ...rest } = props || {}

    const classes = ['ltng-container', 'ltng-container--grid']
    if (className) classes.push(className)

    const containerProps = {
		...rest,
		class: classes.join(' ')
	}
    if (style) containerProps.style = typeof style === 'object' ? styleToString(style) : style

	return div(containerProps, ...children)
}
