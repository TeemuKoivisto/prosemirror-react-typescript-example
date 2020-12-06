# Atlassian editor example

This editor is directly copied/slimmed down from the Atlassian's open-source ProseMirror editor https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/master/ as of 5.12.2020 (specifically the commit 112fe52d).

It is quite probably the most extensive open-source PM editor out there which makes it a very good case study to analyze. This editor attempts to re-implement the most minimal version of the said editor to understand its inner workings. Hopefully this repository will also help others to build robust industrial-grade editors out there.

If you have taken a look at the original source code, you can see that the full editor is not the simplest one to grasp. With time and patience I think anyone can dissect it but it clearly shows that building non-toy rich-text editors are a massive undertaking. I express deep gratitude to Atlassian folk for open-sourcing their editor since this complexity can be maddeningly difficult. The most difficult part, in my opinion, is not even building the React boilerplate but the actual PM editor logic. 

I did not re-implement all of the features and widgets of the full editor, just the parts I thought were the most important. One big part I omitted was the user tracking analytics. Anyone can be my guest and continue this work, the Atlassian editor was licensed under the very permissive Apache License 2.0.

## Commands

Can be found in `package.json`. Use `yarn <cmd>` or `npm run <cmd>` or sometimes `npm <cmd>` works too.
