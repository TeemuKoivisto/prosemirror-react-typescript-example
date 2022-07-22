import { action, observable, makeObservable } from 'mobx'

import { IToast, ToastLocation, ToastType } from '../types/toast'

export class ToastStore {
  @observable toasts: IToast[] = []
  @observable toasterLocation: ToastLocation = 'top-right'
  idCounter: number = 0

  constructor() {
    makeObservable(this)
  }

  @action reset() {
    this.toasts = []
  }

  @action setToasterLocation = (topRight?: boolean) => {
    if (topRight) {
      this.toasterLocation = 'top-right'
    } else {
      this.toasterLocation = 'bottom-left'
    }
  }

  @action createToast = (message: string, type: ToastType = 'success', duration: number = 5000) => {
    const newToast = {
      id: this.idCounter,
      message,
      type,
      duration
    }
    this.idCounter += 1
    this.toasts.push(newToast)
    if (this.toasts.length > 2) {
      this.toasts = this.toasts.slice(-2)
    }
  }
 
  @action removeToast = (id: number) => {
    this.toasts = this.toasts.filter(t => t.id !== id)
  }
}