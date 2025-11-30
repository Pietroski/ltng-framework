# Requirements

I want to craete / build a new frontend framework which I am going to call the ltng-framework.

Functional and non-functional requirements:
- The framework is going to be used to build web applications.
- The frammewok should be simple.
- The framwork is going to be in vanmilla javascript.
- The framework is about using plain html, css and javascript.
- The framwork is going to be plug and play (you import via a script url on your html and will be able to use it on your document / project)

The framwwork is going to wrapper html javacript document functions so you can easily use them as react components but does not require any compilation at all.

scratch:
```javascript
// Div
function Div(props, children) {
    const div = document.createElement('div')

    if (props?.class == undefined) {
        props.class = 'div'
    }
    if (props?.id === undefined) {
        props.id = generateUUIDv7()
    }

    for (const [key, value] of Object.entries(props)) {
        div.setAttribute(key, value)
    }
    div.appendChild(children)

    return div
}
```

But it can be and grow more rubust to include the things we might need in the future.
But I believe that with props we can also call the document element methods or do we need to do something with that yet?

We need to be able to automatically place an object nested to its children:
```html
<html>
    <header>
        <script src="ltng-framework.js"></script>
    </header>
    <body>
       <script src="ltng-framework.js">
            Div({}, Div({}, 'Hello World'))
       </script>
    </body>
</html>
```

Let's get to work!!
