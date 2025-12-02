import { registerStory } from './registry.js'
import { Button } from '../../../ltng-components/button/button.js'

registerStory('Button', 'Button component with Primary and Secondary variants.', () => {
	return div({ style: 'display: flex; flex-direction: column; gap: 20px;' },
		div({},
			h3({}, 'Default'),
			Button({ onClick: () => alert('Default Clicked') }, 'Default Button')
		),
		div({},
			h3({}, 'Primary'),
			Button.Primary({ onClick: () => alert('Primary Clicked') }, 'Primary Button')
		),
		div({},
			h3({}, 'Secondary'),
			Button.Secondary({ onClick: () => alert('Secondary Clicked') }, 'Secondary Button')
		),
		div({},
			h3({}, 'Disabled'),
			Button({ disabled: true }, 'Disabled Button')
		)
	)
})
