import { Schema, NodeSpec, MarkSpec } from 'prosemirror-model'
import { IExtension, IExtensionSchema } from './Extension'

export function createSchema(extensions: IExtension<any>[]) {
  const nodes = extensions.reduce(
    (acc, cur) => ({ ...acc, ...cur.schema?.nodes }),
    {} as { [key: string]: NodeSpec }
  )
  const marks = extensions.reduce(
    (acc, cur) => ({ ...acc, ...cur.schema?.marks }),
    {} as { [key: string]: MarkSpec }
  )
  return new Schema({
    nodes,
    marks,
  })
}

export function createSchemaFromSpecs(specs: IExtensionSchema[]) {
  const nodes = specs.reduce(
    (acc, cur) => ({ ...acc, ...cur.nodes }),
    {} as { [key: string]: NodeSpec }
  )
  const marks = specs.reduce(
    (acc, cur) => ({ ...acc, ...cur.marks }),
    {} as { [key: string]: MarkSpec }
  )
  return new Schema({
    nodes,
    marks,
  })
}
