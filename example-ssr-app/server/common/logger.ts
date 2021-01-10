import * as winston from 'winston'
import { config } from './config'

let logFormat
// Add colors in local environment
if (config.ENV === 'production') {
  logFormat = winston.format.combine(
    winston.format.json()
  )
} else {
  logFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.simple(),
  )
}

export const log: winston.Logger = winston.createLogger({
  level: config.LOG.LEVEL,
  format: logFormat,
  transports: [
    new winston.transports.Console({
      level: config.LOG.LEVEL,
    }),
  ],
  exitOnError: false
})

export const logStream = {
  write: (message: string) => { log.info(message) }
}
