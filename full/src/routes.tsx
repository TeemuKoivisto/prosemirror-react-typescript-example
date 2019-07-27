import * as React from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'

import { FrontPage } from './pages/FrontPage'

export const Routes = () : React.ReactElement<any> => (
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <Switch>
      <Route exact path="/" component={FrontPage}/>
      <Redirect to="/" />
    </Switch>
  </BrowserRouter>
)
