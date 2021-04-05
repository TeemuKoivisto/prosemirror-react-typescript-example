import { Node as PMNode, Schema } from 'prosemirror-model'

export function parseRawValue(
  value: Object | string,
  schema: Schema,
  ) {
  let parsedNode
  if (typeof value === 'string') {
    try {
      parsedNode = JSON.parse(value)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`Error processing value: ${value} isn't a valid JSON`)
      return
    }
  } else {
    parsedNode = value
  }

  try {
    // ProseMirror always require a child under doc
    if (parsedNode.type === 'doc') {
      if (Array.isArray(parsedNode.content) && parsedNode.content.length === 0) {
        parsedNode.content.push({
          type: 'paragraph',
          content: [],
        })
      }
      // Just making sure doc is always valid
      if (!parsedNode.version) {
        parsedNode.version = 1
      }
    }

    const parsedDoc = PMNode.fromJSON(schema, parsedNode)

    // throws an error if the document is invalid
    parsedDoc.check()

    return parsedDoc
  }
  catch (err) {
    // eslint-disable-next-line no-console
    console.error(
      `Error processing document:\n${err.message}\n\n`,
      JSON.stringify(parsedNode),
    )
    return
  }
}
