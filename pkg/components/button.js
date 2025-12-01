// Helper to convert style object to string
function styleToString(styleObj) {
    return Object.entries(styleObj || {}).map(([key, value]) => {
        const kebabKey = key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
        return `${kebabKey}: ${value}`
    }).join('; ')
}

const BaseStyles = {
    padding: '10px 20px',
    border: '1px solid transparent',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontFamily: 'inherit',
    transition: 'background-color 0.2s, color 0.2s',
}

const PrimaryStyles = {
    ...BaseStyles,
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
}

const SecondaryStyles = {
    ...BaseStyles,
    backgroundColor: 'transparent',
    color: '#1976d2',
    border: '1px solid #1976d2',
}

const DisabledStyles = {
    backgroundColor: 'gray',
    cursor: 'not-allowed',
    color: 'white',
}

export const Button = (props, ...children) => {
    const { variant = 'default', disabled, style, ...rest } = props || {}
    
    let componentStyles = { ...BaseStyles }

    if (variant === 'primary') {
        componentStyles = { ...componentStyles, ...PrimaryStyles }
    } else if (variant === 'secondary') {
        componentStyles = { ...componentStyles, ...SecondaryStyles }
    }

    if (disabled) {
        componentStyles = { ...componentStyles, ...DisabledStyles }
    }

    // Merge custom styles
    if (style) {
        componentStyles = { ...componentStyles, ...style }
    }

    // Use the global Button from ltng-framework
    // Use the global Button from ltng-framework
    const buttonProps = {
        ...rest,
        style: styleToString(componentStyles)
    };

    if (disabled) {
        buttonProps.disabled = true;
    }

    return window.Button(buttonProps, ...children)
}

Button.Primary = (props, ...children) => Button({ ...props, variant: 'primary' }, ...children)
Button.Secondary = (props, ...children) => Button({ ...props, variant: 'secondary' }, ...children)
