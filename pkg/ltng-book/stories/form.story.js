import { registerStory } from './registry.js'
import { Form, createFormStore } from '../../../pkg/components/form.js'
import { Div } from '../../../pkg/components/containers.js'
import { Typography } from '../../../pkg/components/typography.js'

registerStory('Form', 'Form component with validation and state management.', () => {
	const store = createFormStore({
		username: { id: 'username', value: '', required: true },
		password: { id: 'password', value: '', required: true }
	}, { darkMode: false }) // Set darkMode in config

	const outputDiv = Div({
		style: {
			marginTop: '20px',
			padding: '15px',
			border: '1px solid #ddd',
			borderRadius: '8px',
			backgroundColor: '#f8f9fa',
			fontFamily: 'monospace',
			whiteSpace: 'pre-wrap',
			color: '#333',
			fontSize: '12px',
			boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
		}
	}, 'Form Output: (Submit to see)')

	return Div({ style: { padding: '20px', maxWidth: '400px', height: 'auto' } },
		Typography.H3({ darkMode: false }, 'Login Form'),
		Form({
			style: { marginTop: '20px' },
			store: store,
			onSubmit: (e) => {
				const data = e.formObject
				outputDiv.textContent = `Submitted: ${JSON.stringify(data, null, 2)}`
			}
		},
			Form.Field({
				store: store,
				fieldKey: 'username',
				label: 'Username',
				isRequired: true,
				validation: ({ value }) => value.length < 3 ? new Error('Must be at least 3 chars') : null
			}),
			Form.FieldSecret({
				store: store,
				fieldKey: 'password',
				label: 'Password',
				isRequired: true,
				validation: ({ value }) => value.length < 6 ? new Error('Must be at least 6 chars') : null
			}),
			Div({ style: { display: 'flex', gap: '10px', marginTop: '10px' } },
				Form.PrimaryButton({ store: store }, 'Login'),
				Form.SecondaryButton({ store: store }, 'Reset')
			)
		),
		outputDiv
	)
})
