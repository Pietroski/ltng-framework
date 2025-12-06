# Requirements

This project is amazing but still there are a lot of missing documentation.
Let's kick-off a documentation effort to document each part of the framework.

We have a few sub-projects or compomnents inside this project.
The main project is the ltng-framework, but we also have the ltng-components, ltng-book, ltng-tools, ltng-testingtools and ltng-server. We should be able to document each of them. On each root folder of each sub-project we should be able to write a very detailed README.md file that explains the project, its purpose, how to use it with examples (for the ltng-components and ltng-book, you can check `internal` folder so there there are a few examples of how to use them; you can check `playground` folder so there there are a few examples of how to use them. For the ltng-testingtools, ltng-tools contain examples on how to write tests and test suites. Lastly but not the least ltng-server, you can check `25-12-02_005-requirements.md` file and the `Makefile` for examples of how to use them), how to install it, how to run it, how to test it, how to debug it, how to deploy it, how to maintain it, etc.
Also, you shoule be able to look into every piece of code and understand what it does and how it works so you can build a good library.

Since there are a lot of work, let's divide and conquer the effort of the work into smaller tasks.

- ltng-testingtools
- ltng-tools
- ltng-book
- ltng-components
- ltng-server
- ltng-framework

# Extra requirements

The ltng components library has been very poorly documented. We should improve it given way more example usages and a better documentation.

For example, The form state management is not very clear. We should improve it given way more example usages and a better documentation. We should show that the dev is responsible for create a initial state outside the component and pass it as a prop to the component. The component should be responsible for updating the state and passing it to the dev as a prop. For this case in specific see the `internal/stories/form.story.mjs` file.

Similarly, the modal component is not very clear. We should improve it given way more example usages and a better documentation. We should show that the dev is responsible for create a initial state outside the component and pass it as a prop to the component. The component should be responsible for updating the state and passing it to the dev as a prop. For this case in specific see the `internal/stories/modal.story.mjs` file.

And we should to the same with every other components. Teach and show with example how we should handle component's state and also how to style the component; by using css or css-in-js or any other way (the original way).

# Extra requirement

Let's create an index for the other docs on the main README.md file so whomever is reading can easily transition to the docs of the specific sub-project.
