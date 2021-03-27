import * as React from 'react'
import { render } from 'react-dom'
import { Provider } from 'mobx-react'

import { Stores } from './stores'
import { confMobx } from './stores/mobxConf'

import { Routes } from './routes'
import { Toaster } from './components/Toaster'

import './index.css'

export const stores = new Stores()

confMobx()

render(
  <Provider {...stores}>
    <Routes />
    <Toaster />
  </Provider>,
  document.getElementById('root')
)
