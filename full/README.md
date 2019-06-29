# Full editor example

Heavily inspired by Atlassian's editor https://atlaskit.atlassian.com/packages/editor/editor-core

In conjunction with using React for NodeViews, also through sharing the same EditorContext the components have access to same global providers eg StyledComponents, translation and so on.

Which saves a lot of trouble when sharing a lot of state without wanting to write a lot of boilerplate eg mapStateToProps to every component. Or at least that is what I think it does. Not sure yet.

## Commands

Can be found in `package.json`. Use `yarn <cmd>` or `npm run <cmd>` or sometimes `npm <cmd>` works too.

