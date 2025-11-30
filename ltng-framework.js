/**
 * ltng-framework - A lightweight vanilla JS framework
 */

// UUID v7 Generator
function generateUUIDv7() {
    // 1. Get current timestamp in milliseconds
    const timestamp = Date.now();

    // 2. Generate 16 bytes (128 bits) of random data
    const value = new Uint8Array(16);
    crypto.getRandomValues(value);

    // 3. Encode timestamp into the first 48 bits (6 bytes)
    // High 32 bits
    value[0] = (timestamp >> 40) & 0xff;
    value[1] = (timestamp >> 32) & 0xff;
    value[2] = (timestamp >> 24) & 0xff;
    value[3] = (timestamp >> 16) & 0xff;
    // Low 16 bits
    value[4] = (timestamp >> 8) & 0xff;
    value[5] = timestamp & 0xff;

    // 4. Set Version to 7 (0111) in the 4 high bits of the 7th byte
    value[6] = (value[6] & 0x0f) | 0x70;

    // 5. Set Variant to 10xx in the 2 high bits of the 9th byte
    value[8] = (value[8] & 0x3f) | 0x80;

    // 6. Convert array to standard UUID string format
    return [...value].map((b, i) => {
        const hex = b.toString(16).padStart(2, '0');
        // Insert hyphens at specific positions
        return (i === 4 || i === 6 || i === 8 || i === 10) ? `-${hex}` : hex;
    }).join('');
}

// Core Element Creator
function createElement(tag, props, ...children) {
    const element = document.createElement(tag);

    // Handle props
    if (props) {
        if (props.class === undefined) {
            props.class = tag.toLowerCase();
        }
        if (props.id === undefined) {
            props.id = generateUUIDv7();
        }
        // if (props.type === undefined) {
        //     props.type = tag.toLowerCase();
        // }

        for (const [key, value] of Object.entries(props)) {
            // Handle special cases like 'className' if needed, but requirements say 'class'
            // For event listeners, we might want to support 'onClick' etc., but let's stick to setAttribute for now
            // unless it's a function, then we addEventListener?
            // The requirements example uses setAttribute for everything.
            // However, for standard JS events, it's better to check.
            if (key.startsWith('on') && typeof value === 'function') {
                const eventName = key.substring(2).toLowerCase();
                element.addEventListener(eventName, value);
            } else {
                element.setAttribute(key, value);
            }
        }
    } else {
        // Default props if null/undefined
        element.setAttribute('class', tag.toLowerCase());
        element.setAttribute('id', generateUUIDv7());
    }

    // Handle children
    // const appendChild = (child) => {
    //     if (typeof child === 'string' || typeof child === 'number') {
    //         element.appendChild(document.createTextNode(child));
    //     } else if (child instanceof Node) {
    //         element.appendChild(child);
    //     } else if (Array.isArray(child)) {
    //         child.forEach(appendChild);
    //     } else if (child === null || child === undefined) {
    //         // Skip
    //     } else {
    //         // Try to stringify unknown objects
    //         element.appendChild(document.createTextNode(String(child)));
    //     }
    //     // render(element, child)
    // };

    const appendChild = (child) => render(element, child)
    children.forEach(appendChild);

    return element;
}

// Element Wrappers
// We can define common HTML tags here
const tags = [
    'Div', 'Span', 'Header', 'Footer', 'Main', 'Section', 'Article',
    'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'A', 'Button', 'Input',
    'Label', 'Ul', 'Ol', 'Li', 'Img', 'Form', 'Nav'
];

tags.forEach(tagName => {
    window[tagName] = (props, ...children) => {
        return createElement(tagName.toLowerCase(), props, ...children);
    };
});

// Expose generateUUIDv7 as well if needed, or keep it internal/global
window.generateUUIDv7 = generateUUIDv7;

// Simple Modal Component
window.overlayModal = (content) => {
    const overlay = Div({
        style: 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;'
    },
        Div({
            style: 'background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); min-width: 300px; display: flex; flex-direction: column; gap: 15px;'
        },
            Div({ style: 'font-size: 1.1em; color: #333;' }, content),
            Div({ style: 'display: flex; justify-content: flex-end;' },
                Button({
                    onClick: (e) => {
                        // Remove the overlay from the DOM
                        const overlayEl = e.target.closest('[style*="position: fixed"]');
                        if (overlayEl) overlayEl.remove();
                    },
                    style: 'padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;'
                }, 'Close')
            )
        )
    );
    document.body.appendChild(overlay);
};

// State Management
window.createStore = (initialState, options = {}) => {
    let state = initialState;
    const listeners = new Set();
    const persistKey = options.persist;

    // Load from localStorage if persist option is set
    if (persistKey) {
        const saved = localStorage.getItem(persistKey);
        if (saved) {
            try {
                state = { ...state, ...JSON.parse(saved) };
            } catch (e) {
                console.error('Failed to parse saved state', e);
            }
        }
    }

    const getState = () => state;

    const setState = (partialState) => {
        state = { ...state, ...partialState };
        if (persistKey) {
            localStorage.setItem(persistKey, JSON.stringify(state));
        }
        listeners.forEach(listener => listener(state));
    };

    const subscribe = (listener) => {
        listeners.add(listener);
        // Call listener immediately with current state
        listener(state);
        // Return unsubscribe function
        return () => listeners.delete(listener);
    };

    return { getState, setState, subscribe };
};

// Global Body Alias and Render Method
Object.defineProperty(window, 'Body', {
    get: () => document.body
});

HTMLBodyElement.prototype.render = function (...children) {
    // children.forEach(child => {
    //     if (typeof child === 'string' || typeof child === 'number') {
    //         this.appendChild(document.createTextNode(child));
    //     } else if (child instanceof Node) {
    //         this.appendChild(child);
    //     } else if (Array.isArray(child)) {
    //         child.forEach(c => this.render(c));
    //     }
    // });
    render(this, ...children)
};

function render(parent, ...children) {
    children.forEach(child => {
        if (typeof child === 'string' || typeof child === 'number') {
            parent.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
            parent.appendChild(child);
        } else if (Array.isArray(child)) {
            child.forEach(appendChild);
        } else if (child === null || child === undefined) {
            // Skip
        } else {
            // Try to stringify unknown objects
            parent.appendChild(document.createTextNode(String(child)));
        }
    });
}
