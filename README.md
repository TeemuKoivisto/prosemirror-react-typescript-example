# [ProseMirror + React + TypeScript example editor](https://teemukoivisto.github.io/prosemirror-react-typescript-example/)

**UPDATE 22.7.2022**: Deprecated but still works (with all packages updated)! The atlassian editor is a cool insight into how they build their editor and one can learn a few things from it. However, there is a bit too much boilerplate here to really understand how to architect a ProseMirror editor combined with React so I rather advise people to use a framework to get started. I might at some point publish something out of this as separate packages but in much smaller scope.

This repository shows 4 example editors: `atlassian`, `full`, `full-v2` and `minimal`. Atlassian is the copied boilerplate to assemble a minimal working prototype. Minimal was the original boilerplate I used to integrate React, full was the second iteration and full-v2 as the third. However, even the third one would need a complete rewrite since I've learnt a few things how to organize things better. Anyway, there they are.

## How to install

You need `pnpm` >=7.

1. `pnpm i`
2. `pnpm start` should start the CRA app at http://localhost:3000 Might have to run it a few times incase the packages were created out of order.

### Collab server

Cool example how to use `prosemirror-collab`. There are some advantages over using it compared to Yjs, simplicity at the front. However, it's a _lot_ of work to implement your own websocket synchronization server. A lot of work. To make it distributed and ensure messages are not lost and whatnot. There are examples how to approach that though, some are linked at the end of this README.

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

## Similar projects & resources

### Tools & examples

- https://gist.github.com/manigandham/65543a0bc2bf7006a487
- https://github.com/hubgit/react-prosemirror
- https://github.com/dminkovsky/use-prosemirror

### Frameworks

- https://github.com/bangle-io/bangle.dev
- https://github.com/Saul-Mirone/milkdown
- https://github.com/nib-edit/Nib
- https://github.com/remirror/remirror
- https://github.com/ueberdosis/tiptap

### Editors that use ProseMirror

- https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/master/editor/editor-core/
- https://github.com/chanzuckerberg/czi-prosemirror
- https://github.com/curvenote/editor
- https://github.com/fiduswriter/fiduswriter
- https://github.com/MO-Movia/licit
- https://gitlab.com/mpapp-public/manuscripts-manuscript-editor
- https://github.com/appleple/smartblock
- https://gitlab.coko.foundation/wax/wax-prosemirror

### Collaborative editing

- https://tiptap.dev/hocuspocus
- https://github.com/ProseMirror/prosemirror-collab
- https://github.com/cozy/prosemirror-go