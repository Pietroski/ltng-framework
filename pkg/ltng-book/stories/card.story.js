import { registerStory } from './registry.js';
import { Card } from '../../../pkg/components/card.js';

registerStory('Card', 'Card component with Closable variants.', () => {
    return Div({ style: 'display: flex; flex-direction: column; gap: 20px; align-items: flex-start;' },
        Div({},
            H3({}, 'Default (Light Mode)'),
            Card({ darkMode: true }, 'I am a Card')
        ),
        Div({},
            H3({}, 'Default (Dark Mode)'),
            Card({ darkMode: false }, 'I am a Dark Card')
        ),
        Div({},
            H3({}, 'Closable (Click X to alert)'),
            Card.Closable({ 
                darkMode: true,
                onCloseClick: () => alert('Close clicked!') 
            }, 'I am Closable')
        ),
        Div({},
            H3({}, 'Self Closable (Click X to remove)'),
            Card.SelfClosable({ 
                darkMode: true 
            }, 'I remove myself')
        )
    );
});
