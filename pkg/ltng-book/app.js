import { stories } from './stories/index.js'

// State for the book
const store = createStore({
	currentStory: null
})

// Components
const SidebarItem = (story, isActive) => {
	return div({
		class: `nav-item ${isActive ? 'active' : ''}`,
		onClick: () => store.setState({ currentStory: story.name })
	}, story.name)
}

const Sidebar = (currentStoryName) => {
	return div({ class: 'sidebar' },
		div({
			class: 'sidebar-header',
			style: 'cursor: pointer;',
			onClick: () => store.setState({ currentStory: null })
		}, 'ltng-book'),
		div({ class: 'nav-list' },
			Object.values(stories).map(story =>
				SidebarItem(story, story.name === currentStoryName)
			)
		)
	)
}

const Preview = (story) => {
	if (!story) {
		return div({ class: 'preview-area' },
			div({ style: 'color: #666; text-align: center; margin-top: 50px;' },
				'Select a component to view'
			)
		)
	}

	return div({ class: 'preview-area' },
		div({ class: 'preview-header' },
			h2({}, story.name),
			p({ style: 'color: #666;' }, story.description || '')
		),
		div({ class: 'component-container' },
			story.render()
		)
	)
}

const App = () => {
	const state = store.getState()
	const currentStory = state.currentStory ? stories[state.currentStory] : null
	return div({ style: 'display: flex; width: 100%; height: 100%;' },
		Sidebar(state.currentStory),
		Preview(currentStory)
	)
}

// Initial Render
const root = document.getElementById('root')

if (!root) {
	console.error("Root element not found! If you are running via ltng-server, make sure to use --mode=csr to avoid SSR wiping the static HTML.")
} else {
	store.subscribe(() => {
		root.innerHTML = ''
		root.render(App())
	})
	// Trigger first render
	store.setState({})
}
