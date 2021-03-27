import { app } from './app'
import { config, log } from './common'
import { socketIO } from './socketIO'

const server = app.listen(config.PORT, () => {
  log.info(`App started at port: ${config.PORT}`)
})

socketIO.start(server)

process.on('exit', () => {
  socketIO.stop()
  log.info('Shutting down server')
})
