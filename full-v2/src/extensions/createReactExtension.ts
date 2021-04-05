import { useEffect, useLayoutEffect, useMemo } from 'react'
import { Extension } from './Extension'

import { useEditorContext, EditorContext } from '@context'

export const createReactExtension = <T,>(Ext: new(ctx: EditorContext, props: T) => Extension<T>) => (props: T) => {
  const ctx = useEditorContext()
  const { extensionProvider } = ctx
  const extension = useMemo(() => new Ext(ctx, props), [])
  useLayoutEffect(() => {
    extensionProvider.register(extension)
    return () => {
      extensionProvider.unregister(extension)
    }
  }, [])
  useEffect(() => {
    extension.onPropsChanged(props)
  }, [props])
  return null
}
