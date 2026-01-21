# LTNG-Book

As for now, our ltng-book is an app and not a library. It is just a collection of stories and components. We need to make it a full library, so we can import it into our projects give it a stories list as we did in our lib and it can figure out the rest. We are almost there... We need to make it a bit more dynamic, just it. 

I have created a `ltng-book/ltng-book.js` file in the root of the project.
It needs to import the ltng-framework library.

We will later update `internal/ltng-book/app.js` to import the ltng-book.js file.

I have also refactored the repo a little bit. `pkg` was demantled into other repos
`ptk/components` became `ltng-components`
