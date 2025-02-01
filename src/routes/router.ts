import express from 'express';
import { create, get } from '../controllers/controller.ts';

const router = express.Router();

router.post('/create',create);
router.get('/get',get);

export default router;