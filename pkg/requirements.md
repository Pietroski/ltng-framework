# Tools

I have, in the past, written a few JS-TS libraries to use in my projects.

However, they were written in typescript and I am creating a vanilla javascript framework, so I need to rewrite them in vanilla javascript.
I know there are a few runtimes like bun that can read and execute typescript on the fly without any compilation to javascript. But let's leave that aside for now and let's only focus onto re-writing those libraries I wrote in here, in vanilla javascript. the libraries should be written under tools/<name-of-the-libtool>.
Also, I want to have unit tests written for every and each one of them as most of the code in the old/original library.

The libraries can be found under `to_deprecate/`

Do one-by-one, validate each one. Make sure unit tests are written and validated before moving to the next one.

The unit tests should be written under ~~`tools/<name-of-the-libtool>/*/*.test.js`~~ `pkg/<name-of-the-libtool>/*/*.test.js` (basically, if the libtool is called `my-libtool`, then the unit tests should be written under ~~`tools/my-libtool/my-libtool.test.js`~~ `pkg/my-libtool/my-libtool.test.js` if the target file to be test is under `to_deprecate/my-libtool/my-libtool.js`).

For the unit tests, let's use our own testing library under testingtools. It is going to be good for validating it with real code.

PS. Let's skip components library for now because I'll need a dedicated requirement description for that one.

# Components

Components is a much harder library to transpose because it not only depends on the Tools we previously transposed (which are now under pkg), but also because of other smalls things and details and also, because of its size.
