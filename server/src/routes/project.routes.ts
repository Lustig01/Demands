import { Router } from 'express';
import * as projectController from '../controllers/project.controller';

import requestLineRoutes from './requestLine.routes';

const router = Router();

router.use('/:projectId/lines', requestLineRoutes);

router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProject);
router.post('/', projectController.createProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

export default router;
