import { configure } from 'mobx'

const settings = { enforceActions: 'observed' as 'observed' }

export const confMobx = () => configure(settings)
