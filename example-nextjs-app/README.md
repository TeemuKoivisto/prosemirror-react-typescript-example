# Example Next.js app

Next.js is a server-side rendering framework for react which is pretty much _de facto_ standard for creating SSR React apps and for a good reason. It is just a lot more convenient.

If you compare this to the `example-ssr-app` you'll notice that this has less of a problem with flickering of styles. Although the second frame still flushes the whole screen white for a short moment which is weird. The regular React app `example-app` does not have this problem.

Another issue which persists is the error with the Atlassian editor as it uses document in rendering. It actually blocks this app from being even built. I guess all the document or window specific logic should be mocked for a SSR version along with some hydration magic but that's not something I'm not very interested in doing.

## How to install

Similar to `example-ssr-app`, you need to build the other editors first and then install dependencies with `yarn`.

## Commands

- `yarn dev` starts the development server
- `yarn build` _tries_ to build the app but which fails
- `yarn next` the production command for running the app