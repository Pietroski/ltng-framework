import { registerStory } from './registry.js'
import { Footer } from '../../../ltng-components/footer/footer.js'
import { Typography } from '../../../ltng-components/typography/typography.js'
import { Div } from '../../../ltng-components/container/containers.js'

registerStory('Footer', 'Footer component with default styling.', () => {
	return Div({ style: { display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' } },
		Div({},
			Typography.H3({ darkMode: false }, 'Default Footer'),
			Footer({},
				Typography.H4({ darkMode: true }, 'Footer Content'),
				Typography.Paragraph({ darkMode: true }, 'Copyright 2023')
			)
		),
		Div({},
			Typography.H3({ darkMode: false }, 'Custom Footer'),
			Footer({ style: { backgroundColor: '#333', minHeight: '100px' } },
				Typography.Paragraph({ darkMode: true }, 'Custom styled footer')
			)
		)
	)
})

