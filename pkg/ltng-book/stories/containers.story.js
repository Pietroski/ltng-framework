import { registerStory } from './registry.js';
import { Div, FlexStyleOpts } from '../../../pkg/components/containers.js';
import { Typography } from '../../../pkg/components/typography.js';

registerStory('Containers', 'Div, Div.Flex, and Div.Grid components.', () => {
    const boxStyle = {
        width: '50px',
        height: '50px',
        backgroundColor: '#1976d2',
        border: '1px solid white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontWeight: 'bold'
    };

    return Div({ style: { display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' } },
        Div({},
            Typography.H3({ darkMode: false }, 'Div.Flex (Row, Center)'),
            Div.Flex({ 
                style: { 
                    ...FlexStyleOpts.FD.Row, 
                    ...FlexStyleOpts.JC.Center,
                    backgroundColor: '#eee',
                    padding: '10px',
                    height: '100px'
                } 
            },
                Div({ style: boxStyle }, '1'),
                Div({ style: boxStyle }, '2'),
                Div({ style: boxStyle }, '3')
            )
        ),
        Div({},
            Typography.H3({ darkMode: false }, 'Div.Flex (Column, SpaceBetween)'),
            Div.Flex({ 
                style: { 
                    ...FlexStyleOpts.FD.Column, 
                    ...FlexStyleOpts.JC.SpaceBetween,
                    backgroundColor: '#eee',
                    padding: '10px',
                    height: '200px',
                    width: '100px'
                } 
            },
                Div({ style: boxStyle }, '1'),
                Div({ style: boxStyle }, '2'),
                Div({ style: boxStyle }, '3')
            )
        ),
        Div({},
            Typography.H3({ darkMode: false }, 'Div.Grid (2 Columns)'),
            Div.Grid({ 
                style: { 
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    backgroundColor: '#eee',
                    padding: '10px'
                } 
            },
                Div({ style: { ...boxStyle, width: '100%' } }, '1'),
                Div({ style: { ...boxStyle, width: '100%' } }, '2'),
                Div({ style: { ...boxStyle, width: '100%' } }, '3'),
                Div({ style: { ...boxStyle, width: '100%' } }, '4')
            )
        )
    );
});
