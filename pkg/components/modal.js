import { Card } from './card.js'
import { Div } from './containers.js'

// Helper to convert style object to string
function styleToString(styleObj) {
    return Object.entries(styleObj || {}).map(([key, value]) => {
        const kebabKey = key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
        return `${kebabKey}: ${value}`
    }).join('; ')
}

const Colours = {
    DarkGray: '#333',
    MediumDarkerGray: '#444',
    Whitesmoke: 'whitesmoke',
    Primary: '#1976d2',
}

// Base container that covers the screen and centers content
const BaseContainerStyles = (darkMode) => ({
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '1000',
})

// The semi-transparent background overlay
const BackgroundOverlayStyles = (darkMode) => ({
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: Colours.DarkGray,
    opacity: '0.6',
    zIndex: '1',
})

export const Modal = (props, ...children) => {
    const {
        isOpen,
        onClose,
        darkMode = true,
        style,
        closeFromOutside = true,
        ...rest
    } = props || {}

    if (!isOpen) return null

    // The background overlay that handles clicks
    const backgroundOverlay = Div({
        style: BackgroundOverlayStyles(darkMode),
        onClick: (e) => {
            if (closeFromOutside && onClose) {
                onClose(e)
            }
        }
    })

    // The content card
    const content = Card.Closable({
        darkMode,
        onCloseClick: onClose,
        style: {
            width: '500px',
            height: '300px',
            backgroundColor: darkMode ? Colours.MediumDarkerGray : Colours.Whitesmoke,
            color: darkMode ? 'white' : 'black',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative', // Ensure it sits above absolute overlay if needed, though z-index handles it
            zIndex: '2',
            ...(style || {})
        },
        ...rest
    }, ...children)

    // The main container holding both
    const baseContainer = Div({
        style: BaseContainerStyles(darkMode)
    }, backgroundOverlay, content)

    return baseContainer
}
