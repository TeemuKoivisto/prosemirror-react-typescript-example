# Atlassian editor

This editor is directly copied/slimmed down from the Atlassian's open-source ProseMirror editor https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/master/ of 5.12.2020 (specifically the commit 112fe52d).

It is quite probably the most extensive open-source PM editor out there which makes it a very good case study to analyze. This editor attempts to re-implement the most minimal version of the said editor to understand its inner workings. Hopefully this repository will also help others to build robust industrial-grade editors out there.

If you have taken a look at the original source code, you can see that the full editor is not the simplest one to grasp. With time and patience I think anyone can dissect it but it clearly shows that building non-toy rich-text editors are a massive undertaking. I express my gratitude to Atlassian folk for open-sourcing their editor since this complexity can be maddeningly difficult. The most difficult part, in my opinion, is not even building the React boilerplate but the actual PM editor logic.

Although as a side note, the editor could use some refactoring and cleaning up to bring it to the current React development standards with hooks and so on. Some parts seemed hairier than the others, especially the Item element aka. @atlaskit/item was quite tricky to re-implement in TS from JS without really understanding how it works. I am actually not even sure does it properly handle the `ref` its passed down. At least for me, removing it didn't seem to cause issues.

The PortalProvider used to render with React portals but for performance reasons they switched to `unstable_renderSubtreeIntoContainer` [see commit](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d520a6fb6dab1027d3873eec9317c4e8574d07fb). So the PortalProvider and PortalRenderer are actually not in use and you could remove them and leave only the PortalProviderAPI. I think I fixed this problem in my `full` editor where I only update the portals once inside `dispatchTransaction`.

As another observation, using the hosted editor here https://atlaskit.atlassian.com/packages/editor/editor-core/example/with-plugin-state I noticed some performance issues / latencies when you press down a key versus another example editor. From what I can tell from flamegraphs the setState in `WithPluginState` is really blocking the rendering which makes it sluggish. I myself did basic pub/sub pattern in my `full` editor without HOCs which works ok but I don't know exactly the trade-offs between the two.

I haven't re-implemented all the features and widgets of the full editor nor will I attempt to, just the parts I think demonstrate the architecture of the editor the best. A big part I did not include was the user tracking analytics. Anyone can be my guest and continue this work, the Atlassian editor was licensed under the very permissive Apache License 2.0.

## How to install

This project uses Yarn workspaces so you don't really have to install anything. By running `yarn` in the root folder all the dependencies should be installed automatically.

## Commands

- `yarn watch` starts the Rollup compiler and watches changes to the editor
- `yarn build` compiles the code as both CommonJS and ES module.
