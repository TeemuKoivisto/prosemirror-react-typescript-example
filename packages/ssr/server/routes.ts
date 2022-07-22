import express, { Router } from 'express'

import * as ssrCtrl from './routes/ssr/ssr.ctrl'

const router: Router = Router()

router.use('', express.static('./client-dist'))

router.get('/raw', ssrCtrl.ssrRawHtml)
router.get('/*', ssrCtrl.ssrReactApp)

export default router