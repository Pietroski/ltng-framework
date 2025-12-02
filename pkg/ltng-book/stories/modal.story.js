import { registerStory } from './registry.js'
import { Modal } from '../../../pkg/components/modal.js'
import { Button } from '../../../pkg/components/button.js'
import { Div } from '../../../pkg/components/containers.js'
import { Typography } from '../../../pkg/components/typography.js'

registerStory('Modal', 'Modal component with overlay and close actions.', () => {
	// We need state to manage open/close
	// Since stories are functions, we can use a closure or the framework's store if we want.
	// But for simplicity in this vanilla setup, we'll use a variable and re-render logic
	// or just manipulate the DOM.

	// Actually, ltng-book re-renders the whole story when state changes? No.
	// We can create a container and update it.

	const container = Div({ style: { padding: '20px', height: '400px' } })
	let isOpen = false
	let currentDarkMode = true
	let modalElement = null
	const renderModal = () => {
		if (modalElement) {
			modalElement.remove()
			modalElement = null
		}

		if (isOpen) {
			modalElement = Modal({
				isOpen: true,
				onClose: () => {
					isOpen = false
					renderModal()
				},
				darkMode: currentDarkMode
			},
				Typography.H3({ darkMode: currentDarkMode }, 'Hello from Modal!'),
				Typography.Paragraph({
					darkMode: currentDarkMode,
					style: { marginBottom: '20px' }
				}, `This is a ${currentDarkMode ? 'Dark' : 'Light'} modal dialog.`),
				Button.Primary({ onClick: () => { isOpen = false; renderModal() } }, 'Close Me')
			)
			container.appendChild(modalElement)
		}
	}
	const openDarkBtn = Button.Primary({
		onClick: () => {
			isOpen = true
			currentDarkMode = true
			renderModal()
		}
	}, 'Open Dark Modal')
	const openLightBtn = Button.Secondary({
		style: { marginLeft: '20px' },
		onClick: () => {
			isOpen = true
			currentDarkMode = false
			renderModal()
		}
	}, 'Open Light Modal')
	container.style.position = 'relative' // Context for absolute modal
	container.appendChild(Div({ style: { marginBottom: '20px', height: 'auto' } },
		Typography.H3({ darkMode: false }, 'Modal Demo'),
		Typography.Paragraph({ darkMode: false }, 'Click the buttons to open the modal in different modes.')
	))
	container.appendChild(openDarkBtn)
	container.appendChild(openLightBtn)
	return container
})
