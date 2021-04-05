import * as React from 'react'
import { BrowserRouter, Redirect, Switch } from 'react-router-dom'

import { WrappedRoute } from './components/WrappedRoute'

import { FrontPage } from './pages/FrontPage'
import { MinimalPage } from './pages/MinimalPage'
import { AtlassianPage } from './pages/AtlassianPage'
import { FullV1Page } from './pages/FullV1Page'

export const Routes = () => (
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <Switch>
      <WrappedRoute exact path="/" component={FrontPage}/>
      <WrappedRoute exact path="/minimal" component={MinimalPage}/>
      <WrappedRoute exact path="/atlassian" component={AtlassianPage}/>
      <WrappedRoute exact path="/fullv1" component={FullV1Page}/>
      <Redirect to="/" />
    </Switch>
  </BrowserRouter>
)
