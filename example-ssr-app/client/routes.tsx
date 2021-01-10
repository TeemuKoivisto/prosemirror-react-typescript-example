import * as React from 'react'
import { BrowserRouter, StaticRouter, Redirect, Switch } from 'react-router-dom'

import { WrappedRoute } from './components/WrappedRoute'

import { FrontPage } from './pages/FrontPage'
import { MinimalPage } from './pages/MinimalPage'
import { AtlassianPage } from './pages/AtlassianPage'

const Routes = () => (
  <Switch>
    <WrappedRoute exact path="/" component={FrontPage}/>
    <WrappedRoute exact path="/minimal" component={MinimalPage}/>
    <WrappedRoute exact path="/atlassian" component={AtlassianPage}/>
    <Redirect to="/" />
  </Switch>
)

export const ClientRoutes = () => (
  <BrowserRouter>
    <Routes />
  </BrowserRouter>
)

export const ServerRoutes = (props: { url: string}) => (
  <StaticRouter location={props.url}>
    <Routes />
  </StaticRouter>
)
