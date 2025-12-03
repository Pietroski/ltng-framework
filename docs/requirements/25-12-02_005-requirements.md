# Distribution and Serving

The project grew faster and bigger than the imaginable.
A great effort was put on into reorganising the code and folder structures to make it easier to maintain and to leave it organised in a way it made sense already thinking for more future growth.

We have come to a very nice terms now.

The project has:
- The ltng-framwework which is a frontend web framework;
- The ltng-tools which is a set of tools that can run both on a node server or a web browser; thanks for its modularity (.mjs) and ES syntax;
- The ltng-testingtools that offers two testing type syntax (gotest and ghirkin-like tests) and again, can be used on a server and in the frontend to test frontend components and business logic; thanks again for its modularity (.mjs) and ES syntax;
- The ltng-book which is a lightwheit story book focused on the deveoper experience focused for quick test, manipulation and developer visualisation of the target component;
- The ltng-components which is a set of UI components that because of its modularity (.mjs) can be rendered or 'compiled' by the server (for ssr and ssg modes) or on the browser (csr mode).

Initially, we had a minifier and a server to serve the csr, ssr and ssg content.

Since the project grew in size and complexity, the initial minifier and server were not able to take care of all edge cases. Also, due to the project's complexity, every serving type or minifying type should have a dedicated script for it; The orchestrator should be able to route the requested command to the specific script that is responsible for taking care of that specific use case, no exceptions or edge cases or a lot of if-else conditions that only increase the bundler's or server's complexity and make it harder to maintain or to understand it.

## minifier

Every developer has its own needs and use cases, for that reason, this lib should be distributed in different content bundles so it can satisfy each developer needs.
This project should have the following minifications:
- ltng-framework only;
- ltng-testingtools only;
- ltng-book only;
- ltng-tools only;
- ltng-components only;

- ltng-framework + ltng-testingtools;
- ltng-framework + ltng-book;
- ltng-framework + ltng-tools;
- ltng-framework + ltng-components;

- ltng-framework + ltng-testingtools + ltng-book;
- ltng-framework + ltng-testingtools + ltng-tools;

- ltng-framework + ltng-testingtools + ltng-book + ltng-tools + ltng-components (everything);

The minifier needs to be able to handle complex importing schemas such as:

``` javascript
import { Div as LTNGDiv } from "ltng-components";
```

And use it as:

``` javascript
<LTNGDiv>Test</LTNGDiv>
```

The minified output should be target to a `.min.js` file.

## server

The server should be able to build and serve the csr, ssr and ssg content.

- csr does not require any build;
- ssg requires building and serving the builded/bundled files;
- ssr builds on the server side and handles the result html to the client;

For the bundlers/parser/builder it also needs to be able to handle complex importing schemas such as:

``` javascript
import { Div as LTNGDiv } from "ltng-components";
```

And use it as:

``` javascript
<LTNGDiv>Test</LTNGDiv>
```

The server/compiler/bundler/parser/minifier orchestrator needs to be able to handle a few flags so it can decide to which script it is going to call with the requires flags:

- `--mode=` can be csr, ssr or ssg
- `--build` build only
- `--b&s` build and serve
- `--serve` serve only
- `--port` which port the server is going to run (default is 3000)
- `--src` the source directory that index.html is located (default it the project's direcotry ($PWD/..) because the script will reside in ./scripts? Perhaps the orchestrator will not, so than the default src could be $PWD, so it will depend)
- `--dist` the destination directory where the builded/bundled files are going to be located (default it the project's direcotry ($PWD/../dist) because the script will reside in ./scripts? Perhaps the orchestrator will not, so than the default dist could be $PWD/dist, so it will depend)
