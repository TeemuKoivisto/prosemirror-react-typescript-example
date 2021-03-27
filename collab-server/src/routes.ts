import express, { Router } from 'express'

import * as documentCtrl from './routes/doc/document.ctrl'
import * as docEventCtrl from './routes/doc_events/doc-event.ctrl'

const router: Router = Router()

router.get('/docs', documentCtrl.getDocuments)
router.post('/doc', documentCtrl.createDocument)
router.get('/doc/:documentId', documentCtrl.getDocument)
router.put('/doc/:documentId', documentCtrl.updateDocument)
router.delete('/doc/:documentId', documentCtrl.deleteDocument)

router.get('/doc/:documentId/events', docEventCtrl.getDocumentEvents)
router.post('/doc/:documentId/events', docEventCtrl.saveCollabSteps)

export default router
