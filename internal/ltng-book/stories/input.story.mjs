import { registerStory } from './registry.mjs'
import { Input } from '../../../ltng-components/index.mjs'

registerStory('Input', 'Input component with floating label and password toggle.', () => {
	return div({ style: 'display: flex; flex-direction: column; gap: 20px; width: 300px;' },
		div({},
			h3({}, 'Default (Dark Mode)'),
			Input({
				darkMode: true,
				placeholder: 'Username',
				onChange: (e) => console.log('Input changed:', e.target.value)
			})
		),
		div({},
			h3({}, 'Default (Light Mode)'),
			Input({
				darkMode: false,
				placeholder: 'Email',
				type: 'email'
			})
		),
		div({},
			h3({}, 'Secret (Password)'),
			Input.Secret({
				darkMode: true,
				placeholder: 'Password'
			})
		),
		div({},
			h3({}, 'Secret (Password) (Light Mode)'),
			Input.Secret({
				darkMode: false,
				placeholder: 'Password'
			})
		)
	)
})
