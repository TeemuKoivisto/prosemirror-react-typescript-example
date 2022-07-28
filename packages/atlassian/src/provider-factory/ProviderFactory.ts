import { ProviderHandler, ProviderName, Providers, ProviderType } from './types'

function isUndefined(x: any): x is undefined {
  return x === undefined
}
export class ProviderFactory {
  private providers: Map<string, Promise<any>> = new Map()
  private subscribers: Map<string, ProviderHandler[]> = new Map()

  static create(
    providers: Providers & { [key: string]: Promise<any> | undefined }
  ): ProviderFactory {
    const providerFactory = new ProviderFactory()
    const keys = Object.keys(providers) as Array<ProviderName>
    keys.forEach((name) => {
      providerFactory.setProvider(name, providers[name])
    })
    return providerFactory
  }

  destroy() {
    this.providers.clear()
    this.subscribers.clear()
  }

  isEmpty(): boolean {
    return !this.providers.size && !this.subscribers.size
  }

  setProvider<T extends string>(name: T, provider?: ProviderType<T>): void {
    // Do not trigger notifyUpdate if provider is the same.
    if (this.providers.get(name) === provider) {
      return
    }

    if (!isUndefined(provider)) {
      this.providers.set(name, provider)
    } else {
      this.providers.delete(name)
    }

    this.notifyUpdated(name, provider)
  }

  removeProvider<T extends string>(name: T | ProviderName): void {
    this.providers.delete(name)
    this.notifyUpdated(name)
  }

  subscribe<T extends string>(name: T, handler: ProviderHandler<typeof name>): void {
    const handlers = this.subscribers.get(name) || []
    handlers.push(handler)

    this.subscribers.set(name, handlers)

    const provider = this.providers.get(name)

    if (provider) {
      handler(name as T, provider as ProviderType<T>)
    }
  }

  unsubscribe<T extends string>(name: T, handler: ProviderHandler<typeof name>): void {
    const handlers = this.subscribers.get(name)
    if (!handlers) {
      return
    }

    const index = handlers.indexOf(handler)

    if (index !== -1) {
      handlers.splice(index, 1)
    }

    if (handlers.length === 0) {
      this.subscribers.delete(name)
    } else {
      this.subscribers.set(name, handlers)
    }
  }

  unsubscribeAll<T extends string>(name: T | ProviderName): void {
    const handlers = this.subscribers.get(name)
    if (!handlers) {
      return
    }

    this.subscribers.delete(name)
  }

  hasProvider<T extends string>(name: T | ProviderName): boolean {
    return this.providers.has(name)
  }

  notifyUpdated<T extends string>(name: T, provider?: ProviderType<typeof name>): void {
    const handlers = this.subscribers.get(name)
    if (!handlers) {
      return
    }

    handlers.forEach((handler) => {
      handler(name, provider)
    })
  }
}
