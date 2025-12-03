import { styleToString } from '../../ltng-tools/converter/index.mjs'
import { Button, Div, Input, Typography } from '../index.mjs'

// Load styles
window.loadCSS(new URL('../styles/theme.css', import.meta.url).href)
window.loadCSS(new URL('./form.css', import.meta.url).href)

// Form Store Implementation
export const createFormStore = (initialState = {}, config = {}) => {
	// Use ltng-framework's createStore if available, otherwise simple implementation
	const store = window.createStore ? window.createStore(initialState) : (() => {
		let state = initialState
		const listeners = new Set()
		return {
			getState: () => state,
			setState: (update) => {
				state = { ...state, ...update }
				listeners.forEach(l => l(state))
			},
			subscribe: (l) => {
				listeners.add(l)
				return () => listeners.delete(l)
			}
		}
	})()
	
	return {
		...store,
		config, // Expose config
		GetFormState: () => store.getState(),
		GetFormItemStateByKey: (key) => store.getState()[key],
		SetFormItemState: (item) => {
			const currentState = store.getState()
			store.setState({
				[item.id]: {
					...currentState[item.id],
					...item
				}
			})
		},
		ResetFormState: () => {
			store.setState(initialState)
		}
	}
}

export const Form = (props, ...children) => {
	const { style, onSubmit, store, className = '', ...rest } = props || {}
	
	const classes = ['ltng-form']
	if (className) classes.push(className)
	
	// We use a regular form element, but we need to handle submit manually
	// to prevent page reload and use the store data.
	const form = document.createElement('form')
	// Apply props
	Object.entries(rest).forEach(([key, value]) => {
		if (key === 'class') return // Handle class separately
		else form.setAttribute(key, value)
	})
	form.className = classes.join(' ')
	form.style.cssText = styleToString(style)
	
	form.onsubmit = (e) => {
		e.preventDefault()
		if (onSubmit && store) {
			onSubmit({ ...e, formObject: store.GetFormState() })
		}
	}
	
	// Render children
	// Note: In ltng-framework, children are already DOM nodes usually.
	// But if we want to support passing functions that take the store?
	// For now, we assume children are DOM nodes created with the store passed to them.
	children.forEach(child => {
		if (child) form.appendChild(child)
	})
	
	return form
}

Form.Field = (props) => {
	const {
		store,
		fieldKey,
		label,
		isSecret,
		validation,
		isRequired,
		style,
		darkMode, // Explicit prop overrides store config
		...rest
	} = props
	
	if (!store) {
		console.error('Form.Field requires a "store" prop.')
		return Div({}, 'Error: Missing store')
	}
	
	// Determine darkMode: prop > store config > default (undefined -> Input defaults to true)
	const effectiveDarkMode = darkMode !== undefined
		? darkMode
		: store.config?.darkMode
	
	// Initialize state for this field if not present
	const currentState = store.GetFormState()
	if (!currentState[fieldKey]) {
		store.SetFormItemState({
			id: fieldKey,
			value: '',
			errValue: null,
			required: isRequired
		})
	}
	
	const errorSpan = Typography.Span({
		class: 'ltng-form-error-msg'
	}, '')
	
	const handleInput = (e) => {
		const value = e.target.value
		let err = null
		
		if (isRequired && !value) {
			err = new Error('Required field')
		} else if (validation) {
			err = validation({ value })
		}
		
		store.SetFormItemState({
			id: fieldKey,
			value,
			errValue: err,
			required: isRequired
		})
	}
	
	const inputProps = {
		...rest,
		id: fieldKey,
		placeholder: label,
		onChange: handleInput, // Input component maps this to onInput
		style: style,
		darkMode: effectiveDarkMode
	}
	
	const inputComponent = isSecret ? Input.Secret(inputProps) : Input(inputProps)
	
	// Subscribe to store updates to update UI (error message, value reset)
	store.subscribe((state) => {
		const item = state[fieldKey]
		if (item) {
			// Update input value if it differs (e.g. on reset)
			// We need to find the actual input element inside the component wrapper
			const actualInput = inputComponent.querySelector('input')
			if (actualInput && actualInput.value !== item.value) {
				actualInput.value = item.value || ''
			}
			
			// Update error message
			errorSpan.textContent = item.errValue ? item.errValue.message : ''
		}
	})
	
	return Div({ class: 'ltng-form-field-container' },
		inputComponent,
		errorSpan
	)
}

Form.FieldSecret = (props) => Form.Field({ ...props, isSecret: true })

Form.PrimaryButton = (props, ...children) => {
	const { store, disabled, ...rest } = props
	
	const btn = Button.Primary({
		...rest,
		type: 'submit',
		disabled: disabled // Initial state
	}, ...children)
	
	if (store) {
		store.subscribe((state) => {
			// Check if form is valid
			let shouldDisable = false
			Object.values(state).forEach(item => {
				// Skip non-object items (like booleans, nulls, arrays) or items that don't look like fields
				if (!item || typeof item !== 'object' || Array.isArray(item)) return
				
				if (item.required && (!item.value || item.errValue)) {
					shouldDisable = true
				}
				if (item.errValue) {
					shouldDisable = true
				}
			})
			
			// Update button disabled state
			// Note: Button component might wrap the button.
			// If Button returns a button element directly:
			if (btn.tagName === 'BUTTON') {
				btn.disabled = shouldDisable || disabled
			} else {
				// If it's a wrapper, find the button
				const actualBtn = btn.querySelector('button')
				if (actualBtn) actualBtn.disabled = shouldDisable || disabled
			}
			
			// Visual update is handled by CSS :disabled pseudo-class
		})
	}
	
	return btn
}

Form.SecondaryButton = (props, ...children) => {
	const { store, ...rest } = props
	
	return Button.Secondary({
		...rest,
		type: 'button', // Prevent submit
		onClick: (e) => {
			e.preventDefault()
			if (store) store.ResetFormState()
			if (props.onClick) props.onClick(e)
		}
	}, ...children)
}
