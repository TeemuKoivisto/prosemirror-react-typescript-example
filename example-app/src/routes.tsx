import * as React from 'react'
import { BrowserRouter, Redirect, Switch } from 'react-router-dom'

import { WrappedRoute } from './components/WrappedRoute'

import { FrontPage } from './pages/FrontPage'
import { MinimalPage } from './pages/MinimalPage'

export const Routes = () => (
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <Switch>
      <WrappedRoute exact path="/" component={FrontPage}/>
      <WrappedRoute exact path="/minimal" component={MinimalPage}/>
      <Redirect to="/" />
    </Switch>
  </BrowserRouter>
)
