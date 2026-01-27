import { Router } from 'express';
import * as requestLineController from '../controllers/requestLine.controller';

const router = Router({ mergeParams: true }); // Enable access to projectId from parent route

router.get('/', requestLineController.getProjectRequestLines);
router.post('/', requestLineController.createRequestLine);
router.put('/:id', requestLineController.updateRequestLine);
router.delete('/:id', requestLineController.deleteRequestLine);

export default router;
