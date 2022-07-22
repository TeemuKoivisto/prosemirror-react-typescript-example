import { startMeasure, stopMeasure } from './measure'

export interface AnalyticsProps {
  shouldTrack?: boolean
  logToConsole?: boolean
  logLevel?: 'debug' | 'info' | 'warn' | 'error'
}
export enum LOG_LEVEL {
  debug = 'debug',
  info = 'info',
  warn = 'warn',
  error = 'error',
}

export class AnalyticsProvider {

  shouldTrack: boolean = false
  logToConsole: boolean = false
  logLevel: LOG_LEVEL = LOG_LEVEL.error

  logs: {
    [namespace: string]: {
      [key: string]: {
        logs: string[],
        level: LOG_LEVEL,
        pending: boolean
      }
    }
  } = {}

  perf = {
    debug: (namespace: string, method: string) => {
      if (this.hasLevel(LOG_LEVEL.debug)) {
        this.measure(namespace, method, LOG_LEVEL.debug)
      }
    },
    info: (namespace: string, method: string) => {
      if (this.hasLevel(LOG_LEVEL.info)) {
        this.measure(namespace, method, LOG_LEVEL.info)
      }
    },
    warn: (namespace: string, method: string) => {
      if (this.hasLevel(LOG_LEVEL.warn)) {
        this.measure(namespace, method, LOG_LEVEL.warn)
      }
    },
    error: (namespace: string, method: string) => {
      if (this.hasLevel(LOG_LEVEL.error)) {
        this.measure(namespace, method, LOG_LEVEL.error)
      }
    },
    stop: (namespace: string, method: string, durationThreshold: number = 0) => {
      this.stopMeasure(namespace, method, durationThreshold)
    }
  }

  constructor(props: AnalyticsProps = {}) {
    const { shouldTrack, logToConsole, logLevel } = props
    if (shouldTrack) this.shouldTrack = shouldTrack
    if (logToConsole) this.logToConsole = logToConsole
    if (logLevel) {
      if (logLevel === 'debug') this.logLevel = LOG_LEVEL.debug
      else if (logLevel === 'info') this.logLevel = LOG_LEVEL.info
      else if (logLevel === 'warn') this.logLevel = LOG_LEVEL.warn
      else if (logLevel === 'error') this.logLevel = LOG_LEVEL.error
    }
  }

  hasLevel(level: LOG_LEVEL) {
    const lvl = this.logLevel
    switch (level) {
      case 'debug':
        return lvl === 'debug'
      case 'info':
        return lvl === 'debug' || lvl === 'info'
      case 'warn':
        return lvl === 'debug' || lvl === 'info' || lvl === 'warn'
      case 'error':
        return lvl === 'debug' || lvl === 'info' || lvl === 'warn' || lvl === 'error'
      default:
        return false
    }
  }

  startLog(namespace: string, method: string, level: LOG_LEVEL) {
    if (namespace in this.logs) {
      if (method in this.logs[namespace]) {
        this.logs[namespace][method].pending = true
      } else {
        this.logs[namespace][method] = {
          logs: [],
          level,
          pending: true
        }
      }
    } else {
      this.logs[namespace] = {
        [method]: {
          logs: [],
          level,
          pending: true
        }
      }
    }
  }

  endLog(namespace: string, method: string, msg: string) {
    if (namespace in this.logs) {
      if (method in this.logs[namespace]) {
        this.logs[namespace][method].pending = false
        this.logs[namespace][method].logs.push(msg)
        const lvl = this.logs[namespace][method].level
        if (lvl === 'debug') console.debug(msg)
        else if (lvl === 'info') console.info(msg)
        else if (lvl === 'warn') console.warn(msg)
        else if (lvl === 'error') console.error(msg)
      } else {
        throw Error(`Stopping measurement for namespace '${namespace}' with non-existent method: ${method}`)
      }
    } else {
      throw Error(`Stopping measurement for non-existent namespace: ${namespace}`)
    }
  }

  getName(namespace: string, method: string) {
    return `${namespace}::${method}`
  }

  measure(namespace: string, method: string, level: LOG_LEVEL) {
    if (this.shouldTrack && this.logToConsole) {
      this.startLog(namespace, method, level)
      startMeasure(this.getName(namespace, method))
    }
  }

  stopMeasure(namespace: string, method: string, durationThreshold: number = 0) {
    stopMeasure(this.getName(namespace, method), (duration, start) => {
      if (this.shouldTrack && this.logToConsole && durationThreshold <= duration) {
        const msg = `${this.getName(namespace, method)} took ${Math.round(duration)} ms`
        this.endLog(namespace, method, msg)
      }
    })
  }
}
