import express, { Router } from 'express'

import * as ssrCtrl from './react-ssr.ctrl'

const router: Router = Router()

router.use('', express.static('./client-dist'))

router.get('/*', ssrCtrl.ssrReactApp)

export default router