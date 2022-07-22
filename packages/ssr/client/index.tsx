import * as React from 'react'
import { hydrate } from 'react-dom'

import { ClientRoutes } from './routes'

hydrate(
  <ClientRoutes/>,
  document.getElementById('root')
)
