import { action, observable } from 'mobx'

import { IUser, uuidv4 } from '@pm-react-example/shared'

export class AuthStore {

  @observable user?: IUser = undefined
  resetAllStores: () => void
  STORAGE_KEY = 'full-user'

  constructor(resetFn: () => void) {
    this.resetAllStores = resetFn
    if (typeof window === 'undefined') return
    const existing = sessionStorage.getItem(this.STORAGE_KEY)
    if (existing && existing !== null && existing.length > 0) {
      this.user = JSON.parse(existing)
    } else {
      const id = uuidv4()
      this.user = {
        id,
        name: `User ${id.substring(0, 5)}`
      }
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.user))
    }
  }

  @action reset() {
    this.user = undefined
  }

  @action logout = () => {
    this.resetAllStores()
  }
}
