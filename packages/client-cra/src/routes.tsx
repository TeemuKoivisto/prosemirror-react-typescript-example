import * as React from 'react'
import { BrowserRouter, Navigate, Route, Routes as RouterRoutes } from 'react-router-dom'

import { DefaultLayout } from './components/Layout'

import { FrontPage } from './pages/FrontPage'
import { MinimalPage } from './pages/MinimalPage'
import { AtlassianPage } from './pages/AtlassianPage'
import { FullV1Page } from './pages/FullV1Page'

export const Routes = () => (
  <BrowserRouter basename={process.env.PUBLIC_URL}>
  <RouterRoutes>
    <Route path="/" element={<DefaultLayout><FrontPage /></DefaultLayout>}/>
    <Route path="/minimal" element={<DefaultLayout><MinimalPage /></DefaultLayout>}/>
    <Route path="/atlassian" element={<DefaultLayout><AtlassianPage /></DefaultLayout>}/>
    <Route path="/full-v1" element={<DefaultLayout><FullV1Page /></DefaultLayout>}/>
    <Route path="*" element={<Navigate replace to="/" />} />
  </RouterRoutes>
  </BrowserRouter>
)
