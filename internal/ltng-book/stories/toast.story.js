import { registerStory } from './registry.js'
import { Toast } from '../../../ltng-components/toast.js'
import { Button } from '../../../ltng-components/button/button.js'
import { Div } from '../../../ltng-components/container/containers.js'
import { Typography } from '../../../ltng-components/typography/typography.js'

registerStory('Toast', 'Toast notifications.', () => {
	const container = Div({ style: { padding: '20px', height: '400px', position: 'relative' } })
	// Render the Toast Container inside our story container
	// Note: In a real app, this would likely be at the root.
	// Since we use fixed positioning in Toast.Container, it will appear relative to the viewport.
	// To make it appear inside this story container for demo purposes, we might need to override styles.
	// But let's stick to default fixed behavior first to verify it works as intended (overlay).

	container.appendChild(Div({ style: { marginBottom: '20px', height: 'auto' } },
		Toast.Container({ darkMode: true }),
		Typography.H3({ darkMode: false }, 'Toast Demo'),
		Typography.Paragraph({ darkMode: false }, 'Click buttons to show toasts.')
	))
	const btnGroup = Div({ style: { display: 'flex', gap: '10px', height: 'auto', alignItems: 'center' } },
		Button.Primary({
			onClick: () => Toast.success('Operation Successful!')
		}, 'Success'),
		Button.Secondary({
			onClick: () => Toast.warning('Warning: Check your input.')
		}, 'Warning'),
		Button.Primary({
			style: { backgroundColor: '#8b0000', borderColor: '#8b0000' },
			onClick: () => Toast.failure('Error: Something went wrong.')
		}, 'Failure')
	)
	container.appendChild(btnGroup)
	return container
})
