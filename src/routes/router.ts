import express from 'express';
import { create, get, update, deleteall, deleteone } from '../controllers/controller.ts';

const router = express.Router();

router.post('/create',create);
router.get('/get',get);
router.put('/update',update);
router.delete('/deleteall',deleteall);
router.delete('/deleteone',deleteone);

export default router;