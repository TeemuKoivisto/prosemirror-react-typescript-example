# Example Next.js app

Next.js is a server-side rendering framework for React which helps a lot with solving the many pitfalls with SSR. The other framework being Gatsby yet I prefer Next.js as it exposes less complexity to the developer (without the hellish configuration of `gatsby-node.js` and GraphQL). Its downsides being that it's a more of a corporate product than OSS library.

If you start the app with `yarn dev` you'll notice that it has a less of a problem with flickering of styles. Although the second frame still flushes the whole screen white for a short moment which is weird. The client-side only `example-app` does not have this problem and what solves it for this Next.js app is building the site statically: `yarn static` and then `yarn serve`. Now there's no more flickering although the editors are loaded outside the initial render, making them pop-up. Probably this could be fixed with moving the initialization to some `initialRender` hook.

Another issue which persists is the error with the Atlassian editor as it uses document in rendering. As a solution I configured the editor to be only loaded in client-side without SSR. Which makes it jump a lot more compared to the other editors. Not very optimal solution but ehh.

## How to install

This project uses Yarn workspaces so you don't really have to install anything. By running `yarn` in the root folder all the dependencies should be installed automatically.

## Commands

To run this directly, use `yarn dev`. To build the app into static HTML/JS/CSS, use `yarn static` and then `yarn serve` to serve it. For production build you should run `yarn build` and `yarn start`.

- `yarn dev` starts the development server
- `yarn build` builds the app with Atlassian editor rendered dynamically without SSR
- `yarn static` builds the app into static HTML
- `yarn serve` serves the static HTML in `out`-folder at http://localhost:5000
- `yarn next` starts the production SSR server
