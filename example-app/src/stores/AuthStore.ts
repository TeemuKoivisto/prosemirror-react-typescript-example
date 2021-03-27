import { action, observable } from 'mobx'

import { IUser, uuidv4 } from '@pm-react-example/shared'

export class AuthStore {

  @observable user?: IUser = undefined
  resetAllStores: () => void

  constructor(resetFn: () => void) {
    this.resetAllStores = resetFn
    const id = uuidv4()
    this.user = {
      id,
      name: `User ${id.substring(0, 5)}`
    }
  }

  @action reset() {
    this.user = undefined
  }

  @action logout = () => {
    this.resetAllStores()
  }
}
