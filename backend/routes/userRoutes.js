import express from 'express';
import { getUserPurchases } from '../controllers/purchaseController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET purchases for logged-in user
router.get('/purchases', verifyToken, getUserPurchases);

export default router;
