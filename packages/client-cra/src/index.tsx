import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'mobx-react'

import { Stores } from './stores'
import { confMobx } from './stores/mobxConf'

import { Routes } from './routes'
import { Toaster } from './components/Toaster'

import './index.css'

export const stores = new Stores()

confMobx()

const container = document.getElementById('root')
const root = createRoot(container as HTMLElement)
root.render(
  <Provider {...stores}>
    <Routes />
    <Toaster />
  </Provider>
)
