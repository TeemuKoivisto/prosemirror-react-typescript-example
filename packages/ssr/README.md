# Example server side rendered app

So as I started experimenting with Next.js I noticed that making the editors SSR friendly was not a trivial issue. In order to understand how the rendering works and what causes the problems I decided to make this small example to showcase its basic implementation as well as its problems. This is more or less the same setup as for Next.js app but here the errors might easier to debug.

## Issues

The first problem you'll notice when you start the development server and open the app http://localhost:3300 is the mismatch between the server-side rendered app and the hydrated app. I added a page to demonstrate how the editors differ at http://localhost:3300/raw where there is no `bundle.js` attached to the page. If you reload the page you should get the raw HTML. Since the size of the editor container depends on its content, it won't expand to what its size should be. 

Also, for `full` and `minimal` editor pages something strange happens with the hydration process as the styles are loaded very jerkingly. Between the first and third frame (which you can view from eg Chrome inspector network tab) you can see the app without any stylings which is, I assume, due to styled-components having some incorrect configuration. I attempted to add https://github.com/Igorbek/typescript-plugin-styled-components based on the wisdom discussed here https://github.com/vercel/next.js/issues/7322 yet adding the transformer didn't work. The error message of the className mismatch is probably a facet of this problem.

Ff you decide to open the `/atlassian` page and refresh (`ctrl-r` or `cmd-r`) to get the server-side rendered version of the Atlassian editor, you'll notice it throws 500 error with the message: `ReferenceError: document is not defined`. Since you can't server-side render with `document`, the Atlassian editor doesn't work as such with server-side rendering.

## How to install

This project uses Yarn workspaces so you don't really have to install anything. By running `yarn` in the root folder all the dependencies should be installed automatically.

## Commands

Incase you want to run this example app directly, you need 3 terminal sessions. One for `yarn watch:client`, one for `yarn watch:server` and one for `yarn dev`.

* `yarn dev` start the development server, you change the port by adding a `.env` file with PORT value
* `yarn build` builds both server and client code
* `yarn build:client` or `yarn build:server` build the specific folder
* `yarn watch:client` or `yarn watch:server` build the folder and watch changes
* `yarn lint` supposed to lint the code yet not working for some reason
