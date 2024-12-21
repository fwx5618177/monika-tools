import { Router } from 'express';
import { createPayment, getPayment } from '../controllers/paymentController';

const router = Router();

router.post('/payments', createPayment);
router.get('/payments/:id', getPayment);

export default router;
