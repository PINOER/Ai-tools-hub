import { Router } from 'express';
import { ToolTagController } from '../controllers/toolTag.controller.ts';
import { authMiddleware } from '../../../middleware/auth.middleware.ts';

const controller = new ToolTagController();
const router = Router();

router.post('/', authMiddleware, controller.create.bind(controller));
router.get('/', authMiddleware, controller.getAll.bind(controller));
router.get('/:tool_id/:tag_id', authMiddleware, controller.get.bind(controller));
router.put('/:tool_id/:tag_id', authMiddleware, controller.update.bind(controller));
router.delete('/:tool_id/:tag_id', authMiddleware, controller.delete.bind(controller));

export default router;
