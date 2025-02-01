import express from 'express';
import { createFAQ, getFAQs } from '../controllers/controller.ts';

const router = express.Router();

router.post('/create',createFAQ);
router.get('/get',getFAQs);

export default router;