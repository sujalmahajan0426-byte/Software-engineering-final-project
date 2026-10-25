import express from 'express';
import { sendMessage, getMessages, alertParent } from '../controllers/messageController.js';

const router = express.Router();

router.get('/', getMessages);
router.post('/', sendMessage);
router.post('/alert-parent', alertParent);

export default router;
