import { registerStory } from './registry.mjs'
import { Card } from '../../../ltng-components/index.mjs'

registerStory('Card', 'Card component with Closable variants.', () => {
	return div({ style: 'display: flex; flex-direction: column; gap: 20px; align-items: flex-start;' },
		div({},
			h3({}, 'Default (Light Mode)'),
			Card({ darkMode: true }, 'I am a Card')
		),
		div({},
			h3({}, 'Default (Dark Mode)'),
			Card({ darkMode: false }, 'I am a Dark Card')
		),
		div({},
			h3({}, 'Closable (Click X to alert)'),
			Card.Closable({
				darkMode: true,
				onCloseClick: () => alert('Close clicked!')
			}, 'I am Closable')
		),
		div({},
			h3({}, 'Self Closable (Click X to remove)'),
			Card.SelfClosable({
				darkMode: true
			}, 'I remove myself')
		)
	)
})
