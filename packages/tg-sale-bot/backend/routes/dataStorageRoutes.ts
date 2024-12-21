import { Router } from 'express';
import { createUser, getUser } from '../controllers/dataStorageController';

const router = Router();

router.post('/users', createUser);
router.get('/users/:id', getUser);

export default router;
