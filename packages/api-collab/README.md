# Collaboration server

This is an example collaboration server based on this example https://github.com/ProseMirror/website/tree/master/src/collab to show how one can integrate it with ProseMirror editor.

## How to install

This project uses Yarn workspaces so you don't really have to install anything. By running `yarn` in the root folder all the dependencies should be installed automatically. Then, you should run in two terminals:

1. `yarn dev`
2. `yarn watch`

## Commands

- `yarn dev` starts a Nodemon process to restart the Node.js server on source file changes
- `yarn watch` starts the Rollup compiler and watches changes to the source files
- `yarn build` compiles the code as both CommonJS and ES module.
