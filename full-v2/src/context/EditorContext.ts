import { createContext, useContext } from 'react'

import { IProviders, createDefaultProviders } from './Providers'

export type EditorContext = IProviders

export const ReactEditorContext = createContext<EditorContext>(createDefaultProviders())

export const useEditorContext = () => useContext(ReactEditorContext)
