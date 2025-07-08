import express from 'express';
import { addNewPurchase } from '../controllers/sellerController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Only logged-in sellers can add purchase
router.post('/new-purchase', verifyToken, addNewPurchase);

export default router;
