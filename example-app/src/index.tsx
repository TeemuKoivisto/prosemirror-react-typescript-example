import * as React from 'react'
import { render } from 'react-dom'
import { Provider } from 'mobx-react'

import { Stores } from './stores'
import { confMobx } from './stores/mobxConf'

import { Routes } from './routes'

import './index.css'

export const stores = new Stores()

confMobx()

render(
  <Provider {...stores}>
    <Routes />
  </Provider>,
  document.getElementById('root')
)
