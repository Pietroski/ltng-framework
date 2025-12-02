# Components - Styling Refactor

We apparently have successfully refactor the ltng-components to use a css first styling with classes instead of css-in-js, although it still supports it!

Let's now test ssr and ssg functionalities by copying updating `playground/001` to `playground/002`, in other words, don't touch 001, but update what we have in 001 in 002 but with our components lib, and test ssr and ssg.

For base components such as Li, Lu and so on, keep them! Chnege only the button, Div's and so on.

Our components from the components lib, let's import them as `LTNGComponent`, so for example, import a Div as LTNGDiv and so on to avoid clash with the standard ltng-framework components.

``` javascript
import { Div as LTNGDiv } from "ltng-components";
```

And use it as:

``` javascript
<LTNGDiv>Test</LTNGDiv>
```
