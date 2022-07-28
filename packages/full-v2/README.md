# Full editor v2

As I started adding collaboration, I noticed that the approach taken by the Atlassian editor and in turn, taken by me in the full editor, didn't really seem optimal for managing the sprawling complexity of an editor. Especially adding multiple providers, hidden somewhere inside the editorPlugins seemed overly obtuse and also, fixing the layout to the editor, toolbar et cetera, seemed non-optimal.

So I again restructured the whole thing, yey! But now I took some inspiration from the other PM-React editors out there, mainly TipTap's v2, to design the API. So instead of editorPlugins, the editor now uses extensions which are basically the same but include the schema. Let's see how good of a choice this is.

## How to install

This project uses Yarn workspaces so you don't really have to install anything. By running `yarn` in the root folder all the dependencies should be installed automatically.

## Commands

- `yarn watch` starts the Rollup compiler and watches changes to the editor
- `yarn build` compiles the code as both CommonJS and ES module.
