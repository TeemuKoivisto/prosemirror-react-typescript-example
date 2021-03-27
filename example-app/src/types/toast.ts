export type ToastType = 'success' | 'danger' | 'warning' | 'info'
export type ToastLocation = 'bottom-left' | 'top-right'

export interface IToast {
  id: number
  message: string
  type: ToastType
  duration: number
}
