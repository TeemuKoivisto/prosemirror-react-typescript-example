# [ProseMirror + React + TypeScript example editor](https://teemukoivisto.github.io/prosemirror-react-typescript-example/)

Just the basic boilerplate needed to get going with this combo.

This repository shows three example editors: `atlassian`, `full` and `minimal` which are imported as their own modules in three separate example apps: `example-app`, `example-ssr-app` and `example-nextjs-app`. The previous linking mess is now managed through Yarn workspaces.

## How to install

You should have Yarn installed globally.

1. Run: `yarn` to install all the dependencies using Yarn workspaces (no need to install them individually for each project).
2. Then you can simply run: `yarn start` (31-5-2021: might have to run it twice, some problem with full-v2's type generation) to start the `example-app` in http://localhost:3000

The other examples can be executed with `yarn nextjs` and `yarn ssr`. Note: you should probably run only one example at the time since each commands starts the Rollup compilers in the editor subfolders.

### Collab server

It's still WIP but to run it locally you can just execute `yarn collab` to start the server. There few bugs left that I haven't gotten around to fix before deploying it.

## Background

It has been a long-running project of mine to implement a rich-text editor. My transition has been from Draft.js to Slate.js to finally ProseMirror yet its definitely not easy to integrate ProseMirror with React to create a truly production-ready rich-text editor.

In the end what I decided to do was to copy the approach by Atlassian editor https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/master/editor/editor-core/ and then devise my approach on top of it. This has been so far a solid solution as their editor has been battle-tested for myriad of use cases I could have not even possibly fathomed. I have re-implemented as much as I have seen useful from their editor in the `atlassian` editor.

The other examples, `minimal` and `full`, are my own derivations where `minimal` should give the basic idea what is going on and `full` at some point in the future the best approach I have come up with.

Also during this time I have dabbled with SSR and Next.js so I added examples where I trial PM+React with server-side rendering. It's not unfeasible but it begs the question "why?" since so far I don't think there are that great benefits to SSR'ing a rich-text editor. I mean, what do you need it for? Faster initial render? But this isn't a blog page so I assume people are fine waiting a little when their editor loads. The only good reason would be SEO benefits but since when people have required public rich-text editors in SEO results?

In my SSR examples I load the editor in both client and server but without actually rendering the editor doc HTML and hydrating the page from it. I just use `useEffect` to set the state before painting which should look perfectly the same as server-side rendering the page. You could probably hack something together that would do just that but I don't really have time for it.

Also compared to the basic `example-app` server-side rendering the pages show an empty white frame before the actual app renders. Which to me is a bit weird (and also the `example-ssr-app` really messes up the loading of styles, haven't bothered to fix that). This is remedied with `example-nextjs-app` if you build the app with `yarn static` and then serve it: `yarn serve` (with however the atlassian editor still jumping around a little bit). Just something to keep in mind if you decide to use SSR. 

## Architecture

I think the majority of the code is pretty self-explanatory in the `minimal` and `full` examples. For the `atlassian` editor you kinda have to delve deep yourself into the original editor to figure out why things are what they are.

But the basic gist of it is, you need a custom interface (EditorPlugin) to add extra logic to the basic PM plugins (`./full/src/editor-plugins`). These are loaded alongside the EditorState and EditorView and include for example all the basic PM plugin logic (pluginKey, normal pmPlugins, nodeviews, typings) as well as possible API providers, extensions, portalProvider, toolbar components and so forth. However, since Atlassian editor uses a separate repository to store the editor schema I use also a separate folder for schema. This keeps things simpler but definitely not entirely modular. 

React components can hook up to the editor state by using EditorContext for watching either plugin changes or executing commands with editorViewProvider. Incase you want to use nodeViews as React components they use portalProvider to render themselves as portals which are updated inside each `dispatchTransaction` call to flush the changes only once (instead of updating them in each `update` call in each ReactNodeView separately).

And well, that's about it. Syncing PM editor state to React components isn't always that easy and definitely there are still some enhancements that I should do. But in the mean time I guess the current approach is ok and so far it performs very well compared to eg Slate.js.

Contributions or comments would be appreciated.

## Interesting observations

When compiling the editors you should not include React or styled-components as devDependencies as rollup by default seems to point to the editor's dependencies, not the example app's, thus importing them twice and causing very nasty bugs.
