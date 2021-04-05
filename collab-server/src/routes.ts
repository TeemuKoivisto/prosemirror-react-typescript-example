import express, { Router } from 'express'

import * as documentCtrl from './routes/doc/document.ctrl'
import * as docCollabCtrl from './routes/doc_collab/doc-collab.ctrl'

const router: Router = Router()

router.get('/docs', documentCtrl.getDocuments)
router.post('/doc', documentCtrl.createDocument)
router.get('/doc/:documentId', documentCtrl.getDocument)
router.put('/doc/:documentId', documentCtrl.updateDocument)
router.delete('/doc/:documentId', documentCtrl.deleteDocument)

router.post('/doc/:documentId/join', docCollabCtrl.clientJoin)
router.post('/doc/:documentId/leave', docCollabCtrl.clientLeave)
// router.get('/doc/:documentId/events', docEventCtrl.getDocumentEvents)
router.post('/doc/:documentId/steps', docCollabCtrl.saveSteps)

export default router
