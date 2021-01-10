# Example server side rendered app

So as I started experimenting with Next.js I noticed that making the editors SSR friendly was not a trivial issue. In order to understand how the rendering works and what causes the problems I decided to make this small example to showcase its basic implementation as well as its problems. This is more or less the same setup as for Next.js app but here the errors might easier to debug.

## Issues

The first problem you'll notice when you start the development server and open the app http://localhost:3300 is the mismatch between the server-side rendered app and the hydrated app. I added a page to demonstrate how the editors differ at http://localhost:3300/raw where there is no `bundle.js` attached to the page. If you reload the page you should get the raw HTML. Since the size of the editor container depends on its content, it won't expand to what its size should be. 

Also, for `full` and `minimal` editor pages something strange happens with the hydration process as the styles are loaded very jerkingly. Between the first and third frame (which you can view from eg Chrome inspector network tab) you can see the app without any stylings which is, I assume, due to styled-components having some incorrect configuration. I attempted to add https://github.com/Igorbek/typescript-plugin-styled-components based on the wisdom discussed here https://github.com/vercel/next.js/issues/7322 yet adding the transformer didn't work. The error message of the className mismatch is probably a facet of this problem.

There are other errors in the console as well as which occur when you navigate from eg front page to `/minimal` page. The majority of them are the same as with the `example-app`, yet since the apps still work I haven't seen it that important to fix them. Something about improper unmounting of components or nodes.

However, if you decide to open the `/atlassian` page and refresh (`ctrl-r` or `cmd-r`) to get the server-side rendered version of the Atlassian editor, you'll notice it throws 500 error with the message: `ReferenceError: document is not defined`. Since you can't server-side render with `document`, the Atlassian editor is unusable for server-side rendering. Or you need to do some crazy plumping to avoid using it, I don't know. Probably not the smartest idea to SSR a rich-text editor.

Annyway... It's an interesting experiment and perhaps someone will have the time and energy to fix the problems. In the meantime this can at least showcase a basic approach with the more hairy details solved.

Oh yeah, one another thing. For this app I had to use file path -based imports for the dependencies. So instead of `yarn link` I added the libraries with eg `"atlassian": "file:../atlassian",` to `package.json`. Now it is all fine and dandy when you are not making changes to any of the editors BUT if you do make changes, just building the editor won't work. You have to remove the `yarn.lock`, delete the editor eg `rm -rf node_modules/atlassian` and then reinstall: `yarn`. Or just remove all node_modules and reinstall: `rm -rf node_modules && yarn`. It's very inconvenient, I know, but as far as I know the only way to import local npm modules which compile correctly with `rollup`. It's... weird.

## How to install

0. Make sure you have installed all the dependencies of the other editors (`minimal`, `full`, `atlassian`)
1. Build all the editors: `cd minimal && yarn build && cd ../full && yarn build && cd ../atlassian && yarn build`
2. Install dependencies: `cd example-ssr-app && yarn`
3. Start the compilers in two new terminals: `yarn watch:server` and `yarn watch:client`
4. Start the development server: `yarn dev`

## Commands

* `yarn dev` start the development server, you change the port by adding a `.env` file with PORT value
* `yarn build` builds both server and client code
* `yarn build:client` or `yarn build:server` build the specific folder
* `yarn watch:client` or `yarn watch:server` build the folder and watch changes
* `yarn lint` supposed to lint the code yet not working for some reason
