/**
 * LTNG Shop - Shared Store
 * 
 * This file defines the global store that is shared across all HTML pages.
 * All pages import this file to access the same persisted state.
 * 
 * State Structure:
 * - products: Array of product objects
 * - cart: Array of cart items with quantities
 * - filter: Current product filter ("all" | category name)
 * - theme: Current color theme ("light" | "dark" | "ocean" | "forest")
 * - currency: Currency code ("USD" | "EUR" | "GBP")
 * - user: User profile { name, email }
 * - preferences: User preferences { showNotifications, soundEnabled }
 * - orderHistory: Array of past orders
 * - notification: Current notification { message, type } or null
 */

// Initialize the global app store with persistence
window.appStore = createStore({
	// Products catalog
	products: [],
	
	// Shopping cart
	cart: [],
	
	// Current filter for products page
	filter: "all",
	
	// UI preferences
	theme: "light",
	currency: "USD",
	
	// User profile
	user: {
		name: "",
		email: ""
	},
	
	// Notification preferences
	preferences: {
		showNotifications: true,
		soundEnabled: false
	},
	
	// Order history
	orderHistory: [],
	
	// Current notification (transient, not really needed to persist but ok)
	notification: null
	
}, { persist: 'ltngShopState' })

// Debug helper: Log state changes in development
if (location.hostname === 'localhost') {
	appStore.subscribe((state) => {
		console.log('[LTNG Store] State updated:', {
			cart: state.cart.length + ' items',
			filter: state.filter,
			theme: state.theme,
			currency: state.currency,
			orders: state.orderHistory.length
		})
	})
}
