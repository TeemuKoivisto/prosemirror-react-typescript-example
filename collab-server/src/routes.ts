import express, { Router } from 'express'

import * as documentCtrl from './routes/document/document.ctrl'

const router: Router = Router()

router.get('/doc/:documentId(\\d+)', documentCtrl.getDocument)
router.get('/doc/:documentId(\\d+)/events', documentCtrl.getDocumentEvents)
router.post('/doc/:documentId(\\d+)/events', documentCtrl.saveDocChanges)

export default router
