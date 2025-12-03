import { styleToString } from '../../ltng-tools/converter/index.mjs'

// Load styles
window.loadCSS(new URL('../styles/theme.css', import.meta.url).href)
window.loadCSS(new URL('./typography.css', import.meta.url).href)

const createTypographyComponent = (tag, variantClass) => (props, ...children) => {
	const { darkMode = true, className = '', style, ...rest } = props || {}

    const classes = ['ltng-typography']
    
    if (variantClass) {
        classes.push(variantClass)
    }

    if (darkMode) {
        classes.push('ltng-typography--dark')
    } else {
        classes.push('ltng-typography--light')
    }

    if (className) {
        classes.push(className)
    }

	// Use the global element wrappers from ltng-framework if available, or fallback to createElement
	const elementCreator = window[tag] || ((p, ...c) => {
		return window.createElement(tag.toLowerCase(), p, ...c)
	})

	return elementCreator({
		...rest,
		class: classes.join(' '),
        style: typeof style === 'object' ? styleToString(style) : style
	}, ...children)
}

export const Typography = (props, ...children) => {
	return createTypographyComponent('div')(props, ...children)
}

Typography.H1 = createTypographyComponent('h1', 'ltng-typography-h1')
Typography.H2 = createTypographyComponent('h2', 'ltng-typography-h2')
Typography.H3 = createTypographyComponent('h3', 'ltng-typography-h3')
Typography.H4 = createTypographyComponent('h4', 'ltng-typography-h4')
Typography.H5 = createTypographyComponent('h5', 'ltng-typography-h5')
Typography.Paragraph = createTypographyComponent('p', 'ltng-typography-p')
Typography.Span = createTypographyComponent('span', 'ltng-typography-span')
