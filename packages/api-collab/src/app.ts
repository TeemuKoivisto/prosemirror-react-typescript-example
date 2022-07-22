import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

import routes from './routes'

import { errorHandler, logStream, config } from './common'

const app = express()

const corsOptions: cors.CorsOptions = {
  origin(origin, callback) {
    callback(null, true)
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}

app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// By adding this route before morgan prevents it being logged which in production setting
// is annoying and pollutes the logs with gazillion "GET /health" lines
app.get('/health', (req: any, res: any) => { res.sendStatus(200) })

app.use(morgan('short', { stream: logStream }))

app.use('', routes)
app.use(errorHandler)

export { app }
