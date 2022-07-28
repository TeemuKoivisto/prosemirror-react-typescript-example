import * as React from 'react'
import { BrowserRouter, Navigate, Route, Routes as RouterRoutes } from 'react-router-dom'
import { StaticRouter } from 'react-router-dom/server'

import { DefaultLayout } from './components/Layout'

import { FrontPage } from './pages/FrontPage'
import { MinimalPage } from './pages/MinimalPage'
import { AtlassianPage } from './pages/AtlassianPage'

const Routes = () => (
  <RouterRoutes>
    <Route
      path="/"
      element={
        <DefaultLayout>
          <FrontPage />
        </DefaultLayout>
      }
    />
    <Route
      path="/minimal"
      element={
        <DefaultLayout>
          <MinimalPage />
        </DefaultLayout>
      }
    />
    <Route
      path="/atlassian"
      element={
        <DefaultLayout>
          <AtlassianPage />
        </DefaultLayout>
      }
    />
    <Route path="*" element={<Navigate replace to="/" />} />
  </RouterRoutes>
)

export const ClientRoutes = () => (
  <BrowserRouter>
    <Routes />
  </BrowserRouter>
)

export const ServerRoutes = (props: { url: string }) => (
  <StaticRouter location={props.url}>
    <Routes />
  </StaticRouter>
)
