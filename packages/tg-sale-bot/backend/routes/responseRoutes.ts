import { Router } from 'express';
import { createResponse, getResponse } from '../controllers/responseController';

const router = Router();

router.post('/responses', createResponse);
router.get('/responses/:id', getResponse);

export default router;
