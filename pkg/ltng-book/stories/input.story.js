import { registerStory } from './registry.js';
import { Input } from '../../../pkg/components/input.js';

registerStory('Input', 'Input component with floating label and password toggle.', () => {
    return Div({ style: 'display: flex; flex-direction: column; gap: 20px; width: 300px;' },
        Div({},
            H3({}, 'Default (Dark Mode)'),
            Input({ 
                darkMode: true, 
                placeholder: 'Username',
                onChange: (e) => console.log('Input changed:', e.target.value)
            })
        ),
        Div({},
            H3({}, 'Default (Light Mode)'),
            Input({ 
                darkMode: false, 
                placeholder: 'Email',
                type: 'email'
            })
        ),
        Div({},
            H3({}, 'Secret (Password)'),
            Input.Secret({ 
                darkMode: true, 
                placeholder: 'Password'
            })
        )
    );
});
