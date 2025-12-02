# Distribution v2

At the moment we have build a minifier that minifies all the jsvascript library that we have in this repo so the dev can import it just with a link injected in its html from a github raw page.

But as for now, I understand we are minifying the ltng-framework, and everything that in within pkg folder as well the testing tools, correct?

If not, I want a way that we can have all these following options for the developer:
- developer can import only the ltng-framework;
- develop can import ltng-framework with the testing tools;
- developer can import ltng-framework with the testing tools and the components;
- developer can import ltng-framework with the testing tools, and everything else that is under pkg folder (ltng-components, ltng-book and all the utils it contains).

the minified result should be built under build. As for now it is being built under dist but that direcotry does not get commited.

# Extra requirements

I added one extra to do regarding what we would need to expose:

- ltng-framework (Core only) => OK
- ltng-framework + testingtools => OK
- ltng-framework + testingtools + ltng-book => TODO
- ltng-framework + testingtools + components => OK
- ltng-framework + testingtools + pkg (Full Suite) => OK

Also, our minifier and compiler would need to be able to handle more robust imports (if not already), such as:

```javascript
import { Div as LTNGDiv, Button as LTNGButton } from "ltng-components";
```
