# Atlassian editor example

This editor is directly copied/slimmed down from the Atlassian's open-source ProseMirror editor https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/master/ as of 5.12.2020 (specifically the commit 112fe52d).

It is quite probably the most extensive open-source PM editor out there which makes it a very good case study to analyze. This editor attempts to re-implement the most minimal version of the said editor to understand its inner workings. Hopefully this repository will also help others to build robust industrial-grade editors out there.

If you have taken a look at the original source code, you can see that the full editor is not the simplest one to grasp. With time and patience I think anyone can dissect it but it clearly shows that building non-toy rich-text editors are a massive undertaking. I express my gratitude to Atlassian folk for open-sourcing their editor since this complexity can be maddeningly difficult. The most difficult part, in my opinion, is not even building the React boilerplate but the actual PM editor logic. 

Although as a side note, the editor could use some refactoring and cleaning up to bring it to the current React development standards with hooks and so on. Some parts seemed hairier than the others, especially the Item element aka. @atlaskit/item was quite tricky to re-implement in TS from JS without really understanding how it works. I am actually not even sure does it properly handle the `ref` its passed down. At least for me, removing it didn't seem to cause issues. Also apparently the PortalProvider used to render using React portals but for performance reasons they switched to `unstable_renderSubtreeIntoContainer` [see commit](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d520a6fb6dab1027d3873eec9317c4e8574d07fb). So the PortalProvider and PortalRenderer are actually not in use and you could remove them and leave only the PortalProviderAPI. I may or may not have time to try to implement a test for that edge-case but in the mean time, I guess I myself will use portals.

As another observation, using the hosted editor here https://atlaskit.atlassian.com/packages/editor/editor-core/example/full-page, I noticed some performance issues / latencies when you press down a key versus a lighter editor version. I conjecture that this is due to having every plugin active with their listeners watching every transaction which slows down typing considerably. Which I would say is a major engineering obstacle to keep in mind if you decide to implement your own mega-editor. 

I did not re-implement all of the features and widgets of the full editor, just the parts I thought demonstrated the architecture of the editor the best. A big part I did not include was the user tracking analytics. Anyone can be my guest and continue this work, the Atlassian editor was licensed under the very permissive Apache License 2.0.

## Commands

Can be found in `package.json`. Use `yarn <cmd>` or `npm run <cmd>` or sometimes `npm <cmd>` works too.
