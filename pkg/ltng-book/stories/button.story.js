import { registerStory } from './registry.js'
import { Button } from '../../../pkg/components/button.js'

registerStory('Button', 'Button component with Primary and Secondary variants.', () => {
	return Div({ style: 'display: flex; flex-direction: column; gap: 20px;' },
		Div({},
			H3({}, 'Default'),
			Button({ onClick: () => alert('Default Clicked') }, 'Default Button')
		),
		Div({},
			H3({}, 'Primary'),
			Button.Primary({ onClick: () => alert('Primary Clicked') }, 'Primary Button')
		),
		Div({},
			H3({}, 'Secondary'),
			Button.Secondary({ onClick: () => alert('Secondary Clicked') }, 'Secondary Button')
		),
		Div({},
			H3({}, 'Disabled'),
			Button({ disabled: true }, 'Disabled Button')
		)
	)
})
