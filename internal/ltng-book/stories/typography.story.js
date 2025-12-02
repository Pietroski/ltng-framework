import { registerStory } from './registry.js'
import { Typography } from '../../../ltng-components/typography/typography.js'

registerStory('Typography', 'Typography components (H1-H5, P, Span) with dark mode support.', () => {
	return div({ style: 'display: flex; flex-direction: column; gap: 20px;' },
		div({},
			Typography.H3({ darkMode: false }, 'Dark Mode (Default)'),
			div({ style: 'background-color: #333; padding: 20px; border-radius: 8px;' },
				Typography.H1({ darkMode: true }, 'Heading 1'),
				Typography.H2({ darkMode: true }, 'Heading 2'),
				Typography.H3({ darkMode: true }, 'Heading 3'),
				Typography.H4({ darkMode: true }, 'Heading 4'),
				Typography.H5({ darkMode: true }, 'Heading 5'),
				Typography.Paragraph({ darkMode: true }, 'This is a paragraph of text.'),
				Typography.Span({ darkMode: true }, 'This is a span.')
			)
		),
		div({},
			Typography.H3({ darkMode: false }, 'Light Mode'),
			div({ style: 'background-color: #eee; padding: 20px; border-radius: 8px;' },
				Typography.H1({ darkMode: false }, 'Heading 1'),
				Typography.H2({ darkMode: false }, 'Heading 2'),
				Typography.H3({ darkMode: false }, 'Heading 3'),
				Typography.H4({ darkMode: false }, 'Heading 4'),
				Typography.H5({ darkMode: false }, 'Heading 5'),
				Typography.Paragraph({ darkMode: false }, 'This is a paragraph of text.'),
				Typography.Span({ darkMode: false }, 'This is a span.')
			)
		)
	)
})
