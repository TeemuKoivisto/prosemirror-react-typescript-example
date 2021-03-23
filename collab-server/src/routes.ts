import express, { Router } from 'express'

import * as documentCtrl from './routes/document/document.ctrl'

const router: Router = Router()

router.get('/docs', documentCtrl.getDocuments)
router.get('/doc/:documentId', documentCtrl.getDocument)
router.get('/doc/:documentId/events', documentCtrl.getDocumentEvents)
router.post('/doc/:documentId/events', documentCtrl.saveCollabSteps)

export default router
