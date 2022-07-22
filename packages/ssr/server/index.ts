import { app } from './app'
import { config, log } from './common'

app.listen(config.PORT, () => {
  log.info(`App started at port: ${config.PORT}`)
})

process.on('exit', () => {
  log.info('Shutting down server')
})
