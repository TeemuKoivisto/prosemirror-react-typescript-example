import { QuickInsertProvider } from './quick-insert-provider'

export interface Providers {
  quickInsertProvider?: Promise<QuickInsertProvider>
}

export type ProviderName = keyof Providers
export type ProviderType<T> = T extends keyof Providers ? Providers[T] : Promise<any>

export type ProviderHandler<T extends string = any> = (
  name: T,
  provider?: ProviderType<typeof name>
) => void
